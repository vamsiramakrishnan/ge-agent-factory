#!/usr/bin/env python3
import argparse
import asyncio
import json
import os
import sys
import time
import uuid

os.environ.setdefault("PROTOCOL_BUFFERS_PYTHON_IMPLEMENTATION", "python")

TRUTHY = {"1", "true", "yes", "on"}


def first_env(*names: str) -> str | None:
    for name in names:
        value = os.environ.get(name)
        if value:
            return value
    return None


def emit_status(kind: str, **payload) -> None:
    print(json.dumps({"type": f"antigravity.{kind}", **payload}, sort_keys=True), file=sys.stderr, flush=True)


def preview_text(text: str, limit: int = 240) -> str:
    compact = " ".join(text.split())
    if len(compact) <= limit:
        return compact
    return compact[: limit - 1] + "…"


def preview_json(value, limit: int = 1200) -> dict:
    dumped = dump_model(value)
    try:
        text = json.dumps(dumped, sort_keys=True, default=str)
    except TypeError:
        text = str(dumped)
    return {
        "preview": preview_text(text, limit),
        **({"value": dumped} if len(text) <= limit else {}),
    }


async def heartbeat(phase_ref: dict[str, str], started_at: float, interval_sec: float = 8.0) -> None:
    try:
        while True:
            await asyncio.sleep(interval_sec)
            emit_status("heartbeat", phase=phase_ref.get("phase", "working"), elapsedSec=round(time.monotonic() - started_at, 1))
    except asyncio.CancelledError:
        return


def dump_model(value):
    if hasattr(value, "model_dump"):
        return value.model_dump(mode="json")
    return value


def interaction_form_from_spec(interaction_id: str, data) -> dict:
    spec = dump_model(data) or {}
    questions = []
    for index, question in enumerate(spec.get("questions") or []):
        options = [
            {"id": str(option.get("id") or f"option-{i + 1}"), "label": str(option.get("text") or option.get("id") or f"Option {i + 1}")}
            for i, option in enumerate(question.get("options") or [])
        ]
        multi = bool(question.get("is_multi_select"))
        questions.append({
            "id": f"q{index + 1}",
            "label": str(question.get("question") or f"Question {index + 1}"),
            "type": "checkbox" if multi else "radio" if options else "textarea",
            "required": False,
            "options": options,
            **({"maxSelections": len(options)} if multi and options else {}),
        })
    return {
        "schemaVersion": 1,
        "id": interaction_id,
        "title": "Antigravity needs input",
        "description": "Answer these questions so the harness can continue the run.",
        "submitLabel": "Continue",
        "questions": questions,
    }


async def wait_for_interaction_response(interaction_dir: str, interaction_id: str, timeout_sec: int = 3600) -> dict:
    response_path = os.path.join(interaction_dir, "responses", f"{interaction_id}.json")
    deadline = time.monotonic() + timeout_sec
    while time.monotonic() < deadline:
        if os.path.exists(response_path):
            with open(response_path, "r", encoding="utf-8") as f:
                return json.load(f)
        await asyncio.sleep(0.5)
    raise TimeoutError(f"timed out waiting for interaction response: {interaction_id}")


def question_result_from_response(types_module, response: dict):
    selected = response.get("selectedOptionIds")
    if selected is None:
        selected = response.get("selected_option_ids")
    freeform = response.get("freeformResponse")
    if freeform is None:
        freeform = response.get("freeform_response") or ""
    return types_module.QuestionResponse(
        selected_option_ids=selected if selected else None,
        freeform_response=str(freeform or ""),
        skipped=bool(response.get("skipped")),
    )


# ── Custom factory tools (read-only, in-process) ────────────────────────────
# Plain callables the SDK exposes to the agent (docstring → tool schema). These
# let the agent ACT — discover the catalog + the simulated systems it can call —
# instead of only reasoning from the prompt. Read-only + dependency-free.
def _repo_path(*parts):
    return os.path.normpath(os.path.join(os.path.dirname(__file__), "..", *parts))


def list_use_case_catalog(limit: int = 20) -> str:
    """List registered GE use-case ids and titles from the generated catalog."""
    try:
        with open(_repo_path("generated", "use-cases.generated.json"), encoding="utf-8") as f:
            data = json.load(f)
        cases = data if isinstance(data, list) else (data.get("useCases") or data.get("specs") or [])
        rows = [f"{c.get('id')}: {c.get('title') or c.get('name') or ''}" for c in cases[: int(limit)]]
        return f"{len(cases)} use cases. First {len(rows)}:\n" + "\n".join(rows)
    except Exception as exc:  # noqa: BLE001 - tool must never crash the agent
        return f"catalog unavailable: {exc}"


