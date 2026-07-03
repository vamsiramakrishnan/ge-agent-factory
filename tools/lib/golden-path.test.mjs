// Dispatch-rule contract for the golden-path verbs (CS-1 of the Language &
// DX refactor). These rules ARE the interface: prove picks smoke vs build by
// workspace presence; handoff refuses unknown targets with the four-field
// error; capture reports what it did with the console.
import { test, expect } from "bun:test";
import { createGoldenPathOps } from "./golden-path.mjs";
import { isDxError } from "./errors/dx-error.mjs";

function ops(overrides = {}) {
  const calls = [];
  const record = (name, ret = {}) => async (cfg, opts) => { calls.push({ name, opts }); return ret; };
  const built = createGoldenPathOps({
    repoRoot: "/nonexistent",
    devexSmoke: record("devexSmoke", { ok: true, target: "validated" }),
    provisionLocal: record("provisionLocal", { target: "previewed", projectsDir: "x" }),
    provision: record("provision", { submitted: 1, failed: 0 }),
    ship: record("ship", { submitted: 2, failed: 0, startStage: "load_data", targetStage: "publish_enterprise" }),
    registerSpec: (opts) => { calls.push({ name: "registerSpec", opts }); return { registered: true }; },
    listWorkspaces: () => [],
    probeConsole: async () => true,
    ...overrides,
  });
  return { ...built, calls };
}

test("prove on a fresh machine dispatches to the smoke path", async () => {
  const o = ops({ listWorkspaces: () => [] });
  const res = await o.prove({ mode: "local" }, {});
  expect(res.path).toBe("smoke");
  expect(o.calls.map((c) => c.name)).toEqual(["devexSmoke"]);
});

test("prove with workspaces present dispatches to the local build", async () => {
  const o = ops({ listWorkspaces: () => [{ id: "ws-1" }] });
  const res = await o.prove({ mode: "local" }, {});
  expect(res.path).toBe("build");
  expect(o.calls.map((c) => c.name)).toEqual(["provisionLocal"]);
});

test("prove respects remote mode once workspaces exist", async () => {
  const o = ops({ listWorkspaces: () => [{ id: "ws-1" }] });
  const res = await o.prove({ mode: "remote" }, {});
  expect(res.path).toBe("build");
  expect(res.mode).toBe("remote");
  expect(o.calls.map((c) => c.name)).toEqual(["provision"]);
});

test("prove --id forces the build path even without stored workspaces", async () => {
  const o = ops({ listWorkspaces: () => [] });
  const res = await o.prove({ mode: "local" }, { id: "asc-606" });
  expect(res.path).toBe("build");
  expect(o.calls[0].opts.ids).toBe("asc-606");
});

test("handoff delegates the supported target to ship", async () => {
  const o = ops();
  const res = await o.handoff({}, { target: "agents-cli" });
  expect(res.kind).toBe("ge.handoff");
  expect(res.target).toBe("agents-cli");
  expect(res.submitted).toBe(2);
  expect(o.calls.map((c) => c.name)).toEqual(["ship"]);
});

test("handoff rejects an unsupported target with the four-field error, and ships nothing", async () => {
  const o = ops();
  let thrown = null;
  try { await o.handoff({}, { target: "kubernetes" }); } catch (e) { thrown = e; }
  expect(thrown).not.toBeNull();
  expect(isDxError(thrown)).toBe(true);
  expect(thrown.fix).toBe("ge handoff agents-cli");
  expect(thrown.why).toContain("agents-cli");
  expect(o.calls.length).toBe(0); // refused before any side effect
});

test("capture reports an already-running console without starting one", async () => {
  const o = ops({ probeConsole: async () => true });
  const res = await o.capture({}, {});
  expect(res.kind).toBe("ge.capture");
  expect(res.url).toContain("#/interview");
  expect(res.console.alreadyRunning).toBe(true);
  expect(res.console.started).toBe(false);
});

test("capture --from registers the contract through registerSpec", async () => {
  const o = ops({ probeConsole: async () => true });
  const res = await o.capture({}, { from: "specs/agent-spec.json" });
  expect(o.calls.map((c) => c.name)).toEqual(["registerSpec"]);
  expect(o.calls[0].opts.input).toBe("specs/agent-spec.json");
  expect(res.registered).toEqual({ registered: true });
});
