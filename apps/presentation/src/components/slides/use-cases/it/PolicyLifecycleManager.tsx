import React from "react";
import { UseCaseSlide } from "../../../agent/UseCaseSlide";
import { FlowStep } from "../../../agent/ProcessFlow";
import { SwimlaneFlow } from "../../../agent/SwimlaneFlow";
import { AgentArchitecture, UseCaseGenerationSpec, AgentBehaviorContract} from "../../../../types/architecture";
import { FileText, Clock, Database, Brain, CheckCircle } from "lucide-react";

const swimlane: SwimlaneFlow = {
  nodes: [
    { id: "s1", label: "Review Cycle", lane: "system", type: "trigger" },
    { id: "a1", label: "Policy Scan", lane: "agent", type: "action" },
    { id: "a2", label: "Update Drafting", lane: "agent", type: "action" },
    { id: "a3", label: "Draft Ready", lane: "agent", type: "output" },
    { id: "h1", label: "Owner Approves", lane: "human", type: "hitl" },
  ],
  connections: [["s1", "a1"], ["a1", "a2"], ["a2", "a3"], ["a3", "h1"]],
};

const flow: FlowStep[] = [
  { label: "Review Trigger", icon: Clock, description: "Quarterly review cycle or regulatory change triggers policy review process.", trigger: "Quarterly / Event", systems: ["ServiceNow GRC"] },
  { label: "Gap Analysis", icon: Database, description: "Policies compared against current regulations, recent incidents, and industry standards.", systems: ["Confluence", "BigQuery"], integration: "ADK" },
  { label: "Update Drafting", icon: Brain, description: "Gemini drafts policy updates based on regulatory changes, incident learnings, and industry best practices.", systems: ["Vertex AI"] },
  { label: "Approval & Publish", icon: CheckCircle, description: "Policy owner reviews updates, collects approvals, and publishes to all affected teams.", output: "Updated Policy Document" },
];

const architecture: AgentArchitecture = {
  connections: [
    { system: "Confluence", description: "Policy documents, version history, acknowledgment tracking", direction: "bidirectional", protocol: "REST API", category: "collaboration" },
    { system: "ServiceNow GRC", description: "Policy review schedules, compliance mapping, exception tracking", direction: "bidirectional", protocol: "REST API", category: "erp" },
    { system: "Google Workspace", description: "Policy distribution, acknowledgment collection, notification", direction: "write", protocol: "Workspace API", category: "collaboration" },
    { system: "BigQuery", description: "Policy review analytics, acknowledgment rates, exception trending", direction: "bidirectional", protocol: "BigQuery SQL", category: "analytics" },
    { system: "Vertex AI (Gemini)", description: "Policy drafting, regulatory impact analysis, gap reasoning", direction: "bidirectional", protocol: "gRPC", category: "ai" },
  ],
  pipeline: [
    { label: "Review Triggering", description: "Monitor policy review dates in ServiceNow GRC. Trigger reviews for policies approaching their review deadline or affected by regulatory changes. Prioritize based on risk and compliance impact.", systems: ["ServiceNow GRC"], layer: "integration", dataIn: "Policy review schedule + regulatory feeds", dataOut: "Policies due for review with priority" },
    { label: "Gap Identification", description: "Compare current policy text against latest regulations, recent incident findings, and industry benchmarks. Identify sections that are outdated, contradictory, or missing required content.", systems: ["Confluence", "BigQuery"], layer: "ml", dataIn: "Current policy + regulations + incidents", dataOut: "Gap analysis with specific sections" },
    { label: "Policy Drafting", description: "Gemini drafts policy updates that address identified gaps — incorporating regulatory language, incident learnings, and industry best practices. Maintains the organization's policy tone and structure.", systems: ["Vertex AI (Gemini)"], layer: "llm", dataIn: "Gap analysis + regulatory context", dataOut: "Draft policy updates with change summary" },
    { label: "Distribution & Tracking", description: "Route updated policies through approval workflow. Distribute to affected teams via Google Workspace. Track acknowledgment completion and follow up on outstanding sign-offs.", systems: ["Google Workspace", "ServiceNow GRC"], layer: "integration", dataIn: "Approved policy updates", dataOut: "Published policies + acknowledgment tracking" },
  ],
};


