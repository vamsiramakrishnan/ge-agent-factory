// Pure id-algebra for the deck<->console agent identity thread.
//
// The deck keys agents as "uc-<n>" (slide id) with a parallel "A-<n>" (agentId);
// both share the same numeric core <n> (see apps/presentation/src/constants/agents.ts:
// { id: "uc-101", agentId: "A-101", ... }). The catalog keys agents by a slug id
// (e.g. "account-reconciliation-agent") whose use-case subtitle carries the "A-<n>".
//
// This module ONLY normalizes id forms — it does NOT bundle the catalog. Slug/catalog
// resolution is done by the consumer against ITS OWN data using candidateKeys()
// (e.g. the console matches catalog subtitles; the deck links by uc- id directly).

export interface NormalizedAgentId {
  raw: string;
  num: string | null; // the numeric core, e.g. "2103"
  ucId: string | null; // "uc-2103"
  agentId: string | null; // "A-2103"
}

const UC = /^uc-([0-9a-z]+)$/i;
const AG = /^a-([0-9a-z]+)$/i;
const NUM = /^([0-9]+)$/;

export function normalizeAgentId(anyId: string | null | undefined): NormalizedAgentId {
  const raw = String(anyId ?? "").trim();
  let num: string | null = null;
  const uc = raw.match(UC);
  const ag = raw.match(AG);
  const n = raw.match(NUM);
  if (uc) num = uc[1];
  else if (ag) num = ag[1];
  else if (n) num = n[1];
  return {
    raw,
    num,
    ucId: num ? `uc-${num}` : null,
    agentId: num ? `A-${num}` : null,
  };
}

// The set of id forms to try when matching an agent across namespaces, deduped.
// For a slug id (no numeric core) this is just the slug itself.
export function candidateKeys(anyId: string | null | undefined): string[] {
  const { raw, num, ucId, agentId } = normalizeAgentId(anyId);
  const keys = [raw, ucId, agentId, num].filter((k): k is string => Boolean(k));
  return Array.from(new Set(keys));
}

// True if two ids refer to the same agent by id-form (uc/A/number equivalence),
// or are the identical raw string (covers slug ids).
export function sameAgent(anyId: string | null | undefined, other: string | null | undefined): boolean {
  const a = normalizeAgentId(anyId);
  const b = normalizeAgentId(other);
  if (a.raw && a.raw === b.raw) return true;
  return Boolean(a.num && a.num === b.num);
}
