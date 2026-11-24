import { firebaseConfig } from './firebase-config.js';

export const configured = ['apiKey', 'authDomain', 'projectId', 'appId']
  .every(key => Boolean(firebaseConfig[key]));

let client;
let database;

export function firebaseAuth() {
  if (!configured) throw new Error('Firebase setup is pending.');
  client ??= Promise.all([
    import('https://www.gstatic.com/firebasejs/11.10.0/firebase-app.js'),
    import('https://www.gstatic.com/firebasejs/11.10.0/firebase-auth.js')
  ]).then(([appSdk, sdk]) => {
    const app = appSdk.initializeApp(firebaseConfig);
    return { app, auth: sdk.getAuth(app), sdk };
  });
  return client;
}

export function firestore() {
  database ??= Promise.all([
    firebaseAuth(),
    import('https://www.gstatic.com/firebasejs/11.10.0/firebase-firestore.js')
  ]).then(([{ app }, sdk]) => ({ db: sdk.getFirestore(app), sdk }));
  return database;
}

export async function observeAccount(callback, onError) {
  if (!configured) {
    callback(null, false);
    return;
  }
  try {
    const { auth, sdk } = await firebaseAuth();
    sdk.onAuthStateChanged(auth, user => callback(user, true), onError);
  } catch (error) {
    onError(error);
  }
}
