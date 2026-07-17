/**
 * Read-only REST connector used by every JavaScript live-system caller.
 *
 * The connector deliberately owns URL construction, target policy, redirect
 * handling, authentication, response limits, and error sanitization. Callers
 * supply an operation; they never get a lower-level "fetch this URL" escape
 * hatch that could bypass those controls.
 */
import { lookup as dnsLookup } from "node:dns/promises";
import { request as httpRequest } from "node:http";
import { request as httpsRequest } from "node:https";
import { isIP } from "node:net";
import { Readable } from "node:stream";

/** HTTP methods the connector will ever emit. Frozen: this IS the write guard. */
export const READ_METHODS = Object.freeze(["GET", "HEAD"]);
export const DEFAULT_MAX_RESPONSE_BYTES = 1_048_576;
export const MAX_RESPONSE_BYTES_HARD_CAP = 16_777_216;

const AUTH_REF = /^env:([A-Z][A-Z0-9_]*)$/;
const REDIRECT_STATUSES = new Set([301, 302, 303, 307, 308]);
const BLOCKED_HOSTNAMES = new Set(["localhost", "metadata.google.internal"]);
const BLOCKED_HEADERS = new Set([
  "authorization",
  "cookie",
  "host",
  "proxy-authorization",
  "x-forwarded-for",
  "x-forwarded-host",
]);

export class ConnectorError extends Error {
  constructor(code, message) {
    super(message);
    this.name = "ConnectorError";
    this.code = code;
  }
}

function policyError(code, message) {
  throw new ConnectorError(code, message);
}

function isPublicIpv4(address) {
  const octets = address.split(".").map(Number);
  if (octets.length !== 4 || octets.some((value) => !Number.isInteger(value) || value < 0 || value > 255)) return false;
  const [a, b, c] = octets;
  return !(
    a === 0 ||
    a === 10 ||
    a === 127 ||
    (a === 100 && b >= 64 && b <= 127) ||
    (a === 169 && b === 254) ||
    (a === 172 && b >= 16 && b <= 31) ||
    (a === 192 && b === 0 && c === 0) ||
    (a === 192 && b === 0 && c === 2) ||
    (a === 192 && b === 168) ||
    (a === 198 && (b === 18 || b === 19)) ||
    (a === 198 && b === 51 && c === 100) ||
    (a === 203 && b === 0 && c === 113) ||
    a >= 224
  );
}

/** True only for addresses safe to dial under the default public-network policy. */
export function isPublicAddress(address) {
  const value = String(address || "").toLowerCase().split("%")[0];
  const family = isIP(value);
  if (family === 4) return isPublicIpv4(value);
  if (family !== 6) return false;
  if (value === "::" || value === "::1" || value.startsWith("fc") || value.startsWith("fd")) return false;
  if (/^fe[89ab]/.test(value) || value.startsWith("ff") || value.startsWith("2001:db8:")) return false;
  if (value.startsWith("::ffff:")) return isPublicIpv4(value.slice("::ffff:".length));
  return true;
}

