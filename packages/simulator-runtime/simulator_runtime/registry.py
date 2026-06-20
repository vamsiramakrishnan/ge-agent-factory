"""Lazy, layered simulator registry.

Previously this module read all six files for all 54 systems at *import time* and froze
the result in a module global — which made the corpus a build-time artifact (you could
not add a system without a restart) and made every import pay full I/O.

Now:
- the registry **index** (one file, ``registry.json``) is parsed lazily on first use;
- each system's heavy contract is **hydrated on demand** and cached (so a one-system
  deployment never reads the other 53);
- resolution is **layered**: a runtime ``overlay`` of synthesized/BYO packs is checked
  before the built-in corpus, so new systems mount live with no redeploy.

The public API (``get_simulator_contract``, ``list_simulator_contracts``) is unchanged.
"""

from __future__ import annotations

import json
from typing import Any

from simulator_runtime import config, overlay
from simulator_runtime.pack_loader import normalize_contract

# id -> raw registry entry (light: summary + file paths). Parsed once, lazily.
_INDEX: dict[str, dict[str, Any]] | None = None
# id -> hydrated built-in contract (heavy: schema/tools/workflows/…). Cached on demand.
_CONTRACT_CACHE: dict[str, dict[str, Any]] = {}


def _index() -> dict[str, dict[str, Any]]:
    global _INDEX
    if _INDEX is None:
        payload = json.loads(config.registry_path().read_text(encoding="utf-8"))
        _INDEX = {
            simulator["id"]: simulator
            for simulator in payload.get("simulators", [])
            if simulator.get("id")
        }
    return _INDEX


def _builtin_contract(system_id: str) -> dict[str, Any] | None:
    cached = _CONTRACT_CACHE.get(system_id)
    if cached is not None:
        return cached
    entry = _index().get(system_id)
    if entry is None:
        return None
    contract = normalize_contract(entry, config.repo_root())
    _CONTRACT_CACHE[system_id] = contract
    return contract


def get_simulator_contract(system_id: str, tenant: str | None = None) -> dict[str, Any]:
    """Resolve a contract: runtime overlay first, then the built-in corpus.

    ``tenant`` is accepted for forward-compatibility; overlay packs are namespaced by
    id at synthesis time, so resolution is by id today.
    """
    overlay_contract = overlay.get_overlay_contract(system_id)
    if overlay_contract is not None:
        return overlay_contract
    contract = _builtin_contract(system_id)
    if contract is None:
        raise KeyError(f"unknown simulator {system_id}")
    return contract


def list_simulator_contracts(include_overlay: bool = True) -> list[dict[str, Any]]:
    contracts = [contract for contract in (_builtin_contract(i) for i in _index()) if contract]
    if include_overlay:
        contracts = [*contracts, *overlay.list_overlay_contracts()]
    return contracts


def builtin_ids() -> list[str]:
    return list(_index().keys())


def reload() -> None:
    """Drop caches so the next access re-reads ``registry.json`` and re-hydrates."""
    global _INDEX
    _INDEX = None
    _CONTRACT_CACHE.clear()
