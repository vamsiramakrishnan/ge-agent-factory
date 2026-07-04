// Greedy weighted set-cover over the candidate conversation pool.
//
// Why greedy: required coverage is a set-cover instance (NP-hard exactly),
// and the classic greedy gives the standard ln(n) approximation while being
// trivially deterministic — which matters more here than optimality, because
// the selected suite is a committed artifact that must not churn between
// runs of the same spec.
import { DxError } from "@ge/std/dx-error";

function weightOf(kase, riskWeights) {
  // Per-case override lets an operator pin/boost specific cases without
  // regenerating the pool; absent that, the expansion's riskWeight rules.
  const override = riskWeights?.[kase.id];
  return typeof override === "number" ? override : kase.riskWeight ?? 1;
}

// (weight desc, id asc) — the one ordering rule used everywhere in here.
function byWeightThenId(riskWeights) {
  return (a, b) => {
    const delta = weightOf(b, riskWeights) - weightOf(a, riskWeights);
    return delta !== 0 ? delta : a.id < b.id ? -1 : a.id > b.id ? 1 : 0;
  };
}

// Expand tag patterns ("capability:*" or exact "claim:auth-x") against the
// pool. A wildcard requires every concrete tag of that dimension that exists;
// an exact pattern is required even if absent (that absence IS the gap).
function requiredTagsFor(patterns, poolTags) {
  const required = new Set();
  for (const pattern of patterns) {
    if (!/^[a-z_]+:.+$/.test(pattern)) {
      throw new DxError(`invalid coverage pattern: ${pattern}`, {
        where: "requiredCoverage",
        why: "patterns are <dimension>:<value> where value may be * for all tags in that dimension",
        fix: 'use a pattern like "capability:*" or an exact tag like "claim:auth-enrollment"',
      });
    }
    const [dimension, value] = [pattern.slice(0, pattern.indexOf(":")), pattern.slice(pattern.indexOf(":") + 1)];
    if (value === "*") {
      for (const tag of poolTags) if (tag.startsWith(`${dimension}:`)) required.add(tag);
    } else {
      required.add(pattern);
    }
  }
  return required;
}

function coverageSummary({ patterns, requiredTags, selected, totalCandidates }) {
  const covered = new Set(selected.flatMap((kase) => kase.coverage));
  const dimensions = {};
  const dimensionNames = [...new Set(patterns.map((pattern) => pattern.slice(0, pattern.indexOf(":"))))].sort();
  for (const dimension of dimensionNames) {
    const required = [...requiredTags].filter((tag) => tag.startsWith(`${dimension}:`)).sort();
    dimensions[dimension] = {
      required,
      covered: required.filter((tag) => covered.has(tag)),
      gaps: required.filter((tag) => !covered.has(tag)),
    };
  }
  return { dimensions, totalCandidates, selected: selected.length };
}

/**
 * Select a minimal-ish suite covering every required tag, then spend any
 * remaining maxCases budget on the highest-weight leftovers. Returns
 * { selected, dropped, coverage } — dropped lists cover-relevant cases that
 * maxCases forced out (lowest weight first), never the merely-unpicked pool.
 */
export function selectCases({ cases, requiredCoverage = [], maxCases = Infinity, riskWeights } = {}) {
  const pool = [...(cases || [])].sort(byWeightThenId(riskWeights));
  const poolTags = new Set(pool.flatMap((kase) => kase.coverage || []));
  const requiredTags = requiredTagsFor(requiredCoverage, poolTags);

  // Greedy cover: repeatedly take the case covering the most still-uncovered
  // required tags; pool is presorted, so ties resolve by weight then id.
  const uncovered = new Set(requiredTags);
  const selected = [];
  const selectedIds = new Set();
  while (uncovered.size > 0) {
    let best = null;
    let bestGain = 0;
    for (const kase of pool) {
      if (selectedIds.has(kase.id)) continue;
      const gain = (kase.coverage || []).filter((tag) => uncovered.has(tag)).length;
      if (gain > bestGain) {
        best = kase;
        bestGain = gain;
      }
    }
    if (!best) break; // remaining required tags are genuine gaps
    selected.push(best);
    selectedIds.add(best.id);
    for (const tag of best.coverage || []) uncovered.delete(tag);
  }

  // Over budget: shed the lowest-weight cover picks and report them.
  const dropped = [];
  if (selected.length > maxCases) {
    selected.sort(byWeightThenId(riskWeights));
    for (const kase of selected.splice(maxCases)) {
      dropped.push({ id: kase.id, riskWeight: weightOf(kase, riskWeights), coverage: kase.coverage });
    }
  } else {
    // Under budget: top up with the heaviest unselected candidates so the
    // suite actually uses the budget the operator asked for.
    for (const kase of pool) {
      if (selected.length >= maxCases) break;
      if (!selectedIds.has(kase.id)) {
        selected.push(kase);
        selectedIds.add(kase.id);
      }
    }
  }

  selected.sort((a, b) => (a.id < b.id ? -1 : a.id > b.id ? 1 : 0));
  return {
    selected,
    dropped,
    coverage: coverageSummary({
      patterns: requiredCoverage,
      requiredTags,
      selected,
      totalCandidates: (cases || []).length,
    }),
  };
}
