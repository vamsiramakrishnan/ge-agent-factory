// Stream-parser robustness: split objects, split UTF-8, array punctuation,
// truncated streams. These are the wire conditions the REST streaming format
// actually produces.
import { test, expect } from "bun:test";
import { createJsonStreamParser, parseJsonStream } from "./parse-json-stream.mjs";

test("parses a whole JSON array in one chunk", () => {
  const objects = parseJsonStream('[{"a":1},{"b":2}]');
  expect(objects).toEqual([{ a: 1 }, { b: 2 }]);
});

test("parses objects split across arbitrary chunk boundaries", () => {
  const parser = createJsonStreamParser();
  const collected = [];
  collected.push(...parser.push('[{"answer":{"replies":[{"text":"he'));
  collected.push(...parser.push('llo"}]}},{"sessionInfo":{"se'));
  collected.push(...parser.push('ssion":"s1"}}]'));
  collected.push(...parser.end());
  expect(collected).toEqual([
    { answer: { replies: [{ text: "hello" }] } },
    { sessionInfo: { session: "s1" } },
  ]);
});

test("handles braces and escapes inside strings", () => {
  const objects = parseJsonStream('[{"text":"a } b { c \\" d"}]');
  expect(objects[0].text).toBe('a } b { c " d');
});

test("handles multi-byte UTF-8 split across byte chunks", () => {
  const bytes = new TextEncoder().encode('[{"text":"héllo — ✓"}]');
  const parser = createJsonStreamParser();
  const collected = [];
  // Split in the middle of the multi-byte em dash.
  const splitAt = 14;
  collected.push(...parser.push(bytes.slice(0, splitAt)));
  collected.push(...parser.push(bytes.slice(splitAt)));
  collected.push(...parser.end());
  expect(collected[0].text).toBe("héllo — ✓");
});

test("tolerates whitespace and newlines between elements", () => {
  const objects = parseJsonStream('[\n  {"a":1},\n  {"b":2}\n]\n');
  expect(objects).toHaveLength(2);
});

test("accepts a bare object stream without the array wrapper", () => {
  const objects = parseJsonStream('{"a":1}\n{"b":2}\n');
  expect(objects).toEqual([{ a: 1 }, { b: 2 }]);
});

test("surfaces each element as soon as it completes", () => {
  const seen = [];
  const parser = createJsonStreamParser({ onObject: (obj) => seen.push(obj) });
  parser.push('[{"first":true}');
  expect(seen).toEqual([{ first: true }]); // available before the stream ends
  parser.push(',{"second":true}]');
  parser.end();
  expect(seen).toHaveLength(2);
});

test("a truncated stream fails with GELIVE004", () => {
  const parser = createJsonStreamParser();
  parser.push('[{"a":1},{"b":');
  let thrown;
  try {
    parser.end();
  } catch (error) {
    thrown = error;
  }
  expect(thrown.code).toBe("GELIVE004");
  expect(thrown.retryable).toBe(true);
});
