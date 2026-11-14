# HI BUDDY Cloudflare R2 upload Worker

This Worker uploads authenticated Firebase users' files to the existing R2 bucket `hibuddy`.

## Git-connected Worker setup

The repository root contains `wrangler.toml`; the Worker entry point is `cloudflare/worker.js`.
In the Cloudflare Worker Git integration, use the repository root as the project root and deploy with Wrangler configuration. The R2 binding is declared as `BUCKET` and targets the existing bucket `hibuddy`.

## Required secret

In Cloudflare Dashboard → Workers & Pages → hi-buddy-upload → Settings → Variables and Secrets, add:

- Name: `FIREBASE_API_KEY`
- Type: Secret
- Value: the Web API key from the existing Firebase project `raj-11988` (Firebase Console → Project settings → General → Web API Key).

Do not put Firebase service-account keys or R2 access keys in the browser or GitHub repository.

## Routes

- `GET /` health check
- `POST /upload` raw file body, Firebase ID token in `Authorization: Bearer ...`, MIME type in `Content-Type`, original filename in `X-File-Name`.

Maximum file size is 25 MB. Only common image, video, audio and document MIME types are accepted.

## Public media warning

The configured R2 public development domain makes uploaded object URLs publicly readable by anyone who obtains the URL. Uploads are authenticated, but downloads are public. Do not upload private/sensitive content until private delivery (authenticated Worker reads or signed URLs) is implemented.

## CORS

`ALLOWED_ORIGIN` is temporarily `*` so the endpoint can be tested from the PWA. Before production, replace it with the exact HI BUDDY app origin.
