from __future__ import annotations

import hashlib
import os
import random
from datetime import datetime, timedelta, timezone
from typing import Any


# Virtual simulation clock — opt-in, deterministic, and default-off.
#
# When enabled, every simulator state key (the existing ``agent:system:scenario``
# document ``generic.py`` already keys on — no second keying scheme) carries a small
# clock record inside its state doc: ``{"seconds": <offset>, "calls": <n>}``. Time
# starts at a fixed epoch and advances deterministically per call: the n-th advance
# for a state key adds 13–97 seconds derived BLAKE2b-style from ``(state_key, n)``,
# so the same call sequence yields the same timestamps across processes and Python
# runs (``hash()`` is salted per-process and must not be used).
#
# Enablement (either):
#   - env ``GE_SIMULATOR_VIRTUAL_TIME=1`` (also accepts true/yes/on) — global;
#   - contract field ``virtualTime: true`` — per system.
#
# When enabled:
#   - ``audit.audit_event`` stamps a ``ts`` field from this clock (each event
#     advances it one deterministic step);
#   - ``throttle.apply_latency`` records the sampled latency as a simulated
#     advance + audit event *instead of* wall-sleeping.
#
# When disabled (the default): no state is touched, no ``ts`` field appears, and
# latency injection really sleeps — behaviour is byte-for-byte unchanged.

VIRTUAL_TIME_ENV = "GE_SIMULATOR_VIRTUAL_TIME"
EPOCH_ENV = "GE_SIMULATOR_EPOCH"
DEFAULT_EPOCH = "2026-01-01T09:00:00Z"

# Key inside the per-state-key state document holding the clock record. Prefixed
# with ``_`` like the idempotency cache so it can never collide with a schema
# collection name.
CLOCK_COLLECTION = "_sim_clock"

_TRUTHY = {"1", "true", "yes", "on"}


def _env_enabled() -> bool:
    return str(os.environ.get(VIRTUAL_TIME_ENV, "")).strip().lower() in _TRUTHY


def enabled(ctx: Any = None, contract: dict[str, Any] | None = None) -> bool:
    """Whether virtual time is on for this call.

    The env var enables it globally; a contract's ``virtualTime: true`` enables it
    per system. When the caller has no contract in hand (e.g. ``audit_event``),
    the contract is resolved from the registry by ``ctx.system_id`` — defensively,
    because synthetic contracts in unit tests are not registered.
    """
    if _env_enabled():
        return True
    if contract is not None:
        return bool(contract.get("virtualTime"))
    if ctx is None:
        return False
    try:
        from simulator_runtime.registry import get_simulator_contract

        return bool(get_simulator_contract(ctx.system_id).get("virtualTime"))
    except Exception:  # noqa: BLE001 - unknown/unregistered system ⇒ not opted in
        return False


def epoch() -> datetime:
    """The virtual clock's start time (env ``GE_SIMULATOR_EPOCH``, ISO-8601).

    Fails loud on an unparseable value — a silently-wrong epoch would corrupt every
    virtual timestamp in a run.
    """
    raw = str(os.environ.get(EPOCH_ENV) or DEFAULT_EPOCH).strip()
    try:
        parsed = datetime.fromisoformat(raw.replace("Z", "+00:00"))
    except ValueError as exc:
        raise ValueError(f"{EPOCH_ENV}={raw!r} is not an ISO-8601 date/timestamp") from exc
    if parsed.tzinfo is None:
        parsed = parsed.replace(tzinfo=timezone.utc)
    return parsed


def _iso(moment: datetime) -> str:
    """Fixed-width ISO-8601 UTC rendering (millisecond precision, ``Z`` suffix)."""
    return moment.astimezone(timezone.utc).isoformat(timespec="milliseconds").replace("+00:00", "Z")


