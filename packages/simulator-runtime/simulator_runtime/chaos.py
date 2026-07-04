from __future__ import annotations

import hashlib
import logging
import os
from dataclasses import dataclass, field
from typing import Any

logger = logging.getLogger(__name__)


# Named chaos profiles — opt-in, deterministic, and default-off.
#
# A profile composes with the existing failure/throttle machinery instead of
# duplicating it: ``failures.maybe_inject_failure`` asks :func:`resolve_chaos` for
# extra weights and runs them through the same deterministic ``select_failure``
# draw (keyed by ``(agent, system, scenario, profile, call_index, tool)`` so the
# same call sequence reproduces the same outcomes across processes), and
# ``generic.py`` scales its per-tool latency config via :func:`effective_latency`.
# Chaos-injected failures carry ``detail="chaos:<profile>"`` in their audit event,
# distinguishing them from contract-declared ``failureModes`` injections
# (``detail="injected_failure_mode"``).
#
# Activation (contract wins over env; absent ⇒ complete no-op):
#   - contract field ``chaosProfile: "<name>"`` — per system;
#   - env ``GE_SIMULATOR_CHAOS_PROFILE=<name>`` — global.

CHAOS_PROFILE_ENV = "GE_SIMULATOR_CHAOS_PROFILE"


# Profile spec fields (all optional):
#   weights           extra failure-mode weights merged into the injection draw
#   latencyMultiplier scales the ms parameters of a tool's declared latency config
#   baseLatency       latency config used when the tool declares none
#   writesOnly        restrict injection to write-ish tools (reads stay clean)
#   burst             {"period": P, "width": W} — inject only inside a W-call
#                     window whose phase within each P-call period is drawn
#                     deterministically from (agent, system, scenario, profile)
CHAOS_PROFILES: dict[str, dict[str, Any]] = {
    # Nothing injected — a named baseline so runs can be labeled explicitly.
    "steady": {},
    # Everything is slow and some calls time out.
    "brownout": {
        "weights": {"timeout": 0.08},
        "latencyMultiplier": 3.0,
        "baseLatency": {"distribution": "fixed", "ms": 400},
    },
    # Thundering herd: heavy rate limiting plus latency spikes.
    "storm": {
        "weights": {"rate_limited": 0.15, "timeout": 0.05},
        "latencyMultiplier": 5.0,
        "baseLatency": {"distribution": "fixed", "ms": 250},
    },
    # A dependency that fails in bursts: ~0.4 in-window over a quarter-duty
    # window ⇒ ~0.1 average, but concentrated (consecutive calls fail together).
    "flaky_dependency": {
        "weights": {"timeout": 0.24, "conflict": 0.16},
        "burst": {"period": 24, "width": 6},
    },
    # Writes degrade (conflicts / validation errors); reads stay clean.
    "degraded_writes": {
        "weights": {"conflict": 0.07, "validation_error": 0.05},
        "writesOnly": True,
    },
}

# Tool-name prefixes treated as read-ish for ``writesOnly`` profiles. Everything
# else (create_/submit_/update_/… and unrecognized names) counts as a write.
_READ_PREFIXES = (
    "search_",
    "get_",
    "list_",
    "find_",
    "fetch_",
    "read_",
    "describe_",
    "query_",
    "lookup_",
    "check_",
    "poll_",
)

# Unknown profile names already warned about, so a typo is loud exactly once per
# process instead of spamming every call (and never silently ignored).
_WARNED_UNKNOWN: set[str] = set()


@dataclass(frozen=True)
class ChaosDecision:
    """What chaos adds to one tool call: nothing, by default."""

    profile: str | None = None
    weights: dict[str, float] = field(default_factory=dict)
    latency_multiplier: float = 1.0
    call_index: int = 0


_NO_CHAOS = ChaosDecision()


def active_profile(contract: dict[str, Any] | None) -> str | None:
    """Resolve the active profile name: contract ``chaosProfile`` wins over env.

    Returns ``None`` when neither is set or the name is unknown (unknown names are
    logged once and treated as no-op so a typo cannot inject surprise failures).
    """
    name = ""
    if contract is not None and contract.get("chaosProfile") is not None:
        name = str(contract.get("chaosProfile")).strip()
    else:
        name = str(os.environ.get(CHAOS_PROFILE_ENV, "")).strip()
    if not name:
        return None
    if name not in CHAOS_PROFILES:
        if name not in _WARNED_UNKNOWN:
            _WARNED_UNKNOWN.add(name)
            logger.warning("unknown chaos profile %r — ignoring (known: %s)", name, sorted(CHAOS_PROFILES))
        return None
    return name


