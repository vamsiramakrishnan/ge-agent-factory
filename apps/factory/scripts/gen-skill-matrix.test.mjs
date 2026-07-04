// Tests for apps/factory/scripts/gen-skill-matrix.mjs — the generator that
// renders the factory-line skill matrix into skills/README.md and
// docs/reference/architecture.md from skill-routing.json,
// FACTORY_SKILL_BINDINGS, and the shared command registry.
import { test, expect } from "bun:test";
import { appendFileSync, mkdirSync, mkdtempSync, readFileSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import {
  BEGIN,
  END,
  applyRegion,
  loadRegistry,
  loadSources,
  renderMatrix,
  splitRegion,
  validateSources,
} from "./gen-skill-matrix.mjs";
import { FACTORY_SKILL_BINDINGS } from "../src/skill-registry.js";

const HERE = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = join(HERE, "..", "..", "..");

// A tiny fake registry — same per-entry shape (id → { cli }) as GE_COMMANDS.
const FAKE_REGISTRY = { "widget.spin": { cli: "ge widget spin" } };

// Minimal fixture repo: one skill, one JS package (with a README row), one
// package-json-less dir (must be ignored by parity), one doc file.
function makeFixture({ routingEntry = {}, extraSetup } = {}) {
  const root = mkdtempSync(join(tmpdir(), "gen-skill-matrix-"));
  mkdirSync(join(root, "skills", "alpha-skill"), { recursive: true });
  writeFileSync(join(root, "skills", "alpha-skill", "SKILL.md"), "# alpha\n");
  mkdirSync(join(root, "packages", "widget"), { recursive: true });
  writeFileSync(join(root, "packages", "widget", "package.json"), JSON.stringify({ name: "@ge/widget" }));
  mkdirSync(join(root, "packages", "python-only"), { recursive: true }); // no package.json
  writeFileSync(
    join(root, "packages", "README.md"),
    "| Package | Purpose |\n|---|---|\n| [`widget`](widget) | spins |\n",
  );
  mkdirSync(join(root, "docs", "reference"), { recursive: true });
  writeFileSync(join(root, "docs", "reference", "widget.md"), "# widget\n");
  writeFileSync(
    join(root, "skills", "skill-routing.json"),
    JSON.stringify({ schemaVersion: 1, skills: { "alpha-skill": routingEntry } }),
  );
  if (extraSetup) extraSetup(root);
  return root;
}

function violationsFor(root, { bindings = [] } = {}) {
  const sources = loadSources(root);
  return validateSources({
    root,
    ...sources,
    registryIds: new Set(Object.keys(FAKE_REGISTRY)),
    bindings,
  });
}

test("a fully-valid fixture produces zero violations", () => {
  const root = makeFixture({
    routingEntry: {
      commands: ["widget.spin"],
      engines: ["@ge/widget"],
      docs: ["docs/reference/widget.md"],
    },
  });
  expect(violationsFor(root)).toEqual([]);
});

test("validation catches an engine name no packages/*/package.json declares", () => {
  const root = makeFixture({ routingEntry: { engines: ["@ge/nonexistent"] } });
  const violations = violationsFor(root);
  expect(violations.length).toBe(1);
  expect(violations[0]).toContain("@ge/nonexistent");
  expect(violations[0]).toContain("alpha-skill");
});

test("validation catches a command id that is not a registry key", () => {
  const root = makeFixture({ routingEntry: { commands: ["widget.spin", "no.such.command"] } });
  const violations = violationsFor(root);
  expect(violations.length).toBe(1);
  expect(violations[0]).toContain("no.such.command");
  expect(violations[0]).toContain("ge-command-registry");
});

test("validation catches a docs path that does not exist", () => {
  const root = makeFixture({ routingEntry: { docs: ["docs/reference/missing.md"] } });
  const violations = violationsFor(root);
  expect(violations.length).toBe(1);
  expect(violations[0]).toContain("docs/reference/missing.md");
});

test("validation catches a routing skill id without a SKILL.md", () => {
  const root = makeFixture({
    extraSetup: (r) => {
      const routing = JSON.parse(readFileSync(join(r, "skills", "skill-routing.json"), "utf8"));
      routing.skills["ghost-skill"] = {};
      writeFileSync(join(r, "skills", "skill-routing.json"), JSON.stringify(routing));
    },
  });
  const violations = violationsFor(root);
  expect(violations.length).toBe(1);
  expect(violations[0]).toContain("ghost-skill");
});

test("validation catches a packages/<dir> with package.json but no packages/README.md row", () => {
  const root = makeFixture({
    extraSetup: (r) => {
      mkdirSync(join(r, "packages", "gadget"), { recursive: true });
      writeFileSync(join(r, "packages", "gadget", "package.json"), JSON.stringify({ name: "@ge/gadget" }));
    },
  });
  const violations = violationsFor(root);
  expect(violations.length).toBe(1);
  expect(violations[0]).toContain("packages/gadget");
  expect(violations[0]).toContain("packages/README.md");
});

test("validation catches a FACTORY_SKILL_BINDINGS entry whose skill dir is missing", () => {
  const root = makeFixture();
  const violations = violationsFor(root, {
    bindings: [
      { capability: "alpha_capability", stages: ["plan"], skill: "alpha-skill" },
      { capability: "ghost_capability", stages: ["plan"], skill: "ghost-binding-no-dir" },
    ],
  });
  expect(violations.length).toBe(1);
  expect(violations[0]).toContain("ghost-binding-no-dir");
  expect(violations[0]).toContain("FACTORY_SKILL_BINDINGS");
});

test("validation catches a packages/README.md row whose package dir is gone", () => {
  const root = makeFixture({
    extraSetup: (r) => {
      appendFileSync(join(r, "packages", "README.md"), "| [`ghost-package`](ghost-package) | deleted long ago |\n");
    },
  });
  const violations = violationsFor(root);
  expect(violations.length).toBe(1);
  expect(violations[0]).toContain("ghost-package");
  expect(violations[0]).toContain("stale row");
});

test("a packages/README.md row for a dir without package.json (e.g. a Python package) is fine", () => {
  const root = makeFixture({
    extraSetup: (r) => {
      appendFileSync(join(r, "packages", "README.md"), "| [`python-only`](python-only) | python things |\n");
    },
  });
  expect(violationsFor(root)).toEqual([]);
});

test("rendering is deterministic and links relative to each target dir", () => {
  const root = makeFixture({
    routingEntry: {
      commands: ["widget.spin"],
      engines: ["@ge/widget"],
      docs: ["docs/reference/widget.md"],
    },
  });
  const sources = loadSources(root);
  const render = (targetDir) =>
    renderMatrix({ ...sources, registry: FAKE_REGISTRY, bindings: [], targetDir });
  expect(render("skills")).toBe(render("skills")); // byte-identical on re-run
  const fromSkills = render("skills");
  expect(fromSkills).toContain("[`alpha-skill`](alpha-skill/)");
  expect(fromSkills).toContain("`ge widget spin`");
  expect(fromSkills).toContain("[`@ge/widget`](../packages/widget/)");
  expect(fromSkills).toContain("[`widget.md`](../docs/reference/widget.md)");
  const fromDocs = render("docs/reference");
  expect(fromDocs).toContain("[`alpha-skill`](../../skills/alpha-skill/)");
  expect(fromDocs).toContain("[`@ge/widget`](../../packages/widget/)");
  expect(fromDocs).toContain("[`widget.md`](widget.md)");
});

test("a skill without routing fields renders em dashes, never invented prose", () => {
  const root = makeFixture(); // empty routing entry, no bindings
  const sources = loadSources(root);
  const region = renderMatrix({ ...sources, registry: FAKE_REGISTRY, bindings: [], targetDir: "skills" });
  expect(region).toContain("| — | — | — | — |");
});

test("bindings drive ordering and capability; unbound skills go last alphabetically", () => {
  const root = makeFixture({
    extraSetup: (r) => {
      for (const id of ["zeta-skill", "beta-skill"]) {
        mkdirSync(join(r, "skills", id), { recursive: true });
        writeFileSync(join(r, "skills", id, "SKILL.md"), `# ${id}\n`);
      }
    },
  });
  const sources = loadSources(root);
  const region = renderMatrix({
    ...sources,
    registry: FAKE_REGISTRY,
    bindings: [{ capability: "zeta_cap", stages: [], skill: "zeta-skill" }],
    targetDir: "skills",
  });
  const rowOrder = region
    .split("\n")
    .filter((l) => l.startsWith("| [`"))
    .map((l) => l.match(/\[`([^`]+)`\]/)[1]);
  expect(rowOrder).toEqual(["zeta-skill", "alpha-skill", "beta-skill"]);
  expect(region).toContain("`zeta_cap`");
});

test("check-mode comparison detects a mutated region", () => {
  const generated = "| Station skill | Capability | `ge` commands | Engine packages | Reference docs |";
  const doc = `intro\n\n${BEGIN}\n${END}\n\noutro\n`;
  const fresh = applyRegion(doc, generated, "fixture.md");
  expect(splitRegion(fresh, "fixture.md").region).toBe(generated); // not stale
  const mutated = fresh.replace("Capability", "Vibes");
  expect(splitRegion(mutated, "fixture.md").region).not.toBe(generated); // stale
  // Prose outside the markers survives a rewrite untouched.
  expect(applyRegion(mutated, generated, "fixture.md")).toBe(fresh);
});

test("checked-in regions in both target files match the live sources (no drift)", async () => {
  const sources = loadSources(REPO_ROOT);
  const registry = await loadRegistry(REPO_ROOT);
  for (const target of [
    { rel: "skills/README.md", dir: "skills" },
    { rel: "docs/reference/architecture.md", dir: "docs/reference" },
  ]) {
    const doc = readFileSync(join(REPO_ROOT, ...target.rel.split("/")), "utf8");
    const { region } = splitRegion(doc, target.rel);
    const generated = renderMatrix({
      ...sources,
      registry,
      bindings: FACTORY_SKILL_BINDINGS,
      targetDir: target.dir,
    });
    expect(region).toBe(generated);
  }
});
