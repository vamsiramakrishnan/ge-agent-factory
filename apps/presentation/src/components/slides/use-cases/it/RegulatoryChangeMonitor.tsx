import React from "react";
import { UseCaseSlide } from "../../../agent/UseCaseSlide";
import { FlowStep } from "../../../agent/ProcessFlow";
import { SwimlaneFlow } from "../../../agent/SwimlaneFlow";
import { AgentArchitecture, UseCaseGenerationSpec, AgentBehaviorContract} from "../../../../types/architecture";
import { Bell, Globe, Database, Brain, FileText } from "lucide-react";

const swimlane: SwimlaneFlow = {
  nodes: [
    { id: "s1", label: "Weekly Scan", lane: "system", type: "trigger" },
    { id: "a1", label: "Reg Scanning", lane: "agent", type: "action" },
    { id: "a2", label: "Impact Analysis", lane: "agent", type: "action" },
    { id: "a3", label: "Impact Report", lane: "agent", type: "output" },
    { id: "h1", label: "GRC Lead Reviews", lane: "human", type: "hitl" },
  ],
  connections: [["s1", "a1"], ["a1", "a2"], ["a2", "a3"], ["a3", "h1"]],
};

const flow: FlowStep[] = [
  { label: "Regulatory Scan", icon: Globe, description: "Regulatory feeds scanned for new and amended requirements relevant to IT operations.", trigger: "Weekly", systems: ["Thomson Reuters", "OneTrust"] },
  { label: "Applicability Assessment", icon: Database, description: "New regulations assessed for relevance and mapped to existing controls and policies.", systems: ["ServiceNow GRC", "BigQuery"], integration: "ADK" },
  { label: "Impact Reasoning", icon: Brain, description: "Gemini assesses impact on current posture and estimates effort to achieve compliance.", systems: ["Vertex AI"] },
  { label: "Action Planning", icon: FileText, description: "GRC Lead reviews impact assessment and assigns implementation work to affected teams.", output: "Regulatory Impact Assessment" },
];

const architecture: AgentArchitecture = {
  connections: [
    { system: "Thomson Reuters", description: "Regulatory feeds, legal updates, compliance alerts", direction: "read", protocol: "REST API", category: "market-data" },
    { system: "OneTrust", description: "Privacy regulations, consent requirements, regulatory catalog", direction: "read", protocol: "REST API", category: "erp" },
    { system: "ServiceNow GRC", description: "Control framework, policy mapping, compliance requirements", direction: "bidirectional", protocol: "REST API", category: "erp" },
    { system: "Confluence", description: "Internal policies, procedures, standards documentation", direction: "read", protocol: "REST API", category: "collaboration" },
    { system: "BigQuery", description: "Regulatory change analytics, compliance gap trending", direction: "bidirectional", protocol: "BigQuery SQL", category: "analytics" },
    { system: "Vertex AI (Gemini)", description: "Regulatory impact reasoning, effort estimation", direction: "bidirectional", protocol: "gRPC", category: "ai" },
  ],
  pipeline: [
    { label: "Regulatory Scanning", description: "Scan Thomson Reuters feeds and OneTrust regulatory catalog for new and amended regulations. Filter for relevance based on industry, jurisdiction, and IT operations scope.", systems: ["Thomson Reuters", "OneTrust"], layer: "integration", dataIn: "Regulatory feeds + filtering criteria", dataOut: "Relevant regulatory changes" },
    { label: "Control Mapping", description: "Map each regulatory change to existing controls in ServiceNow GRC. Identify which current policies and procedures are affected. Flag gaps where no existing control addresses the new requirement.", systems: ["ServiceNow GRC", "Confluence", "BigQuery"], layer: "ml", dataIn: "Regulatory changes + control framework", dataOut: "Control mapping + gap identification" },
    { label: "Impact Assessment", description: "Gemini assesses the real-world impact of each change — distinguishing between regulations that require new controls vs. minor policy wording updates. Estimates implementation effort based on gap size.", systems: ["Vertex AI (Gemini)"], layer: "llm", dataIn: "Control gaps + existing posture + precedents", dataOut: "Impact assessment with effort estimates" },
    { label: "Notification & Tracking", description: "Notify affected teams with specific action items. Create implementation tasks in ServiceNow. Track compliance timeline against regulatory effective dates.", systems: ["ServiceNow GRC"], layer: "integration", dataIn: "Approved impact assessments", dataOut: "Implementation tasks + compliance timeline" },
  ],
};


