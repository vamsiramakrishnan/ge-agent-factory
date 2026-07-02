/**
 * @ge/agent-spec — zod schemas + inferred types for the agent-spec shape.
 *
 * This file is the SHAPE/TYPE authority for the use-case spec contract. It is
 * transcribed from three sources, reconciled field-by-field:
 *
 *   1. `apps/presentation/src/types/architecture.ts` (the former hand-written
 *      "types of record" — now re-export shims over this file),
 *   2. `apps/factory/src/agent-spec-registry.js` `validateGenerationSpec`'s
 *      field list and minimums (what actually gates writes today),
 *   3. `docs/reference/spec-schema.md` enums.
 *
 * Where the sources disagree, the registry's validation semantics win; every
 * such disagreement carries a `// DIVERGENCE:` comment naming the loser.
 *
 * IMPORTANT: these schemas are for shape/type authority and NEW consumers.
 * The shipped quality gates are the imperative validators in ./validate.mjs
 * (moved verbatim from the factory registry) — their `{ ok, maturity, gaps }`
 * output is a byte-stable downstream contract and is NOT reimplemented here.
 *
 * All object schemas are loose: specs in the wild carry extra keys, and
 * stripping them would be a behavior change when round-tripping.
 */
import { z } from "zod";

// ─── Enums (docs/reference/spec-schema.md + architecture.ts) ───────────────

export const ToolIntentKindSchema = z.enum([
  "query", // read-only lookup from a source system
  "action", // performs a state-changing operation (enrollment, ticket, sync)
  "evidence_lookup", // resolves a document/policy citation
  "notification", // emits a message to a human or system channel
  "calculation", // deterministic compute (cost compare, eligibility math)
]);
export type ToolIntentKind = z.infer<typeof ToolIntentKindSchema>;

export const EscalationActionSchema = z.enum([
  "escalate_to_human",
  "refuse",
  "request_more_info",
  "use_fallback_tool",
]);
export type EscalationAction = z.infer<typeof EscalationActionSchema>;

export const EvidenceKindSchema = z.enum([
  "sql_result",
  "source_system_record",
  "document_reference",
  "generated_audit_trail",
  "api_response",
]);
export type EvidenceKind = z.infer<typeof EvidenceKindSchema>;

export const DatastoreClassSchema = z.enum([
  "alloydb",
  "firestore",
  "bigtable",
  "bigquery",
  "cloud-storage",
  "json-api",
  "mcp",
]);
export type DatastoreClass = z.infer<typeof DatastoreClassSchema>;

export const ConnectionDirectionSchema = z.enum(["read", "write", "bidirectional"]);
export type ConnectionDirection = z.infer<typeof ConnectionDirectionSchema>;

export const SystemCategorySchema = z.enum([
  "erp",
  "analytics",
  "ai",
  "clm",
  "market-data",
  "collaboration",
]);
export type SystemCategory = z.infer<typeof SystemCategorySchema>;

export const PipelineLayerSchema = z.enum(["integration", "ml", "llm"]);
export type PipelineLayer = z.infer<typeof PipelineLayerSchema>;

export const DocumentTypeSchema = z.enum([
  "policy",
  "report",
  "sop",
  "contract",
  "knowledge_base",
  "audit",
  "memo",
  "guide",
  "runbook",
  "playbook",
]);
export type DocumentType = z.infer<typeof DocumentTypeSchema>;

// ─── generationSpec building blocks ─────────────────────────────────────────

/**
 * Entity column. The generator's table planner copies column attributes
 * through an explicit allowlist (`name,type,values,weights,ref,min,max` —
 * schema-from-generation-spec.mjs); `required`/`decimals`/`trueRate` are
 * authored (architecture.ts) but dropped by that consumer.
 */
export const SchemaColumnSchema = z.looseObject({
  name: z.string(),
  type: z.string(),
  required: z.boolean().optional(),
  values: z.array(z.string()).optional(),
  weights: z.array(z.number()).optional(),
  ref: z.string().optional(),
  min: z.union([z.string(), z.number()]).optional(),
  max: z.union([z.string(), z.number()]).optional(),
  decimals: z.number().optional(), // for "float": faker decimal precision
  trueRate: z.number().optional(), // for "boolean": probability of true (0.0–1.0)
});
export type SchemaColumn = z.infer<typeof SchemaColumnSchema>;

