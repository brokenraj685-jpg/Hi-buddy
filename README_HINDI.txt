HI BUDDY Android APK project

Is ZIP mein Android app ka source, HI BUDDY logo/app icon, splash background theme aur GitHub Actions APK build workflow hai.

APK banane ke liye:
1. ZIP extract karo.
2. Is folder ke andar ke sab files apne GitHub repository ke root mein upload/commit karo.
3. GitHub repository mein Actions tab kholo.
4. "Build HI BUDDY APK" workflow select karke Run workflow dabao.
5. Build complete hone par workflow run ke neeche Artifacts mein HI-BUDDY-APK download karo.
6. ZIP extract karke app-debug.apk phone mein install karo. Android unknown-app install permission pooch sakta hai.

Note:
- Yeh debug APK hoga, personal testing/install ke liye.
- App ke HTML assets bundle hain; Firebase Auth/Firestore ke liye internet zaroori hai.
- Firebase project mein authorized domains / web config ki wajah se agar login error aaye, exact error share karna.
- Current app mein abhi 1:1 text chat/basic account features hi hain. Voice/video call, media uploads, push notifications, recovery code etc. abhi included nahi hain.
- Mobile number account identifier hai; SMS OTP se ownership verify nahi hoti.
