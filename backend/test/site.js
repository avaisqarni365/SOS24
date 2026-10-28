/* The website's /admin over HTTP and the website content (channels, news, reviews).
 * Usage: node backend/test/site.js */
const assert = require('assert');
const M = require('./mock');
const {ctx} = M;

M.load('apps-script', ['Estimator.js', 'Shared.js', 'Code.js', 'Website.js']);
// both projects share one test context: keep each one's own HTTP entrance
const siteDoPost = ctx.doPost;
const siteDoGet = ctx.doGet;
M.load('admin-script', ['Config.js', 'Belege.js', 'Termine.js', 'Admin.js']);
const adminDoPost = ctx.doPost;
ctx.setup();
M.seedAdminPw();

const site = b => siteDoPost({postData: {contents: JSON.stringify(b)}});
const admin = b => adminDoPost({postData: {contents: JSON.stringify(b)}});
const content = () => siteDoGet({parameter: {action: 'content'}});

// 1. No session, no data.
for (const token of [undefined, '', 'x'.repeat(64)]) {
  const r = admin({action: 'api', token, fn: 'api_bootstrap', args: []});
  assert(!r.ok && r.error === 'login', 'api without a session: ' + JSON.stringify(r));
}
assert(!admin({action: 'login', user: 'shahzad', pass: 'falsch-123'}).ok, 'wrong password refused');
console.log('✓ [1/4] admin over HTTP: nothing without the login');

// 2. Login, then the real enquiries from the sheet.
const lead = site({action: 'lead', consent: true, t: 9000, lang: 'de', contact: {name: 'Erika Muster', phone: '0170 1111111', email: 'erika@example.de', channel: 'whatsapp', note: 'Feuchte Kellerwand'}});
assert(lead.ok, 'lead saved: ' + JSON.stringify(lead));
const login = admin({action: 'login', user: 'shahzad', pass: M.TEST_PW});
assert(login.ok && /^[0-9a-f]{64}$/.test(login.token), 'login gives a session token');
const boot = admin({action: 'api', token: login.token, fn: 'api_bootstrap', args: []});
assert(boot.ok && boot.data.leads.some(l => l.id === lead.id && l.name === 'Erika Muster'), 'bootstrap lists the real lead');
const upd = admin({action: 'api', token: login.token, fn: 'api_update', args: [lead.id, {status: 'In Arbeit'}]});
assert(upd.ok && upd.data.status === 'In Arbeit', 'status change saved: ' + JSON.stringify(upd));
assert(!admin({action: 'api', token: login.token, fn: 'eval', args: []}).ok, 'only api_ functions can be called');
console.log('✓ [2/4] admin over HTTP: real enquiries, status change');

// 3. Website content: saved in the sheet, only https links.
const saved = admin({action: 'api', token: login.token, fn: 'api_siteSave', args: [{
  social: {instagram: 'https://instagram.com/sosabdichtung', facebook: 'javascript:alert(1)', youtube: 'http://youtube.com/x'},
  news: [
    {kind: 'Aktuell', date: '2026-10-20', title: 'Keller in Essen trocken', text: 'Horizontalsperre in Rüttenscheid.', link: 'https://youtube.com/watch?v=abc', visible: true},
    {kind: 'Aktuell', date: '2026-10-25', title: 'Entwurf', text: 'Noch nicht fertig', visible: false},
    {kind: 'Aktuell', date: '2026-10-26', title: '=HYPERLINK("x")', text: 'Formel', visible: true},
  ],
  reviews: [{kind: 'Stimme', date: '2026-10-21', text: 'Pünktlich und sauber.', name: 'Familie K.', place: 'Bochum', stars: 9, visible: true}],
}]});
assert(saved.ok, 'content saved: ' + JSON.stringify(saved));
assert.strictEqual(saved.data.social.instagram, 'https://instagram.com/sosabdichtung');
assert(!saved.data.social.facebook && !saved.data.social.youtube, 'non-https links dropped');
assert.strictEqual(saved.data.news.length, 3, 'admin sees drafts too');
assert.strictEqual(saved.data.reviews[0].stars, 5, 'stars capped at 5');
assert(saved.data.news.every(n => !/^=/.test(n.title)), 'no formula in the sheet');
console.log('✓ [3/4] website content: saved, https only, no formulas');

// 4. The public feed shows only what is visible, newest first.
const pub = content();
assert(pub.ok && pub.social.instagram, 'public channels');
assert.deepStrictEqual(pub.news.map(n => n.date), ['2026-10-26', '2026-10-20'], 'drafts hidden, newest first');
assert.strictEqual(pub.reviews.length, 1, 'review published');
console.log('✓ [4/4] public content feed: visible entries only');

console.log('\nALL WEBSITE CONTENT TESTS PASSED SUCCESSFULLY!');
