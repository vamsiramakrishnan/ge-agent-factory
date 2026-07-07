// Security-critical coverage for the gateway JWT verifier. These tests mint
// real ES256 (IAP) and RS256 (Google OIDC) tokens with locally-generated keys,
// stub the JWKS endpoint fetch so the published public key is the one we signed
// with (or deliberately isn't, for the tamper cases), and assert the verifier
// fails closed on every way a token can be wrong: bad signature, wrong alg,
// wrong issuer/audience, expired/not-yet-valid, and malformed input.
import { describe, expect, it, beforeEach, afterEach } from "bun:test";
import { generateKeyPairSync, sign as cryptoSign } from "node:crypto";
import {
  verifyIapJwt,
  verifyGoogleOidcJwt,
  verifyGatewayRequest,
  loadAuthConfigFromEnv,
} from "./iap-jwt.js";

const IAP_ISSUER = "https://cloud.google.com/iap";
const IAP_AUD = "/projects/123/apps/my-app";
const OIDC_AUD = "https://gateway.example.com";

let kidCounter = 0;
function nextKid() {
  kidCounter += 1;
  return `test-kid-${kidCounter}`;
}

function b64url(objOrBuf) {
  const buf = Buffer.isBuffer(objOrBuf) ? objOrBuf : Buffer.from(JSON.stringify(objOrBuf));
  return buf.toString("base64url");
}

function makeEcKey() {
  const { publicKey, privateKey } = generateKeyPairSync("ec", { namedCurve: "P-256" });
  const jwk = { ...publicKey.export({ format: "jwk" }), kid: nextKid(), alg: "ES256", use: "sig" };
  return { privateKey, jwk };
}

function makeRsaKey() {
  const { publicKey, privateKey } = generateKeyPairSync("rsa", { modulusLength: 2048 });
  const jwk = { ...publicKey.export({ format: "jwk" }), kid: nextKid(), alg: "RS256", use: "sig" };
  return { privateKey, jwk };
}

function nowSec() {
  return Math.floor(Date.now() / 1000);
}

// Signs {header,payload} with `privateKey`. `alg` selects the crypto scheme;
// pass header overrides to forge mismatched alg/kid headers.
function signToken(privateKey, kid, payload, { alg = "ES256", headerOverride = {} } = {}) {
  const header = { alg, kid, typ: "JWT", ...headerOverride };
  const signingInput = `${b64url(header)}.${b64url(payload)}`;
  let signature;
  if (alg === "ES256") {
    signature = cryptoSign("sha256", Buffer.from(signingInput), { key: privateKey, dsaEncoding: "ieee-p1363" });
  } else {
    signature = cryptoSign("RSA-SHA256", Buffer.from(signingInput), privateKey);
  }
  return `${signingInput}.${b64url(signature)}`;
}

// Installs a fetch stub that serves the given JWK(s) for any URL. Each entry in
// `jwks` is published as-is, so a test can publish a *different* key than the
// one it signed with to exercise the signature-verification failure path.
let restoreFetch = null;
function stubJwks(jwks) {
  const arr = Array.isArray(jwks) ? jwks : [jwks];
  const original = globalThis.fetch;
  restoreFetch = () => { globalThis.fetch = original; };
  globalThis.fetch = async () => ({
    ok: true,
    status: 200,
    json: async () => ({ keys: arr }),
  });
}

afterEach(() => {
  if (restoreFetch) { restoreFetch(); restoreFetch = null; }
});

function validIapPayload(over = {}) {
  return { iss: IAP_ISSUER, aud: IAP_AUD, sub: "user-1", email: "u@example.com", exp: nowSec() + 3600, iat: nowSec() - 5, ...over };
}

describe("verifyIapJwt — happy path", () => {
  it("accepts a correctly signed IAP token and returns the identity", async () => {
    const { privateKey, jwk } = makeEcKey();
    stubJwks(jwk);
    const token = signToken(privateKey, jwk.kid, validIapPayload());
    const result = await verifyIapJwt(token, IAP_AUD);
    expect(result.kind).toBe("iap");
    expect(result.sub).toBe("user-1");
    expect(result.email).toBe("u@example.com");
  });

  it("accepts an audience array that contains the expected audience", async () => {
    const { privateKey, jwk } = makeEcKey();
    stubJwks(jwk);
    const token = signToken(privateKey, jwk.kid, validIapPayload({ aud: ["other", IAP_AUD] }));
    const result = await verifyIapJwt(token, IAP_AUD);
    expect(result.sub).toBe("user-1");
  });
});

