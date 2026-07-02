import { describe, expect, test } from "bun:test";
import { mkdtempSync, mkdirSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { buildFleetHealth } from "./fleet-health.mjs";

function tmpRepo(name) {
  return mkdtempSync(join(tmpdir(), `ge-fleet-health-${name}-`));
}

function writeRun(repo, id, run) {
  const dir = join(repo, ".ge", "runtime", "runs", id);
  mkdirSync(dir, { recursive: true });
  writeFileSync(join(dir, "run.json"), `${JSON.stringify(run, null, 2)}\n`, "utf8");
}

describe("fleet health projection", () => {
  test("projects autopilot item blockers onto fleet agents", () => {
    const repo = tmpRepo("autopilot");
    writeRun(repo, "auto-1", {
      id: "auto-1",
      kind: "autopilot.run",
      status: "blocked",
      updatedAt: "2026-06-07T10:00:00.000Z",
      output: {
        items: [{
          agentId: "a1",
          targetStage: "preview",
          status: "blocked",
          nextAction: "repair",
          blockers: [{ id: "preview-missing", message: "preview report missing" }],
        }],
      },
    });

    const health = buildFleetHealth({
      agents: [
        { id: "a1", title: "A1", department: "finance", status: "submitted", runId: null, workspaceId: "ws-a1", error: null },
        { id: "a2", title: "A2", department: "finance", status: "none", runId: null, workspaceId: null, error: null },
      ],
    }, { repoRoot: repo });

    const a1 = health.agents.find((agent) => agent.id === "a1");
    expect(a1.healthStatus).toBe("blocked");
    expect(a1.stage).toBe("preview");
    expect(a1.owner).toBe("autopilot");
    expect(a1.blocker.id).toBe("preview-missing");
    expect(a1.actionPlan.kind).toBe("resume_autopilot");
    expect(a1.actionPlan.commands[0]).toBe("ge runs resume auto-1");
    expect(health.bottlenecks[0].count).toBe(1);
    expect(health.bottlenecks[0].actionPlan.kind).toBe("resume_autopilot");
    expect(health.byStage.preview).toBe(1);
    expect(health.byStage.spec).toBe(1);
  });

  test("projects mission node blockers onto selected ids", () => {
    const repo = tmpRepo("mission");
    writeRun(repo, "mission-1", {
      id: "mission-1",
      kind: "mission.run",
      status: "blocked",
      updatedAt: "2026-06-07T11:00:00.000Z",
      input: { ids: ["a1"] },
      output: {
        graph: {
          nodes: [{
            id: "simulator.seed",
            kind: "simulator.seed",
            status: "blocked",
            blockers: [{ id: "simulator-seed-zero-rows", message: "workday has zero rows" }],
          }],
        },
      },
    });

    const health = buildFleetHealth({
      agents: [{ id: "a1", title: "A1", department: "hr", status: "none", runId: null, workspaceId: null, error: null }],
    }, { repoRoot: repo });

    expect(health.agents[0].stage).toBe("simulator");
    expect(health.agents[0].healthStatus).toBe("blocked");
    expect(health.agents[0].owner).toBe("antigravity");
    expect(health.agents[0].actionPlan.kind).toBe("resume_mission");
  });

  test("newer local workspace suppresses stale mission blocker", () => {
    const repo = tmpRepo("mission-stale");
    writeRun(repo, "mission-1", {
      id: "mission-1",
      kind: "mission.run",
      status: "blocked",
      updatedAt: "2026-06-08T01:35:29.377Z",
      input: { ids: ["audit-report-generator"] },
      output: {
        graph: {
          nodes: [{
            id: "mock.generate",
            kind: "mock.generate",
            status: "blocked",
            blockers: [{ id: "workspace:missing", message: "workspace missing" }],
          }],
        },
      },
    });

    const health = buildFleetHealth({
      agents: [{
        id: "audit-report-generator",
        title: "Audit Report Generator",
        department: "finance",
        status: "submitted",
        runId: null,
        workspaceId: "factory-finance-audit-report-generator-4",
        error: null,
        localWorkspaceUpdatedAt: "2026-06-08T04:35:50.268Z",
      }],
    }, { repoRoot: repo });

    expect(health.agents[0].workspaceId).toBe("factory-finance-audit-report-generator-4");
    expect(health.agents[0].healthStatus).toBe("ready");
    expect(health.agents[0].nextAction).toBe("ship");
    expect(health.agents[0].owner).toBe("factory");
    expect(health.agents[0].actionPlan).toMatchObject({
      kind: "ship_agents",
      workspaceIds: ["factory-finance-audit-report-generator-4"],
      commands: ["ge agents ship --ids factory-finance-audit-report-generator-4"],
    });
    expect(health.agents[0].source).toBe("catalog");
    expect(health.blocked).toBe(0);
  });
});
