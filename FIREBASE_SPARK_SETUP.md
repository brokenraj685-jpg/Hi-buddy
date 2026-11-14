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
