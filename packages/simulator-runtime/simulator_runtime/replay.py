from __future__ import annotations

import hashlib
import json
import logging
import os
import re
from copy import deepcopy
from pathlib import Path
from typing import Any

logger = logging.getLogger(__name__)


# Record/replay cassettes at the router boundary — opt-in, default-off.
#
# Record mode (env ``GE_SIMULATOR_RECORD_DIR=<dir>``): after every
# ``execute_simulator_tool`` call, one JSONL line
# ``{"args_fingerprint", "envelope", "key", "tool"}`` (stable field order —
# ``sort_keys``) is appended to ``<dir>/<agent>__<system>.jsonl``, so cassettes
# are human-readable and diff-friendly.
#
# Replay mode (env ``GE_SIMULATOR_REPLAY_DIR=<dir>``): before dispatch, the call's
# fingerprint is looked up in its cassette. Repeated identical calls consume
# matches in recorded order (the n-th identical call replays the n-th recorded
# envelope). A hit returns a deep copy of the recorded envelope with
# ``"replayed": true`` added. A **miss falls through to live execution — it never
# errors** (missing cassette file, missing directory, exhausted matches, and
# unrecorded calls all behave the same way), so a partial cassette degrades to a
# partial replay instead of breaking a run.
#
# Fingerprint: BLAKE2b over canonical JSON of ``(tool, sorted args)`` with
# *volatile* keys removed — client-generated tokens that legitimately differ
# between a recording run and a replaying run (idempotency keys, request ids,
# nonces; see ``VOLATILE_ARG_KEYS``). Everything else, including paging and
# ``seed`` args, is significant.
#
# Neither env set (the default): both hooks return after a single ``os.environ``
# read — zero file IO, zero behaviour change. When both are set, replayed hits
# are returned before the record hook, so they are not re-recorded.

RECORD_DIR_ENV = "GE_SIMULATOR_RECORD_DIR"
REPLAY_DIR_ENV = "GE_SIMULATOR_REPLAY_DIR"

# Args excluded from the fingerprint: volatile client-side tokens whose values
# differ per run without changing what the call *means*.
VOLATILE_ARG_KEYS = {
    "idempotency_key",
    "idempotencyKey",
    "request_id",
    "requestId",
    "nonce",
    "client_token",
    "clientToken",
}

# Per-process replay session state:
#   parsed cassettes, keyed by (path, mtime_ns, size) so an updated file re-parses;
#   consumption counters, keyed by (path, key, tool, fingerprint), so identical
#   calls replay their recorded responses in order. ``reset()`` clears both.
_CASSETTES: dict[tuple[str, int, int], list[dict[str, Any]]] = {}
_CONSUMED: dict[tuple[str, str, str, str], int] = {}


def reset() -> None:
    """Drop cached cassettes and consumption counters (a fresh replay session)."""
    _CASSETTES.clear()
    _CONSUMED.clear()


def _slug(value: Any) -> str:
    """Filesystem-safe rendering of an agent/system id for the cassette filename."""
    return re.sub(r"[^A-Za-z0-9._-]+", "_", str(value)) or "_"


def _cassette_path(root: str, agent_id: str, system_id: str) -> Path:
    return Path(root) / f"{_slug(agent_id)}__{_slug(system_id)}.jsonl"


def args_fingerprint(tool_name: str, args: dict[str, Any] | None) -> str:
    """Deterministic fingerprint of (tool, non-volatile args) — BLAKE2b over canonical JSON."""
    significant = {
        str(k): (args or {})[k] for k in sorted(args or {}, key=str) if k not in VOLATILE_ARG_KEYS
    }
    canonical = json.dumps(
        {"args": significant, "tool": tool_name},
        sort_keys=True,
        separators=(",", ":"),
        default=str,
    )
    return hashlib.blake2b(canonical.encode("utf-8"), digest_size=16).hexdigest()


def record_call(
    agent_id: str,
    system_id: str,
    scenario_id: str,
    tool_name: str,
    args: dict[str, Any] | None,
    envelope: dict[str, Any],
) -> None:
    """Append this call's envelope to its cassette. No-op unless record mode is on."""
    root = os.environ.get(RECORD_DIR_ENV)
    if not root:
        return
    path = _cassette_path(root, agent_id, system_id)
    line = json.dumps(
        {
            "args_fingerprint": args_fingerprint(tool_name, args),
            "envelope": envelope,
            "key": f"{agent_id}:{system_id}:{scenario_id}",
            "tool": tool_name,
        },
        sort_keys=True,
        default=str,
    )
    path.parent.mkdir(parents=True, exist_ok=True)
    with path.open("a", encoding="utf-8") as handle:
        handle.write(line + "\n")


def _load_cassette(path: Path) -> list[dict[str, Any]]:
    try:
        stat = path.stat()
    except OSError:
        # Missing cassette (or unreadable dir) is a documented miss ⇒ live execution.
        return []
    cache_key = (str(path), stat.st_mtime_ns, stat.st_size)
    cached = _CASSETTES.get(cache_key)
    if cached is not None:
        return cached
    entries: list[dict[str, Any]] = []
    for lineno, raw in enumerate(path.read_text(encoding="utf-8").splitlines(), start=1):
        if not raw.strip():
            continue
        try:
            entry = json.loads(raw)
        except json.JSONDecodeError:
            # A corrupt line degrades that one call to live execution — loudly.
            logger.warning("skipping malformed cassette line %s:%d", path, lineno)
            continue
        if isinstance(entry, dict):
            entries.append(entry)
    _CASSETTES[cache_key] = entries
    return entries


def replay_lookup(
    agent_id: str,
    system_id: str,
    scenario_id: str,
    tool_name: str,
    args: dict[str, Any] | None,
) -> dict[str, Any] | None:
    """Return the recorded envelope for this call (flagged ``replayed``), or ``None``.

    ``None`` means "execute live" — replay mode off, no cassette, or no (remaining)
    recorded match for this fingerprint. Never raises for a miss.
    """
    root = os.environ.get(REPLAY_DIR_ENV)
    if not root:
        return None
    path = _cassette_path(root, agent_id, system_id)
    entries = _load_cassette(path)
    if not entries:
        return None
    key = f"{agent_id}:{system_id}:{scenario_id}"
    fingerprint = args_fingerprint(tool_name, args)
    matches = [
        entry
        for entry in entries
        if entry.get("key") == key
        and entry.get("tool") == tool_name
        and entry.get("args_fingerprint") == fingerprint
    ]
    if not matches:
        return None
    consumed_key = (str(path), key, tool_name, fingerprint)
    index = _CONSUMED.get(consumed_key, 0)
    if index >= len(matches):
        return None  # recorded responses exhausted ⇒ fall through live
    _CONSUMED[consumed_key] = index + 1
    envelope = deepcopy(matches[index].get("envelope"))
    if not isinstance(envelope, dict):
        logger.warning("cassette entry for %s in %s has no envelope — executing live", tool_name, path)
        return None
    envelope["replayed"] = True
    return envelope
