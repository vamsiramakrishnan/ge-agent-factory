import { expect, test } from "bun:test";
import { sourceTimestamp } from "./source-clock.js";

test("sourceTimestamp returns GE_SOURCE_DATE verbatim when set (reproducible builds)", () => {
  const prev = process.env.GE_SOURCE_DATE;
  process.env.GE_SOURCE_DATE = "2020-01-02T03:04:05.000Z";
  try {
    expect(sourceTimestamp()).toBe("2020-01-02T03:04:05.000Z");
  } finally {
    if (prev === undefined) delete process.env.GE_SOURCE_DATE;
    else process.env.GE_SOURCE_DATE = prev;
  }
});

test("sourceTimestamp falls back to a valid ISO-8601 timestamp", () => {
  const prev = process.env.GE_SOURCE_DATE;
  delete process.env.GE_SOURCE_DATE;
  try {
    const ts = sourceTimestamp();
    expect(new Date(ts).toISOString()).toBe(ts);
  } finally {
    if (prev !== undefined) process.env.GE_SOURCE_DATE = prev;
  }
});
