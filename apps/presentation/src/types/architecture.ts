/**
 * Shared types for the agent use case system.
 * Architecture types + common interfaces used across components.
 *
 * The spec-shape types of record (`UseCaseGenerationSpec`,
 * `AgentBehaviorContract`, `UseCaseEntitySpec`) live in `@ge/agent-spec`
 * (packages/agent-spec/src/schema.ts) and are re-exported below; the
 * remaining interfaces here are presentation-side authoring conveniences.
 */

export type { AgentBehaviorContract, UseCaseEntitySpec, UseCaseGenerationSpec } from "@ge/agent-spec";

// ─── Common Types ──────────────────────────────────────

export interface KPI {
  label: string;
  before: string;
  after: string;
}

export interface HITLConfig {
  actor: string;
  action: string;
  description: string;
}

// ─── Architecture Types ────────────────────────────────

export type SystemCategory = "erp" | "analytics" | "ai" | "clm" | "market-data" | "collaboration";
export type PipelineLayer = "integration" | "ml" | "llm";
export type ConnectionDirection = "read" | "write" | "bidirectional";

export interface SystemConnection {
  system: string;
  description: string;
  direction: ConnectionDirection;
  protocol?: string;
  dataExamples?: string[];
  category: SystemCategory;
}

export interface PipelineStage {
  label: string;
  description: string;
  systems: string[];
  layer: PipelineLayer;
  dataIn?: string;
  dataOut?: string;
}

export interface AgentArchitecture {
  connections: SystemConnection[];
  pipeline: PipelineStage[];
}

// ─── Factory Generation Spec ───────────────────────────

export type DatastoreClass = "alloydb" | "firestore" | "bigtable" | "bigquery" | "cloud-storage" | "json-api" | "mcp";

export interface UseCaseSourceSystemSpec {
  id: string;
  name: string;
  owns: string[];
  protocol: string;
  localBacking: DatastoreClass[];
  toolNames: string[];
  mcpToolNames?: string[];
  evidence: Array<"sql_result" | "source_system_record" | "document_reference" | "generated_audit_trail" | "api_response">;
}

export interface UseCaseSchemaColumnSpec {
  name: string;
  type: string;
  required?: boolean;
  values?: string[];
  weights?: number[];
  ref?: string;
  min?: string | number;
  max?: string | number;
  decimals?: number;       // for "float" type: faker decimal precision (e.g. 2 → 0.42)
  trueRate?: number;       // for "boolean" type: probability of true (0.0–1.0)
}

export interface UseCaseRelationshipSpec {
  from: string;
  to: string;
  cardinality: "one-to-one" | "one-to-many" | "many-to-one" | "many-to-many";
  orphanPolicy: "none" | "seeded-anomaly" | "allowed";
}

export interface UseCaseDocumentSpec {
  id: string;
  sourceSystemId: string;
  type: "policy" | "report" | "sop" | "contract" | "knowledge_base" | "audit" | "memo" | "guide" | "runbook" | "playbook";
  title: string;
  requiredSections: string[];
  linkedEntities: string[];
  minimumWordCount: number;
  citationAnchors: string[];
}

export interface UseCaseApiSpec {
  // Either `systemId` (gold-reference shape) or `sourceSystemId` (programmatic-generator shape)
  // identifies the owning source system. Sync/audit tolerates either.
  systemId?: string;
  sourceSystemId?: string;
  // `operation` is the human-readable verb (gold reference). `id` is a stable slug used by the generator.
  operation?: string;
  id?: string;
  method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  path: string;
  description?: string;
  requestSchema: Record<string, string>;
  responseSchema: Record<string, string>;
  // `fixture` + `mcpToolName` wire the API into the downstream factory factory (gold reference).
  // `idempotencyKey` records the deduplication key used by mutating endpoints (generator shape).
  fixture?: string;
  mcpToolName?: string;
  idempotencyKey?: string;
}

export interface UseCaseAnomalySpec {
  id: string;
  description: string;
  affectedEntities: string[];
  discoveryPath: string[];
  expectedEvidence: string[];
  expectedRecommendation: string;
}

export interface UseCaseDatastorePackagingSpec {
  alloydb?: { database: string; schemas: string[] };
  firestore?: { database: string; collections: string[] };
  bigtable?: { instance: string; tables: string[] };
  bigquery?: { dataset: string; tables: string[] };
  cloudStorage?: { bucketSuffix: string; prefixes: string[] };
  apis?: { serviceName: string; deploymentTarget: "cloud_run" | "local" };
}

// ─── Agent Behavior Contract ───────────────────────────
// The behavior contract is what stops the factory from emitting hello-world
// agents. A use case must declare *what the agent actually does* — the domain
// tool intents, the evidence it must cite, when it escalates or refuses, and
// the golden eval prompts that prove the workflow end-to-end. The factory
// generator and workspace validators read this to produce and audit task-
// specific ADK code rather than a generic list/query shell.

export type AgentToolIntentKind =
  | "query"            // read-only lookup from a source system
  | "action"           // performs a state-changing operation (enrollment, ticket, sync)
  | "evidence_lookup"  // resolves a document/policy citation
  | "notification"     // emits a message to a human or system channel
  | "calculation";     // deterministic compute (cost compare, eligibility math)

export interface AgentToolIntentSpec {
  name: string;                 // canonical, e.g. "submit_benefits_enrollment"
  kind: AgentToolIntentKind;
  sourceSystemId: string;       // must match a sourceSystem.id
  description: string;          // domain-specific purpose, not generic
  requiredInputs: string[];     // logical input names the agent must collect first
  produces: string[];           // outputs / side effects (e.g. "carrier_sync_id")
  evidenceEmitted: Array<"sql_result" | "source_system_record" | "document_reference" | "generated_audit_trail" | "api_response">;
}

export interface AgentEvidenceRequirementSpec {
  claim: string;                // type of statement the agent might make
  mustCite: string[];           // entity columns or document citationAnchors
  sourceSystemIds: string[];    // which systems back this evidence
}

export type AgentEscalationAction =
  | "escalate_to_human"
  | "refuse"
  | "request_more_info"
  | "use_fallback_tool";

export interface AgentEscalationRuleSpec {
  trigger: string;              // domain trigger, e.g. "no active eligibility rule found"
  action: AgentEscalationAction;
  handoffTarget?: string;       // who/what receives the handoff
  rationale: string;
}

export interface AgentGoldenEvalSpec {
  id: string;
  prompt: string;
  expectedToolCalls: string[];                 // tool intent names the eval must invoke
  mustReferenceEntities?: string[];            // entity names that should appear in evidence
  mustCiteDocuments?: string[];                // document ids that must be cited
  expectedActionOutcome?: string;              // expected end-state (e.g. "enrollment submitted")
  forbiddenBehaviors?: string[];               // e.g. "do not invent enrollment id"
}

// `AgentBehaviorContract` and `UseCaseGenerationSpec` are re-exported from
// `@ge/agent-spec` at the top of this file.
