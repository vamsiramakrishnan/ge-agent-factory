# Week 1: Security Hardening

## Goal

Remove the highest-risk security exposure paths before deeper refactors. The target outcome is that privileged actions require authentication, request data cannot escape into shell execution, and untrusted archives cannot write outside their intended workspace.

## Primary Risks Addressed

- Public or auth-optional gateway and daemon surfaces.
- Request-derived shell command execution.
- Unsafe prebuilt workspace archive extraction.
- Privileged factory worker requests without app-level caller validation.

## Scope

### 1. Require Auth For Privileged Surfaces

Target areas:

- `apps/presentation/server.js`
- `apps/presentation/src/server/iap-jwt.js`
- `apps/ge-demo-generator/src/server.js`
- `apps/ge-demo-generator/src/cli.js`
- `apps/ge-demo-generator/scripts/factory-worker.mjs`

Implementation tasks:

- Make production gateway auth required by default.
- Keep local development explicit: allow unauthenticated mode only when `NODE_ENV=development` or a clear `GE_ALLOW_INSECURE_LOCAL=1` flag is present.
- Add a daemon token for non-loopback binds.
- Reject daemon privileged routes when bound outside `127.0.0.1` and no token is configured.
- Add one auth middleware path before route dispatch.
- Verify Cloud Tasks OIDC token on factory worker requests:
  - expected audience is the worker URL.
  - expected service account is the runner service account.
  - failed verification returns `401` before stage execution.

Acceptance criteria:

- Privileged daemon routes reject unauthenticated calls when host is non-loopback.
- Gateway factory routes reject unauthenticated calls in production mode.
- Worker does not execute a stage without valid OIDC or an explicit local development bypass.

### 2. Remove Shell String Execution

Target areas:

- `apps/presentation/src/server/factory-bridge.js`
- `tools/lib/gcp.mjs`
- any `execSync(...)`, `execFileSync(...)`, `spawn(...)`, or command-building helper using interpolated shell strings.

Implementation tasks:

- Replace `execSync(string)` with `execFileSync(command, args)` or async `spawn`.
- Represent generated commands as `{ command, args }`, not shell strings.
- Add request schemas for factory submission fields before command launch:
  - `title`
  - `useCaseId`
  - `workspace`
  - `systems`
  - `targetStage`
  - `startStage`
  - cloud target fields.
- Reject or normalize suspicious characters only at schema boundaries; do not quote manually.

Acceptance criteria:

- No request-derived field is concatenated into a shell command string.
- Tests prove titles and systems containing quotes, semicolons, spaces, and newlines are passed as literal argv values.

### 3. Harden Prebuilt Archive Handling

Target areas:

- `apps/presentation/src/server/factory-bridge.js`
- `apps/ge-demo-generator/src/factory-worker.js`

Implementation tasks:

- Accept `prebuiltArchive` only under the configured factory bucket and expected prefix.
- Download into a temp directory.
- List tar entries before extraction.
- Reject entries with:
  - absolute paths
  - `..`
  - symlinks
  - hardlinks
  - device files
  - paths that normalize outside the workspace.
- Extract into a fresh staging directory, then atomically move into the workspace.

Acceptance criteria:

- Archive traversal tests fail safely.
- Valid archives continue to work.
- Worker logs a structured rejection reason for invalid archives.

## Suggested PR Breakdown

1. Auth defaults and daemon token enforcement.
2. Shell execution cleanup and schema validation.
3. Safe archive extraction.
4. Worker OIDC verification.

## Validation

- Run unit tests for gateway auth and factory bridge command building.
- Run worker tests with valid and invalid OIDC fixtures.
- Add archive extraction tests with traversal and symlink cases.
- Manually run a local canary in explicit insecure local mode.

## Implementation Details

### New Modules And Helpers

Add these small modules before changing route behavior:

- `apps/presentation/src/server/request-schema.js`
  - exports Zod schemas for `/api/factory/preflight`, `/api/factory/usecase`, and `/api/factory/agents`.
  - centralizes allowed stage names and safe string limits.
- `apps/presentation/src/server/process-runner.js`
  - exports `runFile(command, args, options)` and `runFileJson(command, args, options)`.
  - wraps `execFile` or `spawn`, never shell strings.
- `apps/ge-demo-generator/src/security/auth-middleware.js`
  - exports `requireDaemonAuth(req, { host, allowInsecureLocal })`.
  - accepts `Authorization: Bearer <GE_DAEMON_TOKEN>`.
- `apps/ge-demo-generator/src/security/oidc.js`
  - exports `verifyGoogleOidcRequest(req, { audience, serviceAccount })`.
  - uses Google cert/JWKS verification, with a small in-memory cert cache.
