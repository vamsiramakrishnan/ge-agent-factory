import { compactDetail } from "../lib/dom.js";
import { startChatRun, cancelChatRun } from "../lib/api.js";
import { parseSse } from "../lib/sse.js";
import { getWorkspaceScope, workspaceScopeKey } from "../state.js";

export function createRunController(state, elements, { transcript, timeline, onUpdate, onEnd }) {
  const {
    send,
    cancelBtn,
    runTitle,
    streamState,
    runState,
    runDot,
    daemonDot,
    daemonState,
    homeDaemonState,
    selectedAgentPill,
    statusMetric,
    runtimeMetric,
    runIdText,
  } = elements;

  let timer = null;
  let runStartedAt = 0;
  let streamScope = null;

  function currentScopeKey() {
    return workspaceScopeKey(state.selectedProject, state.selectedAgentId);
  }

  function isVisibleScope(scope = streamScope) {
    return !scope || scope.key === currentScopeKey();
  }

  function applyRunScope(scope = getWorkspaceScope(state)) {
    if (!scope) return;
    state.currentRunId = scope.currentRunId || null;
    runIdText.textContent = scope.runIdText || scope.currentRunId || "No run yet";
    runtimeMetric.textContent = scope.runtimeText || "0s";
    const staleFailure = (scope.runStatus === "failed" || scope.streamState === "Failed" || scope.streamState === "Error") && !scope.currentRunId;
    const status = staleFailure ? "idle" : scope.runStatus || "idle";
    if (staleFailure) {
      scope.runStatus = "idle";
      scope.streamState = "No active run";
      scope.runIdText = "No run yet";
    }
    streamState.textContent = scope.streamState || "No active run";
    setRun(status, { renderOnly: true });
    const running = scope.runStatus === "running" && !!scope.currentRunId;
    send.disabled = running;
    cancelBtn.disabled = !running;
  }

  function setDaemon(ok, label) {
    daemonDot.className = `dot ${ok ? "on" : "warn"}`;
    daemonState.textContent = label;
    homeDaemonState.textContent = label;
  }

  function setRun(status, options = {}) {
    const s = status || "idle";
    if (!options.renderOnly) {
      const scope = streamScope
        ? getWorkspaceScope(state, streamScope.projectId, streamScope.agentId)
        : getWorkspaceScope(state);
      if (scope) scope.runStatus = s;
    }
    runState.textContent = s;
    statusMetric.textContent = s;
    const tone =
      s === "running" ? "warn"
      : s === "succeeded" ? "on"
      : s === "idle" ? "idle"
      : "";
    runDot.className = `dot ${tone}`;
    runTitle.textContent = s === "idle" ? "Ready" : `${s[0].toUpperCase()}${s.slice(1)} run`;
  }

  function startTimer() {
    clearInterval(timer);
    runStartedAt = Date.now();
    runtimeMetric.textContent = "0s";
    timer = setInterval(() => {
      const text = `${Math.max(0, Math.floor((Date.now() - runStartedAt) / 1000))}s`;
      if (streamScope) {
        const scope = getWorkspaceScope(state, streamScope.projectId, streamScope.agentId);
        if (scope) scope.runtimeText = text;
      }
      if (isVisibleScope()) runtimeMetric.textContent = text;
    }, 250);
  }

  function stopTimer() {
    clearInterval(timer);
    timer = null;
  }

  function handleStatusEvent(data) {
    const scope = streamScope ? getWorkspaceScope(state, streamScope.projectId, streamScope.agentId) : getWorkspaceScope(state);
    if (data.runId) {
      if (scope) {
        scope.currentRunId = data.runId;
        scope.runIdText = data.runId;
      }
      if (isVisibleScope()) {
        state.currentRunId = data.runId;
        runIdText.textContent = data.runId;
        cancelBtn.disabled = false;
      }
      onUpdate();
    }
    const label = data.label || data.status || "running";
    if (scope) scope.streamState = label;
    if (!isVisibleScope()) return;
    streamState.textContent = label;
    setRun("running");
    timeline.addStep(label, data.pid ? `pid ${data.pid}` : data.agentId || compactDetail(data), "active");
  }

  function handleAgentEvent(data) {
    if (!isVisibleScope()) return;
    const type = data.type || "text_delta";
    const eventType = data.eventType || type;
    if (type === "stderr") {
      const text = data.delta || data.message || "";
      const isFatal = /error executing tool|failed|traceback|exception/i.test(text) && !/warning:|fallback/i.test(text);
      if (isFatal) transcript.addMessage("error", text);
      else transcript.addToolCard("stderr", "CLI diagnostics", text);
      timeline.addStep("stderr", text, isFatal ? "bad" : "tool");
      return;
    }
    if (type === "thinking") {
      transcript.addThinking(data.delta || data.text || "");
      streamState.textContent = "Thinking";
      return;
    }
    if (type === "text_delta" || type === "stdout") {
      transcript.appendAgent(data.delta || data.text || "");
      streamState.textContent = "Streaming text";
      return;
    }
    if (eventType.includes("tool")) {
      transcript.resetActive();
      const toolName = data.raw?.name || data.name || eventType;
      const toolSummary = summarizeToolEvent(eventType, data.delta || data.message || "");
      const toolDetail = compactDetail(data);
      transcript.addToolCard(toolName, toolSummary, toolDetail);
      timeline.addStep(eventType, toolName + (toolSummary ? `: ${toolSummary}` : ""), "tool");
      streamState.textContent = "Tool activity";
      return;
    }
    timeline.addStep(eventType, compactDetail(data), "tool");
    if (data.delta || data.message || data.text) {
      const text = data.delta || data.message || data.text;
      transcript.addToolCard(eventType, text, compactDetail(data));
    }
  }

  function summarizeToolEvent(eventType, text) {
    const raw = String(text || "");
    if (!raw) return eventType.includes("result") ? "completed" : "";
    const trimmed = raw.trim();
    if (eventType.includes("result")) {
      if (/=+ test session starts =+/.test(trimmed)) {
        const passed = trimmed.match(/(\d+)\s+passed/);
        const failed = trimmed.match(/(\d+)\s+failed/);
        return failed ? `${failed[1]} failed` : passed ? `${passed[1]} passed` : "pytest completed";
      }
      if (trimmed.startsWith("{") || trimmed.startsWith("[")) return "JSON result";
      return trimmed.length > 120 ? `${trimmed.slice(0, 117)}...` : trimmed;
    }
    return trimmed.length > 120 ? `${trimmed.slice(0, 117)}...` : trimmed;
  }

  function handleEndEvent(data) {
    const status = data.status || "finished";
    const ok = status === "succeeded";
    const scope = streamScope ? getWorkspaceScope(state, streamScope.projectId, streamScope.agentId) : getWorkspaceScope(state);
    if (scope) {
      scope.runStatus = status;
      scope.streamState = ok ? "Completed" : "Stopped";
      scope.currentRunId = null;
    }
    if (!isVisibleScope()) {
      stopTimer();
      return;
    }
    setRun(status);
    streamState.textContent = ok ? "Completed" : "Stopped";
    timeline.addStep(
      ok ? "Completed" : "Ended",
      data.signal || (data.code == null ? "" : `code ${data.code}`),
      ok ? "good" : "bad",
    );
    send.disabled = false;
    cancelBtn.disabled = true;
    stopTimer();
    onEnd();
  }

  function handleSse(raw) {
    const parsed = parseSse(raw);
    if (!parsed) return;
    const { event, data } = parsed;
    if (event === "status") handleStatusEvent(data);
    else if (event === "agent") handleAgentEvent(data);
    else if (event === "error") {
      const scope = streamScope ? getWorkspaceScope(state, streamScope.projectId, streamScope.agentId) : getWorkspaceScope(state);
      if (scope) {
        scope.runStatus = "failed";
        scope.streamState = "Error";
        scope.currentRunId = null;
      }
      if (!isVisibleScope()) return;
      transcript.addMessage("error", data.message || JSON.stringify(data));
      timeline.addStep(data.code || "Error", compactDetail(data), "bad");
      streamState.textContent = "Error";
    } else if (event === "end") handleEndEvent(data);
    else {
      timeline.addStep(event, compactDetail(data), "tool");
      if (data.message || data.delta) transcript.addMessage("tool", data.message || data.delta, "tool");
    }
  }

  function connectRunEvents(runId) {
    const events = new EventSource(`/api/runs/${encodeURIComponent(runId)}/events`);
    events.addEventListener("status", (e) => handleSse(`event: status\ndata: ${e.data}`));
    events.addEventListener("agent", (e) => handleSse(`event: agent\ndata: ${e.data}`));
    events.addEventListener("error", (e) => {
      if (e.data) handleSse(`event: error\ndata: ${e.data}`);
      else {
        const scope = streamScope ? getWorkspaceScope(state, streamScope.projectId, streamScope.agentId) : getWorkspaceScope(state);
        if (scope) {
          scope.runStatus = "failed";
          scope.streamState = "Event stream interrupted";
          scope.currentRunId = null;
        }
        if (!isVisibleScope()) {
          stopTimer();
          events.close();
          return;
        }
        timeline.addStep("Event stream interrupted", runId, "bad");
        streamState.textContent = "Event stream interrupted";
        send.disabled = false;
        cancelBtn.disabled = true;
        stopTimer();
        events.close();
      }
    });
    events.addEventListener("end", (e) => {
      handleSse(`event: end\ndata: ${e.data}`);
      events.close();
    });
  }

  async function run(text) {
    send.disabled = true;
    cancelBtn.disabled = true;
    const projectId = state.selectedProject;
    const agentId = state.selectedAgentId || null;
    streamScope = { projectId, agentId, key: workspaceScopeKey(projectId, agentId) };
    const scope = getWorkspaceScope(state, projectId, agentId);
    scope.currentRunId = null;
    scope.runStatus = "running";
    scope.runtimeText = "0s";
    scope.runIdText = "No run yet";
    scope.streamState = "Connecting to daemon";
    state.currentRunId = null;
    transcript.resetActive();
    timeline.reset();
    setRun("running");
    onUpdate();
    streamState.textContent = "Connecting to daemon";
    transcript.addMessage("user", text);
    timeline.addStep("Queued run", state.selectedAgent, "active");
    startTimer();

    const response = await startChatRun({
      agentId: state.selectedAgent,
      model: state.selectedModel,
      projectId: state.selectedProject,
      selectedAgentId: state.selectedAgentId || undefined,
      message: text,
    });
    if (!response.ok) throw new Error(`daemon ${response.status}`);
    if (!response.body) {
      const data = await response.json();
      if (!data.runId) throw new Error("daemon response did not include a run stream");
      scope.currentRunId = data.runId;
      scope.runIdText = data.runId;
      if (isVisibleScope()) {
        state.currentRunId = data.runId;
        runIdText.textContent = data.runId;
      }
      connectRunEvents(data.runId);
      return;
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let buffer = "";
    while (true) {
      const { value, done } = await reader.read();
      if (done) break;
      buffer += decoder.decode(value, { stream: true });
      const events = buffer.split("\n\n");
      buffer = events.pop() || "";
      for (const raw of events) handleSse(raw);
    }
    if (buffer.trim()) handleSse(buffer);
  }

  async function cancel() {
    const scope = getWorkspaceScope(state);
    const runId = scope?.currentRunId || state.currentRunId;
    if (!runId) return;
    cancelBtn.disabled = true;
    await cancelChatRun(runId);
    timeline.addStep("Cancel requested", runId, "bad");
  }

  function handleRunError(error) {
    const scope = streamScope
      ? getWorkspaceScope(state, streamScope.projectId, streamScope.agentId)
      : getWorkspaceScope(state);
    if (scope) {
      scope.runStatus = "failed";
      scope.streamState = "Failed";
      scope.currentRunId = null;
    }
    if (!isVisibleScope()) {
      stopTimer();
      return;
    }
    transcript.addMessage("error", error.message);
    timeline.addStep("Run failed", error.message, "bad");
    setRun("failed");
    streamState.textContent = "Failed";
    send.disabled = false;
    cancelBtn.disabled = true;
    stopTimer();
  }

  function resetUi() {
    const scope = getWorkspaceScope(state);
    if (scope) {
      scope.currentRunId = null;
      scope.runStatus = "idle";
      scope.runtimeText = "0s";
      scope.runIdText = "No run yet";
      scope.streamState = "No active run";
    }
    transcript.showEmpty("Transcript cleared.", "Start another agent run when ready.");
    timeline.reset();
    state.currentRunId = null;
    setRun("idle");
    streamState.textContent = "No active run";
    runIdText.textContent = "No run yet";
    runtimeMetric.textContent = "0s";
    onUpdate();
  }

  return { run, cancel, handleRunError, resetUi, setDaemon, setRun, applyRunScope };
}
