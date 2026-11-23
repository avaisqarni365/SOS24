/* Overview "Heute", review requests and the AI post plan.
 * Usage: node backend/test/heute.js
 */
const assert = require('assert');
const M = require('./mock');
const {ctx, sheets, mails} = M;
const props = ctx.PropertiesService.getScriptProperties();

M.load('apps-script', ['Estimator.js', 'Shared.js', 'Code.js', 'Website.js']);
M.load('admin-script', ['Config.js', 'Belege.js', 'Termine.js', 'Admin.js', 'Medien.js', 'Social.js']);
ctx.setup();
M.seedAdminPw();
const token = ctx.login('shahzad', M.TEST_PW).token;
const api = (fn, ...args) => JSON.parse(JSON.stringify(ctx.api(token, fn, args)));

console.log('--- SOS ABDICHTUNG TODAY, REVIEWS & PLAN TEST SUITE ---');

const NOW = new Date();
const day = n => new Date(NOW.getTime() + n * 864e5);
const iso = d => d.toISOString().slice(0, 10);
const COLS = ctx.LEAD_COLS.length;
const lead = (id, received, status, name, phone, address, service) => { const r = Array(COLS).fill(''); r[0] = id; r[1] = received; r[2] = status; r[5] = name; r[6] = phone; r[9] = address || ''; r[10] = service || ''; sheets['Anfragen'].data.push(r); };
lead('A-3001', day(-1), 'Neu', 'Frau Neu', '0172 1112233');
lead('A-3002', day(-9), 'Erledigt', 'Herr Schmidt', '+49 171 5556677', 'Musterweg 3, 44787 Bochum', 'Kellerabdichtung von innen');
lead('A-3003', day(-20), 'Erledigt', 'Familie Kaya', '', 'Am Hang 9, 42103 Wuppertal', '');
lead('A-3004', day(-4), 'Gebucht', 'Herr Offen', '0201 123');
sheets['Protokoll'].data.push([day(-1), 'Shahzad', 'Anfragen', 'A-3002 · Status', 'Gebucht', 'Erledigt']);
sheets['Protokoll'].data.push([day(-12), 'Shahzad', 'Anfragen', 'A-3003 · Status', 'Gebucht', 'Erledigt']);

