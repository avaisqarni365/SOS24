/* Social media hub and AI helper (backend/admin-script/Social.js).
 * Usage: node backend/test/social.js
 */
const assert = require('assert');
const M = require('./mock');
const {ctx, sheets} = M;

M.load('apps-script', ['Estimator.js', 'Shared.js', 'Code.js', 'Website.js']);
M.load('admin-script', ['Config.js', 'Belege.js', 'Termine.js', 'Admin.js', 'Medien.js', 'Social.js']);
ctx.setup();
M.seedAdminPw();
const token = ctx.login('shahzad', M.TEST_PW).token;
const api = (fn, ...args) => JSON.parse(JSON.stringify(ctx.api(token, fn, args)));
const props = ctx.PropertiesService.getScriptProperties();

console.log('--- SOS ABDICHTUNG SOCIAL & AI TEST SUITE ---');

// 1. Posts: create, validate, status, order, delete
assert.throws(() => ctx.api('x', 'api_posts'), /LOGIN/);
assert.deepStrictEqual(api('api_posts').posts, []);
assert.strictEqual(api('api_posts').ai, false, 'no key yet');
assert.throws(() => api('api_postSave', {topic: 'x'}), /Thema eintragen/);
assert.throws(() => api('api_postSave', {topic: 'Keller', date: '19.11.2026'}), /Datum ungültig/);
assert.throws(() => api('api_postSave', {topic: 'Keller', platforms: {gbp: 'x'.repeat(1501)}}), /Google-Unternehmensprofil: höchstens 1500/);
assert.throws(() => api('api_postSave', {topic: 'Keller', media: ['nope']}), /nicht \(mehr\) in der Mediathek/);
assert.throws(() => api('api_postSave', {topic: 'Keller', link: 'https://evil.example/x'}), /Adresse von sos-abdichtung\.de/);

const img = api('api_mediaUpload', [{name: 'a.jpg', type: 'image/jpeg', data: Buffer.alloc(200, 1).toString('base64'), w: 800, h: 600}]).items[0];
let r = api('api_postSave', {topic: 'Feuchter Keller in Essen', text: 'Zeile 1\n\n\n\nZeile 2 <b>', media: [img.id], link: 'https://sos-abdichtung.de/kellersanierung/essen/',
  platforms: {facebook: 'Text für Facebook', instagram: '', gbp: '=Formel'}});
assert.strictEqual(r.id, 'B-1');
let p = r.posts[0];
assert.strictEqual(p.status, 'Entwurf', 'no date yet');
assert.strictEqual(p.text, 'Zeile 1\n\nZeile 2 b', 'markup removed, blank lines tidied');
assert.deepStrictEqual(Object.keys(p.platforms), ['facebook', 'gbp'], 'empty platform texts are dropped');
assert.strictEqual(p.platforms.gbp, "'=Formel", 'a formula start is neutralised');

r = api('api_postSave', {id: 'B-1', topic: 'Feuchter Keller in Essen', date: '2026-12-01', platforms: {facebook: 'Text', gbp: 'Text'}, done: {facebook: true, tiktok: true}});
p = r.posts[0];
assert.strictEqual(p.status, 'Geplant'); assert.strictEqual(p.date, '2026-12-01');
assert.deepStrictEqual(p.done, {facebook: true}, 'only platforms with a text can be ticked');
r = api('api_postSave', {id: 'B-1', topic: 'Feuchter Keller in Essen', date: '2026-12-01', platforms: {facebook: 'Text', gbp: 'Text'}, done: {facebook: true, gbp: true}});
assert.strictEqual(r.posts[0].status, 'Veröffentlicht', 'all platforms ticked');
assert.throws(() => api('api_postSave', {id: 'B-99', topic: 'Keller'}), /nicht gefunden/);

api('api_postSave', {topic: 'Später', date: '2026-12-24'});
api('api_postSave', {topic: 'Früher', date: '2026-11-25'});
api('api_postSave', {topic: 'Ohne Datum'});
assert.deepStrictEqual(api('api_posts').posts.map(x => x.topic), ['Früher', 'Feuchter Keller in Essen', 'Später', 'Ohne Datum'], 'by date, undated last');
assert.strictEqual(api('api_postDelete', 'B-2').posts.length, 3);
assert.strictEqual(sheets['Beiträge'].data.length, 4, 'header + 3 posts');
console.log('✓ [1/3] Posts: validation, status from date and ticks, order, delete');

