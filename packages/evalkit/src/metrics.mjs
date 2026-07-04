// Lexical similarity — an advisory companion to prove-live's tokenF1.
//
// tokenF1 is a bag-of-words overlap: it cannot see word order (ROUGE-L can)
// or near-miss morphology/typos (character trigrams can). This module blends
// the two into one advisory score. Advisory means advisory: nothing in here
// participates in pass/fail thresholds, verdicts, or baselines — it rides
// alongside the response_match metric so operators can see WHY a structural
// match scored the way it did.
//
// Pure and deterministic: string in, numbers out. No clock, no randomness.

function words(text) {
  return String(text || "").toLowerCase().replace(/[^\p{L}\p{N}\s]/gu, " ").split(/\s+/).filter(Boolean);
}

// Longest common subsequence length over token arrays — O(m·n) with a
// two-row table, fine at transcript scale.
function lcsLength(a, b) {
  if (!a.length || !b.length) return 0;
  let prev = new Array(b.length + 1).fill(0);
  let curr = new Array(b.length + 1).fill(0);
  for (let i = 1; i <= a.length; i += 1) {
    for (let j = 1; j <= b.length; j += 1) {
      curr[j] = a[i - 1] === b[j - 1] ? prev[j - 1] + 1 : Math.max(prev[j], curr[j - 1]);
    }
    [prev, curr] = [curr, prev];
  }
  return prev[b.length];
}

/** ROUGE-L: LCS-based F1 over word tokens. Empty either side → 0. */
export function rougeL(reference, candidate) {
  const ref = words(reference);
  const cand = words(candidate);
  if (!ref.length || !cand.length) return 0;
  const lcs = lcsLength(ref, cand);
  if (!lcs) return 0;
  const precision = lcs / cand.length;
  const recall = lcs / ref.length;
  return (2 * precision * recall) / (precision + recall);
}

function trigramCounts(text) {
  const normalized = words(text).join(" ");
  const counts = new Map();
  if (normalized.length < 3) {
    if (normalized) counts.set(normalized, 1);
    return counts;
  }
  for (let i = 0; i <= normalized.length - 3; i += 1) {
    const gram = normalized.slice(i, i + 3);
    counts.set(gram, (counts.get(gram) || 0) + 1);
  }
  return counts;
}

/** Character-trigram cosine similarity over normalized text. Empty → 0. */
export function trigramCosine(reference, candidate) {
  const a = trigramCounts(reference);
  const b = trigramCounts(candidate);
  if (!a.size || !b.size) return 0;
  let dot = 0;
  for (const [gram, count] of a) dot += count * (b.get(gram) || 0);
  if (!dot) return 0;
  const norm = (counts) => Math.sqrt([...counts.values()].reduce((sum, count) => sum + count * count, 0));
  return dot / (norm(a) * norm(b));
}

/**
 * Blended lexical similarity: 50% ROUGE-L (word order) + 50% character-
 * trigram cosine (surface robustness). Returns { score, rougeL,
 * trigramCosine }, each in [0, 1]; empty strings score 0 across the board.
 */
export function lexicalSimilarity(reference, candidate) {
  const rouge = rougeL(reference, candidate);
  const cosine = trigramCosine(reference, candidate);
  return { score: 0.5 * rouge + 0.5 * cosine, rougeL: rouge, trigramCosine: cosine };
}
