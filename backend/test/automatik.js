/* Automations: weekly report, reminder for planned posts, reminder to ask for a review.
 * Usage: node backend/test/automatik.js
 */
const assert = require('assert');
const M = require('./mock');
const {ctx, sheets, mails} = M;

M.load('apps-script', ['Estimator.js', 'Shared.js', 'Code.js', 'Website.js']);
M.load('admin-script', ['Config.js', 'Belege.js', 'Termine.js', 'Admin.js', 'Medien.js', 'Social.js']);
ctx.setup();
M.seedAdminPw();
const token = ctx.login('shahzad', M.TEST_PW).token;
const api = (fn, ...args) => JSON.parse(JSON.stringify(ctx.api(token, fn, args)));

console.log('--- SOS ABDICHTUNG AUTOMATIONS TEST SUITE ---');

const NOW = new Date('2027-03-01T06:00:00Z');           // a Monday, far from the day the test runs
const day = n => new Date(NOW.getTime() + n * 864e5);
const iso = d => d.toISOString().slice(0, 10);
const COLS = ctx.LEAD_COLS.length;
const lead = (id, received, status, name, phone) => { const r = Array(COLS).fill(''); r[0] = id; r[1] = received; r[2] = status; r[5] = name; r[6] = phone; sheets['Anfragen'].data.push(r); };
lead('A-2001', day(-2), 'Neu', 'Frau Meyer', '0172 1112233');
lead('A-2002', day(-3), 'Erledigt', 'Herr Schmidt', '+49 171 5556677');
lead('A-2003', day(-30), 'Angebot raus', 'Familie Kaya', '');
lead('A-2004', day(-5), 'Erledigt', 'Herr Alt', '0201 123');
const audit = sheets['Protokoll'];
audit.data.push([day(-1), 'Shahzad', 'Anfragen', 'A-2002 · Status', 'Gebucht', 'Erledigt']);
audit.data.push([day(-4), 'Shahzad', 'Anfragen', 'A-2004 · Status', 'Gebucht', 'Erledigt']);
audit.data.push([day(-2), 'Shahzad', 'Anfragen', 'A-2001 · Notizen', '(Notiz)', '(Notiz geändert)']);
sheets['Besuche'].data.push(["'" + iso(day(-1)), '/', 'Google', 'Handy', 'DE', 12, 5], ["'" + iso(day(-20)), '/', 'Google', 'Handy', 'DE', 99, 40]);
api('api_postSave', {topic: 'Feuchter Keller in Essen', date: iso(NOW), platforms: {facebook: 'Text', gbp: 'Text'}, done: {facebook: true}});
api('api_postSave', {topic: 'Schon fertig', date: iso(NOW), platforms: {facebook: 'Text'}, done: {facebook: true}});
api('api_postSave', {topic: 'Nächste Woche Sockel', date: iso(day(3)), platforms: {instagram: 'Text'}});

// 1. Everything is off until the owner switches it on
let st = api('api_automations');
assert.deepStrictEqual(st.items.map(i => [i.key, i.on]), [['weekly', false], ['posts', false], ['reviews', false]]);
assert(st.to.includes('@'), 'office address shown');
mails.length = 0;
assert.deepStrictEqual(Array.from(ctx.runAutomations_(NOW, {monday: true})), [], 'nothing is sent while all are off');
assert.strictEqual(mails.length, 0);
assert.throws(() => api('api_automationSet', 'nope', true), /Unbekannte Automatik/);
console.log('✓ [1/4] Off by default: no mail without the owner switching it on');

// 2. Weekly report: only on Mondays, with the week's real numbers
api('api_automationSet', 'weekly', true);
assert.deepStrictEqual(Array.from(ctx.runAutomations_(NOW, {monday: false})), []);
assert.deepStrictEqual(Array.from(ctx.runAutomations_(NOW, {monday: true})), ['weekly']);
let m = mails.pop();
assert.strictEqual(m.to, st.to);
assert(/Wochenbericht \(3 neue Anfragen/.test(m.subject), m.subject);
assert(m.body.includes('Neue Anfragen: 3') && m.body.includes('A-2001 · Frau Meyer · Neu'), m.body);
assert(!m.body.includes('A-2003'), 'a month-old enquiry is not "new this week"');
assert(m.body.includes('Gebucht: 0 · Erledigt: 2'));
assert(m.body.includes('Website: 5 Besuche, 12 Seitenaufrufe'), 'only the last 7 days are counted');
assert(m.body.includes('Neu: 1 · In Arbeit: 0 · Angebot raus: 1'));
assert(m.body.includes('Geplante Beiträge: 3') && m.body.includes('Nächste Woche Sockel'));
console.log('✓ [2/4] Weekly report: Mondays only, counts match the sheet');

// 3. Planned posts: one mail on the day, only platforms that are still open
api('api_automationSet', 'weekly', false);
api('api_automationSet', 'posts', true);
mails.length = 0;
assert.deepStrictEqual(Array.from(ctx.runAutomations_(NOW, {monday: true})), ['posts']);
m = mails.pop();
assert(/1 Beitrag für heute geplant/.test(m.subject), m.subject);
assert(m.body.includes('Feuchter Keller in Essen') && m.body.includes('noch offen: Google-Unternehmensprofil'));
assert(!m.body.includes('Schon fertig') && !m.body.includes('Sockel'), 'finished and future posts are left out');
assert.deepStrictEqual(Array.from(ctx.runAutomations_(day(1), {monday: false})), [], 'no post planned tomorrow: no mail');
console.log('✓ [3/4] Post reminder: due today and still open only');

// 4. Review reminder: jobs finished yesterday, with a ready WhatsApp link
api('api_automationSet', 'posts', false);
api('api_automationSet', 'reviews', true);
mails.length = 0;
assert.deepStrictEqual(Array.from(ctx.runAutomations_(NOW, {monday: false})), ['reviews']);
m = mails.pop();
assert(/1 Kunde um Bewertung bitten/.test(m.subject), m.subject);
assert(m.body.includes('A-2002 · Herr Schmidt') && !m.body.includes('A-2004'), 'only yesterday’s job');
assert(m.body.includes('https://wa.me/491715556677?text='), 'number in international form: ' + m.body);
assert(decodeURIComponent(m.body.split('?text=')[1].split('\n')[0]).includes('https://g.page/r/CQzHYAe67UCTEBM/review'));
assert(m.body.includes('nicht nur die zufriedenen'));
assert.deepStrictEqual(Array.from(ctx.runAutomations_(day(3), {monday: false})), [], 'nothing finished the day before: no mail');
// test button
api('api_postSave', {topic: 'Heute wirklich', date: iso(new Date()), platforms: {gbp: 'Text'}});
let t = api('api_automationTest', 'posts');
assert.strictEqual(t.sent, true); assert(/^\[Test\] /.test(mails.pop().subject));
sheets['Beiträge'].data.length = 1;
t = api('api_automationTest', 'posts');
assert.strictEqual(t.sent, false); assert(/kein Beitrag geplant/.test(t.why));
assert.strictEqual(sheets['Protokoll'].data.filter(r => /eingeschaltet|ausgeschaltet/.test(String(r[5]))).length, 5, 'every switch is logged');
console.log('✓ [4/4] Review reminder: yesterday’s finished jobs, WhatsApp link, test button');
console.log('--- ALL AUTOMATION TESTS PASSED ---');
