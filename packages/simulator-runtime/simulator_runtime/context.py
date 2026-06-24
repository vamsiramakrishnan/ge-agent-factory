from __future__ import annotations

from dataclasses import dataclass
from typing import Any


@dataclass(frozen=True)
class SimulatorContext:
    agent_id: str
    system_id: str
    actor: str
    role: str
    scenario_id: str


def build_context(agent_id: str, system_id: str, args: dict[str, Any] | None = None) -> SimulatorContext:
    args = args or {}
    return SimulatorContext(
        agent_id=agent_id,
        system_id=system_id,
        actor=str(args.get("actor") or "demo.operator@example.com"),
        role=str(args.get("role") or "hr_partner"),
        scenario_id=str(args.get("scenario_id") or "default"),
    )

