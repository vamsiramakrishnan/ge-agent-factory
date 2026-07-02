// tools/ge/runs.mjs — `ge runs list|show|events|resume|job`.
//
// THE canonical noun for run observability: every daemon-backed execution —
// pipeline runs, fleet repairs, harness runs, doctor, jobs — is a *run*, and
// this group is where you list, inspect, follow, and resume them. The command
// implementations live in tools/ge/daemon.mjs (they're the same daemon-task
// leaves `ge runtime` exposed); this group gives them their canonical home.
// `ge runtime` remains as a working alias surface.
import { defineCommand } from "citty";
import { runtimeLeaves } from "./daemon.mjs";

// Canonical re-exports so alias groups (e.g. tools/ge/autopilot.mjs) can point
// at "the runs events command" without reaching into daemon.mjs.
export const runsEventsCmd = runtimeLeaves.events;
export const runsResumeCmd = runtimeLeaves.resume;

export const runs = defineCommand({
  meta: { name: "runs", description: "Run activity across every kind: list · show · events · resume · job" },
  subCommands: {
    list: defineCommand({ meta: { name: "list", description: runtimeLeaves.tasks.meta.description }, args: runtimeLeaves.tasks.args, run: runtimeLeaves.tasks.run }),
    show: defineCommand({ meta: { name: "show", description: runtimeLeaves.task.meta.description }, args: runtimeLeaves.task.args, run: runtimeLeaves.task.run }),
    events: runtimeLeaves.events,
    resume: runtimeLeaves.resume,
    job: defineCommand({ meta: { name: "job", description: "Run a ge command as a background run; pass args after --" }, args: runtimeLeaves.startJob.args, run: runtimeLeaves.startJob.run }),
  },
});

