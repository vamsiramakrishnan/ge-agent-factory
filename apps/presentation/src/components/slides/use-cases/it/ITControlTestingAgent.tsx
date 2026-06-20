import React from "react";
import { UseCaseSlide } from "../../../agent/UseCaseSlide";
import { FlowStep } from "../../../agent/ProcessFlow";
import { SwimlaneFlow } from "../../../agent/SwimlaneFlow";
import { AgentArchitecture, UseCaseGenerationSpec, AgentBehaviorContract} from "../../../../types/architecture";
import { ClipboardCheck, Database, FileText, Brain, CheckCircle } from "lucide-react";

const swimlane: SwimlaneFlow = {
  nodes: [
    { id: "s1", label: "Quarterly Cycle", lane: "system", type: "trigger" },
    { id: "a1", label: "Control Testing", lane: "agent", type: "action" },
    { id: "a2", label: "Evidence Scoring", lane: "agent", type: "action" },
    { id: "a3", label: "Test Workpapers", lane: "agent", type: "output" },
    { id: "h1", label: "GRC Lead Approves", lane: "human", type: "hitl" },
  ],
  connections: [["s1", "a1"], ["a1", "a2"], ["a2", "a3"], ["a3", "h1"]],
};

const flow: FlowStep[] = [
  { label: "Test Execution", icon: ClipboardCheck, description: "Automated control tests executed against SOC 2, ISO 27001, and internal policy requirements.", trigger: "Quarterly", systems: ["ServiceNow GRC"] },
  { label: "Evidence Collection", icon: Database, description: "Evidence artifacts collected from source systems and assessed for completeness.", systems: ["BigQuery", "ServiceNow GRC"], integration: "ADK" },
  { label: "Effectiveness Assessment", icon: Brain, description: "Gemini assesses control evidence quality and identifies partial failures with context.", systems: ["Vertex AI"] },
  { label: "GRC Approval", icon: CheckCircle, description: "GRC Lead reviews test results, approves workpapers, and assigns remediation for gaps.", output: "Control Test Workpapers" },
];

const architecture: AgentArchitecture = {
  connections: [
    { system: "ServiceNow GRC", description: "Control framework, test procedures, historical results, remediation tracking", direction: "bidirectional", protocol: "REST API", category: "erp" },
    { system: "RSA Archer", description: "Risk and control library, compliance requirements mapping", direction: "read", protocol: "REST API", category: "erp" },
    { system: "OneTrust", description: "Privacy controls, regulatory requirements, consent tracking", direction: "read", protocol: "REST API", category: "erp" },
    { system: "BigQuery", description: "Control effectiveness analytics, remediation SLA tracking, trend analysis", direction: "bidirectional", protocol: "BigQuery SQL", category: "analytics" },
    { system: "Vertex AI (Gemini)", description: "Evidence assessment reasoning, control gap analysis", direction: "bidirectional", protocol: "gRPC", category: "ai" },
  ],
  pipeline: [
    { label: "Test Planning & Execution", description: "Pull control test procedures from ServiceNow GRC. Execute automated tests against source systems. Collect evidence artifacts — access logs, approval records, configuration snapshots.", systems: ["ServiceNow GRC", "RSA Archer"], layer: "integration", dataIn: "Control framework + test procedures", dataOut: "Test results + evidence artifacts" },
    { label: "Evidence Scoring", description: "Score evidence completeness and quality. Detect patterns: controls that passed mechanically but show behavioral gaps (e.g., approvals rubber-stamped in < 1 minute).", systems: ["BigQuery"], layer: "ml", dataIn: "Evidence artifacts + scoring criteria", dataOut: "Scored evidence with quality flags" },
    { label: "Effectiveness Assessment", description: "Gemini assesses control effectiveness beyond pass/fail — identifying partial failures, compensating control gaps, and edge cases. Explains findings with context for audit readiness.", systems: ["Vertex AI (Gemini)"], layer: "llm", dataIn: "Scored evidence + control context", dataOut: "Assessment narrative with recommendations" },
    { label: "Workpaper Generation", description: "Generate audit-ready workpapers with test results, evidence references, and assessment narratives. Create remediation tickets for gaps.", systems: ["ServiceNow GRC"], layer: "integration", dataIn: "Approved assessment results", dataOut: "Published workpapers + remediation tickets" },
  ],
};


