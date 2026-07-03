// BehavioralGraph — the intermediate representation of the behavioral compiler.
//
// The compiler's contract: an Enterprise Agent Contract (or the existing
// @ge/agent-spec behaviorContract) compiles into typed graphs — capability,
// authority, tool behavior, persona, world, conversation — from which every
// executable behavioral artifact is emitted (ADK evalsets, live assist
// scripts, load profiles, coverage reports). Downstream emitters read ONLY
// this shape; they never reach back into the source spec.
import { z } from "zod";

export const BEHAVIORAL_GRAPH_API_VERSION = "ge.dev/v1";
export const BEHAVIORAL_GRAPH_KIND = "BehavioralGraph";

export const CapabilityNodeSchema = z.object({
  id: z.string().min(1),
  label: z.string(),
  objective: z.string(),
  userRoles: z.array(z.string()).default([]),
  successStates: z.array(z.string()).default([]),
  forbiddenStates: z.array(z.string()).default([]),
  relatedTools: z.array(z.string()).default([]),
  relatedClaims: z.array(z.string()).default([]),
  kind: z.enum(["in_scope", "out_of_scope", "query"]).default("in_scope"),
});

export const AuthorityEdgeSchema = z.object({
  claimId: z.string().min(1),
  claim: z.string(),
  sourceSystemId: z.string(),
  evidenceKind: z.enum(["document", "api", "record", "tool_result", "generated_audit"]).default("tool_result"),
  required: z.boolean().default(true),
  citationRequired: z.boolean().default(true),
  freshness: z.object({ maxAge: z.string().optional() }).optional(),
});

export const ToolBehaviorSchema = z.object({
  toolName: z.string().min(1),
  systemId: z.string().optional(),
  operation: z.enum(["read", "write", "bidirectional", "unknown"]).default("unknown"),
  sideEffect: z.string().optional(),
  requiresConfirmation: z.boolean().default(false),
  requiresIdempotency: z.boolean().default(false),
  retryPolicy: z.enum(["safe", "unsafe", "unknown"]).default("unknown"),
  failureModes: z.array(z.string()).default([]),
});

export const PersonaNodeSchema = z.object({
  id: z.string().min(1),
  role: z.string(),
  knowledgeLevel: z.enum(["novice", "normal", "expert"]).default("normal"),
  patience: z.enum(["low", "normal", "high"]).default("normal"),
  riskAppetite: z.enum(["low", "normal", "high"]).default("normal"),
  goal: z.string(),
  constraints: z.array(z.string()).default([]),
});

export const WorldNodeSchema = z.object({
  id: z.string().min(1),
  label: z.string(),
  systems: z.record(
    z.string(),
    z.object({
      state: z.enum(["healthy", "degraded", "unavailable", "stale", "conflicting"]),
      fixtures: z.array(z.string()).default([]),
      failureInjection: z.array(z.string()).optional(),
    }),
  ),
});

export const CoverageTagSchema = z.string().regex(/^[a-z_]+:[^\s]+$/, "coverage tags are <dimension>:<value>");

export const ConversationCaseSchema = z.object({
  id: z.string().min(1),
  capabilityId: z.string(),
  personaId: z.string(),
  worldId: z.string(),
  intent: z.enum(["happy_path", "clarification", "contradiction", "interruption", "refusal", "escalation", "failure"]),
  riskWeight: z.number().min(0).default(1),
  turns: z.array(
    z.object({
      user: z.string().min(1),
      expected: z
        .object({
          citations: z.array(z.string()).optional(),
          tools: z.array(z.string()).optional(),
          refusal: z.boolean().optional(),
          escalation: z.boolean().optional(),
        })
        .optional(),
    }),
  ),
  expected: z.object({
    mustCall: z.array(z.string()).optional(),
    mustNotCall: z.array(z.string()).optional(),
    mustCite: z.array(z.string()).optional(),
    mustRefuse: z.boolean().optional(),
    mustEscalate: z.boolean().optional(),
    maxTurns: z.number().int().positive().optional(),
  }),
  coverage: z.array(CoverageTagSchema).min(1),
});

export const CoverageSummarySchema = z.object({
  dimensions: z.record(
    z.string(),
    z.object({
      required: z.array(z.string()),
      covered: z.array(z.string()),
      gaps: z.array(z.string()),
    }),
  ),
  totalCandidates: z.number().int().min(0),
  selected: z.number().int().min(0),
});

export const BehavioralGraphSchema = z.object({
  apiVersion: z.literal(BEHAVIORAL_GRAPH_API_VERSION),
  kind: z.literal(BEHAVIORAL_GRAPH_KIND),
  subject: z.object({
    agentId: z.string().min(1),
    title: z.string(),
    source: z.enum(["agent-contract", "agent-spec", "workspace-manifest"]),
    sourcePath: z.string(),
    sourceHash: z.string(),
  }),
  capabilities: z.array(CapabilityNodeSchema),
  authority: z.array(AuthorityEdgeSchema),
  tools: z.array(ToolBehaviorSchema),
  personas: z.array(PersonaNodeSchema),
  worlds: z.array(WorldNodeSchema),
  conversations: z.array(ConversationCaseSchema),
});

export function validateBehavioralGraph(candidate) {
  const parsed = BehavioralGraphSchema.safeParse(candidate);
  if (parsed.success) return { ok: true, graph: parsed.data, issues: [] };
  return {
    ok: false,
    graph: null,
    issues: parsed.error.issues.map((issue) => `${issue.path.join(".") || "<root>"}: ${issue.message}`),
  };
}
