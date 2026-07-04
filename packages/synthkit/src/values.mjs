// Faker-backed cell-value generation for workspace fixture tables: the
// column-type dispatch (seq patterns, number/float/date/enum/boolean ranges,
// cross-table refs, dotted faker paths) callers run per row/column to fill
// fixtures/tables/*. (Formerly apps/factory/scripts/factory/fixtures/value-gen.mjs,
// where it was extracted from factory.mjs verbatim; the same logic also lived
// as an inline duplicate in generate-mock-data.mjs — this is the single copy.)
// Output is identical to the former inline function for the same faker seed
// state. Deliberately NOT self-seeding: the caller (factory.mjs cmdGenerate,
// generate-mock-data.mjs) owns the faker seed; this function consumes the
// shared singleton's current state so fixture bytes are governed by the
// caller's seed alone.
import { faker } from "@faker-js/faker";

export function generateValue(col, rowIndex, generatedTables) {
  const type = col.type || "string";
  if (type === "seq") {
    const p = col.pattern || `${(col.name || "ID").slice(0, 3).toUpperCase()}-{n:4}`;
    return p.replace(/\{n(?::(\d+))?\}/g, (_, pad) => String(rowIndex + 1).padStart(Number(pad) || 4, "0"));
  }
  if (type === "number") return faker.number.int({ min: col.min ?? 0, max: col.max ?? 1000 });
  if (type === "float") return Number(faker.number.float({ min: col.min ?? 0, max: col.max ?? 1000, fractionDigits: col.decimals ?? 2 }));
  if (type === "date") return faker.date.between({ from: col.min || "2020-01-01", to: col.max || "2026-01-01" }).toISOString().slice(0, 10);
  if (type === "enum") {
    const vals = Array.isArray(col.values) ? col.values : ["A", "B", "C"];
    if (col.weights) return faker.helpers.weightedArrayElement(vals.map((v, i) => ({ value: v, weight: col.weights[i] || 1 })));
    return faker.helpers.arrayElement(vals);
  }
  if (type === "boolean") return faker.datatype.boolean({ probability: col.trueRate ?? 0.5 });
  if (type === "ref") {
    const [entity, field] = (col.ref || "").split(".");
    const ref = generatedTables[entity];
    if (ref?.length) return faker.helpers.arrayElement(ref)[field || "id"] ?? null;
    return `${entity}-${faker.number.int({ min: 1, max: 100 })}`;
  }
  const parts = type.split(".");
  if (parts.length === 2) {
    try {
      const fn = faker[parts[0]]?.[parts[1]];
      if (typeof fn === "function") {
        const opts = {};
        if (col.min !== undefined) opts.min = col.min;
        if (col.max !== undefined) opts.max = col.max;
        if (col.len !== undefined) opts.length = col.len;
        return Object.keys(opts).length ? fn(opts) : fn();
      }
    } catch { /* fall through */ }
  }
  return faker.lorem.word();
}
