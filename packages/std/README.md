# @ge/std

Neutral leaf utilities shared across `apps/*`, `tools/*`, and `packages/*`. This
package has zero dependencies on anything in `apps` or `tools`, so it can be
imported from anywhere in the repo without creating a layering cycle.

**Check here before you hand-roll a utility.** Every module below was extracted
specifically to stop a piece of logic that had been copy-pasted, slightly
differently, across several call sites (`gcp-config` and `merge` alone replaced
close to ten independent hand-rolled copies this session). If you're about to
write a slug function, a snake_case helper, an atomic JSON writer, a CLI flag
parser, or a "resolve the GCP project id" fallback chain — it very likely
already exists here. Grep this file first.

Import the whole barrel (`import { snakeCase } from "@ge/std"`) or a single
subpath module (`import { snakeCase } from "@ge/std/naming"`) — both resolve to
the same code; the subpath imports just avoid pulling in modules you don't use.

> **Staleness note:** this catalog documents the 8 modules that exist as of this
> writing. Other work may land new modules (e.g. a `spec-gaps` export) without
> this README being updated in the same change — if a module you expect isn't
> listed here, check `packages/std/package.json`'s `exports` map directly.

## Modules

### `naming` — `@ge/std/naming`

Case conversion and identifier-safe naming: snake_case, slugs, title case, and
name-shortening for systems (Python identifiers, agents-cli project names)
that enforce length/character constraints.

- `snakeCase(value): string` — canonical snake_case via `change-case`; the single implementation the whole repo should use for this.
  ```js
  snakeCase("Salesforce CRM"); // "salesforce_crm"
  ```
- `slug(value, { max = Infinity, fallback = "", allow = "" } = {}): string` — hyphenated identifier slug (lowercase, non-`[a-z0-9]` runs collapsed to `-`, trimmed, length-capped). Not a URL slugifier — deliberately does not transliterate/strip characters, since these values are often persisted as registry keys.
  ```js
  slug("Acme & Co.", { allow: "." }); // "acme-co."
  ```
- `titleCase(value): string` — turns `snake_case`/`kebab-case` into `Title Case` words.
  ```js
  titleCase("gl_entries"); // "Gl Entries"
  ```
- `canonicalSystemId(systemName): string` — snake_cases a system name, defaulting to `"source_system"` when empty.
  ```js
  canonicalSystemId("Workday HCM"); // "workday_hcm"
  ```
- `safePyName(value, fallback = "value"): string` — snake_cases `value` and prefixes an underscore if the result doesn't start with a letter/underscore, so it's always a legal Python identifier tail.
  ```js
  safePyName("2fa_token"); // "_2fa_token"
  ```
- `validPythonIdentifierName(value, fallback = "agent"): string` — like `safePyName`, but prefixes with `agent_` (not just `_`) when the snake_cased value would be invalid.
  ```js
  validPythonIdentifierName("3rd-party-risk"); // "agent_3rd_party_risk"
  ```
