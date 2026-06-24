// Single source of truth for the Vertex/Gemini runtime model ids that generated
// ADK agents are allowed to target. Validated at generation time (see ge-mock.mjs)
// so a typo or a phantom model id fails the build instead of 404-ing at runtime
// after cloud resources have already been provisioned.
//
// Keep this list aligned with the models actually enabled in the target project.
export const KNOWN_AGENT_MODELS = [
  "gemini-2.5-pro",
  "gemini-3.5-flash",
  "gemini-2.0-flash",
  "gemini-3.1-pro-preview",
  "gemini-3.1-flash",
  "gemini-3.1-flash-lite-preview",
];

// GA, cost-appropriate default for a fleet of agents; must be a member of the
// allowlist above (enforced by the test suite).
export const DEFAULT_AGENT_MODEL = "gemini-3.5-flash";

export function isKnownModel(model) {
  return KNOWN_AGENT_MODELS.includes(String(model || "").trim());
}

export function assertKnownModel(model) {
  const value = String(model || "").trim();
  if (!isKnownModel(value)) {
    throw new Error(
      `unknown agent model "${value}". Set GE_AGENT_MODEL to one of: ${KNOWN_AGENT_MODELS.join(", ")} ` +
        `(or add the model to apps/ge-demo-generator/src/known-models.js once it is enabled in the project).`,
    );
  }
  return value;
}
