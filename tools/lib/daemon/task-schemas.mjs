// tools/lib/daemon/task-schemas.mjs — the validated shape of every task the
// daemon accepts (POST /api/tasks), one zod schema per wire kind.
//
// This is the daemon's single input-validation point: bodies are checked here
// BEFORE any run is created, so malformed input fails as one clear 400 with
// field-level issues instead of a half-created run or a deep TypeError. The
// deeper "is this safe to run" policy (allowlists in command-run/harness-run)
// still applies after validation — schemas check shape, classifiers check
// intent. Unknown extra fields pass through (`catchall`) so the schema never
// blocks a newer client talking to an older daemon.
import { z } from "zod";

const argv = z.array(z.string()).min(1, "argv must be a non-empty array of strings");
const stringList = z.array(z.string()).optional();
const looseObject = z.record(z.string(), z.unknown()).optional();

const commandTask = z.object({
  argv,
  command: z.string().nullish(),
}).catchall(z.unknown());

// Wire kinds (post-alias normalization) → body schema.
export const TASK_CREATE_SCHEMAS = {
  "ge.command": commandTask,
  "process.command": commandTask,
  "harness.run": z.object({
    input: looseObject,
  }).catchall(z.unknown()),
  "mission.run": z.object({
    ids: stringList,
    scenario: z.string().nullish(),
    spec: z.string().nullish(),
    workspace: z.string().nullish(),
    systems: stringList,
    targetStage: z.string().optional(),
    attempts: z.number().int().positive().optional(),
    runPreview: z.boolean().optional(),
    executeFactory: z.boolean().optional(),
    useAntigravity: z.boolean().optional(),
    harnessAgent: z.string().optional(),
    harnessModel: z.string().optional(),
    harnessLocation: z.string().optional(),
    query: looseObject,
  }).catchall(z.unknown()),
  "autopilot.run": z.object({
    ids: stringList,
    targetStage: z.string().optional(),
    repair: z.boolean().optional(),
    attempts: z.number().int().positive().optional(),
    runPreview: z.boolean().optional(),
    query: looseObject,
  }).catchall(z.unknown()),
};

// Validate a create-task body for an already-normalized wire kind.
// Returns { ok: true, value } or { ok: false, error } with a readable,
// field-level message.
export function validateTaskCreate(kind, body) {
  const schema = TASK_CREATE_SCHEMAS[kind];
  if (!schema) return { ok: false, error: `unsupported task kind: ${kind || "<unset>"}` };
  const parsed = schema.safeParse(body ?? {});
  if (parsed.success) return { ok: true, value: parsed.data };
  const issues = parsed.error.issues
    .map((issue) => `${issue.path.join(".") || "body"}: ${issue.message}`)
    .join("; ");
  return { ok: false, error: `invalid ${kind} task: ${issues}` };
}
