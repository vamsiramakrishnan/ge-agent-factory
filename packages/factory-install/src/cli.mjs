#!/usr/bin/env node
import {
  loadInstallContract,
  renderCommandPlan,
  runtimeTarget,
  summarizeInstallContract,
} from "./index.mjs";

const [command = "contract", arg] = process.argv.slice(2);
const contract = await loadInstallContract();

if (command === "contract" || command === "summary") {
  console.log(JSON.stringify(summarizeInstallContract(contract), null, 2));
} else if (command === "command") {
  console.log(JSON.stringify(renderCommandPlan(contract, arg || "init"), null, 2));
} else if (command === "target") {
  console.log(JSON.stringify(runtimeTarget(contract, arg || "gateway"), null, 2));
} else if (command === "raw") {
  console.log(JSON.stringify(contract, null, 2));
} else {
  console.error(`unknown command: ${command}`);
  console.error("usage: ge-factory-install [contract|raw|command <name>|target <name>]");
  process.exit(1);
}
