import { createPublicKey, verify as cryptoVerify } from "node:crypto";

const IAP_JWK_URL = "https://www.gstatic.com/iap/verify/public_key-jwk";
const GOOGLE_OIDC_JWK_URL = "https://www.googleapis.com/oauth2/v3/certs";
const IAP_ISSUER = "https://cloud.google.com/iap";
const GOOGLE_OIDC_ISSUERS = new Set(["https://accounts.google.com", "accounts.google.com"]);
const CLOCK_SKEW_SECONDS = 30;
const JWK_TTL_MS = 6 * 60 * 60 * 1000;

const jwkCache = new Map();
const inflightFetches = new Map();

function base64UrlToBuffer(str) {
  const padLen = (4 - (str.length % 4)) % 4;
  const base64 = (str + "=".repeat(padLen)).replace(/-/g, "+").replace(/_/g, "/");
  return Buffer.from(base64, "base64");
}

async function fetchJwks(url) {
  if (inflightFetches.has(url)) return inflightFetches.get(url);
  const promise = (async () => {
    const res = await fetch(url, { signal: AbortSignal.timeout(5000) });
    if (!res.ok) throw new Error(`JWK fetch failed (${url}): HTTP ${res.status}`);
    const data = await res.json();
    const keys = new Map();
    for (const key of data.keys || []) {
      if (key.kid) keys.set(key.kid, key);
    }
    jwkCache.set(url, { keys, fetchedAt: Date.now() });
    return keys;
  })();
  inflightFetches.set(url, promise);
  try {
    return await promise;
  } finally {
    inflightFetches.delete(url);
  }
}

async function getJwk(url, kid) {
  const cached = jwkCache.get(url);
  if (cached && cached.keys.has(kid) && Date.now() - cached.fetchedAt < JWK_TTL_MS) {
    return cached.keys.get(kid);
  }
  const keys = await fetchJwks(url);
  return keys.get(kid) || null;
}

function parseJwt(token) {
  const segments = String(token || "").split(".");
  if (segments.length !== 3) throw new Error("Malformed JWT (expected 3 segments)");
  const [headerB64, payloadB64, signatureB64] = segments;
  const header = JSON.parse(base64UrlToBuffer(headerB64).toString("utf8"));
  const payload = JSON.parse(base64UrlToBuffer(payloadB64).toString("utf8"));
  const signature = base64UrlToBuffer(signatureB64);
  const signedData = Buffer.from(`${headerB64}.${payloadB64}`);
  return { header, payload, signature, signedData };
}

function checkTimeClaims(payload) {
  const now = Math.floor(Date.now() / 1000);
  if (typeof payload.exp !== "number" || payload.exp + CLOCK_SKEW_SECONDS < now) {
    throw new Error("Token expired");
  }
  if (typeof payload.iat === "number" && payload.iat - CLOCK_SKEW_SECONDS > now) {
    throw new Error("Token issued in the future");
  }
  if (typeof payload.nbf === "number" && payload.nbf - CLOCK_SKEW_SECONDS > now) {
    throw new Error("Token not yet valid");
  }
}

function audienceMatches(payload, expected) {
  const audClaim = payload.aud;
  const audSet = new Set(Array.isArray(audClaim) ? audClaim : [audClaim]);
  return audSet.has(expected);
}

export async function verifyIapJwt(token, expectedAudience) {
  if (!token) throw new Error("Missing IAP JWT");
  if (!expectedAudience) throw new Error("IAP audience not configured");
  const { header, payload, signature, signedData } = parseJwt(token);
  if (header.alg !== "ES256") throw new Error(`Unexpected IAP alg: ${header.alg}`);
  if (!header.kid) throw new Error("IAP JWT missing kid");
  const jwk = await getJwk(IAP_JWK_URL, header.kid);
  if (!jwk) throw new Error(`Unknown IAP kid: ${header.kid}`);
  const pubKey = createPublicKey({ key: jwk, format: "jwk" });
  const ok = cryptoVerify("sha256", signedData, { key: pubKey, dsaEncoding: "ieee-p1363" }, signature);
  if (!ok) throw new Error("IAP signature verification failed");
  if (payload.iss !== IAP_ISSUER) throw new Error(`Unexpected IAP issuer: ${payload.iss}`);
  if (!audienceMatches(payload, expectedAudience)) {
    throw new Error(`IAP audience mismatch (expected ${expectedAudience})`);
  }
  checkTimeClaims(payload);
  return { kind: "iap", sub: payload.sub, email: payload.email, payload };
}

export async function verifyGoogleOidcJwt(token, allowedAudiences) {
  if (!token) throw new Error("Missing OIDC bearer token");
  if (!allowedAudiences || allowedAudiences.length === 0) {
    throw new Error("OIDC bearer presented but OIDC_ALLOWED_AUDIENCES is empty");
  }
  const { header, payload, signature, signedData } = parseJwt(token);
  if (header.alg !== "RS256") throw new Error(`Unexpected OIDC alg: ${header.alg}`);
  if (!header.kid) throw new Error("OIDC JWT missing kid");
  const jwk = await getJwk(GOOGLE_OIDC_JWK_URL, header.kid);
  if (!jwk) throw new Error(`Unknown Google OIDC kid: ${header.kid}`);
  const pubKey = createPublicKey({ key: jwk, format: "jwk" });
  const ok = cryptoVerify("RSA-SHA256", signedData, pubKey, signature);
  if (!ok) throw new Error("OIDC signature verification failed");
  if (!GOOGLE_OIDC_ISSUERS.has(payload.iss)) throw new Error(`Unexpected OIDC issuer: ${payload.iss}`);
  const allowed = allowedAudiences.some((aud) => audienceMatches(payload, aud));
  if (!allowed) throw new Error("OIDC audience not in allowed list");
  checkTimeClaims(payload);
  return { kind: "oidc", sub: payload.sub, email: payload.email, payload };
}

export function loadAuthConfigFromEnv(env = process.env) {
  const requireIap = String(env.REQUIRE_IAP || "false").toLowerCase() === "true";
  const iapAudience = env.IAP_EXPECTED_AUDIENCE || "";
  const oidcAudiences = String(env.OIDC_ALLOWED_AUDIENCES || "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
  return { requireIap, iapAudience, oidcAudiences };
}

export async function verifyGatewayRequest(req, { iapAudience, oidcAudiences } = {}) {
  const iapHeader = req.headers.get("x-goog-iap-jwt-assertion");
  if (iapHeader) {
    return await verifyIapJwt(iapHeader, iapAudience);
  }
  const authHeader = req.headers.get("authorization") || "";
  const bearerMatch = authHeader.match(/^Bearer\s+(\S+)$/i);
  if (bearerMatch) {
    return await verifyGoogleOidcJwt(bearerMatch[1], oidcAudiences);
  }
  throw new Error("No IAP JWT or OIDC bearer token present");
}
