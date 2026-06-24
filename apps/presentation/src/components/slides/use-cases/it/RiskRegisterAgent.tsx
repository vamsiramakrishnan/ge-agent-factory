import React from "react";
import { UseCaseSlide } from "../../../agent/UseCaseSlide";
import { FlowStep } from "../../../agent/ProcessFlow";
import { SwimlaneFlow } from "../../../agent/SwimlaneFlow";
import { AgentArchitecture, UseCaseGenerationSpec, AgentBehaviorContract} from "../../../../types/architecture";
import { AlertTriangle, Database, TrendingUp, Brain, CheckCircle } from "lucide-react";

const swimlane: SwimlaneFlow = {
  nodes: [
    { id: "s1", label: "Monthly / New Risk", lane: "system", type: "trigger" },
    { id: "a1", label: "KRI Monitoring", lane: "agent", type: "action" },
    { id: "a2", label: "Risk Scoring", lane: "agent", type: "action" },
    { id: "a3", label: "Risk Report", lane: "agent", type: "output" },
    { id: "h1", label: "GRC Lead Approves", lane: "human", type: "hitl" },
  ],
  connections: [["s1", "a1"], ["a1", "a2"], ["a2", "a3"], ["a3", "h1"]],
};

const flow: FlowStep[] = [
  { label: "KRI Collection", icon: TrendingUp, description: "Key Risk Indicators collected from security, infrastructure, and compliance systems.", trigger: "Monthly / Event", systems: ["ServiceNow GRC"] },
  { label: "Risk Assessment", icon: Database, description: "Risks scored on likelihood x impact with control effectiveness weighting.", systems: ["RSA Archer", "BigQuery"], integration: "ADK" },
  { label: "Context & Trends", icon: Brain, description: "Gemini contextualizes risk changes with business events and recommends treatment updates.", systems: ["Vertex AI"] },
  { label: "GRC Approval", icon: CheckCircle, description: "GRC Lead reviews risk ratings, approves treatment plans, and escalates critical risks.", output: "IT Risk Register Report" },
];

const architecture: AgentArchitecture = {
  connections: [
    { system: "ServiceNow GRC", description: "Risk register, risk treatments, KRI definitions, assessment history", direction: "bidirectional", protocol: "REST API", category: "erp" },
    { system: "RSA Archer", description: "Risk library, control mapping, regulatory requirements", direction: "read", protocol: "REST API", category: "erp" },
    { system: "BigQuery", description: "KRI trending, risk correlation analytics, control effectiveness data", direction: "bidirectional", protocol: "BigQuery SQL", category: "analytics" },
    { system: "Vertex AI (Gemini)", description: "Risk contextualization, treatment recommendation reasoning", direction: "bidirectional", protocol: "gRPC", category: "ai" },
  ],
  pipeline: [
    { label: "KRI Aggregation", description: "Collect Key Risk Indicators from across IT operations: vulnerability counts, incident rates, compliance scores, cloud spend variance, access review completion rates. Compare against thresholds.", systems: ["ServiceNow GRC", "RSA Archer"], layer: "integration", dataIn: "KRI feeds from security, infra, compliance", dataOut: "KRI dashboard with threshold status" },
    { label: "Risk Scoring", description: "Score each risk using likelihood x impact matrix with control effectiveness weighting. Calculate residual risk after treatment effectiveness. Detect risks trending toward threshold breach.", systems: ["BigQuery"], layer: "ml", dataIn: "KRI data + control effectiveness + impact models", dataOut: "Scored risk register with trend indicators" },
    { label: "Risk Contextualization", description: "Gemini explains risk score changes with business context — connecting cloud concentration risk to the delayed multi-cloud migration, or vendor risk to upcoming contract renewals. Recommends treatment adjustments.", systems: ["Vertex AI (Gemini)"], layer: "llm", dataIn: "Scored risks + business context + events", dataOut: "Contextualized risk report with treatment recommendations" },
    { label: "Register Update", description: "Update risk register in ServiceNow GRC with new scores, treatment recommendations, and KRI trends. Generate board-ready risk summary.", systems: ["ServiceNow GRC"], layer: "integration", dataIn: "Approved risk assessments", dataOut: "Updated risk register + board report" },
  ],
};


