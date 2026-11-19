/* Media library, page editor and publishing (backend/admin-script/Medien.js).
 * Usage: node backend/test/medien.js
 */
const assert = require('assert');
const M = require('./mock');
const {ctx, sheets, driveFolders} = M;

M.load('apps-script', ['Estimator.js', 'Shared.js', 'Code.js', 'Website.js']);
M.load('admin-script', ['Config.js', 'Belege.js', 'Termine.js', 'Admin.js', 'Medien.js']);
ctx.setup();
M.seedAdminPw();
const token = ctx.login('shahzad', M.TEST_PW).token;
assert(token, 'owner logs in');
const api = (fn, ...args) => JSON.parse(JSON.stringify(ctx.api(token, fn, args)));

console.log('--- SOS ABDICHTUNG MEDIA & PAGES TEST SUITE ---');

// 1. Nothing works without a session
assert.throws(() => ctx.api('x', 'api_mediaList'), /LOGIN/);
assert.throws(() => ctx.api('x', 'api_pagesPublish'), /LOGIN/);

// 2. Upload: images and a video are saved, other types and oversized files are skipped
const b64 = n => Buffer.alloc(n, 1).toString('base64');
const thumb = 'data:image/jpeg;base64,' + b64(200);
assert.strictEqual(api('api_mediaList').items.length, 0);
assert.throws(() => api('api_mediaUpload', []), /1 bis 10/);
assert.throws(() => api('api_mediaUpload', [{name: 'x.exe', type: 'application/x-msdownload', data: b64(10)}]), /Keine Datei gespeichert/);
const up = api('api_mediaUpload', [
  {name: 'Keller Rüttenscheid (1).JPG', type: 'image/jpeg', data: b64(500), w: 1600, h: 1200, thumb},
  {name: 'Sockel.png', type: 'image/png', data: 'data:image/png;base64,' + b64(300), w: 800, h: 600, thumb: '<script>'},
  {name: 'Baustelle.mp4', type: 'video/mp4', data: b64(900)},
  {name: 'virus.svg', type: 'image/svg+xml', data: b64(50)},
]);
assert.strictEqual(up.saved, 3);
assert.deepStrictEqual(up.skipped, ['virus.svg (Format)']);
assert.strictEqual(up.items.length, 3);
const folder = driveFolders['SOS Abdichtung - Website-Medien'];
assert(folder && folder.files.length === 3, 'files are in the media folder in Drive');
const jpg = up.items.find(i => i.type === 'image/jpeg'), png = up.items.find(i => i.type === 'image/png'), mp4 = up.items.find(i => i.type === 'video/mp4');
assert(/^keller-ruettenscheid-1-\d{4}-\d{2}-\d{2}\.jpg$/.test(jpg.name), 'URL-safe file name: ' + jpg.name);
assert.strictEqual(jpg.w, 1600); assert.strictEqual(jpg.thumb, thumb);
assert.strictEqual(png.thumb, '', 'a preview that is not a small JPEG data URL is dropped');
assert.strictEqual(mp4.thumb, '');
console.log('✓ [1/4] Upload: 2 photos + 1 video saved, wrong type skipped, names made URL-safe');

// 3. Page editor: validation
const PATH = '/kellersanierung/essen/';
assert.throws(() => api('api_pageSave', '/admin/', {title: 'x'}), /Unbekannte Seite/);
assert.throws(() => api('api_pageSave', '/kellersanierung/../x/', {title: 'x'}), /Unbekannte Seite/);
assert.throws(() => api('api_pageSave', PATH, {title: 'x'.repeat(61)}), /Titel: höchstens 60/);
assert.throws(() => api('api_pageSave', PATH, {photos: [{id: 'nope', alt: 'Ein Keller'}]}), /nicht \(mehr\) in der Mediathek/);
assert.throws(() => api('api_pageSave', PATH, {photos: [{id: mp4.id, alt: 'Ein Video'}]}), /nicht \(mehr\) in der Mediathek/, 'videos cannot be page photos');
assert.throws(() => api('api_pageSave', PATH, {photos: [{id: jpg.id, alt: 'x'}]}), /kurz beschreiben/);
assert.throws(() => api('api_pageSave', PATH, {photos: [{id: jpg.id, alt: 'Keller vorher'}, {id: jpg.id, alt: 'Keller nachher'}]}), /doppelt/);
const saved = api('api_pageSave', PATH, {
  title: '  Kellersanierung Essen <b>neu</b> ', h1: '=SUMME(A1)', lede: 'Zeile eins\nZeile zwei',
  photos: [{id: jpg.id, alt: 'Abgedichtete Kellerwand in Rüttenscheid'}],
});
const page = saved.pages[PATH];
assert.strictEqual(page.title, 'Kellersanierung Essen bneu/b', 'angle brackets are removed');
assert.strictEqual(page.h1, "'=SUMME(A1)", 'a formula start is neutralised');
assert.strictEqual(page.lede, 'Zeile eins Zeile zwei');
assert.strictEqual(page.metaDescription, '');
assert.strictEqual(page.photos.length, 1);
assert.strictEqual(saved.dirty, true);
assert.strictEqual(sheets['Seiten'].data.length, 2, 'header + one page');
console.log('✓ [2/4] Page editor: path, length, photo and description checks; text is stored as plain text');

