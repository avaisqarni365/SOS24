/* Abuse cases for the public Website API (backend/apps-script). Usage: node backend/test/security.js */
const assert = require('assert');
const M = require('./mock');
const {ctx, sheets, mails, calEvents} = M;

M.load('apps-script', ['Estimator.js', 'Shared.js', 'Code.js', 'Website.js']);
ctx.setup();

const post = b => ctx.doPost({postData: {contents: JSON.stringify(b)}});
const get = p => ctx.doGet({parameter: p});
const lead = (name, phone, email, extra) => post(Object.assign({
  action: 'lead', consent: true, t: 9000, lang: 'de',
  contact: {name, phone, email, channel: 'whatsapp', note: 'Feuchte Kellerwand'}
}, extra || {}));
const jpg = Buffer.from([0xff, 0xd8, 0xff, 0xe0, 1, 2, 3, 4, 0xff, 0xd9]).toString('base64');

const victim = lead('Erika Muster', '0170 1111111', 'erika@example.de');
assert(victim.ok && victim.id === 'A-1001' && victim.up, 'victim lead: ' + JSON.stringify(victim));

// 1. The portal answers only with the lead's own token.
assert(get({action: 'portal', id: victim.id, k: victim.up}).ok, 'owner can open the portal');
for (const k of ['', 'x', victim.up.slice(0, 31), victim.up + '0']) {
  const r = get({action: 'portal', id: victim.id, k});
  assert(!r.ok && r.error === 'not_found', 'portal with k=' + JSON.stringify(k) + ' leaked: ' + JSON.stringify(r));
}
console.log('✓ [1/7] portal: no data without the right token');

// 2. Nobody signs a contract for someone else.
mails.length = 0;
const forged = post({action: 'sign', id: victim.id, k: '', signer: 'Mallory', signature: 'data:image/png;base64,' + jpg});
assert(!forged.ok && forged.error === 'not_found', 'sign without token: ' + JSON.stringify(forged));
const status = sheets['Anfragen'].data[1][2];
assert.notStrictEqual(status, 'Gebucht', 'lead was marked as booked by a stranger');
assert.strictEqual(mails.length, 0, 'no order confirmation mailed for a forged signature');
console.log('✓ [2/7] sign: rejected without the lead token');

// 3. Photo upload needs the token.
for (const k of [undefined, '', 'wrong']) {
  const r = post({action: 'photos', id: victim.id, k, images: [{type: 'image/jpeg', data: jpg}]});
  assert(!r.ok && r.error === 'token', 'photos with k=' + JSON.stringify(k) + ': ' + JSON.stringify(r));
}
assert(post({action: 'photos', id: victim.id, k: victim.up, images: [{type: 'image/jpeg', data: jpg}]}).ok, 'owner can upload');
console.log('✓ [3/7] photos: rejected without the lead token');

// 4. A booking that names someone else's lead gets its own lead, and never their token.
const day = ctx.freeSlots_('visit').filter(d => d.slots.length)[0];
const hijack = post({action: 'booking', consent: true, t: 9000, booking: {
  type: 'visit', date: day.date, time: day.slots[0], name: 'Mallory', phone: '0170 2222222',
  email: 'mallory@example.de', address: '42103 Wuppertal', leadId: victim.id
}});
assert(hijack.ok, 'booking itself works: ' + JSON.stringify(hijack));
assert.notStrictEqual(hijack.lead, victim.id, 'booking was attached to the victim lead');
assert.notStrictEqual(hijack.up, victim.up, "booking returned the victim's token");
const own = post({action: 'booking', consent: true, t: 9000, booking: {
  type: 'visit', date: day.date, time: day.slots[1], name: 'Erika Muster', phone: '0170 1111111',
  email: 'erika@example.de', address: '42103 Wuppertal', leadId: victim.id, k: victim.up
}});
assert(own.ok && own.lead === victim.id, 'owner can book on their own lead: ' + JSON.stringify(own));
console.log('✓ [4/7] booking: joins a lead only with its token');

