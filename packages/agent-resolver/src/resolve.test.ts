import { test, expect } from "bun:test";
import { normalizeAgentId, candidateKeys, sameAgent } from "./resolve";

test("normalizeAgentId maps uc/A/number to one numeric core", () => {
  expect(normalizeAgentId("uc-2103")).toMatchObject({ num: "2103", ucId: "uc-2103", agentId: "A-2103" });
  expect(normalizeAgentId("A-2103")).toMatchObject({ num: "2103", ucId: "uc-2103", agentId: "A-2103" });
  expect(normalizeAgentId("2103")).toMatchObject({ num: "2103", ucId: "uc-2103", agentId: "A-2103" });
  expect(normalizeAgentId("account-reconciliation-agent").num).toBe(null);
  expect(normalizeAgentId(null).raw).toBe("");
});

test("candidateKeys returns all id forms, deduped", () => {
  expect(candidateKeys("uc-2103").sort()).toEqual(["2103", "A-2103", "uc-2103"].sort());
  expect(candidateKeys("A-2103").sort()).toEqual(["2103", "A-2103", "uc-2103"].sort());
  expect(candidateKeys("account-reconciliation-agent")).toEqual(["account-reconciliation-agent"]);
});

test("sameAgent equates uc/A/number forms but not different numbers", () => {
  expect(sameAgent("uc-2103", "A-2103")).toBe(true);
  expect(sameAgent("uc-2103", "2103")).toBe(true);
  expect(sameAgent("uc-2103", "uc-2104")).toBe(false);
  expect(sameAgent("account-reconciliation-agent", "account-reconciliation-agent")).toBe(true);
  expect(sameAgent("uc-2103", "account-reconciliation-agent")).toBe(false);
});