export const SourceSystemSchema = z.looseObject({
  id: z.string(),
  name: z.string(),
  owns: z.array(z.string()).min(1),
  protocol: z.string().min(1),
  // DIVERGENCE: architecture.ts types this DatastoreClass[]; the registry
  // validator only requires a non-empty array and shipped specs carry values
  // outside the enum (e.g. "gcs"), so the registry's permissiveness wins.
  localBacking: z.array(z.string()).min(1),
  toolNames: z.array(z.string()).min(1),
  mcpToolNames: z.array(z.string()).optional(),
  evidence: z.array(EvidenceKindSchema).min(1),
});
export type SourceSystem = z.infer<typeof SourceSystemSchema>;

export const EntitySchema = z.looseObject({
  name: z.string(),
  // DIVERGENCE: architecture.ts requires sourceSystemId; the registry only
  // cross-checks it against sourceSystems[].id WHEN present, so it is optional.
  sourceSystemId: z.string().optional(),
  datastore: DatastoreClassSchema,
  rowCount: z.number(),
  primaryKey: z.string(),
  columns: z.array(SchemaColumnSchema).min(3),
});
export type Entity = z.infer<typeof EntitySchema>;

export const RelationshipSchema = z.looseObject({
  from: z.string(),
  to: z.string(),
  cardinality: z.enum(["one-to-one", "one-to-many", "many-to-one", "many-to-many"]),
  orphanPolicy: z.enum(["none", "seeded-anomaly", "allowed"]),
});
export type Relationship = z.infer<typeof RelationshipSchema>;

export const DocumentSpecSchema = z.looseObject({
  id: z.string(),
  title: z.string(),
  requiredSections: z.array(z.string()).min(1),
  citationAnchors: z.array(z.string()).min(1),
  minimumWordCount: z.number(),
  // DIVERGENCE: architecture.ts requires sourceSystemId/type/linkedEntities;
  // the registry validator never checks them, so they are optional.
  sourceSystemId: z.string().optional(),
  type: DocumentTypeSchema.optional(),
  linkedEntities: z.array(z.string()).optional(),
});
export type DocumentSpec = z.infer<typeof DocumentSpecSchema>;

export const ApiSpecSchema = z.looseObject({
  method: z.enum(["GET", "POST", "PUT", "PATCH", "DELETE"]),
  path: z.string(),
  requestSchema: z.record(z.string(), z.string()),
  responseSchema: z.record(z.string(), z.string()),
  // Either `systemId` (gold-reference shape) or `sourceSystemId`
  // (programmatic-generator shape) identifies the owning source system;
  // `operation` (human verb) vs `id` (stable slug) likewise coexist.
  systemId: z.string().optional(),
  sourceSystemId: z.string().optional(),
  operation: z.string().optional(),
  id: z.string().optional(),
  description: z.string().optional(),
  fixture: z.string().optional(),
  mcpToolName: z.string().optional(),
  idempotencyKey: z.string().optional(),
});
export type ApiSpec = z.infer<typeof ApiSpecSchema>;

export const AnomalySchema = z.looseObject({
  description: z.string(),
  affectedEntities: z.array(z.string()).min(1),
  expectedEvidence: z.array(z.string()).min(1),
  // DIVERGENCE: architecture.ts requires id/discoveryPath/expectedRecommendation;
  // the registry validator uses `id` only to label gaps and never checks the
  // other two, so they are optional.
  id: z.string().optional(),
  discoveryPath: z.array(z.string()).optional(),
  expectedRecommendation: z.string().optional(),
});
export type Anomaly = z.infer<typeof AnomalySchema>;

export const RowPolicySchema = z.looseObject({
  defaultRowsPerEntity: z.number(),
  minimumRowsPerEntity: z.number(),
  rationale: z.string().min(1),
  // DIVERGENCE: architecture.ts requires seed; the registry validator never
  // checks it, so it is optional.
  seed: z.number().optional(),
});
export type RowPolicy = z.infer<typeof RowPolicySchema>;

