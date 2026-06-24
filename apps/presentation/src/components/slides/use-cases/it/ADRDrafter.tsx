import React from "react";
import { UseCaseSlide } from "../../../agent/UseCaseSlide";
import { FlowStep } from "../../../agent/ProcessFlow";
import { SwimlaneFlow } from "../../../agent/SwimlaneFlow";
import { AgentArchitecture, UseCaseGenerationSpec, AgentBehaviorContract} from "../../../../types/architecture";
import { FileText, Database, Search, Brain, CheckCircle } from "lucide-react";

const swimlane: SwimlaneFlow = {
  nodes: [
    { id: "s1", label: "Review Requested", lane: "system", type: "trigger" },
    { id: "a1", label: "Context Retrieval", lane: "agent", type: "action" },
    { id: "a2", label: "Options Analysis", lane: "agent", type: "action" },
    { id: "a3", label: "ADR Drafted", lane: "agent", type: "output" },
    { id: "h1", label: "Architect Reviews", lane: "human", type: "hitl" },
  ],
  connections: [["s1", "a1"], ["a1", "a2"], ["a2", "a3"], ["a3", "h1"]],
};

const flow: FlowStep[] = [
  { label: "Context Ingestion", icon: Search, description: "Retrieves existing ADRs, system catalog entries, and technology radar data for context.", trigger: "Chat / Event", systems: ["Confluence", "GitHub"] },
  { label: "Options Analysis", icon: Database, description: "Evaluates architectural options against constraints, precedents, and patterns.", systems: ["ServiceNow CMDB", "BigQuery"], integration: "ADK" },
  { label: "ADR Generation", icon: Brain, description: "Drafts comprehensive ADR with context, options evaluated, and recommendation rationale.", systems: ["Vertex AI"] },
  { label: "Review & Publish", icon: CheckCircle, description: "Enterprise Architect reviews, refines, and publishes the decision record.", output: "Architecture Decision Record" },
];

const architecture: AgentArchitecture = {
  connections: [
    { system: "Confluence", description: "Existing ADRs, architecture wiki, design guidelines", direction: "read", protocol: "REST API", category: "collaboration" },
    { system: "GitHub", description: "Code repository structure, dependency files, tech stack signals", direction: "read", protocol: "REST API", category: "erp" },
    { system: "ServiceNow CMDB", description: "System catalog, application inventory, integration map", direction: "read", protocol: "REST API", category: "erp" },
    { system: "BigQuery", description: "Technology usage analytics, performance benchmarks", direction: "read", protocol: "BigQuery SQL", category: "analytics" },
    { system: "Vertex AI (Gemini)", description: "ADR narrative generation, options reasoning", direction: "bidirectional", protocol: "gRPC", category: "ai" },
  ],
  pipeline: [
    { label: "Context Retrieval", description: "Pull existing ADRs from Confluence, system metadata from CMDB, and code structure from GitHub. Build a knowledge graph of prior decisions and their outcomes.", systems: ["Confluence", "GitHub", "ServiceNow CMDB"], layer: "integration", dataIn: "Architecture review request with context", dataOut: "Related ADRs + system context + technology radar" },
    { label: "Pattern Matching", description: "Match the decision context against reference architectures and prior ADR outcomes. Identify similar decisions and their success/failure patterns.", systems: ["BigQuery"], layer: "ml", dataIn: "Decision context + historical ADRs", dataOut: "Relevant patterns and precedents" },
    { label: "ADR Drafting", description: "Gemini reasons about architectural trade-offs, evaluates options against constraints, and drafts a comprehensive ADR with context, alternatives considered, and recommendation.", systems: ["Vertex AI (Gemini)"], layer: "llm", dataIn: "Context + patterns + constraints", dataOut: "Complete ADR document with decision rationale" },
    { label: "Publication", description: "Formatted ADR published to Confluence with cross-links to related decisions and affected systems.", systems: ["Confluence"], layer: "integration", dataIn: "Approved ADR", dataOut: "Published and indexed decision record" },
  ],
};


