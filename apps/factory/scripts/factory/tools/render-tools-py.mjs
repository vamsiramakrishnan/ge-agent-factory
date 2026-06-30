// Pure renderers for sections of the generated app/tools.py. Extracted from
// cmdTools (factory.mjs) so the Python-source layout lives outside the command
// orchestration and can be parity-tested directly. Each returns an array of
// source lines (spliced into the tools.py line buffer); byte output is identical
// to the former inline construction.

import { snakeCase } from "@ge/std/naming";
import { renderToolsModule } from "../runtime/tools-backend.mjs";
import { tableToolName } from "./tool-naming.mjs";
import { renderQueryToolLines } from "./render-query-tools.mjs";
import { renderContractToolLines } from "./render-contract-tools.mjs";

// Assemble the complete app/tools.py source. Owns the whole layout: preamble +
// per-table query tools + document tools + behavior-contract tools + the
// source_adapters list + the GE_DATA_BACKEND switch module. Pure function of the
// manifest, tables, contract intents, and pipeline. Returns the source string and
// the emitted contract-tool function names (the caller records them in the tools
// pipeline manifest and reports them).
export function renderToolsPy({ manifest, tables, contractIntents, emittedContractIntents, pipeline }) {
  const lines = renderToolsPreambleLines({ manifest, tables });
  lines.push(...renderQueryToolLines({ tables, contractIntents }));

  const docs = manifest.documents || [];
  if (docs.length > 0) {
    lines.push(...renderDocumentToolLines(docs));
  }

  const { lines: contractLines, functionNames: contractToolFunctionNames } = renderContractToolLines(emittedContractIntents);
  lines.push(...contractLines);

  const docToolNames = docs.length > 0 ? ", FunctionTool(func=list_documents), FunctionTool(func=read_document), FunctionTool(func=search_documents)" : "";
  const contractToolList = contractToolFunctionNames.length
    ? `, ${contractToolFunctionNames.map((name) => `FunctionTool(func=${name})`).join(", ")}`
    : "";
  const department = manifest?.useCaseSpec?.department || manifest?.department || "general";
  // The Agent Registry server id this agent registers as — MUST match cmdRegister's
  // serverName so the runtime resolves exactly the registered toolset by name.
  const mcpServerName = snakeCase(pipeline.name || manifest?.id || "mock-agent").replace(/_/g, "-");

  lines.push(
    `source_adapters_fixtures = [FunctionTool(func=list_systems), FunctionTool(func=describe_data_model), ${tables.map((t) => `FunctionTool(func=query_${tableToolName(t)})`).join(", ")}${docToolNames}${contractToolList}]`,
  );
  // Append the GE_DATA_BACKEND switch (fixtures | mcp). mcp resolves tools from Agent
  // Registry by server name; defines source_adapters + mock_tools alias.
  lines.push(renderToolsModule({ agentId: manifest.id, department, mcpServerName }));

  return { source: lines.join("\n"), contractToolFunctionNames };
}