describe("verifyIapJwt — fails closed", () => {
  it("rejects a missing token", async () => {
    await expect(verifyIapJwt("", IAP_AUD)).rejects.toThrow("Missing IAP JWT");
  });

  it("rejects when the expected audience is not configured", async () => {
    await expect(verifyIapJwt("x.y.z", "")).rejects.toThrow("audience not configured");
  });

  it("rejects a malformed (non-3-segment) JWT", async () => {
    await expect(verifyIapJwt("only.two", IAP_AUD)).rejects.toThrow("Malformed JWT");
  });

  it("rejects an unexpected algorithm", async () => {
    const { privateKey, jwk } = makeEcKey();
    stubJwks(jwk);
    // header claims RS256 but audience/kid otherwise fine — alg check comes first
    const token = signToken(privateKey, jwk.kid, validIapPayload(), { headerOverride: { alg: "RS256" } });
    await expect(verifyIapJwt(token, IAP_AUD)).rejects.toThrow("Unexpected IAP alg");
  });

  it("rejects a token whose kid is absent from the header", async () => {
    const { privateKey, jwk } = makeEcKey();
    stubJwks(jwk);
    const header = { alg: "ES256", typ: "JWT" }; // no kid
    const signingInput = `${b64url(header)}.${b64url(validIapPayload())}`;
    const sig = cryptoSign("sha256", Buffer.from(signingInput), { key: privateKey, dsaEncoding: "ieee-p1363" });
    const token = `${signingInput}.${b64url(sig)}`;
    await expect(verifyIapJwt(token, IAP_AUD)).rejects.toThrow("missing kid");
  });

  it("rejects an unknown kid (not published in the JWKS)", async () => {
    const { privateKey, jwk } = makeEcKey();
    const other = makeEcKey();
    stubJwks(other.jwk); // publish a different key's kid
    const token = signToken(privateKey, jwk.kid, validIapPayload());
    await expect(verifyIapJwt(token, IAP_AUD)).rejects.toThrow("Unknown IAP kid");
  });

  it("rejects a tampered signature (signed by a key other than the published one)", async () => {
    const signer = makeEcKey();
    const published = makeEcKey();
    // publish `published` under the SAME kid the token advertises, but sign with `signer`
    published.jwk.kid = signer.jwk.kid;
    stubJwks(published.jwk);
    const token = signToken(signer.privateKey, signer.jwk.kid, validIapPayload());
    await expect(verifyIapJwt(token, IAP_AUD)).rejects.toThrow("signature verification failed");
  });

  it("rejects a wrong issuer", async () => {
    const { privateKey, jwk } = makeEcKey();
    stubJwks(jwk);
    const token = signToken(privateKey, jwk.kid, validIapPayload({ iss: "https://evil.example.com" }));
    await expect(verifyIapJwt(token, IAP_AUD)).rejects.toThrow("Unexpected IAP issuer");
  });

  it("rejects an audience mismatch", async () => {
    const { privateKey, jwk } = makeEcKey();
    stubJwks(jwk);
    const token = signToken(privateKey, jwk.kid, validIapPayload({ aud: "/projects/999/apps/other" }));
    await expect(verifyIapJwt(token, IAP_AUD)).rejects.toThrow("audience mismatch");
  });

  it("rejects an expired token (beyond clock skew)", async () => {
    const { privateKey, jwk } = makeEcKey();
    stubJwks(jwk);
    const token = signToken(privateKey, jwk.kid, validIapPayload({ exp: nowSec() - 120 }));
    await expect(verifyIapJwt(token, IAP_AUD)).rejects.toThrow("Token expired");
  });

  it("rejects a token issued in the future (beyond clock skew)", async () => {
    const { privateKey, jwk } = makeEcKey();
    stubJwks(jwk);
    const token = signToken(privateKey, jwk.kid, validIapPayload({ iat: nowSec() + 600 }));
    await expect(verifyIapJwt(token, IAP_AUD)).rejects.toThrow("issued in the future");
  });

  it("rejects a token that is not yet valid (nbf in the future)", async () => {
    const { privateKey, jwk } = makeEcKey();
    stubJwks(jwk);
    const token = signToken(privateKey, jwk.kid, validIapPayload({ nbf: nowSec() + 600 }));
    await expect(verifyIapJwt(token, IAP_AUD)).rejects.toThrow("not yet valid");
  });
});

