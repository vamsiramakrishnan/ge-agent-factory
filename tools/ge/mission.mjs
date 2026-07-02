// tools/ge/mission.mjs — deprecated alias group. A "mission" was the
// orchestration DAG behind the user journey — i.e. a pipeline run. The
// canonical surface is `ge pipeline` (tools/ge/pipeline.mjs): mission plan →
// pipeline graph, mission run → pipeline run, mission status → pipeline
// status/runs, mission resume → pipeline resume. These aliases keep every old
// invocation working, with a dim pointer to the canonical spelling.
import { defineCommand } from "citty";
import { deprecatedAlias } from "./shared.mjs";
import {
  pipelineGraphCmd, pipelineRunCmd, pipelineResumeCmd,
  pipelineStatusCmd, pipelineRunsCmd,
} from "./pipeline.mjs";

export const mission = defineCommand({
  meta: { name: "mission", description: "(deprecated → ge pipeline) a mission is a pipeline run" },
  subCommands: {
    plan: deprecatedAlias({ name: "plan", hint: "ge pipeline graph", command: pipelineGraphCmd }),
    run: deprecatedAlias({ name: "run", hint: "ge pipeline run", command: pipelineRunCmd }),
    status: deprecatedAlias({
      name: "status",
      hint: "ge pipeline status <id> · ge pipeline runs",
      command: pipelineStatusCmd,
      // Old behavior: with an id → one run's graph; without → the run list.
      run: (ctx) => (ctx.args.id ? pipelineStatusCmd.run(ctx) : pipelineRunsCmd.run(ctx)),
    }),
    resume: deprecatedAlias({ name: "resume", hint: "ge pipeline resume", command: pipelineResumeCmd }),
  },
});