def list_simulator_systems() -> str:
    """List the simulated source systems (id + maturity) the agents can call via MCP."""
    try:
        with open(_repo_path("simulator-systems", "registry.json"), encoding="utf-8") as f:
            reg = json.load(f)
        sims = reg.get("simulators", reg) if isinstance(reg, dict) else reg
        rows = [f"{s.get('id')} ({s.get('maturity', '?')})" for s in (sims or [])]
        return f"{len(rows)} simulated systems:\n" + "\n".join(rows)
    except Exception as exc:  # noqa: BLE001
        return f"simulator registry unavailable: {exc}"


def factory_tools():
    return [list_use_case_catalog, list_simulator_systems]


def _mcp_servers_from_specs(specs, McpStdioServer, McpSseServer, McpStreamableHttpServer):
    """Parse repeatable --mcp JSON specs into typed SDK MCP server configs."""
    servers = []
    for raw in specs:
        spec = json.loads(raw)
        transport = (spec.get("transport") or ("stdio" if spec.get("command") else "sse")).lower()
        name = spec["name"]
        if transport == "stdio":
            servers.append(McpStdioServer(name=name, command=spec["command"], args=spec.get("args", [])))
        elif transport in ("http", "streamable", "streamable-http"):
            servers.append(McpStreamableHttpServer(name=name, url=spec["url"], headers=spec.get("headers")))
        else:
            servers.append(McpSseServer(name=name, url=spec["url"], headers=spec.get("headers")))
    return servers


def _make_protect_pred(name: str):
    """Predicate for a deny policy: true when any string tool-arg points at `name`.

    We scan every string value in the tool-call args rather than guessing the
    SDK's path key (it differs across edit/create/delete builtins), so the guard
    holds regardless of the exact arg schema. Returning True → the deny fires.
    """
    target = os.path.basename(name).lower()

    def _pred(call_args) -> bool:
        try:
            values = call_args.values() if isinstance(call_args, dict) else []
        except Exception:  # noqa: BLE001 - a guard must never raise
            return False
        for value in values:
            if isinstance(value, str) and os.path.basename(value).lower() == target:
                return True
        return False

    return _pred


def build_protect_policies(names, agpolicy, types):
    """Hard-deny edits/creates/deletes of the named files (e.g. tools.py).

    This enforces — at the policy layer, with the model unable to override — the
    invariant the system prompt only *asks* for ("keep app/tools.py unchanged").
    Best-effort: if the installed SDK lacks an expected builtin, we skip it; any
    failure returns [] so the run degrades to prior (prompt-only) behaviour.
    """
    policies = []
    try:
        builtins = types.BuiltinTools
        guarded = [t for t in ("EDIT_FILE", "CREATE_FILE", "DELETE_FILE", "WRITE_FILE") if hasattr(builtins, t)]
        for name in names:
            pred = _make_protect_pred(name)
            for tool in guarded:
                policies.append(agpolicy.deny(
                    getattr(builtins, tool).value,
                    when=pred,
                    name=f"protect-{tool.lower()}-{os.path.basename(name)}",
                ))
    except Exception as exc:  # noqa: BLE001
        emit_status("protect_policies_unavailable", reason=str(exc))
        return []
    return policies


def resolve_disabled_tools(names, types):
    """Map built-in tool names (e.g. "DELETE_FILE") to types.BuiltinTools members.

    disabled_tools physically removes a tool's schema from the model's context
    (the model never learns it exists) — stronger and cheaper than a deny. Unknown
    names are skipped; any failure returns [] so the run is unaffected.
    """
    resolved = []
    try:
        builtins = types.BuiltinTools
        for raw in names:
            key = str(raw).strip().upper()
            if hasattr(builtins, key):
                resolved.append(getattr(builtins, key))
            else:
                emit_status("disable_tool_unknown", name=raw)
    except Exception as exc:  # noqa: BLE001
        emit_status("disabled_tools_unavailable", reason=str(exc))
        return []
    return resolved


