import { test, expect } from "bun:test";
import { parseConcurrency } from "./concurrency.mjs";

test("valid integers pass through", () => {
  expect(parseConcurrency(1)).toBe(1);
  expect(parseConcurrency("5")).toBe(5);
  expect(parseConcurrency(20)).toBe(20);
});

test("missing/empty falls back", () => {
  expect(parseConcurrency(undefined)).toBe(2);
  expect(parseConcurrency(null)).toBe(2);
  expect(parseConcurrency("")).toBe(2);
  expect(parseConcurrency(undefined, { fallback: 4 })).toBe(4);
});

test("non-integers throw", () => {
  expect(() => parseConcurrency("nope")).toThrow();
  expect(() => parseConcurrency("2.5")).toThrow();
  expect(() => parseConcurrency(1.5)).toThrow();
});

test("out-of-range throws", () => {
  expect(() => parseConcurrency(0)).toThrow();
  expect(() => parseConcurrency(-3)).toThrow();
  expect(() => parseConcurrency(999)).toThrow();
});
