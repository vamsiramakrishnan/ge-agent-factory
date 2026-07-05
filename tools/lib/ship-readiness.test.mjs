import { describe, expect, test } from "bun:test";
import {
  bigQueryApiCheck,
  gatewayProvisionCheck,
  shipProxyCheck,
} from "./factory-core.mjs";
import { commandRequirements } from "@ge/capability-registry";

// P0: the handoff readiness pre-flight must catch the three blockers that
// previously only fired mid-run, each with its exact fix command. The checks are
// pure helpers (mirroring toolPlaneChecks) wired into commandDoctor; we test the
// helpers with injected fakes and assert the requirement gating in the registry.

describe("cloud-run-proxy readiness check", () => {
  test("missing proxy → hard fail with the apt fix (NOT components install)", () => {
    const check = shipProxyCheck(() => ({ ok: false }));
    expect(check.status).toBe("fail");
    expect(check.fix).toBe("sudo apt-get install google-cloud-cli-cloud-run-proxy");
    expect(check.fix).not.toContain("gcloud components install");
    expect(check.detail).toMatch(/cloud-run-proxy/);
  });

  test("present proxy → pass, no fix", () => {
    const check = shipProxyCheck(() => ({ ok: true }));
    expect(check.status).toBe("pass");
    expect(check.fix).toBeNull();
  });
});

describe("gateway provisioning readiness check", () => {
  const cfg = { gatewayService: "ge-agent-factory-gateway", region: "us-central1" };
  const serviceWith = (value) => ({
    spec: { template: { spec: { containers: [{ env: value === undefined ? [] : [{ name: "GE_ENABLE_AGENT_PROVISION", value }] }] } } },
  });

  test("flag unset/false → hard fail with the update-env-vars fix", () => {
    const check = gatewayProvisionCheck(cfg, () => serviceWith("false"));
    expect(check.status).toBe("fail");
    expect(check.fix).toBe("gcloud run services update ge-agent-factory-gateway --region us-central1 --update-env-vars GE_ENABLE_AGENT_PROVISION=true");
    expect(check.detail).toMatch(/Agent provisioning|GE_ENABLE_AGENT_PROVISION/);
  });

  test("flag missing entirely → hard fail", () => {
    const check = gatewayProvisionCheck(cfg, () => serviceWith(undefined));
    expect(check.status).toBe("fail");
  });

  test("gateway not deployed → hard fail pointing at ge up", () => {
    const check = gatewayProvisionCheck(cfg, () => null);
    expect(check.status).toBe("fail");
    expect(check.fix).toBe("ge up");
  });

  test("flag true → pass, no fix", () => {
    const check = gatewayProvisionCheck(cfg, () => serviceWith("true"));
    expect(check.status).toBe("pass");
    expect(check.fix).toBeNull();
  });

  test("uses the real serviceEnv reader against a Cloud Run shape by default", () => {
    const check = gatewayProvisionCheck(cfg, () => serviceWith("true"));
    expect(check.detail).toContain("GE_ENABLE_AGENT_PROVISION=true");
  });
});

describe("BigQuery API readiness check", () => {
  test("disabled → hard fail with the ge data up fix", () => {
    const check = bigQueryApiCheck(() => ({ ok: true, out: "" }));
    expect(check.status).toBe("fail");
    expect(check.fix).toMatch(/ge data up/);
    expect(check.detail).toMatch(/bigquery/i);
  });

  test("probe error → hard fail", () => {
    const check = bigQueryApiCheck(() => ({ ok: false, out: "" }));
    expect(check.status).toBe("fail");
  });

  test("enabled → pass, no fix", () => {
    const check = bigQueryApiCheck(() => ({ ok: true, out: "bigquery.googleapis.com" }));
    expect(check.status).toBe("pass");
    expect(check.fix).toBeNull();
  });
});

describe("readiness gating per command", () => {
  test("handoff gates all three new blockers", () => {
    const req = commandRequirements("handoff");
    expect(req.shipHandoff).toBe(true);
    expect(req.bigQueryHard).toBe(true);
  });

  test("data.up gates BigQuery hard but not the ship handoff", () => {
    const req = commandRequirements("data.up");
    expect(req.bigQueryHard).toBe(true);
    expect(req.shipHandoff).toBeUndefined();
  });

  test("agents.build does not gate the ship-handoff blockers", () => {
    const req = commandRequirements("agents.build");
    expect(req.shipHandoff).toBeUndefined();
    expect(req.bigQueryHard).toBeUndefined();
  });
});
