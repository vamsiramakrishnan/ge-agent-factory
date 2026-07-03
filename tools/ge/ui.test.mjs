// Tests for the terminal design kit (tools/ge/ui.mjs): computed alignment,
// the single next-step shape, glyph→ramp fidelity, table width math, and
// NO_COLOR degradation. Run with NO_COLOR=1 to exercise the stripped path
// explicitly — the assertions here strip ANSI first so they hold either way.
import { describe, expect, test } from "bun:test";
import pc from "picocolors";
import { STATUS_RAMP } from "@ge/design/status-ramp";
import {
  title, section, divider, kv, next, nextList, fixLine,
  glyph, statusWord, cmd, columns, stripAnsi, visibleWidth, padVisible,
} from "./ui.mjs";

describe("kv — the computed label column", () => {
  test("aligns every value to the longest key in the block", () => {
    const block = stripAnsi(kv([["mode", "local"], ["project", "my-project"], ["app", "<unset>"]]));
    const lines = block.split("\n");
    // Values all start at the same column: 2 indent + len("project") + 3 gap.
    const valueCol = 2 + "project".length + 3;
    expect(lines[0].slice(valueCol)).toBe("local");
    expect(lines[1].slice(valueCol)).toBe("my-project");
    expect(lines[2].slice(valueCol)).toBe("<unset>");
  });

  test("measures pre-colored keys and values by visible width, not byte length", () => {
    const block = stripAnsi(kv([["status", pc.green("passed")], ["id", pc.cyan("run-1")]]));
    const lines = block.split("\n");
    expect(lines[0]).toBe("  status   passed");
    expect(lines[1]).toBe("  id       run-1");
  });

  test("skips falsy rows so callers can inline conditionals", () => {
    const block = stripAnsi(kv([["a", "1"], false, undefined, ["b", "2"]]));
    expect(block.split("\n")).toHaveLength(2);
  });

  test("a glyph column appears only when some row carries a glyph", () => {
    const plain = stripAnsi(kv([["k", "v"]]));
    const withGlyph = stripAnsi(kv([{ key: "k", value: "v", glyph: "passed" }, ["m", "w"]]));
    expect(plain).toBe("  k   v");
    expect(withGlyph.split("\n")[0]).toBe("  ✓ k   v");
    expect(withGlyph.split("\n")[1]).toBe("    m   w"); // glyph-less row keeps the column
  });
});

describe("next — the single next-step affordance", () => {
  test("one shape: leading blank line, 'next', cyan command, dim note", () => {
    const line = next("ge prove", "prove it");
    expect(stripAnsi(line)).toBe("\n  next  ge prove   (prove it)");
    if (pc.isColorSupported) {
      expect(line).toContain(pc.cyan("ge prove"));
      expect(line).toContain(pc.dim("(prove it)"));
    }
  });

  test("note is optional", () => {
    expect(stripAnsi(next("ge init"))).toBe("\n  next  ge init");
  });

  test("nextList aligns notes after the longest command, $-prefixed", () => {
    const block = stripAnsi(nextList([
      { command: "ge agents resume", note: "retry" },
      { command: "ge ledger plan", note: "re-check" },
    ]));
    const lines = block.split("\n");
    expect(lines[0]).toBe("  $ ge agents resume   retry");
    expect(lines[1]).toBe("  $ ge ledger plan     re-check");
    expect(stripAnsi(nextList(["ge up"]))).toBe("  $ ge up");
  });
});

