// Percentile math for the live bench — deterministic nearest-rank
// percentiles (no interpolation: the reported number is always a latency
// that actually happened, which is what you want to argue about in an SLO
// review).
export function percentile(samples, p) {
  if (!samples.length) return null;
  if (p <= 0) return Math.min(...samples);
  if (p >= 100) return Math.max(...samples);
  const sorted = [...samples].sort((a, b) => a - b);
  const rank = Math.ceil((p / 100) * sorted.length);
  return sorted[Math.max(0, rank - 1)];
}

export function percentiles(samples, points = [50, 95, 99]) {
  const out = { count: samples.length };
  for (const p of points) out[`p${p}`] = percentile(samples, p);
  return out;
}

// Fixed-boundary histogram for the console's distribution views. Boundaries
// are milliseconds; the last bucket is open-ended.
export function histogram(samples, boundaries = [250, 500, 1000, 2500, 5000, 10000, 30000]) {
  const buckets = boundaries.map((upTo, index) => ({ from: index === 0 ? 0 : boundaries[index - 1], upTo, count: 0 }));
  buckets.push({ from: boundaries.at(-1), upTo: null, count: 0 });
  for (const sample of samples) {
    const index = boundaries.findIndex((upTo) => sample < upTo);
    buckets[index === -1 ? buckets.length - 1 : index].count += 1;
  }
  return buckets;
}