const behaviorContract: AgentBehaviorContract = {
  role: "Enterprise Architect agent for the ADR Drafter workflow",
  primaryObjective: "Gemini retrieves all related ADRs, system context, and technology radar data to build comprehensive decision context. LLM reasons about architectural trade-offs, evaluating options against real constraints and historical outcomes. so the Enterprise Architect can move the ADR drafting time KPI.",
  inScope: [
    "Gemini retrieves all related ADRs, system context, and technology radar data to build comprehensive decision context",
    "LLM reasons about architectural trade-offs, evaluating options against real constraints and historical outcomes",
    "Generates structured ADRs with context, alternatives, and rationale — not just templates, but reasoned decisions",
  ],
  outOfScope: [
    "Production deployments outside an approved change window",
    "Irreversible destructive actions on shared infrastructure (DROP, force-delete, key rotation)",
    "Security incident attribution requiring forensics",
  ],
  toolIntents: [
    {
      name: "query_confluence_pages",
      kind: "query",
      sourceSystemId: "confluence",
      description: "Retrieve pages from Confluence for the ADR Drafter workflow.",
      requiredInputs: [
        "lookup_key",
        "date_range",
      ],
      produces: [
        "pages_records",
        "pages_summary",
      ],
      evidenceEmitted: [
        "source_system_record",
      ],
    },
    {
      name: "query_github_pull_requests",
      kind: "query",
      sourceSystemId: "github",
      description: "Retrieve pull requests from GitHub for the ADR Drafter workflow.",
      requiredInputs: [
        "lookup_key",
        "date_range",
      ],
      produces: [
        "pull_requests_records",
        "pull_requests_summary",
      ],
      evidenceEmitted: [
        "source_system_record",
      ],
    },
    {
      name: "query_servicenow_cmdb_tickets",
      kind: "query",
      sourceSystemId: "servicenow_cmdb",
      description: "Retrieve tickets from ServiceNow CMDB for the ADR Drafter workflow.",
      requiredInputs: [
        "lookup_key",
        "date_range",
      ],
      produces: [
        "tickets_records",
        "tickets_summary",
      ],
      evidenceEmitted: [
        "source_system_record",
      ],
    },
    {
      name: "lookup_adr_drafter_runbook",
      kind: "evidence_lookup",
      sourceSystemId: "confluence",
      description: "Look up sections of the ADR Drafter Operations Runbook to cite in narrative output, escalation rationale, and audit evidence.",
      requiredInputs: [
        "section_anchor",
      ],
      produces: [
        "document_section",
        "citation_anchor",
      ],
      evidenceEmitted: [
        "document_reference",
      ],
    },
    {
      name: "action_confluence_generate",
      kind: "action",
      sourceSystemId: "confluence",
      description: "Execute the generate step in Confluence after the agent has gathered evidence and validated escalation gates.",
      requiredInputs: [
        "target_id",
        "rationale",
      ],
      produces: [
        "action_id",
        "audit_record_id",
      ],
      evidenceEmitted: [
        "api_response",
        "generated_audit_trail",
      ],
    },
  ],
  evidenceRequirements: [
    {
      claim: "ADR drafting time moved from 4-6 hours toward 20 minutes",
      mustCite: [
        "confluence.pages",
        "github.pull_requests",
      ],
      sourceSystemIds: [
        "confluence",
        "github",
      ],
    },
    {
      claim: "Context coverage moved from 3-4 prior ADRs checked toward All ADRs analyzed",
      mustCite: [
        "confluence.pages",
        "github.pull_requests",
      ],
      sourceSystemIds: [
        "confluence",
        "github",
      ],
    },
  ],
  escalationRules: [
    {
      trigger: "ADR drafting time regresses past the 4-6 hours baseline by more than 20%",
      action: "escalate_to_human",
      handoffTarget: "Enterprise Architect",
      rationale: "Significant regressions need human judgment before automated remediation runs against production records.",
    },
    {
      trigger: "Source-system evidence is incomplete or stale (>24h) for any required entity",
      action: "request_more_info",
      rationale: "Recommendations grounded in stale evidence misrepresent current state and undermine audit defensibility.",
    },
    {
      trigger: "Proposed generate action lacks supporting evidence from at least two systems",
      action: "refuse",
      rationale: "Single-system evidence is insufficient to authorize external state changes without manual review.",
    },
  ],
  refusalRules: [
    "Never fabricate metric values; only publish numbers derived from Confluence (and other named systems) entities.",
    "Never bypass Enterprise Architect approval on escalation triggers, even when confidence is high.",
    "Never expose individual personal data (PII) in summaries; aggregate or pseudonymise before output.",
    "Never act on data older than the staleness threshold defined in the runbook without a fresh re-query.",
  ],
  goldenEvals: [
    {
      id: "adr-drafter-end-to-end",
      prompt: "Run the ADR Drafter workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.",
      expectedToolCalls: [
        "query_confluence_pages",
        "query_github_pull_requests",
        "query_servicenow_cmdb_tickets",
        "lookup_adr_drafter_runbook",
        "action_confluence_generate",
      ],
      mustReferenceEntities: [
        "pages",
        "pull_requests",
        "tickets",
      ],
      mustCiteDocuments: [
        "adr-drafter-runbook",
      ],
      expectedActionOutcome: "Action generate executed against Confluence, with audit-trail entry and Enterprise Architect notified of outcomes.",
      forbiddenBehaviors: [
        "do not invent KPI numbers",
        "do not skip the evidence_lookup step before any recommendation",
        "do not execute generate without two-system evidence",
      ],
    },
  ],
};