describe("verifyGoogleOidcJwt", () => {
  function validOidcPayload(over = {}) {
    return { iss: "https://accounts.google.com", aud: OIDC_AUD, sub: "svc-1", email: "svc@example.com", exp: nowSec() + 3600, iat: nowSec() - 5, ...over };
  }

  it("accepts a correctly signed RS256 token in the allowed-audience list", async () => {
    const { privateKey, jwk } = makeRsaKey();
    stubJwks(jwk);
    const token = signToken(privateKey, jwk.kid, validOidcPayload(), { alg: "RS256" });
    const result = await verifyGoogleOidcJwt(token, [OIDC_AUD]);
    expect(result.kind).toBe("oidc");
    expect(result.sub).toBe("svc-1");
  });

  it("accepts the bare accounts.google.com issuer variant", async () => {
    const { privateKey, jwk } = makeRsaKey();
    stubJwks(jwk);
    const token = signToken(privateKey, jwk.kid, validOidcPayload({ iss: "accounts.google.com" }), { alg: "RS256" });
    const result = await verifyGoogleOidcJwt(token, [OIDC_AUD]);
    expect(result.kind).toBe("oidc");
  });

  it("rejects when the allowed-audience list is empty", async () => {
    await expect(verifyGoogleOidcJwt("x.y.z", [])).rejects.toThrow("OIDC_ALLOWED_AUDIENCES is empty");
  });

  it("rejects an unexpected algorithm", async () => {
    const { privateKey, jwk } = makeRsaKey();
    stubJwks(jwk);
    const token = signToken(privateKey, jwk.kid, validOidcPayload(), { alg: "RS256", headerOverride: { alg: "ES256" } });
    await expect(verifyGoogleOidcJwt(token, [OIDC_AUD])).rejects.toThrow("Unexpected OIDC alg");
  });

  it("rejects an audience outside the allowed list", async () => {
    const { privateKey, jwk } = makeRsaKey();
    stubJwks(jwk);
    const token = signToken(privateKey, jwk.kid, validOidcPayload({ aud: "https://not-allowed.example.com" }), { alg: "RS256" });
    await expect(verifyGoogleOidcJwt(token, [OIDC_AUD])).rejects.toThrow("audience not in allowed list");
  });
});

describe("loadAuthConfigFromEnv", () => {
  it("parses REQUIRE_IAP case-insensitively and splits/trims OIDC audiences", () => {
    const cfg = loadAuthConfigFromEnv({
      REQUIRE_IAP: "TRUE",
      IAP_EXPECTED_AUDIENCE: IAP_AUD,
      OIDC_ALLOWED_AUDIENCES: " a , b ,,c ",
    });
    expect(cfg.requireIap).toBe(true);
    expect(cfg.iapAudience).toBe(IAP_AUD);
    expect(cfg.oidcAudiences).toEqual(["a", "b", "c"]);
  });

  it("defaults to closed-ish empty config when env is empty", () => {
    const cfg = loadAuthConfigFromEnv({});
    expect(cfg.requireIap).toBe(false);
    expect(cfg.iapAudience).toBe("");
    expect(cfg.oidcAudiences).toEqual([]);
  });
});

describe("verifyGatewayRequest routing", () => {
  it("routes the IAP assertion header to the IAP verifier", async () => {
    const { privateKey, jwk } = makeEcKey();
    stubJwks(jwk);
    const token = signToken(privateKey, jwk.kid, validIapPayload());
    const req = { headers: new Headers({ "x-goog-iap-jwt-assertion": token }) };
    const result = await verifyGatewayRequest(req, { iapAudience: IAP_AUD, oidcAudiences: [] });
    expect(result.kind).toBe("iap");
  });

  it("routes an Authorization: Bearer token to the OIDC verifier", async () => {
    const { privateKey, jwk } = makeRsaKey();
    stubJwks(jwk);
    const token = signToken(privateKey, jwk.kid, { iss: "https://accounts.google.com", aud: OIDC_AUD, sub: "svc", exp: nowSec() + 3600 }, { alg: "RS256" });
    const req = { headers: new Headers({ authorization: `Bearer ${token}` }) };
    const result = await verifyGatewayRequest(req, { iapAudience: IAP_AUD, oidcAudiences: [OIDC_AUD] });
    expect(result.kind).toBe("oidc");
  });

  it("rejects a request with neither an IAP header nor a bearer token", async () => {
    const req = { headers: new Headers({}) };
    await expect(verifyGatewayRequest(req, { iapAudience: IAP_AUD, oidcAudiences: [OIDC_AUD] }))
      .rejects.toThrow("No IAP JWT or OIDC bearer token present");
  });
});
