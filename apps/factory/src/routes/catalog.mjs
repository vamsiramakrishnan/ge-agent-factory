// Read-mostly catalog & platform routes: domain/use-case browsing, runtime
// adapter/capability/skill introspection, and local auth/setup endpoints.
// These have no side effects beyond auth/env writes and are safe to run
// entirely through Hono's fetch-based routing.
import { Hono } from "hono";
import { DOMAIN_CATALOG, DOMAIN_SUMMARY, getDomainsByDepartment, searchDomains } from "../domains.generated.js";
import { detectAgents } from "../agents.js";
import { PERMISSION_PROFILES } from "../harness-runtime.js";
import { loadSkillRegistry } from "../skill-registry.js";
import { getAuthStatus, listGeminiEnterpriseApps, listProjects as listGcpProjects, setProject as setGcpProject, getFullSetupStatus, writeEnvFile } from "../auth.js";

/**
 * @param {{ REPO_ROOT: string, DATA_ROOT: string }} ctx
 */
export function createCatalogRoutes({ REPO_ROOT, DATA_ROOT }) {
  const app = new Hono();
  // Match the legacy handler's outer catch: any thrown error becomes a 500
  // with { error: message }, not Hono's default plain-text response.
  app.onError((error, c) => c.json({ error: error instanceof Error ? error.message : String(error) }, 500));

  app.get("/api/domains", (c) => {
    const dept = c.req.query("department");
    const q = c.req.query("q");
    let domains = dept ? getDomainsByDepartment(dept) : DOMAIN_CATALOG;
    if (q) domains = searchDomains(q).filter((d) => !dept || d.department === dept);
    return c.json({ domains, summary: DOMAIN_SUMMARY, total: domains.length });
  });

  app.get("/api/runtime/adapters", async (c) => {
    const agents = await detectAgents();
    return c.json({ adapters: agents.map((agent) => agent.contract) });
  });

  app.get("/api/runtime/capabilities", async (c) => {
    const agents = await detectAgents();
    return c.json({
      permissionProfiles: Object.values(PERMISSION_PROFILES),
      adapters: agents.map((agent) => ({
        id: agent.id,
        name: agent.name,
        available: agent.available,
        capabilities: agent.capabilities,
        contract: agent.contract,
      })),
    });
  });

  app.get("/api/runtime/skills", async (c) => c.json(await loadSkillRegistry(REPO_ROOT)));

  app.get("/api/auth/status", async (c) => c.json(await getFullSetupStatus(DATA_ROOT)));

  app.get("/api/auth/projects", async (c) => c.json({ projects: await listGcpProjects() }));

  app.post("/api/auth/project", async (c) => {
    const body = await c.req.json();
    const ok = await setGcpProject(body.projectId);
    if (ok) await writeEnvFile(DATA_ROOT, { GOOGLE_CLOUD_PROJECT: body.projectId });
    return c.json({ ok, projectId: body.projectId });
  });

  app.get("/api/auth/gemini-apps", async (c) => {
    const projectId = c.req.query("project") || (await getAuthStatus()).project;
    return c.json({ apps: await listGeminiEnterpriseApps(projectId) });
  });

  app.post("/api/auth/env", async (c) => {
    const body = await c.req.json();
    const merged = await writeEnvFile(DATA_ROOT, body);
    return c.json({ ok: true, env: merged });
  });

  return app;
}
