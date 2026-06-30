// Behavior-contract tool renderer for app/tools.py. Each emitted intent (action /
// notification / evidence_lookup / calculation) becomes a fixture-backed Python tool:
// evidence_lookup tools search _CONTRACT_DOCUMENTS for a citation anchor; the rest
// validate required inputs, emit a deterministic audit trail + produced ids, and log
// an action event. Extracted from cmdTools (factory.mjs) verbatim — pure function of
// the intent; byte output is identical to the former inline emitter.

import { safePyName, snakeCase } from "@ge/std/naming";
import { pyEscape, pyTripleEscape } from "./py-emit.mjs";

// Render a single behavior-contract intent to its Python tool source (one string).
export function renderContractToolPython(intent) {
  const fnName = safePyName(intent.name || `${intent.kind || "tool"}_tool`);
  const sourceSystemId = pyEscape(intent.sourceSystemId || "unknown");
  const kind = pyEscape(intent.kind || "action");
  const description = pyTripleEscape(intent.description || `${intent.kind || "Tool"} for ${intent.sourceSystemId || "source system"}`);
  const evidenceFallback = intent.kind === "evidence_lookup" ? ["document_reference"] : ["api_response", "generated_audit_trail"];
  const evidenceLiteral = JSON.stringify((intent.evidenceEmitted && intent.evidenceEmitted.length) ? intent.evidenceEmitted : evidenceFallback);
  const producesList = intent.produces && intent.produces.length ? intent.produces : [];

  if (intent.kind === "evidence_lookup") {
    const anchorParam = (intent.requiredInputs || []).find((input) => /anchor|section|topic/i.test(input)) || "citation_anchor";
    const safeAnchor = safePyName(anchorParam, "citation_anchor");
    const producedFieldLines = producesList
      .filter((produce) => snakeCase(produce) !== "citation_anchor")
      .map((produce) => {
        const safeProduce = safePyName(produce, "result_field");
        if (snakeCase(produce).includes("section")) return `    ${safeProduce} = best.get("snippet", "")`;
        if (snakeCase(produce).includes("document")) return `    ${safeProduce} = best.get("snippet", "")`;
        return `    ${safeProduce} = best.get("${pyEscape(produce)}") or best.get("snippet", "")`;
      });
    const producedDictLines = producesList
      .filter((produce) => snakeCase(produce) !== "citation_anchor")
      .map((produce) => `        "${pyEscape(produce)}": ${safePyName(produce, "result_field")},`);
    return [
      `def ${fnName}(${safeAnchor}: str = "", document_id: str = "") -> dict[str, Any]:`,
      `    """${description}"""`,
      `    candidates = [d for d in _CONTRACT_DOCUMENTS if d.get("source_system_id") == "${sourceSystemId}"]`,
      `    if document_id:`,
      `        candidates = [d for d in candidates if d.get("id") == document_id]`,
      `    if not candidates:`,
      `        return {"error": "no_document_for_source", "source_system_id": "${sourceSystemId}", "tool_kind": "${kind}"}`,
      `    best = None`,
      `    for doc in candidates:`,
      `        path = FIXTURES / doc.get("path", "")`,
      `        if not path.exists():`,
      `            continue`,
      `        text = path.read_text(encoding="utf-8")`,
      `        if ${safeAnchor} and ${safeAnchor}.lower() in text.lower():`,
      `            idx = text.lower().find(${safeAnchor}.lower())`,
      `            snippet = text[max(0, idx - 160):idx + 320].strip()`,
      `            best = {"id": doc.get("id"), "title": doc.get("title"), "snippet": snippet, "anchor_matched": True}`,
      `            break`,
      `        if best is None:`,
      `            best = {"id": doc.get("id"), "title": doc.get("title"), "snippet": text[:400].strip(), "anchor_matched": False}`,
      `    if best is None:`,
      `        return {"error": "documents_unavailable", "source_system_id": "${sourceSystemId}", "tool_kind": "${kind}"}`,
      ...(producedFieldLines.length ? [
        `    # Contract outputs: expose produced fields as top-level keys so`,
        `    # validators and downstream harnesses can trace spec-to-code coverage.`,
        ...producedFieldLines,
      ] : []),
      `    return {`,
      `        "source_system_id": "${sourceSystemId}",`,
      `        "tool_kind": "${kind}",`,
      `        "citation_anchor": ${safeAnchor},`,
      ...producedDictLines,
      `        "document": best,`,
      `        "evidence": ${evidenceLiteral},`,
      `    }`,
      ``,
    ].join("\n");
  }

  const safeInputs = (intent.requiredInputs || []).map((input) => ({ raw: input, safe: safePyName(input, "arg") }));
  const params = safeInputs.map(({ safe }) => `${safe}: str = ""`).join(", ");
  const requiredList = safeInputs.map(({ raw, safe }) => `("${pyEscape(raw)}", ${safe})`).join(", ");
  const requiredCheck = requiredList
    ? [
        `    missing = [name for name, value in [${requiredList}] if not value]`,
        `    if missing:`,
        `        return {"error": "missing_required_inputs", "missing": missing, "tool_kind": "${kind}", "escalation": "request_more_info"}`,
      ].join("\n")
    : "";
  const auditFmt = safeInputs.map(({ raw, safe }) => `${raw}={${safe}}`).join(", ");
  const auditFmtArgs = safeInputs.map(({ safe }) => `${safe}=${safe}`).join(", ");
  const auditLine = safeInputs.length
    ? `    audit_trail = "${pyEscape(intent.name || "intent")}(${auditFmt})".format(${auditFmtArgs})`
    : `    audit_trail = "${pyEscape(intent.name || "intent")}()"`;

  const actionProducesList = producesList.length ? producesList : ["result_id"];
  const generatedProduces = actionProducesList.filter((produce) => snakeCase(produce) !== "audit_trail");
  const producesAssignments = generatedProduces.map((produce) => {
    const safe = safePyName(produce, "result_field");
    const prefix = pyEscape(produce).toUpperCase().slice(0, 8) || "OUT";
    const idArgs = [`"${pyEscape(intent.name || "intent")}"`, ...safeInputs.map(({ safe }) => safe)].join(", ");
    return `    ${safe} = _deterministic_id("${prefix}", ${idArgs})`;
  }).join("\n");
  const producesDict = generatedProduces
    .map((produce) => `        "${pyEscape(produce)}": ${safePyName(produce, "result_field")},`)
    .join("\n");

  return [
    `def ${fnName}(${params}) -> dict[str, Any]:`,
    `    """${description}"""`,
    requiredCheck,
    auditLine,
    producesAssignments,
    `    result = {`,
    `        "source_system_id": "${sourceSystemId}",`,
    `        "tool_kind": "${kind}",`,
    `        "status": "submitted",`,
    producesDict,
    `        "audit_trail": audit_trail,`,
    `        "evidence": ${evidenceLiteral},`,
    `        "produces": ${JSON.stringify(actionProducesList)},`,
    `    }`,
    `    _append_action_event("${fnName}", result)`,
    `    return result`,
    ``,
  ].filter((line) => line !== "").join("\n");
}

// Render the behavior-contract tool section: a section header plus one tool per
// emitted intent. Returns the tools.py lines and the emitted function names (the
// caller wires them into source_adapters and the tools manifest).
export function renderContractToolLines(emittedContractIntents) {
  const lines = [];
  const functionNames = [];
  if (emittedContractIntents.length) {
    lines.push(`# ── Behavior-contract tools (action / notification / evidence / calculation) ──`);
    for (const intent of emittedContractIntents) {
      lines.push(renderContractToolPython(intent));
      functionNames.push(safePyName(intent.name || `${intent.kind || "tool"}_tool`));
    }
  }
  return { lines, functionNames };
}
