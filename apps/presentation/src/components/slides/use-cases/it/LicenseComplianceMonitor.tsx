import React from "react";
import { UseCaseSlide } from "../../../agent/UseCaseSlide";
import { FlowStep } from "../../../agent/ProcessFlow";
import { SwimlaneFlow } from "../../../agent/SwimlaneFlow";
import { AgentArchitecture, UseCaseGenerationSpec, AgentBehaviorContract} from "../../../../types/architecture";
import { CreditCard, Database, AlertTriangle, Brain, BarChart3 } from "lucide-react";

const swimlane: SwimlaneFlow = {
  nodes: [
    { id: "s1", label: "Monthly Cycle", lane: "system", type: "trigger" },
    { id: "a1", label: "Usage Analysis", lane: "agent", type: "action" },
    { id: "a2", label: "Gap Detection", lane: "agent", type: "action" },
    { id: "a3", label: "Compliance Report", lane: "agent", type: "output" },
    { id: "h1", label: "IT Vendor Mgr Reviews", lane: "human", type: "hitl" },
  ],
  connections: [["s1", "a1"], ["a1", "a2"], ["a2", "a3"], ["a3", "h1"]],
};

const flow: FlowStep[] = [
  { label: "Usage Collection", icon: Database, description: "License entitlements compared against actual usage from SAM, SSO, and endpoint data.", trigger: "Monthly", systems: ["ServiceNow SAM", "Zylo"] },
  { label: "Gap Analysis", icon: AlertTriangle, description: "Over/under-licensing detected with true-up cost projections and audit risk scoring.", systems: ["Okta", "BigQuery"], integration: "ADK" },
  { label: "Risk Assessment", icon: Brain, description: "Gemini assesses audit exposure and recommends optimization strategies.", systems: ["Vertex AI"] },
  { label: "Optimization Report", icon: BarChart3, description: "IT Vendor Manager reviews compliance status and approves license optimization actions.", output: "License Compliance Report" },
];

const architecture: AgentArchitecture = {
  connections: [
    { system: "ServiceNow SAM", description: "License entitlements, software inventory, vendor contracts", direction: "read", protocol: "REST API", category: "erp" },
    { system: "Zylo", description: "SaaS subscription data, usage analytics, spend tracking", direction: "read", protocol: "REST API", category: "erp" },
    { system: "Okta", description: "SSO login frequency, user-to-application mapping, last access dates", direction: "read", protocol: "REST API", category: "erp" },
    { system: "BigQuery", description: "Usage vs. entitlement analytics, true-up forecasting, trend analysis", direction: "bidirectional", protocol: "BigQuery SQL", category: "analytics" },
    { system: "Vertex AI (Gemini)", description: "Audit risk reasoning, optimization strategy generation", direction: "bidirectional", protocol: "gRPC", category: "ai" },
  ],
  pipeline: [
    { label: "Entitlement & Usage Merge", description: "Pull license entitlements from ServiceNow SAM, SaaS usage from Zylo, and login frequency from Okta. Build entitlement-vs-usage matrix for every licensed product.", systems: ["ServiceNow SAM", "Zylo", "Okta"], layer: "integration", dataIn: "License contracts + usage telemetry + SSO data", dataOut: "Entitlement-vs-usage matrix" },
    { label: "Compliance Gap Analysis", description: "Identify over-licensed products (wasted spend), under-licensed products (audit risk), and unused licenses (reclaim opportunity). Score audit risk by vendor based on enforcement history.", systems: ["BigQuery"], layer: "ml", dataIn: "Usage matrix + vendor audit patterns", dataOut: "Compliance gaps + risk scores + cost projections" },
    { label: "Optimization Reasoning", description: "Gemini recommends specific actions: negotiate ULA for over-deployed Oracle, reclaim 40 unused Salesforce licenses, migrate analytics workload to BigQuery to eliminate license cost entirely.", systems: ["Vertex AI (Gemini)"], layer: "llm", dataIn: "Gaps + risk scores + contract terms", dataOut: "Optimization recommendations with ROI" },
    { label: "Reporting & Tracking", description: "Generate license compliance dashboard with entitlement coverage, spend optimization opportunities, and audit readiness scores by vendor.", systems: ["BigQuery", "ServiceNow SAM"], layer: "integration", dataIn: "Approved optimization actions", dataOut: "Compliance report + optimization tracker" },
  ],
};