export const DatastorePackagingSchema = z.looseObject({
  alloydb: z.looseObject({ database: z.string(), schemas: z.array(z.string()) }).optional(),
  firestore: z.looseObject({ database: z.string(), collections: z.array(z.string()) }).optional(),
  bigtable: z.looseObject({ instance: z.string(), tables: z.array(z.string()) }).optional(),
  bigquery: z.looseObject({ dataset: z.string(), tables: z.array(z.string()) }).optional(),
  cloudStorage: z
    .looseObject({ bucketSuffix: z.string(), prefixes: z.array(z.string()) })
    .optional(),
  apis: z
    .looseObject({
      serviceName: z.string(),
      deploymentTarget: z.enum(["cloud_run", "local"]),
    })
    .optional(),
});
export type DatastorePackaging = z.infer<typeof DatastorePackagingSchema>;

// ─── behaviorContract ────────────────────────────────────────────────────────

export const ToolIntentSchema = z.looseObject({
  name: z.string(), // canonical, e.g. "submit_benefits_enrollment"
  kind: ToolIntentKindSchema,
  description: z.string(), // domain-specific purpose, not generic
  requiredInputs: z.array(z.string()).min(1),
  produces: z.array(z.string()).min(1),
  evidenceEmitted: z.array(EvidenceKindSchema).min(1),
  // DIVERGENCE: architecture.ts requires sourceSystemId; the registry only
  // cross-checks it against sourceSystems[].id WHEN present, so it is optional.
  sourceSystemId: z.string().optional(),
});
export type ToolIntent = z.infer<typeof ToolIntentSchema>;

export const EvidenceRequirementSchema = z.looseObject({
  claim: z.string(), // type of statement the agent might make
  mustCite: z.array(z.string()), // entity columns or document citationAnchors
  sourceSystemIds: z.array(z.string()), // which systems back this evidence
});
export type EvidenceRequirement = z.infer<typeof EvidenceRequirementSchema>;

export const EscalationRuleSchema = z.looseObject({
  trigger: z.string(), // domain trigger, e.g. "no active eligibility rule found"
  action: EscalationActionSchema,
  rationale: z.string(),
  handoffTarget: z.string().optional(), // who/what receives the handoff
});
export type EscalationRule = z.infer<typeof EscalationRuleSchema>;

export const GoldenEvalSchema = z.looseObject({
  id: z.string(),
  prompt: z.string(),
  expectedToolCalls: z.array(z.string()), // tool intent names the eval must invoke
  mustReferenceEntities: z.array(z.string()).optional(),
  mustCiteDocuments: z.array(z.string()).optional(),
  expectedActionOutcome: z.string().optional(),
  expectedBehaviors: z.array(z.string()).optional(), // authored in shipped specs
  forbiddenBehaviors: z.array(z.string()).optional(),
  // Optional explicit capability-spine mechanisms; derived from
  // expectedToolCalls by okf-capabilities.mjs when absent.
  mechanisms: z.array(z.string()).optional(),
});
export type GoldenEval = z.infer<typeof GoldenEvalSchema>;

/**
 * Self-describing multi-stage workflow authored on `behaviorContract.workflow`
 * by `buildWorkflowFromPipeline` (apps/factory/scripts/factory/agent-workflow.mjs):
 * ordered steps, each naming the toolIntents it uses (`tools` entries are
 * toolIntent NAMES).
 */
export const SpecWorkflowStepSchema = z.looseObject({
  id: z.string().optional(),
  label: z.string(),
  description: z.string().optional(),
  tools: z.array(z.string()),
});
export type SpecWorkflowStep = z.infer<typeof SpecWorkflowStepSchema>;

export const SpecWorkflowSchema = z.looseObject({
  mode: z.enum(["sequential", "parallel"]),
  steps: z.array(SpecWorkflowStepSchema),
});
export type SpecWorkflow = z.infer<typeof SpecWorkflowSchema>;

/**
 * A Query Capability — a question/request the agent can answer, with the
 * toolIntent names that serve it and (optionally) the workflow stage it runs
 * in. Emitted on `behaviorContract.answerableQueries`; consumed by the OKF
 * converter to author `queries/<id>.md` (type "Query Capability"); derived by
 * okf-capabilities.mjs when absent.
 */
