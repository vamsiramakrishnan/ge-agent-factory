// agent-identity — Agent Identity org id / principalSet inference for infra
// apply, and persisting it back into .ge.json. Verbatim extraction from
// factory-core.mjs (see AGENTS.md / REFACTOR-HANDOFF.md §9 methodology:
// verbatim move, dependency injection where needed, re-export from
// factory-core.mjs to preserve its public API contract).
//
// Per the task guardrails (REFACTOR-HANDOFF.md §5's still-open GCP-env-
// resolution unification decision): this is a verbatim move only, not a
// behavior change — `gcloud`/`readJson`/`writeJson`/`configPath` are injected
// exactly the same way factory-core wires them into the plane modules.

export function createAgentIdentityOps({ gcloud, readJson, writeJson, configPath, noop = () => {} }) {
  function agentIdentityPrincipalSet(orgId, projectNumber) {
    return orgId && projectNumber
      ? `principalSet://agents.global.org-${orgId}.system.id.goog/attribute.platformContainer/aiplatform/projects/${projectNumber}`
      : "";
  }

  function inferAgentIdentityOrgId(cfg) {
    if (cfg.agentIdentityOrgId || !cfg.project) return cfg.agentIdentityOrgId || "";
    const r = gcloud(["projects", "get-ancestors", cfg.project, "--format=json"], { allowFail: true });
    if (!r.ok) return "";
    try {
      const ancestors = JSON.parse(r.out);
      return ancestors.find((a) => a.type === "organization")?.id || "";
    } catch {
      return "";
    }
  }

  function describeProjectNumber(cfg) {
    const r = gcloud(["projects", "describe", cfg.project, "--format=value(projectNumber)"], { allowFail: true });
    return r.ok ? r.out : "";
  }

  function ensureAgentIdentityConfig(cfg, { log = noop } = {}) {
    if (!cfg.agentIdentityOrgId) {
      const orgId = inferAgentIdentityOrgId(cfg);
      if (orgId) {
        cfg.agentIdentityOrgId = orgId;
        log(`detected Agent Identity org id ${orgId}`);
      }
    }
    if (!cfg.agentIdentityPrincipalSet && cfg.agentIdentityOrgId && cfg.projectNumber) {
      cfg.agentIdentityPrincipalSet = agentIdentityPrincipalSet(cfg.agentIdentityOrgId, cfg.projectNumber);
    }
    if (!cfg.agentIdentityOrgId) {
      log("Agent Identity org id not detected; set GE_AGENT_IDENTITY_ORG_ID or pass --agentIdentityOrgId before applying infra.");
    }
    return cfg;
  }

  function persistAgentIdentityConfig(cfg) {
    if (!cfg.project || !cfg.agentIdentityOrgId) return;
    const existing = readJson(configPath, {});
    if (existing.project && existing.project !== cfg.project) return;
    writeJson(configPath, {
      ...existing,
      project: existing.project || cfg.project,
      projectNumber: existing.projectNumber || cfg.projectNumber || "",
      agentIdentityOrgId: cfg.agentIdentityOrgId,
      agentIdentityPrincipalSet: cfg.agentIdentityPrincipalSet || existing.agentIdentityPrincipalSet || "",
    });
  }

  return {
    agentIdentityPrincipalSet,
    inferAgentIdentityOrgId,
    describeProjectNumber,
    ensureAgentIdentityConfig,
    persistAgentIdentityConfig,
  };
}
