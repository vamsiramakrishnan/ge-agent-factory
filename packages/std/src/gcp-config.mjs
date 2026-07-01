// Centralized GCP project-ID resolution. Before this, ~7 call sites across
// apps/factory, apps/console, packages/run-ledger, and tools/lib each hand-rolled
// a slightly different `||` fallback chain over GOOGLE_CLOUD_PROJECT /
// GCLOUD_PROJECT / assorted service-specific env vars — a real latent-bug
// surface, since different services could resolve "the project" differently
// for what is conceptually the same setting.
//
// Canonical precedence: an explicit value (CLI flag, function param, or a
// caller-chosen env var passed in as `explicit`) wins, then the two
// widely-recognized GCP env vars, then any additional call-site-specific env
// vars (in the order given) for backward compatibility with pre-existing
// fallbacks (e.g. GE_PROJECT, GE_AGENT_FACTORY_PROJECT, FIREBASE_PROJECT_ID).
export function resolveGcpProject({ explicit = null, env = process.env, fallbackEnvVars = [] } = {}) {
  if (explicit) return explicit;
  if (env.GOOGLE_CLOUD_PROJECT) return env.GOOGLE_CLOUD_PROJECT;
  if (env.GCLOUD_PROJECT) return env.GCLOUD_PROJECT;
  for (const name of fallbackEnvVars) {
    if (env[name]) return env[name];
  }
  return null;
}
