from __future__ import annotations

from copy import deepcopy
from typing import Any

from simulator_runtime.state_store import StateStore


# Idempotency replays are cached inside the simulator state document under this
# collection so they ride along with the rest of the per-(agent:system:scenario)
# state in whatever StateStore backs the system (memory/firestore/alloydb). Each
# entry is keyed by (tool, idempotency_key) and stores the original result.
IDEMPOTENCY_COLLECTION = "_idempotency"

# The arg name carrying the client-supplied idempotency token. workday's
# tools.json already declares `idempotency_key` on submit_worker_change; this is
# the canonical name the engine honours.
IDEMPOTENCY_ARG = "idempotency_key"


def idempotency_key_from_args(args: dict[str, Any]) -> str | None:
    """Return the client idempotency key from call args, or None if absent.

    Backward-compatible: a call with no ``idempotency_key`` returns None, so the
    handler runs normally with no replay behaviour.
    """
    raw = args.get(IDEMPOTENCY_ARG)
    if raw is None:
        return None
    key = str(raw).strip()
    return key or None


def _cache_id(tool_name: str, key: str) -> str:
    return f"{tool_name}::{key}"


def lookup_replay(
    store: StateStore,
    state_key: str,
    tool_name: str,
    key: str,
) -> dict[str, Any] | None:
    """Return a deep copy of the stored result for this key, or None on a miss.

    The copy isolates the caller from the cached document so a replayed result can
    never be mutated in place (which would corrupt the stored copy / live state).
    """
    doc = store.get(state_key)
    if not doc:
        return None
    cache_id = _cache_id(tool_name, key)
    for entry in doc.get(IDEMPOTENCY_COLLECTION, []):
        if entry.get("cache_id") == cache_id:
            return deepcopy(entry.get("result"))
    return None


def record_replay(
    store: StateStore,
    state_key: str,
    tool_name: str,
    key: str,
    result: dict[str, Any],
) -> None:
    """Store ``result`` under (tool_name, key) for future replays.

    The result is deep-copied so later in-place mutation of the live state (e.g. a
    subsequent transition on the same row) cannot retroactively change the replay.
    Re-recording the same key overwrites the prior entry.
    """
    doc = store.get(state_key)
    if doc is None:
        doc = {}
    cache_id = _cache_id(tool_name, key)
    entries = [
        entry
        for entry in doc.get(IDEMPOTENCY_COLLECTION, [])
        if entry.get("cache_id") != cache_id
    ]
    entries.append({"cache_id": cache_id, "result": deepcopy(result)})
    doc[IDEMPOTENCY_COLLECTION] = entries
    store.set(state_key, doc)
