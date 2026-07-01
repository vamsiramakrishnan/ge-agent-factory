import { describe, expect, test } from "bun:test";
import {
  bucketTestResults,
  failingTestNamesFromJUnit,
  formatTestResultsReport,
  fullTestName,
  parseJUnitTestcases,
} from "./test-results.mjs";

// Synthetic JUnit fixtures modeled on real `bun test --reporter=junit` output:
// nested <testsuite> per describe() block, <testcase classname="..."> for tests
// inside a describe(), <testcase classname=""> for top-level tests, and either
// self-closing tags (pass) or <failure>/<error> children (fail).
const SAMPLE_XML = `<?xml version="1.0" encoding="UTF-8"?>
<testsuites name="bun test" tests="5" assertions="5" failures="2" skipped="0" time="1.0">
  <testsuite name="tools/lib/example.test.mjs" file="tools/lib/example.test.mjs" tests="5" assertions="5" failures="2" skipped="0" time="1.0" hostname="vm">
    <testcase name="top level passes" classname="" time="0.001" file="tools/lib/example.test.mjs" line="1" assertions="1" />
    <testcase name="top level fails" classname="" time="0.001" file="tools/lib/example.test.mjs" line="2" assertions="1">
      <failure type="AssertionError" />
    </testcase>
    <testsuite name="grouped describe" file="tools/lib/example.test.mjs" line="5" tests="3" assertions="3" failures="1" skipped="0" time="0.5" hostname="vm">
      <testcase name="passes in group" classname="grouped describe" time="0.001" file="tools/lib/example.test.mjs" line="6" assertions="1" />
      <testcase name="fails in group" classname="grouped describe" time="0.001" file="tools/lib/example.test.mjs" line="7" assertions="1">
        <error type="Error" />
      </testcase>
      <testcase name="ampersand &amp; &lt;bracket&gt; name" classname="grouped describe" time="0.001" file="tools/lib/example.test.mjs" line="8" assertions="1" />
    </testsuite>
  </testsuite>
</testsuites>
`;

describe("parseJUnitTestcases", () => {
  test("extracts every testcase with name, classname, and pass/fail status", () => {
    const cases = parseJUnitTestcases(SAMPLE_XML);
    expect(cases).toHaveLength(5);
    expect(cases).toContainEqual({ name: "top level passes", classname: "", failed: false });
    expect(cases).toContainEqual({ name: "top level fails", classname: "", failed: true });
    expect(cases).toContainEqual({ name: "passes in group", classname: "grouped describe", failed: false });
    expect(cases).toContainEqual({ name: "fails in group", classname: "grouped describe", failed: true });
  });

  test("decodes XML entities in names", () => {
    const cases = parseJUnitTestcases(SAMPLE_XML);
    const decoded = cases.find((c) => c.name.includes("ampersand"));
    expect(decoded.name).toBe('ampersand & <bracket> name');
  });

  test("returns an empty list for XML with no testcases", () => {
    expect(parseJUnitTestcases("<testsuites></testsuites>")).toEqual([]);
  });
});

describe("fullTestName", () => {
  test("joins classname and name with ' > ' when classname is non-empty", () => {
    expect(fullTestName({ classname: "grouped describe", name: "fails in group" })).toBe(
      "grouped describe > fails in group",
    );
  });

  test("returns just the name when classname is empty", () => {
    expect(fullTestName({ classname: "", name: "top level fails" })).toBe("top level fails");
  });
});

describe("failingTestNamesFromJUnit", () => {
  test("returns full names of only the failing/erroring testcases", () => {
    const names = failingTestNamesFromJUnit(SAMPLE_XML);
    expect(names.sort()).toEqual(["grouped describe > fails in group", "top level fails"].sort());
  });

  test("returns an empty list when nothing failed", () => {
    const xml = SAMPLE_XML.replace(/<failure[^/]*\/>/, "").replace(/<error[^/]*\/>/, "");
    // Even with the failure/error tags stripped, the testcase elements still
    // have closing tags around now-empty bodies, so they should read as passing.
    const names = failingTestNamesFromJUnit(xml);
    expect(names).toEqual([]);
  });
});

describe("bucketTestResults", () => {
  test("all actual failures are known -> ok, everything in stillFailing", () => {
    const result = bucketTestResults(["a", "b"], ["a", "b", "c"]);
    expect(result.ok).toBe(true);
    expect(result.newlyFailing).toEqual([]);
    expect(result.stillFailing).toEqual(["a", "b"]);
    expect(result.nowPassing).toEqual(["c"]);
  });

  test("an unrecognized failure is a regression -> not ok", () => {
    const result = bucketTestResults(["a", "new regression"], ["a"]);
    expect(result.ok).toBe(false);
    expect(result.newlyFailing).toEqual(["new regression"]);
    expect(result.stillFailing).toEqual(["a"]);
    expect(result.nowPassing).toEqual([]);
  });

  test("no actual failures and a stale known list -> ok, everything nowPassing", () => {
    const result = bucketTestResults([], ["a", "b"]);
    expect(result.ok).toBe(true);
    expect(result.newlyFailing).toEqual([]);
    expect(result.stillFailing).toEqual([]);
    expect(result.nowPassing).toEqual(["a", "b"]);
  });

  test("empty actual and empty known -> ok, all buckets empty", () => {
    const result = bucketTestResults([], []);
    expect(result).toEqual({ ok: true, newlyFailing: [], stillFailing: [], nowPassing: [] });
  });

  test("buckets are sorted for deterministic output", () => {
    const result = bucketTestResults(["z", "a"], ["z", "a"]);
    expect(result.stillFailing).toEqual(["a", "z"]);
  });
});

describe("formatTestResultsReport", () => {
  test("reports a clean pass with no known failures section noise", () => {
    const text = formatTestResultsReport(bucketTestResults([], []));
    expect(text).toContain("no newly failing tests");
    expect(text).toContain("0 known-failing test(s) still failing");
    expect(text).not.toContain("now passing");
  });

  test("flags newly failing tests distinctly from known ones", () => {
    const text = formatTestResultsReport(bucketTestResults(["known-one", "surprise"], ["known-one"]));
    expect(text).toContain("1 newly failing test(s)");
    expect(text).toContain("surprise");
    expect(text).toContain("1 known-failing test(s) still failing");
    expect(text).toContain("known-one");
  });

  test("flags stale known-failures entries that are now passing", () => {
    const text = formatTestResultsReport(bucketTestResults([], ["fixed-now"]));
    expect(text).toContain("now passing");
    expect(text).toContain("fixed-now");
  });
});