const generationSpec: UseCaseGenerationSpec = {
  version: 1,
  rowPolicy: {
    defaultRowsPerEntity: 50,
    minimumRowsPerEntity: 25,
    seed: 42,
    rationale: "Row counts sized for ADR Drafter so the agent can demonstrate the workflow against realistic transactional volume without simulating a production warehouse.",
  },
  sourceSystems: [
    {
      id: "confluence",
      name: "Confluence",
      owns: [
        "pages",
        "comments",
        "space_permissions",
      ],
      protocol: "REST API",
      localBacking: [
        "cloud-storage",
      ],
      toolNames: [
        "query_confluence_pages",
        "query_confluence_comments",
        "query_confluence_space_permissions",
      ],
      evidence: [
        "source_system_record",
        "generated_audit_trail",
      ],
    },
    {
      id: "github",
      name: "GitHub",
      owns: [
        "pull_requests",
        "commits",
        "workflow_runs",
      ],
      protocol: "REST API",
      localBacking: [
        "alloydb",
      ],
      toolNames: [
        "query_github_pull_requests",
        "query_github_commits",
        "query_github_workflow_runs",
      ],
      evidence: [
        "source_system_record",
        "generated_audit_trail",
      ],
    },
    {
      id: "servicenow_cmdb",
      name: "ServiceNow CMDB",
      owns: [
        "tickets",
        "change_requests",
        "incidents",
      ],
      protocol: "REST API",
      localBacking: [
        "alloydb",
      ],
      toolNames: [
        "query_servicenow_cmdb_tickets",
        "query_servicenow_cmdb_change_requests",
        "query_servicenow_cmdb_incidents",
      ],
      evidence: [
        "source_system_record",
        "generated_audit_trail",
      ],
    },
  ],
  entities: [
    {
      name: "pages",
      sourceSystemId: "confluence",
      datastore: "alloydb",
      rowCount: 60,
      primaryKey: "id",
      columns: [
        {
          name: "id",
          type: "seq",
          required: true,
        },
        {
          name: "title",
          type: "lorem.sentence",
          required: true,
        },
        {
          name: "owner",
          type: "person.fullName",
          required: true,
        },
        {
          name: "status",
          type: "enum",
          values: [
            "draft",
            "review",
            "published",
            "archived",
          ],
          required: true,
        },
        {
          name: "last_updated",
          type: "date",
          required: true,
        },
      ],
    },
    {
      name: "comments",
      sourceSystemId: "confluence",
      datastore: "alloydb",
      rowCount: 60,
      primaryKey: "id",
      columns: [
        {
          name: "id",
          type: "seq",
          required: true,
        },
        {
          name: "source_record_id",
          type: "seq",
          required: true,
        },
        {
          name: "status",
          type: "enum",
          values: [
            "active",
            "pending",
            "closed",
          ],
          required: true,
        },
        {
          name: "owner",
          type: "person.fullName",
          required: true,
        },
        {
          name: "created_at",
          type: "date",
          required: true,
        },
        {
          name: "notes",
          type: "lorem.sentence",
        },
      ],
    },
    {
      name: "space_permissions",
      sourceSystemId: "confluence",
      datastore: "alloydb",
      rowCount: 60,
      primaryKey: "id",
      columns: [
        {
          name: "id",
          type: "seq",
          required: true,
        },
        {
          name: "source_record_id",
          type: "seq",
          required: true,
        },
        {
          name: "status",
          type: "enum",
          values: [
            "active",
            "pending",
            "closed",
          ],
          required: true,
        },
        {
          name: "owner",
          type: "person.fullName",
          required: true,
        },
        {
          name: "created_at",
          type: "date",
          required: true,
        },
        {
          name: "notes",
          type: "lorem.sentence",
        },
      ],
    },
    {
      name: "pull_requests",
      sourceSystemId: "github",
      datastore: "alloydb",
      rowCount: 60,
      primaryKey: "id",
      columns: [
        {
          name: "id",
          type: "seq",
          required: true,
        },
        {
          name: "source_record_id",
          type: "seq",
          required: true,
        },
        {
          name: "status",
          type: "enum",
          values: [
            "active",
            "pending",
            "closed",
          ],
          required: true,
        },
        {
          name: "owner",
          type: "person.fullName",
          required: true,
        },
        {
          name: "created_at",
          type: "date",
          required: true,
        },
        {
          name: "notes",
          type: "lorem.sentence",
        },
      ],
    },
    {
      name: "commits",
      sourceSystemId: "github",
      datastore: "alloydb",
      rowCount: 60,
      primaryKey: "id",
      columns: [
        {
          name: "id",
          type: "seq",
          required: true,
        },
        {
          name: "source_record_id",
          type: "seq",
          required: true,
        },
        {
          name: "status",
          type: "enum",
          values: [
            "active",
            "pending",
            "closed",
          ],
          required: true,
        },
        {
          name: "owner",
          type: "person.fullName",
          required: true,
        },
        {
          name: "created_at",
          type: "date",
          required: true,
        },
        {
          name: "notes",
          type: "lorem.sentence",
        },
      ],
    },
    {
      name: "workflow_runs",
      sourceSystemId: "github",
      datastore: "alloydb",
      rowCount: 60,
      primaryKey: "id",
      columns: [
        {
          name: "id",
          type: "seq",
          required: true,
        },
        {
          name: "name",
          type: "lorem.words",
          required: true,
        },
        {
          name: "status",
          type: "enum",
          values: [
            "pending",
            "running",
            "succeeded",
            "failed",
            "rolled_back",
          ],
          required: true,
        },
        {
          name: "duration_seconds",
          type: "number",
          min: 5,
          max: 7200,
          required: true,
        },
        {
          name: "started_at",
          type: "date",
          required: true,
        },
        {
          name: "environment",
          type: "enum",
          values: [
            "dev",
            "staging",
            "prod",
          ],
          required: true,
        },
      ],
    },
    {
      name: "tickets",
      sourceSystemId: "servicenow_cmdb",
      datastore: "alloydb",
      rowCount: 60,
      primaryKey: "id",
      columns: [
        {
          name: "id",
          type: "seq",
          required: true,
        },
        {
          name: "title",
          type: "lorem.sentence",
          required: true,
        },
        {
          name: "priority",
          type: "enum",
          values: [
            "P1",
            "P2",
            "P3",
            "P4",
          ],
          weights: [
            0.05,
            0.15,
            0.4,
            0.4,
          ],
          required: true,
        },
        {
          name: "status",
          type: "enum",
          values: [
            "open",
            "triaged",
            "in_progress",
            "resolved",
            "closed",
          ],
          required: true,
        },
        {
          name: "assignee",
          type: "person.fullName",
          required: true,
        },
        {
          name: "created_at",
          type: "date",
          required: true,
        },
        {
          name: "category",
          type: "enum",
          values: [
            "access",
            "hardware",
            "software",
            "network",
            "policy",
            "billing",
          ],
          required: true,
        },
        {
          name: "sla_met",
          type: "boolean",
          trueRate: 0.78,
        },
      ],
    },
    {
      name: "change_requests",
      sourceSystemId: "servicenow_cmdb",
      datastore: "alloydb",
      rowCount: 60,
      primaryKey: "id",
      columns: [
        {
          name: "id",
          type: "seq",
          required: true,
        },
        {
          name: "title",
          type: "lorem.sentence",
          required: true,
        },
        {
          name: "priority",
          type: "enum",
          values: [
            "P1",
            "P2",
            "P3",
            "P4",
          ],
          weights: [
            0.05,
            0.15,
            0.4,
            0.4,
          ],
          required: true,
        },
        {
          name: "status",
          type: "enum",
          values: [
            "open",
            "triaged",
            "in_progress",
            "resolved",
            "closed",
          ],
          required: true,
        },
        {
          name: "assignee",
          type: "person.fullName",
          required: true,
        },
        {
          name: "created_at",
          type: "date",
          required: true,
        },
        {
          name: "category",
          type: "enum",
          values: [
            "access",
            "hardware",
            "software",
            "network",
            "policy",
            "billing",
          ],
          required: true,
        },
        {
          name: "sla_met",
          type: "boolean",
          trueRate: 0.78,
        },
      ],
    },
    {
      name: "incidents",
      sourceSystemId: "servicenow_cmdb",
      datastore: "alloydb",
      rowCount: 60,
      primaryKey: "id",
      columns: [
        {
          name: "id",
          type: "seq",
          required: true,
        },
        {
          name: "title",
          type: "lorem.sentence",
          required: true,
        },
        {
          name: "priority",
          type: "enum",
          values: [
            "P1",
            "P2",
            "P3",
            "P4",
          ],
          weights: [
            0.05,
            0.15,
            0.4,
            0.4,
          ],
          required: true,
        },
        {
          name: "status",
          type: "enum",
          values: [
            "open",
            "triaged",
            "in_progress",
            "resolved",
            "closed",
          ],
          required: true,
        },
        {
          name: "assignee",
          type: "person.fullName",
          required: true,
        },
        {
          name: "created_at",
          type: "date",
          required: true,
        },
        {
          name: "category",
          type: "enum",
          values: [
            "access",
            "hardware",
            "software",
            "network",
            "policy",
            "billing",
          ],
          required: true,
        },
        {
          name: "sla_met",
          type: "boolean",
          trueRate: 0.78,
        },
      ],
    },
  ],
  relationships: [],
  documents: [
    {
      id: "adr-drafter-runbook",
      sourceSystemId: "confluence",
      type: "runbook",
      title: "ADR Drafter Operations Runbook",
      requiredSections: [
        "Detection signals",
        "Triage procedures",
        "Remediation actions",
        "Rollback criteria",
        "Post-incident review",
      ],
      linkedEntities: [
        "pages",
        "comments",
        "space_permissions",
      ],
      minimumWordCount: 500,
      citationAnchors: [
        "detection",
        "triage",
        "remediation",
        "rollback",
      ],
    },
  ],
  apis: [
    {
      id: "confluence_generate_api",
      sourceSystemId: "confluence",
      method: "POST",
      path: "/api/confluence/generate",
      description: "Synchronous endpoint the agent calls to generate in Confluence after evidence gating.",
      requestSchema: {
        target_id: "string",
        rationale: "string",
        metadata: "object",
      },
      responseSchema: {
        action_id: "string",
        status: "string",
        audit_record_id: "string",
      },
      idempotencyKey: "target_id+rationale",
    },
  ],
  anomalies: [
    {
      id: "adr-drafter-baseline-gap",
      description: "Seed a realistic gap where ADR drafting time sits between 4-6 hours and 20 minutes, so the agent can detect, narrate, and recommend remediation.",
      affectedEntities: [
        "pages",
        "comments",
      ],
      discoveryPath: [
        "Inspect Confluence records for the affected entities",
        "Compare against GitHub historical baseline",
        "Generate a citation-backed recommendation",
      ],
      expectedEvidence: [
        "source-system record",
        "historical baseline metric",
        "generated audit trail",
      ],
      expectedRecommendation: "Explain the gap, cite supporting evidence, and propose the next Enterprise Architect action.",
    },
  ],
  datastorePackaging: {
    alloydb: {
      database: "adr_drafter",
      schemas: [
        "confluence",
        "github",
        "servicenow_cmdb",
      ],
    },
    bigquery: {
      dataset: "it_adr_drafter",
      tables: [
        "kpi_summary",
        "evidence_index",
      ],
    },
    cloudStorage: {
      bucketSuffix: "adr-drafter-evidence",
      prefixes: [
        "documents",
        "audit-trails",
        "exports",
      ],
    },
    apis: {
      serviceName: "adr-drafter-source-adapters",
      deploymentTarget: "cloud_run",
    },
  },
  validation: {
    smokePrompt: "Run the ADR Drafter workflow and cite source-system evidence for every claim.",
    expectedAnswer: [
      "uses canonical source-system tools",
      "cites the governing document",
      "names the next operator action",
    ],
    assertions: [
      "canonical source-system tool names",
      "minimum row policy met",
      "audit trail emitted on actions",
      "evidence_lookup invoked before recommendations",
    ],
  },
  behaviorContract: behaviorContract,
};

