HI BUDDY — PWA WEBSITE PACKAGE

This package turns the existing HI BUDDY web app into an installable PWA.

PRESERVED APP FUNCTIONS (same Firebase project/config and same current app code):
- Sign up with mobile number, name, username, password and in-app arithmetic CAPTCHA
- Login with mobile number and password
- Existing Firestore profile and one-to-one text chat list
- Username-based new chat
- Realtime messages and light/dark theme
- Existing Updates and Calls placeholder screens remain placeholders

NEW:
- New blue/cyan/lime HI BUDDY logo and app icons
- PWA manifest, service worker and Chrome install support
- Responsive refreshed visual styling
- Same Vercel project/domain can be retained

IMPORTANT DEPLOY STEPS:
1. Extract this ZIP on your phone/computer.
2. Open your existing GitHub repository: brokenraj685-jpg/Hi-buddy.
3. Upload/replace the files from the ZIP at the REPOSITORY ROOT:
   index.html
   manifest.webmanifest
   sw.js
   icons/ (upload this folder with its 3 PNG files)
4. Commit changes to the same main branch. Do not upload only the ZIP archive:
   Vercel does not automatically unpack ZIP files.
5. Wait for the existing Vercel project to deploy. Do not create a new Vercel project or change the domain.
6. Open https://hi-buddy.vercel.app in Chrome. Refresh once.
7. Use the Install button in the app, or Chrome menu ⋮ > Install app / Add to Home screen.

NOTES:
- PWA installation requires HTTPS (Vercel provides HTTPS).
- Firebase Authentication and Firestore remain online features; offline mode only caches the app shell, not live chats.
- Existing Updates and Calls are still placeholders; this package does not invent unfinished features.
- Mobile number remains an account identifier only; the app does not verify phone ownership.
