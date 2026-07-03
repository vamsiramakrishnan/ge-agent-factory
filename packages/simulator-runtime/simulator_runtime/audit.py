from __future__ import annotations

from typing import Any


def audit_event(*, ctx, action: str, entity: str, entity_id: str, outcome: str, detail: str | None = None) -> dict[str, Any]:
    event = {
        "system_id": ctx.system_id,
        "agent_id": ctx.agent_id,
        "scenario_id": ctx.scenario_id,
        "actor": ctx.actor,
        "role": ctx.role,
        "action": action,
        "entity": entity,
        "entity_id": entity_id,
        "outcome": outcome,
        "detail": detail,
    }
    # Virtual time (opt-in, see clock.py): stamp a deterministic `ts` from the
    # simulation clock, advancing it one step per event. Disabled (the default)
    # ⇒ no `ts` field ⇒ events are byte-for-byte what they always were. Imported
    # lazily: audit is imported by generic, which clock reads state through.
    from simulator_runtime import clock

    if clock.enabled(ctx):
        event["ts"] = clock.advance(ctx)
    return event