function rawPathFromUrl(value) {
  const text = String(value);
  const scheme = text.indexOf("://");
  if (scheme < 0) return "";
  const start = text.indexOf("/", scheme + 3);
  if (start < 0) return "";
  return text.slice(start).split(/[?#]/, 1)[0];
}

function decodedSegment(segment) {
  let value = segment;
  for (let i = 0; i < 2; i += 1) {
    try {
      const decoded = decodeURIComponent(value);
      if (decoded === value) break;
      value = decoded;
    } catch {
      policyError("invalid_path", "request path contains invalid percent encoding");
    }
  }
  return value;
}

function assertCanonicalPath(rawPath) {
  if (rawPath.includes("\\")) policyError("invalid_path", "request path must not contain backslashes");
  for (const segment of rawPath.split("/")) {
    const decoded = decodedSegment(segment);
    if (decoded === "." || decoded === ".." || decoded.includes("/") || decoded.includes("\\")) {
      policyError("path_escape", "request path must stay within the configured base path");
    }
  }
}

function normalizePolicy(policy = {}) {
  const allowedHosts = policy.allowedHosts;
  if (allowedHosts != null && (!Array.isArray(allowedHosts) || allowedHosts.some((host) => typeof host !== "string"))) {
    policyError("invalid_policy", "allowedHosts must be an array of host names when present");
  }
  return {
    allowInsecureHttp: policy.allowInsecureHttp === true,
    allowPrivateNetwork: policy.allowPrivateNetwork === true,
    allowedHosts: allowedHosts?.map((host) => host.toLowerCase()) ?? null,
  };
}

/**
 * Perform the synchronous part of target validation. The returned URL has a
 * canonical directory pathname and never carries credentials/query/fragment.
 */
export function validateRestTarget(baseUrl, policy = {}) {
  const normalized = normalizePolicy(policy);
  let url;
  try {
    url = new URL(String(baseUrl));
  } catch {
    policyError("invalid_target", "connector requires a valid HTTPS base URL");
  }
  if (url.protocol !== "https:" && !(url.protocol === "http:" && normalized.allowInsecureHttp)) {
    policyError("insecure_target", "connector requires HTTPS unless allowInsecureHttp is explicitly enabled");
  }
  if (url.username || url.password) policyError("target_userinfo", "connector target must not contain user information");
  if (url.search || url.hash) policyError("invalid_target", "connector target must not contain a query or fragment");
  if (!url.hostname) policyError("invalid_target", "connector target must include a host name");
  assertCanonicalPath(rawPathFromUrl(baseUrl));

  const hostname = url.hostname.toLowerCase().replace(/^\[|\]$/g, "");
  if (normalized.allowedHosts && !normalized.allowedHosts.includes(hostname)) {
    policyError("host_not_allowed", "connector target host is not in allowedHosts");
  }
  const staticallyPrivate = BLOCKED_HOSTNAMES.has(hostname) || hostname.endsWith(".localhost") || (isIP(hostname) && !isPublicAddress(hostname));
  if (staticallyPrivate && !normalized.allowPrivateNetwork) {
    policyError("private_target", "connector target resolves outside the public network; enable allowPrivateNetwork explicitly to permit it");
  }
  url.pathname = url.pathname.endsWith("/") ? url.pathname : `${url.pathname}/`;
  return url;
}

async function defaultResolveHost(hostname) {
  return dnsLookup(hostname, { all: true, verbatim: true });
}

async function resolvePinnedTarget(url, policy, resolveHost) {
  const hostname = url.hostname.toLowerCase().replace(/^\[|\]$/g, "");
  const literalFamily = isIP(hostname);
  if (literalFamily) return { address: hostname, family: literalFamily };
  let answers;
  try {
    answers = await resolveHost(hostname);
  } catch {
    policyError("target_unresolved", "connector target host could not be resolved");
  }
  const addresses = (Array.isArray(answers) ? answers : [answers])
    .map((answer) => (typeof answer === "string" ? answer : answer?.address))
    .filter(Boolean)
    .map((address) => ({ address: String(address).split("%", 1)[0], family: isIP(String(address).split("%", 1)[0]) }))
    .filter(({ family }) => family === 4 || family === 6);
  if (!addresses.length) policyError("target_unresolved", "connector target host could not be resolved");
  if (!policy.allowPrivateNetwork && addresses.some(({ address }) => !isPublicAddress(address))) {
    policyError("private_target", "connector target resolves outside the public network; enable allowPrivateNetwork explicitly to permit it");
  }
  return addresses[0];
}

function pinnedLookup(pinned) {
  return (_hostname, options, callback) => {
    const cb = typeof options === "function" ? options : callback;
    const wantsAll = typeof options === "object" && options?.all === true;
    if (wantsAll) cb(null, [pinned]);
    else cb(null, pinned.address, pinned.family);
  };
}

function responseHeaders(rawHeaders) {
  const headers = new Headers();
  for (const [name, value] of Object.entries(rawHeaders || {})) {
    if (Array.isArray(value)) {
      for (const item of value) headers.append(name, item);
    } else if (value !== undefined) {
      headers.set(name, String(value));
    }
  }
  return headers;
}

/**
 * Dial a previously validated numeric address while retaining the original
 * hostname for Host, TLS SNI, and certificate verification. The lookup hook
 * is deliberately closed over the pinned address, so the HTTP stack cannot
 * perform a second DNS lookup after policy validation.
 */
function pinnedNodeFetch(urlValue, init, pinned, requestImpl) {
  const url = new URL(urlValue);
  const hostname = url.hostname.replace(/^\[|\]$/g, "");
  const request = requestImpl || (url.protocol === "https:" ? httpsRequest : httpRequest);
  const headers = { ...init.headers, host: url.host };
  const options = {
    protocol: url.protocol,
    hostname,
    port: url.port || undefined,
    path: `${url.pathname}${url.search}`,
    method: init.method,
    headers,
    signal: init.signal,
    lookup: pinnedLookup(pinned),
    ...(url.protocol === "https:"
      ? {
          rejectUnauthorized: true,
          ...(isIP(hostname) ? {} : { servername: hostname }),
        }
      : {}),
  };
  return new Promise((resolve, reject) => {
    const outgoing = request(options, (incoming) => {
      const status = Number(incoming.statusCode || 0);
      resolve({
        ok: status >= 200 && status < 300,
        status,
        headers: responseHeaders(incoming.headers),
        body: Readable.toWeb(incoming),
      });
    });
    outgoing.once("error", reject);
    outgoing.end();
  });
}

/** Resolve an auth reference at call time; only the env-var name can appear in errors. */
export function resolveAuthRef(authRef, env = process.env) {
  if (authRef === undefined || authRef === null || authRef === "" || authRef === "none") return null;
  const match = AUTH_REF.exec(String(authRef));
  if (!match) throw new ConnectorError("invalid_auth_ref", "unsupported auth reference — expected env:<VAR> or none");
  const value = env[match[1]];
  if (!value) throw new ConnectorError("auth_unresolved", `auth env var ${match[1]} is not set`);
  return value;
}

function requestUrl(base, path, query) {
  const raw = String(path || "").replace(/^\/+/, "");
  if (raw.includes("?") || raw.includes("#")) policyError("invalid_path", "request path must not contain a query or fragment");
  assertCanonicalPath(raw);
  const url = new URL(raw, base);
  if (url.origin !== base.origin || !url.pathname.startsWith(base.pathname)) {
    policyError("path_escape", "request path must stay within the configured base path");
  }
  if (query !== undefined && (query === null || typeof query !== "object" || Array.isArray(query))) {
    policyError("invalid_query", "query must be a plain object");
  }
  for (const [key, value] of Object.entries(query || {})) {
    if (value === undefined || value === null) continue;
    if (!["string", "number", "boolean"].includes(typeof value)) policyError("invalid_query", "query values must be scalar");
    url.searchParams.set(key, String(value));
  }
  return url;
}

function safeHeaders(headers, token) {
  if (!headers || typeof headers !== "object" || Array.isArray(headers)) policyError("invalid_headers", "headers must be a plain object");
  const output = { accept: "application/json" };
  for (const [name, value] of Object.entries(headers)) {
    if (BLOCKED_HEADERS.has(name.toLowerCase())) policyError("unsafe_header", "caller supplied a credential-bearing transport header");
    if (typeof value !== "string") policyError("invalid_headers", "header values must be strings");
    output[name] = value;
  }
  if (token) output.authorization = `Bearer ${token}`;
  return output;
}

async function readBoundedText(response, limit) {
  const length = Number(response.headers?.get?.("content-length"));
  if (Number.isFinite(length) && length > limit) policyError("response_too_large", `live response exceeded the ${limit}-byte limit`);
  if (!response.body) return "";
  const reader = response.body.getReader();
  const chunks = [];
  let total = 0;
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      total += value.byteLength;
      if (total > limit) {
        await reader.cancel();
        policyError("response_too_large", `live response exceeded the ${limit}-byte limit`);
      }
      chunks.push(value);
    }
  } finally {
    reader.releaseLock();
  }
  const bytes = new Uint8Array(total);
  let offset = 0;
  for (const chunk of chunks) {
    bytes.set(chunk, offset);
    offset += chunk.byteLength;
  }
  return new TextDecoder().decode(bytes);
}

