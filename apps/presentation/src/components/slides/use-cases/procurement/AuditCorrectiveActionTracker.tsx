import React from "react";
import { UseCaseSlide } from "../../../agent/UseCaseSlide";
import { FlowStep } from "../../../agent/ProcessFlow";
import { SwimlaneFlow } from "../../../agent/SwimlaneFlow";
import { AgentArchitecture, UseCaseGenerationSpec, AgentBehaviorContract} from "../../../../types/architecture";
import { ClipboardCheck, FileText, Wrench, Brain, CheckCircle } from "lucide-react";

const swimlane: SwimlaneFlow = {
  nodes: [
    { id: "s1", label: "Audit Completed", lane: "system", type: "trigger" },
    { id: "a1", label: "Finding Extraction", lane: "agent", type: "action" },
    { id: "a2", label: "CAPA Generation", lane: "agent", type: "action" },
    { id: "a3", label: "Response Assessment", lane: "agent", type: "action" },
    { id: "a4", label: "Tracking Output", lane: "agent", type: "output" },
    { id: "s2", label: "GRC System Update", lane: "system", type: "output" },
  ],
  connections: [["s1", "a1"], ["a1", "a2"], ["a2", "a3"], ["a3", "a4"], ["a4", "s2"]],
};

const flow: FlowStep[] = [
  { label: "Finding Intake", icon: FileText, description: "Audit report parsed and findings extracted into structured corrective action items.", trigger: "On audit completion", systems: ["SAP GRC", "Audit Tools"] },
  { label: "CAPA Plan Generation", icon: Wrench, description: "Structured corrective action plans auto-generated from audit finding narratives.", systems: ["Ariba SLP", "CAPA Tracking"], integration: "Agent Designer" },
  { label: "Response Assessment", icon: Brain, description: "LLM evaluates whether supplier CAPA responses address root cause or are superficial.", systems: ["Vertex AI"] },
  { label: "Closure Tracking", icon: CheckCircle, description: "CAPA completion tracked with aging analysis and effectiveness verification scheduled.", output: "CAPA Tracker" },
];

const architecture: AgentArchitecture = {
  connections: [
    { system: "SAP GRC", description: "Audit findings, governance records, compliance workflow management", direction: "bidirectional", protocol: "REST API", category: "erp" },
    { system: "Ariba SLP", description: "Supplier lifecycle performance data, corrective action tracking", direction: "bidirectional", protocol: "REST API", category: "erp" },
    { system: "CAPA Tracking", description: "Corrective and preventive action management, closure verification", direction: "bidirectional", protocol: "REST API", category: "erp" },
    { system: "Vertex AI (Gemini)", description: "Audit finding interpretation, CAPA plan generation, response substance assessment", direction: "bidirectional", protocol: "gRPC", category: "ai" },
    { system: "Email", description: "CAPA assignment notifications, deadline reminders, escalation alerts", direction: "write", protocol: "SMTP", category: "collaboration" },
  ],
  pipeline: [
    { label: "Audit Finding Intake", description: "Receive audit report from SAP GRC, parse finding narratives, extract structured data (finding type, severity, affected supplier, evidence). Create CAPA items in tracking system with assigned owners and deadlines.", systems: ["SAP GRC", "CAPA Tracking"], layer: "integration", dataIn: "Raw audit reports with finding narratives", dataOut: "Structured CAPA items with owners and deadlines" },
    { label: "Recurrence Pattern Detection", description: "Analyze CAPA completion rates, aging analysis, and recurrence patterns across suppliers and finding types. Detect systemic issues where similar findings repeat across multiple audit cycles.", systems: ["BigQuery", "CAPA Tracking"], layer: "ml", dataIn: "Historical CAPA data across suppliers", dataOut: "Recurrence patterns and aging analytics" },
    { label: "CAPA Generation & Response Assessment", description: "Gemini reads audit finding narratives — 'inadequate incoming inspection, 3 lots received without QC sign-off' — and auto-generates structured CAPA plans with root cause analysis, training requirements, and process modifications. Assesses whether a supplier's CAPA response actually addresses the root cause or is superficial.", systems: ["Vertex AI (Gemini)"], layer: "llm", dataIn: "Audit findings + supplier CAPA responses", dataOut: "Structured CAPA plans with substance assessment" },
  ],
};


