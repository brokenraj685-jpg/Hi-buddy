# HI BUDDY — Firebase Spark setup

The app continues to use the existing Firebase project `raj-11988` and Email/Password Authentication (the app's login screen maps the 10-digit mobile number to its existing synthetic email address).

## Publish Firestore security rules

1. Open Firebase Console and select the existing `raj-11988` project.
2. Open **Firestore Database → Rules**.
3. Open this repository's `firestore.rules` file and copy its complete contents.
4. Replace the Rules editor contents with that file and click **Publish**.
5. Test sign-in, chat list loading, opening an existing chat, sending a message, creating a new chat, username prefix search, opening a profile, and blocking/unblocking a test account. Test that a duplicate mobile number and duplicate username are rejected.

Do not create a new Firebase project or delete any Firestore collections.

## What the rules add

- Unique mobile-number and username reservations are stored in `accountClaims/{claimId}`; claims are created once and can only be removed by their owner during rollback.
- Usernames are searchable by prefix from the public `profiles` directory. Selecting a result opens the public profile, where a new one-to-one chat can be started.
- A user's block list is stored at `privateUsers/{uid}/blocked/{blockedUid}`.
- A blocked relationship prevents creation of a new one-to-one chat and prevents sending messages in an existing chat.
- The private `preferences.privacy.allowNewChats` setting can prevent other users from starting new chats with the account.
- Existing chat history remains readable to its members.
- Private preferences, profile photo and About data are stored in `privateUsers/{uid}`.
- Public `profiles/{uid}` documents remain readable for username discovery. Keep only basic directory fields such as `name`, `username`, and `createdAt` there.

## Spark-plan limitations

- Switching accounts means signing out and logging in with another registered mobile number. The app does not store passwords for account switching.
- Secure permanent account deletion (Firebase Auth user plus all related Firestore data) requires trusted server-side cleanup. This repository does not deploy such a service, so the app does not claim to delete accounts.
- Browser notification permission is not the same as background push delivery; Firebase Cloud Messaging still needs setup.
- Online/last-seen presence and read receipts are not implemented by this PWA yet.

## Existing data

On a user's next sign-in, the app attempts to move any legacy `photo` and `about` fields from their public profile document into their private user document, then removes those fields from the public profile. This requires the existing rules to permit that user to update their own profile and write their own `privateUsers/{uid}` document, as in the rules provided for this project.


## Voice and video calling

- Open a one-to-one chat and tap the phone icon for voice or the camera icon for video.
- Calls use browser WebRTC media and Firestore signalling documents in `calls/{callId}`, with separate caller/callee ICE-candidate subcollections.
- Both participants must be signed in, and the browser must grant microphone/camera permission. The app must be served over HTTPS.
- Calls ring for up to 45 seconds, can be accepted or declined, and can be ended from the call controls.
- The app uses public STUN discovery servers only. Direct peer-to-peer calling works on many networks, but some carrier/Wi-Fi NATs require a TURN relay; a TURN service and credentials are not included in this Spark-only setup. A TURN relay is needed for more reliable cross-network calling.
- Publish the updated `firestore.rules` file before testing calls. The rules restrict call records and ICE candidates to the two call participants.
- Keep the app open during calls. Background incoming-call push notifications are not configured.


## Call history and incoming-call permissions

- Calls are stored in `calls/{callId}` and shared only by the caller and callee.
- Incoming-call listeners query calls where `calleeUid` equals the signed-in user. Call history listens separately for `callerUid` and `calleeUid`.
- Publish the latest `firestore.rules` so Firestore can authorize participant-constrained call queries.
- The Calls tab shows all, missed, incoming and outgoing calls. Each call row shows caller/recipient, voice/video type, outcome and time.
- Call outcomes use `ringing`, `accepted`, `rejected`, `missed`, and `ended`. Accepted and ended timestamps are stored for history.
- Incoming call UI is shown only while the recipient is signed in and the app is open. Background/closed-app incoming-call notifications are not configured.


## Latest calling improvements

The current call screen also includes:
- In-app ringing tone and vibration while a call is ringing (subject to browser/device permissions and audio autoplay restrictions).
- Live call duration timer after the peer connection becomes connected.
- Microphone mute, camera on/off, front/back camera switching, speaker output selection where the browser exposes audio output devices, and browser Picture-in-Picture where supported.
- A minimized floating call panel while navigating inside the app.
- Caller/callee profile photo lookup from the participant's private profile document.
- Caller-side ICE restart negotiation when the connection drops; the callee automatically answers the refreshed offer.

These improvements are browser/device dependent. Android browsers do not all expose speaker routing or Picture-in-Picture APIs.

## Background incoming-call notifications and TURN relay

Background/closed-app incoming-call notifications are still not enabled. To enable them, the existing Firebase project needs:
1. Firebase Cloud Messaging Web Push configured with a VAPID public key.
2. A messaging service worker and client registration/token flow.
3. A trusted server process (for example Cloud Functions on a billing-enabled Firebase plan or another secured server) that watches new call documents and sends a push notification to the callee's registered token. Never put Firebase Admin credentials or server send credentials in browser code or this public repository.

Reliable calls across restrictive mobile carrier/Wi-Fi networks also need a TURN relay. A TURN provider must supply the server URL, username and credential (prefer short-lived credentials). These cannot be fabricated by the app; do not paste private TURN credentials into a public GitHub file. The current app continues to use public STUN servers until a secure TURN credential-delivery method is configured.

The existing project remains raj-11988. No collections or existing user/chat data are deleted by these changes.
