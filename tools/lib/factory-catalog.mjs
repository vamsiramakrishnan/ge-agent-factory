// Week-4 cycle-break boundary module. This is one of the two tools/lib modules
// allowed to import apps/factory (enforced by tools/check-no-app-imports.mjs).
// factory-core imports these catalog/spec helpers from here rather than reaching
// directly into apps/factory, so factory-core itself keeps zero app imports and
// the tools/ -> apps/ layering edge has a single, explicit chokepoint.
export { loadInterviewSpecEntries, slug, validateGenerationSpec } from "../../apps/factory/src/agent-spec-registry.js";
