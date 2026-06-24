import React from "react";
import { UseCaseSlide } from "../../../agent/UseCaseSlide";
import { FlowStep } from "../../../agent/ProcessFlow";
import { SwimlaneFlow } from "../../../agent/SwimlaneFlow";
import { AgentArchitecture, UseCaseGenerationSpec, AgentBehaviorContract} from "../../../../types/architecture";
import { Laptop, Database, AlertTriangle, Brain, CheckCircle } from "lucide-react";

const swimlane: SwimlaneFlow = {
  nodes: [
    { id: "s1", label: "Device Event", lane: "system", type: "trigger" },
    { id: "a1", label: "Inventory Scan", lane: "agent", type: "action" },
    { id: "a2", label: "Lifecycle Analysis", lane: "agent", type: "action" },
    { id: "a3", label: "Refresh Plan", lane: "agent", type: "output" },
    { id: "h1", label: "IT Lead Reviews", lane: "human", type: "hitl" },
  ],
  connections: [["s1", "a1"], ["a1", "a2"], ["a2", "a3"], ["a3", "h1"]],
};

const flow: FlowStep[] = [
  { label: "Inventory Collection", icon: Database, description: "Device inventory, age distribution, and warranty status aggregated from MDM and asset systems.", trigger: "Event / Weekly", systems: ["ManageEngine", "Google Workspace"] },
  { label: "Failure Prediction", icon: AlertTriangle, description: "Device failure rates predicted based on age, model, and usage patterns.", systems: ["BigQuery"], integration: "ADK" },
  { label: "Refresh Planning", icon: Brain, description: "Gemini generates phased refresh plan prioritized by failure risk and business impact.", systems: ["Vertex AI"] },
  { label: "Budget Approval", icon: CheckCircle, description: "End User Support Lead reviews refresh plan and budget allocation.", output: "Device Refresh Plan" },
];

const architecture: AgentArchitecture = {
  connections: [
    { system: "ManageEngine", description: "Device inventory, hardware specs, warranty dates, patch status", direction: "bidirectional", protocol: "REST API", category: "erp" },
    { system: "Google Workspace Admin", description: "ChromeOS device management, user-device mappings", direction: "read", protocol: "Workspace API", category: "erp" },
    { system: "Okta", description: "Device trust signals, compliance posture, last authentication", direction: "read", protocol: "REST API", category: "erp" },
    { system: "BigQuery", description: "Device age analytics, failure prediction models, cost tracking", direction: "bidirectional", protocol: "BigQuery SQL", category: "analytics" },
    { system: "Vertex AI (Gemini)", description: "Refresh planning reasoning, budget optimization", direction: "bidirectional", protocol: "gRPC", category: "ai" },
  ],
  pipeline: [
    { label: "Device Census", description: "Aggregate device inventory from ManageEngine and Google Workspace Admin. Enrich with warranty status, hardware specs, OS version, and user department mapping.", systems: ["ManageEngine", "Google Workspace Admin"], layer: "integration", dataIn: "MDM data + asset records + user mappings", dataOut: "Complete device inventory with enrichment" },
    { label: "Failure Risk Modeling", description: "Predict failure likelihood based on device age, model failure history, usage intensity, and hardware diagnostics. Identify devices approaching warranty expiry.", systems: ["BigQuery"], layer: "ml", dataIn: "Device inventory + historical failure data", dataOut: "Risk-scored device fleet with failure predictions" },
    { label: "Refresh Planning", description: "Gemini generates a phased refresh plan considering failure risk, team criticality, budget constraints, and procurement lead times. Prioritizes high-risk, high-impact devices.", systems: ["Vertex AI (Gemini)"], layer: "llm", dataIn: "Risk scores + team priorities + budget", dataOut: "Phased refresh plan with budget projection" },
    { label: "Provisioning Coordination", description: "Coordinate device provisioning and deprovisioning with HR events (new hires, terminations, role changes). Update inventory and asset tracking.", systems: ["ManageEngine", "Okta"], layer: "integration", dataIn: "Approved refresh actions + HR events", dataOut: "Provisioned devices + updated inventory" },
  ],
};


