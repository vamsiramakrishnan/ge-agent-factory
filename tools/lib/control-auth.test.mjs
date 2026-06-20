import { expect, test } from "bun:test";
import { controlAuthVerdict } from "./control-auth.mjs";

test("allows loopback requests when no token is configured (local dev)", () => {
  expect(controlAuthVerdict({ host: "localhost:17655" }, { token: undefined }).ok).toBe(true);
  expect(controlAuthVerdict({ host: "127.0.0.1:17655" }, { token: undefined }).ok).toBe(true);
});

test("blocks non-loopback Host with no token (DNS-rebinding defense)", () => {
  const verdict = controlAuthVerdict({ host: "evil.example.com" }, { token: undefined });
  expect(verdict.ok).toBe(false);
  expect(verdict.status).toBe(403);
});

test("requires the token when one is configured, regardless of host", () => {
  expect(controlAuthVerdict({ host: "ge.internal", authorization: "Bearer s3cr3t" }, { token: "s3cr3t" }).ok).toBe(true);
  expect(controlAuthVerdict({ host: "ge.internal", "x-ge-token": "s3cr3t" }, { token: "s3cr3t" }).ok).toBe(true);
});

test("rejects a missing or wrong token when one is configured", () => {
  expect(controlAuthVerdict({ host: "localhost" }, { token: "s3cr3t" }).status).toBe(401);
  expect(controlAuthVerdict({ host: "localhost", authorization: "Bearer nope" }, { token: "s3cr3t" }).status).toBe(401);
});
