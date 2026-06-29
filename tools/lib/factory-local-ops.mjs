// Week-4 cycle-break boundary module. The second of the two tools/lib modules
// allowed to import apps/factory (enforced by tools/check-no-app-imports.mjs).
// Owns the local provisioning / workspace ops factory-core used to import
// directly from apps/factory; factory-core now imports them from here, keeping
// itself free of app imports. (Relocating the consumer function bodies that call
// these — provisionLocal/ship/devexCheck — into this module is the follow-up
// refinement that enables bundle tree-shaking.)
export { createFactoryPlan, runFactoryPlan } from "../../apps/factory/src/factory.js";
export { removeWorkspace } from "../../apps/factory/src/projects.js";
export { buildWorkspaceContractReport } from "../../apps/factory/src/workspace-contract.js";
