"""Helpers for generated fixture-backed evidence document tools."""

from __future__ import annotations

import csv
import json
from collections.abc import Iterable, Mapping, Sequence
from pathlib import Path
from typing import Any

Document = Mapping[str, Any]


def fixture_path(fixtures_root: str | Path, relative_path: str | Path) -> Path:
    """Resolve a path inside a generated agent's fixture directory."""

    return Path(fixtures_root) / Path(relative_path)


def load_json_fixture(fixtures_root: str | Path, relative_path: str | Path) -> Any:
    """Load a JSON fixture relative to ``fixtures_root``."""

    return json.loads(fixture_path(fixtures_root, relative_path).read_text(encoding="utf-8"))


def load_csv_fixture(
    fixtures_root: str | Path,
    relative_path: str | Path,
    *,
    limit: int = 100,
) -> list[dict[str, str]]:
    """Load up to ``limit`` rows from a CSV fixture relative to ``fixtures_root``."""

    with fixture_path(fixtures_root, relative_path).open(newline="", encoding="utf-8") as handle:
        return list(csv.DictReader(handle))[:limit]


def document_word_count(text: str) -> int:
    """Count whitespace-delimited words in fixture document text."""

    return len(text.split())


def _document_text(fixtures_root: str | Path, doc: Document) -> str | None:
    path = doc.get("path")
    if not path:
        return None
    resolved = fixture_path(fixtures_root, path)
    if not resolved.exists():
        return None
    return resolved.read_text(encoding="utf-8")


def _document_summary(fixtures_root: str | Path, doc: Document) -> dict[str, Any]:
    summary = {
        key: doc[key]
        for key in ("id", "title", "type", "path")
        if key in doc and doc[key] is not None
    }
    if "wordCount" in doc:
        summary["wordCount"] = doc["wordCount"]
    else:
        text = _document_text(fixtures_root, doc)
        if text is not None:
            summary["wordCount"] = document_word_count(text)
    return summary


def list_documents(fixtures_root: str | Path, documents: Sequence[Document]) -> dict[str, Any]:
    """Return metadata for all fixture documents."""

    return {"documents": [_document_summary(fixtures_root, doc) for doc in documents]}


def find_document(documents: Iterable[Document], document_id: str) -> Document | None:
    """Find one document by id."""

    return next((doc for doc in documents if doc.get("id") == document_id), None)


def read_document(
    fixtures_root: str | Path,
    documents: Sequence[Document],
    document_id: str,
) -> dict[str, Any]:
    """Read the full text of a fixture document by id."""

    doc = find_document(documents, document_id)
    if not doc:
        return {"error": f"Document {document_id} not found"}
    path = doc.get("path", "")
    resolved = fixture_path(fixtures_root, path)
    if not resolved.exists():
        return {"error": f"File not found: {path}"}
    return {
        "id": doc.get("id"),
        "title": doc.get("title"),
        "content": resolved.read_text(encoding="utf-8"),
    }


def _snippet(text: str, query: str, before: int, after: int) -> str:
    lowered = text.lower()
    idx = lowered.find(query.lower()) if query else 0
    if idx < 0:
        idx = 0
    return text[max(0, idx - before) : idx + after].strip()


def search_documents(
    fixtures_root: str | Path,
    documents: Sequence[Document],
    query: str = "",
    *,
    before: int = 80,
    after: int = 120,
) -> dict[str, Any]:
    """Search fixture documents by keyword and return document snippets."""

    results: list[dict[str, Any]] = []
    for doc in documents:
        text = _document_text(fixtures_root, doc)
        if text is None:
            continue
        if not query or query.lower() in text.lower():
            results.append(
                {
                    "id": doc.get("id"),
                    "title": doc.get("title"),
                    "snippet": _snippet(text, query, before, after),
                }
            )
    return {"query": query, "results": results}


def lookup_document_section(
    fixtures_root: str | Path,
    documents: Sequence[Document],
    *,
    section_anchor: str = "",
    document_id: str = "",
    source_system_id: str = "",
    tool_kind: str = "evidence_lookup",
    before: int = 160,
    after: int = 320,
    default_chars: int = 400,
) -> dict[str, Any]:
    """Look up the best document section for a generated evidence-lookup tool."""

    candidates = list(documents)
    if source_system_id:
        candidates = [doc for doc in candidates if doc.get("source_system_id") == source_system_id]
    if document_id:
        candidates = [doc for doc in candidates if doc.get("id") == document_id]
    if not candidates:
        result = {"error": "no_document_for_source", "tool_kind": tool_kind}
        if source_system_id:
            result["source_system_id"] = source_system_id
        return result

    best: dict[str, Any] | None = None
    for doc in candidates:
        text = _document_text(fixtures_root, doc)
        if text is None:
            continue
        if section_anchor and section_anchor.lower() in text.lower():
            best = {
                "id": doc.get("id"),
                "title": doc.get("title"),
                "snippet": _snippet(text, section_anchor, before, after),
                "anchor_matched": True,
            }
            break
        if best is None:
            best = {
                "id": doc.get("id"),
                "title": doc.get("title"),
                "snippet": text[:default_chars].strip(),
                "anchor_matched": False,
            }

    if best is None:
        result = {"error": "documents_unavailable", "tool_kind": tool_kind}
        if source_system_id:
            result["source_system_id"] = source_system_id
        return result

    result = {
        "tool_kind": tool_kind,
        "citation_anchor": section_anchor,
        "document_section": best.get("snippet", ""),
        "document": best,
        "evidence": ["document_reference"],
    }
    if source_system_id:
        result["source_system_id"] = source_system_id
    return result
