HI BUDDY — UI redesign package

Files:
- index.html: redesigned single-page app.

Included in this version:
- Updated responsive interface for mobile and desktop
- New signup and login screens
- Chat list and one-to-one realtime text chat using the existing Firebase project
- Light/dark theme toggle (saved locally in the browser)

Important:
- This is a UI redesign of the current prototype, not a complete messaging platform.
- Updates/status, voice/video calls, recovery codes, media uploads, push notifications and advanced privacy features are not implemented.
- The app uses the Firebase project configuration already present in the current HI BUDDY deployment.
- Mobile number is used as an account identifier; phone ownership is not verified.
- Keep Firestore security rules enabled. Do not store passwords or recovery codes in public profile documents.

GitHub:
1. Extract this ZIP.
2. Upload index.html to the root of your HI BUDDY GitHub repository.
3. Commit the change.
4. If Vercel is connected to that repository, it should build a new deployment automatically.
