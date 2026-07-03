/**
 * realism-profiles.mjs — statistical "realistic" realization tier on top of the
 * offline generator in data-recipe.mjs.
 *
 * `generateRealistic(recipe, contract, { seed })` first runs `generateWithFaker`
 * (so primary keys, FK closure, and row counts are exactly the proven baseline)
 * and then deterministically re-realizes value fields:
 *   - money-like numbers  -> logNormal (median ~2500), 2-decimal rounded
 *   - count-like numbers  -> poisson
 *   - other numbers       -> triangular
 *   - enums               -> zipf-weighted (frequent values dominate); enums that
 *                            are a workflow's stateField are weighted by state
 *                            position, so early/source states outnumber terminal
 *   - lifecycle dates     -> per-row monotone eventSequence anchored on a
 *                            business-hours creation timestamp
 *   - person/email fields -> a shared deterministic persona pool, so the same
 *                            humans recur across collections and emails match names
 *   - a seeded fraction of rows gets realistic edge cases (unicode names,
 *     max-length text, 0.01 amounts, same-day lifecycles, near-duplicate names)
 *
 * PK and ref fields are never touched, so `checkFkClosure` holds by construction.
 * Everything derives from (seed, collection, field) sub-rngs: identical inputs
 * produce identical bytes. The baseline `generateWithFaker` path is unchanged.
 *
 * Returns { data: { [collection]: rows[] }, report: { personas, edgeCases, distributions } }.
 */

import { generateWithFaker } from "./data-recipe.mjs";
import {
  rngFor,
  logNormal,
  poisson,
  triangular,
  zipfWeights,
  weightedChoice,
  businessHoursTimestamp,
  eventSequence,
} from "./synth-distributions.mjs";

// ── profiles ──────────────────────────────────────────────────────────────────

export const REALISM_PROFILES = {
  realistic: {
    description: "Skewed distributions, workflow-aware state frequencies, temporal + persona coherence, seeded edge cases.",
    money: { median: 2500, sigma: 1.1 },
    countLambda: 4,
    genericNumber: { min: 0, mode: 25, max: 100 },
    enumZipfExponent: 1.0,
    stateZipfExponent: 1.3,
    window: { startIso: "2025-01-01T00:00:00.000Z", endIso: "2026-06-30T00:00:00.000Z" },
    edgeCaseRate: 0.06,
  },
};

// ── persona pool ──────────────────────────────────────────────────────────────

const PERSONA_FIRST = ["Avery", "Jordan", "Riley", "Casey", "Morgan", "Quinn", "Sasha", "Devin", "Noah", "Priya", "Marco", "Lena", "Sofia", "Dwayne", "Noor", "Kai", "Ingrid", "Mateo", "Yuki", "Tunde", "Elena", "Ravi", "Maeve", "Omar"];
const PERSONA_LAST = ["Johnson", "Raman", "Silva", "Becker", "Kallio", "Ortiz", "Fischer", "Nguyen", "Patel", "Costa", "Hassan", "Ibrahim", "Reyes", "Tan", "Okafor", "Singh", "Larsen", "Moreau", "Sato", "Adeyemi", "Petrova", "Iyer", "Gallagher", "Haddad"];

/** ASCII-fold a name fragment for use as an email local-part token. */
export function personaSlug(text) {
  return String(text || "")
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "");
}

/**
 * Fixed, deterministic 24-persona pool shared by every collection in a pack.
 * The (i*7+3)%24 pairing avoids first[i]/last[i] lockstep without randomness.
 */
export function buildPersonaPool() {
  const personas = [];
  for (let i = 0; i < 24; i += 1) {
    const first = PERSONA_FIRST[i];
    const last = PERSONA_LAST[(i * 7 + 3) % 24];
    personas.push({
      first,
      last,
      name: `${first} ${last}`,
      display: `${last}, ${first}`,
      email: `${personaSlug(first)}.${personaSlug(last)}@example.com`,
    });
  }
  return personas;
}

// ── field classification ──────────────────────────────────────────────────────

