import { test, expect } from "bun:test";
import { createArtifactParser, type ArtifactEvent } from "./parser";
import { reduceSpecArtifact, emptySpecArtifact, tryParseSpecLoose, specSections, specReadiness } from "./specArtifact";

function collect(deltas: string[]): ArtifactEvent[] {
  const parser = createArtifactParser();
  const events: ArtifactEvent[] = [];
  for (const d of deltas) for (const e of parser.feed(d)) events.push(e);
  for (const e of parser.flush()) events.push(e);
  return events;
}

test("plain text passes through untouched", () => {
  const events = collect(["hello ", "world"]);
  expect(events).toEqual([
    { type: "text", delta: "hello " },
    { type: "text", delta: "world" },
  ]);
});

test("single artifact emitted start/chunk/end", () => {
  const events = collect([
    'before <artifact identifier="agent-spec" type="application/json" title="Spec">',
    '{"title":"X"}',
    "</artifact> after",
  ]);
  expect(events[0]).toEqual({ type: "text", delta: "before " });
  expect(events[1]).toEqual({ type: "artifact:start", identifier: "agent-spec", artifactType: "application/json", title: "Spec" });
  expect(events.find((e) => e.type === "artifact:end")).toEqual({
    type: "artifact:end",
    identifier: "agent-spec",
    fullContent: '{"title":"X"}',
  });
  expect(events.at(-1)).toEqual({ type: "text", delta: " after" });
});

test("open tag split across deltas is held back, not leaked as text", () => {
  const events = collect(["<arti", 'fact identifier="agent-spec">', "body", "</artifact>"]);
  const texts = events.filter((e) => e.type === "text");
  expect(texts).toHaveLength(0);
  expect(events[0]).toMatchObject({ type: "artifact:start", identifier: "agent-spec" });
  expect(events.at(-1)).toMatchObject({ type: "artifact:end", fullContent: "body" });
});

test("close tag split across deltas does not emit a partial chunk", () => {
  const events = collect(['<artifact identifier="agent-spec">', "ab</arti", "fact>"]);
  const chunks = events.filter((e) => e.type === "artifact:chunk").map((e: any) => e.delta);
  // "ab" should arrive but the held-back "</arti" tail must not leak.
  expect(chunks.join("")).toBe("ab");
  expect(events.at(-1)).toMatchObject({ type: "artifact:end", fullContent: "ab" });
});

test("unterminated artifact is closed on flush", () => {
  const events = collect(['<artifact identifier="agent-spec">partial']);
  expect(events.at(-1)).toMatchObject({ type: "artifact:end", fullContent: "partial" });
});

test("a bare <artifactual word is treated as text, not an open tag", () => {
  const events = collect(["the <artifactual nature"]);
  expect(events).toEqual([{ type: "text", delta: "the <artifactual nature" }]);
});

test("reduceSpecArtifact builds streaming -> complete state", () => {
  let state = emptySpecArtifact();
  const parser = createArtifactParser();
  const deltas = ['<artifact identifier="agent-spec">{"title":"Hi",', '"sourceSystems":[{"id":"workday"}]}</artifact>'];
  for (const d of deltas) for (const e of parser.feed(d)) state = reduceSpecArtifact(state, e);
  for (const e of parser.flush()) state = reduceSpecArtifact(state, e);
  expect(state.status).toBe("complete");
  expect(state.spec?.title).toBe("Hi");
  expect(specReadiness(state.spec).systems).toBe(1);
});

test("tryParseSpecLoose repairs a truncated object", () => {
  const parsed = tryParseSpecLoose('{"title":"X","entities":[{"name":"a"},');
  expect(parsed?.title).toBe("X");
  expect(Array.isArray(parsed?.entities)).toBe(true);
});

test("specSections orders known sections and classifies kinds", () => {
  const sections = specSections({
    title: "T",
    sourceSystems: [{ id: "a" }, { id: "b" }],
    tags: ["x", "y"],
  });
  expect(sections[0]).toMatchObject({ key: "title", kind: "scalar" });
  expect(sections.find((s) => s.key === "sourceSystems")).toMatchObject({ kind: "table" });
  expect(sections.find((s) => s.key === "tags")).toMatchObject({ kind: "list" });
});
