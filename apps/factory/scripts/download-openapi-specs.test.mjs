// download-openapi-specs.test.mjs
//
// Unit tests for the retry-eligibility classifiers used by fetchWithTimeout:
// isRetryableFetchError (network-level failures) and isRetryableStatus (HTTP
// response codes). Both are pure, dependency-free functions — no p-retry
// import needed to exercise them, so these run even before the p-retry
// dependency is added to the repo. The end-to-end retry path (via p-retry)
// is exercised separately once that dependency lands.
//
// Run with: bun test.

import { test, expect } from "bun:test";
import { isRetryableFetchError, isRetryableStatus } from "./download-openapi-specs.mjs";

// --- isRetryableStatus -------------------------------------------------------

test("isRetryableStatus: retries 429 (rate limited)", () => {
  expect(isRetryableStatus(429)).toBe(true);
});

test("isRetryableStatus: retries the 5xx range", () => {
  expect(isRetryableStatus(500)).toBe(true);
  expect(isRetryableStatus(502)).toBe(true);
  expect(isRetryableStatus(503)).toBe(true);
  expect(isRetryableStatus(599)).toBe(true);
});

test("isRetryableStatus: does not retry 2xx/3xx success or redirect codes", () => {
  expect(isRetryableStatus(200)).toBe(false);
  expect(isRetryableStatus(204)).toBe(false);
  expect(isRetryableStatus(301)).toBe(false);
  expect(isRetryableStatus(304)).toBe(false);
});

test("isRetryableStatus: does not retry 4xx client errors other than 429", () => {
  expect(isRetryableStatus(400)).toBe(false);
  expect(isRetryableStatus(401)).toBe(false);
  expect(isRetryableStatus(403)).toBe(false);
  expect(isRetryableStatus(404)).toBe(false);
  expect(isRetryableStatus(422)).toBe(false);
});

test("isRetryableStatus: boundaries around the 5xx range", () => {
  expect(isRetryableStatus(499)).toBe(false);
  expect(isRetryableStatus(600)).toBe(false);
});

// --- isRetryableFetchError ----------------------------------------------------

test("isRetryableFetchError: retries known transient Node error codes", () => {
  for (const code of ["ECONNRESET", "ECONNREFUSED", "ETIMEDOUT", "EPIPE", "EAI_AGAIN", "ENOTFOUND", "ENETUNREACH", "EHOSTUNREACH"]) {
    const error = Object.assign(new Error(`simulated ${code}`), { code });
    expect(isRetryableFetchError(error)).toBe(true);
  }
});

test("isRetryableFetchError: retries our own timeout firing (AbortSignal-style)", () => {
  const timeoutError = Object.assign(new Error("The operation was aborted"), { name: "TimeoutError" });
  expect(isRetryableFetchError(timeoutError)).toBe(true);

  const abortError = Object.assign(new Error("The operation was aborted"), { name: "AbortError" });
  expect(isRetryableFetchError(abortError)).toBe(true);
});

test("isRetryableFetchError: does not retry a malformed URL (TypeError, no code, no Abort/Timeout name)", () => {
  const invalidUrlError = new TypeError("Invalid URL");
  expect(isRetryableFetchError(invalidUrlError)).toBe(false);
});

test("isRetryableFetchError: does not retry unrelated/unknown errors", () => {
  expect(isRetryableFetchError(new Error("something unexpected"))).toBe(false);
  expect(isRetryableFetchError(Object.assign(new Error("permission denied"), { code: "EACCES" }))).toBe(false);
});

test("isRetryableFetchError: handles nullish input defensively", () => {
  expect(isRetryableFetchError(null)).toBe(false);
  expect(isRetryableFetchError(undefined)).toBe(false);
});