// 5. Only free slots can be booked.
const events = calEvents.length;
const bad = [
  {date: day.date, time: '03:00'},
  {date: '2020-01-06', time: '10:00'},
  {date: day.date, time: day.slots[0]} // taken by the booking above
];
for (const s of bad) {
  const r = post({action: 'booking', consent: true, t: 9000, booking: Object.assign({
    type: 'visit', name: 'Max', phone: '0170 3333333', email: 'max@example.de', address: '42103 Wuppertal'
  }, s)});
  assert(!r.ok && r.error === 'slot', 'booked ' + JSON.stringify(s) + ': ' + JSON.stringify(r));
}
assert.strictEqual(calEvents.length, events, 'no calendar event for a rejected slot');
console.log('✓ [5/7] booking: past, closed and taken slots rejected');

// 6. One address cannot be flooded, and nothing lands in the sheet as a formula.
let limited = null;
for (let i = 0; i < 8 && !limited; i++) {
  const r = lead('Spam ' + i, '', 'target@example.de');
  if (!r.ok) limited = r;
}
assert(limited && limited.error === 'limit', 'per-address limit never kicked in');
const inj = lead('Formel Test', '0170 4444444', 'formel@example.de', {
  contact: {name: 'Formel Test', phone: '0170 4444444', email: 'formel@example.de', channel: '=IMAGE("http://x")', note: 'x'},
  state: {ref: '=HYPERLINK("http://x")', f1: {from: '42103 Wuppertal', to: 'Keller', km: '10', dateMode: 'flex', hh: 0},
    acc: {old: {floor: 0, lift: 0, park: 0}, 'new': {floor: 0, lift: 0, park: 0}}, inv: {}, customs: [], src: {}}
});
assert(inj.ok, 'lead with odd fields still accepted: ' + JSON.stringify(inj));
const formulas = [];
for (const [tab, sh] of Object.entries(sheets)) sh.data.forEach(r => r.forEach(v => { if (typeof v === 'string' && /^[=+@]/.test(v) && !/^=MAX\(|^=Q\*R$/.test(v)) formulas.push(tab + ': ' + v); }));
assert.deepStrictEqual(formulas, [], 'formulas written to the sheet');
ctx.hit_({p: '/', s: '=IMAGE("http://x")|x', d: 'Handy'});
ctx.flushHits();
const visits = (sheets['Besuche'] || {data: []}).data.flat().filter(v => typeof v === 'string' && /^=/.test(v));
assert.deepStrictEqual(visits, [], 'formula written to the visits tab');
console.log('✓ [6/7] limits per address, no formula injection');

// 7. The website's /admin asks with the back office login: same password, same lockout.
M.seedAdminPw();
assert.strictEqual(post({action: 'adminLogin', user: 'shahzad', pass: 'falsch-1234'}).error, 'login', 'wrong password refused');
const good = post({action: 'adminLogin', user: 'Shahzad', pass: M.TEST_PW});
assert(good.ok && good.name && !good.token, 'right password opens, nothing secret comes back: ' + JSON.stringify(good));
assert(!post({action: 'adminLogin', user: '', pass: M.TEST_PW}).ok, 'no username, no login');
for (let i = 0; i < 4; i++) post({action: 'adminLogin', user: 'shahzad', pass: 'falsch-' + i});
assert.strictEqual(post({action: 'adminLogin', user: 'shahzad', pass: 'falsch-x'}).error, 'locked', 'fifth wrong try locks');
assert.strictEqual(post({action: 'adminLogin', user: 'shahzad', pass: M.TEST_PW}).error, 'locked', 'locked even with the right password');
console.log('✓ [7/7] website admin login: back office password, lockout after five tries');

console.log('\nALL SECURITY TESTS PASSED SUCCESSFULLY!');
