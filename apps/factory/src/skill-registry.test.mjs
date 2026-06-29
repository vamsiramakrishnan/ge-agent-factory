import { describe, expect, test } from "bun:test";
import { resolve } from "node:path";
import { loadSkillRegistry, parseFrontmatter, selectSkillsForContext } from "./skill-registry.js";

describe("skill registry frontmatter", () => {
  test("parses folded multiline YAML descriptions from Agents CLI skills", () => {
    const frontmatter = parseFrontmatter(`---
name: google-agents-cli-adk-code
description: >
  This skill should be used when the user wants to build an agent with ADK,
  add a tool, create a callback, or use state management.
metadata:
  author: Google
---

# ADK Cheatsheet
`);

    expect(frontmatter.name).toBe("google-agents-cli-adk-code");
    expect(frontmatter.description).toBe("This skill should be used when the user wants to build an agent with ADK, add a tool, create a callback, or use state management.");
  });
});

describe("skill registry selection", () => {
  test("selects building-simulators for simulator and mock-data capability requests", async () => {
    const registry = await loadSkillRegistry(resolve("."));
    const selected = selectSkillsForContext({
      registry,
      capabilities: ["simulation", "mock_data"],
      stages: ["simulator.seed"],
      message: "Use Antigravity to generate mock data and seed the simulator.",
    });

    expect(selected.some((skill) => skill.id === "building-simulators")).toBe(true);
  });
});