const behaviorContract: AgentBehaviorContract = {
  role: "IT Procurement / Vendor Mgr agent for the License Compliance Monitor workflow",
  primaryObjective: "Gemini merges license entitlements with actual usage data from SAM, Zylo, and Okta into a unified compliance view. LLM reasons about optimization strategies — ULA conversion vs. workload migration vs. license reclamation. so the IT Procurement / Vendor Mgr can move the Audit exposure KPI.",
  inScope: [
    "Gemini merges license entitlements with actual usage data from SAM, Zylo, and Okta into a unified compliance view",
    "LLM reasons about optimization strategies — ULA conversion vs. workload migration vs. license reclamation",
    "Continuous monitoring replaces quarterly spot checks, catching compliance gaps before they become audit findings",
  ],
  outOfScope: [
    "Production deployments outside an approved change window",
    "Irreversible destructive actions on shared infrastructure (DROP, force-delete, key rotation)",
    "Security incident attribution requiring forensics",
  ],
  toolIntents: [
    {
      name: "query_servicenow_sam_tickets",
      kind: "query",
      sourceSystemId: "servicenow_sam",
      description: "Retrieve tickets from ServiceNow SAM for the License Compliance Monitor workflow.",
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
      name: "query_zylo_zylo_records",
      kind: "query",
      sourceSystemId: "zylo",
      description: "Retrieve zylo records from Zylo for the License Compliance Monitor workflow.",
      requiredInputs: [
        "lookup_key",
        "date_range",
      ],
      produces: [
        "zylo_records_records",
        "zylo_records_summary",
      ],
      evidenceEmitted: [
        "source_system_record",
      ],
    },
    {
      name: "query_okta_users",
      kind: "query",
      sourceSystemId: "okta",
      description: "Retrieve users from Okta for the License Compliance Monitor workflow.",
      requiredInputs: [
        "lookup_key",
        "date_range",
      ],
      produces: [
        "users_records",
        "users_summary",
      ],
      evidenceEmitted: [
        "source_system_record",
      ],
    },
    {
      name: "query_bigquery_analytics_events",
      kind: "query",
      sourceSystemId: "bigquery",
      description: "Retrieve analytics events from BigQuery for the License Compliance Monitor workflow.",
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
      name: "lookup_license_compliance_monitor_runbook",
      kind: "evidence_lookup",
      sourceSystemId: "bigquery",
      description: "Look up sections of the License Compliance Monitor Operations Runbook to cite in narrative output, escalation rationale, and audit evidence.",
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
  ],
  evidenceRequirements: [
    {
      claim: "Audit exposure moved from $500K+ true-up risk toward < $50K managed variance",
      mustCite: [
        "servicenow_sam.tickets",
        "zylo.zylo_records",
      ],
      sourceSystemIds: [
        "servicenow_sam",
        "zylo",
      ],
    },
    {
      claim: "Unused license reclaim moved from Manual quarterly review toward Continuous auto-detection",
      mustCite: [
        "servicenow_sam.tickets",
        "zylo.zylo_records",
      ],
      sourceSystemIds: [
        "servicenow_sam",
        "zylo",
      ],
    },
  ],
  escalationRules: [
    {
      trigger: "Audit exposure regresses past the $500K+ true-up risk baseline by more than 20%",
      action: "escalate_to_human",
      handoffTarget: "IT Procurement / Vendor Mgr",
      rationale: "Significant regressions need human judgment before automated remediation runs against production records.",
    },
    {
      trigger: "Source-system evidence is incomplete or stale (>24h) for any required entity",
      action: "request_more_info",
      rationale: "Recommendations grounded in stale evidence misrepresent current state and undermine audit defensibility.",
    },
  ],
  refusalRules: [
    "Never fabricate metric values; only publish numbers derived from ServiceNow SAM (and other named systems) entities.",
    "Never bypass IT Procurement / Vendor Mgr approval on escalation triggers, even when confidence is high.",
    "Never expose individual personal data (PII) in summaries; aggregate or pseudonymise before output.",
    "Never act on data older than the staleness threshold defined in the runbook without a fresh re-query.",
  ],
  goldenEvals: [
    {
      id: "license-compliance-monitor-end-to-end",
      prompt: "Run the License Compliance Monitor workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.",
      expectedToolCalls: [
        "query_servicenow_sam_tickets",
        "query_zylo_zylo_records",
        "query_okta_users",
        "query_bigquery_analytics_events",
        "lookup_license_compliance_monitor_runbook",
      ],
      mustReferenceEntities: [
        "tickets",
        "zylo_records",
        "users",
        "analytics_events",
      ],
      mustCiteDocuments: [
        "license-compliance-monitor-runbook",
      ],
      expectedActionOutcome: "IT Procurement / Vendor Mgr receives a fully-cited recommendation; no external state change without explicit approval.",
      forbiddenBehaviors: [
        "do not invent KPI numbers",
        "do not skip the evidence_lookup step before any recommendation",
        "do not act on single-system evidence",
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
    rationale: "Row counts sized for License Compliance Monitor so the agent can demonstrate the workflow against realistic transactional volume without simulating a production warehouse.",
  },
  sourceSystems: [
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
      id: "zylo",
      name: "Zylo",
      owns: [
        "zylo_records",
        "zylo_events",
        "zylo_audit_trail",
      ],
      protocol: "REST API",
      localBacking: [
        "alloydb",
      ],
      toolNames: [
        "query_zylo_zylo_records",
        "query_zylo_zylo_events",
        "query_zylo_zylo_audit_trail",
      ],
      evidence: [
        "source_system_record",
        "generated_audit_trail",
      ],
    },
    {
      id: "okta",
      name: "Okta",
      owns: [
        "users",
        "groups",
        "access_grants",
      ],
      protocol: "REST API",
      localBacking: [
        "alloydb",
      ],
      toolNames: [
        "query_okta_users",
        "query_okta_groups",
        "query_okta_access_grants",
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
      sourceSystemId: "servicenow_sam",
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
      sourceSystemId: "servicenow_sam",
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
      sourceSystemId: "servicenow_sam",
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
      name: "zylo_records",
      sourceSystemId: "zylo",
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
      name: "zylo_events",
      sourceSystemId: "zylo",
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
          name: "zylo_record_id",
          type: "ref",
          ref: "zylo_records.id",
          required: true,
        },
      ],
    },
    {
      name: "zylo_audit_trail",
      sourceSystemId: "zylo",
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
      name: "users",
      sourceSystemId: "okta",
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
      name: "groups",
      sourceSystemId: "okta",
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
      name: "access_grants",
      sourceSystemId: "okta",
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
      from: "zylo_events.zylo_record_id",
      to: "zylo_records.id",
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
      id: "license-compliance-monitor-runbook",
      sourceSystemId: "bigquery",
      type: "runbook",
      title: "License Compliance Monitor Operations Runbook",
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
  apis: [],
  anomalies: [
    {
      id: "license-compliance-monitor-baseline-gap",
      description: "Seed a realistic gap where Audit exposure sits between $500K+ true-up risk and < $50K managed variance, so the agent can detect, narrate, and recommend remediation.",
      affectedEntities: [
        "tickets",
        "change_requests",
      ],
      discoveryPath: [
        "Inspect ServiceNow SAM records for the affected entities",
        "Compare against Zylo historical baseline",
        "Generate a citation-backed recommendation",
      ],
      expectedEvidence: [
        "source-system record",
        "historical baseline metric",
        "generated audit trail",
      ],
      expectedRecommendation: "Explain the gap, cite supporting evidence, and propose the next IT Procurement / Vendor Mgr action.",
    },
  ],
  datastorePackaging: {
    alloydb: {
      database: "license_compliance_monitor",
      schemas: [
        "servicenow_sam",
        "zylo",
        "okta",
      ],
    },
    bigquery: {
      dataset: "it_license_compliance_monitor",
      tables: [
        "kpi_summary",
        "evidence_index",
      ],
    },
    cloudStorage: {
      bucketSuffix: "license-compliance-monitor-evidence",
      prefixes: [
        "documents",
        "audit-trails",
        "exports",
      ],
    },
    apis: {
      serviceName: "license-compliance-monitor-source-adapters",
      deploymentTarget: "cloud_run",
    },
  },
  validation: {
    smokePrompt: "Run the License Compliance Monitor workflow and cite source-system evidence for every claim.",
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

export const LicenseComplianceMonitor = () => (
  <UseCaseSlide
    title="License Compliance Monitor"
    subtitle="A-4504 • IT Governance & Compliance"
    icon={CreditCard}
    domainId="domain-45"
    layer="Layer 4: Data Agent"
    persona="IT Procurement / Vendor Mgr"
    systems={["ServiceNow SAM", "Zylo", "Okta", "BigQuery", "Vertex AI"]}
    kpis={[
      { label: "Audit exposure", before: "$500K+ true-up risk", after: "< $50K managed variance" },
      { label: "Unused license reclaim", before: "Manual quarterly review", after: "Continuous auto-detection" },
      { label: "License cost optimization", before: "Reactive to renewals", after: "$300K+ annual savings" },
    ]}
    triggerType="scheduled"
    swimlane={swimlane}
    flow={flow}
    architecture={architecture}
    statusQuo={[
      "License compliance checked only at renewal time — audit notices trigger expensive emergency true-ups.",
      "Usage data scattered across SAM, SSO logs, and vendor portals with no unified view.",
      "Unused licenses sit for months because reclaim requires manual review across multiple systems."
    ]}
    agentification={[
      "Gemini merges license entitlements with actual usage data from SAM, Zylo, and Okta into a unified compliance view.",
      "LLM reasons about optimization strategies — ULA conversion vs. workload migration vs. license reclamation.",
      "Continuous monitoring replaces quarterly spot checks, catching compliance gaps before they become audit findings."
    ]}
  />
);
