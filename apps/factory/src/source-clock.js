// Injectable generation clock. Generation writes timestamps into committed
// artifacts (manifests, schemas). Reading wall-clock time per call makes every
// regeneration churn the diff and defeats the fixed faker seed, so the "local
// mode is deterministic" guarantee is only real if the timestamp is injectable.
//
// Set GE_SOURCE_DATE (any ISO-8601 string) for byte-reproducible builds and the
// CI golden-diff gate; otherwise it falls back to the current time. Callers
// should capture the value ONCE per run so all artifacts in a run agree.
export function sourceTimestamp() {
  return process.env.GE_SOURCE_DATE || new Date().toISOString();
}
