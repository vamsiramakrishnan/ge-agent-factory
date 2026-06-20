import { expect, test, describe } from "bun:test";
import { selectionDepartments, toolPlaneChecks, selectWorkspacesForRegen } from "./factory-core.mjs";

const deptById = new Map([
  ["uc-promotion", "hr"],
  ["uc-invoice", "finance"],
  ["uc-incident", "it"],
]);

describe("selectionDepartments", () => {
  test("explicit --dept wins", () => {
    expect(selectionDepartments({ dept: "hr,finance" }, deptById)).toEqual(["hr", "finance"]);
  });
  test("ids resolve to their departments via the catalog", () => {
    expect(selectionDepartments({ ids: "uc-promotion,uc-invoice" }, deptById)).toEqual(["hr", "finance"]);
  });
  test("dedupes departments", () => {
    const m = new Map([["a", "hr"], ["b", "hr"]]);
    expect(selectionDepartments({ ids: "a,b" }, m)).toEqual(["hr"]);
  });
  test("all/canary span every department → null (gate everything)", () => {
    expect(selectionDepartments({ scope: "all" }, deptById)).toBeNull();
    expect(selectionDepartments({ scope: "canary" }, deptById)).toBeNull();
  });
  test("unmappable ids → null (gate everything, never silently skip)", () => {
    expect(selectionDepartments({ ids: "nope" }, deptById)).toBeNull();
  });
  test("ANY unmappable id in the set → null (don't under-gate the rest)", () => {
    expect(selectionDepartments({ ids: "uc-promotion,nope" }, deptById)).toBeNull();
  });
});

describe("toolPlaneChecks", () => {
  const cfg = { mcpServices: { hr: "https://mcp-hr", finance: "" } };
  test("deployed department passes", () => {
    const [check] = toolPlaneChecks(cfg, ["hr"]);
    expect(check.status).toBe("pass");
    expect(check.fix).toBeNull();
  });
  test("missing department fails with the deploy fix", () => {
    const [check] = toolPlaneChecks(cfg, ["finance"]);
    expect(check.status).toBe("fail");
    expect(check.detail).toContain("ge-agent-factory-mcp-finance");
    expect(check.fix).toContain("ge mcp deploy");
  });
  test("null departments gate every department", () => {
    const checks = toolPlaneChecks({ mcpServices: {} }, null);
    expect(checks.length).toBe(5);
    expect(checks.every((c) => c.status === "fail")).toBe(true);
  });
});

describe("selectWorkspacesForRegen", () => {
  const items = [
    { id: "ws-promotion-1", useCaseId: "uc-promotion", departmentId: "hr" },
    { id: "ws-invoice-1", useCaseId: "uc-invoice", departmentId: "finance" },
    { id: "ws-incident-1", useCaseId: "uc-incident", departmentId: "it" },
  ];
  test("by workspace id", () => {
    expect(selectWorkspacesForRegen(items, { ids: "ws-promotion-1" }).map((w) => w.id)).toEqual(["ws-promotion-1"]);
  });
  test("by use-case id", () => {
    expect(selectWorkspacesForRegen(items, { ids: "uc-invoice" }).map((w) => w.id)).toEqual(["ws-invoice-1"]);
  });
  test("by department", () => {
    expect(selectWorkspacesForRegen(items, { dept: "it" }).map((w) => w.id)).toEqual(["ws-incident-1"]);
  });
  test("scope all wipes everything", () => {
    expect(selectWorkspacesForRegen(items, { scope: "all" }).length).toBe(3);
  });
  test("no selection wipes ALL — matches build's default-to-all (no duplicates)", () => {
    // bare `ge agents build --force` builds every agent, so it must wipe every
    // existing workspace; wiping a subset would leave duplicates.
    expect(selectWorkspacesForRegen(items, {}).length).toBe(3);
  });
  test("canary wipes just the first (matches build --canary)", () => {
    expect(selectWorkspacesForRegen(items, { scope: "canary" }).map((w) => w.id)).toEqual(["ws-promotion-1"]);
  });
});
