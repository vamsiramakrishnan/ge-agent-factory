// tools/ge/journey.mjs — deprecated alias group. The journey IS the pipeline:
// the user-facing stage view and the orchestration graph were two names for
// one thing, now unified under `ge pipeline` (tools/ge/pipeline.mjs). These
// aliases keep every old invocation working, with a dim pointer to the
// canonical spelling.
import { defineCommand } from "citty";
import { deprecatedAlias } from "./shared.mjs";
import { pipelinePlanCmd, pipelineRunCmd, pipelineStatusCmd } from "./pipeline.mjs";

export const journey = defineCommand({
  meta: { name: "journey", description: "(deprecated → ge pipeline) the user journey is the pipeline" },
  subCommands: {
    plan: deprecatedAlias({ name: "plan", hint: "ge pipeline plan", command: pipelinePlanCmd }),
    status: deprecatedAlias({ name: "status", hint: "ge pipeline status", command: pipelineStatusCmd }),
    run: deprecatedAlias({ name: "run", hint: "ge pipeline run", command: pipelineRunCmd }),
  },
});
