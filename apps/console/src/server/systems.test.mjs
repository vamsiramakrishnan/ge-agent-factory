import { test, expect } from "bun:test";
import {
  listKnownSystems,
  buildSynthesisSpec,
  synthesizeSystem,
  MAX_DESCRIPTION_BYTES,
} from "./systems.mjs";
import { handleGeFetchRequest } from "./ge-api-router.mjs";

test("listKnownSystems reads the generator registry", async () => {
  const { systems } = await listKnownSystems();
  expect(Array.isArray(systems)).toBe(true);
  expect(systems.length).toBeGreaterThan(10);
  const workday = systems.find((s) => s.id === "workday");
  expect(workday).toBeTruthy();
  expect(workday.displayName).toBe("Workday");
  expect(typeof workday.maturity).toBe("string");
  // Every entry carries the documented shape.
  for (const sys of systems) {
    expect(typeof sys.id).toBe("string");
    expect(typeof sys.displayName).toBe("string");
  }
});

test("buildSynthesisSpec validates mode + caps description", () => {
  const nl = buildSynthesisSpec({ mode: "nl", description: "parts", displayName: "X", useLlm: false });
  expect(nl).toMatchObject({ mode: "nl", description: "parts", displayName: "X", use_llm: false });

  expect(() => buildSynthesisSpec({ mode: "nl", description: "" })).toThrow(/description is required/);
  expect(() => buildSynthesisSpec({ mode: "bogus", description: "x" })).toThrow(/unsupported synthesis mode/);

  let status = 0;
  try {
    buildSynthesisSpec({ mode: "nl", description: "x".repeat(MAX_DESCRIPTION_BYTES + 1) });
  } catch (e) {
    status = e.statusCode;
  }
  expect(status).toBe(413);

  // useLlm defaults to true when omitted.
  expect(buildSynthesisSpec({ mode: "nl", description: "x" }).use_llm).toBe(true);
});

test("GET /api/systems returns the known list via the router", async () => {
  const res = await handleGeFetchRequest(
    new Request("http://localhost/api/systems", { method: "GET" }),
  );
  expect(res).toBeInstanceOf(Response);
  expect(res.status).toBe(200);
  const body = await res.json();
  expect(Array.isArray(body.systems)).toBe(true);
  expect(body.systems.some((s) => s.id === "workday")).toBe(true);
});

// Calls the real synthesis CLI offline (use_llm:false) — it always returns a
// valid system from the heuristic tier, with no Vertex creds required.
test("synthesizeSystem returns a live system for an NL description (offline)", async () => {
  const result = await synthesizeSystem({
    mode: "nl",
    displayName: "PartsLedger",
    description: "parts, requisitions, and an approval flow",
    useLlm: false,
  });
  expect(result.ok).toBe(true);
  expect(result.displayName).toBe("PartsLedger");
  expect(typeof result.id).toBe("string");
  expect(Array.isArray(result.tools)).toBe(true);
  expect(result.tools.length).toBeGreaterThan(0);
  expect(typeof result.collections).toBe("object");
  expect(Object.keys(result.collections).length).toBeGreaterThan(0);
}, 60000);

test("POST /api/systems/synthesize returns a system via the router (offline)", async () => {
  const res = await handleGeFetchRequest(
    new Request("http://localhost/api/systems/synthesize", {
      method: "POST",
      body: JSON.stringify({
        mode: "nl",
        displayName: "InventoryDesk",
        description: "items, stock levels, and reorder requests",
        useLlm: false,
      }),
    }),
  );
  expect(res.status).toBe(200);
  const body = await res.json();
  expect(body.ok).toBe(true);
  expect(body.displayName).toBe("InventoryDesk");
  expect(Array.isArray(body.tools)).toBe(true);
}, 60000);

test("POST /api/systems/synthesize rejects a bad mode with ok:false", async () => {
  const res = await handleGeFetchRequest(
    new Request("http://localhost/api/systems/synthesize", {
      method: "POST",
      body: JSON.stringify({ mode: "nope", description: "x" }),
    }),
  );
  expect(res.status).toBe(400);
  const body = await res.json();
  expect(body.ok).toBe(false);
  expect(body.error).toMatch(/unsupported synthesis mode/);
});

test("POST /api/systems/synthesize honors the readonly gate", async () => {
  const prev = process.env.GE_CONSOLE_READONLY;
  process.env.GE_CONSOLE_READONLY = "1";
  try {
    const res = await handleGeFetchRequest(
      new Request("http://localhost/api/systems/synthesize", {
        method: "POST",
        body: JSON.stringify({ mode: "nl", description: "x", useLlm: false }),
      }),
    );
    expect(res.status).toBe(403);
  } finally {
    if (prev === undefined) delete process.env.GE_CONSOLE_READONLY;
    else process.env.GE_CONSOLE_READONLY = prev;
  }
});