const PERSON_FIELD_NAMES = new Set([
  "assigned_to", "assignee", "caller", "manager", "author", "approver", "owner",
  "owned_by", "on_call", "requested_by", "requested_for", "reporter", "reviewer",
  "created_by", "updated_by", "submitted_by",
]);

function isPersonField(field, desc) {
  if (desc.kind !== "string") return false;
  const name = field.toLowerCase();
  return PERSON_FIELD_NAMES.has(name) || name.endsWith("_by") || name.endsWith("_for");
}

const MONEY_NAME = /(amount|price|premium|cost|salary|budget|fee|total)/;
const COUNT_NAME = /(count|qty|quantity|attempts|retries|views|failures|errors)/;

// Lifecycle ordering by field name; lower rank happens earlier in a row's life.
// Unrecognized date fields land mid-lifecycle (1.5) so they stay causally
// between creation and closure.
function lifecycleRank(field) {
  const name = field.toLowerCase();
  if (/(created|opened|requested|submitted|reported|received|raised|start)/.test(name)) return 0;
  if (/(updated|modified|assigned|acknowledged|approved|scheduled)/.test(name)) return 1;
  if (/(resolved|fulfilled|implemented|delivered)/.test(name)) return 2;
  if (/(closed|completed|archived|retired|end)/.test(name)) return 3;
  return 1.5;
}

// Map collection -> { stateField, order } from workflows.json toolHandlers so a
// state enum can be weighted by machine position (source states outnumber
// terminal ones, like a live queue).
function workflowStateOrders(contract) {
  const orders = new Map();
  for (const workflow of Object.values(contract?.workflows?.toolHandlers || {})) {
    if (!workflow.collection || !workflow.transitions) continue;
    if (orders.has(workflow.collection)) continue;
    orders.set(workflow.collection, {
      stateField: workflow.stateField || "state",
      order: Object.keys(workflow.transitions),
    });
  }
  return orders;
}

function classifyFields(collection, spec, stateOrders) {
  const plan = {
    money: [], counts: [], numbers: [], enums: [], stateEnum: null,
    lifecycle: [], persons: [], names: [], emails: [], longText: [],
  };
  const workflow = stateOrders.get(collection) || null;
  let declIndex = 0;
  for (const [field, desc] of Object.entries(spec.fields)) {
    declIndex += 1;
    if (field === spec.primaryKey || desc.kind === "pk" || desc.kind === "ref") continue;
    const gen = desc.generator?.gen;
    if (desc.kind === "number") {
      const name = field.toLowerCase();
      if (MONEY_NAME.test(name)) plan.money.push(field);
      else if (COUNT_NAME.test(name)) plan.counts.push(field);
      else plan.numbers.push(field);
      continue;
    }
    if (desc.kind === "enum" && desc.values?.length) {
      if (workflow && field === workflow.stateField) {
        plan.stateEnum = { field, values: desc.values, order: workflow.order };
      } else {
        plan.enums.push({ field, values: desc.values });
      }
      continue;
    }
    if (desc.kind !== "string") continue;
    if (isPersonField(field, desc)) {
      plan.persons.push(field);
      continue;
    }
    if (gen === "money") { plan.money.push(field); continue; }
    if (gen === "email") { plan.emails.push(field); continue; }
    if (gen === "date") { plan.lifecycle.push({ field, rank: lifecycleRank(field), declIndex }); continue; }
    if (gen === "name") { plan.names.push(field); continue; }
    if (gen === "sentence") { plan.longText.push(field); continue; }
  }
  plan.lifecycle.sort((a, b) => (a.rank - b.rank) || (a.declIndex - b.declIndex));
  return plan;
}

// Order a state enum's values by workflow position (declared transition order),
// appending any enum values the machine doesn't mention.
function stateOrderedValues(stateEnum) {
  const ordered = stateEnum.order.filter((v) => stateEnum.values.includes(v));
  for (const value of stateEnum.values) if (!ordered.includes(value)) ordered.push(value);
  return ordered;
}