async function closeRedirectBody(response) {
  if (!response.body) return;
  if (typeof response.body.cancel === "function") {
    await response.body.cancel();
    return;
  }
  if (typeof response.body.destroy === "function") response.body.destroy();
}

function safeUrl(url) {
  return `${url.origin}${url.pathname}`;
}

/** Create a policy-enforcing, read-only REST connector for one live system. */
export function createRestConnector({
  baseUrl,
  authRef,
  timeoutMs = 10_000,
  maxResponseBytes = DEFAULT_MAX_RESPONSE_BYTES,
  allowInsecureHttp = false,
  allowPrivateNetwork = false,
  allowedHosts,
  env = process.env,
  fetchImpl = fetch,
  resolveHost = defaultResolveHost,
  requestImpl,
  maxRedirects = 3,
} = {}) {
  const policy = normalizePolicy({ allowInsecureHttp, allowPrivateNetwork, allowedHosts });
  const base = validateRestTarget(baseUrl, policy);
  if (authRef !== undefined && authRef !== null && authRef !== "" && authRef !== "none" && !AUTH_REF.test(String(authRef))) {
    throw new ConnectorError("invalid_auth_ref", "unsupported auth reference — expected env:<VAR> or none");
  }
  if (!Number.isFinite(timeoutMs) || timeoutMs <= 0) policyError("invalid_policy", "timeoutMs must be a positive number");
  if (!Number.isSafeInteger(maxResponseBytes) || maxResponseBytes <= 0 || maxResponseBytes > MAX_RESPONSE_BYTES_HARD_CAP) {
    policyError("invalid_policy", `maxResponseBytes must be an integer between 1 and ${MAX_RESPONSE_BYTES_HARD_CAP}`);
  }
  if (!Number.isSafeInteger(maxRedirects) || maxRedirects < 0 || maxRedirects > 10) {
    policyError("invalid_policy", "maxRedirects must be an integer between 0 and 10");
  }

  async function request({ method = "GET", path = "", query, headers = {} } = {}) {
    const verb = String(method).toUpperCase();
    if (!READ_METHODS.includes(verb)) {
      throw new ConnectorError("write_refused", "connector-core is read-only: refusing a write-class method");
    }
    let url = requestUrl(base, path, query);
    const pinned = await resolvePinnedTarget(url, policy, resolveHost);
    const token = resolveAuthRef(authRef, env);
    const outboundHeaders = safeHeaders(headers, token);
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);
    const startedAt = performance.now();
    try {
      for (let redirects = 0; ; redirects += 1) {
        const init = {
          method: verb,
          headers: outboundHeaders,
          signal: controller.signal,
          redirect: "manual",
        };
        const response = fetchImpl === fetch || requestImpl
          ? await pinnedNodeFetch(url.href, init, pinned, requestImpl)
          : await fetchImpl(url.href, init, { pinnedAddress: pinned.address, pinnedFamily: pinned.family });
        if (REDIRECT_STATUSES.has(response.status) && response.headers.get("location")) {
          await closeRedirectBody(response);
          if (redirects >= maxRedirects) throw new ConnectorError("redirect_limit", "live request exceeded the redirect limit");
          const next = new URL(response.headers.get("location"), url);
          if (next.origin !== base.origin) throw new ConnectorError("unsafe_redirect", "live target attempted a cross-origin redirect");
          assertCanonicalPath(next.pathname);
          if (!next.pathname.startsWith(base.pathname)) throw new ConnectorError("path_escape", "live target redirect escaped the configured base path");
          url = next;
          continue;
        }
        const latencyMs = Math.round(performance.now() - startedAt);
        const text = verb === "HEAD" ? "" : await readBoundedText(response, maxResponseBytes);
        let body = null;
        if (text) {
          try {
            body = JSON.parse(text);
          } catch {
            body = { raw: text };
          }
        }
        return { ok: response.ok, status: response.status, latencyMs, body, url: safeUrl(url) };
      }
    } catch (error) {
      const latencyMs = Math.round(performance.now() - startedAt);
      const wrapped = error instanceof ConnectorError
        ? error
        : new ConnectorError(error?.name === "AbortError" ? "timeout" : "network_error", error?.name === "AbortError" ? `live request timed out after ${timeoutMs}ms` : "live request failed");
      wrapped.latencyMs = latencyMs;
      throw wrapped;
    } finally {
      clearTimeout(timer);
    }
  }

  return {
    call: (op = {}) => request(op),
    async probe() {
      try {
        let result = await request({ method: "HEAD" });
        if (result.status === 405 || result.status === 501) result = await request({ method: "GET" });
        return {
          reachable: result.status < 500,
          authorized: result.status !== 401 && result.status !== 403,
          status: result.status,
          latencyMs: result.latencyMs,
        };
      } catch (error) {
        return {
          reachable: false,
          authorized: null,
          status: null,
          latencyMs: error?.latencyMs ?? null,
          detail: error.message,
          code: error.code || "network_error",
        };
      }
    },
  };
}