export const ADRDrafter = () => (
  <UseCaseSlide
    title="ADR Drafter"
    subtitle="A-4401 • Enterprise Architecture"
    icon={FileText}
    domainId="domain-44"
    layer="Layer 1: OOTB"
    persona="Enterprise Architect"
    systems={["Confluence", "GitHub", "ServiceNow CMDB", "Vertex AI"]}
    kpis={[
      { label: "ADR drafting time", before: "4-6 hours", after: "20 minutes" },
      { label: "Context coverage", before: "3-4 prior ADRs checked", after: "All ADRs analyzed" },
      { label: "Decision consistency", before: "Ad-hoc review", after: "Pattern-validated" },
    ]}
    triggerType="chat"
    swimlane={swimlane}
    flow={flow}
    architecture={architecture}
    statusQuo={[
      "Architecture decisions documented inconsistently in scattered Confluence pages and email threads.",
      "Architects spend hours searching for prior decisions that may set precedent for new choices.",
      "Options analysis often misses relevant constraints from other systems or prior failures."
    ]}
    agentification={[
      "Gemini retrieves all related ADRs, system context, and technology radar data to build comprehensive decision context.",
      "LLM reasons about architectural trade-offs, evaluating options against real constraints and historical outcomes.",
      "Generates structured ADRs with context, alternatives, and rationale — not just templates, but reasoned decisions."
    ]}
  />
);
