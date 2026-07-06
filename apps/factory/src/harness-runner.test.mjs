import { afterAll, beforeAll, describe, expect, test } from "bun:test";
import { mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { __test } from "./harness-runner.js";

describe("harness runner config", () => {
  // Hermetic: the .ge.json under test is written to a temp repoRoot, and the
  // ambient project/location env vars that would win over the file are
  // cleared for the duration — so this passes (and means the same thing) on a
  // machine with no gcloud config and on a developer laptop with one.
  const ENV_KEYS = ["GCP_PROJECT_ID", "GOOGLE_CLOUD_PROJECT", "GCLOUD_PROJECT", "GOOGLE_CLOUD_LOCATION", "GOOGLE_GENAI_LOCATION", "GEMINI_ENTERPRISE_LOCATION"];
  let savedEnv;
  let tmpRepoRoot;
  beforeAll(() => {
    savedEnv = Object.fromEntries(ENV_KEYS.map((key) => [key, process.env[key]]));
    for (const key of ENV_KEYS) delete process.env[key];
    tmpRepoRoot = mkdtempSync(join(tmpdir(), "ge-harness-cfg-"));
    writeFileSync(join(tmpRepoRoot, ".ge.json"), JSON.stringify({ project: "c12-test-project", geLocation: "global" }));
  });
  afterAll(() => {
    for (const key of ENV_KEYS) {
      if (savedEnv[key] === undefined) delete process.env[key];
      else process.env[key] = savedEnv[key];
    }
    rmSync(tmpRepoRoot, { recursive: true, force: true });
  });

  test("resolves Vertex project from repo-root .ge.json (via c12)", async () => {
    const defaults = await __test.resolveVertexDefaults({
      repoRoot: tmpRepoRoot,
      project: null,
      location: null,
      vertex: true,
    });

    expect(defaults.project).toBe("c12-test-project");
    expect(defaults.location).toBe("global");
  });

  test("buffers split Antigravity status lines before parsing", () => {
    const lines = __test.createLineBuffer();
    const first = lines.push('{"type":"antigravity.text_delta",');
    const second = lines.push('"preview":"hello"}\n');
    expect(first).toEqual([]);
    expect(second).toEqual(['{"type":"antigravity.text_delta","preview":"hello"}']);

    const parsed = __test.parseAntigravityStatusLines(`${second[0]}\n`);
    expect(parsed.events[0].type).toBe("antigravity.text_delta");
    expect(parsed.events[0].preview).toBe("hello");
  });
});

describe("interaction-form bridge (non-Antigravity adapters)", () => {
  test("buildInteractionSection fires for interaction-capable adapters with a dir", () => {
    // claude and codex declare supportsInteraction; antigravity has its own
    // native hook; gemini has no bridge.
    expect(__test.buildInteractionSection("claude", "/tmp/x")).toContain("request_user_input");
    expect(__test.buildInteractionSection("codex", "/tmp/x")).toContain("request_user_input");
    expect(__test.buildInteractionSection("claude", null)).toBeNull();
    expect(__test.buildInteractionSection("antigravity-sdk", "/tmp/x")).toBeNull();
    expect(__test.buildInteractionSection("gemini", "/tmp/x")).toBeNull();
  });

  test("watchInteractionRequests surfaces each request file once", async () => {
    const { mkdtempSync, mkdirSync: mkdir, writeFileSync: write, rmSync: rm } = await import("node:fs");
    const { join: j } = await import("node:path");
    const { tmpdir } = await import("node:os");
    const dir = mkdtempSync(j(tmpdir(), "ge-interactions-"));
    try {
      mkdir(j(dir, "requests"), { recursive: true });
      const seen = [];
      const stop = __test.watchInteractionRequests({ interactionDir: dir, pollMs: 20, onRequest: (r) => seen.push(r.id) });
      write(j(dir, "requests", "interaction-1.json"), JSON.stringify({ id: "interaction-1", form: { questions: [] } }));
      await new Promise((r) => setTimeout(r, 80));
      write(j(dir, "requests", "interaction-2.json"), JSON.stringify({ id: "interaction-2", form: { questions: [] } }));
      await new Promise((r) => setTimeout(r, 80));
      stop();
      expect(seen).toEqual(["interaction-1", "interaction-2"]);
    } finally {
      rm(dir, { recursive: true, force: true });
    }
  });
});

describe("claude sandbox env (root bypassPermissions)", () => {
  test("sets IS_SANDBOX only for the claude adapter running as root", () => {
    expect(__test.claudeSandboxEnv("claude", 0)).toEqual({ IS_SANDBOX: "1" });
    expect(__test.claudeSandboxEnv("claude", 1000)).toEqual({});
    expect(__test.claudeSandboxEnv("codex", 0)).toEqual({});
    expect(__test.claudeSandboxEnv("antigravity-sdk", 0)).toEqual({});
  });
});

describe("claude adapter interaction wiring", () => {
  test("buildArgs adds the MCP bridge only when an interaction dir is present", async () => {
    const { AGENT_DEFS } = await import("./agents.js");
    const claude = AGENT_DEFS.find((d) => d.id === "claude");
    const plain = claude.buildArgs("prompt", {});
    expect(plain.join(" ")).not.toContain("--mcp-config");
    const wired = claude.buildArgs("prompt", { interactionDir: "/tmp/ix" });
    const mcpIndex = wired.indexOf("--mcp-config");
    expect(mcpIndex).toBeGreaterThan(-1);
    const config = JSON.parse(wired[mcpIndex + 1]);
    expect(config.mcpServers["ge-interaction"].env.GE_HARNESS_INTERACTION_DIR).toBe("/tmp/ix");
    expect(config.mcpServers["ge-interaction"].args[0]).toContain("claude-interaction-mcp.mjs");
    expect(wired).toContain("--allowedTools");
    expect(wired).toContain("mcp__ge-interaction__request_user_input");
  });

  test("codex buildArgs registers the bridge via -c mcp_servers overrides only with an interaction dir", async () => {
    const { AGENT_DEFS, agentSupportsInteraction } = await import("./agents.js");
    expect(agentSupportsInteraction("codex")).toBe(true);
    const codex = AGENT_DEFS.find((d) => d.id === "codex");
    const plain = codex.buildArgs("prompt", {});
    expect(plain.join(" ")).not.toContain("mcp_servers");
    const wired = codex.buildArgs("prompt", { interactionDir: "/tmp/ix" });
    // Codex -c values are JSON; the server id is TOML-safe (underscore).
    const argJoin = wired.join("\n");
    expect(argJoin).toContain("mcp_servers.ge_interaction.command=");
    const envArg = wired.find((a) => a.startsWith("mcp_servers.ge_interaction.env="));
    expect(JSON.parse(envArg.split("=").slice(1).join("=")).GE_HARNESS_INTERACTION_DIR).toBe("/tmp/ix");
    const argsArg = wired.find((a) => a.startsWith("mcp_servers.ge_interaction.args="));
    expect(JSON.parse(argsArg.split("=").slice(1).join("="))[0]).toContain("claude-interaction-mcp.mjs");
  });
});