export const AnswerableQuerySchema = z.looseObject({
  id: z.string().optional(),
  /** The question/request, e.g. "What is an employee's net pay?". */
  request: z.string(),
  /** toolIntent NAMES this capability uses. */
  tools: z.array(z.string()),
  /** Evidence the capability is expected to surface. */
  evidence: z.array(z.string()).optional(),
  /** Optional workflow step id this capability runs in. */
  stage: z.string().optional(),
});
export type AnswerableQuery = z.infer<typeof AnswerableQuerySchema>;

export const BehaviorContractSchema = z.looseObject({
  role: z.string(), // what the agent identifies as
  primaryObjective: z.string().min(60), // single-sentence success criterion
  inScope: z.array(z.string()).min(2), // supported workflows
  outOfScope: z.array(z.string()).min(2), // explicit refusals
  toolIntents: z
    .array(ToolIntentSchema)
    .min(3)
    .refine((intents) => intents.some((intent) => intent.kind === "query"), {
      message: 'at least one toolIntent must have kind "query"',
    })
    .refine((intents) => intents.some((intent) => intent.kind === "evidence_lookup"), {
      message: 'at least one toolIntent must have kind "evidence_lookup"',
    }),
  evidenceRequirements: z.array(EvidenceRequirementSchema).min(1),
  escalationRules: z.array(EscalationRuleSchema).min(2),
  refusalRules: z.array(z.string()).min(2), // hard guardrails (PII, compliance, invention)
  goldenEvals: z.array(GoldenEvalSchema).min(1), // at least one end-to-end golden prompt
  workflow: SpecWorkflowSchema.optional(),
  answerableQueries: z.array(AnswerableQuerySchema).optional(),
});
export type BehaviorContract = z.infer<typeof BehaviorContractSchema>;

// ─── generationSpec ──────────────────────────────────────────────────────────

export const GenerationSpecSchema = z.looseObject({
  version: z.literal(1),
  rowPolicy: RowPolicySchema,
  sourceSystems: z.array(SourceSystemSchema).min(1),
  entities: z.array(EntitySchema).min(1),
  documents: z.array(DocumentSpecSchema).min(1),
  anomalies: z.array(AnomalySchema).min(1),
  datastorePackaging: DatastorePackagingSchema,
  validation: z.looseObject({
    smokePrompt: z.string().min(1),
    assertions: z.array(z.string()).min(2),
    // DIVERGENCE: architecture.ts requires expectedAnswer; the registry
    // validator never checks it, so it is optional.
    expectedAnswer: z.array(z.string()).optional(),
  }),
  // DIVERGENCE: architecture.ts requires relationships/apis; the registry
  // validator never requires either (apis items are validated only when
  // present) and shipped interview specs omit both, so they are optional.
  relationships: z.array(RelationshipSchema).optional(),
  apis: z.array(ApiSpecSchema).optional(),
  // DIVERGENCE: architecture.ts marks behaviorContract optional ("so legacy
  // slides type-check"); the registry gaps a spec without one and refuses to
  // mark it buildable, so the contract is required here.
  behaviorContract: BehaviorContractSchema,
});
export type GenerationSpec = z.infer<typeof GenerationSpecSchema>;

// ─── architecture ────────────────────────────────────────────────────────────

export const SystemConnectionSchema = z.looseObject({
  system: z.string(),
  description: z.string(),
  // DIVERGENCE: architecture.ts requires direction/category; interview-authored
  // connections carry only { system, description } and the registry validator
  // only counts the array, so everything else is optional.
  direction: ConnectionDirectionSchema.optional(),
  protocol: z.string().optional(),
  dataExamples: z.array(z.string()).optional(),
  category: SystemCategorySchema.optional(),
});
export type SystemConnection = z.infer<typeof SystemConnectionSchema>;

export const PipelineStageSchema = z.looseObject({
  label: z.string(),
  // DIVERGENCE: architecture.ts requires description/systems/layer;
  // interview-authored pipelines carry only { label, description } (see
  // docs/reference/spec-schema.md §architecture) and the registry validator
  // only counts the array, so everything past label is optional.
  description: z.string().optional(),
  systems: z.array(z.string()).optional(),
  layer: PipelineLayerSchema.optional(),
  dataIn: z.string().optional(),
  dataOut: z.string().optional(),
  parallel: z.boolean().optional(),
});
export type PipelineStage = z.infer<typeof PipelineStageSchema>;

