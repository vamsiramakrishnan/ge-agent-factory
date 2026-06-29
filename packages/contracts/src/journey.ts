// The canonical lifecycle + fleet shapes shared across GE front-ends and tools.
// zod is the source of truth; the TypeScript types are inferred (z.infer) so the
// exported names + shapes are unchanged for consumers, and the runtime can now
// validate these payloads at the API boundary.
import { z } from "zod";

export const FleetBlockerSchema = z.object({
  id: z.string(),
  message: z.string(),
  raw: z.any().optional(),
});
export type FleetBlocker = z.infer<typeof FleetBlockerSchema>;

export const MissionArtifactRefSchema = z
  .object({
    name: z.string().optional(),
    type: z.string().optional(),
    path: z.string().optional(),
    status: z.string().optional(),
    error: z.string().optional(),
    metadata: z
      .object({
        size: z.number().optional(),
        entries: z.number().optional(),
        files: z.number().optional(),
        csvFiles: z.number().optional(),
        rowCount: z.number().optional(),
        mtime: z.string().optional(),
        sha256: z.string().optional(),
      })
      .catchall(z.any())
      .optional(),
  })
  .catchall(z.any());
export type MissionArtifactRef = z.infer<typeof MissionArtifactRefSchema>;

export const FleetActionPlanSchema = z.object({
  kind: z.string(),
  label: z.string(),
  owner: z.string(),
  safeToRun: z.boolean(),
  commands: z.array(z.string()),
  route: z.string().optional(),
  artifactPath: z.string().optional(),
  taskId: z.string().optional(),
  agentIds: z.array(z.string()).optional(),
  workspaceIds: z.array(z.string()).optional(),
});
export type FleetActionPlan = z.infer<typeof FleetActionPlanSchema>;

export const FleetAgentSchema = z.object({
  id: z.string(),
  title: z.string(),
  department: z.string(),
  status: z.string(),
  runId: z.string().nullable(),
  workspaceId: z.string().nullable(),
  error: z.string().nullable(),
  stage: z.string().optional(),
  healthStatus: z.string().optional(),
  blocker: FleetBlockerSchema.nullable().optional(),
  nextAction: z.string().optional(),
  owner: z.string().optional(),
  runtimeTaskId: z.string().optional(),
  source: z.string().optional(),
  actionPlan: FleetActionPlanSchema.optional(),
});
export type FleetAgent = z.infer<typeof FleetAgentSchema>;

export const FleetHealthSchema = z.object({
  stages: z.array(z.string()),
  byStage: z.record(z.string(), z.number()),
  byHealth: z.record(z.string(), z.number()),
  byOwner: z.record(z.string(), z.number()),
  blocked: z.number(),
  repairable: z.number(),
  bottlenecks: z.array(
    z.object({
      id: z.string(),
      stage: z.string(),
      blockerId: z.string(),
      message: z.string(),
      count: z.number(),
      owner: z.string(),
      agentIds: z.array(z.string()),
      actionPlan: FleetActionPlanSchema.nullable().optional(),
    }),
  ),
  agents: z.array(FleetAgentSchema),
});
export type FleetHealth = z.infer<typeof FleetHealthSchema>;

export const FleetSchema = z.object({
  total: z.number(),
  byDept: z.record(z.string(), z.number()),
  byStatus: z.record(z.string(), z.number()),
  agents: z.array(FleetAgentSchema),
  health: FleetHealthSchema.optional(),
});
export type Fleet = z.infer<typeof FleetSchema>;

export const JourneyStageSchema = z.object({
  id: z.string(),
  label: z.string(),
  owner: z.string(),
  status: z.string(),
  blocker: FleetBlockerSchema.nullable().optional(),
  taskId: z.string().nullable().optional(),
  nodeIds: z.array(z.string()).optional(),
  artifacts: z.array(MissionArtifactRefSchema).optional(),
  actionPlan: FleetActionPlanSchema.nullable().optional(),
});
export type JourneyStage = z.infer<typeof JourneyStageSchema>;

export const JourneyPlanSchema = z.object({
  kind: z.literal("ge.journey.plan"),
  version: z.number(),
  id: z.string(),
  mode: z.string(),
  targetStage: z.string(),
  input: z.object({
    scenario: z.string().nullable().optional(),
    spec: z.string().nullable().optional(),
    usecaseId: z.string().nullable().optional(),
    systems: z.array(z.string()),
    ids: z.array(z.string()),
  }),
  status: z.string(),
  next: JourneyStageSchema.nullable().optional(),
  counts: z.record(z.string(), z.number()),
  stages: z.array(JourneyStageSchema),
  implementation: z.record(z.string(), z.any()).optional(),
});
export type JourneyPlan = z.infer<typeof JourneyPlanSchema>;
