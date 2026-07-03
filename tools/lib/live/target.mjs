// LiveTarget resolution — which deployed assist surface a live command talks to.
//
// The factory records the Gemini Enterprise engine as cfg.geAppId (either the
// full engine resource name `projects/.../locations/.../collections/.../
// engines/<id>` — what `ge init` discovers — or a bare engine id) and the
// location as cfg.geLocation. The assist surface is always the engine's
// default assistant; regional endpoints get a location prefix
// (global → discoveryengine.googleapis.com, else <location>-discoveryengine…).
// Verified live against @google-cloud/discoveryengine v1 in
// tests/e2e/stream-assist.e2e.test.mjs.
import { liveError } from "./errors.mjs";

export const DEFAULT_COLLECTION = "default_collection";
export const DEFAULT_ASSISTANT = "default_assistant";

export function assistApiEndpoint(location) {
  return location === "global" ? "discoveryengine.googleapis.com" : `${location}-discoveryengine.googleapis.com`;
}

function engineResource({ geAppId, project, location, collection }) {
  if (geAppId.startsWith("projects/")) return geAppId;
  return `projects/${project}/locations/${location}/collections/${collection}/engines/${geAppId}`;
}

// Resolve the live target from resolved config (+ per-command overrides).
// Throws GELIVE001 with the exact current position and next command when the
// target cannot be named — a live command can only drive a deployed agent.
export function resolveLiveTarget(cfg = {}, overrides = {}) {
  const geAppId = overrides.engine || cfg.geAppId || "";
  const location = overrides.location || cfg.geLocation || "global";
  const project = overrides.project || cfg.project || "";
  const collection = overrides.collection || DEFAULT_COLLECTION;
  const assistant = overrides.assistant || DEFAULT_ASSISTANT;
  if (!geAppId) {
    throw liveError("GELIVE001", "no shipped live target found", {
      where: "config: geAppId (.ge.json / GEMINI_ENTERPRISE_APP_ID / --ge-app)",
      why: "live commands drive a deployed agent through its assist surface, and no Gemini Enterprise engine is recorded for this project",
      fix: "ge init",
    });
  }
  if (!geAppId.startsWith("projects/") && !project) {
    throw liveError("GELIVE001", "live target is incomplete: engine id without a project", {
      where: "config: project (.ge.json / GCP_PROJECT_ID / --project)",
      why: `geAppId "${geAppId}" is a bare engine id, so the engine resource name needs the project to be set`,
      fix: "ge config explain",
    });
  }
  const engine = engineResource({ geAppId, project, location, collection });
  const name = `${engine}/assistants/${assistant}`;
  const apiEndpoint = assistApiEndpoint(location);
  return {
    project: project || engine.split("/")[1],
    location,
    engine,
    assistant,
    name,
    apiEndpoint,
    url: `https://${apiEndpoint}/v1/${name}:streamAssist`,
    expectedAgentId: overrides.expectedAgentId ?? cfg.expectedAgentId ?? null,
  };
}

// Non-throwing probe for status/board surfaces: where the operator stands on
// the road to a drivable target.
export function describeLiveTarget(cfg = {}, overrides = {}) {
  try {
    return { ok: true, target: resolveLiveTarget(cfg, overrides), blocker: null };
  } catch (error) {
    return { ok: false, target: null, blocker: { what: error.what || error.message, fix: error.fix || null, code: error.code || null } };
  }
}
