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
console.log('✓ [1/7] admin over HTTP: nothing without the login');

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
console.log('✓ [2/7] admin over HTTP: real enquiries, status change');

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
console.log('✓ [3/7] website content: saved, https only, no formulas');

// 4. The public feed shows only what is visible, newest first.
const pub = content();
assert(pub.ok && pub.social.instagram, 'public channels');
assert.deepStrictEqual(pub.news.map(n => n.date), ['2026-10-26', '2026-10-20'], 'drafts hidden, newest first');
assert.strictEqual(pub.reviews.length, 1, 'review published');
console.log('✓ [4/7] public content feed: visible entries only');

// 5. Photos from the admin and the price list for quotes.
const png = Buffer.from([0x89, 0x50, 0x4e, 0x47, 1, 2, 3]).toString('base64');
const call = (fn, ...args) => admin({action: 'api', token: login.token, fn, args});
assert(!admin({action: 'api', token: '', fn: 'api_photos', args: []}).ok, 'photos need the login');
assert(!call('api_photoUpload', 'A-9999', [{type: 'image/png', data: png}]).ok, 'unknown enquiry refused');
assert(!call('api_photoUpload', lead.id, [{type: 'text/html', data: png}]).ok, 'non-images refused');
const up = call('api_photoUpload', lead.id, [{type: 'image/png', data: png}, {type: 'image/jpeg', data: png}]);
assert(up.ok && up.data.photos.length === 2, 'two photos saved: ' + JSON.stringify(up));
const folders = call('api_photos');
assert(folders.ok && folders.data.folders.some(f => f.lead === lead.id && f.count === 2), 'folder summary lists the enquiry');
assert(!call('api_photos', '../etc').ok, 'only enquiry numbers as folder names');
const rates = call('api_rateList');
assert(rates.ok && rates.data.some(r => r.key === 'horizontalsperre_m' && r.price > 0) && !rates.data.some(r => r.key === 'min_price'), 'price list for the quote builder');
console.log('✓ [5/7] photos (list, upload, checks) and price list');

// 6. Upserts: enquiries and appointments created and changed in the admin.
const made = call('api_leadCreate', {name: 'Telefon Kunde', phone: '0171 5555555', address: 'Hauptstr. 1, 44787 Bochum', service: 'Schimmelbeseitigung', channel: 'Telefon'});
assert(made.ok && /^A-\d+$/.test(made.data.id), 'enquiry created: ' + JSON.stringify(made));
const nextSite = site({action: 'lead', consent: true, t: 9000, lang: 'de', contact: {name: 'Web Kunde', phone: '0170 7777777', email: 'web@example.de', channel: 'whatsapp', note: 'x'}});
assert(nextSite.ok && nextSite.id !== made.data.id && Number(nextSite.id.slice(2)) > Number(made.data.id.slice(2)), 'website and admin never share a number: ' + made.data.id + ' / ' + nextSite.id);
assert(!call('api_leadCreate', {name: '', phone: '1'}).ok && !call('api_leadCreate', {name: 'Nur Name'}).ok, 'name and a contact are required');
const edited = call('api_leadEdit', made.data.id, {phone: '0171 6666666', address: 'Neue Str. 2, 44787 Bochum', name: '=HACK()'});
assert(edited.ok && edited.data.phone === '0171 6666666' && edited.data.from === 'Neue Str. 2, 44787 Bochum' && !/^=/.test(edited.data.name), 'customer data edited, no formula');
let day = new Date(Date.now() + 864e5 * 7);
while (day.getDay() !== 2) day = new Date(day.getTime() + 864e5);
const tue = day.toISOString().slice(0, 10);
const appt = call('api_apptCreate', {lead: made.data.id, type: 'visit', date: tue, time: '10:00'});
assert(appt.ok && appt.data.status === 'Bestätigt' && appt.data.name === edited.data.name && appt.data.address.indexOf('Neue Str.') === 0, 'appointment from the enquiry: ' + JSON.stringify(appt));
assert(/belegt/.test(call('api_apptCreate', {name: 'X', type: 'visit', date: tue, time: '10:30'}).error), 'overlapping slot refused');
assert(/Geschäftszeiten/.test(call('api_apptCreate', {name: 'X', type: 'call', date: tue, time: '21:00'}).error), 'outside opening hours refused');
const a2 = call('api_apptCreate', {name: 'Y', type: 'call', date: tue, time: '12:00'});
assert(a2.ok && Number(a2.data.nr.slice(2)) === Number(appt.data.nr.slice(2)) + 1, 'appointment numbers continue');
console.log('✓ [6/7] upserts: enquiries and appointments, unique numbers, clash checks');

// 7. Upsells: optional quote lines are shown, not counted, and stay out of the invoice.
const ql = [['Horizontalsperre', 'Injektion', 10, 'lfm', 135, false], ['Klimaplatten', 'Wärmebrücke', 12, 'm²', 95, true]];
const sq = call('api_saveQuote', made.data.id, ql);
assert(sq.ok && sq.data.total === 1350, 'option not in the quote total: ' + JSON.stringify(sq.data));
const back = call('api_lead', made.data.id);
assert(back.ok && back.data.quote.lines.length === 2 && back.data.quote.lines[1][5] === true && back.data.quote.lines[1][0] === 'Klimaplatten', 'option flag read back');
const offerNr = call('api_docNew', 'offer', made.data.id).data;
const offer = call('api_doc', offerNr).data;
assert(offer.rawDoc.lines.some(l => l.opt) && Math.abs(offer.doc.gross - 1350) < 0.01, 'quote document: option shown, total without it (' + offer.doc.gross + ')');
const invNr = call('api_docCopy', offerNr, 'invoice').data;
const inv = call('api_doc', invNr).data;
assert(inv.rawDoc.lines.length === 1 && !inv.rawDoc.lines.some(l => l.opt), 'invoice copy leaves the option out');
const html = call('api_docPreview', offer.rawDoc).data;
assert(/Optionale Zusatzleistungen/.test(html) && /Klimaplatten/.test(html), 'printed quote lists the options');
console.log('✓ [7/7] upsells: optional lines shown, never counted, not invoiced');

console.log('\nALL WEBSITE CONTENT TESTS PASSED SUCCESSFULLY!');