// 1. Review requests
let rv = api('api_reviews');
assert.deepStrictEqual(rv.items.map(x => x.id), ['A-3002', 'A-3003'], 'finished jobs only, newest first');
assert.deepStrictEqual([rv.open, rv.asked, rv.got], [2, 0, 0]);
assert.strictEqual(rv.link, 'https://g.page/r/CQzHYAe67UCTEBM/review');
assert(rv.items[0].wa.startsWith('https://wa.me/491715556677?text='), rv.items[0].wa);
assert.strictEqual(rv.items[1].wa, '', 'no phone: no WhatsApp link, but the text is there');
assert(rv.items[1].text.includes('Guten Tag Familie Kaya') && rv.items[1].text.includes(rv.link));
assert.strictEqual(rv.items[0].finished, iso(day(-1)));
// the text names the customer's town, region and job; the Wuppertal link only once it is entered
assert(rv.items[0].text.includes('Ihren Auftrag in Bochum!') && rv.items[0].text.includes('in Bochum und im Ruhrgebiet') && rv.items[0].text.includes('(Kellerabdichtung von innen)'), rv.items[0].text);
assert.deepStrictEqual([rv.items[0].town, rv.items[0].region, rv.items[1].town, rv.items[1].region], ['Bochum', 'essen', 'Wuppertal', 'wuppertal']);
assert(rv.items[1].text.includes('in Wuppertal und im Bergischen Land') && !/Remscheider/.test(rv.items[1].text));
assert(!/Sterne|5\s?★|fünf/i.test(rv.items[0].text) && /ganz offen/.test(rv.items[0].text), 'asks for an honest review, never for stars');
sheets['Konfiguration'].data.push(['review_link_wuppertal', 'https://g.page/r/TESTWUPPERTAL/review']);
assert(api('api_reviews').items.find(x => x.id === 'A-3003').text.includes('https://g.page/r/TESTWUPPERTAL/review'), 'own link for the Wuppertal profile');
assert(api('api_reviews').items.find(x => x.id === 'A-3002').text.includes(rv.link), 'Essen keeps its link');
sheets['Konfiguration'].data.pop();
rv = api('api_reviewMark', 'A-3002', 'asked', true);
assert.deepStrictEqual([rv.open, rv.asked, rv.got], [1, 1, 0]);
assert.deepStrictEqual(rv.items.map(x => x.id), ['A-3003', 'A-3002'], 'still open comes first');
// a customer from before the admin: the same message, and nothing is stored
const rvRows = sheets['Bewertungsanfragen'].data.length;
const dr = api('api_reviewDraft', ' Herr  Schmidt ', '0171 2223344', '45144 Essen', 'Horizontalsperre');
assert(dr.wa.startsWith('https://wa.me/491712223344?text='), dr.wa);
assert(dr.text.includes('Guten Tag Herr Schmidt,') && dr.text.includes('in Essen und im Ruhrgebiet') && dr.text.includes('(Horizontalsperre)') && dr.text.includes(rv.link), dr.text);
assert.strictEqual(api('api_reviewDraft', 'Frau Demir', '', '', '').wa, '', 'no phone: text only');
assert.throws(() => api('api_reviewDraft', '', '0171 2223344', '45144 Essen', ''), /Namen des Kunden/);
assert.strictEqual(sheets['Bewertungsanfragen'].data.length, rvRows, 'a draft stores nothing');
assert.strictEqual(rv.items[1].asked, iso(NOW));
rv = api('api_reviewMark', 'A-3003', 'got', true);
assert.deepStrictEqual([rv.open, rv.asked, rv.got], [0, 2, 1], 'a review received counts as asked');
rv = api('api_reviewMark', 'A-3002', 'asked', false);
assert.deepStrictEqual([rv.open, rv.asked], [1, 1], 'a tick can be taken back');
assert.strictEqual(sheets['Bewertungsanfragen'].data.length, 3, 'one row per enquiry, not one per click');
assert.throws(() => api('api_reviewMark', 'A-9999', 'asked', true), /nicht gefunden/);
assert.throws(() => api('api_reviewMark', 'A-3002', 'name', true), /Unbekanntes Feld/);
// the morning mail leaves out customers who were already asked
api('api_automationSet', 'reviews', true);
mails.length = 0;
assert.deepStrictEqual(Array.from(ctx.runAutomations_(NOW, {monday: false})), ['reviews']);
assert(mails.pop().body.includes('#bewertungen'));
assert.strictEqual(api('api_automations').items.find(i => i.key === 'reviews').last, iso(NOW), 'last run is remembered');
api('api_reviewMark', 'A-3002', 'asked', true);
assert.deepStrictEqual(Array.from(ctx.runAutomations_(NOW, {monday: false})), [], 'already asked: no reminder');
console.log('✓ [1/3] Review requests: list, WhatsApp link, ticks, no reminder twice');

