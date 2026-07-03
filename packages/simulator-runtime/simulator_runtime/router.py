from __future__ import annotations

from typing import Any

from simulator_runtime.context import build_context
from simulator_runtime.registry import get_simulator_contract, list_simulator_contracts
from simulator_runtime.replay import record_call, replay_lookup
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
    # Cassette replay (opt-in via GE_SIMULATOR_REPLAY_DIR, see replay.py): a
    # recorded envelope for this call is returned instead of the live result;
    # a miss falls through to live execution. Env unset (the default) ⇒ None
    # with no file IO. On a hit the handler STILL runs so simulator state
    # (rows, approvals, audit trail, clocks) advances exactly as it did while
    # recording — otherwise a later cassette miss would execute against the
    # untouched seed instead of the state the replayed calls implied. The live
    # result is discarded; the cassette is authoritative for the response.
    replayed = replay_lookup(agent_id, system_id, ctx.scenario_id, tool_name, args)
    if replayed is not None:
        try:
            handlers[tool_name](ctx, args)
        except SimulatorError:
            # Expected when the recorded envelope was itself an error (or a
            # deterministic injected failure re-fires): the state semantics of
            # an errored call are "no mutation", which re-raising would not
            # change, and the recorded envelope already carries the error.
            pass
        return replayed
    try:
        result = handlers[tool_name](ctx, args)
        envelope = {
            "source_system": contract["displayName"],
            "system_id": system_id,
            "simulator": True,
            "tool": tool_name,
            "scenario_id": ctx.scenario_id,
            "status": "ok",
            "data": result,
        }
    except SimulatorError as exc:
        envelope = {
            "source_system": contract["displayName"],
            "system_id": system_id,
            "simulator": True,
            "tool": tool_name,
            "scenario_id": ctx.scenario_id,
            "status": "error",
            "error": {"code": exc.code, "message": str(exc)},
            "audit_event": exc.audit,
        }
    # Cassette recording (opt-in via GE_SIMULATOR_RECORD_DIR): both ok and error
    # envelopes are captured. Env unset (the default) ⇒ no-op, no file IO.
    record_call(agent_id, system_id, ctx.scenario_id, tool_name, args, envelope)
    return envelope
