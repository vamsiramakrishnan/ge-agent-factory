#!/usr/bin/env node
// claude-interaction-mcp.mjs — the Claude Code side of the interaction-form
// protocol (structured question forms round-tripped through the console UI).
//
// The Antigravity SDK driver implements this natively (antigravity-sdk-agent.py's
// on_interaction hook). Claude Code has no interaction hook, but it can call
// MCP tools — so this stdio MCP server exposes ONE tool, request_user_input,
// that speaks the same on-disk protocol:
//
//   requests/<id>.json   written here (schemaVersion 1, kind "question-form",
//                        form shape identical to interaction_form_from_spec)
//   responses/<id>.json  written by the daemon when the operator answers in
//                        the console (tools/lib/daemon/harness-run.mjs
//                        submitInteractionResponse) — polled here.
//
// The harness runner (apps/factory/src/harness-runner.js) watches requests/
// and emits the antigravity.interaction_request status event the console
// already listens for, so the same Interview UI renders these forms.
//
// Wired automatically by the claude adapter (apps/factory/src/agents.js) via
// --mcp-config whenever GE_HARNESS_INTERACTION_DIR is set.

import { mkdirSync, existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { randomUUID } from "node:crypto";
import { writeJson } from "@ge/std/json-io";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";

/** Build the question-form request document (the Python driver's shape). */
export function buildInteractionRequest({ interactionId, title, description, questions = [] }) {
  const form = {
    schemaVersion: 1,
    id: interactionId,
    title: title || "The harness needs input",
    description: description || "Answer these questions so the harness can continue the run.",
    submitLabel: "Continue",
    questions: questions.map((question, index) => {
      const options = (question.options || []).map((option, i) =>
        typeof option === "string"
          ? { id: `option-${i + 1}`, label: option }
          : { id: String(option.id || `option-${i + 1}`), label: String(option.label || option.id || `Option ${i + 1}`) });
      const multi = Boolean(question.multiSelect);
      return {
        id: `q${index + 1}`,
        label: String(question.question || `Question ${index + 1}`),
        type: multi ? "checkbox" : options.length ? "radio" : "textarea",
        required: Boolean(question.required),
        options,
        ...(multi && options.length ? { maxSelections: options.length } : {}),
      };
    }),
  };
  return {
    schemaVersion: 1,
    id: interactionId,
    kind: "question-form",
    form,
    createdAt: new Date().toISOString(),
  };
}

/** Fold a response document into a model-friendly answer summary. */
export function summarizeInteractionResponse(request, response = {}) {
  const optionLabel = (question, optionId) =>
    question?.options?.find((option) => option.id === optionId)?.label || optionId;
  const byId = new Map(request.form.questions.map((question) => [question.id, question]));
  return {
    cancelled: response.cancelled === true,
    answers: (response.responses || []).map((entry) => {
      const question = byId.get(entry.questionId);
      return {
        question: question?.label || entry.questionId,
        selectedOptions: (entry.selectedOptionIds || []).map((id) => optionLabel(question, id)),
        freeform: entry.freeformResponse || "",
        skipped: entry.skipped === true,
      };
    }),
  };
}

async function waitForResponse(interactionDir, interactionId, { timeoutMs, pollMs = 500 } = {}) {
  const path = join(interactionDir, "responses", `${interactionId}.json`);
  const deadline = Date.now() + timeoutMs;
  while (Date.now() < deadline) {
    if (existsSync(path)) return JSON.parse(readFileSync(path, "utf8"));
    await new Promise((resolveSleep) => setTimeout(resolveSleep, pollMs));
  }
  throw new Error(`timed out waiting for the operator's response to interaction ${interactionId}`);
}

async function main() {
  const interactionDir = process.env.GE_HARNESS_INTERACTION_DIR;
  if (!interactionDir) {
    process.stderr.write("claude-interaction-mcp: GE_HARNESS_INTERACTION_DIR is not set — no interaction channel available\n");
    process.exit(1);
  }
  mkdirSync(join(interactionDir, "requests"), { recursive: true });
  mkdirSync(join(interactionDir, "responses"), { recursive: true });
  const timeoutMs = Number(process.env.GE_HARNESS_INTERACTION_TIMEOUT_SEC || 3600) * 1000;

  const server = new McpServer({ name: "ge-interaction", version: "1.0.0" });
  server.tool(
    "request_user_input",
    "Ask the human operator structured questions (choices or free text) and block until they answer in the console. Use for interview questions, confirmations, and any decision the operator must make — do not guess answers the operator should give.",
    {
      title: z.string().optional().describe("Short form title shown to the operator"),
      description: z.string().optional().describe("One-line context for why this input is needed"),
      questions: z.array(z.object({
        question: z.string().describe("The question text"),
        options: z.array(z.string()).optional().describe("Choices; omit for a free-text answer"),
        multiSelect: z.boolean().optional().describe("Allow selecting several options"),
        required: z.boolean().optional(),
      })).min(1),
    },
    async ({ title, description, questions }) => {
      const interactionId = `interaction-${randomUUID().replace(/-/g, "").slice(0, 12)}`;
      const request = buildInteractionRequest({ interactionId, title, description, questions });
      writeJson(join(interactionDir, "requests", `${interactionId}.json`), request);
      const response = await waitForResponse(interactionDir, interactionId, { timeoutMs });
      const summary = summarizeInteractionResponse(request, response);
      return { content: [{ type: "text", text: JSON.stringify(summary, null, 2) }] };
    },
  );

  await server.connect(new StdioServerTransport());
}

if (import.meta.main || process.argv[1]?.endsWith("claude-interaction-mcp.mjs")) {
  main().catch((error) => {
    process.stderr.write(`claude-interaction-mcp: ${error.message}\n`);
    process.exit(1);
  });
}
