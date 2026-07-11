import { describe, expect, test } from "bun:test";
import { resolveJudgeModelForEvalConfig } from "../scripts/factory.mjs";

describe("eval judge model normalization", () => {
  test("keeps local bare model ids byte-stable outside Vertex mode", () => {
    expect(resolveJudgeModelForEvalConfig("gemini-3.5-flash", {
      GOOGLE_CLOUD_PROJECT: "demo",
      GOOGLE_GENAI_LOCATION: "global",
    })).toBe("gemini-3.5-flash");
  });

  test("normalizes bare judge model ids to Vertex autorater resource names in cloud mode", () => {
    expect(resolveJudgeModelForEvalConfig("gemini-3.5-flash", {
      GOOGLE_GENAI_USE_VERTEXAI: "TRUE",
      GOOGLE_CLOUD_PROJECT: "demo",
      GOOGLE_GENAI_LOCATION: "global",
    })).toBe("projects/demo/locations/global/publishers/google/models/gemini-3.5-flash");
  });

  test("leaves already-qualified judge model resources unchanged", () => {
    const model = "projects/demo/locations/global/publishers/google/models/gemini-2.5-flash";
    expect(resolveJudgeModelForEvalConfig(model, {
      GOOGLE_GENAI_USE_VERTEXAI: "TRUE",
      GOOGLE_CLOUD_PROJECT: "other",
      GOOGLE_GENAI_LOCATION: "us-central1",
    })).toBe(model);
  });
});
