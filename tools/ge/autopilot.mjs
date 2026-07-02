// tools/ge/autopilot.mjs — deprecated alias group. "Autopilot" was blocker
// convergence across the fleet — i.e. a repair run. The canonical surface is
// `ge fleet repair|repairs` (tools/ge/fleet.mjs); run events live under
// `ge runs events`. These aliases keep every old invocation working, with a
// dim pointer to the canonical spelling.
import { defineCommand } from "citty";
import { deprecatedAlias } from "./shared.mjs";
import { fleetRepairCmd, fleetRepairsCmd } from "./fleet.mjs";
import { runsEventsCmd } from "./runs.mjs";

export const autopilot = defineCommand({
  meta: { name: "autopilot", description: "(deprecated → ge fleet repair) autopilot is a fleet repair run" },
  subCommands: {
    run: deprecatedAlias({ name: "run", hint: "ge fleet repair", command: fleetRepairCmd }),
    status: deprecatedAlias({ name: "status", hint: "ge fleet repairs [id]", command: fleetRepairsCmd }),
    events: deprecatedAlias({ name: "events", hint: "ge runs events <id>", command: runsEventsCmd }),
  },
});
