/**
 * @ge/agent-spec — one home for the agent-spec shape.
 *
 * - ./schema: zod schemas + inferred types (the shape/type authority).
 * - ./validate (from WS2 Step 4): the shipped imperative validators, moved
 *   verbatim from apps/factory/src/agent-spec-registry.js — byte-stable
 *   { ok, maturity, gaps } output.
 */
export * from "./schema";
