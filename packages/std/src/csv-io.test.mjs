import { describe, expect, test } from "bun:test";
import { toCsv, parseCsv } from "./csv-io.mjs";

describe("toCsv", () => {
  test("header + rows, trailing newline", () => {
    expect(toCsv([{ a: 1, b: "x" }, { a: 2, b: "y" }])).toBe("a,b\n1,x\n2,y\n");
  });
  test("empty rows -> empty string", () => {
    expect(toCsv([])).toBe("");
  });
  test("null/undefined -> empty cell; quotes fields with , \" or newline", () => {
    expect(toCsv([{ a: null, b: undefined, c: "has,comma", d: 'q"q', e: "li\nne" }]))
      .toBe('a,b,c,d,e\n,,"has,comma","q""q","li\nne"\n');
  });
});

describe("parseCsv", () => {
  test("round-trips simple rows", () => {
    expect(parseCsv("a,b\n1,x\n2,y\n")).toEqual([{ a: "1", b: "x" }, { a: "2", b: "y" }]);
  });
  test("handles quoted commas, doubled quotes, embedded newlines, CRLF", () => {
    const csv = 'name,note\r\n"Doe, Jane","said ""hi""\nthere"\r\n';
    expect(parseCsv(csv)).toEqual([{ name: "Doe, Jane", note: 'said "hi"\nthere' }]);
  });
  test("toCsv -> parseCsv round-trip preserves values (as strings)", () => {
    const rows = [{ id: "1", label: "a,b", note: 'x"y' }, { id: "2", label: "plain", note: "" }];
    expect(parseCsv(toCsv(rows))).toEqual(rows);
  });
});
