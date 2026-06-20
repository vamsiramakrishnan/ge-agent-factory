import { expect, test } from "bun:test";
import { assertRemoteAuthorized } from "./remote-guard.mjs";

test("throws in local mode (the fail-safe default)", () => {
  expect(() => assertRemoteAuthorized("ge data up", { mode: "local", env: {} })).toThrow(/remote mode/i);
});

test("throws when mode is unset (treated as local)", () => {
  expect(() => assertRemoteAuthorized("ge data up", { env: {} })).toThrow(/remote mode/i);
});

test("throws in remote mode without explicit confirmation", () => {
  expect(() => assertRemoteAuthorized("ge data up", { mode: "remote", env: {} })).toThrow(/GE_CONFIRM/);
});

test("authorizes remote mode with GE_CONFIRM=1", () => {
  expect(assertRemoteAuthorized("ge data up", { mode: "remote", env: { GE_CONFIRM: "1" } })).toEqual({
    authorized: true,
    dryRun: false,
  });
});

test("allows a dry run in remote mode without confirmation", () => {
  expect(assertRemoteAuthorized("ge data up", { mode: "remote", env: { GE_DRY_RUN: "1" } })).toEqual({
    authorized: true,
    dryRun: true,
  });
});

test("the error names the action so operators know what was blocked", () => {
  expect(() => assertRemoteAuthorized("ge agents deploy", { mode: "local", env: {} })).toThrow(/ge agents deploy/);
});