const behaviorContract: AgentBehaviorContract = {
  role: "Compliance & GRC Lead agent for the Risk Register Agent workflow",
  primaryObjective: "Gemini continuously monitors KRIs and automatically detects risks trending toward threshold breach. LLM contextualizes risk score changes with business events, making risk reports actionable rather than abstract. so the Compliance & GRC Lead can move the Risk register freshness KPI.",
  inScope: [
    "Gemini continuously monitors KRIs and automatically detects risks trending toward threshold breach",
    "LLM contextualizes risk score changes with business events, making risk reports actionable rather than abstract",
    "Active treatment tracking ensures every identified risk has a current, assigned remediation plan",
  ],
  outOfScope: [
    "Production deployments outside an approved change window",
    "Irreversible destructive actions on shared infrastructure (DROP, force-delete, key rotation)",
    "Security incident attribution requiring forensics",
  ],
  toolIntents: [
    {
      name: "query_servicenow_grc_tickets",
      kind: "query",
      sourceSystemId: "servicenow_grc",
      description: "Retrieve tickets from ServiceNow GRC for the Risk Register Agent workflow.",
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
      name: "query_rsa_archer_rsa_archer_records",
      kind: "query",
      sourceSystemId: "rsa_archer",
      description: "Retrieve rsa archer records from RSA Archer for the Risk Register Agent workflow.",
      requiredInputs: [
        "lookup_key",
        "date_range",
      ],
      produces: [
        "rsa_archer_records_records",
        "rsa_archer_records_summary",
      ],
      evidenceEmitted: [
        "source_system_record",
      ],
    },
    {
      name: "query_bigquery_analytics_events",
      kind: "query",
      sourceSystemId: "bigquery",
      description: "Retrieve analytics events from BigQuery for the Risk Register Agent workflow.",
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
      name: "lookup_risk_register_agent_runbook",
      kind: "evidence_lookup",
      sourceSystemId: "bigquery",
      description: "Look up sections of the Risk Register Agent Operations Runbook to cite in narrative output, escalation rationale, and audit evidence.",
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
      name: "action_servicenow_grc_assign",
      kind: "action",
      sourceSystemId: "servicenow_grc",
      description: "Execute the assign step in ServiceNow GRC after the agent has gathered evidence and validated escalation gates.",
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
      claim: "Risk register freshness moved from Updated quarterly toward Continuously current",
      mustCite: [
        "servicenow_grc.tickets",
        "rsa_archer.rsa_archer_records",
      ],
      sourceSystemIds: [
        "servicenow_grc",
        "rsa_archer",
      ],
    },
    {
      claim: "KRI breach detection moved from Manual monthly check toward Proactive alerts",
      mustCite: [
        "servicenow_grc.tickets",
        "rsa_archer.rsa_archer_records",
      ],
      sourceSystemIds: [
        "servicenow_grc",
        "rsa_archer",
      ],
    },
  ],
  escalationRules: [
    {
      trigger: "Risk register freshness regresses past the Updated quarterly baseline by more than 20%",
      action: "escalate_to_human",
      handoffTarget: "Compliance & GRC Lead",
      rationale: "Significant regressions need human judgment before automated remediation runs against production records.",
    },
    {
      trigger: "Source-system evidence is incomplete or stale (>24h) for any required entity",
      action: "request_more_info",
      rationale: "Recommendations grounded in stale evidence misrepresent current state and undermine audit defensibility.",
    },
    {
      trigger: "Proposed assign action lacks supporting evidence from at least two systems",
      action: "refuse",
      rationale: "Single-system evidence is insufficient to authorize external state changes without manual review.",
    },
  ],
  refusalRules: [
    "Never fabricate metric values; only publish numbers derived from ServiceNow GRC (and other named systems) entities.",
    "Never bypass Compliance & GRC Lead approval on escalation triggers, even when confidence is high.",
    "Never expose individual personal data (PII) in summaries; aggregate or pseudonymise before output.",
    "Never act on data older than the staleness threshold defined in the runbook without a fresh re-query.",
  ],
  goldenEvals: [
    {
      id: "risk-register-agent-end-to-end",
      prompt: "Run the Risk Register Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.",
      expectedToolCalls: [
        "query_servicenow_grc_tickets",
        "query_rsa_archer_rsa_archer_records",
        "query_bigquery_analytics_events",
        "lookup_risk_register_agent_runbook",
        "action_servicenow_grc_assign",
      ],
      mustReferenceEntities: [
        "tickets",
        "rsa_archer_records",
        "analytics_events",
      ],
      mustCiteDocuments: [
        "risk-register-agent-runbook",
      ],
      expectedActionOutcome: "Action assign executed against ServiceNow GRC, with audit-trail entry and Compliance & GRC Lead notified of outcomes.",
      forbiddenBehaviors: [
        "do not invent KPI numbers",
        "do not skip the evidence_lookup step before any recommendation",
        "do not execute assign without two-system evidence",
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
    rationale: "Row counts sized for Risk Register Agent so the agent can demonstrate the workflow against realistic transactional volume without simulating a production warehouse.",
  },
  sourceSystems: [
    {
      id: "servicenow_grc",
      name: "ServiceNow GRC",
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
        "query_servicenow_grc_tickets",
        "query_servicenow_grc_change_requests",
        "query_servicenow_grc_incidents",
      ],
      evidence: [
        "source_system_record",
        "generated_audit_trail",
      ],
    },
    {
      id: "rsa_archer",
      name: "RSA Archer",
      owns: [
        "rsa_archer_records",
        "rsa_archer_events",
        "rsa_archer_audit_trail",
      ],
      protocol: "REST API",
      localBacking: [
        "alloydb",
      ],
      toolNames: [
        "query_rsa_archer_rsa_archer_records",
        "query_rsa_archer_rsa_archer_events",
        "query_rsa_archer_rsa_archer_audit_trail",
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
      sourceSystemId: "servicenow_grc",
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
      sourceSystemId: "servicenow_grc",
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
      sourceSystemId: "servicenow_grc",
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
      name: "rsa_archer_records",
      sourceSystemId: "rsa_archer",
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
      name: "rsa_archer_events",
      sourceSystemId: "rsa_archer",
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
          name: "rsa_archer_record_id",
          type: "ref",
          ref: "rsa_archer_records.id",
          required: true,
        },
      ],
    },
    {
      name: "rsa_archer_audit_trail",
      sourceSystemId: "rsa_archer",
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
      from: "rsa_archer_events.rsa_archer_record_id",
      to: "rsa_archer_records.id",
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
      id: "risk-register-agent-runbook",
      sourceSystemId: "bigquery",
      type: "runbook",
      title: "Risk Register Agent Operations Runbook",
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
      id: "servicenow_grc_assign_api",
      sourceSystemId: "servicenow_grc",
      method: "POST",
      path: "/api/servicenow_grc/assign",
      description: "Synchronous endpoint the agent calls to assign in ServiceNow GRC after evidence gating.",
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
      id: "risk-register-agent-baseline-gap",
      description: "Seed a realistic gap where Risk register freshness sits between Updated quarterly and Continuously current, so the agent can detect, narrate, and recommend remediation.",
      affectedEntities: [
        "tickets",
        "change_requests",
      ],
      discoveryPath: [
        "Inspect ServiceNow GRC records for the affected entities",
        "Compare against RSA Archer historical baseline",
        "Generate a citation-backed recommendation",
      ],
      expectedEvidence: [
        "source-system record",
        "historical baseline metric",
        "generated audit trail",
      ],
      expectedRecommendation: "Explain the gap, cite supporting evidence, and propose the next Compliance & GRC Lead action.",
    },
  ],
  datastorePackaging: {
    alloydb: {
      database: "risk_register_agent",
      schemas: [
        "servicenow_grc",
        "rsa_archer",
      ],
    },
    bigquery: {
      dataset: "it_risk_register_agent",
      tables: [
        "kpi_summary",
        "evidence_index",
      ],
    },
    cloudStorage: {
      bucketSuffix: "risk-register-agent-evidence",
      prefixes: [
        "documents",
        "audit-trails",
        "exports",
      ],
    },
    apis: {
      serviceName: "risk-register-agent-source-adapters",
      deploymentTarget: "cloud_run",
    },
  },
  validation: {
    smokePrompt: "Run the Risk Register Agent workflow and cite source-system evidence for every claim.",
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

export const RiskRegisterAgent = () => (
  <UseCaseSlide
    title="Risk Register Agent"
    subtitle="A-4505 • IT Governance & Compliance"
    icon={AlertTriangle}
    domainId="domain-45"
    layer="Layer 3: Custom ADK"
    persona="Compliance & GRC Lead"
    systems={["ServiceNow GRC", "RSA Archer", "BigQuery", "Vertex AI"]}
    kpis={[
      { label: "Risk register freshness", before: "Updated quarterly", after: "Continuously current" },
      { label: "KRI breach detection", before: "Manual monthly check", after: "Proactive alerts" },
      { label: "Risks without treatment", before: "25% unaddressed", after: "< 5% pending" },
    ]}
    triggerType="scheduled"
    swimlane={swimlane}
    flow={flow}
    architecture={architecture}
    hitl={{ actor: "Compliance & GRC Lead", action: "Approve risk ratings", description: "GRC Lead validates risk scores, approves treatment plans, and escalates critical risks to executive risk committee." }}
    statusQuo={[
      "Risk register updated quarterly in a manual exercise — risk scores stale within weeks of assessment.",
      "KRI thresholds breached without detection because monitoring requires manual data collection.",
      "Risk treatment plans are documented but rarely tracked — 25% of risks have no active treatment."
    ]}
    agentification={[
      "Gemini continuously monitors KRIs and automatically detects risks trending toward threshold breach.",
      "LLM contextualizes risk score changes with business events, making risk reports actionable rather than abstract.",
      "Active treatment tracking ensures every identified risk has a current, assigned remediation plan."
    ]}
  />
);