const behaviorContract: AgentBehaviorContract = {
  role: "Supplier Risk Analyst agent for the Audit & Corrective Action Tracker workflow",
  primaryObjective: "LLM reads audit finding narratives and auto-generates structured CAPA plans with specific actions, owners, and deadlines. Assesses supplier CAPA responses for substance — 'we will retrain inspectors' flagged as insufficient when the MES system allows bypassing inspection. so the Supplier Risk Analyst can move the CAPA plan creation time KPI.",
  inScope: [
    "LLM reads audit finding narratives and auto-generates structured CAPA plans with specific actions, owners, and deadlines",
    "Assesses supplier CAPA responses for substance — 'we will retrain inspectors' flagged as insufficient when the MES system allows bypassing inspection",
    "Tracks completion with aging analysis and detects recurrence patterns across suppliers and finding types",
  ],
  outOfScope: [
    "Contract execution without legal review",
    "Supplier disqualification decisions (category lead retains authority)",
    "Single-source justification overrides above policy threshold",
  ],
  toolIntents: [
    {
      name: "query_sap_grc_control_tests",
      kind: "query",
      sourceSystemId: "sap_grc",
      description: "Retrieve control tests from SAP GRC for the Audit & Corrective Action Tracker workflow.",
      requiredInputs: [
        "lookup_key",
        "date_range",
      ],
      produces: [
        "control_tests_records",
        "control_tests_summary",
      ],
      evidenceEmitted: [
        "source_system_record",
      ],
    },
    {
      name: "query_audit_tools_audit_tools_records",
      kind: "query",
      sourceSystemId: "audit_tools",
      description: "Retrieve audit tools records from Audit Tools for the Audit & Corrective Action Tracker workflow.",
      requiredInputs: [
        "lookup_key",
        "date_range",
      ],
      produces: [
        "audit_tools_records_records",
        "audit_tools_records_summary",
      ],
      evidenceEmitted: [
        "source_system_record",
      ],
    },
    {
      name: "query_ariba_slp_ariba_slp_records",
      kind: "query",
      sourceSystemId: "ariba_slp",
      description: "Retrieve ariba slp records from Ariba SLP for the Audit & Corrective Action Tracker workflow.",
      requiredInputs: [
        "lookup_key",
        "date_range",
      ],
      produces: [
        "ariba_slp_records_records",
        "ariba_slp_records_summary",
      ],
      evidenceEmitted: [
        "source_system_record",
      ],
    },
    {
      name: "query_capa_tracking_capa_tracking_records",
      kind: "query",
      sourceSystemId: "capa_tracking",
      description: "Retrieve capa tracking records from CAPA Tracking for the Audit & Corrective Action Tracker workflow.",
      requiredInputs: [
        "lookup_key",
        "date_range",
      ],
      produces: [
        "capa_tracking_records_records",
        "capa_tracking_records_summary",
      ],
      evidenceEmitted: [
        "source_system_record",
      ],
    },
    {
      name: "lookup_audit_corrective_action_tracker_policy_guide",
      kind: "evidence_lookup",
      sourceSystemId: "sap_grc",
      description: "Look up sections of the Audit & Corrective Action Tracker Procurement Policy Guide to cite in narrative output, escalation rationale, and audit evidence.",
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
      name: "action_sap_grc_generate",
      kind: "action",
      sourceSystemId: "sap_grc",
      description: "Execute the generate step in SAP GRC after the agent has gathered evidence and validated escalation gates.",
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
      claim: "CAPA plan creation time moved from 3-5 days manual toward Same-day automated",
      mustCite: [
        "sap_grc.control_tests",
        "audit_tools.audit_tools_records",
      ],
      sourceSystemIds: [
        "sap_grc",
        "audit_tools",
      ],
    },
    {
      claim: "Overdue CAPA rate moved from 35% toward <10%",
      mustCite: [
        "sap_grc.control_tests",
        "audit_tools.audit_tools_records",
      ],
      sourceSystemIds: [
        "sap_grc",
        "audit_tools",
      ],
    },
  ],
  escalationRules: [
    {
      trigger: "CAPA plan creation time regresses past the 3-5 days manual baseline by more than 20%",
      action: "escalate_to_human",
      handoffTarget: "Supplier Risk Analyst",
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
    "Never fabricate metric values; only publish numbers derived from SAP GRC (and other named systems) entities.",
    "Never bypass Supplier Risk Analyst approval on escalation triggers, even when confidence is high.",
    "Never expose individual personal data (PII) in summaries; aggregate or pseudonymise before output.",
    "Never act on data older than the staleness threshold defined in the runbook without a fresh re-query.",
  ],
  goldenEvals: [
    {
      id: "audit-corrective-action-tracker-end-to-end",
      prompt: "Run the Audit & Corrective Action Tracker workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.",
      expectedToolCalls: [
        "query_sap_grc_control_tests",
        "query_audit_tools_audit_tools_records",
        "query_ariba_slp_ariba_slp_records",
        "query_capa_tracking_capa_tracking_records",
        "lookup_audit_corrective_action_tracker_policy_guide",
        "action_sap_grc_generate",
      ],
      mustReferenceEntities: [
        "control_tests",
        "audit_tools_records",
        "ariba_slp_records",
        "capa_tracking_records",
      ],
      mustCiteDocuments: [
        "audit-corrective-action-tracker-policy-guide",
      ],
      expectedActionOutcome: "Action generate executed against SAP GRC, with audit-trail entry and Supplier Risk Analyst notified of outcomes.",
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
    rationale: "Row counts sized for Audit & Corrective Action Tracker so the agent can demonstrate the workflow against realistic transactional volume without simulating a production warehouse.",
  },
  sourceSystems: [
    {
      id: "sap_grc",
      name: "SAP GRC",
      owns: [
        "control_tests",
        "risk_assessments",
        "remediation_actions",
      ],
      protocol: "RFC/BAPI",
      localBacking: [
        "alloydb",
      ],
      toolNames: [
        "query_sap_grc_control_tests",
        "query_sap_grc_risk_assessments",
        "query_sap_grc_remediation_actions",
      ],
      evidence: [
        "source_system_record",
        "generated_audit_trail",
      ],
    },
    {
      id: "audit_tools",
      name: "Audit Tools",
      owns: [
        "audit_tools_records",
        "audit_tools_events",
        "audit_tools_audit_trail",
      ],
      protocol: "REST API",
      localBacking: [
        "alloydb",
      ],
      toolNames: [
        "query_audit_tools_audit_tools_records",
        "query_audit_tools_audit_tools_events",
        "query_audit_tools_audit_tools_audit_trail",
      ],
      evidence: [
        "source_system_record",
        "generated_audit_trail",
      ],
    },
    {
      id: "ariba_slp",
      name: "Ariba SLP",
      owns: [
        "ariba_slp_records",
        "ariba_slp_events",
        "ariba_slp_audit_trail",
      ],
      protocol: "REST API",
      localBacking: [
        "alloydb",
      ],
      toolNames: [
        "query_ariba_slp_ariba_slp_records",
        "query_ariba_slp_ariba_slp_events",
        "query_ariba_slp_ariba_slp_audit_trail",
      ],
      evidence: [
        "source_system_record",
        "generated_audit_trail",
      ],
    },
    {
      id: "capa_tracking",
      name: "CAPA Tracking",
      owns: [
        "capa_tracking_records",
        "capa_tracking_events",
        "capa_tracking_audit_trail",
      ],
      protocol: "REST API",
      localBacking: [
        "alloydb",
      ],
      toolNames: [
        "query_capa_tracking_capa_tracking_records",
        "query_capa_tracking_capa_tracking_events",
        "query_capa_tracking_capa_tracking_audit_trail",
      ],
      evidence: [
        "source_system_record",
        "generated_audit_trail",
      ],
    },
  ],
  entities: [
    {
      name: "control_tests",
      sourceSystemId: "sap_grc",
      datastore: "alloydb",
      rowCount: 30,
      primaryKey: "id",
      columns: [
        {
          name: "id",
          type: "seq",
          required: true,
        },
        {
          name: "name",
          type: "lorem.sentence",
          required: true,
        },
        {
          name: "status",
          type: "enum",
          values: [
            "open",
            "in_progress",
            "certified",
            "exception",
          ],
          required: true,
        },
        {
          name: "owner",
          type: "person.fullName",
          required: true,
        },
        {
          name: "match_rate",
          type: "float",
          min: 0,
          max: 1,
          decimals: 2,
          required: true,
        },
        {
          name: "last_run",
          type: "date",
          required: true,
        },
      ],
    },
    {
      name: "risk_assessments",
      sourceSystemId: "sap_grc",
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
          type: "lorem.sentence",
          required: true,
        },
        {
          name: "status",
          type: "enum",
          values: [
            "open",
            "in_progress",
            "certified",
            "exception",
          ],
          required: true,
        },
        {
          name: "owner",
          type: "person.fullName",
          required: true,
        },
        {
          name: "match_rate",
          type: "float",
          min: 0,
          max: 1,
          decimals: 2,
          required: true,
        },
        {
          name: "last_run",
          type: "date",
          required: true,
        },
      ],
    },
    {
      name: "remediation_actions",
      sourceSystemId: "sap_grc",
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
      name: "audit_tools_records",
      sourceSystemId: "audit_tools",
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
      name: "audit_tools_events",
      sourceSystemId: "audit_tools",
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
      name: "audit_tools_audit_trail",
      sourceSystemId: "audit_tools",
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
      name: "ariba_slp_records",
      sourceSystemId: "ariba_slp",
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
      name: "ariba_slp_events",
      sourceSystemId: "ariba_slp",
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
          name: "ariba_slp_record_id",
          type: "ref",
          ref: "ariba_slp_records.id",
          required: true,
        },
      ],
    },
    {
      name: "ariba_slp_audit_trail",
      sourceSystemId: "ariba_slp",
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
      name: "capa_tracking_records",
      sourceSystemId: "capa_tracking",
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
      name: "capa_tracking_events",
      sourceSystemId: "capa_tracking",
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
          name: "capa_tracking_record_id",
          type: "ref",
          ref: "capa_tracking_records.id",
          required: true,
        },
      ],
    },
    {
      name: "capa_tracking_audit_trail",
      sourceSystemId: "capa_tracking",
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
  ],
  relationships: [
    {
      from: "ariba_slp_events.ariba_slp_record_id",
      to: "ariba_slp_records.id",
      cardinality: "many-to-one",
      orphanPolicy: "none",
    },
    {
      from: "capa_tracking_events.capa_tracking_record_id",
      to: "capa_tracking_records.id",
      cardinality: "many-to-one",
      orphanPolicy: "none",
    },
  ],
  documents: [
    {
      id: "audit-corrective-action-tracker-policy-guide",
      sourceSystemId: "sap_grc",
      type: "policy",
      title: "Audit & Corrective Action Tracker Procurement Policy Guide",
      requiredSections: [
        "Sourcing principles",
        "Approval thresholds",
        "Supplier risk requirements",
        "Contract and compliance gates",
        "Exception handling",
      ],
      linkedEntities: [
        "control_tests",
        "risk_assessments",
        "remediation_actions",
      ],
      minimumWordCount: 500,
      citationAnchors: [
        "sourcing",
        "approvals",
        "supplier-risk",
        "exceptions",
      ],
    },
  ],
  apis: [
    {
      id: "sap_grc_generate_api",
      sourceSystemId: "sap_grc",
      method: "POST",
      path: "/api/sap_grc/generate",
      description: "Synchronous endpoint the agent calls to generate in SAP GRC after evidence gating.",
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
      id: "audit-corrective-action-tracker-baseline-gap",
      description: "Seed a realistic gap where CAPA plan creation time sits between 3-5 days manual and Same-day automated, so the agent can detect, narrate, and recommend remediation.",
      affectedEntities: [
        "control_tests",
        "risk_assessments",
      ],
      discoveryPath: [
        "Inspect SAP GRC records for the affected entities",
        "Compare against Audit Tools historical baseline",
        "Generate a citation-backed recommendation",
      ],
      expectedEvidence: [
        "source-system record",
        "historical baseline metric",
        "generated audit trail",
      ],
      expectedRecommendation: "Explain the gap, cite supporting evidence, and propose the next Supplier Risk Analyst action.",
    },
  ],
  datastorePackaging: {
    alloydb: {
      database: "audit_corrective_action_tracker",
      schemas: [
        "sap_grc",
        "audit_tools",
        "ariba_slp",
        "capa_tracking",
      ],
    },
    bigquery: {
      dataset: "procurement_audit_corrective_action_tracker",
      tables: [
        "kpi_summary",
        "evidence_index",
      ],
    },
    cloudStorage: {
      bucketSuffix: "audit-corrective-action-tracker-evidence",
      prefixes: [
        "documents",
        "audit-trails",
        "exports",
      ],
    },
    apis: {
      serviceName: "audit-corrective-action-tracker-source-adapters",
      deploymentTarget: "cloud_run",
    },
  },
  validation: {
    smokePrompt: "Run the Audit & Corrective Action Tracker workflow and cite source-system evidence for every claim.",
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

export const AuditCorrectiveActionTracker = () => (
  <UseCaseSlide
    title="Audit & Corrective Action Tracker"
    subtitle="A-1606 • Supplier Risk"
    icon={ClipboardCheck}
    domainId="domain-16"
    layer="Layer 2: Agent Designer"
    persona="Supplier Risk Analyst"
    systems={["SAP GRC", "Audit Tools", "Ariba SLP", "CAPA Tracking"]}
    kpis={[
      { label: "CAPA plan creation time", before: "3-5 days manual", after: "Same-day automated" },
      { label: "Overdue CAPA rate", before: "35%", after: "<10%" },
      { label: "Root cause addressed rate", before: "Unchecked", after: "Validated by LLM" },
    ]}
    triggerType="event"
    swimlane={swimlane}
    flow={flow}
    architecture={architecture}
    statusQuo={[
      "Audit findings tracked in spreadsheets — CAPA items go stale without systematic follow-up.",
      "CAPA plans created manually from audit narratives, often missing specific required actions.",
      "No way to assess whether a supplier's corrective response actually addresses root cause."
    ]}
    agentification={[
      "LLM reads audit finding narratives and auto-generates structured CAPA plans with specific actions, owners, and deadlines.",
      "Assesses supplier CAPA responses for substance — 'we will retrain inspectors' flagged as insufficient when the MES system allows bypassing inspection.",
      "Tracks completion with aging analysis and detects recurrence patterns across suppliers and finding types."
    ]}
  />
);