// 2. AI: needs a key, sends the rules, never puts the key in the URL
assert.throws(() => api('api_aiSocial', {topic: 'Feuchter Keller'}), /GEMINI_API_KEY/);
props.setProperty('GEMINI_API_KEY', 'test-key-123');
assert.strictEqual(api('api_posts').ai, true);
const sent = [];
let reply = null, status = 200;
ctx.UrlFetchApp.fetch = (url, opt) => {
  sent.push({url, opt, body: JSON.parse(opt.payload)});
  return {getResponseCode: () => status, getContentText: () => JSON.stringify({candidates: [{content: {parts: [{text: reply}]}}]})};
};
reply = JSON.stringify({
  facebook: '**Feuchter Keller?** Wir messen kostenlos. Nur 99 € diese Woche!\n\n#Essen #Kellersanierung',
  instagram: 'Nasse Wand im Keller? Link im Profil.\n#Essen #Keller',
  tiktok: '', youtube: 'Keller abdichten in Essen\n\nSo läuft die Sanierung ab.', gbp: 'Kostenlose Feuchtemessung vor Ort. TÜV geprüft.', xing: 'ignored',
});
let ai = api('api_aiSocial', {topic: 'Feuchter Keller in Essen', text: 'Messung kostenlos', link: 'https://sos-abdichtung.de/kellersanierung/essen/'});
assert.deepStrictEqual(Object.keys(ai.platforms).sort(), ['facebook', 'gbp', 'instagram', 'youtube'], 'only known platforms with a text');
assert(!ai.platforms.facebook.includes('**'), 'markdown removed');
assert(ai.platforms.facebook.includes('#Essen #Kellersanierung'), 'hashtags survive the clean-up');
assert.deepStrictEqual(ai.warnings.facebook, ['enthält einen Preis oder eine Prozentangabe']);
assert.deepStrictEqual(ai.warnings.gbp, ['erwähnt TÜV']);
assert.strictEqual(ai.warnings.instagram, undefined);
const call = sent[0];
assert(/models\/gemini-3\.5-flash-lite:generateContent$/.test(call.url), 'default model, no key in the URL: ' + call.url);
assert.strictEqual(call.opt.headers['x-goog-api-key'], 'test-key-123');
assert(/keine Preise/i.test(call.body.systemInstruction.parts[0].text) && /TÜV/.test(call.body.systemInstruction.parts[0].text), 'house rules are sent');
assert.strictEqual(call.body.generationConfig.responseMimeType, 'application/json');
assert(call.body.contents[0].parts[0].text.includes('Feuchter Keller in Essen'));

props.setProperty('GEMINI_MODEL', 'gemini-4-hydrogen');
reply = 'Text davor {"facebook":"Hallo aus Essen"} Text danach';
ai = api('api_aiSocial', {topic: 'Sockel abdichten'});
assert.deepStrictEqual(ai.platforms, {facebook: 'Hallo aus Essen'}, 'JSON is found inside surrounding text');
assert(/models\/gemini-4-hydrogen:generateContent$/.test(sent[sent.length - 1].url), 'model from the script property');
reply = 'kein json';
assert.throws(() => api('api_aiSocial', {topic: 'Sockel abdichten'}), /nicht lesbar/);
console.log('✓ [2/3] AI posts: key required and sent as header, rules sent, drafts cleaned and checked');

// 3. Replies and error messages
reply = 'Guten Tag Frau Meyer,\n\nvielen Dank für Ihre Nachricht.';
let rep = api('api_aiReply', {kind: 'lead', text: 'Mein Keller ist nass, was kostet das?', name: 'Frau Meyer'});
assert.strictEqual(rep.text, reply); assert.deepStrictEqual(rep.warnings, []);
assert(sent[sent.length - 1].body.contents[0].parts[0].text.includes('Stelle keine Diagnose aus der Ferne'));
reply = 'Danke, wir sind die Nr. 1 in Essen.';
rep = api('api_aiReply', {kind: 'review', text: 'Sehr zufrieden mit der Arbeit.', stars: 5});
assert.deepStrictEqual(rep.warnings, ['enthält einen Superlativ']);
api('api_aiReply', {kind: 'review', text: 'Leider unzuverlässig.', stars: 2});
assert(sent[sent.length - 1].body.contents[0].parts[0].text.includes('Die Bewertung ist kritisch'));
assert.throws(() => api('api_aiReply', {kind: 'review', text: ''}), /Text der Bewertung/);
status = 429; assert.throws(() => api('api_aiReply', {kind: 'lead', text: 'Hallo, bitte um Rückruf'}), /Kontingent/);
status = 404; assert.throws(() => api('api_aiReply', {kind: 'lead', text: 'Hallo, bitte um Rückruf'}), /GEMINI_MODEL/);
status = 403; assert.throws(() => api('api_aiReply', {kind: 'lead', text: 'Hallo, bitte um Rückruf'}), /abgelehnt/);
status = 200;
// rate limit: 60 calls per user and hour
const before = sent.length;
assert.throws(() => { for (let i = 0; i < 70; i++) api('api_aiReply', {kind: 'lead', text: 'Hallo, bitte um Rückruf'}); }, /Zu viele KI-Anfragen/);
assert(sent.length - before < 60, 'the limit stops further calls to Google');
console.log('✓ [3/3] AI replies: lead and review prompts, warnings, clear errors, hourly limit');
console.log('--- ALL SOCIAL & AI TESTS PASSED ---');