def _digest_int(*parts: Any) -> int:
    """Deterministic 64-bit integer from a seed tuple (BLAKE2b, never ``hash()``)."""
    joined = "\x1f".join("" if p is None else str(p) for p in parts)
    return int.from_bytes(hashlib.blake2b(joined.encode("utf-8"), digest_size=8).digest(), "big")


def _step_seconds(state_key: str, call_index: int) -> int:
    """The deterministic advance (13–97 s) for the ``call_index``-th step of a key."""
    return 13 + _digest_int(state_key, call_index, "step") % 85


def _load(ctx) -> tuple[dict[str, Any], dict[str, Any], str]:
    """Return ``(state_doc, clock_record, state_key)`` for ``ctx``, creating the record.

    Rides inside the same per-``agent:system:scenario`` state document (and
    ``StateStore``) that ``generic.py`` already maintains — only ever written when
    virtual time is enabled, so default-mode state docs are unchanged.
    """
    from simulator_runtime import generic

    state = generic.generic_state(ctx)
    record = state.setdefault(CLOCK_COLLECTION, {"seconds": 0.0, "calls": 0})
    return state, record, generic._state_key(ctx)


def now_iso(ctx, contract: dict[str, Any] | None = None) -> str:
    """Current time as ISO-8601 UTC.

    Virtual time on ⇒ epoch + the key's accumulated offset (no advance, but the
    clock record is materialized in state on first read). Off (default) ⇒ wall
    clock, with zero state access.
    """
    if not enabled(ctx, contract):
        return _iso(datetime.now(timezone.utc))
    _, record, _ = _load(ctx)
    return _iso(epoch() + timedelta(seconds=float(record.get("seconds", 0.0))))


def advance(ctx, seconds: float | None = None) -> str:
    """Advance the virtual clock one step and return the new time (ISO-8601).

    ``seconds=None`` uses the deterministic per-call step (13–97 s derived from
    ``(state_key, call_index)``); an explicit ``seconds`` is used verbatim (e.g.
    simulated latency). Callers must only invoke this when :func:`enabled` is true.
    """
    from simulator_runtime import generic

    state, record, state_key = _load(ctx)
    call_index = int(record.get("calls", 0))
    step = _step_seconds(state_key, call_index) if seconds is None else max(0.0, float(seconds))
    record["calls"] = call_index + 1
    record["seconds"] = float(record.get("seconds", 0.0)) + step
    generic._save_state(ctx, state)
    return _iso(epoch() + timedelta(seconds=record["seconds"]))


def latency_rng(ctx) -> random.Random:
    """A deterministically-seeded RNG for latency sampling under virtual time.

    Seeded from ``(state_key, call_index, "latency")`` so uniform/normal latency
    distributions reproduce exactly across processes (the default unseeded
    ``random.Random()`` used in wall-clock mode would not).
    """
    _, record, state_key = _load(ctx)
    return random.Random(_digest_int(state_key, int(record.get("calls", 0)), "latency"))


def record_virtual_latency(ctx, latency: dict[str, Any], *, tool: str = "") -> float:
    """Simulate a latency injection: advance the clock and audit it — never sleep.

    Returns the sampled latency in seconds (mirroring ``throttle.apply_latency``).
    The audit event carries the simulated amount in its ``detail`` so the injected
    latency is observable in the trail/envelope even though no wall time elapsed.
    """
    from simulator_runtime import generic
    from simulator_runtime.audit import audit_event
    from simulator_runtime.throttle import _resolve_latency_seconds

    seconds = _resolve_latency_seconds(latency, latency_rng(ctx))
    advance(ctx, seconds=seconds)
    state = generic.generic_state(ctx)
    event = audit_event(
        ctx=ctx,
        action=tool or "latency",
        entity="",
        entity_id="*",
        outcome="latency_injected",
        detail=f"virtual_latency_ms={round(seconds * 1000)}",
    )
    state.setdefault("audit_events", []).append(event)
    generic._save_state(ctx, state)
    return seconds
