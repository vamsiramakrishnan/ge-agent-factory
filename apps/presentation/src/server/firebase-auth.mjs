import { importX509, jwtVerify, decodeProtectedHeader } from "jose";
const CERTS_URL = "https://www.googleapis.com/robot/v1/metadata/x509/securetoken@system.gserviceaccount.com";
let cache = { expMs: 0, certs: {} };
async function getCerts() {
  if (Date.now() < cache.expMs && Object.keys(cache.certs).length) return cache.certs;
  const res = await fetch(CERTS_URL);
  if (!res.ok) throw new Error(`securetoken certs ${res.status}`);
  const certs = await res.json();
  const m = (res.headers.get("cache-control") || "").match(/max-age=(\d+)/);
  cache = { expMs: Date.now() + (m ? Number(m[1]) * 1000 : 3600000), certs };
  return certs;
}
export function firebaseAuthMode() {
  return String(process.env.GE_AUTH_MODE || "").toLowerCase() === "firebase";
}
function projectId() { return process.env.FIREBASE_PROJECT_ID || process.env.GOOGLE_CLOUD_PROJECT || ""; }
export function bearerFrom(authHeader, url) {
  const m = /^Bearer\s+(.+)$/i.exec(authHeader || "");
  if (m) return m[1];
  try { const u = new URL(url, "http://localhost"); return u.searchParams.get("access_token"); } catch { return null; }
}
export async function verifyFirebaseIdToken(token) {
  const pid = projectId();
  if (!pid) throw new Error("no project id for firebase verification");
  const { kid, alg } = decodeProtectedHeader(token);
  if (alg !== "RS256") throw new Error("unexpected alg");
  const pem = (await getCerts())[kid];
  if (!pem) throw new Error("unknown key id");
  const key = await importX509(pem, "RS256");
  const { payload } = await jwtVerify(token, key, { issuer: `https://securetoken.google.com/${pid}`, audience: pid });
  if (!payload.sub) throw new Error("missing sub");
  return payload;
}
