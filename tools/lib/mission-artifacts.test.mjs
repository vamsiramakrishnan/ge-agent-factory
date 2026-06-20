import { mkdirSync, rmSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, test } from "bun:test";
import { inspectMissionArtifact, verifyMissionArtifacts } from "./mission-artifacts.mjs";

function tmpDir(name) {
  const dir = join("/tmp", `ge-mission-artifacts-${process.pid}-${name}`);
  rmSync(dir, { recursive: true, force: true });
  mkdirSync(dir, { recursive: true });
  return dir;
}

describe("mission artifacts", () => {
  test("validates json files and records metadata", () => {
    const root = tmpDir("json");
    writeFileSync(join(root, "data.json"), JSON.stringify({ ok: true }), "utf8");

    const artifact = inspectMissionArtifact({ name: "data", type: "json", path: "data.json" }, { repoRoot: root });

    expect(artifact.status).toBe("present");
    expect(artifact.metadata.sha256).toHaveLength(64);
    expect(artifact.metadata.kind).toBe("file");
  });

  test("summarizes csv output directories", () => {
    const root = tmpDir("dir");
    mkdirSync(join(root, "output"));
    writeFileSync(join(root, "output", "Employee.csv"), "id,name\n1,Ada\n2,Grace\n", "utf8");

    const artifact = inspectMissionArtifact({ name: "rows", type: "dir", path: "output" }, { repoRoot: root });

    expect(artifact.status).toBe("present");
    expect(artifact.metadata.csvFiles).toBe(1);
    expect(artifact.metadata.rowCount).toBe(2);
  });

  test("turns missing or invalid artifacts into blockers", () => {
    const root = tmpDir("blockers");
    writeFileSync(join(root, "bad.json"), "{", "utf8");

    const result = verifyMissionArtifacts([
      { name: "missing", type: "json", path: "missing.json" },
      { name: "bad", type: "json", path: "bad.json" },
    ], { repoRoot: root });

    expect(result.ok).toBe(false);
    expect(result.counts.missing).toBe(1);
    expect(result.counts.invalid).toBe(1);
    expect(result.blockers.map((blocker) => blocker.artifact)).toEqual(["missing", "bad"]);
  });

  test("validates stdout json artifacts from child output", () => {
    const artifact = inspectMissionArtifact(
      { name: "conformance", type: "stdout-json", ref: "validate" },
      { childTask: { output: { stdout: "{\"ok\":true}" } } },
    );

    expect(artifact.status).toBe("present");
    expect(artifact.metadata.jsonType).toBe("object");
  });

  test("uses full machine stdout when display stdout is truncated", () => {
    const artifact = inspectMissionArtifact(
      { name: "conformance", type: "stdout-json", ref: "validate" },
      { childTask: { output: { stdout: "],\"not\":\"complete\"}", stdoutFull: "{\"ok\":true,\"simulators\":[]}" } } },
    );

    expect(artifact.status).toBe("present");
    expect(artifact.metadata.jsonType).toBe("object");
  });
});
