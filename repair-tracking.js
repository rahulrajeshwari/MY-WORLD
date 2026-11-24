import { firestore, observeAccount } from './firebase-client.js';

const form = document.querySelector('#tracking-form');
const admin = !form;
const status = document.querySelector('#repair-status');
const login = document.querySelector('#repair-login');
const results = document.querySelector('#repair-results');
const refresh = document.querySelector('#repair-refresh');
const statuses = ['Received', 'In progress', 'Ready', 'Completed', 'Cancelled'];
let account;
let authorized = false;

function render(record, sdk, db, user) {
  const repair = record.data();
  const item = document.createElement('li');
  const summary = document.createElement('p');
  summary.textContent = [record.id, repair.model, repair.problem, repair.status].filter(Boolean).join(' · ');
  item.append(summary);
  if (admin) {
    const select = document.createElement('select');
    select.setAttribute('aria-label', 'Status for repair ' + record.id);
    for (const value of statuses) select.add(new Option(value, value));
    select.value = repair.status;
    const save = document.createElement('button');
    save.type = 'button';
    save.textContent = 'Update status';
    save.onclick = async () => {
      if (account !== user) return;
      save.disabled = true;
      try {
        await sdk.updateDoc(sdk.doc(db, 'myWorldRepairs', record.id), {
          status: select.value, updatedAt: sdk.serverTimestamp()
        });
        await load();
      } catch {
        if (account === user) status.textContent = 'Could not update repair status.';
      } finally {
        save.disabled = false;
      }
    };
    item.append(select, save);
  }
  results.append(item);
}

async function load() {
  const user = account;
  if (!user || !authorized) return;
  refresh.disabled = true;
  results.replaceChildren();
  status.textContent = 'Loading repairs…';
  try {
    const { sdk, db } = await firestore();
    const collection = sdk.collection(db, 'myWorldRepairs');
    const query = admin
      ? sdk.query(collection, sdk.orderBy('createdAt', 'desc'), sdk.limit(50))
      : sdk.query(collection, sdk.where('uid', '==', user.uid), sdk.orderBy('createdAt', 'desc'), sdk.limit(50));
    const snapshot = await sdk.getDocsFromServer(query);
    if (account !== user) return;
    const records = [...snapshot.docs].sort((a, b) =>
      b.data().createdAt.toMillis() - a.data().createdAt.toMillis());
    records.forEach(record => render(record, sdk, db, user));
    status.textContent = snapshot.empty ? 'No repair requests found.'
      : snapshot.size === 50 ? 'Showing up to 50 repair requests.' : '';
  } catch {
    if (account === user) status.textContent = 'Could not load repair requests.';
  } finally {
    if (account === user) refresh.disabled = false;
  }
}

observeAccount(async (user, available) => {
  account = user;
  authorized = false;
  login.hidden = !available || Boolean(user);
  refresh.hidden = true;
  results.replaceChildren();
  if (form) {
    form.hidden = true;
    form.reset();
    form.querySelector('button').disabled = false;
  }
  status.textContent = available ? 'Sign in to access repair tracking.' : 'Firebase setup is pending.';
  if (!user) return;
  try {
    if (admin) {
      status.textContent = 'Checking admin access…';
      const { sdk, db } = await firestore();
      const role = await sdk.getDocFromServer(sdk.doc(db, 'myWorldAdmins', user.uid));
      if (account !== user) return;
      if (role.data()?.active !== true) {
        status.textContent = 'Admin access required.';
        return;
      }
    }
    authorized = true;
    refresh.hidden = false;
    if (form) form.hidden = false;
    await load();
  } catch {
    if (account === user) status.textContent = 'Could not check repair access.';
  }
}, () => { status.textContent = 'Could not check sign-in.'; });

refresh.onclick = load;

if (form) form.onsubmit = async event => {
  event.preventDefault();
  const user = account;
  if (!user || !authorized) return;
  const model = form.elements.model.value.trim();
  const problem = form.elements.problem.value.trim();
  if (!problem) {
    status.textContent = 'Describe the repair problem.';
    return;
  }
  const submit = form.querySelector('button');
  submit.disabled = true;
  try {
    const { sdk, db } = await firestore();
    const record = await sdk.addDoc(sdk.collection(db, 'myWorldRepairs'), {
      uid: user.uid, model, problem, status: 'Received',
      createdAt: sdk.serverTimestamp(), updatedAt: sdk.serverTimestamp()
    });
    if (account !== user) return;
    form.reset();
    await load();
    if (account === user) status.textContent = 'Repair request received. ID ' + record.id + '. ' + status.textContent;
  } catch {
    if (account === user) status.textContent = 'Could not submit the repair request.';
  } finally {
    if (account === user) submit.disabled = false;
  }
};
