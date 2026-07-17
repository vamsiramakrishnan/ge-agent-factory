from __future__ import annotations

from typing import Any

from simulator_runtime.context import build_context
from simulator_runtime.live_dispatch import (
    LiveDispatchConfigurationError,
    forward_read,
    forwardable_binding,
    live_target,
)
from simulator_runtime.registry import get_simulator_contract, list_simulator_contracts
from simulator_runtime.replay import record_call, replay_lookup
from simulator_runtime.simulators import SimulatorError, get_simulator_handlers


def _catalog_tool(contract: dict[str, Any], tool_name: str) -> dict[str, Any] | None:
    for entry in contract.get("toolCatalog", {}).get("tools", []):
        if entry.get("name") == tool_name:
            return entry
    return None


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


def _twin_envelope(
    handlers: dict[str, Any],
    contract: dict[str, Any],
    ctx: Any,
    system_id: str,
    tool_name: str,
    args: dict[str, Any],
) -> dict[str, Any]:
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


def _live_configuration_error(
    contract: dict[str, Any],
    system_id: str,
    tool_name: str,
    scenario_id: str,
    exc: LiveDispatchConfigurationError,
) -> dict[str, Any]:
    return {
        "source_system": contract["displayName"],
        "system_id": system_id,
        "simulator": False,
        "live": True,
        "tool": tool_name,
        "scenario_id": scenario_id,
        "status": "error",
        "error": {"code": exc.code, "message": str(exc)},
    }


def _live_can_fallback(envelope: dict[str, Any]) -> bool:
    code = str((envelope.get("error") or {}).get("code") or "")
    if code == "live_unreachable":
        return True
    if code.startswith("live_http_"):
        try:
            status = int(code.rsplit("_", 1)[1])
            return status in {408, 425, 429} or 500 <= status < 600
        except ValueError:
            return False
    return False


def _fallback_metadata(source: dict[str, Any], from_side: str, to_side: str) -> dict[str, str]:
    return {
        "from": from_side,
        "to": to_side,
        "reason": str((source.get("error") or {}).get("code") or "unknown_error"),
    }


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
    # Only explicit READ bindings are eligible. This check happens before the
    # live directive is loaded so write-class tools remain structurally pinned
    # to the twin even when a live directive is malformed or unapproved.
    live_binding = forwardable_binding(_catalog_tool(contract, tool_name))
    target = None
    if live_binding is not None:
        try:
            target = live_target(system_id)
        except LiveDispatchConfigurationError as exc:
            # Fail closed: a configured-but-unsafe live route is an explicit
            # error, never a plausible synthetic result from a silent twin.
            return _live_configuration_error(contract, system_id, tool_name, ctx.scenario_id, exc)

    if target is not None and target["mode"] == "live_first":
        live_envelope = forward_read(target, contract, system_id, tool_name, live_binding, args, ctx.scenario_id)
        if live_envelope["status"] == "ok" or not _live_can_fallback(live_envelope):
            # Raw live success/error payloads are deliberately not persisted to
            # cassettes. A redaction seam must be introduced before recording
            # live envelopes can be enabled safely.
            return live_envelope
        envelope = _twin_envelope(handlers, contract, ctx, system_id, tool_name, args)
        envelope["fallback"] = _fallback_metadata(live_envelope, "live", "twin")
        record_call(agent_id, system_id, ctx.scenario_id, tool_name, args, envelope)
        return envelope

    if target is not None and target["mode"] == "twin_first":
        twin_envelope = _twin_envelope(handlers, contract, ctx, system_id, tool_name, args)
        # twin_first is intentionally twin-only during normal tool execution.
        # The directive carries the live side for an explicit comparison flow;
        # a twin policy/validation/approval error must never trigger a live read.
        record_call(agent_id, system_id, ctx.scenario_id, tool_name, args, twin_envelope)
        return twin_envelope

    envelope = _twin_envelope(handlers, contract, ctx, system_id, tool_name, args)
    # Cassette recording (opt-in via GE_SIMULATOR_RECORD_DIR): both ok and error
    # envelopes are captured. Env unset (the default) ⇒ no-op, no file IO.
    record_call(agent_id, system_id, ctx.scenario_id, tool_name, args, envelope)
    return envelope