const behaviorContract: AgentBehaviorContract = {
  role: "End User Support Lead agent for the Device Lifecycle Manager workflow",
  primaryObjective: "Gemini predicts device failures based on age, model history, and usage patterns — replacing time-based refresh. LLM generates phased refresh plans that prioritize high-risk, high-impact devices within budget constraints. so the End User Support Lead can move the Device failure rate KPI.",
  inScope: [
    "Gemini predicts device failures based on age, model history, and usage patterns — replacing time-based refresh",
    "LLM generates phased refresh plans that prioritize high-risk, high-impact devices within budget constraints",
    "Proactive replacement eliminates emergency hardware disruptions and reduces help desk ticket volume",
  ],
  outOfScope: [
    "Production deployments outside an approved change window",
    "Irreversible destructive actions on shared infrastructure (DROP, force-delete, key rotation)",
    "Security incident attribution requiring forensics",
  ],
  toolIntents: [
    {
      name: "query_manageengine_manageengine_records",
      kind: "query",
      sourceSystemId: "manageengine",
      description: "Retrieve manageengine records from ManageEngine for the Device Lifecycle Manager workflow.",
      requiredInputs: [
        "lookup_key",
        "date_range",
      ],
      produces: [
        "manageengine_records_records",
        "manageengine_records_summary",
      ],
      evidenceEmitted: [
        "source_system_record",
      ],
    },
    {
      name: "query_google_workspace_accounts",
      kind: "query",
      sourceSystemId: "google_workspace",
      description: "Retrieve accounts from Google Workspace for the Device Lifecycle Manager workflow.",
      requiredInputs: [
        "lookup_key",
        "date_range",
      ],
      produces: [
        "accounts_records",
        "accounts_summary",
      ],
      evidenceEmitted: [
        "source_system_record",
      ],
    },
    {
      name: "query_okta_users",
      kind: "query",
      sourceSystemId: "okta",
      description: "Retrieve users from Okta for the Device Lifecycle Manager workflow.",
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
      description: "Retrieve analytics events from BigQuery for the Device Lifecycle Manager workflow.",
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
      name: "lookup_device_lifecycle_manager_runbook",
      kind: "evidence_lookup",
      sourceSystemId: "bigquery",
      description: "Look up sections of the Device Lifecycle Manager Operations Runbook to cite in narrative output, escalation rationale, and audit evidence.",
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
      name: "action_manageengine_generate",
      kind: "action",
      sourceSystemId: "manageengine",
      description: "Execute the generate step in ManageEngine after the agent has gathered evidence and validated escalation gates.",
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
      claim: "Device failure rate moved from 12% for 4+ yr devices toward < 3% proactive refresh",
      mustCite: [
        "manageengine.manageengine_records",
        "google_workspace.accounts",
      ],
      sourceSystemIds: [
        "manageengine",
        "google_workspace",
      ],
    },
    {
      claim: "Refresh planning cycle moved from 6 weeks annual plan toward Continuous rolling plan",
      mustCite: [
        "manageengine.manageengine_records",
        "google_workspace.accounts",
      ],
      sourceSystemIds: [
        "manageengine",
        "google_workspace",
      ],
    },
  ],
  escalationRules: [
    {
      trigger: "Device failure rate regresses past the 12% for 4+ yr devices baseline by more than 20%",
      action: "escalate_to_human",
      handoffTarget: "End User Support Lead",
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
    "Never fabricate metric values; only publish numbers derived from ManageEngine (and other named systems) entities.",
    "Never bypass End User Support Lead approval on escalation triggers, even when confidence is high.",
    "Never expose individual personal data (PII) in summaries; aggregate or pseudonymise before output.",
    "Never act on data older than the staleness threshold defined in the runbook without a fresh re-query.",
  ],
  goldenEvals: [
    {
      id: "device-lifecycle-manager-end-to-end",
      prompt: "Run the Device Lifecycle Manager workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.",
      expectedToolCalls: [
        "query_manageengine_manageengine_records",
        "query_google_workspace_accounts",
        "query_okta_users",
        "query_bigquery_analytics_events",
        "lookup_device_lifecycle_manager_runbook",
        "action_manageengine_generate",
      ],
      mustReferenceEntities: [
        "manageengine_records",
        "accounts",
        "users",
        "analytics_events",
      ],
      mustCiteDocuments: [
        "device-lifecycle-manager-runbook",
      ],
      expectedActionOutcome: "Action generate executed against ManageEngine, with audit-trail entry and End User Support Lead notified of outcomes.",
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
    rationale: "Row counts sized for Device Lifecycle Manager so the agent can demonstrate the workflow against realistic transactional volume without simulating a production warehouse.",
  },
  sourceSystems: [
    {
      id: "manageengine",
      name: "ManageEngine",
      owns: [
        "manageengine_records",
        "manageengine_events",
        "manageengine_audit_trail",
      ],
      protocol: "REST API",
      localBacking: [
        "alloydb",
      ],
      toolNames: [
        "query_manageengine_manageengine_records",
        "query_manageengine_manageengine_events",
        "query_manageengine_manageengine_audit_trail",
      ],
      evidence: [
        "source_system_record",
        "generated_audit_trail",
      ],
    },
    {
      id: "google_workspace",
      name: "Google Workspace",
      owns: [
        "accounts",
        "group_memberships",
        "license_assignments",
      ],
      protocol: "Workspace API",
      localBacking: [
        "alloydb",
      ],
      toolNames: [
        "query_google_workspace_accounts",
        "query_google_workspace_group_memberships",
        "query_google_workspace_license_assignments",
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
      name: "manageengine_records",
      sourceSystemId: "manageengine",
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
      name: "manageengine_events",
      sourceSystemId: "manageengine",
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
          name: "manageengine_record_id",
          type: "ref",
          ref: "manageengine_records.id",
          required: true,
        },
      ],
    },
    {
      name: "manageengine_audit_trail",
      sourceSystemId: "manageengine",
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
      name: "accounts",
      sourceSystemId: "google_workspace",
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
          name: "account_name",
          type: "company.name",
          required: true,
        },
        {
          name: "amount",
          type: "number",
          min: 5000,
          max: 1000000,
          required: true,
        },
        {
          name: "stage",
          type: "enum",
          values: [
            "prospecting",
            "qualification",
            "proposal",
            "negotiation",
            "closed_won",
            "closed_lost",
          ],
          required: true,
        },
        {
          name: "owner",
          type: "person.fullName",
          required: true,
        },
        {
          name: "close_date",
          type: "date",
          required: true,
        },
      ],
    },
    {
      name: "group_memberships",
      sourceSystemId: "google_workspace",
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
      name: "license_assignments",
      sourceSystemId: "google_workspace",
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
      from: "manageengine_events.manageengine_record_id",
      to: "manageengine_records.id",
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
      id: "device-lifecycle-manager-runbook",
      sourceSystemId: "bigquery",
      type: "runbook",
      title: "Device Lifecycle Manager Operations Runbook",
      requiredSections: [
        "Detection signals",
        "Triage procedures",
        "Remediation actions",
        "Rollback criteria",
        "Post-incident review",
      ],
      linkedEntities: [
        "manageengine_records",
        "manageengine_events",
        "manageengine_audit_trail",
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
      id: "manageengine_generate_api",
      sourceSystemId: "manageengine",
      method: "POST",
      path: "/api/manageengine/generate",
      description: "Synchronous endpoint the agent calls to generate in ManageEngine after evidence gating.",
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
      id: "device-lifecycle-manager-baseline-gap",
      description: "Seed a realistic gap where Device failure rate sits between 12% for 4+ yr devices and < 3% proactive refresh, so the agent can detect, narrate, and recommend remediation.",
      affectedEntities: [
        "manageengine_records",
        "manageengine_events",
      ],
      discoveryPath: [
        "Inspect ManageEngine records for the affected entities",
        "Compare against Google Workspace historical baseline",
        "Generate a citation-backed recommendation",
      ],
      expectedEvidence: [
        "source-system record",
        "historical baseline metric",
        "generated audit trail",
      ],
      expectedRecommendation: "Explain the gap, cite supporting evidence, and propose the next End User Support Lead action.",
    },
  ],
  datastorePackaging: {
    alloydb: {
      database: "device_lifecycle_manager",
      schemas: [
        "manageengine",
        "google_workspace",
        "okta",
      ],
    },
    bigquery: {
      dataset: "it_device_lifecycle_manager",
      tables: [
        "kpi_summary",
        "evidence_index",
      ],
    },
    cloudStorage: {
      bucketSuffix: "device-lifecycle-manager-evidence",
      prefixes: [
        "documents",
        "audit-trails",
        "exports",
      ],
    },
    apis: {
      serviceName: "device-lifecycle-manager-source-adapters",
      deploymentTarget: "cloud_run",
    },
  },
  validation: {
    smokePrompt: "Run the Device Lifecycle Manager workflow and cite source-system evidence for every claim.",
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

export const DeviceLifecycleManager = () => (
  <UseCaseSlide
    title="Device Lifecycle Manager"
    subtitle="A-4601 • End User Computing"
    icon={Laptop}
    domainId="domain-46"
    layer="Layer 2: Agent Designer"
    persona="End User Support Lead"
    systems={["ManageEngine", "Google Workspace", "Okta", "BigQuery", "Vertex AI"]}
    kpis={[
      { label: "Device failure rate", before: "12% for 4+ yr devices", after: "< 3% proactive refresh" },
      { label: "Refresh planning cycle", before: "6 weeks annual plan", after: "Continuous rolling plan" },
      { label: "Hardware ticket volume", before: "45 tickets/month", after: "15 tickets/month" },
    ]}
    triggerType="event"
    swimlane={swimlane}
    flow={flow}
    architecture={architecture}
    statusQuo={[
      "Device refresh based on a fixed 4-year cycle regardless of actual condition or user need.",
      "Hardware failures disrupt productivity — users wait 3-5 days for replacement while critical work stalls.",
      "Inventory data scattered across MDM, asset tracking, and procurement systems with no unified view."
    ]}
    agentification={[
      "Gemini predicts device failures based on age, model history, and usage patterns — replacing time-based refresh.",
      "LLM generates phased refresh plans that prioritize high-risk, high-impact devices within budget constraints.",
      "Proactive replacement eliminates emergency hardware disruptions and reduces help desk ticket volume."
    ]}
  />
);
