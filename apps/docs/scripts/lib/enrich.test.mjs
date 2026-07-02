import { describe, expect, test } from "bun:test";
import { convertCallouts, convertScopeStrip, wrapSteps } from "./enrich.mjs";

const CALLOUTS = {
  note: ":::note",
  tip: ":::tip",
  warning: ":::caution",
  important: ":::danger",
  status: ":::note[Status]",
};

describe("convertCallouts", () => {
  test("converts a column-0 callout to an aside", () => {
    const input = "> Body line one.\n> Body line two.\n{: .note }\n";
    expect(convertCallouts(input, CALLOUTS)).toBe(
      ":::note\nBody line one.\nBody line two.\n:::\n\n",
    );
  });

  test("converts an indented callout inside a list item, keeping the indent", () => {
    const input = "1. **Step.**\n\n   > Gotcha here.\n   {: .warning }\n";
    expect(convertCallouts(input, CALLOUTS)).toBe(
      "1. **Step.**\n\n   :::caution\n   Gotcha here.\n   :::\n\n",
    );
  });

  test("keeps the custom status label", () => {
    const input = "> Cutover stage 2 of 4.\n{: .status }\n";
    expect(convertCallouts(input, CALLOUTS)).toContain(":::note[Status]");
  });

  test("leaves an unknown class alone", () => {
    const input = "> Some quote.\n{: .highlight }\n";
    expect(convertCallouts(input, CALLOUTS)).toBe(input);
  });

  test("leaves a plain blockquote alone", () => {
    const input = "> Just a quote.\n\nNext paragraph.\n";
    expect(convertCallouts(input, CALLOUTS)).toBe(input);
  });
});

describe("convertScopeStrip", () => {
  test("local-only becomes a success Badge", () => {
    const { text, used } = convertScopeStrip(
      "**Scope:** local-only — no cloud project or credentials required.\n",
    );
    expect(used).toBe(true);
    expect(text).toBe(
      '<Badge text="Local-only" variant="success" /> no cloud project or credentials required.\n',
    );
  });

  test("cloud becomes a caution Badge", () => {
    const { text } = convertScopeStrip("**Scope:** cloud — mutates your project.\n");
    expect(text).toContain('<Badge text="Cloud" variant="caution" />');
  });

  test("other labels become a note Badge", () => {
    const { text } = convertScopeStrip("**Scope:** repo change — code + tests only.\n");
    expect(text).toContain('<Badge text="Repo change" variant="note" />');
  });

  test("a wrapped continuation line stays part of the paragraph", () => {
    const { text } = convertScopeStrip(
      "**Scope:** local or remote — remote mode builds in your\nGoogle Cloud project.\n",
    );
    expect(text).toBe(
      '<Badge text="Local or remote" variant="note" /> remote mode builds in your\nGoogle Cloud project.\n',
    );
  });

  test("a line without an em-dash separator is left alone", () => {
    const input = "**Scope:** everything\n";
    const { text, used } = convertScopeStrip(input);
    expect(used).toBe(false);
    expect(text).toBe(input);
  });
});

describe("wrapSteps", () => {
  test("wraps the ordered list of a ## Steps section", () => {
    const input = [
      "## Steps",
      "",
      "1. **First.**",
      "",
      "   indented detail",
      "",
      "2. **Second.**",
      "",
      "## Verify",
      "",
      "Done.",
    ].join("\n");
    const { text, used } = wrapSteps(input);
    expect(used).toBe(true);
    const lines = text.split("\n");
    expect(lines.indexOf("<Steps>")).toBeGreaterThan(lines.indexOf("## Steps"));
    expect(lines.indexOf("<Steps>")).toBeLessThan(lines.indexOf("1. **First.**"));
    expect(lines.indexOf("</Steps>")).toBeGreaterThan(lines.indexOf("2. **Second.**"));
    expect(lines.indexOf("</Steps>")).toBeLessThan(lines.indexOf("## Verify"));
  });

  test("leading non-list content stays outside the wrapper", () => {
    const input = ["## Steps", "", "intro paragraph", "", "1. Go.", "", "## Next"].join("\n");
    const { text } = wrapSteps(input);
    expect(text.indexOf("intro paragraph")).toBeLessThan(text.indexOf("<Steps>"));
  });

  test("a ### sub-heading ends the wrapped run", () => {
    const input = [
      "## Steps",
      "",
      "1. One.",
      "2. Two.",
      "",
      "### Option B",
      "",
      "prose",
      "",
      "## Verify",
    ].join("\n");
    const { text } = wrapSteps(input);
    expect(text.indexOf("</Steps>")).toBeLessThan(text.indexOf("### Option B"));
  });

  test("a page without a Steps section is untouched", () => {
    const input = "## Goal\n\n1. not steps\n";
    const { text, used } = wrapSteps(input);
    expect(used).toBe(false);
    expect(text).toBe(input);
  });
});
