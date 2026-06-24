"""Runtime overlay of dynamically-registered (BYO / synthesized) simulator packs.

This is the layer that turns the simulator corpus from a build-time artifact into a
runtime-instantiable capability. A synthesized pack is registered here as an *inline*
contract (no files) and is immediately resolvable by the same engine — no restart,
no redeploy. Resolution order in ``registry.get_simulator_contract`` is overlay → built-in.

Packs are keyed by ``system_id`` (synthesis namespaces BYO ids, e.g. ``byo_partsledger``,
so they never collide with the corpus). The overlay is in-memory by default; set
``GE_SIMULATOR_OVERLAY_BACKEND=firestore`` (or ``alloydb``) so every Cloud Run instance
resolves the same packs. Persistence reuses the StateStore backends and degrades to
memory if the dependency/config is missing, exactly like simulator state.
"""

from __future__ import annotations

import logging
import os
from typing import Any

logger = logging.getLogger(__name__)

OVERLAY_BACKEND_ENV = "GE_SIMULATOR_OVERLAY_BACKEND"
# Synthesized/BYO system ids are namespaced with this prefix (see synthesis.slugify).
# Resolution skips the durable lookup for ids that don't match it, so enabling a
# Firestore overlay does NOT add a per-call Firestore read for the 54 builtin systems.
# Set GE_SIMULATOR_OVERLAY_PREFIX="" to consult the durable store for every id.
OVERLAY_ID_PREFIX_ENV = "GE_SIMULATOR_OVERLAY_PREFIX"
_DEFAULT_ID_PREFIX = "byo_"
_OVERLAY_COLLECTION = "simulator_packs"
_KEY_PREFIX = "pack:"


def _overlay_id_prefix() -> str:
    value = os.environ.get(OVERLAY_ID_PREFIX_ENV)
    return _DEFAULT_ID_PREFIX if value is None else value

# Process-local cache (also the only store when the backend is memory).
_MEM: dict[str, dict[str, Any]] = {}

# Change listeners notified (with the affected system_id) whenever a pack is mounted or
# removed. This is the seam that lets dependents (e.g. simulators.py's handler cache)
# invalidate themselves WITHOUT importing simulators here — avoiding the overlay↔simulators
# import cycle. Listeners are registered at import time by the dependent module.
from typing import Callable

_CHANGE_LISTENERS: list[Callable[[str | None], None]] = []


def register_change_listener(fn: Callable[[str | None], None]) -> None:
    """Register ``fn(system_id)`` to be called on overlay (un)registration."""
    if fn not in _CHANGE_LISTENERS:
        _CHANGE_LISTENERS.append(fn)


def unregister_change_listener(fn: Callable[[str | None], None]) -> None:
    try:
        _CHANGE_LISTENERS.remove(fn)
    except ValueError:
        pass


def _notify_change(system_id: str | None) -> None:
    for fn in list(_CHANGE_LISTENERS):
        try:
            fn(system_id)
        except Exception as exc:  # noqa: BLE001 - a bad listener must not break (un)register
            logger.warning("overlay change listener failed for %s: %s", system_id, exc)


def _durable():
    """Return a durable StateStore for overlay packs, or ``None`` for memory-only."""
    backend = (os.environ.get(OVERLAY_BACKEND_ENV) or "").strip().lower()
    if backend in ("", "memory"):
        return None
    try:
        if backend == "firestore":
            from simulator_runtime.state_store import FirestoreStateStore

            return FirestoreStateStore(collection=_OVERLAY_COLLECTION)
        if backend == "alloydb":
            from simulator_runtime.state_store import AlloyDBStateStore

            return AlloyDBStateStore(table=_OVERLAY_COLLECTION)
        logger.warning("unknown overlay backend %r; memory only", backend)
    except Exception as exc:  # noqa: BLE001 - any init failure ⇒ memory only
        logger.warning("overlay backend %r unavailable (%s); memory only", backend, exc)
    return None


def register_overlay_contract(contract: dict[str, Any]) -> dict[str, Any]:
    """Mount a synthesized/BYO contract so the engine serves it immediately.

    ``contract`` must already be an enriched, inline contract (see
    ``pack_loader.normalize_contract`` with the inline shape) carrying at least ``id``,
    ``displayName``, ``schema`` and ``toolCatalog``.
    """
    system_id = contract.get("id")
    if not system_id:
        raise ValueError("overlay contract requires an 'id'")
    _MEM[system_id] = contract
    store = _durable()
    if store is not None:
        try:
            store.set(f"{_KEY_PREFIX}{system_id}", contract)
        except Exception as exc:  # noqa: BLE001 - persistence is best-effort
            logger.warning("overlay persist failed for %s: %s", system_id, exc)
    _notify_change(system_id)
    return contract


def get_overlay_contract(system_id: str) -> dict[str, Any] | None:
    if system_id in _MEM:
        return _MEM[system_id]
    # Builtin ids never carry the overlay prefix → skip the durable read entirely.
    prefix = _overlay_id_prefix()
    if prefix and not system_id.startswith(prefix):
        return None
    store = _durable()
    if store is not None:
        try:
            doc = store.get(f"{_KEY_PREFIX}{system_id}")
        except Exception:  # noqa: BLE001
            doc = None
        if doc:
            _MEM[system_id] = doc
            return doc
    return None


def list_overlay_contracts() -> list[dict[str, Any]]:
    store = _durable()
    if store is not None:
        try:
            for namespace, doc in store.scan(_KEY_PREFIX).items():
                _MEM.setdefault(namespace[len(_KEY_PREFIX):], doc)
        except Exception:  # noqa: BLE001
            pass
    return list(_MEM.values())


def unregister_overlay_contract(system_id: str) -> None:
    _MEM.pop(system_id, None)
    store = _durable()
    if store is not None:
        try:
            store.delete(f"{_KEY_PREFIX}{system_id}")
        except Exception:  # noqa: BLE001
            pass
    _notify_change(system_id)


def clear() -> None:
    """Drop the in-memory overlay cache (tests; does not touch durable storage)."""
    _MEM.clear()