// ── edge cases ────────────────────────────────────────────────────────────────

const UNICODE_NAMES = ["Zoë Müller-García", "李小龙", "O'Brien", "Renée D'Souza", "Åsa Þórsdóttir", "José Ñañez"];
const LONG_TEXT_UNIT = "Escalated after repeated recurrence across regions; downstream dependency chain reviewed with the service owner and pending a permanent fix. ";
// ~280 chars: near the practical max of short-description-style columns.
const LONG_TEXT = (LONG_TEXT_UNIT + LONG_TEXT_UNIT + LONG_TEXT_UNIT).slice(0, 280);

function edgeEmailFor(name, index) {
  const parts = String(name).trim().split(/\s+/);
  const local = parts.map(personaSlug).filter(Boolean).join(".");
  return `${local || `edge${index}`}@example.com`;
}

function applyEdgeCase(kind, { row, rows, index, plan, rng }) {
  const nameField = plan.persons[0] || plan.names[0];
  switch (kind) {
    case "unicode_name": {
      const value = UNICODE_NAMES[Math.floor(rng() * UNICODE_NAMES.length) % UNICODE_NAMES.length];
      row[nameField] = value;
      // Keep email/name coherence: emails in this tier track the first person field.
      if (plan.persons[0] === nameField) {
        for (const emailField of plan.emails) row[emailField] = edgeEmailFor(value, index);
      }
      return;
    }
    case "max_length_string":
      row[plan.longText[0]] = LONG_TEXT;
      return;
    case "boundary_amount":
      row[plan.money[0]] = 0.01;
      return;
    case "same_day_lifecycle": {
      const anchor = row[plan.lifecycle[0].field];
      for (const entry of plan.lifecycle) row[entry.field] = anchor;
      return;
    }
    case "near_duplicate_name": {
      const base = String(rows[0][nameField] ?? "");
      row[nameField] = rng() < 0.5 ? base.toUpperCase() : base.replace(" ", "  ");
      return;
    }
    default:
      throw new Error(`Unknown edge-case kind: ${kind}`);
  }
}

function applicableEdgeKinds(plan, index) {
  const kinds = [];
  const hasName = plan.persons.length || plan.names.length;
  if (hasName) kinds.push("unicode_name");
  if (plan.longText.length) kinds.push("max_length_string");
  if (plan.money.length) kinds.push("boundary_amount");
  if (plan.lifecycle.length >= 2) kinds.push("same_day_lifecycle");
  if (hasName && index > 0) kinds.push("near_duplicate_name");
  return kinds;
}

// ── generateRealistic ─────────────────────────────────────────────────────────

/**
 * Realistic realization tier. Same contract shape as `generateWithFaker` for the
 * data, plus a sidecar report. Deterministic for identical (recipe, contract, seed).
 */
