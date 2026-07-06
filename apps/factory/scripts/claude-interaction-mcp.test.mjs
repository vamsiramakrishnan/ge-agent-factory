// Contract tests for the Claude interaction-form bridge: the request document
// must match the shape the Antigravity driver writes (so the console renders
// both identically), and the response summary must fold the daemon's
// normalized response into model-readable answers.
import { describe, expect, test } from "bun:test";
import { buildInteractionRequest, summarizeInteractionResponse } from "./claude-interaction-mcp.mjs";

describe("claude interaction bridge", () => {
  test("builds a question-form request in the driver's on-disk shape", () => {
    const request = buildInteractionRequest({
      interactionId: "interaction-abc123",
      title: "Interview",
      questions: [
        { question: "Which systems?", options: ["Workday", "SAP"], multiSelect: true },
        { question: "Pick a department", options: [{ id: "fin", label: "Finance" }] },
        { question: "Describe the outcome" },
      ],
    });
    expect(request.schemaVersion).toBe(1);
    expect(request.kind).toBe("question-form");
    expect(request.id).toBe("interaction-abc123");
    expect(request.form.id).toBe("interaction-abc123");
    expect(request.form.submitLabel).toBe("Continue");
    const [multi, radio, textarea] = request.form.questions;
    expect(multi).toMatchObject({ id: "q1", type: "checkbox", maxSelections: 2 });
    expect(multi.options).toEqual([{ id: "option-1", label: "Workday" }, { id: "option-2", label: "SAP" }]);
    expect(radio).toMatchObject({ id: "q2", type: "radio" });
    expect(radio.options).toEqual([{ id: "fin", label: "Finance" }]);
    expect(textarea).toMatchObject({ id: "q3", type: "textarea", options: [] });
  });

  test("summarizes the daemon's normalized response with option labels", () => {
    const request = buildInteractionRequest({
      interactionId: "interaction-x",
      questions: [
        { question: "Which systems?", options: ["Workday", "SAP"], multiSelect: true },
        { question: "Anything else?" },
      ],
    });
    const summary = summarizeInteractionResponse(request, {
      interactionId: "interaction-x",
      cancelled: false,
      responses: [
        { questionId: "q1", selectedOptionIds: ["option-2"], freeformResponse: "", skipped: false },
        { questionId: "q2", selectedOptionIds: [], freeformResponse: "no", skipped: false },
      ],
    });
    expect(summary.cancelled).toBe(false);
    expect(summary.answers[0]).toEqual({ question: "Which systems?", selectedOptions: ["SAP"], freeform: "", skipped: false });
    expect(summary.answers[1].freeform).toBe("no");
  });

  test("cancelled responses surface as cancelled", () => {
    const request = buildInteractionRequest({ interactionId: "i", questions: [{ question: "Q" }] });
    expect(summarizeInteractionResponse(request, { cancelled: true, responses: [] })).toEqual({ cancelled: true, answers: [] });
  });
});
