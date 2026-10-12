import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const read = (p) => fs.readFileSync(path.join(root, p), 'utf8');
const checks = [];
const add = (name, ok) => checks.push([name, Boolean(ok)]);

const importer = read('components/people-importer.tsx');
const callback = read('app/auth/callback/route.ts');
const importPage = read('app/c/[cofreId]/people/import/page.tsx');
const env = read('.env.example');
const activation = read('recovery/R05_2A_2_GOOGLE_CONTACTS_OAUTH_ACTIVATION.md');

add('R05.2A.2 Google identity linking', importer.includes('auth.linkIdentity') && importer.includes('provider: "google"'));
add('R05.2A.2 Contacts readonly only', importer.includes('https://www.googleapis.com/auth/contacts.readonly') && !importer.includes('contacts.other.readonly'));
add('R05.2A.2 provider token server-only staging', callback.includes('provider_token') && callback.includes('people.googleapis.com/v1/people/me/connections') && callback.includes('stage_contact_import_secure') && !callback.includes('localStorage'));
add('R05.2A.2 callback error UX', importPage.includes('google_not_enabled') && importPage.includes('google_token') && importPage.includes('google_contacts') && importPage.includes('google_callback'));
add('R05.2A.2 exact Google redirect URI documented', activation.includes('https://awuzunqfsbqyjsxlkdsb.supabase.co/auth/v1/callback'));
add('R05.2A.2 Supabase manual linking documented', activation.includes('Manual Linking') && activation.includes('auth.linkIdentity()'));
add('R05.2A.2 People API activation documented', activation.includes('People API') && activation.includes('contacts.readonly'));
add('R05.2A.2 production app callback documented', activation.includes('https://cofre-web-rc1-production.up.railway.app/auth/callback'));
add('R05.2A.2 feature flag safe until external config', env.includes('NEXT_PUBLIC_GOOGLE_CONTACTS_ENABLED=false') && activation.includes('NEXT_PUBLIC_GOOGLE_CONTACTS_ENABLED=true'));
add('R05.2A.2 no Google secret in frontend config', !env.includes('GOOGLE_CLIENT_SECRET') && !importer.includes('GOOGLE_CLIENT_SECRET') && !callback.includes('GOOGLE_CLIENT_SECRET'));

let pass = 0;
for (const [name, ok] of checks) {
  console.log(`${ok ? 'PASS' : 'FAIL'} · ${name}`);
  if (ok) pass += 1;
}
console.log(`\n${pass} PASS / ${checks.length - pass} FAIL · ${checks.length} R05.2A.2 checks`);
if (pass !== checks.length) process.exit(1);
