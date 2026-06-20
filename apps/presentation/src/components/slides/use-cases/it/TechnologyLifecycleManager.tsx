import React from "react";
import { UseCaseSlide } from "../../../agent/UseCaseSlide";
import { FlowStep } from "../../../agent/ProcessFlow";
import { SwimlaneFlow } from "../../../agent/SwimlaneFlow";
import { AgentArchitecture, UseCaseGenerationSpec, AgentBehaviorContract} from "../../../../types/architecture";
import { Clock, Database, AlertTriangle, Brain, CheckCircle } from "lucide-react";

const swimlane: SwimlaneFlow = {
  nodes: [
    { id: "s1", label: "Quarterly Cycle", lane: "system", type: "trigger" },
    { id: "a1", label: "Version Scan", lane: "agent", type: "action" },
    { id: "a2", label: "EOL Analysis", lane: "agent", type: "action" },
    { id: "a3", label: "Migration Plan", lane: "agent", type: "output" },
    { id: "h1", label: "Architect Approves", lane: "human", type: "hitl" },
  ],
  connections: [["s1", "a1"], ["a1", "a2"], ["a2", "a3"], ["a3", "h1"]],
};

const flow: FlowStep[] = [
  { label: "Version Discovery", icon: Database, description: "Technology versions, EOL dates, and license status aggregated across all systems.", trigger: "Quarterly", systems: ["ServiceNow CMDB", "ServiceNow SAM"] },
  { label: "Risk Scoring", icon: AlertTriangle, description: "EOL risk scoring with migration effort estimation and dependency analysis.", systems: ["BigQuery", "LeanIX"], integration: "ADK" },
  { label: "Migration Planning", icon: Brain, description: "Migration path recommendations with sequencing, effort estimates, and risk trade-offs.", systems: ["Vertex AI"] },
  { label: "Sunset Approval", icon: CheckCircle, description: "Enterprise Architect approves sunset decisions and migration timelines.", output: "Technology Migration Plan" },
];

const architecture: AgentArchitecture = {
  connections: [
    { system: "ServiceNow CMDB", description: "Application inventory, technology versions, infrastructure mappings", direction: "read", protocol: "REST API", category: "erp" },
    { system: "ServiceNow SAM", description: "License entitlements, software usage data, vendor EOL notices", direction: "read", protocol: "REST API", category: "erp" },
    { system: "LeanIX", description: "Application portfolio, technology radar, lifecycle status", direction: "bidirectional", protocol: "REST API", category: "erp" },
    { system: "BigQuery", description: "Technology age distribution, migration effort history, risk analytics", direction: "bidirectional", protocol: "BigQuery SQL", category: "analytics" },
    { system: "Vertex AI (Gemini)", description: "Migration path reasoning, risk narrative generation", direction: "bidirectional", protocol: "gRPC", category: "ai" },
  ],
  pipeline: [
    { label: "Technology Census", description: "Scan CMDB and SAM for all technology versions in use. Cross-reference with vendor EOL announcements and LeanIX lifecycle status to build a complete technology age map.", systems: ["ServiceNow CMDB", "ServiceNow SAM", "LeanIX"], layer: "integration", dataIn: "CMDB records + license data + vendor notices", dataOut: "Technology version inventory with EOL dates" },
    { label: "Risk & Effort Scoring", description: "Score each technology by EOL proximity, security exposure, dependency count, and migration complexity. Estimate effort based on historical migration data.", systems: ["BigQuery"], layer: "ml", dataIn: "Version inventory + historical migrations", dataOut: "Risk-scored technology portfolio" },
    { label: "Migration Path Generation", description: "Gemini reasons about optimal migration sequencing — which technologies to sunset first based on risk, dependency ordering, team capacity, and business impact. Generates migration plans with phasing.", systems: ["Vertex AI (Gemini)"], layer: "llm", dataIn: "Risk scores + dependencies + capacity", dataOut: "Prioritized migration plan with rationale" },
    { label: "Portfolio Update", description: "Update LeanIX with approved lifecycle decisions, migration timelines, and sunset dates. Notify affected teams.", systems: ["LeanIX", "ServiceNow CMDB"], layer: "integration", dataIn: "Approved migration decisions", dataOut: "Updated technology portfolio" },
  ],
};