/** Probe one stored REST binding through the same connector seam. */
export async function probeRestBinding(binding, {
  env = process.env,
  fetchImpl = fetch,
  resolveHost = defaultResolveHost,
  timeoutMs = 10_000,
} = {}) {
  if (!binding || binding.kind !== "rest") {
    return { system: binding?.system ?? null, dialable: false, kind: binding?.kind ?? null };
  }
  const authRef = binding.config?.authEnv ? `env:${binding.config.authEnv}` : "none";
  try {
    const connector = createRestConnector({
      baseUrl: binding.boundTo,
      authRef,
      env,
      fetchImpl,
      resolveHost,
      timeoutMs: binding.config?.timeoutMs ?? timeoutMs,
      maxResponseBytes: binding.config?.maxResponseBytes ?? DEFAULT_MAX_RESPONSE_BYTES,
      allowInsecureHttp: binding.config?.allowInsecureHttp === true,
      allowPrivateNetwork: binding.config?.allowPrivateNetwork === true,
      allowedHosts: binding.config?.allowedHosts,
    });
    return { system: binding.system, dialable: true, ...(await connector.probe()) };
  } catch (error) {
    return {
      system: binding.system,
      dialable: true,
      reachable: false,
      authorized: null,
      status: null,
      detail: error.message,
      code: error.code || "connector_error",
    };
  }
}