export function generateRealistic(recipe, contract, { seed, profile = "realistic", edgeCaseRate } = {}) {
  const spec = REALISM_PROFILES[profile];
  if (!spec) {
    throw new Error(`Unknown realism profile "${profile}" (available: ${Object.keys(REALISM_PROFILES).join(", ")})`);
  }
  const baseSeed = (Number(seed ?? recipe.seed) >>> 0) || 0;
  const rate = edgeCaseRate === undefined ? spec.edgeCaseRate : Number(edgeCaseRate);
  const data = generateWithFaker(recipe, { seed: baseSeed });
  const personas = buildPersonaPool();
  const stateOrders = workflowStateOrders(contract);
  const distributions = {};
  const edgeCases = [];

  for (const collection of recipe.order) {
    const collectionSpec = recipe.collections[collection];
    const rows = data[collection];
    if (!collectionSpec || !rows?.length) continue;
    const plan = classifyFields(collection, collectionSpec, stateOrders);
    const note = (field, kind) => { distributions[`${collection}.${field}`] = kind; };

    const fieldRng = (field, label) => rngFor(baseSeed, collection, field, label);
    const moneyRngs = plan.money.map((f) => fieldRng(f, "money"));
    const countRngs = plan.counts.map((f) => fieldRng(f, "count"));
    const numberRngs = plan.numbers.map((f) => fieldRng(f, "number"));
    const enumRngs = plan.enums.map((e) => fieldRng(e.field, "enum"));
    const enumWeights = plan.enums.map((e) => zipfWeights(e.values.length, spec.enumZipfExponent));
    const stateRng = plan.stateEnum ? fieldRng(plan.stateEnum.field, "state") : null;
    const stateValues = plan.stateEnum ? stateOrderedValues(plan.stateEnum) : null;
    const stateWeights = stateValues ? zipfWeights(stateValues.length, spec.stateZipfExponent) : null;
    const personRngs = plan.persons.map((f) => fieldRng(f, "persona"));
    const emailOnlyRng = !plan.persons.length && plan.emails.length ? fieldRng(plan.emails[0], "persona") : null;
    const lifecycleRng = rngFor(baseSeed, collection, "lifecycle");
    const edgeRng = rngFor(baseSeed, collection, "edge-cases");

    plan.money.forEach((f) => note(f, "logNormal"));
    plan.counts.forEach((f) => note(f, "poisson"));
    plan.numbers.forEach((f) => note(f, "triangular"));
    plan.enums.forEach((e) => note(e.field, "zipf"));
    if (plan.stateEnum) note(plan.stateEnum.field, "zipfWorkflowStates");
    plan.lifecycle.forEach((e) => note(e.field, "eventSequence"));
    plan.persons.forEach((f) => note(f, "persona"));
    plan.emails.forEach((f) => note(f, "personaEmail"));

    rows.forEach((row, index) => {
      plan.money.forEach((field, j) => {
        row[field] = Math.round(logNormal(moneyRngs[j], spec.money) * 100) / 100;
      });
      plan.counts.forEach((field, j) => {
        row[field] = poisson(countRngs[j], spec.countLambda);
      });
      plan.numbers.forEach((field, j) => {
        row[field] = Math.round(triangular(numberRngs[j], spec.genericNumber));
      });
      plan.enums.forEach((entry, j) => {
        row[entry.field] = weightedChoice(enumRngs[j], entry.values, enumWeights[j]);
      });
      if (plan.stateEnum) {
        row[plan.stateEnum.field] = weightedChoice(stateRng, stateValues, stateWeights);
      }
      if (plan.lifecycle.length) {
        // Creation lands in business hours; later lifecycle events follow monotonically.
        const created = businessHoursTimestamp(lifecycleRng, spec.window);
        const rest = plan.lifecycle.length > 1
          ? eventSequence(lifecycleRng, { startIso: created, endIso: spec.window.endIso, steps: plan.lifecycle.length - 1 })
          : [];
        const sequence = [created, ...rest];
        plan.lifecycle.forEach((entry, j) => { row[entry.field] = sequence[j]; });
      }
      // One primary persona per row; the first person field and every email field
      // share it, so a row's email always matches a name on the same row.
      if (plan.persons.length || plan.emails.length) {
        const primaryRng = personRngs[0] || emailOnlyRng;
        const primary = personas[Math.floor(primaryRng() * personas.length) % personas.length];
        plan.persons.forEach((field, j) => {
          if (j === 0) {
            row[field] = primary.name;
            return;
          }
          const other = personas[Math.floor(personRngs[j]() * personas.length) % personas.length];
          row[field] = other.name;
        });
        plan.emails.forEach((field) => { row[field] = primary.email; });
      }
      // Edge injection last so it can override the realistic values above.
      if (edgeRng() < rate) {
        const kinds = applicableEdgeKinds(plan, index);
        if (kinds.length) {
          const kind = kinds[Math.floor(edgeRng() * kinds.length) % kinds.length];
          applyEdgeCase(kind, { row, rows, index, plan, rng: edgeRng });
          edgeCases.push({ collection, id: String(row[collectionSpec.primaryKey]), kind });
        }
      }
    });
  }

  return { data, report: { personas: personas.length, edgeCases, distributions } };
}
