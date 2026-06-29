// CSV read/write for the simulator-seed pipeline. RFC4180-ish: a field containing
// a comma, double-quote, or newline is quoted and embedded quotes are doubled;
// null/undefined serialize to empty; the document ends with a trailing newline.
//
// Deliberately hand-rolled (no dependency): the emitted bytes are consumed by
// Python csv.DictReader at agent runtime and gated by GE_SOURCE_DATE golden diffs,
// so output must stay byte-stable. A csv-parse/csv-stringify swap is deferred behind
// that golden-diff gate (see the reuse plan, Wave 2 STEP-B).
export function toCsv(rows) {
  if (!rows.length) return "";
  const keys = Object.keys(rows[0]);
  return [keys.join(","), ...rows.map((r) => keys.map((k) => {
    const v = r[k];
    if (v == null) return "";
    const s = String(v);
    return /[,"\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
  }).join(","))].join("\n") + "\n";
}

export function parseCsv(text) {
  const rows = [];
  let field = "";
  let row = [];
  let quoted = false;
  for (let i = 0; i < text.length; i += 1) {
    const ch = text[i];
    const next = text[i + 1];
    if (quoted) {
      if (ch === "\"" && next === "\"") {
        field += "\"";
        i += 1;
      } else if (ch === "\"") {
        quoted = false;
      } else {
        field += ch;
      }
      continue;
    }
    if (ch === "\"") quoted = true;
    else if (ch === ",") {
      row.push(field);
      field = "";
    } else if (ch === "\n") {
      row.push(field);
      rows.push(row);
      row = [];
      field = "";
    } else if (ch !== "\r") {
      field += ch;
    }
  }
  if (field || row.length) {
    row.push(field);
    rows.push(row);
  }
  const [headers = [], ...body] = rows.filter((item) => item.some((cell) => String(cell || "").trim() !== ""));
  return body.map((cells) => Object.fromEntries(headers.map((header, index) => [header, cells[index] ?? ""])));
}