const behaviorContract: AgentBehaviorContract = {
  role: "Enterprise Architect agent for the Technology Lifecycle Manager workflow",
  primaryObjective: "Gemini maintains a live technology census across CMDB, SAM, and code repositories with automatic EOL tracking. LLM reasons about migration sequencing — considering dependencies, team capacity, and business impact. so the Enterprise Architect can move the EOL technology exposure KPI.",
  inScope: [
    "Gemini maintains a live technology census across CMDB, SAM, and code repositories with automatic EOL tracking",
    "LLM reasons about migration sequencing — considering dependencies, team capacity, and business impact",
    "Generates phased migration plans with effort estimates validated against historical migration data",
  ],
  outOfScope: [
    "Production deployments outside an approved change window",
    "Irreversible destructive actions on shared infrastructure (DROP, force-delete, key rotation)",
    "Security incident attribution requiring forensics",
  ],
  toolIntents: [
    {
      name: "query_servicenow_cmdb_tickets",
      kind: "query",
      sourceSystemId: "servicenow_cmdb",
      description: "Retrieve tickets from ServiceNow CMDB for the Technology Lifecycle Manager workflow.",
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
      name: "query_servicenow_sam_tickets",
      kind: "query",
      sourceSystemId: "servicenow_sam",
      description: "Retrieve tickets from ServiceNow SAM for the Technology Lifecycle Manager workflow.",
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
      name: "query_leanix_leanix_records",
      kind: "query",
      sourceSystemId: "leanix",
      description: "Retrieve leanix records from LeanIX for the Technology Lifecycle Manager workflow.",
      requiredInputs: [
        "lookup_key",
        "date_range",
      ],
      produces: [
        "leanix_records_records",
        "leanix_records_summary",
      ],
      evidenceEmitted: [
        "source_system_record",
      ],
    },
    {
      name: "query_bigquery_analytics_events",
      kind: "query",
      sourceSystemId: "bigquery",
      description: "Retrieve analytics events from BigQuery for the Technology Lifecycle Manager workflow.",
      requiredInputs: [
        "lookup_key",
        "date_range",
      ],
      produces: [
        "analytics_events_records",
        "analytics_events_summary",
      ],
      evidenceEmitted: [
        "sql_result",
      ],
    },
    {
      name: "lookup_technology_lifecycle_manager_runbook",
      kind: "evidence_lookup",
      sourceSystemId: "bigquery",
      description: "Look up sections of the Technology Lifecycle Manager Operations Runbook to cite in narrative output, escalation rationale, and audit evidence.",
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
      name: "action_servicenow_cmdb_generate",
      kind: "action",
      sourceSystemId: "servicenow_cmdb",
      description: "Execute the generate step in ServiceNow CMDB after the agent has gathered evidence and validated escalation gates.",
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
      claim: "EOL technology exposure moved from Discovered reactively toward Tracked proactively",
      mustCite: [
        "servicenow_cmdb.tickets",
        "servicenow_sam.tickets",
      ],
      sourceSystemIds: [
        "servicenow_cmdb",
        "servicenow_sam",
      ],
    },
    {
      claim: "Migration planning time moved from 2-3 weeks toward 2 days",
      mustCite: [
        "servicenow_cmdb.tickets",
        "servicenow_sam.tickets",
      ],
      sourceSystemIds: [
        "servicenow_cmdb",
        "servicenow_sam",
      ],
    },
  ],
  escalationRules: [
    {
      trigger: "EOL technology exposure regresses past the Discovered reactively baseline by more than 20%",
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
    "Never fabricate metric values; only publish numbers derived from ServiceNow CMDB (and other named systems) entities.",
    "Never bypass Enterprise Architect approval on escalation triggers, even when confidence is high.",
    "Never expose individual personal data (PII) in summaries; aggregate or pseudonymise before output.",
    "Never act on data older than the staleness threshold defined in the runbook without a fresh re-query.",
  ],
  goldenEvals: [
    {
      id: "technology-lifecycle-manager-end-to-end",
      prompt: "Run the Technology Lifecycle Manager workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.",
      expectedToolCalls: [
        "query_servicenow_cmdb_tickets",
        "query_servicenow_sam_tickets",
        "query_leanix_leanix_records",
        "query_bigquery_analytics_events",
        "lookup_technology_lifecycle_manager_runbook",
        "action_servicenow_cmdb_generate",
      ],
      mustReferenceEntities: [
        "tickets",
        "tickets",
        "leanix_records",
        "analytics_events",
      ],
      mustCiteDocuments: [
        "technology-lifecycle-manager-runbook",
      ],
      expectedActionOutcome: "Action generate executed against ServiceNow CMDB, with audit-trail entry and Enterprise Architect notified of outcomes.",
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
    rationale: "Row counts sized for Technology Lifecycle Manager so the agent can demonstrate the workflow against realistic transactional volume without simulating a production warehouse.",
  },
  sourceSystems: [
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
    {
      id: "servicenow_sam",
      name: "ServiceNow SAM",
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
        "query_servicenow_sam_tickets",
        "query_servicenow_sam_change_requests",
        "query_servicenow_sam_incidents",
      ],
      evidence: [
        "source_system_record",
        "generated_audit_trail",
      ],
    },
    {
      id: "leanix",
      name: "LeanIX",
      owns: [
        "leanix_records",
        "leanix_events",
        "leanix_audit_trail",
      ],
      protocol: "REST API",
      localBacking: [
        "alloydb",
      ],
      toolNames: [
        "query_leanix_leanix_records",
        "query_leanix_leanix_events",
        "query_leanix_leanix_audit_trail",
      ],
      evidence: [
        "source_system_record",
        "generated_audit_trail",
      ],
    },
    {
      id: "bigquery",
      name: "BigQuery",
      owns: [
        "analytics_events",
        "historical_metrics",
        "cached_aggregates",
      ],
      protocol: "BigQuery SQL",
      localBacking: [
        "bigquery",
      ],
      toolNames: [
        "query_bigquery_analytics_events",
        "query_bigquery_historical_metrics",
        "query_bigquery_cached_aggregates",
      ],
      evidence: [
        "source_system_record",
        "generated_audit_trail",
      ],
    },
  ],
  entities: [
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
    {
      name: "leanix_records",
      sourceSystemId: "leanix",
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
      name: "leanix_events",
      sourceSystemId: "leanix",
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
          name: "actor",
          type: "person.fullName",
          required: true,
        },
        {
          name: "action",
          type: "enum",
          values: [
            "create",
            "update",
            "delete",
            "approve",
            "reject",
            "escalate",
            "view",
            "share",
          ],
          required: true,
        },
        {
          name: "target_type",
          type: "lorem.words",
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
        {
          name: "leanix_record_id",
          type: "ref",
          ref: "leanix_records.id",
          required: true,
        },
      ],
    },
    {
      name: "leanix_audit_trail",
      sourceSystemId: "leanix",
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
          name: "actor",
          type: "person.fullName",
          required: true,
        },
        {
          name: "action",
          type: "enum",
          values: [
            "create",
            "update",
            "delete",
            "approve",
            "reject",
            "escalate",
            "view",
            "share",
          ],
          required: true,
        },
        {
          name: "target_type",
          type: "lorem.words",
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
      name: "analytics_events",
      sourceSystemId: "bigquery",
      datastore: "bigquery",
      rowCount: 60,
      primaryKey: "id",
      columns: [
        {
          name: "id",
          type: "seq",
          required: true,
        },
        {
          name: "period",
          type: "enum",
          values: [
            "day",
            "week",
            "month",
            "quarter",
          ],
          required: true,
        },
        {
          name: "metric_name",
          type: "lorem.words",
          required: true,
        },
        {
          name: "value",
          type: "float",
          min: 0,
          max: 100000,
          decimals: 2,
          required: true,
        },
        {
          name: "variance_pct",
          type: "float",
          min: -50,
          max: 50,
          decimals: 2,
          required: true,
        },
        {
          name: "computed_at",
          type: "date",
          required: true,
        },
        {
          name: "historical_metric_id",
          type: "ref",
          ref: "historical_metrics.id",
          required: true,
        },
      ],
    },
    {
      name: "historical_metrics",
      sourceSystemId: "bigquery",
      datastore: "bigquery",
      rowCount: 60,
      primaryKey: "id",
      columns: [
        {
          name: "id",
          type: "seq",
          required: true,
        },
        {
          name: "period",
          type: "enum",
          values: [
            "day",
            "week",
            "month",
            "quarter",
          ],
          required: true,
        },
        {
          name: "metric_name",
          type: "lorem.words",
          required: true,
        },
        {
          name: "value",
          type: "float",
          min: 0,
          max: 100000,
          decimals: 2,
          required: true,
        },
        {
          name: "variance_pct",
          type: "float",
          min: -50,
          max: 50,
          decimals: 2,
          required: true,
        },
        {
          name: "computed_at",
          type: "date",
          required: true,
        },
      ],
    },
    {
      name: "cached_aggregates",
      sourceSystemId: "bigquery",
      datastore: "bigquery",
      rowCount: 60,
      primaryKey: "id",
      columns: [
        {
          name: "id",
          type: "seq",
          required: true,
        },
        {
          name: "period",
          type: "enum",
          values: [
            "day",
            "week",
            "month",
            "quarter",
          ],
          required: true,
        },
        {
          name: "metric_name",
          type: "lorem.words",
          required: true,
        },
        {
          name: "value",
          type: "float",
          min: 0,
          max: 100000,
          decimals: 2,
          required: true,
        },
        {
          name: "variance_pct",
          type: "float",
          min: -50,
          max: 50,
          decimals: 2,
          required: true,
        },
        {
          name: "computed_at",
          type: "date",
          required: true,
        },
      ],
    },
  ],
  relationships: [
    {
      from: "leanix_events.leanix_record_id",
      to: "leanix_records.id",
      cardinality: "many-to-one",
      orphanPolicy: "none",
    },
    {
      from: "analytics_events.historical_metric_id",
      to: "historical_metrics.id",
      cardinality: "many-to-one",
      orphanPolicy: "none",
    },
  ],
  documents: [
    {
      id: "technology-lifecycle-manager-runbook",
      sourceSystemId: "bigquery",
      type: "runbook",
      title: "Technology Lifecycle Manager Operations Runbook",
      requiredSections: [
        "Detection signals",
        "Triage procedures",
        "Remediation actions",
        "Rollback criteria",
        "Post-incident review",
      ],
      linkedEntities: [
        "tickets",
        "change_requests",
        "incidents",
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
      id: "servicenow_cmdb_generate_api",
      sourceSystemId: "servicenow_cmdb",
      method: "POST",
      path: "/api/servicenow_cmdb/generate",
      description: "Synchronous endpoint the agent calls to generate in ServiceNow CMDB after evidence gating.",
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
      id: "technology-lifecycle-manager-baseline-gap",
      description: "Seed a realistic gap where EOL technology exposure sits between Discovered reactively and Tracked proactively, so the agent can detect, narrate, and recommend remediation.",
      affectedEntities: [
        "tickets",
        "change_requests",
      ],
      discoveryPath: [
        "Inspect ServiceNow CMDB records for the affected entities",
        "Compare against ServiceNow SAM historical baseline",
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
      database: "technology_lifecycle_manager",
      schemas: [
        "servicenow_cmdb",
        "servicenow_sam",
        "leanix",
      ],
    },
    bigquery: {
      dataset: "it_technology_lifecycle_manager",
      tables: [
        "kpi_summary",
        "evidence_index",
      ],
    },
    cloudStorage: {
      bucketSuffix: "technology-lifecycle-manager-evidence",
      prefixes: [
        "documents",
        "audit-trails",
        "exports",
      ],
    },
    apis: {
      serviceName: "technology-lifecycle-manager-source-adapters",
      deploymentTarget: "cloud_run",
    },
  },
  validation: {
    smokePrompt: "Run the Technology Lifecycle Manager workflow and cite source-system evidence for every claim.",
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

export const TechnologyLifecycleManager = () => (
  <UseCaseSlide
    title="Technology Lifecycle Manager"
    subtitle="A-4404 • Enterprise Architecture"
    icon={Clock}
    domainId="domain-44"
    layer="Layer 3: Custom ADK"
    persona="Enterprise Architect"
    systems={["ServiceNow CMDB", "ServiceNow SAM", "LeanIX", "BigQuery", "Vertex AI"]}
    kpis={[
      { label: "EOL technology exposure", before: "Discovered reactively", after: "Tracked proactively" },
      { label: "Migration planning time", before: "2-3 weeks", after: "2 days" },
      { label: "Unsupported tech in production", before: "18% of stack", after: "< 3%" },
    ]}
    triggerType="scheduled"
    swimlane={swimlane}
    flow={flow}
    architecture={architecture}
    hitl={{ actor: "Enterprise Architect", action: "Approve sunset decisions", description: "Enterprise Architect validates migration priorities, approves sunset timelines, and confirms resource allocation for technology transitions." }}
    statusQuo={[
      "Technology versions tracked in spreadsheets that go stale within weeks of creation.",
      "EOL risks discovered only when vendor support ends or a security vulnerability forces emergency migration.",
      "Migration planning is reactive — driven by incidents rather than strategic lifecycle management."
    ]}
    agentification={[
      "Gemini maintains a live technology census across CMDB, SAM, and code repositories with automatic EOL tracking.",
      "LLM reasons about migration sequencing — considering dependencies, team capacity, and business impact.",
      "Generates phased migration plans with effort estimates validated against historical migration data."
    ]}
  />
);