async def main() -> int:
    parser = argparse.ArgumentParser(description="Run a single prompt through the Google Antigravity SDK.")
    parser.add_argument("--permission-profile", default="review")
    parser.add_argument("--workspace-dir", default=os.getcwd())
    parser.add_argument("--model", default=None)
    parser.add_argument("--vertex", dest="vertex", action="store_true", default=True)
    parser.add_argument("--no-vertex", dest="vertex", action="store_false")
    parser.add_argument("--project", default=None)
    parser.add_argument("--location", default=None)
    parser.add_argument("--skills-path", action="append", default=[])
    # ── Newly-wired SDK capabilities (all default-off → behaviour unchanged) ──
    parser.add_argument("--mcp", action="append", default=[],
                        help='MCP server JSON spec (repeatable), e.g. \'{"transport":"sse","name":"hr","url":"https://…"}\'')
    parser.add_argument("--attach", action="append", default=[],
                        help="File attached as multimodal input (repeatable): pdf/image/audio/video/doc")
    parser.add_argument("--enable-factory-tools", action="store_true", default=False,
                        help="Register built-in read-only factory tools (catalog + simulator discovery)")
    parser.add_argument("--no-subagents", dest="subagents", action="store_false", default=True,
                        help="Disable subagent delegation when capabilities are enabled")
    parser.add_argument("--conversation-id", default=None, help="Resume/identify a persisted conversation")
    parser.add_argument("--save-dir", default=None, help="Persist conversation steps here (enables resume)")
    parser.add_argument("--trigger-every", type=float, default=None,
                        help="Seconds for a periodic trigger (persistent sessions only)")
    parser.add_argument("--policy", default="workspace", choices=["workspace", "none"],
                        help="Tool policy when writes are enabled: scope writes to the workspace, or none")
    parser.add_argument("--response-schema-file", default=None,
                        help="Path to a JSON file describing the response schema; constrains and validates "
                             "the agent's final structured output (SDK validates + retries on mismatch)")
    parser.add_argument("--protect-file", action="append", default=[],
                        help="Basename to hard-deny edits/creates for when write-enabled (repeatable), e.g. tools.py")
    parser.add_argument("--disable-tool", action="append", default=[],
                        help="Built-in tool name to physically remove from the model's context (repeatable), "
                             "e.g. DELETE_FILE, GENERATE_IMAGE. Hard capability removal, not just a deny.")
    parser.add_argument("--dry-run", action="store_true", default=False,
                        help="Build + validate the LocalAgentConfig and exit without running the agent")
    args = parser.parse_args()
    prompt = "" if args.dry_run else sys.stdin.read().strip()
    if not prompt and not args.dry_run:
        print("message required", file=sys.stderr)
        return 2

    try:
        from google.antigravity import Agent, LocalAgentConfig, CapabilitiesConfig
        from google.antigravity import types
        from google.antigravity.types import (
            McpStdioServer,
            McpSseServer,
            McpStreamableHttpServer,
            from_file,
        )
        from google.antigravity.hooks import hooks
        from google.antigravity.hooks import policy as agpolicy
        from google.antigravity.triggers import every as trigger_every
    except Exception as exc:
        print(
            "google-antigravity SDK is not installed or could not be imported. "
            "Install it with `pip install google-antigravity` and provide SDK auth "
            "such as GEMINI_API_KEY, or choose --provider agy for local keyring CLI fallback.",
            file=sys.stderr,
        )
        print(str(exc), file=sys.stderr)
        return 127

    system_instructions = (
        "You are running as the GE Demo Generator's programmatic Antigravity SDK harness. "
        "Follow the supplied handoff packet exactly. For review tasks, do not edit files "
        "UNLESS the handoff packet says the run is write-enabled. "
        "When reviewing a generated agent, always verify two things: (1) it declares "
        "model=\"gemini-3.5-flash\"; (2) max_output_tokens is sized to the use case — set "
        "only when the use case clearly needs a bound, otherwise left unset (model default), "
        "and never the 2048 boilerplate. "
        "ALSO validate app/agent.py against the spec's workflow (the handoff packet's "
        "'Spec workflow to validate against' section, when present): "
        "(a) the agent TOPOLOGY matches the spec — a single-stage spec must be one root "
        "Agent(...) with tools=source_adapters; a multi-stage spec must be a "
        "SequentialAgent (ordered pipeline) or ParallelAgent (independent stages) whose "
        "sub_agents count and roles match the spec's stages; "
        "(b) each sub-agent's tools (the _pick(...) names) are exactly that stage's tools "
        "and nothing leaks in from other stages; "
        "(c) the three guardrail callbacks are present and wired — initialize_workflow_state "
        "(before_agent_callback on the root or the first stage), before_tool_callback="
        "enforce_tool_contract and after_tool_callback=capture_tool_evidence on every "
        "tool-bearing agent; "
        "(d) every tool in _EXPECTED_TOOLS is reachable from at least one (sub-)agent "
        "(present in _TOOLS_BY_NAME / source_adapters and picked by some stage). "
        "ALSO validate OKF COVERAGE when the handoff packet has a 'Query/Test coverage to "
        "validate against (OKF spine)' section: (e) every Query Capability's tools are "
        "reachable in the built topology (the agent can actually answer what it claims to); "
        "(f) every Eval Scenario's mechanisms (the tools a test MUST exercise) are callable "
        "from some (sub-)agent. A missing query tool or test mechanism is a COVERAGE GAP. "
        "If the run is WRITE-ENABLED, TAKE CORRECTIVE ACTION: edit app/agent.py to fix any "
        "topology/tool/callback mismatch OR coverage gap (switch single<->Sequential/Parallel, "
        "correct the _pick(...) tool lists, wire a missing query tool or test mechanism into "
        "the right stage, re-wire missing callbacks) while keeping app/tools.py "
        "unchanged. Otherwise (review-only) flag each deviation and coverage gap precisely in your findings. "
        "Return the requested machine-readable output without extra prose."
    )
    use_vertex = args.vertex or first_env("ANTIGRAVITY_USE_VERTEXAI", "GOOGLE_GENAI_USE_VERTEXAI", "GOOGLE_CLOUD_USE_VERTEXAI") in TRUTHY
    project = args.project or first_env("ANTIGRAVITY_VERTEX_PROJECT", "GOOGLE_CLOUD_PROJECT", "GCLOUD_PROJECT")
    location = args.location or first_env("ANTIGRAVITY_VERTEX_LOCATION", "GOOGLE_CLOUD_LOCATION", "GOOGLE_GENAI_LOCATION")
    config_kwargs = {
        "system_instructions": system_instructions,
        "workspaces": [os.path.abspath(args.workspace_dir)],
    }
    skill_paths = [os.path.abspath(path) for path in args.skills_path if path]
    if skill_paths:
        config_kwargs["skills_paths"] = skill_paths
    if args.model:
        config_kwargs["model"] = args.model
    if use_vertex:
        config_kwargs.update({
            "vertex": True,
            "project": project,
            "location": location,
        })
    hook_list = []

    @hooks.on_session_start
    async def on_session_start():
        emit_status("session_hook_start")

    @hooks.on_session_end
    async def on_session_end():
        emit_status("session_hook_end")

    @hooks.post_tool_call
    async def on_post_tool_call(data):
        emit_status("post_tool_call", **preview_json(data, 800))

    @hooks.on_tool_error
    async def on_tool_error(data):
        emit_status("tool_error", errorType=data.__class__.__name__, message=str(data))
        return None

    @hooks.on_compaction
    async def on_compaction(data):
        emit_status("compaction", **preview_json(data, 800))

    hook_list.extend([on_session_start, on_session_end, on_post_tool_call, on_tool_error, on_compaction])
    interaction_dir = os.environ.get("GE_HARNESS_INTERACTION_DIR")
    if interaction_dir:
        os.makedirs(os.path.join(interaction_dir, "requests"), exist_ok=True)
        os.makedirs(os.path.join(interaction_dir, "responses"), exist_ok=True)

        @hooks.on_interaction
        async def on_interaction(_context, data):
            interaction_id = f"interaction-{uuid.uuid4().hex[:12]}"
            form = interaction_form_from_spec(interaction_id, data)
            request = {
                "schemaVersion": 1,
                "id": interaction_id,
                "kind": "question-form",
                "form": form,
                "sdkSpec": dump_model(data),
                "createdAt": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
            }
            request_path = os.path.join(interaction_dir, "requests", f"{interaction_id}.json")
            with open(request_path, "w", encoding="utf-8") as f:
                json.dump(request, f, indent=2, sort_keys=True)
                f.write("\n")
            emit_status("interaction_request", interactionId=interaction_id, form=form)
            reply = await wait_for_interaction_response(interaction_dir, interaction_id)
            emit_status("interaction_response", interactionId=interaction_id)
            responses = [question_result_from_response(types, item) for item in reply.get("responses", [])]
            return types.QuestionHookResult(responses=responses, cancelled=bool(reply.get("cancelled")))

        hook_list.append(on_interaction)
    if hook_list:
        config_kwargs["hooks"] = hook_list

    # ── MCP servers — let the agent natively call our simulator / department MCP plane ──
    if args.mcp:
        config_kwargs["mcp_servers"] = _mcp_servers_from_specs(
            args.mcp, McpStdioServer, McpSseServer, McpStreamableHttpServer)

    # ── Write capabilities + subagents, gated by the permission profile ──
    # review → read-only (omit capabilities; SDK default). workspace_write/full_auto
    # (or factory tools) → pass CapabilitiesConfig to enable tools, scoped by policy.
    write_allowed = args.permission_profile not in ("review", "read-only", "readonly")
    if write_allowed or args.enable_factory_tools:
        cap_kwargs = {"enable_subagents": bool(args.subagents)}
        disabled_tools = resolve_disabled_tools(args.disable_tool, types) if args.disable_tool else []
        if disabled_tools:
            cap_kwargs["disabled_tools"] = disabled_tools
        try:
            config_kwargs["capabilities"] = CapabilitiesConfig(**cap_kwargs)
        except Exception as exc:  # noqa: BLE001 - degrade if SDK rejects disabled_tools
            emit_status("capabilities_degraded", message=str(exc))
            config_kwargs["capabilities"] = CapabilitiesConfig(enable_subagents=bool(args.subagents))
    # Workspace scoping (existing behaviour) + protected-file deny guards (new).
    # Protect guards are prepended so they take priority over the broad workspace
    # allow. base_workspace_policies/protect_policies are tracked so config build
    # can fall back to the known-good baseline if the SDK rejects a policy shape.
    base_workspace_policies = []
    if (write_allowed or args.enable_factory_tools) and args.policy == "workspace":
        ws_policies = agpolicy.workspace_only([os.path.abspath(args.workspace_dir)])
        base_workspace_policies = list(ws_policies) if isinstance(ws_policies, (list, tuple)) else [ws_policies]
    protect_policies = []
    if write_allowed and args.protect_file:
        protect_policies = build_protect_policies(args.protect_file, agpolicy, types)
    combined_policies = protect_policies + base_workspace_policies
    if combined_policies:
        config_kwargs["policies"] = combined_policies

    # ── Custom factory tools (read-only, in-process) ──
    if args.enable_factory_tools:
        config_kwargs["tools"] = factory_tools()

    # ── Durable / resumable session ──
    if args.conversation_id:
        config_kwargs["conversation_id"] = args.conversation_id
    if args.save_dir:
        config_kwargs["save_dir"] = os.path.abspath(args.save_dir)

    # ── Triggers (fire only in a persistent session; harmless in one-shot) ──
    if args.trigger_every:
        async def _trigger_tick(ctx):
            await ctx.send("Periodic check: re-assess state and continue the next safe step, or stop.")
        config_kwargs["triggers"] = [trigger_every(args.trigger_every, _trigger_tick)]

    # ── Structured output schema — the SDK constrains + validates the agent's
    # final answer to this shape (and retries on mismatch), replacing the fragile
    # "please end with a JSON object" prompt convention. Loaded as a plain JSON
    # Schema dict; if the SDK rejects it the config build below degrades. ──
    response_schema_value = None
    if args.response_schema_file:
        try:
            with open(args.response_schema_file, encoding="utf-8") as f:
                response_schema_value = json.load(f)
        except Exception as exc:  # noqa: BLE001
            emit_status("response_schema_unavailable", reason=str(exc))
            response_schema_value = None
    if response_schema_value is not None:
        config_kwargs["response_schema"] = response_schema_value

    started_at = time.monotonic()
    phase_ref = {"phase": "configuring"}
    emit_status(
        "config",
        vertex=bool(use_vertex),
        project=project if use_vertex else None,
        location=location if use_vertex else None,
        model=args.model or "default",
        workspaceDir=os.path.abspath(args.workspace_dir),
        skills=len(skill_paths),
        promptChars=len(prompt),
    )
    try:
        config = LocalAgentConfig(**config_kwargs)
    except Exception as exc:  # noqa: BLE001
        # An installed SDK that rejects a newly-wired optional (response_schema or a
        # protect-guard policy shape) must not break the run — fall back to the
        # known-good baseline so behaviour matches the pre-capability path.
        emit_status("config_degraded", errorType=exc.__class__.__name__, message=str(exc))
        fallback = dict(config_kwargs)
        fallback.pop("response_schema", None)
        if protect_policies:
            if base_workspace_policies:
                fallback["policies"] = base_workspace_policies
            else:
                fallback.pop("policies", None)
        config = LocalAgentConfig(**fallback)
    if args.dry_run:
        emit_status(
            "dry_run_ok",
            mcp=len(config_kwargs.get("mcp_servers", [])),
            attachments=len(args.attach),
            tools=len(config_kwargs.get("tools", [])),
            policies=len(config_kwargs.get("policies", [])),
            protectedFiles=list(args.protect_file),
            disabledTools=list(args.disable_tool),
            responseSchema=bool(response_schema_value),
            capabilities=("capabilities" in config_kwargs),
            subagents=(bool(args.subagents) if "capabilities" in config_kwargs else None),
            conversationId=args.conversation_id,
            saveDir=config_kwargs.get("save_dir"),
            triggers=len(config_kwargs.get("triggers", [])),
        )
        return 0
    heartbeat_task = asyncio.create_task(heartbeat(phase_ref, started_at))
    try:
        phase_ref["phase"] = "starting_session"
        emit_status("session_starting")
        async with Agent(config) as agent:
            phase_ref["phase"] = "sending_prompt"
            emit_status("session_started")
            chat_input = prompt
            if args.attach:
                attachments = [from_file(os.path.abspath(p)) for p in args.attach]
                chat_input = [prompt, *attachments]
                emit_status("attachments", count=len(attachments),
                            files=[os.path.basename(p) for p in args.attach])
            response = await agent.chat(chat_input)
            emit_status("prompt_sent")
            phase_ref["phase"] = "streaming_response"
            saw_text = False
            text_chars = 0
            thought_chars = 0
            tool_calls = 0
            async for chunk in response.chunks:
                chunk_type = chunk.__class__.__name__
                if chunk_type == "Text":
                    text = getattr(chunk, "text", "")
                    if text:
                        saw_text = True
                        text_chars += len(text)
                        emit_status("text_delta", chars=len(text), totalChars=text_chars, preview=preview_text(text))
                        print(text, end="", flush=True)
                elif chunk_type == "ToolCall":
                    tool_calls += 1
                    emit_status("tool_call", name=getattr(chunk, "name", None), id=getattr(chunk, "id", None), count=tool_calls, **preview_json(chunk, 800))
                elif chunk_type == "ToolResult":
                    emit_status("tool_result", tool_call_id=getattr(chunk, "tool_call_id", None) or getattr(chunk, "toolUseId", None), **preview_json(chunk, 800))
                elif chunk_type == "Thought":
                    text = getattr(chunk, "text", "")
                    thought_chars += len(text)
                    emit_status("thinking", chars=len(text), totalChars=thought_chars)
                else:
                    emit_status("chunk", chunk_type=chunk_type, **preview_json(chunk, 800))
            if saw_text:
                print()
            usage = getattr(getattr(agent, "conversation", None), "total_usage", None)
            if usage:
                emit_status("usage", **preview_json(usage, 1200))
            structured_output = await response.structured_output()
            if structured_output is not None:
                emit_status("structured_output", **preview_json(structured_output, 2000))
                # When the schema produced a validated object but no text streamed,
                # surface it on stdout so the caller's JSON parser still has a
                # conforming object to read.
                if not saw_text:
                    dumped = dump_model(structured_output)
                    try:
                        print(json.dumps(dumped, sort_keys=True), flush=True)
                    except TypeError:
                        print(json.dumps(dumped, sort_keys=True, default=str), flush=True)
            emit_status("done", elapsedSec=round(time.monotonic() - started_at, 1), textChars=text_chars, thoughtChars=thought_chars, toolCalls=tool_calls)
    except Exception as exc:
        emit_status("error", errorType=exc.__class__.__name__, message=str(exc), phase=phase_ref.get("phase", "unknown"))
        raise
    finally:
        heartbeat_task.cancel()
        await asyncio.gather(heartbeat_task, return_exceptions=True)
    return 0


if __name__ == "__main__":
    try:
        raise SystemExit(asyncio.run(main()))
    except KeyboardInterrupt:
        raise SystemExit(130)
