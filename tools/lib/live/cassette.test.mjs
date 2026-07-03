// Cassette contract: record → replay is lossless (chunks, order, timing
// offsets), and malformed cassettes fail with GELIVE004, never a bare throw.
import { test, expect } from "bun:test";
import { mkdtempSync, readFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { parseCassette, readCassette, createCassetteRecorder, createCassetteRunner } from "./cassette.mjs";

const FIXTURES = join(dirname(fileURLToPath(import.meta.url)), "fixtures");
const SUCCESS = join(FIXTURES, "success.ndjson");

test("reads the success fixture: meta + two contiguous turns with offsets", () => {
  const cassette = readCassette(SUCCESS);
  expect(cassette.meta.version).toBe(1);
  expect(cassette.meta.target.engine).toContain("engines/benefits-engine");
  expect(cassette.turns).toHaveLength(2);
  expect(cassette.turns[0].request.session).toBe(null);
  expect(cassette.turns[1].request.session).toContain("/sessions/abc123");
  expect(cassette.turns[0].chunks.map((chunk) => chunk.atMs)).toEqual([0, 412, 610, 1240]);
});

test("runner replays recorded chunks verbatim and errors past the end", async () => {
  const runner = createCassetteRunner(SUCCESS);
  expect(runner.kind).toBe("cassette");
  expect(runner.turnCount).toBe(2);
  const { chunks } = await runner.runTurn({ index: 0, text: "anything", session: null });
  expect(chunks[3].json.sessionInfo.session).toContain("/sessions/abc123");
  let thrown;
  try {
    await runner.runTurn({ index: 5, text: "x", session: null });
  } catch (error) {
    thrown = error;
  }
  expect(thrown.code).toBe("GELIVE004");
});

test("loop mode wraps turn indexes for load replay", async () => {
  const runner = createCassetteRunner(SUCCESS, { loop: true });
  const direct = await runner.runTurn({ index: 0 });
  const wrapped = await runner.runTurn({ index: 4 }); // 4 % 2 = 0
  expect(wrapped.chunks).toEqual(direct.chunks);
});

test("recorder round-trips through the reader", () => {
  const dir = mkdtempSync(join(tmpdir(), "ge-cassette-"));
  const path = join(dir, "recorded.ndjson");
  const recorder = createCassetteRecorder(path, { target: { engine: "e" }, recordedAt: "2026-01-01T00:00:00.000Z" });
  recorder.request(0, null, { query: { text: "hi" } });
  recorder.chunk(0, 0, { answer: { state: "IN_PROGRESS", replies: [] } });
  recorder.chunk(0, 300, { answer: { state: "SUCCEEDED" }, sessionInfo: { session: "s1" } });
  recorder.request(1, "s1", { query: { text: "again" }, session: "s1" });
  recorder.chunk(1, 0, { answer: { state: "SUCCEEDED" } });
  const cassette = readCassette(path);
  expect(cassette.turns).toHaveLength(2);
  expect(cassette.turns[0].chunks[1].atMs).toBe(300);
  expect(cassette.turns[1].request.session).toBe("s1");
  // NDJSON on disk: first line is the meta record.
  expect(JSON.parse(readFileSync(path, "utf8").split("\n")[0]).type).toBe("meta");
});

test("malformed cassettes fail with GELIVE004", () => {
  expect(() => parseCassette("not json\n")).toThrow(/not valid JSON/);
  expect(() => parseCassette('{"type":"request","turn":0,"body":{}}\n')).toThrow(/no meta record/);
  let thrown;
  try {
    parseCassette('{"type":"meta","version":1}\n{"type":"chunk","turn":0,"atMs":0,"json":{}}\n');
  } catch (error) {
    thrown = error;
  }
  expect(thrown.code).toBe("GELIVE004");
  expect(thrown.what).toContain("before its request");
});

test("unknown record types are skipped for forward compatibility", () => {
  const cassette = parseCassette('{"type":"meta","version":1}\n{"type":"annotation","note":"future"}\n{"type":"request","turn":0,"session":null,"body":{}}\n');
  expect(cassette.turns).toHaveLength(1);
});
