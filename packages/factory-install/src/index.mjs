import { readFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const PACKAGE_ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const CONTRACT_PATH = resolve(PACKAGE_ROOT, "install-contract.v1.json");

export async function loadInstallContract() {
  return JSON.parse(await readFile(CONTRACT_PATH, "utf8"));
}

export function summarizeInstallContract(contract) {
  return {
    kind: contract.kind,
    contractVersion: contract.contractVersion,
    packageName: contract.packageName,
    packageVersion: contract.packageVersion,
    tfvars: contract.terraform?.variables?.length || 0,
    terraformOutputs: contract.terraform?.outputs?.length || 0,
    runtimeTargets: Object.keys(contract.runtimeTargets || {}),
    buildTargets: Object.keys(contract.buildTargets || {}),
    commands: Object.keys(contract.commands || {}),
  };
}

export function renderCommandPlan(contract, commandName) {
  const command = contract.commands?.[commandName];
  if (!command) {
    throw new Error(`unknown install command: ${commandName}`);
  }
  return {
    command: commandName,
    description: command.description,
    argv: command.argv,
    terraformRoot: contract.terraform?.root,
  };
}

export function runtimeTarget(contract, targetName) {
  const target = contract.runtimeTargets?.[targetName];
  if (!target) {
    throw new Error(`unknown runtime target: ${targetName}`);
  }
  return target;
}