const behaviorContract: AgentBehaviorContract = {
  role: "Compliance & GRC Lead agent for the Regulatory Change Monitor workflow",
  primaryObjective: "Gemini scans regulatory feeds weekly and filters for changes relevant to the organization's IT operations. LLM maps new requirements to existing controls, distinguishing between major gaps and minor policy updates. so the Compliance & GRC Lead can move the Regulatory change awareness KPI.",
  inScope: [
    "Gemini scans regulatory feeds weekly and filters for changes relevant to the organization's IT operations",
    "LLM maps new requirements to existing controls, distinguishing between major gaps and minor policy updates",
    "Proactive tracking against regulatory effective dates ensures zero missed compliance deadlines",
  ],
  outOfScope: [
    "Production deployments outside an approved change window",
    "Irreversible destructive actions on shared infrastructure (DROP, force-delete, key rotation)",
    "Security incident attribution requiring forensics",
  ],
  toolIntents: [
    {
      name: "query_thomson_reuters_thomson_reuters_records",
      kind: "query",
      sourceSystemId: "thomson_reuters",
      description: "Retrieve thomson reuters records from Thomson Reuters for the Regulatory Change Monitor workflow.",
      requiredInputs: [
        "lookup_key",
        "date_range",
      ],
      produces: [
        "thomson_reuters_records_records",
        "thomson_reuters_records_summary",
      ],
      evidenceEmitted: [
        "source_system_record",
      ],
    },
    {
      name: "query_onetrust_onetrust_records",
      kind: "query",
      sourceSystemId: "onetrust",
      description: "Retrieve onetrust records from OneTrust for the Regulatory Change Monitor workflow.",
      requiredInputs: [
        "lookup_key",
        "date_range",
      ],
      produces: [
        "onetrust_records_records",
        "onetrust_records_summary",
      ],
      evidenceEmitted: [
        "source_system_record",
      ],
    },
    {
      name: "query_servicenow_grc_tickets",
      kind: "query",
      sourceSystemId: "servicenow_grc",
      description: "Retrieve tickets from ServiceNow GRC for the Regulatory Change Monitor workflow.",
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
      name: "query_bigquery_analytics_events",
      kind: "query",
      sourceSystemId: "bigquery",
      description: "Retrieve analytics events from BigQuery for the Regulatory Change Monitor workflow.",
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
      name: "lookup_regulatory_change_monitor_runbook",
      kind: "evidence_lookup",
      sourceSystemId: "bigquery",
      description: "Look up sections of the Regulatory Change Monitor Operations Runbook to cite in narrative output, escalation rationale, and audit evidence.",
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
      name: "action_thomson_reuters_update",
      kind: "action",
      sourceSystemId: "thomson_reuters",
      description: "Execute the update step in Thomson Reuters after the agent has gathered evidence and validated escalation gates.",
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
      claim: "Regulatory change awareness moved from Reactive discovery toward Proactive weekly scan",
      mustCite: [
        "thomson_reuters.thomson_reuters_records",
        "onetrust.onetrust_records",
      ],
      sourceSystemIds: [
        "thomson_reuters",
        "onetrust",
      ],
    },
    {
      claim: "Impact assessment time moved from 2-3 weeks toward 2-3 days",
      mustCite: [
        "thomson_reuters.thomson_reuters_records",
        "onetrust.onetrust_records",
      ],
      sourceSystemIds: [
        "thomson_reuters",
        "onetrust",
      ],
    },
  ],
  escalationRules: [
    {
      trigger: "Regulatory change awareness regresses past the Reactive discovery baseline by more than 20%",
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
      trigger: "Proposed update action lacks supporting evidence from at least two systems",
      action: "refuse",
      rationale: "Single-system evidence is insufficient to authorize external state changes without manual review.",
    },
  ],
  refusalRules: [
    "Never fabricate metric values; only publish numbers derived from Thomson Reuters (and other named systems) entities.",
    "Never bypass Compliance & GRC Lead approval on escalation triggers, even when confidence is high.",
    "Never expose individual personal data (PII) in summaries; aggregate or pseudonymise before output.",
    "Never act on data older than the staleness threshold defined in the runbook without a fresh re-query.",
  ],
  goldenEvals: [
    {
      id: "regulatory-change-monitor-end-to-end",
      prompt: "Run the Regulatory Change Monitor workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.",
      expectedToolCalls: [
        "query_thomson_reuters_thomson_reuters_records",
        "query_onetrust_onetrust_records",
        "query_servicenow_grc_tickets",
        "query_bigquery_analytics_events",
        "lookup_regulatory_change_monitor_runbook",
        "action_thomson_reuters_update",
      ],
      mustReferenceEntities: [
        "thomson_reuters_records",
        "onetrust_records",
        "tickets",
        "analytics_events",
      ],
      mustCiteDocuments: [
        "regulatory-change-monitor-runbook",
      ],
      expectedActionOutcome: "Action update executed against Thomson Reuters, with audit-trail entry and Compliance & GRC Lead notified of outcomes.",
      forbiddenBehaviors: [
        "do not invent KPI numbers",
        "do not skip the evidence_lookup step before any recommendation",
        "do not execute update without two-system evidence",
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
    rationale: "Row counts sized for Regulatory Change Monitor so the agent can demonstrate the workflow against realistic transactional volume without simulating a production warehouse.",
  },
  sourceSystems: [
    {
      id: "thomson_reuters",
      name: "Thomson Reuters",
      owns: [
        "thomson_reuters_records",
        "thomson_reuters_events",
        "thomson_reuters_audit_trail",
      ],
      protocol: "REST API",
      localBacking: [
        "alloydb",
      ],
      toolNames: [
        "query_thomson_reuters_thomson_reuters_records",
        "query_thomson_reuters_thomson_reuters_events",
        "query_thomson_reuters_thomson_reuters_audit_trail",
      ],
      evidence: [
        "source_system_record",
        "generated_audit_trail",
      ],
    },
    {
      id: "onetrust",
      name: "OneTrust",
      owns: [
        "onetrust_records",
        "onetrust_events",
        "onetrust_audit_trail",
      ],
      protocol: "REST API",
      localBacking: [
        "alloydb",
      ],
      toolNames: [
        "query_onetrust_onetrust_records",
        "query_onetrust_onetrust_events",
        "query_onetrust_onetrust_audit_trail",
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
      name: "thomson_reuters_records",
      sourceSystemId: "thomson_reuters",
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
      name: "thomson_reuters_events",
      sourceSystemId: "thomson_reuters",
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
          name: "thomson_reuters_record_id",
          type: "ref",
          ref: "thomson_reuters_records.id",
          required: true,
        },
      ],
    },
    {
      name: "thomson_reuters_audit_trail",
      sourceSystemId: "thomson_reuters",
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
      name: "onetrust_records",
      sourceSystemId: "onetrust",
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
      name: "onetrust_events",
      sourceSystemId: "onetrust",
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
          name: "onetrust_record_id",
          type: "ref",
          ref: "onetrust_records.id",
          required: true,
        },
      ],
    },
    {
      name: "onetrust_audit_trail",
      sourceSystemId: "onetrust",
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
      from: "thomson_reuters_events.thomson_reuters_record_id",
      to: "thomson_reuters_records.id",
      cardinality: "many-to-one",
      orphanPolicy: "none",
    },
    {
      from: "onetrust_events.onetrust_record_id",
      to: "onetrust_records.id",
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
      id: "regulatory-change-monitor-runbook",
      sourceSystemId: "bigquery",
      type: "runbook",
      title: "Regulatory Change Monitor Operations Runbook",
      requiredSections: [
        "Detection signals",
        "Triage procedures",
        "Remediation actions",
        "Rollback criteria",
        "Post-incident review",
      ],
      linkedEntities: [
        "thomson_reuters_records",
        "thomson_reuters_events",
        "thomson_reuters_audit_trail",
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
      id: "thomson_reuters_update_api",
      sourceSystemId: "thomson_reuters",
      method: "POST",
      path: "/api/thomson_reuters/update",
      description: "Synchronous endpoint the agent calls to update in Thomson Reuters after evidence gating.",
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
      id: "regulatory-change-monitor-baseline-gap",
      description: "Seed a realistic gap where Regulatory change awareness sits between Reactive discovery and Proactive weekly scan, so the agent can detect, narrate, and recommend remediation.",
      affectedEntities: [
        "thomson_reuters_records",
        "thomson_reuters_events",
      ],
      discoveryPath: [
        "Inspect Thomson Reuters records for the affected entities",
        "Compare against OneTrust historical baseline",
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
      database: "regulatory_change_monitor",
      schemas: [
        "thomson_reuters",
        "onetrust",
        "servicenow_grc",
      ],
    },
    bigquery: {
      dataset: "it_regulatory_change_monitor",
      tables: [
        "kpi_summary",
        "evidence_index",
      ],
    },
    cloudStorage: {
      bucketSuffix: "regulatory-change-monitor-evidence",
      prefixes: [
        "documents",
        "audit-trails",
        "exports",
      ],
    },
    apis: {
      serviceName: "regulatory-change-monitor-source-adapters",
      deploymentTarget: "cloud_run",
    },
  },
  validation: {
    smokePrompt: "Run the Regulatory Change Monitor workflow and cite source-system evidence for every claim.",
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

export const RegulatoryChangeMonitor = () => (
  <UseCaseSlide
    title="Regulatory Change Monitor"
    subtitle="A-4506 • IT Governance & Compliance"
    icon={Bell}
    domainId="domain-45"
    layer="Layer 3: Custom ADK"
    persona="Compliance & GRC Lead"
    systems={["Thomson Reuters", "OneTrust", "ServiceNow GRC", "BigQuery", "Vertex AI"]}
    kpis={[
      { label: "Regulatory change awareness", before: "Reactive discovery", after: "Proactive weekly scan" },
      { label: "Impact assessment time", before: "2-3 weeks", after: "2-3 days" },
      { label: "Compliance deadline misses", before: "3-4 per year", after: "Zero" },
    ]}
    triggerType="scheduled"
    swimlane={swimlane}
    flow={flow}
    architecture={architecture}
    statusQuo={[
      "Regulatory changes discovered reactively — through vendor notices, peer conversations, or audit findings.",
      "Impact assessments take weeks because mapping new requirements to existing controls is manual detective work.",
      "Compliance deadlines missed because teams learn about new requirements too late to implement changes."
    ]}
    agentification={[
      "Gemini scans regulatory feeds weekly and filters for changes relevant to the organization's IT operations.",
      "LLM maps new requirements to existing controls, distinguishing between major gaps and minor policy updates.",
      "Proactive tracking against regulatory effective dates ensures zero missed compliance deadlines."
    ]}
  />
);
