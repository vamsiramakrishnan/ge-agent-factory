// Stable error codes for factory/ge command failures (next-horizon B4).
//
// Each code names ONE user-meaningful failure mode that already exists as a
// distinct fail() site (or cluster of sites) in the factory command handlers —
// codes are only minted when a failure has its own cause and its own fix, so
// the registry stays small and honest. Everything else stays uncoded and falls
// under the generic GE0001 umbrella: uncoded errors render byte-identically to
// how they always did (no code prefix, no docs link) at both boundaries.
//
// `docsAnchor` is a real, verified anchor on the published docs site
// (https://vamsiramakrishnan.github.io/ge-agent-factory/): `<page-route>/#<slug>`
// where the slug is what Astro/Starlight's renderer (github-slugger) derives
// from the heading in the docs/ source page. error-codes.test.mjs re-derives
// every anchor from the docs/ headings on each run, so a heading rename that
// would 404 a deep link fails the suite instead of shipping.
//
// This module is a dependency-free leaf ON PURPOSE: it is imported both by
// apps/factory/scripts/factory/registry.mjs (the factory dispatch boundary)
// and by tools/ge/shared.mjs (the ge guarded() boundary), so it must never
// pull app logic along with it.

export const DOCS_SITE_BASE_URL = "https://vamsiramakrishnan.github.io/ge-agent-factory/";

export const GENERIC_ERROR_CODE = "GE0001";

export const ERROR_CODES = Object.freeze({
  // Generic fallback. Documented here so the code space is complete, but never
  // attached automatically — an error without an explicit code renders exactly
  // as before (no code, no link). See renderError()/guarded().
  GE0001: {
    summary: "Command failed (no more specific error code)",
    docsAnchor: "operations/#troubleshooting-failure-modes-weve-actually-hit",
  },
  // Local pipeline prerequisites (init → schema → generate → tools → test).
  GE0002: {
    summary: "No schema in the workspace — run `factory schema` first",
    docsAnchor: "cookbooks/getting-started/#steps",
  },
  GE0003: {
    summary: "No mock-data manifest in the workspace — run `factory generate` first",
    docsAnchor: "cookbooks/getting-started/#steps",
  },
  GE0004: {
    summary: "A required earlier pipeline step has not completed yet",
    docsAnchor: "cookbooks/getting-started/#steps",
  },
  // Catalog resolution (from-usecase / list-usecases).
  GE0005: {
    summary: "Use case not found in the enterprise catalog, or the catalog could not be loaded",
    docsAnchor: "cookbooks/generate-an-agent/#steps",
  },
  // Gates.
  GE0006: {
    summary: "Promotion gate blocked — unresolved blockers prevent deploy",
    docsAnchor: "operations/#stage-graph-per-agent",
  },
  GE0007: {
    summary: "Quality gate failed (agents-cli lint/eval/preview)",
    docsAnchor: "cookbooks/run-evals/#troubleshoot",
  },
  // Cloud lifecycle (deploy / register / publish).
  GE0008: {
    summary: "GCP project not configured — pass --project or set GOOGLE_CLOUD_PROJECT",
    docsAnchor: "operations/#lifecycle",
  },
  GE0009: {
    summary: "Deploy failed (Agent Runtime / Cloud Run)",
    docsAnchor: "operations/#deploy-contract-who-builds-who-deploys",
  },
  GE0010: {
    summary: "Agent registration failed (Agent Registry / MCP / A2A)",
    docsAnchor: "reference/mcp/#registration",
  },
  GE0011: {
    summary: "Publish to Gemini Enterprise failed",
    docsAnchor: "operations/#lifecycle",
  },
  // Harness.
  GE0012: {
    summary: "Antigravity harness review/refine run failed",
    docsAnchor: "reference/agent-generation/#antigravity-validation--self-correction",
  },
});

// The code carried by an error, IF it resolves in the registry. Anything else
// (absent, non-string, Node system codes like "ENOENT", unknown GE codes)
// returns null so the boundaries render the error exactly as they always did.
export function resolveErrorCode(error) {
  const code = error?.code;
  return typeof code === "string" && Object.hasOwn(ERROR_CODES, code) ? code : null;
}

// Deep link into the published docs site for a registered code, else null.
export function docsUrlFor(code) {
  const entry = ERROR_CODES[code];
  return entry ? `${DOCS_SITE_BASE_URL}${entry.docsAnchor}` : null;
}