// 2. Today
api('api_postSave', {topic: 'Heute fällig', date: iso(NOW), platforms: {facebook: 'Text', gbp: 'Text'}, done: {facebook: true}});
api('api_postSave', {topic: 'Überfällig', date: iso(day(-3)), platforms: {instagram: 'Text'}});
api('api_postSave', {topic: 'Erledigt', date: iso(day(-2)), platforms: {instagram: 'Text'}, done: {instagram: true}});
api('api_postSave', {topic: 'Später', date: iso(day(5)), platforms: {instagram: 'Text'}});
api('api_reviewMark', 'A-3002', 'asked', false);
let td = api('api_today');
assert.strictEqual(td.date, iso(NOW));
assert.deepStrictEqual(td.postsToday.map(p => [p.topic, p.open]), [['Heute fällig', ['Google-Unternehmensprofil']]]);
assert.deepStrictEqual(td.postsLate.map(p => p.topic), ['Überfällig']);
assert.strictEqual(td.leadsNew, 1);
assert.deepStrictEqual(td.leads.map(l => l.id), ['A-3001']);
assert.strictEqual(td.reviewsOpen, 1);
assert.deepStrictEqual([td.autosOn, td.autosAll], [1, 3]);
assert(Array.isArray(td.apptsToday) && Array.isArray(td.apptsTomorrow));
console.log('✓ [2/3] Today: due and overdue posts, new enquiries, open review requests');

// 3. AI plan
assert.throws(() => api('api_aiPlan', {count: 3}), /GEMINI_API_KEY/);
props.setProperty('GEMINI_API_KEY', 'test-key-123');
let reply = '', asked = '';
ctx.UrlFetchApp.fetch = (url, opt) => {
  asked = JSON.parse(opt.payload).contents[0].parts[0].text;
  return {getResponseCode: () => 200, getContentText: () => JSON.stringify({candidates: [{content: {parts: [{text: reply}]}}]})};
};
reply = JSON.stringify([
  {topic: '**Salzausblühungen** am Kellersockel erkennen', text: 'Woran man sie erkennt. Foto: weiße Ränder am Putz.'},
  {topic: 'Aktion: 20 % Rabatt', text: 'Nur diese Woche'},
  {topic: 'x'},
  {topic: 'Ablauf der Feuchtemessung', text: 'Drei Schritte. Video vom Messgerät.'},
  {topic: 'Zu viel', text: 'wird abgeschnitten'},
]);
let plan = api('api_aiPlan', {count: 3, focus: 'Winter'});
assert(asked.includes('Plane 3 Beiträge') && asked.includes('Schwerpunkt des Inhabers: Winter') && asked.includes('- Heute fällig'), 'count, focus and existing topics are sent');
assert.deepStrictEqual(plan.ideas.map(i => i.topic), ['Salzausblühungen am Kellersockel erkennen', 'Aktion: 20 % Rabatt', 'Ablauf der Feuchtemessung'], 'cleaned, too short dropped, cut to the count');
assert.deepStrictEqual(plan.ideas[1].warnings, ['enthält einen Preis oder eine Prozentangabe']);
assert.deepStrictEqual(plan.ideas[0].warnings, []);
plan.ideas.forEach(i => { assert(/^\d{4}-\d{2}-\d{2}$/.test(i.date) && i.date > iso(NOW)); assert([1, 3, 5].includes(new Date(i.date + 'T00:00:00Z').getUTCDay()), 'Mon, Wed or Fri: ' + i.date); });
assert.strictEqual(new Set(plan.ideas.map(i => i.date)).size, 3);
reply = 'Hier sind Ideen: keine Liste';
assert.throws(() => api('api_aiPlan', {count: 3}), /nicht lesbar/);
const before = api('api_posts').posts.length;
assert.throws(() => api('api_postsAdd', []), /mindestens ein Thema/);
assert.throws(() => api('api_postsAdd', Array(13).fill({topic: 'Thema'})), /Höchstens 12/);
const added = api('api_postsAdd', [plan.ideas[0], plan.ideas[2]]);
assert.strictEqual(added.added.length, 2);
assert.strictEqual(added.posts.length, before + 2);
const p = added.posts.find(x => x.id === added.added[0]);
assert.deepStrictEqual([p.topic, p.date, p.status, Object.keys(p.platforms).length], ['Salzausblühungen am Kellersockel erkennen', plan.ideas[0].date, 'Geplant', 0]);
console.log('✓ [3/3] AI plan: ideas with dates and warnings, saved only when picked');
console.log('--- ALL TODAY, REVIEWS & PLAN TESTS PASSED ---');