const behaviorContract: AgentBehaviorContract = {
  role: "Compliance & GRC Lead agent for the IT Control Testing Agent workflow",
  primaryObjective: "Gemini executes automated control tests and collects evidence artifacts from source systems directly. LLM assesses evidence quality beyond mechanical checks — detecting rubber-stamped approvals and behavioral gaps. so the Compliance & GRC Lead can move the Control testing cycle KPI.",
  inScope: [
    "Gemini executes automated control tests and collects evidence artifacts from source systems directly",
    "LLM assesses evidence quality beyond mechanical checks — detecting rubber-stamped approvals and behavioral gaps",
    "Generates audit-ready workpapers with contextual assessment narratives, not just checklists",
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
      description: "Retrieve tickets from ServiceNow GRC for the IT Control Testing Agent workflow.",
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
      description: "Retrieve rsa archer records from RSA Archer for the IT Control Testing Agent workflow.",
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
      name: "query_onetrust_onetrust_records",
      kind: "query",
      sourceSystemId: "onetrust",
      description: "Retrieve onetrust records from OneTrust for the IT Control Testing Agent workflow.",
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
      name: "query_bigquery_analytics_events",
      kind: "query",
      sourceSystemId: "bigquery",
      description: "Retrieve analytics events from BigQuery for the IT Control Testing Agent workflow.",
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
      name: "lookup_it_control_testing_agent_runbook",
      kind: "evidence_lookup",
      sourceSystemId: "bigquery",
      description: "Look up sections of the IT Control Testing Agent Operations Runbook to cite in narrative output, escalation rationale, and audit evidence.",
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
      name: "action_servicenow_grc_generate",
      kind: "action",
      sourceSystemId: "servicenow_grc",
      description: "Execute the generate step in ServiceNow GRC after the agent has gathered evidence and validated escalation gates.",
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
      claim: "Control testing cycle moved from 6-8 weeks manual toward 1 week automated",
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
      claim: "Evidence completeness moved from 75% on first pass toward 95% auto-collected",
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
      trigger: "Control testing cycle regresses past the 6-8 weeks manual baseline by more than 20%",
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
      trigger: "Proposed generate action lacks supporting evidence from at least two systems",
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
      id: "it-control-testing-agent-end-to-end",
      prompt: "Run the IT Control Testing Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.",
      expectedToolCalls: [
        "query_servicenow_grc_tickets",
        "query_rsa_archer_rsa_archer_records",
        "query_onetrust_onetrust_records",
        "query_bigquery_analytics_events",
        "lookup_it_control_testing_agent_runbook",
        "action_servicenow_grc_generate",
      ],
      mustReferenceEntities: [
        "tickets",
        "rsa_archer_records",
        "onetrust_records",
        "analytics_events",
      ],
      mustCiteDocuments: [
        "it-control-testing-agent-runbook",
      ],
      expectedActionOutcome: "Action generate executed against ServiceNow GRC, with audit-trail entry and Compliance & GRC Lead notified of outcomes.",
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
    rationale: "Row counts sized for IT Control Testing Agent so the agent can demonstrate the workflow against realistic transactional volume without simulating a production warehouse.",
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
      id: "it-control-testing-agent-runbook",
      sourceSystemId: "bigquery",
      type: "runbook",
      title: "IT Control Testing Agent Operations Runbook",
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
      id: "servicenow_grc_generate_api",
      sourceSystemId: "servicenow_grc",
      method: "POST",
      path: "/api/servicenow_grc/generate",
      description: "Synchronous endpoint the agent calls to generate in ServiceNow GRC after evidence gating.",
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
      id: "it-control-testing-agent-baseline-gap",
      description: "Seed a realistic gap where Control testing cycle sits between 6-8 weeks manual and 1 week automated, so the agent can detect, narrate, and recommend remediation.",
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
      database: "it_control_testing_agent",
      schemas: [
        "servicenow_grc",
        "rsa_archer",
        "onetrust",
      ],
    },
    bigquery: {
      dataset: "it_it_control_testing_agent",
      tables: [
        "kpi_summary",
        "evidence_index",
      ],
    },
    cloudStorage: {
      bucketSuffix: "it-control-testing-agent-evidence",
      prefixes: [
        "documents",
        "audit-trails",
        "exports",
      ],
    },
    apis: {
      serviceName: "it-control-testing-agent-source-adapters",
      deploymentTarget: "cloud_run",
    },
  },
  validation: {
    smokePrompt: "Run the IT Control Testing Agent workflow and cite source-system evidence for every claim.",
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

export const ITControlTestingAgent = () => (
  <UseCaseSlide
    title="IT Control Testing Agent"
    subtitle="A-4501 • IT Governance & Compliance"
    icon={ClipboardCheck}
    domainId="domain-45"
    layer="Layer 3: Custom ADK"
    persona="Compliance & GRC Lead"
    systems={["ServiceNow GRC", "RSA Archer", "OneTrust", "BigQuery", "Vertex AI"]}
    kpis={[
      { label: "Control testing cycle", before: "6-8 weeks manual", after: "1 week automated" },
      { label: "Evidence completeness", before: "75% on first pass", after: "95% auto-collected" },
      { label: "Audit finding rate", before: "12 findings/audit", after: "3 findings/audit" },
    ]}
    triggerType="scheduled"
    swimlane={swimlane}
    flow={flow}
    architecture={architecture}
    hitl={{ actor: "Compliance & GRC Lead", action: "Approve test results", description: "GRC Lead reviews control test workpapers, validates effectiveness assessments, and approves remediation plans for identified gaps." }}
    statusQuo={[
      "Control testing is a quarterly fire drill — teams scramble to collect evidence from 15+ systems manually.",
      "Evidence quality varies wildly — screenshots, email forwards, and verbal confirmations accepted as proof.",
      "Pass/fail assessment misses nuance: controls that technically pass but show behavioral gaps go undetected."
    ]}
    agentification={[
      "Gemini executes automated control tests and collects evidence artifacts from source systems directly.",
      "LLM assesses evidence quality beyond mechanical checks — detecting rubber-stamped approvals and behavioral gaps.",
      "Generates audit-ready workpapers with contextual assessment narratives, not just checklists."
    ]}
  />
);
