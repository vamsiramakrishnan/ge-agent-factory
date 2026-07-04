from __future__ import annotations

import hashlib
from typing import Any

from simulator_runtime.audit import audit_event


# ---------------------------------------------------------------------------
# Typed error hierarchy
# ---------------------------------------------------------------------------
#
# All simulator failures must surface through ``SimulatorError`` so the router
# envelope (router.execute_simulator_tool) keeps mapping them to
# ``{status:"error", error:{code,message}, audit_event}`` unchanged. The typed
# subclasses below carry the realistic failure-mode ``code`` plus the HTTP-ish
# ``status`` a real SaaS API would return, while remaining ``SimulatorError``
# instances. ``SimulatorError`` itself lives in ``simulators.py`` (imported
# lazily to avoid the generic<->simulators import cycle).


# ``SimulatorError`` lives in ``simulators.py``, which imports ``generic.py`` at
# module top — so ``generic`` must import *this* module lazily (inside handlers),
# exactly like it already imports ``SimulatorError``. By the time any handler runs
# the cycle is fully resolved, so importing the base class at this module's top is
# safe: ``failures`` is never imported until a handler executes.
from simulator_runtime.simulators import SimulatorError


class TypedSimulatorError(SimulatorError):
    """A ``SimulatorError`` that also carries an HTTP-ish status code.

    ``code`` is the realistic failure-mode name (e.g. ``rate_limited``) used by
    the router envelope and the audit trail; ``status`` is the HTTP status a real
    API would return for that mode. Subclasses pin both.
    """

    code: str = "error"
    status: int = 500

    def __init__(self, message: str | None = None, *, audit: dict[str, Any] | None = None):
        super().__init__(self.code, message or self.code, audit=audit)
        self.status = type(self).status


class RateLimited(TypedSimulatorError):
    code = "rate_limited"
    status = 429


class ValidationError(TypedSimulatorError):
    code = "validation_error"
    status = 422


class Conflict(TypedSimulatorError):
    code = "conflict"
    status = 409


class Unauthorized(TypedSimulatorError):
    code = "unauthorized"
    status = 401


class Forbidden(TypedSimulatorError):
    code = "forbidden"
    status = 403


class Timeout(TypedSimulatorError):
    code = "timeout"
    status = 504


# Registry of the failure modes this module can *realize* (raise on demand),
# keyed by the contract's declared mode name. Modes the engine already realizes
# inline (permission_denied, not_found, missing_approval, invalid_state_transition)
# are intentionally absent — they remain the handler's job and are never injected
# by the selector. Several common contract aliases map onto the same typed error.
FAILURE_CLASSES: dict[str, type[TypedSimulatorError]] = {
    "rate_limited": RateLimited,
    "rate_limit": RateLimited,
    "429": RateLimited,
    "validation_error": ValidationError,
    "422": ValidationError,
    "conflict": Conflict,
    "409": Conflict,
    "stale_read": Conflict,
    "effective_date_conflict": Conflict,
    "duplicate_card_charge": Conflict,
    "unauthorized": Unauthorized,
    "401": Unauthorized,
    "forbidden": Forbidden,
    "403": Forbidden,
    "security_domain_denied": Forbidden,
    "timeout": Timeout,
    "504": Timeout,
    "network_delivery_failed": Timeout,
}


def is_realizable(mode: str) -> bool:
    """Whether ``mode`` is one this module can inject (vs realized inline)."""
    return mode in FAILURE_CLASSES


# ---------------------------------------------------------------------------
# Weight extraction (backward-compatible)
# ---------------------------------------------------------------------------


def _normalize_weights(raw: Any) -> dict[str, float]:
    """Coerce a contract ``failureModes`` declaration into a weight map.

    Accepted shapes (all backward-compatible — an absent/empty declaration
    yields ``{}`` ⇒ no injection):

    - ``{"rate_limited": 0.1, "conflict": 0.05}``         (explicit weights)
    - ``[{"mode": "rate_limited", "weight": 0.1}, ...]``  (list of objects)
    - ``[{"rate_limited": 0.1}, ...]``                    (list of single-key dicts)

    Plain ``list[str]`` (the registry's declared-modes shape) is *not* treated as
    weights here — it carries no probabilities, so injecting from it would change
    behaviour for every system. The caller passes such lists as the ``catalog``
    allow-list instead.
    """
    weights: dict[str, float] = {}
    if isinstance(raw, dict):
        items = raw.items()
        for mode, weight in items:
            try:
                value = float(weight)
            except (TypeError, ValueError):
                continue
            if value > 0:
                weights[str(mode)] = value
    elif isinstance(raw, list):
        for entry in raw:
            if not isinstance(entry, dict):
                continue
            if "mode" in entry:
                mode = entry.get("mode")
                weight = entry.get("weight", entry.get("probability"))
            elif len(entry) == 1:
                mode, weight = next(iter(entry.items()))
            else:
                continue
            try:
                value = float(weight)
            except (TypeError, ValueError):
                continue
            if mode is not None and value > 0:
                weights[str(mode)] = value
    return weights