// File preamble: module docstring, imports, fixture loaders, deterministic-id
// helper, the embedded contract-documents table, and the always-present
// describe_data_model / list_systems tools. Pure function of (manifest, tables).
export function renderToolsPreambleLines({ manifest, tables }) {
  return [
    `"""Auto-generated fixture-backed tools for: ${manifest.id}"""`,
    `from __future__ import annotations`,
    `import csv, hashlib, json, os`,
    `from pathlib import Path`,
    `from typing import Any`,
    `from google.adk.tools import FunctionTool`,
    ``,
    `FIXTURES = Path(os.environ.get("FIXTURES_ROOT", str(Path(__file__).resolve().parent.parent / "fixtures")))`,
    `ACTION_EVENTS_DEFAULT = Path(__file__).resolve().parent.parent / "artifacts" / "action-events.jsonl"`,
    ``,
    `def _json(p: str) -> Any: return json.loads((FIXTURES / p).read_text())`,
    `def _csv(p: str, n: int = 100) -> list[dict]:`,
    `    with (FIXTURES / p).open(newline="") as f: return list(csv.DictReader(f))[:n]`,
    `def _action_events_path() -> Path:`,
    `    return Path(os.environ.get("ACTION_EVENTS_PATH", str(ACTION_EVENTS_DEFAULT)))`,
    `def _append_action_event(tool_name: str, result: dict[str, Any]) -> None:`,
    `    ACTION_EVENTS = _action_events_path()`,
    `    ACTION_EVENTS.parent.mkdir(parents=True, exist_ok=True)`,
    `    with ACTION_EVENTS.open("a", encoding="utf-8") as f:`,
    `        f.write(json.dumps({"tool": tool_name, **result}, sort_keys=True) + "\\n")`,
    ``,
    `_CONTRACT_DOCUMENTS = ${JSON.stringify((manifest.documents || []).map((d) => ({ id: d.id, title: d.title, type: d.type, path: d.path, source_system_id: d.sourceSystemId || d.source_system_id || null })))}`,
    ``,
    `def _deterministic_id(prefix: str, *parts: Any) -> str:`,
    `    """Stable identifier for action tools — keeps audit trails reproducible without external state."""`,
    `    payload = "|".join(str(p) for p in parts if p is not None and p != "")`,
    `    digest = hashlib.sha1(payload.encode("utf-8")).hexdigest()[:10].upper() if payload else "EMPTY00000"`,
    `    return f"{prefix}-{digest}"`,
    ``,
    `_SEMANTIC_MODEL_PATH = Path(__file__).resolve().parent.parent / "mock_data" / "metadata" / "semantic-model.json"`,
    ``,
    `def describe_data_model() -> dict[str, Any]:`,
    `    """Return the semantic data model (tables, columns, descriptions, joins, measures,`,
    `    glossary) for grounding NL→SQL and choosing the right table/measure before querying."""`,
    `    try:`,
    `        return json.loads(_SEMANTIC_MODEL_PATH.read_text())`,
    `    except Exception:`,
    `        return {"error": "semantic model not found", "path": str(_SEMANTIC_MODEL_PATH)}`,
    ``,
    `def list_systems() -> dict[str, Any]:`,
    `    """List canonical source systems, tables, and evidence documents for this scenario."""`,
    `    return {"scenario": "${manifest.id}", "systems": ${JSON.stringify(manifest.systems || [])}, "tables": ${JSON.stringify(tables.map((t) => ({ name: t.name, sourceSystem: t.sourceSystem, sourceSystemId: t.sourceSystemId })))}}`,
    ``,
  ];
}

// Evidence-document tools (list/read/search). Emitted only when the manifest has
// documents. Pure function of the documents array.
export function renderDocumentToolLines(docs) {
  return [
    `def list_documents() -> dict[str, Any]:`,
    `    """List all available evidence documents and their metadata."""`,
    `    return {"documents": ${JSON.stringify(docs.map((d) => ({ id: d.id, title: d.title, type: d.type, path: d.path, wordCount: d.wordCount })))}}`,
    ``,
    `def read_document(document_id: str) -> dict[str, Any]:`,
    `    """Read the full text of a document by its ID. Use for citing evidence."""`,
    `    docs = ${JSON.stringify(docs.map((d) => ({ id: d.id, path: d.path, title: d.title })))}`,
    `    doc = next((d for d in docs if d["id"] == document_id), None)`,
    `    if not doc: return {"error": f"Document {document_id} not found"}`,
    `    path = FIXTURES / doc["path"]`,
    `    if not path.exists(): return {"error": f"File not found: {doc['path']}"}`,
    `    return {"id": doc["id"], "title": doc["title"], "content": path.read_text(encoding="utf-8")}`,
    ``,
    `def search_documents(query: str = "") -> dict[str, Any]:`,
    `    """Search documents by keyword. Returns matching document IDs and snippets."""`,
    `    results = []`,
    `    for doc_meta in ${JSON.stringify(docs.map((d) => ({ id: d.id, path: d.path, title: d.title })))}:`,
    `        path = FIXTURES / doc_meta["path"]`,
    `        if not path.exists(): continue`,
    `        text = path.read_text(encoding="utf-8")`,
    `        if not query or query.lower() in text.lower():`,
    `            idx = text.lower().find(query.lower()) if query else 0`,
    `            snippet = text[max(0,idx-80):idx+120].strip()`,
    `            results.append({"id": doc_meta["id"], "title": doc_meta["title"], "snippet": snippet})`,
    `    return {"query": query, "results": results}`,
    ``,
  ];
}
