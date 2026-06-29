/**
 * Slash command system.
 *
 * Intercepts /commands from the chat input and renders interactive forms
 * instead of sending to the agent. Supports:
 *   /deploy  — produce a deployment plan
 *   /register — inspect registration readiness
 *   /publish — produce a publish plan
 *   /test   — run smoke tests
 *   /serve  — start ADK web preview
 *   /status — show agent pipeline status
 *   /help   — list available commands
 */
import { escapeHtml } from "../lib/dom.js";
import { renderQuestionForm } from "../ui/question-form.js";

const COMMANDS = {
  deploy: {
    title: "Deployment Plan",
    description: "Create a plan-only deployment artifact. Live cloud mutation requires a separate explicit request.",
    questions: [
      { id: "target", label: "Deploy Target", type: "radio", options: ["Agent Runtime", "Cloud Run"], required: true },
      { id: "project", label: "GCP Project", type: "text", placeholder: "my-gcp-project", help: "Or set GOOGLE_CLOUD_PROJECT env var" },
      { id: "region", label: "Region", type: "select", options: ["global", "us-central1", "us-east1", "us-west1", "europe-west1", "asia-east1"], required: true },
    ],
    submitLabel: "Plan",
    toCommand: (answers) => {
      const target = answers.target === "Cloud Run" ? "cloud_run" : "agent_runtime";
      return `Create a deploy plan for this workspace with target ${target}${answers.project ? ` in project ${answers.project}` : ""}${answers.region ? ` region ${answers.region}` : ""}. Do not deploy or call live Google services.`;
    },
  },
  register: {
    title: "Registration Readiness",
    description: "Check whether this agent is ready for registry wiring.",
    questions: [
      { id: "mode", label: "Registration Mode", type: "radio", options: ["MCP Server", "A2A Agent", "ADK (for Gemini Enterprise)"], required: true },
      { id: "project", label: "GCP Project", type: "text", placeholder: "my-gcp-project" },
      { id: "displayName", label: "Display Name", type: "text", placeholder: "My Agent" },
    ],
    submitLabel: "Check",
    toCommand: (answers) => {
      const mode = answers.mode?.includes("MCP") ? "mcp" : answers.mode?.includes("A2A") ? "a2a" : "adk";
      return `Check registration readiness for ${mode}${answers.project ? ` in project ${answers.project}` : ""}${answers.displayName ? ` with display name ${answers.displayName}` : ""}. Do not register live resources.`;
    },
  },
  publish: {
    title: "Publish Plan",
    description: "Create a Gemini Enterprise publish plan without publishing.",
    questions: [
      { id: "appId", label: "Gemini Enterprise App ID", type: "text", placeholder: "my-app-id", required: true, help: "Or set GEMINI_ENTERPRISE_APP_ID env var" },
      { id: "displayName", label: "Display Name", type: "text", placeholder: "My Demo Agent" },
      { id: "description", label: "Description", type: "textarea", placeholder: "What does this agent do?" },
    ],
    submitLabel: "Plan",
    toCommand: (answers) => {
      return `Create a Gemini Enterprise publish plan${answers.appId ? ` for app ${answers.appId}` : ""}${answers.displayName ? ` with display name ${answers.displayName}` : ""}${answers.description ? ` and description ${answers.description}` : ""}. Do not publish live resources.`;
    },
  },
  test: {
    title: "Run Tests",
    description: "Generate and run smoke tests for this agent.",
    questions: [
      { id: "confirm", label: "This will run uv run pytest in the agent directory", type: "radio", options: ["Run tests", "Cancel"], required: true },
    ],
    submitLabel: "Run",
    toCommand: (answers) => answers.confirm === "Run tests" ? "Validate this workspace locally with ge validate and uv tests. Patch only validation blockers; do not deploy." : null,
  },
  serve: {
    title: "Run ADK Agent",
    description: "Run adk run --replay to test this agent locally.",
    questions: [
      { id: "port", label: "Port", type: "text", placeholder: "8080", help: "Default: 8080" },
    ],
    submitLabel: "Run Agent",
    toCommand: () => "Run the selected generated ADK agent locally with adk run --replay using a hello prompt. Do not deploy.",
  },
  status: {
    title: "Pipeline Status",
    description: "Show the current agent's pipeline stage and readiness.",
    questions: [],
    submitLabel: null,
    toCommand: () => "Report this workspace's capabilities, readiness, selected skills, artifacts, and next action.",
  },
};

export function createSlashCommands({ transcript, runAgent, state }) {
  function tryHandle(text) {
    const trimmed = text.trim();
    if (!trimmed.startsWith("/")) return false;

    const [cmd, ...rest] = trimmed.slice(1).split(/\s+/);
    const lowerCmd = cmd.toLowerCase();

    if (lowerCmd === "help") {
      showHelp();
      return true;
    }

    const def = COMMANDS[lowerCmd];
    if (!def) return false;

    if (def.questions.length === 0 || !def.submitLabel) {
      const command = def.toCommand({});
      if (command) runAgent(command);
      return true;
    }

    showForm(lowerCmd, def);
    return true;
  }

  function showHelp() {
    transcript.addMessage("user", "/help");
    const helpText = [
      "Available commands:",
      "",
      "  /deploy    — Deploy to Agent Runtime or Cloud Run",
      "  /register  — Register in Agent Registry (MCP/A2A)",
      "  /publish   — Publish to Gemini Enterprise",
      "  /test      — Run smoke tests",
      "  /serve     — Start ADK web preview",
      "  /status    — Show pipeline status",
      "  /help      — Show this message",
      "",
      "Type a command or just chat normally with the agent.",
    ].join("\n");
    transcript.addMessage("agent", helpText);
    transcript.resetActive();
  }

  function showForm(cmdName, def) {
    transcript.addMessage("user", `/${cmdName}`);

    const form = {
      id: `cmd-${cmdName}`,
      title: def.title,
      description: def.description,
      questions: def.questions,
      submitLabel: def.submitLabel,
    };

    const formEl = renderQuestionForm(form, {
      interactive: true,
      onSubmit: (formattedText, answers) => {
        formEl.classList.add("question-form-locked");
        const command = def.toCommand(answers);
        if (command) {
          runAgent(command);
        }
      },
    });

    transcript.ensureNoEmpty?.();
    const flow = document.querySelector(".assistant-flow") || document.getElementById("transcript");
    if (flow) {
      const wrapper = document.createElement("div");
      wrapper.className = "msg assistant";
      wrapper.innerHTML = `<div class="role"><span>Agent Studio</span></div><div class="assistant-flow"></div>`;
      wrapper.querySelector(".assistant-flow").appendChild(formEl);
      document.getElementById("transcript").appendChild(wrapper);
    }
  }

  function getSuggestions(partial) {
    if (!partial.startsWith("/")) return [];
    const q = partial.slice(1).toLowerCase();
    const matches = ["help", ...Object.keys(COMMANDS)].filter((c) => c.startsWith(q));
    return matches.map((c) => `/${c}`);
  }

  return { tryHandle, getSuggestions };
}
