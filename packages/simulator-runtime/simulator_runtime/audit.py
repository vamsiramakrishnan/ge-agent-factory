from __future__ import annotations

from typing import Any


def audit_event(*, ctx, action: str, entity: str, entity_id: str, outcome: str, detail: str | None = None) -> dict[str, Any]:
    return {
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

