// Deterministic linguistic perturbation of ConversationCases.
//
// The expansion pool (expansions.mjs) is template-generated, so every case
// asks in exactly one register. Perturbation derives linguistic variants of
// already-selected cases — register shifts, typos, distractor context, and
// compound asks — WITHOUT touching what the case expects: the parent's
// expected/coverage/world/persona fields carry over unchanged, so a variant
// grades against the same behavioral contract as its parent.
//
// Determinism contract: every choice is seeded from an FNV-1a hash of
// (case id + variant index). No clock, no Math.random, no global state —
// the same parent case always yields byte-identical variants.

// 32-bit FNV-1a — the compiler's one hash for seeded choices.
export function fnv1a(text) {
  let hash = 0x811c9dc5;
  const value = String(text);
  for (let i = 0; i < value.length; i++) {
    hash ^= value.charCodeAt(i);
    hash = Math.imul(hash, 0x01000193);
  }
  return hash >>> 0;
}

// Seeded pick: stable per (case id, variant index, salt).
function pick(list, caseId, variant, salt) {
  return list[fnv1a(`${caseId}#${variant}#${salt}`) % list.length];
}

export const PERTURBATION_KINDS = ["register_shift", "typo", "distractor", "compound_ask"];

// ── register shifts ─────────────────────────────────────────────────────────
// Template wrappers around the original ask — the ask itself stays verbatim
// so tool/citation expectations remain answerable.
const REGISTERS = [
  { register: "terse", apply: (ask) => `No preamble, no caveats. ${ask}` },
  { register: "urgent", apply: (ask) => `URGENT — I need this before the cutover deadline today. ${ask}` },
  { register: "polite", apply: (ask) => `Hi! Sorry to bother you — when you have a moment, could you please help? ${ask} Thank you so much.` },
  { register: "frustrated", apply: (ask) => `This is the third time I'm having to ask and nothing has worked so far. ${ask} Please just get it right this time.` },
];

// ── typo injection ──────────────────────────────────────────────────────────
// Seeded character swaps/drops on 1-2 plain words longer than 4 chars.
// Entity-like tokens (anything carrying digits, underscores, or uppercase
// beyond a sentence-initial capital — EMP101, EXC102, action_foo_bar) are
// never touched: mangling an identifier changes the task, not the phrasing.
function isEntityLike(word) {
  const core = word.replace(/[.,;:!?'"()]+$/g, "");
  if (/[0-9_]/.test(core)) return true;
  return /[A-Z]/.test(core.slice(1)); // interior capitals: IDs, acronyms, CamelCase
}

function typoWord(word, seed) {
  const match = word.match(/^(.*?)([.,;:!?'"()]*)$/);
  const core = match[1];
  const tail = match[2];
  if (core.length <= 4) return word;
  // Positions stay strictly interior so the word remains recognizable.
  const position = 1 + (seed % (core.length - 3));
  if (seed % 2 === 0) {
    // adjacent swap
    return core.slice(0, position) + core[position + 1] + core[position] + core.slice(position + 2) + tail;
  }
  // drop
  return core.slice(0, position) + core.slice(position + 1) + tail;
}

function injectTypos(text, caseId, variant) {
  const words = text.split(/(\s+)/); // keep separators so joins are lossless
  const candidates = [];
  for (let i = 0; i < words.length; i += 1) {
    const word = words[i];
    if (/^\s*$/.test(word)) continue;
    if (word.replace(/[.,;:!?'"()]+$/g, "").length <= 4) continue;
    if (isEntityLike(word)) continue;
    candidates.push(i);
  }
  if (!candidates.length) return text;
  const seed = fnv1a(`${caseId}#${variant}#typo`);
  const count = candidates.length > 1 ? 2 : 1;
  const chosen = new Set();
  for (let n = 0; n < count; n += 1) {
    chosen.add(candidates[(seed + n * 7919) % candidates.length]);
  }
  let k = 0;
  return words
    .map((word, i) => (chosen.has(i) ? typoWord(word, fnv1a(`${caseId}#${variant}#typo#${k++}#${word}`)) : word))
    .join("");
}

// ── distractor context ──────────────────────────────────────────────────────
const DISTRACTORS = [
  "Before I forget — the quarterly all-hands got moved to Thursday, so calendars are a mess this week.",
  "Unrelated, but the badge printer on the third floor is down again, in case anyone asks.",
  "Quick heads up first: I'll be out tomorrow afternoon for a dentist appointment.",
  "Context you don't really need: our team just finished the office move and half the boxes are still packed.",
];

// ── compound ask ────────────────────────────────────────────────────────────
// A second, in-scope-but-secondary request appended to the final turn. These
// are meta-requests about the agent's own work, so they are answerable for
// any capability without adding new tool/citation expectations.
const SECONDARY_ASKS = [
  "Also, once you're done, give me a one-line summary of what you did.",
  "And afterwards, list which systems or sources you checked.",
  "Also, at the end, note anything you could not verify.",
  "And when you finish, tell me what you would watch out for next time.",
];

// One perturbation kind applied to a copy of the parent's turns.
function applyKind(kind, turns, caseId, variant) {
  const out = turns.map((turn) => ({ ...turn }));
  if (kind === "register_shift") {
    const { register, apply } = pick(REGISTERS, caseId, variant, "register");
    out[0] = { ...out[0], user: apply(out[0].user) };
    return { turns: out, detail: register };
  }
  if (kind === "typo") {
    out[0] = { ...out[0], user: injectTypos(out[0].user, caseId, variant) };
    return { turns: out, detail: null };
  }
  if (kind === "distractor") {
    const sentence = pick(DISTRACTORS, caseId, variant, "distractor");
    out[0] = { ...out[0], user: `${sentence} Anyway: ${out[0].user}` };
    return { turns: out, detail: null };
  }
  // compound_ask
  const last = out.length - 1;
  out[last] = { ...out[last], user: `${out[last].user} ${pick(SECONDARY_ASKS, caseId, variant, "compound")}` };
  return { turns: out, detail: null };
}

/**
 * Derive `variants` perturbed copies of one ConversationCase. Ids become
 * `<id>.p1`, `<id>.p2`, …; coverage keeps every parent tag and gains
 * `perturbation:<kind>`; every grading field (expected, capabilityId,
 * personaId, worldId, intent, riskWeight) carries over unchanged.
 * Variant kinds rotate from a seeded offset, so up to four variants of the
 * same case are guaranteed distinct kinds.
 */
export function perturbCase(caseObj, { variants = 2 } = {}) {
  const derived = [];
  const offset = fnv1a(caseObj.id) % PERTURBATION_KINDS.length;
  for (let v = 1; v <= variants; v += 1) {
    const kind = PERTURBATION_KINDS[(offset + v - 1) % PERTURBATION_KINDS.length];
    const { turns } = applyKind(kind, caseObj.turns, caseObj.id, v);
    derived.push({
      ...caseObj,
      id: `${caseObj.id}.p${v}`,
      turns,
      expected: caseObj.expected,
      coverage: [...caseObj.coverage, `perturbation:${kind}`],
    });
  }
  return derived;
}

/**
 * Expand a case list with perturbation variants: each original case is kept,
 * immediately followed by its derived variants. Pure and deterministic —
 * calling twice on the same input yields byte-identical output.
 */
export function expandWithPerturbations(cases, options = {}) {
  return (cases || []).flatMap((caseObj) => [caseObj, ...perturbCase(caseObj, options)]);
}
