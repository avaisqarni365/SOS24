/* Page editor: own sections and own questions per page, and the AI draft for them.
 * Usage: node backend/test/seiten.js
 */
const assert = require('assert');
const M = require('./mock');
const {ctx, sheets} = M;
const props = ctx.PropertiesService.getScriptProperties();

M.load('apps-script', ['Estimator.js', 'Shared.js', 'Code.js', 'Website.js']);
M.load('admin-script', ['Config.js', 'Belege.js', 'Termine.js', 'Admin.js', 'Medien.js', 'Social.js']);
ctx.setup();
M.seedAdminPw();
const token = ctx.login('shahzad', M.TEST_PW).token;
const api = (fn, ...args) => JSON.parse(JSON.stringify(ctx.api(token, fn, args)));

console.log('--- SOS ABDICHTUNG PAGE CONTENT TEST SUITE ---');
const PATH = '/kellersanierung/velbert/';
const TEXT = 'In Neviges steigt die Feuchte im Bruchstein auf. Der Putz platzt am Wandfuß ab.\n\n\n\nWir setzen eine Horizontalsperre von innen, ohne Aufgraben.';

// 1. Validation
assert.throws(() => api('api_pageSave', PATH, {sections: [{heading: '', text: TEXT}]}), /Abschnitt 1: bitte eine Überschrift/);
assert.throws(() => api('api_pageSave', PATH, {sections: [{heading: 'Neviges', text: 'zu kurz'}]}), /Abschnitt 1: der Text ist zu kurz/);
assert.throws(() => api('api_pageSave', PATH, {sections: Array(7).fill({heading: 'Neviges', text: TEXT})}), /Höchstens 6 eigene Abschnitte/);
assert.throws(() => api('api_pageSave', PATH, {sections: [{heading: 'Neviges', text: 'x'.repeat(2001)}]}), /höchstens 2000 Zeichen/);
assert.throws(() => api('api_pageSave', PATH, {faqs: [{q: 'Kurz?', a: 'Eine ausreichend lange Antwort.'}]}), /Frage 1: bitte die Frage ausschreiben/);
assert.throws(() => api('api_pageSave', PATH, {faqs: [{q: 'Was kostet die Messung in Velbert?', a: 'Nichts.'}]}), /Antwort ist zu kurz/);
assert.throws(() => api('api_pageSave', PATH, {faqs: Array(9).fill({q: 'Was kostet die Messung in Velbert?', a: 'Die Messung ist kostenlos und unverbindlich.'})}), /Höchstens 8 eigene Fragen/);
console.log('✓ [1/4] Sections and questions are checked before saving');

// 2. Save: plain text, empty entries dropped, stored in the two new columns
const saved = api('api_pageSave', PATH, {
  sections: [{heading: ' Keller in <b>Neviges</b> ', text: TEXT}, {heading: '', text: ''}],
  faqs: [{q: 'Sanieren Sie auch in Langenberg am Deilbach?', a: 'Ja.\nWir messen zuerst, ob Wasser drückt, und dichten dann von innen ab.'}, {q: ' ', a: ''}],
});
const page = saved.pages[PATH];
assert.deepStrictEqual(page.sections, [{heading: 'Keller in bNeviges/b', text: 'In Neviges steigt die Feuchte im Bruchstein auf. Der Putz platzt am Wandfuß ab.\n\nWir setzen eine Horizontalsperre von innen, ohne Aufgraben.'}]);
assert.deepStrictEqual(page.faqs, [{q: 'Sanieren Sie auch in Langenberg am Deilbach?', a: 'Ja. Wir messen zuerst, ob Wasser drückt, und dichten dann von innen ab.'}]);
assert.strictEqual(saved.dirty, true);
assert.deepStrictEqual(sheets['Seiten'].data[0].slice(8), ['Abschnitte', 'Fragen'], 'the header has the new columns');
assert.strictEqual(sheets['Seiten'].data.length, 2);
console.log('✓ [2/4] Saved as plain text in the sheet; empty entries are dropped');

