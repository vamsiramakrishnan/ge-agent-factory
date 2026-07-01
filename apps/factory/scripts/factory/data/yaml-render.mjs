// Minimal YAML + Snowfakery-expression renderers for the mock-data planner.
// Extracted from plan-mock-data.mjs verbatim — pure string functions, byte output
// identical to the former inline helpers.
//
// renderYaml's overall document shape (forced double-quoting of every string
// scalar, "- \n  " block layout for array items that are objects, no line
// folding) is a hand-rolled convention that does not match the `yaml` package's
// idiomatic stringify() output, so the recursive traversal stays custom. The
// leaf-scalar string-escaping rules, however, are delegated to `yaml`'s
// double-quoted scalar emitter (with line folding disabled and JSON-style
// escapes) — verified byte-identical to the former JSON.stringify-based
// escaping across ASCII, unicode, control-character, and long-string inputs.
import { stringify as yamlStringify } from "yaml";

const SCALAR_STRING_OPTIONS = { defaultStringType: "QUOTE_DOUBLE", lineWidth: 0, doubleQuotedAsJSON: true };

export function yamlScalar(value) {
  if (value === null || value === undefined) return "null";
  if (typeof value === "number" || typeof value === "boolean") return String(value);
  return yamlStringify(String(value), SCALAR_STRING_OPTIONS).trim();
}

export function snowExpression(expression) {
  return `\${{${expression}}}`;
}

export function renderYaml(value, indent = 0) {
  const pad = " ".repeat(indent);
  if (Array.isArray(value)) {
    if (!value.length) return `${pad}[]`;
    return value.map((item) => {
      if (item && typeof item === "object") {
        const rendered = renderYaml(item, indent + 2).trimStart();
        return `${pad}- ${rendered.includes("\n") ? `\n${renderYaml(item, indent + 2)}` : rendered}`;
      }
      return `${pad}- ${yamlScalar(item)}`;
    }).join("\n");
  }
  if (value && typeof value === "object") {
    const lines = [];
    for (const [key, child] of Object.entries(value)) {
      if (child && typeof child === "object") {
        lines.push(`${pad}${key}:`);
        lines.push(renderYaml(child, indent + 2));
      } else {
        lines.push(`${pad}${key}: ${yamlScalar(child)}`);
      }
    }
    return lines.join("\n");
  }
  return `${pad}${yamlScalar(value)}`;
}