export const ArchitectureSchema = z.looseObject({
  connections: z.array(SystemConnectionSchema),
  pipeline: z.array(PipelineStageSchema),
});
export type Architecture = z.infer<typeof ArchitectureSchema>;

// ─── catalog-entry wrapper + normalized registry entry ──────────────────────

export const KpiSchema = z.looseObject({
  label: z.string(),
  before: z.string(),
  after: z.string(),
});
export type Kpi = z.infer<typeof KpiSchema>;

/**
 * The catalog-entry wrapper around a generationSpec — what the interview
 * agent streams as its `agent-spec` artifact and what registration consumes.
 */
export const GenerationSpecEnvelopeSchema = z.looseObject({
  id: z.string(),
  title: z.string(),
  department: z.string(),
  generationSpec: GenerationSpecSchema,
});
export type GenerationSpecEnvelope = z.infer<typeof GenerationSpecEnvelopeSchema>;

/** The `{ ok, maturity, gaps }` shape every shipped validator returns. */
export const ValidationResultSchema = z.looseObject({
  ok: z.boolean(),
  maturity: z.string(),
  gaps: z.array(z.string()),
});
export type ValidationResult = z.infer<typeof ValidationResultSchema>;

export const AgentSpecVariantSchema = z.looseObject({
  familyId: z.string(),
  variantId: z.string(),
  variantOf: z.string(),
  label: z.string(),
  dimensions: z.looseObject({
    logic: z.array(z.string()),
    systems: z.array(z.string()),
    persona: z.array(z.string()),
    jurisdiction: z.array(z.string()),
    dataShape: z.array(z.string()),
    policy: z.array(z.string()),
  }),
  invariants: z.array(z.string()),
  changeSummary: z.array(z.string()),
});
export type AgentSpecVariant = z.infer<typeof AgentSpecVariantSchema>;

export const AgentSpecLineageSchema = z.looseObject({
  baseUseCaseId: z.string(),
  baseSpecVersion: z.union([z.string(), z.number()]).nullable(),
  refinementMethod: z.string(),
  refinementPromptPath: z.string().nullable(),
  sourceDiffPath: z.string().nullable(),
  compatibility: z.looseObject({
    preserveBehaviorContract: z.boolean(),
    preserveEvalIds: z.boolean(),
    preserveSourceSystemIds: z.boolean(),
  }),
});
export type AgentSpecLineage = z.infer<typeof AgentSpecLineageSchema>;

/**
 * The normalized-entry shape produced by `normalizeAgentSpecEntry` (which
 * stays in apps/factory/src/agent-spec-registry.js — it is factory-side IO,
 * not contract) and persisted under apps/factory/catalog/interview-specs/.
 */
export const AgentSpecEntrySchema = z.looseObject({
  id: z.string(),
  title: z.string(),
  department: z.string(),
  sourcePath: z.string().nullable(),
  subtitle: z.string(),
  persona: z.string(),
  layer: z.string(),
  triggerType: z.string(),
  domainId: z.string().nullable(),
  systems: z.array(z.string()),
  kpis: z.array(KpiSchema),
  statusQuo: z.array(z.string()),
  agentification: z.array(z.string()),
  architecture: ArchitectureSchema,
  generationSpec: GenerationSpecSchema.nullable(),
  hasBehaviorContract: z.boolean(),
  registry: z.looseObject({
    schemaVersion: z.number(),
    sourceKind: z.string(),
    sourcePath: z.string().nullable(),
    familyId: z.string(),
    variant: AgentSpecVariantSchema,
    lineage: AgentSpecLineageSchema,
    registeredAt: z.string().nullable(),
    build: z.looseObject({ enabled: z.boolean(), reason: z.string() }),
    quality: ValidationResultSchema,
    provenance: z.looseObject({
      interviewId: z.string().nullable(),
      author: z.string().nullable(),
      sourceArtifact: z.string().nullable(),
    }),
  }),
});
export type AgentSpecEntry = z.infer<typeof AgentSpecEntrySchema>;

// ─── Presentation-facing aliases ─────────────────────────────────────────────
// apps/presentation/src/types/architecture.ts re-exports these names; they are
// the same shapes under the names the slide corpus was authored against.

export type UseCaseGenerationSpec = GenerationSpec;
export type AgentBehaviorContract = BehaviorContract;
export type UseCaseEntitySpec = Entity;