- `shortAgentName(value, { maxLen = 26, fallback = "agent" } = {}): string` — a valid, deterministic, collision-resistant Python identifier truncated to `maxLen` chars (default 26, matching agents-cli's project-name cap), with a 6-hex-char content hash appended when truncation was needed so two long ids that share a prefix don't collide.
  ```js
  shortAgentName("workday_compensation_review_escalation_agent"); // "workday_compensatio_897878"
  ```

### `cli-args` — `@ge/std/cli-args`

Minimal `--flag value` / `--flag` argv parsing for the repo's `.mjs` CLI
scripts (not a full parser like `citty` — this is the lightweight parser used
by scripts that don't need subcommand schemas).

- `parseFlagArgs(argv = [], { bareValue = "true" } = {}): { positional: string[], flags: object }` — splits argv into positional args and `--key value` / `--key` (boolean-ish, using `bareValue`) flags.
  ```js
  parseFlagArgs(["build", "--force", "--out", "dist"]);
  // { positional: ["build"], flags: { force: "true", out: "dist" } }
  ```
- `parseCommandArgs(argv = [], defaultCommand = "help", options = {}): { command: string, flags: object }` — same parsing, but treats the first positional as a `command`, defaulting when absent.
  ```js
  parseCommandArgs(["deploy", "--env", "prod"]); // { command: "deploy", flags: { env: "prod" } }
  ```
- `boolFlag(flags, key, fallback = false): boolean` — reads a flag as a boolean, treating the strings `"0"`, `"false"`, `"no"`, `"off"` as `false` and everything else (including bare `true`) as `true`.
  ```js
  boolFlag({ verbose: "true" }, "verbose"); // true
  ```

### `json-io` — `@ge/std/json-io`

Safe/atomic JSON file I/O: read-with-fallback (sync and async), atomic
temp-file-then-rename writes, and a cross-process-safe read-modify-write.

- `readJson(path, fallback = null): any` — reads and parses JSON synchronously, returning `fallback` on any missing file, read error, or parse error (never throws).
  ```js
  readJson("state.json", {}); // {} if the file doesn't exist or is corrupt
  ```
- `readJsonAsync(path, fallback = null, { rethrowUnexpected = false } = {}): Promise<any>` — async counterpart of `readJson`; pass `rethrowUnexpected: true` to re-throw non-ENOENT errors instead of swallowing them.
  ```js
  await readJsonAsync("manifest.json", null, { rethrowUnexpected: true });
  ```
- `writeJson(path, value, { mode } = {}): void` — atomic write: serializes to a sibling temp file, `fsync`s, then renames over the target, so a crash mid-write never leaves a truncated file.
  ```js
  writeJson("out/manifest.json", { id: "abc" });
  ```
- `updateJson(path, updater, { fallback = null, mode } = {}): Promise<any>` — atomic read-modify-write; `updater(current)` returns the next value, which is written atomically. Serializes concurrent callers (in-process via a promise chain, cross-process via an advisory lockfile) so updates are never lost.
  ```js
  await updateJson("counts.json", (current) => ({ ...current, n: (current?.n ?? 0) + 1 }), { fallback: {} });
  ```

### `json-repair` — `@ge/std/json-repair`

Lenient JSON parsing for LLM output: tolerates trailing commas, unquoted
keys, smart quotes, code fences, prose wrapping, and truncated tails.

- `parseLooseJson(candidate): any` — runs the candidate string through `jsonrepair` before `JSON.parse`, fixing common LLM JSON syntax slop.
  ```js
  parseLooseJson("{name: 'Ada',}"); // { name: "Ada" }
  ```
- `extractFirstJsonObject(text): any` — finds the first balanced (or truncated-but-repairable) `{ ... }` object in raw or fenced/prose-wrapped LLM text and parses it leniently. Throws if no `{` is found at all — callers rely on that exception to detect genuinely malformed output.
  ```js
  extractFirstJsonObject("Sure, here you go:\n```json\n{\"ok\": true}\n```"); // { ok: true }
  ```

### `csv-io` — `@ge/std/csv-io`

Dependency-free RFC4180-ish CSV read/write for the simulator-seed pipeline.
Hand-rolled on purpose: output bytes are consumed by Python's
`csv.DictReader` and gated by golden-file diffs, so swapping in a library is
deferred behind that byte-stability gate.

- `toCsv(rows): string` — serializes an array of same-shaped objects (header row from `Object.keys(rows[0])`) to a CSV string with a trailing newline; quotes fields containing `,`, `"`, or `\n`.
  ```js
  toCsv([{ a: 1, b: "x" }, { a: 2, b: "y" }]); // "a,b\n1,x\n2,y\n"
  ```
- `parseCsv(text): object[]` — parses a CSV string (first row as headers) back into an array of objects; round-trips with `toCsv` (values come back as strings).
  ```js
  parseCsv("a,b\n1,x\n2,y\n"); // [{ a: "1", b: "x" }, { a: "2", b: "y" }]
  ```

### `list` — `@ge/std/list`

- `parseList(value, sep = ","): string[]` — splits a delimited string into a trimmed, empty-entry-free array; replaces the `s.split(sep).map(x => x.trim()).filter(Boolean)` idiom that recurred roughly 30 times across env-var/flag handling. A `null`/`undefined` input yields `[]` instead of throwing.
  ```js
  parseList("a, b ,  c "); // ["a", "b", "c"]
  ```

### `gcp-config` — `@ge/std/gcp-config`

Centralized GCP project-ID resolution. Before this existed, roughly seven
call sites across `apps/factory`, `apps/console`, `packages/run-ledger`, and
`tools/lib` each hand-rolled a slightly different `||` fallback chain over
`GOOGLE_CLOUD_PROJECT` / `GCLOUD_PROJECT` / assorted service-specific env
vars — a real latent-bug surface, since different services could resolve
"the project" differently for what is conceptually one setting.

- `resolveGcpProject({ explicit = null, env = process.env, fallbackEnvVars = [] } = {}): string | null` — precedence: `explicit` (a CLI flag or param) wins, then `GOOGLE_CLOUD_PROJECT`, then `GCLOUD_PROJECT`, then each name in `fallbackEnvVars` in order (for call-site-specific legacy vars like `GE_PROJECT`).
  ```js
  resolveGcpProject({ fallbackEnvVars: ["GE_PROJECT", "FIREBASE_PROJECT_ID"] });
  ```

### `merge` — `@ge/std/merge`

- `mergeByKey(existingItems = [], nextItems = [], keyFn, mergeFn = (existing, next) => ({ ...existing, ...next })): object[]` — merges two arrays-of-objects into one, keyed by `keyFn(item)`. Items only on the existing side pass through unchanged; items in `nextItems` are combined with any existing match via `mergeFn` (default: next's fields win, existing's untouched fields survive). Items with a falsy key are dropped. Replaces the recurring "collect into a `Map` by key, then spread back to an array" reconciliation pattern used for things like artifact manifests and projection collections.
  ```js
  mergeByKey(existingManifest.tables, nextTables, (t) => t.id);
  ```

## Root barrel — `@ge/std`

`src/index.mjs` re-exports every module above (`naming`, `cli-args`,
`json-io`, `json-repair`, `csv-io`, `list`, `gcp-config`, `merge`). One
exception: `naming.mjs`'s internal `shortHash6` helper is intentionally not
exported anywhere, including the barrel.
