import { firebaseAuth, firestore, observeAccount } from './firebase-client.js';

const status = document.querySelector('#account-status');
const login = document.querySelector('#account-login');
const form = document.querySelector('#profile-form');
const admin = document.querySelector('#admin-link');
const fields = document.querySelector('#profile-fields');
const save = fields.querySelector('button');
const logout = document.querySelector('#account-logout');
let account;

observeAccount(async (user, available) => {
  account = user;
  form.hidden = !user;
  admin.hidden = true;
  login.hidden = !available || Boolean(user);
  form.reset();
  fields.disabled = true;
  status.textContent = available ? 'Sign in to view your profile.' : 'Firebase setup is pending.';
  if (!user) return;

  save.disabled = true;
  status.textContent = 'Loading profile…';
  document.querySelector('#verified-phone').textContent = user.phoneNumber ?? '';
  try {
    const { sdk, db } = await firestore();
    const profile = await sdk.getDocFromServer(sdk.doc(db, 'myWorldProfiles', user.uid));
    if (account !== user) return;
    form.elements.name.value = profile.data()?.name ?? '';
    form.elements.email.value = profile.data()?.email ?? '';
    fields.disabled = false;
    save.disabled = false;
    status.textContent = '';
    const role = await sdk.getDocFromServer(sdk.doc(db, 'myWorldAdmins', user.uid));
    if (account === user) admin.hidden = role.data()?.active !== true;
  } catch {
    if (account === user) status.textContent = 'Could not load all account details. Try refreshing.';
  }
}, () => { status.textContent = 'Could not check sign-in.'; });

form.addEventListener('submit', async event => {
  event.preventDefault();
  const user = account;
  const name = form.elements.name.value.trim();
  if (!user || !name) {
    status.textContent = 'Enter your name.';
    return;
  }
  save.disabled = true;
  try {
    const { sdk, db } = await firestore();
    await sdk.setDoc(sdk.doc(db, 'myWorldProfiles', user.uid), {
      name, email: form.elements.email.value.trim()
    });
    if (account === user) status.textContent = 'Profile saved.';
  } catch {
    if (account === user) status.textContent = 'Could not save your profile.';
  } finally {
    if (account === user) save.disabled = false;
  }
});

logout.addEventListener('click', async () => {
  try {
    const { auth, sdk } = await firebaseAuth();
    await sdk.signOut(auth);
    location.assign('./index.html');
  } catch {
    status.textContent = 'Could not sign out. Try again.';
  }
});
