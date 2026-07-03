// Responder assertion policy: matched / mismatched / unknown / not_applicable,
// with strictness deciding whether unverifiable identity passes.
import { test, expect } from "bun:test";
import { assertResponder, responderVerdict, scanIdentityEvidence, identityMatches } from "./responder.mjs";

const chunkWith = (json) => ({ atMs: 0, json });

test("deep scan finds identity keys at any depth", () => {
  const found = scanIdentityEvidence({ answer: { metadata: { agentId: "agent-benefits" }, replies: [] } });
  expect(found).toEqual([{ path: "answer.metadata.agentId", value: "agent-benefits" }]);
});

test("resource names match on their last segment", () => {
  expect(identityMatches("projects/p/engines/e/agents/agent-benefits", "agent-benefits")).toBe(true);
  expect(identityMatches("agent-benefits", "agent-benefits")).toBe(true);
  expect(identityMatches("agent-payroll", "agent-benefits")).toBe(false);
});

test("matched when the stream names the expected agent", () => {
  const result = assertResponder({
    expectedAgentId: "agent-benefits",
    chunks: [chunkWith({ answer: { metadata: { agentId: "agent-benefits" } } })],
  });
  expect(result.assertion).toBe("matched");
  expect(result.observedAgentId).toBe("agent-benefits");
  expect(result.evidence).toEqual(["answer.metadata.agentId=agent-benefits"]);
});

test("mismatched when the stream names a different agent", () => {
  const result = assertResponder({
    expectedAgentId: "agent-benefits",
    chunks: [chunkWith({ answer: { metadata: { agentId: "agent-payroll" } } })],
  });
  expect(result.assertion).toBe("mismatched");
  expect(result.observedAgentId).toBe("agent-payroll");
});

test("unknown when the stream carries no identity evidence", () => {
  const result = assertResponder({
    expectedAgentId: "agent-benefits",
    chunks: [chunkWith({ answer: { replies: [] } })],
  });
  expect(result.assertion).toBe("unknown");
  expect(result.observedAgentId).toBe(null);
});

test("not_applicable when no expected agent is configured", () => {
  const result = assertResponder({ expectedAgentId: null, chunks: [chunkWith({ answer: { metadata: { agentId: "whoever" } } })] });
  expect(result.assertion).toBe("not_applicable");
  expect(result.observedAgentId).toBe("whoever"); // still reported, just not asserted
});

test("verdict policy: mismatch always fails; unknown fails only when strict", () => {
  expect(responderVerdict("matched").ok).toBe(true);
  expect(responderVerdict("mismatched").ok).toBe(false);
  expect(responderVerdict("mismatched", { strict: true }).ok).toBe(false);
  const lax = responderVerdict("unknown");
  expect(lax.ok).toBe(true);
  expect(lax.warning).toContain("could not be verified");
  expect(responderVerdict("unknown", { strict: true }).ok).toBe(false);
  expect(responderVerdict("not_applicable").ok).toBe(true);
});
