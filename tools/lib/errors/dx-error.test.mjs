// Unit contract for the four-field error shape (CS-4 of the Language & DX
// refactor). If this shape changes, every renderer (CLI stderr, --json,
// MCP isError content) changes with it — treat edits as interface changes.
import { test, expect } from "bun:test";
import { DxError, dxError, isDxError, dxErrorShape } from "./dx-error.mjs";

test("DxError carries what/where/why/fix and stays a real Error", () => {
  const e = new DxError("thing failed.", { where: "config: project", why: "because", fix: "ge init" });
  expect(e).toBeInstanceOf(Error);
  expect(e.message).toBe("thing failed."); // what doubles as message → old renderers unchanged
  expect(e.what).toBe("thing failed.");
  expect(e.where).toBe("config: project");
  expect(e.why).toBe("because");
  expect(e.fix).toBe("ge init");
});

test("fix aliases onto hint so pre-existing err.hint readers keep working", () => {
  const e = dxError("x", { fix: "ge doctor" });
  expect(e.hint).toBe("ge doctor");
});

test("isDxError accepts instances and structural shapes, rejects plain Errors", () => {
  expect(isDxError(new DxError("x", { fix: "y" }))).toBe(true);
  expect(isDxError({ what: "x", why: null, fix: "y" })).toBe(true); // wire shape (e.g. re-hydrated from JSON)
  expect(isDxError(new Error("plain"))).toBe(false);
  expect(isDxError(null)).toBe(false);
});

test("dxErrorShape emits the exact wire contract", () => {
  const shape = dxErrorShape(new DxError("w", { where: "loc", why: "y", fix: "f" }));
  expect(shape).toEqual({ what: "w", where: "loc", why: "y", fix: "f" });
  // Missing optionals surface as null, never undefined (JSON-stable keys).
  expect(dxErrorShape(new DxError("only-what", {}))).toEqual({ what: "only-what", where: null, why: null, fix: null });
});