def resolve_weights(
    *,
    workflow: dict[str, Any] | None = None,
    contract: dict[str, Any] | None = None,
) -> dict[str, float]:
    """Resolve injection weights for a tool call.

    Per-handler weights (``workflow["failureModes"]``) take precedence over a
    system-level weighted declaration (``contract["failureModes"]`` when it is a
    weight map / list-of-objects). A plain ``list[str]`` system declaration is
    ignored here (no probabilities) — it only constrains *which* modes a handler
    may declare. Weights for modes this engine cannot realize are dropped.
    """
    raw = None
    if workflow is not None and workflow.get("failureModes") is not None:
        raw = workflow.get("failureModes")
    elif contract is not None:
        candidate = contract.get("failureModes")
        if isinstance(candidate, dict) or (
            isinstance(candidate, list) and any(isinstance(x, dict) for x in candidate)
        ):
            raw = candidate
    weights = _normalize_weights(raw)
    return {mode: weight for mode, weight in weights.items() if is_realizable(mode)}


# ---------------------------------------------------------------------------
# Deterministic selection
# ---------------------------------------------------------------------------


def _unit_interval(*parts: Any) -> float:
    """Map a seed tuple deterministically into ``[0.0, 1.0)``.

    Uses BLAKE2b over the joined parts so the same ``(agent, system, scenario,
    seed, tool)`` always yields the same draw across processes and Python runs
    (``hash()`` is salted per-process and must not be used).
    """
    joined = "\x1f".join("" if p is None else str(p) for p in parts)
    digest = hashlib.blake2b(joined.encode("utf-8"), digest_size=8).digest()
    return int.from_bytes(digest, "big") / float(1 << 64)


def select_failure(
    weights: dict[str, float],
    *,
    agent: Any,
    system: Any,
    scenario: Any,
    seed: Any = 0,
    tool: Any = "",
) -> str | None:
    """Deterministically pick a failure mode (or ``None``) for this call.

    The draw is reproducible per ``(agent, system, scenario, seed, tool)``. With
    no weights (the default for every system today) this always returns ``None``,
    so behaviour is unchanged. Weights are interpreted as probabilities; if they
    sum to >= 1 the highest-cumulative mode acts as the fallback bucket.
    """
    if not weights:
        return None
    draw = _unit_interval(agent, system, scenario, seed, tool)
    cumulative = 0.0
    for mode in sorted(weights):  # sort ⇒ stable order independent of dict order
        cumulative += max(0.0, weights[mode])
        if draw < cumulative:
            return mode
    return None


def raise_failure(
    mode: str,
    *,
    ctx,
    tool: str,
    entity: str = "",
    entity_id: str = "*",
    detail: str = "injected_failure_mode",
) -> None:
    """Raise the typed error for ``mode`` with an audit event attached.

    The audit event mirrors the inline failures in ``generic.py`` (outcome = the
    failure code) so the trail and router envelope are consistent. Unknown modes
    raise a generic ``TypedSimulatorError``. ``detail`` distinguishes the source
    of the injection (contract ``failureModes`` vs a chaos profile).
    """
    cls = FAILURE_CLASSES.get(mode, TypedSimulatorError)
    event = audit_event(
        ctx=ctx,
        action=tool,
        entity=entity,
        entity_id=str(entity_id),
        outcome=cls.code,
        detail=detail,
    )
    raise cls(f"{tool} failed: {cls.code}", audit=event)


def maybe_inject_failure(
    *,
    ctx,
    tool: str,
    workflow: dict[str, Any] | None = None,
    contract: dict[str, Any] | None = None,
    entity: str = "",
    entity_id: str = "*",
    seed: Any = 0,
    call_index: int | None = None,
) -> None:
    """Top-of-handler hook: deterministically raise an injected failure or no-op.

    Backward-compatible: if neither the workflow nor the contract declares
    *weighted* ``failureModes``, this resolves to ``{}`` and returns immediately,
    leaving the handler's existing behaviour untouched.

    A chaos profile (opt-in, see ``chaos.py``) contributes a *second*, independent
    deterministic draw keyed by ``(agent, system, scenario, profile, call_index,
    tool)`` — it never perturbs the base draw above, so enabling chaos cannot
    change which contract-declared failures fire. Chaos injections are audited
    with ``detail="chaos:<profile>"``.
    """
    weights = resolve_weights(workflow=workflow, contract=contract)
    if weights:
        mode = select_failure(
            weights,
            agent=getattr(ctx, "agent_id", None),
            system=getattr(ctx, "system_id", None),
            scenario=getattr(ctx, "scenario_id", None),
            seed=seed,
            tool=tool,
        )
        if mode is not None:
            raise_failure(mode, ctx=ctx, tool=tool, entity=entity, entity_id=entity_id)

    from simulator_runtime.chaos import resolve_chaos

    decision = resolve_chaos(contract=contract, workflow=workflow, tool=tool, ctx=ctx, call_index=call_index)
    if not decision.weights:
        return
    mode = select_failure(
        decision.weights,
        agent=getattr(ctx, "agent_id", None),
        system=getattr(ctx, "system_id", None),
        scenario=getattr(ctx, "scenario_id", None),
        seed=f"chaos:{decision.profile}:{decision.call_index}",
        tool=tool,
    )
    if mode is None:
        return
    raise_failure(
        mode,
        ctx=ctx,
        tool=tool,
        entity=entity,
        entity_id=entity_id,
        detail=f"chaos:{decision.profile}",
    )