// 3. Publish: sections become paragraphs, questions go out as they are
const calls = [];
ctx.UrlFetchApp.fetch = (url, opt) => {
  const method = (opt && opt.method || 'get').toLowerCase(), body = opt && opt.payload ? JSON.parse(opt.payload) : null;
  calls.push({url, method, body});
  const ok = d => ({getResponseCode: () => 200, getContentText: () => JSON.stringify(d)});
  if (/contents\/public\/media/.test(url)) return ok([]);
  if (/git\/blobs$/.test(url)) return ok({sha: 'BLOB'});
  if (/git\/ref\/heads/.test(url)) return ok({object: {sha: 'HEAD'}});
  if (/git\/commits\/HEAD$/.test(url)) return ok({tree: {sha: 'TREE'}});
  if (/git\/trees$/.test(url)) return ok({sha: 'NEWTREE'});
  if (/git\/commits$/.test(url)) return ok({sha: 'COMMIT'});
  return ok({});
};
props.setProperty('GITHUB_TOKEN', 'test-token');
api('api_pagesPublish');
const blob = calls.filter(c => /git\/blobs$/.test(c.url)).pop().body;
const published = JSON.parse(Buffer.from(blob.content, 'base64').toString('utf8'));
assert.deepStrictEqual(published.pages[PATH], {
  sections: [{heading: 'Keller in bNeviges/b', paragraphs: ['In Neviges steigt die Feuchte im Bruchstein auf. Der Putz platzt am Wandfuß ab.', 'Wir setzen eine Horizontalsperre von innen, ohne Aufgraben.']}],
  faqs: [{q: 'Sanieren Sie auch in Langenberg am Deilbach?', a: 'Ja. Wir messen zuerst, ob Wasser drückt, und dichten dann von innen ab.'}],
});
// resetting removes the row
assert.strictEqual(Object.keys(api('api_pageSave', PATH, {}).pages).length, 0);
console.log('✓ [3/4] Published to pages.json as paragraphs and questions');

// 4. AI draft
assert.throws(() => api('api_aiPage', {path: '/admin/', kind: 'section', topic: 'Hangwasser'}), /Unbekannte Seite/);
assert.throws(() => api('api_aiPage', {path: PATH, kind: 'section', topic: ''}), /Stichwort/);
assert.throws(() => api('api_aiPage', {path: PATH, kind: 'section', topic: 'Hangwasser', name: 'Velbert'}), /GEMINI_API_KEY/);
props.setProperty('GEMINI_API_KEY', 'test-key');
let reply = '', asked = '';
ctx.UrlFetchApp.fetch = (url, opt) => {
  asked = JSON.parse(opt.payload).contents[0].parts[0].text;
  return {getResponseCode: () => 200, getContentText: () => JSON.stringify({candidates: [{content: {parts: [{text: reply}]}}]})};
};
reply = JSON.stringify({heading: '**Hangwasser** in Velbert-Mitte', text: 'Nach Regen ist die bergseitige Kellerwand nass, die talseitige bleibt trocken.\n\nWir dichten diese eine Wand von innen ab. Nur 99 € diese Woche.'});
let d = api('api_aiPage', {path: PATH, kind: 'section', topic: 'Hangwasser in Velbert-Mitte', name: 'Velbert'});
assert(asked.includes('Stadtseite „Kellersanierung Velbert“') && asked.includes('Thema: Hangwasser in Velbert-Mitte'));
assert.strictEqual(d.heading, 'Hangwasser in Velbert-Mitte');
assert(d.text.includes('\n\n'), 'two paragraphs survive');
assert.deepStrictEqual(d.warnings, ['enthält einen Preis oder eine Prozentangabe']);
reply = JSON.stringify({q: 'Muss für die Kellerabdichtung in Velbert aufgegraben werden?', a: 'Meist nicht. Wir dichten die Wand von innen ab; Garten und Einfahrt bleiben unberührt.'});
d = api('api_aiPage', {path: '/leistungen/kellersanierung/', kind: 'faq', topic: 'Aufgraben nötig?', name: 'Kellersanierung'});
assert(asked.includes('Leistungsseite „Kellersanierung“'));
assert.deepStrictEqual([d.kind, d.warnings.length], ['faq', 0]);
assert(d.q.endsWith('?') && d.a.startsWith('Meist nicht'));
reply = 'kein JSON';
assert.throws(() => api('api_aiPage', {path: PATH, kind: 'faq', topic: 'Garantie', name: 'Velbert'}), /nicht lesbar/);
assert.strictEqual(sheets['Seiten'].data.length, 1, 'a draft saves nothing');
console.log('✓ [4/4] AI draft for a section and a question, with warnings; nothing is saved');
console.log('--- ALL PAGE CONTENT TESTS PASSED ---');
