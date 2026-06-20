#!/usr/bin/env bun
/**
 * MCP server exposing the GE Agent Factory operations as typed tools, backed by
 * the same tools/lib/factory-core.mjs the `ge` CLI uses. Lets models/harnesses
 * call factory verbs as structured tools instead of shelling out and parsing
 * stdout. Transport: stdio.
 *
 * Register via .mcp.json. Read/observe tools (doctor, status, logs,
 * list_usecases) are safe; provision and sync mutate, so they're explicit.
 */

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import * as core from "./lib/factory-core.mjs";

const cfg = () => core.loadConfig({});
const result = (data) => ({ content: [{ type: "text", text: JSON.stringify(data, null, 2) }] });
const fail = (err) => ({ isError: true, content: [{ type: "text", text: String(err?.message || err) }] });

const server = new McpServer({ name: "ge-agent-factory", version: "1.0.0" });

server.tool("factory_list_usecases", "List the agent use-case catalog (filterable by department/search).",
  { department: z.string().optional(), search: z.string().optional(), limit: z.number().optional() },
  async (a) => { try { return result(await core.listUsecases(a)); } catch (e) { return fail(e); } });

server.tool("factory_doctor", "Preflight the factory: APIs, IAM, IAP, memory, service health, with fixes.",
  {}, async () => { try { return result(core.doctor(cfg())); } catch (e) { return fail(e); } });

server.tool("factory_status", "Poll submitted runs and return the stage tally + per-run status.",
  { noProxy: z.boolean().optional() },
  async (a) => { try { return result(await core.status(cfg(), { noProxy: a.noProxy })); } catch (e) { return fail(e); } });

server.tool("factory_logs", "Fetch a stage's result JSON for a run (errors, exit codes, build log URL).",
  { runId: z.string(), stage: z.string().optional(), item: z.string().optional() },
  async (a) => { try { return result(core.logs(cfg(), a)); } catch (e) { return fail(e); } });

server.tool("factory_provision", "Build agents. local=true runs on-machine via the Antigravity harness; otherwise submits to the cloud gateway. scope: 'canary' | 'all'; or dept/ids.",
  { scope: z.enum(["canary", "all"]).optional(), dept: z.string().optional(), ids: z.string().optional(), concurrency: z.string().optional(), force: z.boolean().optional(), noProxy: z.boolean().optional(), local: z.boolean().optional(), vertex: z.boolean().optional(), target: z.string().optional(), limit: z.string().optional() },
  async (a) => {
    try {
      if (a.local) return result(await core.provisionLocal(cfg(), { scope: a.scope, ids: a.ids, dept: a.dept, limit: a.limit, target: a.target, vertex: a.vertex !== false }));
      return result(await core.provision(cfg(), a));
    } catch (e) { return fail(e); }
  });

server.tool("factory_sync", "Sync generated agent code to git. local=true pushes harness workspaces (to agentsRepo/remote); otherwise pulls from GCS into generated-agents/.",
  { force: z.boolean().optional(), push: z.boolean().optional(), commit: z.boolean().optional(), local: z.boolean().optional(), remote: z.string().optional(), create: z.boolean().optional() },
  async (a) => {
    try {
      if (a.local) return result(core.syncLocal(cfg(), { remote: a.remote, push: a.push, commit: a.commit !== false, create: a.create }));
      return result(await core.sync(cfg(), a));
    } catch (e) { return fail(e); }
  });

server.tool("factory_ship", "Hand off locally-built agents to the cloud: upload prebuilt workspaces + run deploy→register→publish remotely (local→remote).",
  { ids: z.string().optional(), startStage: z.string().optional(), targetStage: z.string().optional(), noProxy: z.boolean().optional() },
  async (a) => { try { return result(await core.ship(cfg(), { ids: a.ids, startStage: a.startStage || "load_data", targetStage: a.targetStage || "publish_enterprise", noProxy: a.noProxy })); } catch (e) { return fail(e); } });

server.tool("factory_mcp_deploy", "Deploy the per-department custom MCP services to Cloud Run (fleet-level).",
  {}, async () => { try { return result(core.mcpDeploy(cfg())); } catch (e) { return fail(e); } });

server.tool("factory_mcp_doctor", "Check the per-department MCP services + Agent Registry readiness.",
  {}, async () => { try { return result(core.mcpDoctor(cfg())); } catch (e) { return fail(e); } });

await server.connect(new StdioServerTransport());
