HI BUDDY — COMPACT UI + STAY SIGNED IN

Changes in this revision:
- Smaller typography and tighter spacing across the app.
- Removed unnecessary explanatory/marketing text from the first screen and empty state.
- Firebase Authentication explicitly uses browserLocalPersistence.
- A user stays signed in on the same browser/PWA on the same device until they choose Log out.
- Existing Firebase project, registration, login, username search, realtime 1:1 text chats, theme and PWA install support are preserved.

Important:
- Login persistence is for the same browser/app installation and same origin. Clearing Chrome/site data, uninstalling/resetting the browser, or signing out will require login again.
- This does not sync an active login between different phones or browsers.
- Mobile number remains an account identifier; it is not verified by SMS.
- Existing Updates and Calls remain placeholders.
- Replace the existing index.html and README.md in the repository root with these files. Keep manifest.webmanifest, sw.js and icons/ from your current PWA package unchanged.


## Final mobile UI update (v1.2.0)
- Removed in-app install button while keeping the PWA manifest and service worker.
- Refined compact bottom navigation and settings layout for mobile screens.
- Added working profile-name editing, theme, chat text-size, browser notification permission, storage estimate/cache controls, and Firebase-saved privacy preference fields.
- Clearly labels advanced controls that still require backend enforcement (blocking, read receipts, last seen, online visibility, and FCM background delivery).
- Existing Firebase project configuration and authentication/Firestore flows are retained.