const behaviorContract: AgentBehaviorContract = {
  role: "Compliance & GRC Lead agent for the Policy Lifecycle Manager workflow",
  primaryObjective: "Gemini monitors review dates and regulatory changes to trigger timely policy reviews automatically. LLM drafts policy updates that incorporate regulatory requirements, incident learnings, and industry standards. so the Compliance & GRC Lead can move the Overdue policy reviews KPI.",
  inScope: [
    "Gemini monitors review dates and regulatory changes to trigger timely policy reviews automatically",
    "LLM drafts policy updates that incorporate regulatory requirements, incident learnings, and industry standards",
    "Automated distribution and acknowledgment tracking ensures provable compliance across the organization",
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
      description: "Retrieve pages from Confluence for the Policy Lifecycle Manager workflow.",
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
      name: "query_servicenow_grc_tickets",
      kind: "query",
      sourceSystemId: "servicenow_grc",
      description: "Retrieve tickets from ServiceNow GRC for the Policy Lifecycle Manager workflow.",
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
      name: "query_google_workspace_accounts",
      kind: "query",
      sourceSystemId: "google_workspace",
      description: "Retrieve accounts from Google Workspace for the Policy Lifecycle Manager workflow.",
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
      name: "query_bigquery_analytics_events",
      kind: "query",
      sourceSystemId: "bigquery",
      description: "Retrieve analytics events from BigQuery for the Policy Lifecycle Manager workflow.",
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
      name: "lookup_policy_lifecycle_manager_runbook",
      kind: "evidence_lookup",
      sourceSystemId: "confluence",
      description: "Look up sections of the Policy Lifecycle Manager Operations Runbook to cite in narrative output, escalation rationale, and audit evidence.",
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
      name: "action_confluence_draft",
      kind: "action",
      sourceSystemId: "confluence",
      description: "Execute the draft step in Confluence after the agent has gathered evidence and validated escalation gates.",
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
      claim: "Overdue policy reviews moved from 35% past due toward < 5% past due",
      mustCite: [
        "confluence.pages",
        "servicenow_grc.tickets",
      ],
      sourceSystemIds: [
        "confluence",
        "servicenow_grc",
      ],
    },
    {
      claim: "Policy update cycle moved from 4-6 weeks toward 1 week",
      mustCite: [
        "confluence.pages",
        "servicenow_grc.tickets",
      ],
      sourceSystemIds: [
        "confluence",
        "servicenow_grc",
      ],
    },
  ],
  escalationRules: [
    {
      trigger: "Overdue policy reviews regresses past the 35% past due baseline by more than 20%",
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
      trigger: "Proposed draft action lacks supporting evidence from at least two systems",
      action: "refuse",
      rationale: "Single-system evidence is insufficient to authorize external state changes without manual review.",
    },
  ],
  refusalRules: [
    "Never fabricate metric values; only publish numbers derived from Confluence (and other named systems) entities.",
    "Never bypass Compliance & GRC Lead approval on escalation triggers, even when confidence is high.",
    "Never expose individual personal data (PII) in summaries; aggregate or pseudonymise before output.",
    "Never act on data older than the staleness threshold defined in the runbook without a fresh re-query.",
  ],
  goldenEvals: [
    {
      id: "policy-lifecycle-manager-end-to-end",
      prompt: "Run the Policy Lifecycle Manager workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.",
      expectedToolCalls: [
        "query_confluence_pages",
        "query_servicenow_grc_tickets",
        "query_google_workspace_accounts",
        "query_bigquery_analytics_events",
        "lookup_policy_lifecycle_manager_runbook",
        "action_confluence_draft",
      ],
      mustReferenceEntities: [
        "pages",
        "tickets",
        "accounts",
        "analytics_events",
      ],
      mustCiteDocuments: [
        "policy-lifecycle-manager-runbook",
      ],
      expectedActionOutcome: "Action draft executed against Confluence, with audit-trail entry and Compliance & GRC Lead notified of outcomes.",
      forbiddenBehaviors: [
        "do not invent KPI numbers",
        "do not skip the evidence_lookup step before any recommendation",
        "do not execute draft without two-system evidence",
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
    rationale: "Row counts sized for Policy Lifecycle Manager so the agent can demonstrate the workflow against realistic transactional volume without simulating a production warehouse.",
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
      from: "analytics_events.historical_metric_id",
      to: "historical_metrics.id",
      cardinality: "many-to-one",
      orphanPolicy: "none",
    },
  ],
  documents: [
    {
      id: "policy-lifecycle-manager-runbook",
      sourceSystemId: "bigquery",
      type: "runbook",
      title: "Policy Lifecycle Manager Operations Runbook",
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
      id: "confluence_draft_api",
      sourceSystemId: "confluence",
      method: "POST",
      path: "/api/confluence/draft",
      description: "Synchronous endpoint the agent calls to draft in Confluence after evidence gating.",
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
      id: "policy-lifecycle-manager-baseline-gap",
      description: "Seed a realistic gap where Overdue policy reviews sits between 35% past due and < 5% past due, so the agent can detect, narrate, and recommend remediation.",
      affectedEntities: [
        "pages",
        "comments",
      ],
      discoveryPath: [
        "Inspect Confluence records for the affected entities",
        "Compare against ServiceNow GRC historical baseline",
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
      database: "policy_lifecycle_manager",
      schemas: [
        "confluence",
        "servicenow_grc",
        "google_workspace",
      ],
    },
    bigquery: {
      dataset: "it_policy_lifecycle_manager",
      tables: [
        "kpi_summary",
        "evidence_index",
      ],
    },
    cloudStorage: {
      bucketSuffix: "policy-lifecycle-manager-evidence",
      prefixes: [
        "documents",
        "audit-trails",
        "exports",
      ],
    },
    apis: {
      serviceName: "policy-lifecycle-manager-source-adapters",
      deploymentTarget: "cloud_run",
    },
  },
  validation: {
    smokePrompt: "Run the Policy Lifecycle Manager workflow and cite source-system evidence for every claim.",
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

export const PolicyLifecycleManager = () => (
  <UseCaseSlide
    title="Policy Lifecycle Manager"
    subtitle="A-4503 • IT Governance & Compliance"
    icon={FileText}
    domainId="domain-45"
    layer="Layer 2: Agent Designer"
    persona="Compliance & GRC Lead"
    systems={["Confluence", "ServiceNow GRC", "Google Workspace", "BigQuery", "Vertex AI"]}
    kpis={[
      { label: "Overdue policy reviews", before: "35% past due", after: "< 5% past due" },
      { label: "Policy update cycle", before: "4-6 weeks", after: "1 week" },
      { label: "Employee acknowledgment rate", before: "62%", after: "94%" },
    ]}
    triggerType="scheduled"
    swimlane={swimlane}
    flow={flow}
    architecture={architecture}
    statusQuo={[
      "Policy reviews tracked in spreadsheets — 35% of policies are past their review date at any given time.",
      "Policy updates are manual rewrites that take 4-6 weeks and often miss recent regulatory changes.",
      "Acknowledgment tracking is inconsistent — no reliable way to prove employees received updated policies."
    ]}
    agentification={[
      "Gemini monitors review dates and regulatory changes to trigger timely policy reviews automatically.",
      "LLM drafts policy updates that incorporate regulatory requirements, incident learnings, and industry standards.",
      "Automated distribution and acknowledgment tracking ensures provable compliance across the organization."
    ]}
  />
);
