from __future__ import annotations

from typing import Any

from simulator_runtime.context import build_context
from simulator_runtime.registry import get_simulator_contract, list_simulator_contracts
from simulator_runtime.simulators import SimulatorError, get_simulator_handlers


def _binding(tool: dict[str, Any]) -> dict[str, Any] | None:
    simulator = tool.get("simulator")
    if simulator:
        return simulator
    binding = tool.get("binding") or {}
    if binding.get("simulator"):
        return binding["simulator"]
    if binding.get("systemId") and binding.get("tool"):
        return {"system_id": binding["systemId"], "tool": binding["tool"]}
    return None


def is_simulator_tool(tool: dict[str, Any]) -> bool:
    return _binding(tool) is not None


def list_simulators() -> dict[str, Any]:
    return {"simulators": list_simulator_contracts()}


def execute_simulator_tool(agent_id: str, tool: dict[str, Any], args: dict[str, Any] | None = None) -> dict[str, Any]:
    args = args or {}
    binding = _binding(tool)
    if not binding:
        raise KeyError(f"tool {tool.get('name')} has no simulator binding")
    system_id = binding["system_id"]
    tool_name = binding.get("tool") or tool["name"]
    contract = get_simulator_contract(system_id)
    ctx = build_context(agent_id, system_id, args)
    handlers = get_simulator_handlers(system_id, tenant=agent_id)
    if not handlers or tool_name not in handlers:
        raise KeyError(f"simulator {system_id} does not define tool {tool_name}")
    try:
        result = handlers[tool_name](ctx, args)
        return {
            "source_system": contract["displayName"],
            "system_id": system_id,
            "simulator": True,
            "tool": tool_name,
            "scenario_id": ctx.scenario_id,
            "status": "ok",
            "data": result,
        }
    except SimulatorError as exc:
        return {
            "source_system": contract["displayName"],
            "system_id": system_id,
            "simulator": True,
            "tool": tool_name,
            "scenario_id": ctx.scenario_id,
            "status": "error",
            "error": {"code": exc.code, "message": str(exc)},
            "audit_event": exc.audit,
        }

