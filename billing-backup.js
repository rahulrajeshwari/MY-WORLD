import { firestore, observeAccount } from './firebase-client.js';

const status = document.querySelector('#backup-status');
const login = document.querySelector('#backup-login');
const save = document.querySelector('#backup-save');
const restore = document.querySelector('#backup-restore');
let account;
let busy = false;

observeAccount((user, available) => {
  account = user;
  login.hidden = !available || Boolean(user);
  save.hidden = restore.hidden = !user;
  status.textContent = !available ? 'Firebase setup is pending.'
    : user ? 'Backups are private to your signed-in account.' : 'Sign in to use cloud backup.';
}, () => { status.textContent = 'Could not check sign-in.'; });

async function run(operation) {
  const user = account;
  if (!user || busy) return;
  busy = save.disabled = restore.disabled = true;
  status.textContent = 'Working…';
  try {
    const { sdk, db } = await firestore();
    const collection = sdk.collection(db, 'myWorldProfiles', user.uid, 'billingBackups');
    const message = await operation(collection, sdk, () => account === user);
    if (account === user) status.textContent = message;
  } catch {
    if (account === user) status.textContent = 'Cloud operation interrupted. You can retry.';
  } finally {
    busy = save.disabled = restore.disabled = false;
  }
}

save.onclick = () => {
  if (!account || !confirm('Copy the bills on this device to your signed-in account? They may contain customer details.')) return;
  run(async (collection, sdk, active) => {
    let saved = 0;
    let skipped = 0;
    for (const bill of window.myWorldBilling.read()) {
      if (!active()) return '';
      const payload = JSON.stringify(bill);
      const bytes = new TextEncoder().encode(payload);
      if (bytes.length > 900000) {
        skipped++;
        continue;
      }
      const hash = await crypto.subtle.digest('SHA-256', bytes);
      const id = Array.from(new Uint8Array(hash), byte => byte.toString(16).padStart(2, '0')).join('');
      if (!active()) return '';
      const ref = sdk.doc(collection, id);
      await sdk.runTransaction(collection.firestore, async transaction => {
        if (!active()) throw new Error('Account changed.');
        if (!(await transaction.get(ref)).exists() && active()) {
          transaction.set(ref, { payload, createdAt: sdk.serverTimestamp() });
        }
      });
      saved++;
    }
    return `${saved} bills backed up.${skipped ? ` ${skipped} exceeded the cloud size limit.` : ''}`;
  });
};

function parseBill(payload) {
  try {
    const bill = JSON.parse(payload);
    const strings = ['id', 'date', 'business', 'party', 'mobile', 'mode'];
    const amounts = ['sub', 'discount', 'total', 'paid', 'due'];
    if (!bill || !strings.every(key => typeof bill[key] === 'string') ||
        !['Sales', 'Purchase'].includes(bill.type) ||
        !amounts.every(key => Number.isFinite(bill[key])) ||
        !Array.isArray(bill.items) || !bill.items.every(item =>
          item && typeof item.name === 'string' &&
          Number.isFinite(item.qty) && Number.isFinite(item.rate))) return null;
    return bill;
  } catch {
    return null;
  }
}

restore.onclick = () => {
  if (!account || !confirm('Restore missing bills from your account to this device? Existing bills will be kept.')) return;
  run(async (collection, sdk, active) => {
    const bills = [];
    let skipped = 0;
    let cursor;
    while (active()) {
      const constraints = [sdk.orderBy(sdk.documentId()), sdk.limit(25)];
      if (cursor) constraints.push(sdk.startAfter(cursor));
      const page = await sdk.getDocsFromServer(sdk.query(collection, ...constraints));
      for (const record of page.docs) {
        const bill = parseBill(record.data().payload);
        if (bill) bills.push(bill);
        else skipped++;
      }
      if (page.size < 25) break;
      cursor = page.docs.at(-1);
    }
    if (!active()) return '';
    const count = window.myWorldBilling.restore(bills);
    return `${count} bills restored.${skipped ? ` ${skipped} invalid backups skipped.` : ''}`;
  });
};
