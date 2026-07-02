/**
 * @ge/agent-spec — one home for the agent-spec shape.
 *
 * - ./schema: zod schemas + inferred types (the shape/type authority).
 * - ./validate: the shipped imperative validators, moved verbatim from
 *   apps/factory/src/agent-spec-registry.js — byte-stable
 *   { ok, maturity, gaps } output.
 * - ./constants: AGENT_SPEC_SCHEMA_VERSION / INTERVIEW_SPEC_DIR /
 *   REQUIRED_BEHAVIOR_FIELDS, moved verbatim from the same file.
 *
 * The `./validate` and `./constants` subpaths are plain .mjs so plain-node
 * callers (skills scripts) can import them without a TS loader; `.` and
 * `./schema` are TypeScript for bun/vite/tsc consumers.
 */
export * from "./constants.mjs";
export * from "./validate.mjs";
export * from "./schema";
