"""Normalize a simulator pack into the in-memory ``contract`` dict the engine consumes.

This is the single place that understands how a pack is *stored*, decoupled from how
it is *served*. It accepts three shapes so the corpus can migrate incrementally and
synthesized (BYO) packs can be mounted with no files at all:

1. **legacy 6-file** — a registry entry with ``schemaPath``/``toolsPath``/…; each path
   is read relative to the repo root.
2. **canonical single-file** — a registry entry with ``packPath`` → one ``pack.json``
   that embeds every section inline under concept keys (``schema``/``tools``/
   ``workflows``/``projection``/``materialization``/``seed``).
3. **inline** — an entry that already carries ``schema``/``toolCatalog`` (synthesized
   packs registered into the overlay at runtime).

All three converge on the same enriched contract:
``{**summary, schema, toolCatalog, projection, materialization, workflowCatalog, seed?, tools:[names]}``
which is exactly the shape ``registry._load_registry`` produced before, so every
downstream consumer (``generic.build_generic_handlers``, ``router``) is unchanged.
"""

from __future__ import annotations

import json
from pathlib import Path
from typing import Any


# Concept keys carried INSIDE a canonical pack.json (vs. the summary fields that live
# alongside them). ``tools`` holds the tool catalog object ({id, version, tools:[…]}).
_PACK_SECTIONS = ("schema", "tools", "workflows", "projection", "materialization", "seed")


def _read_json(repo_root: Path, rel: str | None) -> Any:
    if not rel:
        return None
    return json.loads((repo_root / rel).read_text(encoding="utf-8"))


def _as_tool_catalog(value: Any) -> dict[str, Any] | None:
    """Coerce a pack's ``tools`` section into a catalog dict ({"tools": [...]})."""
    if value is None:
        return None
    if isinstance(value, dict):
        return value
    if isinstance(value, list):
        return {"tools": value}
    return None


def _derive_tools(contract: dict[str, Any], entry: dict[str, Any]) -> list[str]:
    catalog = contract.get("toolCatalog") or {}
    tools = catalog.get("tools") if isinstance(catalog, dict) else None
    if tools:
        return [tool["name"] for tool in tools if tool.get("name")]
    return list(entry.get("tools", []))


def _from_paths(entry: dict[str, Any], repo_root: Path) -> dict[str, Any]:
    return {
        **entry,
        "schema": _read_json(repo_root, entry.get("schemaPath")),
        "toolCatalog": _read_json(repo_root, entry.get("toolsPath")),
        "projection": _read_json(repo_root, entry.get("projectionPath")),
        "materialization": _read_json(repo_root, entry.get("materializationPath")),
        "workflowCatalog": _read_json(repo_root, entry.get("workflowsPath")),
    }


def _from_pack_json(entry: dict[str, Any], pack: dict[str, Any]) -> dict[str, Any]:
    # Summary fields: entry wins (the registry index is authoritative for id/family),
    # then any non-section keys carried inside the pack itself.
    summary = {k: v for k, v in pack.items() if k not in _PACK_SECTIONS}
    return {
        **summary,
        **entry,
        "schema": pack.get("schema"),
        "toolCatalog": _as_tool_catalog(pack.get("tools")),
        "projection": pack.get("projection"),
        "materialization": pack.get("materialization"),
        "workflowCatalog": pack.get("workflows"),
        "seed": pack.get("seed"),
    }


def _from_inline(entry: dict[str, Any]) -> dict[str, Any]:
    contract = dict(entry)
    contract["toolCatalog"] = _as_tool_catalog(
        entry.get("toolCatalog") if entry.get("toolCatalog") is not None else entry.get("tools")
    )
    contract.setdefault("workflowCatalog", entry.get("workflowCatalog") or entry.get("workflows"))
    return contract


def normalize_contract(entry: dict[str, Any], repo_root: Path | str) -> dict[str, Any]:
    """Return the enriched contract for ``entry`` (legacy / canonical / inline)."""
    repo_root = Path(repo_root)
    has_inline_sections = bool(entry.get("schema")) or bool(entry.get("toolCatalog"))
    if entry.get("packPath"):
        pack = _read_json(repo_root, entry["packPath"]) or {}
        contract = _from_pack_json(entry, pack)
    elif has_inline_sections:
        contract = _from_inline(entry)
    else:
        contract = _from_paths(entry, repo_root)
    contract["tools"] = _derive_tools(contract, entry)
    return contract
