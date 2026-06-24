// Validate + clamp a user-supplied concurrency value at the CLI/API boundary, so
// the worker pool always receives a sane integer (a bare parseInt let "nope" → NaN
// and 0/negative through). Throws on non-integers; rejects out-of-range values.
export function parseConcurrency(value, { min = 1, max = 20, fallback = 2 } = {}) {
  if (value === undefined || value === null || value === "") return fallback;
  const n = Number(value);
  if (!Number.isInteger(n)) throw new Error(`concurrency must be an integer, got "${value}"`);
  if (n < min || n > max) throw new Error(`concurrency must be between ${min} and ${max}, got ${n}`);
  return n;
}
