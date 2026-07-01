// markdown.mjs
//
// Pure Markdown rendering helpers used by the OKF bundle builder
// (scripts/spec-to-okf.mjs `buildBundle`). Extracted verbatim — no behavior
// change. These turn spec fragments into the Markdown bodies of OKF concepts.

/** Markdown table from rows of header->value. */
export function mdTable(headers, rows) {
  const head = `| ${headers.join(" | ")} |`;
  const sep = `| ${headers.map(() => "---").join(" | ")} |`;
  const body = rows.map((r) => `| ${r.map((c) => String(c ?? "").replace(/\|/g, "\\|").replace(/\n/g, " ")).join(" | ")} |`);
  return [head, sep, ...body].join("\n");
}

/** Join body lines, dropping optional lines (null/undefined) but keeping
 *  intentional blank-line spacers (""). */
export function body(lines) {
  return lines.filter((line) => line !== null && line !== undefined).join("\n");
}

export function bullets(items) {
  const list = (items || []).filter((x) => x !== undefined && x !== null && String(x).length);
  return list.length ? list.map((x) => `- ${String(x).trim()}`).join("\n") : "_None specified._";
}

export function entityFields(entity) {
  return entity.fields || entity.columns || entity.dataContract || entity.schema || [];
}

export function fieldName(field) {
  return typeof field === "string" ? field : field.name || field.field || "";
}