- `apps/ge-demo-generator/src/security/safe-tar.js`
  - exports `validateTarEntries(tarPath)` and `extractTarSafely(tarPath, destination)`.

### Suggested Request Schema Shape

Use strict schemas and reject unknown keys:

```js
const factoryUseCaseSchema = z.object({
  title: z.string().trim().min(1).max(160),
  useCaseId: z.string().regex(/^[a-z0-9][a-z0-9-]{0,120}$/),
  workspace: z.string().regex(/^[a-z0-9][a-z0-9-]{0,120}$/),
  targetStage: z.enum([
    "generate_workspace",
    "generate_data",
    "package_data",
    "harness_refine",
    "validate",
    "preview",
    "plan_deploy",
    "load_data",
    "deploy_runtime",
    "poll_runtime",
    "register_tools",
    "publish_enterprise",
    "verify_live"
  ]).optional(),
  startStage: z.string().optional(),
  systems: z.array(z.string().max(80)).max(20).default([]),
  prebuiltArchive: z.string().startsWith("gs://").optional(),
  target: z.object({
    projectId: z.string().regex(/^[a-z][a-z0-9-]{4,28}[a-z0-9]$/),
    runtimeRegion: z.string().default("us-central1"),
    artifactBucket: z.string().min(3),
    dataBucket: z.string().optional(),
    projectNumber: z.string().regex(/^[0-9]+$/).optional(),
    geminiEnterpriseAppId: z.string().optional(),
    serviceAccount: z.string().email().optional()
  }).strict()
}).strict();
```

If Zod is not available in the specific package, add it to that package or expose the root dependency through the workspace. Do not hand-roll partial validation in each route.

### Shell Execution Replacement Pattern

Replace this pattern:

```js
execSync(`bun ${cmdArgs.join(" ")}`, { cwd });
```

with:

```js
await runFile("bun", cmdArgs, {
  cwd,
  timeoutMs: 120_000,
  env: buildFactoryEnv()
});
```

Rules:

- No `shell: true`.
- No manual quoting.
- No command string templates.
- Capture stdout/stderr tails and include a redacted command summary in errors.

### Worker OIDC Verification Flow

In `apps/ge-demo-generator/scripts/factory-worker.mjs`:

1. Parse request.
2. Before parsing the stage payload, verify:
   - `Authorization` header exists.
   - token issuer is Google.
   - audience equals configured worker audience.
   - subject/email equals configured runner service account.
3. Only then call stage execution.

Local bypass must require all of:

- `NODE_ENV=development`
- request comes from loopback
- `GE_ALLOW_INSECURE_LOCAL=1`

### Safe Archive Extraction Algorithm

Implement `extractTarSafely` as:

1. Create temp root under `workspaceDir/.tmp-extract/<uuid>`.
2. Run `tar -tzf archive.tar.gz` using argv array.
3. For each entry:
   - normalize path with `path.posix.normalize`.
   - reject if path starts with `/`.
   - reject if normalized path starts with `../` or equals `..`.
   - reject if entry contains NUL.
4. Run `tar --no-same-owner --no-same-permissions -xzf archive -C tempRoot`.
5. Walk extracted files with `lstat`.
6. Reject symlinks, hardlinks, device nodes, sockets, and FIFOs.
7. Atomically replace destination after validation.

### Tests To Add

- `apps/presentation/src/server/factory-bridge.security.test.js`
  - shell metacharacters are passed literally.
  - unknown request fields are rejected.
  - malformed stage names are rejected.
- `apps/ge-demo-generator/src/security/safe-tar.test.js`
  - rejects `../escape`.
  - rejects absolute path entries.
  - rejects symlinks.
  - extracts valid archives.
- `apps/ge-demo-generator/src/security/oidc.test.js`
  - rejects missing token.
  - rejects wrong audience.
  - rejects wrong service account.
  - accepts valid fixture.

### Rollout Steps

1. Land schema and process-runner without changing behavior.
2. Switch factory bridge execution to `runFile`.
3. Add auth enforcement in warning mode for one PR if needed.
4. Flip production default to enforcement.
5. Add worker OIDC enforcement.
6. Add safe tar extraction.

### Backout Plan

Keep `GE_ALLOW_INSECURE_LOCAL=1` for local debugging only. Do not add a production bypass. If worker OIDC breaks deployment, temporarily restrict ingress and invoker IAM while fixing token audience configuration.

## Out Of Scope

- Full IAM redesign.
- Terraform backend changes.
- Large service decomposition.
- Generated catalog migration.