def is_write_tool(tool: str) -> bool:
    """Name-prefix heuristic: read-ish prefixes are reads, everything else writes."""
    return not str(tool).startswith(_READ_PREFIXES)


def _digest_int(*parts: Any) -> int:
    """Deterministic 64-bit integer from a seed tuple (BLAKE2b, never ``hash()``)."""
    joined = "\x1f".join("" if p is None else str(p) for p in parts)
    return int.from_bytes(hashlib.blake2b(joined.encode("utf-8"), digest_size=8).digest(), "big")


def burst_phase(ctx, profile: str, period: int) -> int:
    """The deterministic window start (mod ``period``) for this state key + profile."""
    return _digest_int(
        getattr(ctx, "agent_id", None),
        getattr(ctx, "system_id", None),
        getattr(ctx, "scenario_id", None),
        profile,
        "burst",
    ) % max(1, period)


def _default_call_index(ctx) -> int:
    """Per-state call counter: the audit-trail length of the existing state doc.

    Every handler appends at least one audit event per call, so the trail length is
    a monotonically-increasing, state-persisted call index — no second counter or
    keying scheme needed. Only consulted when a profile is active.
    """
    from simulator_runtime import generic

    state = generic.generic_state(ctx)
    return len(state.get("audit_events") or [])


def resolve_chaos(
    *,
    contract: dict[str, Any] | None = None,
    workflow: dict[str, Any] | None = None,
    tool: str = "",
    ctx: Any = None,
    call_index: int | None = None,
) -> ChaosDecision:
    """Resolve the chaos contribution for one tool call.

    No active profile (the default for every system today) returns the shared
    no-op decision with zero state access, so behaviour is unchanged. ``workflow``
    is accepted for symmetry with ``maybe_inject_failure`` (profiles are currently
    system-scoped, not per-handler).
    """
    profile = active_profile(contract)
    if profile is None:
        return _NO_CHAOS
    spec = CHAOS_PROFILES[profile]
    if call_index is None:
        call_index = _default_call_index(ctx) if ctx is not None else 0
    weights = dict(spec.get("weights") or {})
    multiplier = float(spec.get("latencyMultiplier") or 1.0)
    if weights and spec.get("writesOnly") and not is_write_tool(tool):
        weights = {}
    burst = spec.get("burst")
    if weights and isinstance(burst, dict):
        period = max(1, int(burst.get("period") or 1))
        width = max(0, int(burst.get("width") or 0))
        phase = burst_phase(ctx, profile, period)
        if (call_index - phase) % period >= width:
            weights = {}
    return ChaosDecision(profile=profile, weights=weights, latency_multiplier=multiplier, call_index=call_index)


_LATENCY_MS_FIELDS = ("ms", "mean_ms", "min_ms", "max_ms", "stddev_ms")


def effective_latency(
    latency: dict[str, Any] | None,
    *,
    contract: dict[str, Any] | None = None,
) -> dict[str, Any] | None:
    """The latency config a tool call should actually use under chaos.

    No active profile ⇒ ``latency`` is returned untouched (identical object, so the
    default path is byte-for-byte unchanged). With a profile: a declared config has
    its ms parameters scaled by the profile's ``latencyMultiplier``; a tool with no
    config inherits the profile's ``baseLatency`` (if any).
    """
    profile = active_profile(contract)
    if profile is None:
        return latency
    spec = CHAOS_PROFILES[profile]
    if not latency:
        base = spec.get("baseLatency")
        return dict(base) if isinstance(base, dict) else latency
    multiplier = float(spec.get("latencyMultiplier") or 1.0)
    if multiplier == 1.0:
        return latency
    scaled = dict(latency)
    for fld in _LATENCY_MS_FIELDS:
        if fld in scaled:
            try:
                scaled[fld] = float(scaled[fld]) * multiplier
            except (TypeError, ValueError):
                continue  # non-numeric param: leave for _resolve_latency_seconds to ignore
    return scaled
