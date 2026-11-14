const MAX_BYTES = 25 * 1024 * 1024;
const ALLOWED_TYPES = new Set([
  "image/jpeg", "image/png", "image/webp", "image/gif",
  "video/mp4", "video/webm", "audio/mpeg", "audio/mp4",
  "audio/ogg", "audio/webm", "application/pdf",
  "text/plain",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
]);

function corsHeaders(request, env) {
  const origin = request.headers.get("Origin") || "";
  const allowed = env.ALLOWED_ORIGIN || "*";
  return {
    "Access-Control-Allow-Origin": allowed === "*" ? "*" : (origin === allowed ? origin : allowed),
    "Access-Control-Allow-Methods": "POST, OPTIONS, GET",
    "Access-Control-Allow-Headers": "Authorization, Content-Type, X-File-Name",
    "Access-Control-Max-Age": "86400",
    "Vary": "Origin"
  };
}

function reply(request, env, data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { ...corsHeaders(request, env), "Content-Type": "application/json; charset=utf-8", "Cache-Control": "no-store" }
  });
}

async function verifyFirebaseToken(token, env) {
  if (!env.FIREBASE_API_KEY) throw new Error("Worker secret FIREBASE_API_KEY is not configured");
  const response = await fetch(`https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=${env.FIREBASE_API_KEY}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ idToken: token })
  });
  if (!response.ok) return null;
  const data = await response.json();
  const account = data.users && data.users[0];
  return account && account.localId ? account.localId : null;
}

export default {
  async fetch(request, env) {
    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: corsHeaders(request, env) });
    }
    const url = new URL(request.url);
    if (request.method === "GET" && url.pathname === "/") {
      return reply(request, env, { ok: true, service: "HI BUDDY media upload", bucket: "connected" });
    }
    if (request.method !== "POST" || url.pathname !== "/upload") {
      return reply(request, env, { error: "Not found" }, 404);
    }
    try {
      const authorization = request.headers.get("Authorization") || "";
      const token = authorization.startsWith("Bearer ") ? authorization.slice(7) : "";
      if (!token) return reply(request, env, { error: "Firebase login required" }, 401);
      const uid = await verifyFirebaseToken(token, env);
      if (!uid) return reply(request, env, { error: "Invalid or expired Firebase login" }, 401);

      const declaredSize = Number(request.headers.get("Content-Length") || 0);
      if (declaredSize > MAX_BYTES) return reply(request, env, { error: "File limit is 25 MB" }, 413);
      const contentType = (request.headers.get("Content-Type") || "").split(";")[0].trim().toLowerCase();
      if (!ALLOWED_TYPES.has(contentType)) return reply(request, env, { error: "This file type is not allowed" }, 415);

      const bytes = await request.arrayBuffer();
      if (!bytes.byteLength) return reply(request, env, { error: "Empty file" }, 400);
      if (bytes.byteLength > MAX_BYTES) return reply(request, env, { error: "File limit is 25 MB" }, 413);

      const rawName = request.headers.get("X-File-Name") || "upload";
      const safeName = rawName.replace(/[^a-zA-Z0-9._-]/g, "_").slice(0, 100) || "upload";
      const key = `uploads/${uid}/${crypto.randomUUID()}-${safeName}`;
      await env.BUCKET.put(key, bytes, {
        httpMetadata: { contentType, cacheControl: "public, max-age=31536000, immutable" },
        customMetadata: { ownerUid: uid, originalName: safeName }
      });
      const base = (env.PUBLIC_BASE_URL || "").replace(/\/$/, "");
      return reply(request, env, {
        ok: true,
        key,
        name: safeName,
        contentType,
        size: bytes.byteLength,
        url: base ? `${base}/${key}` : null,
        visibility: "public"
      }, 201);
    } catch (error) {
      return reply(request, env, { error: error && error.message ? error.message : "Upload failed" }, 500);
    }
  }
};
