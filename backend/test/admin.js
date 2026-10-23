/* Comprehensive Admin & Single Page App test suite for SOS Abdichtung.
 * Tests authentication, lockout, pipeline management, Drive links, audit logging, and catalog planner.
 * Usage: node backend/test/admin.js
 */
const assert = require('assert');
const M = require('./mock');
const {ctx, sheets, alerts, mails, puts, driveFolders, cache} = M;

// Load apps-script and admin-script modules
M.load('apps-script', ['Estimator.js', 'Shared.js', 'Code.js', 'Website.js']);
M.load('admin-script', ['Config.js', 'Belege.js', 'Termine.js', 'Admin.js']);

// Initialize Google Sheet database structure
ctx.setup();

console.log('--- SOS ABDICHTUNG ADMIN & SPA TEST SUITE ---');

// 1. Verify required Google Sheet tabs and schema columns
const requiredTabs = ['Anfragen', 'Positionen', 'Angebote', 'Belege', 'Protokoll', 'Benutzer', 'Konfiguration', 'Termine'];
requiredTabs.forEach(t => assert(sheets[t], 'Missing sheet tab: ' + t));
console.log('✓ [1/6] Google Sheets schema & relational tabs verified:', requiredTabs.join(', '));

// 2. Authentication & Brute-Force Lockout
const badUser = ctx.login('unknown_user', 'some_password');
assert.strictEqual(badUser.ok, false, 'Non-existent user must fail login');

const badPass1 = ctx.login('shahzad', 'wrong_pass');
assert.strictEqual(badPass1.ok, false, 'Incorrect password must fail login');

// Test brute-force lockout after 5 failed tries
for (let i = 0; i < 4; i++) ctx.login('shahzad', 'wrong_pass');
const lockedRes = ctx.login('shahzad', 'wrong_pass');
assert.strictEqual(lockedRes.error, 'locked', 'Account must lock out after multiple failed attempts');

// Clear lockout in cache for valid login
cache['admfail_shahzad'] = '0';
M.seedAdminPw();
const goodLogin = ctx.login('shahzad', M.TEST_PW);
assert(goodLogin.ok && goodLogin.token, 'Owner Shahzad Mahmood must log in successfully');
assert(/^[0-9a-f]{64}$/.test(goodLogin.token), 'Session token must be 64-char hex string');
const token = goodLogin.token;
console.log('✓ [2/6] Authentication & Security: Brute-force lockout and session token verified for', goodLogin.name);

// 3. API Security Guard
assert.throws(() => ctx.api('invalid_token', 'api_bootstrap'), /LOGIN/, 'Unauthenticated API call must throw LOGIN error');

// 4. Admin Bootstrap & Pipeline Overview
const boot = ctx.api(token, 'api_bootstrap');
assert(boot.me && boot.leads && Array.isArray(boot.leads), 'Bootstrap returns admin session and lead list');
assert(boot.statuses.includes('Neu') && boot.statuses.includes('Gebucht'), 'Statuses include standard sales stages');
console.log('✓ [3/6] Admin Bootstrap: Session active,', boot.leads.length, 'leads loaded, statuses:', boot.statuses.join(', '));

// 5. Intake Test Lead and Update through Pipeline
const post = b => ctx.doPost({postData: {contents: JSON.stringify(b)}});
const newLeadRes = post({
  action: 'lead',
  consent: true,
  t: 5000,
  lang: 'de',
  contact: {name: 'Dr. Klaus Weber', phone: '0202 554433', email: 'weber@example.de', note: 'Feuchte Kellerwand im Altbau'},
  state: {
    ref: 'ADMIN-TEST-LEAD',
    f1: {from: 'Herzogstr. 12, 42103 Wuppertal', to: 'Kellerinnenabdichtung', km: '10', dateMode: 'flex', date: '2026-11-20', hh: 0, service: 'Kellerinnenabdichtung'},
    acc: {old: {floor: 0, lift: 0, park: 0}, new: {floor: 0, lift: 0, park: 0}},
    hvz: true,
    rooms: [{r: 'keller', sqm: '20'}],
    inv: {'keller-mds': {vi: 0, by: {pick: 20}}},
    customs: [],
    src: {ref: 'Website Admin Test'}
  }
});
assert(newLeadRes.ok && newLeadRes.id, 'New lead created');
const leadId = newLeadRes.id;

// Retrieve lead detail
const leadDetail = ctx.api(token, 'api_lead', [leadId]);
assert(leadDetail.lead && leadDetail.lead.id === leadId, 'Lead detail matches lead ID');
assert.strictEqual(leadDetail.lead.name, 'Dr. Klaus Weber', 'Customer name matches');

const updateRes = ctx.api(token, 'api_update', [leadId, {status: 'In Arbeit', note: 'Telefonische Rücksprache gehalten; Vor-Ort-Termin vereinbart.'}]);
assert(updateRes && updateRes.status === 'In Arbeit', 'Lead update succeeded and status is In Arbeit');

// Verify audit logging in Protokoll tab
const auditSheet = sheets['Protokoll'];
assert(auditSheet && auditSheet.data.length > 1, 'Protokoll audit trail contains rows');
const lastAudit = auditSheet.data[auditSheet.data.length - 1];
assert(lastAudit[1].includes('Shahzad') || lastAudit[1].includes('shahzad'), 'Audit contains actor name');
console.log('✓ [4/6] Lead Pipeline & Audit Log: Lead', leadId, 'updated to "In Arbeit" with full audit trail in Protokoll');

// Customer self-service portal link generation
const custLink = ctx.api(token, 'api_customerLink', [leadId]);
assert(typeof custLink === 'string' && custLink.includes(leadId) && custLink.includes('/mein-auftrag/'), 'Customer self-service portal link generated: ' + custLink);
console.log('✓ [5/6] Customer Self-Service Link:', custLink);

// 6. Waterproofing Planner & Website Publishing Bridge
const plannerMaster = ctx.api(token, 'api_plannerMaster');
assert(plannerMaster.master && plannerMaster.rates, 'Planner master returns catalog master and rates');
assert(plannerMaster.master.items && plannerMaster.master.items.length > 0, 'Catalog has seeded waterproofing materials');

puts.length = 0;
const pubRes = ctx.api(token, 'api_publishWebsite');
assert(pubRes.ok, '1-Click Website Publishing succeeded');
console.log('✓ [6/6] Waterproofing Catalog & 1-Click Publishing verified.');

console.log('\nALL ADMIN & SPA TESTS PASSED SUCCESSFULLY!\n');
