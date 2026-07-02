import { expect, test } from "bun:test";
import {
  buildDoctorReport,
  classifyDoctorCheck,
  createCheckCollector,
  runDoctorSection,
} from "./report.mjs";

test("check collector builds reports with fail count", () => {
  const collector = createCheckCollector();
  collector.add("project", "pass", "demo");
  collector.add("geAppId", "fail", "<unset>", "ge init");

  expect(collector.report({ project: "demo" })).toEqual({
    project: "demo",
    checks: [
      { name: "project", status: "pass", detail: "demo", fix: null },
      { name: "geAppId", status: "fail", detail: "<unset>", fix: "ge init" },
    ],
    fails: 1,
  });
});

test("classifies doctor checks into repair categories", () => {
  expect(classifyDoctorCheck("factory", {
    name: "gateway ready",
    status: "fail",
    detail: "Cloud Run service not Ready",
    fix: null,
  })).toMatchObject({ category: "factory-plane", action: "ge up --infra" });

  expect(classifyDoctorCheck("data plane", {
    name: "alloydb DSN secret",
    status: "warn",
    detail: "missing secret",
    fix: null,
  })).toMatchObject({ category: "data-plane", action: "ge data up" });
});

test("runDoctorSection converts thrown doctor into failed classified section", () => {
  const section = runDoctorSection("factory", () => {
    throw new Error("No project. Run `ge init` first.");
  });

  expect(section.fails).toBe(1);
  expect(section.checks[0]).toMatchObject({
    status: "fail",
    category: "setup-config",
    action: "ge init",
  });
});

test("buildDoctorReport aggregates sections and repair plan", () => {
  const section = runDoctorSection("tool plane", () => ({
    fails: 0,
    checks: [{ name: "mcp hr", status: "warn", detail: "not deployed", fix: "ge mcp deploy" }],
  }));

  expect(buildDoctorReport({ cfg: { project: "p", region: "r" }, sections: [section] })).toMatchObject({
    mode: "all",
    project: "p",
    region: "r",
    fails: 0,
    repairPlan: [{ section: "tool plane", check: "mcp hr", category: "tool-plane", command: "ge mcp deploy", status: "warn" }],
  });
});