// 4. A photo that a page shows cannot be deleted; an unused file can
assert.throws(() => api('api_mediaDelete', jpg.id), /wird noch auf \/kellersanierung\/essen\/ gezeigt/);
assert.strictEqual(api('api_mediaDelete', png.id).items.length, 2);
assert.throws(() => api('api_mediaDelete', png.id), /nicht gefunden/);
console.log('✓ [3/4] Delete: blocked while a page uses the photo, allowed otherwise');

// 5. Publish: one commit with pages.json and only the photos that are not in the repository yet
const calls = [];
const drive = ctx.DriveApp;
drive.getFileById = id => ({getBlob: () => ({getBytes: () => [...Buffer.from('bytes-of-' + id)]}), setTrashed() {}});
const fetchWith = existing => (url, opt) => {
  const method = (opt && opt.method || 'get').toLowerCase(), body = opt && opt.payload ? JSON.parse(opt.payload) : null;
  assert.strictEqual(opt.headers.Authorization, 'Bearer ghp_test_token');
  calls.push({method, url, body});
  const ok = d => ({getResponseCode: () => 200, getContentText: () => JSON.stringify(d)});
  if (/\/contents\/public\/media\?ref=main$/.test(url)) return existing ? ok(existing.map(name => ({name}))) : {getResponseCode: () => 404, getContentText: () => '{}'};
  if (/\/git\/blobs$/.test(url)) return ok({sha: 'blob' + calls.filter(c => /blobs$/.test(c.url)).length});
  if (/\/git\/ref\/heads\/main$/.test(url)) return ok({object: {sha: 'HEAD'}});
  if (/\/git\/commits\/HEAD$/.test(url)) return ok({tree: {sha: 'TREE'}});
  if (/\/git\/trees$/.test(url)) return ok({sha: 'NEWTREE'});
  if (/\/git\/commits$/.test(url)) return ok({sha: 'COMMIT'});
  if (/\/git\/refs\/heads\/main$/.test(url)) return ok({});
  throw new Error('unexpected fetch ' + method + ' ' + url);
};
ctx.UrlFetchApp.fetch = fetchWith(null);
const pub = api('api_pagesPublish');
assert.strictEqual(pub.ok, true); assert.strictEqual(pub.pages, 1); assert.strictEqual(pub.photos, 1);
const tree = calls.find(c => /git\/trees$/.test(c.url)).body;
assert.strictEqual(tree.base_tree, 'TREE');
assert.deepStrictEqual(tree.tree.map(t => t.path), ['public/media/' + jpg.id + '.jpg', 'public/data/pages.json']);
const jsonBlob = calls.filter(c => /git\/blobs$/.test(c.url)).pop().body;
const published = JSON.parse(Buffer.from(jsonBlob.content, 'base64').toString('utf8'));
assert.deepStrictEqual(published.pages[PATH], {
  title: 'Kellersanierung Essen bneu/b', h1: "'=SUMME(A1)", lede: 'Zeile eins Zeile zwei',
  photos: [{src: '/media/' + jpg.id + '.jpg', alt: 'Abgedichtete Kellerwand in Rüttenscheid', w: 1600, h: 1200}],
});
const commit = calls.find(c => /git\/commits$/.test(c.url)).body;
assert.deepStrictEqual(commit.parents, ['HEAD']); assert.strictEqual(commit.tree, 'NEWTREE');
assert.strictEqual(calls.filter(c => c.method === 'patch').length, 1, 'exactly one push to main');
assert.strictEqual(calls.find(c => c.method === 'patch').body.sha, 'COMMIT');
assert.strictEqual(api('api_pages').dirty, false);

calls.length = 0;
ctx.UrlFetchApp.fetch = fetchWith([jpg.id + '.jpg']);
assert.strictEqual(api('api_pagesPublish').photos, 0, 'a photo that is already in the repository is not sent again');
assert.strictEqual(calls.filter(c => /git\/blobs$/.test(c.url)).length, 1, 'only pages.json');

// resetting a page removes its row and the next publish drops it
assert.strictEqual(Object.keys(api('api_pageSave', PATH, {}).pages).length, 0);
assert.strictEqual(sheets['Seiten'].data.length, 1);
console.log('✓ [4/4] Publish: one commit, new photos only, pages.json matches the sheet');
console.log('--- ALL MEDIA & PAGES TESTS PASSED ---');
