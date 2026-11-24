# MY WORLD – Founder & Shopping Update

## Added
- Online Shopping opens Rajeshwar Digital Sales: https://rajeshwardigitalsales.smartbiz.in
- About Us section with the supplied founder photo and biography for Mr. Rahul Kumawat
- Supplied MY WORLD logo used in the header and app icon

## Update your VS Code project
1. Extract this ZIP.
2. Open your existing MY_WORLD folder in VS Code.
3. Replace `index.html`, `styles.css`, `app.js`, `manifest.webmanifest`, and `sw.js`.
4. Copy the complete `assets` folder, including the new photo and logo files.
5. Save and refresh Live Server with Ctrl + Shift + R.

This is still a front-end demo. Real recharge, payments, finance, OTP login, and order processing require a secure backend and authorized partner integrations.

## Firebase backend

The home account button opens mobile OTP login and then the customer profile.
Smart Billing offers manual backups and restores missing bills into local history.
Repair tracking on `repair.html#tracking` accepts requests from signed-in
customers. The existing WhatsApp request form remains available. The Admin
Dashboard lets approved staff review repair requests and update their status.

### Configure the existing Firebase project

1. Confirm the Firebase project ID and authorized account. In the Firebase
   console, copy the existing web app's public configuration into
   `firebase-config.js`. Keep service-account keys and tokens outside this
   repository.
2. Review the existing Firestore database, rules, collections, and indexes.
   Merge the MY WORLD rules and index definitions with any live configuration
   before deployment. The rule file in this repository grants access only to
   the MY WORLD paths, so replacing a shared project's rules can break other
   features. Deploy any required index and wait for it to finish building.
3. In Firebase Authentication, review the Phone provider, authorized domains
   (the production hostname for this app), and the SMS region policy (India
   for the current phone input). Use console-configured fictional numbers to
   test OTP without sending SMS. Real Firebase verification SMS requires the
   Blaze plan. Obtain the owner's approval before changing billing.
4. After the staff member has signed in and the project owner has verified
   their Firebase UID, use the Firestore console to add
   `myWorldAdmins/{uid}` with the Boolean field `active: true`. Set
   `active: false` to revoke access. Client apps cannot grant this permission.
5. Test the merged rules and confirm access with a customer and a staff
   account before publishing the static app. Prefer an explicit project ID
   when deploying Firestore configuration.

Billing backups are per account and immutable. Use the backup button after
saving bills. Restores preserve existing local bills and skip matching bill
IDs. Local deletions leave backups available for recovery. A bill over 900 KB
stays on the device and is reported as skipped. Browser storage capacity
limits how many backed-up bills can be restored to one device.