describe("glyph — pinned to the shared status ramp", () => {
  const shapes = { passed: "✓", failed: "✗", blocked: "⊘", warning: "▲", running: "●", queued: "○", repairing: "◆" };
  for (const [tone, shape] of Object.entries(shapes)) {
    test(`${tone} renders ${shape} in the ramp's ansi color`, () => {
      expect(glyph(tone)).toBe(pc[STATUS_RAMP[tone].ansi](shape));
    });
  }

  test("loose operator spellings resolve through the ramp aliases", () => {
    expect(glyph("pass")).toBe(glyph("passed"));
    expect(glyph("warn")).toBe(glyph("warning"));
    expect(glyph("fail")).toBe(glyph("failed"));
    expect(glyph("done")).toBe(glyph("passed"));
    expect(glyph("totally-unknown")).toBe(glyph("warning")); // visible, not alarming
  });

  test("statusWord paints the status via the ramp and never drops the word", () => {
    expect(statusWord("failed")).toBe(pc.red("failed"));
    expect(statusWord("")).toBe(pc[STATUS_RAMP.warning.ansi]("unknown"));
  });
});

describe("columns — computed table widths", () => {
  const rows = [
    { status: pc.green("done"), id: "run-abcdef", detail: "3/3 ok" },
    { status: pc.red("failed"), id: "r2", detail: "" },
  ];
  const spec = [
    { header: "status", value: (r) => r.status },
    { header: "id", value: (r) => r.id },
    { header: "detail", value: (r) => r.detail },
  ];

  test("each column is as wide as its widest cell or header (ANSI ignored)", () => {
    const lines = stripAnsi(columns(rows, spec)).split("\n");
    expect(lines[0]).toBe("  status  id          detail");
    expect(lines[1]).toBe("  done    run-abcdef  3/3 ok");
    expect(lines[2]).toBe("  failed  r2"); // last column never pads → no trailing spaces
  });

  test("headerless specs skip the header row", () => {
    const lines = stripAnsi(columns(rows, spec.map((c) => ({ ...c, header: "" })))).split("\n");
    expect(lines).toHaveLength(2);
    expect(lines[0]).toBe("  done    run-abcdef  3/3 ok");
  });
});

describe("screen anatomy", () => {
  test("title: leading blank line, bold text, dim — context", () => {
    expect(stripAnsi(title("Doctor", "proj (region)"))).toBe("\nDoctor — proj (region)");
    expect(stripAnsi(title("Prove"))).toBe("\nProve");
  });

  test("section: leading blank line, indented heading, optional suffix", () => {
    expect(stripAnsi(section("Items"))).toBe("\n  Items");
    expect(stripAnsi(section("toolchain", "(3 fail)"))).toBe("\n  toolchain  (3 fail)");
  });

  test("divider: one rule style, labeled or plain, constant width", () => {
    const labeled = stripAnsi(divider("Operate"));
    const plain = stripAnsi(divider());
    expect(labeled).toBe(`\n  ── Operate ${"─".repeat(56 - "Operate".length - 4)}`);
    expect(plain).toBe(`\n  ${"─".repeat(56)}`);
  });

  test("fixLine matches the guarded() DxError affordance shape", () => {
    expect(stripAnsi(fixLine("mise run setup", 4))).toBe("    fix: mise run setup");
  });
});

describe("NO_COLOR / non-TTY degradation", () => {
  test("when picocolors disables color, kit output carries no ANSI escapes", () => {
    // Under NO_COLOR=1 (how the suite runs in CI shells) picocolors is a
    // pass-through, so the raw output must already be byte-clean.
    if (pc.isColorSupported) return; // colored terminal: covered by stripAnsi asserts above
    const sample = [
      title("T", "c"), section("S"), divider("L"),
      kv([{ key: "k", value: "v", glyph: "passed" }]),
      next("ge up", "note"), nextList(["ge up"]),
      glyph("failed"), statusWord("running"), cmd("ge doctor"),
      columns([{ a: "x" }], [{ header: "a", value: (r) => r.a }]),
    ].join("\n");
    expect(sample).toBe(stripAnsi(sample));
  });

  test("width helpers agree with each other", () => {
    const colored = pc.red("abc");
    expect(visibleWidth(colored)).toBe(3);
    expect(stripAnsi(padVisible(colored, 5))).toBe("abc  ");
  });
});
