import React from "react";
import { UseCaseSlide } from "../../../agent/UseCaseSlide";
import { DollarSign, Upload, BarChart, Layers, Send } from "lucide-react";
import { FlowStep } from "../../../agent/ProcessFlow";
import { SwimlaneFlow } from "../../../agent/SwimlaneFlow";
import { AgentArchitecture, UseCaseGenerationSpec, AgentBehaviorContract} from "../../../../types/architecture";

const swimlane: SwimlaneFlow = {
  nodes: [
    { id: "s1", label: "Selection Made", lane: "system", type: "trigger" },
    { id: "a1", label: "Market Modeling", lane: "agent", type: "action" },
    { id: "a2", label: "Scenario Compare", lane: "agent", type: "action" },
    { id: "h1", label: "Comp Manager Approves", lane: "human", type: "hitl" },
    { id: "a3", label: "Offer Package", lane: "agent", type: "output" },
  ],
  connections: [["s1", "a1"], ["a1", "a2"], ["a2", "h1"], ["h1", "a3"]],
};

const architecture: AgentArchitecture = {
  connections: [
    { system: "Workday", description: "Internal comp bands, equity guidelines, approval workflows", direction: "bidirectional", protocol: "REST API", category: "erp" },
    { system: "Mercer", description: "Market compensation benchmarks, salary survey data", direction: "read", protocol: "REST API", category: "market-data" },
    { system: "Radford", description: "Technology industry comp data, equity benchmarks", direction: "read", protocol: "REST API", category: "market-data" },
    { system: "BigQuery", description: "Offer acceptance analytics, comp modeling data", direction: "bidirectional", protocol: "BigQuery SQL", category: "analytics" },
    { system: "Vertex AI (Gemini)", description: "Offer scenario modeling, competitiveness analysis", direction: "bidirectional", protocol: "gRPC", category: "ai" },
  ],
  pipeline: [
    { label: "Market Data Assembly", description: "Pull current compensation benchmarks from Mercer and Radford. Cross-reference with internal comp bands and equity guidelines from Workday.", systems: ["Workday", "Mercer", "Radford"], layer: "integration", dataIn: "Market surveys + internal comp bands", dataOut: "Market-calibrated comp range" },
    { label: "Scenario Modeling", description: "Model multiple offer configurations across base, equity, and bonus mix. Gemini analyzes trade-offs and predicts acceptance probability.", systems: ["BigQuery", "Vertex AI (Gemini)"], layer: "llm", dataIn: "Market range + candidate profile + history", dataOut: "Ranked offer scenarios with acceptance likelihood" },
    { label: "Approval & Generation", description: "Optimal package routed through Workday approval workflow with SLA tracking. Offer letter auto-generated on approval.", systems: ["Workday"], layer: "integration", dataIn: "Selected offer scenario", dataOut: "Approved offer package with letter" },
  ],
};


const behaviorContract: AgentBehaviorContract = {
  role: "Comp Manager agent for the Offer Package Modeler Agent workflow",
  primaryObjective: "Real-time market-calibrated offer modeling using live compensation benchmarks and internal equity data. Scenario comparison across base, equity, and bonus mix with visual impact analysis for candidate and budget. so the Comp Manager can move the Offer modeling KPI.",
  inScope: [
    "Real-time market-calibrated offer modeling using live compensation benchmarks and internal equity data",
    "Scenario comparison across base, equity, and bonus mix with visual impact analysis for candidate and budget",
    "Automated approval routing with SLA tracking, escalation triggers, and parallel approval paths for urgent hires",
  ],
  outOfScope: [
    "Final hiring, termination, or compensation decisions (HRBP/leadership retains authority)",
    "Performance management adjudication and disciplinary action",
    "Legal interpretation of employment law in ambiguous jurisdictions",
  ],
  toolIntents: [
    {
      name: "query_workday_employees",
      kind: "query",
      sourceSystemId: "workday",
      description: "Retrieve employees from Workday for the Offer Package Modeler Agent workflow.",
      requiredInputs: [
        "lookup_key",
        "date_range",
      ],
      produces: [
        "employees_records",
        "employees_summary",
      ],
      evidenceEmitted: [
        "source_system_record",
      ],
    },
    {
      name: "query_mercer_mercer_records",
      kind: "query",
      sourceSystemId: "mercer",
      description: "Retrieve mercer records from Mercer for the Offer Package Modeler Agent workflow.",
      requiredInputs: [
        "lookup_key",
        "date_range",
      ],
      produces: [
        "mercer_records_records",
        "mercer_records_summary",
      ],
      evidenceEmitted: [
        "source_system_record",
      ],
    },
    {
      name: "query_radford_radford_records",
      kind: "query",
      sourceSystemId: "radford",
      description: "Retrieve radford records from Radford for the Offer Package Modeler Agent workflow.",
      requiredInputs: [
        "lookup_key",
        "date_range",
      ],
      produces: [
        "radford_records_records",
        "radford_records_summary",
      ],
      evidenceEmitted: [
        "source_system_record",
      ],
    },
    {
      name: "query_google_sheets_sheets",
      kind: "query",
      sourceSystemId: "google_sheets",
      description: "Retrieve sheets from Google Sheets for the Offer Package Modeler Agent workflow.",
      requiredInputs: [
        "lookup_key",
        "date_range",
      ],
      produces: [
        "sheets_records",
        "sheets_summary",
      ],
      evidenceEmitted: [
        "source_system_record",
      ],
    },
    {
      name: "lookup_offer_package_modeler_agent_policy_handbook",
      kind: "evidence_lookup",
      sourceSystemId: "google_sheets",
      description: "Look up sections of the Offer Package Modeler Agent Policy Handbook to cite in narrative output, escalation rationale, and audit evidence.",
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
      name: "action_workday_trigger",
      kind: "action",
      sourceSystemId: "workday",
      description: "Execute the trigger step in Workday after the agent has gathered evidence and validated escalation gates.",
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
      claim: "Offer modeling moved from 2 days toward 10 min",
      mustCite: [
        "workday.employees",
        "mercer.mercer_records",
      ],
      sourceSystemIds: [
        "workday",
        "mercer",
      ],
    },
    {
      claim: "Competitive win rate moved from 65% toward 85%",
      mustCite: [
        "workday.employees",
        "mercer.mercer_records",
      ],
      sourceSystemIds: [
        "workday",
        "mercer",
      ],
    },
  ],
  escalationRules: [
    {
      trigger: "Offer modeling regresses past the 2 days baseline by more than 20%",
      action: "escalate_to_human",
      handoffTarget: "Comp Manager",
      rationale: "Significant regressions need human judgment before automated remediation runs against production records.",
    },
    {
      trigger: "Source-system evidence is incomplete or stale (>24h) for any required entity",
      action: "request_more_info",
      rationale: "Recommendations grounded in stale evidence misrepresent current state and undermine audit defensibility.",
    },
    {
      trigger: "Proposed trigger action lacks supporting evidence from at least two systems",
      action: "refuse",
      rationale: "Single-system evidence is insufficient to authorize external state changes without manual review.",
    },
  ],
  refusalRules: [
    "Never fabricate metric values; only publish numbers derived from Workday (and other named systems) entities.",
    "Never bypass Comp Manager approval on escalation triggers, even when confidence is high.",
    "Never expose individual personal data (PII) in summaries; aggregate or pseudonymise before output.",
    "Never act on data older than the staleness threshold defined in the runbook without a fresh re-query.",
  ],
  goldenEvals: [
    {
      id: "offer-package-modeler-agent-end-to-end",
      prompt: "Run the Offer Package Modeler Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.",
      expectedToolCalls: [
        "query_workday_employees",
        "query_mercer_mercer_records",
        "query_radford_radford_records",
        "query_google_sheets_sheets",
        "lookup_offer_package_modeler_agent_policy_handbook",
        "action_workday_trigger",
      ],
      mustReferenceEntities: [
        "employees",
        "mercer_records",
        "radford_records",
        "sheets",
      ],
      mustCiteDocuments: [
        "offer-package-modeler-agent-policy-handbook",
      ],
      expectedActionOutcome: "Action trigger executed against Workday, with audit-trail entry and Comp Manager notified of outcomes.",
      forbiddenBehaviors: [
        "do not invent KPI numbers",
        "do not skip the evidence_lookup step before any recommendation",
        "do not execute trigger without two-system evidence",
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
    rationale: "Row counts sized for Offer Package Modeler Agent so the agent can demonstrate the workflow against realistic transactional volume without simulating a production warehouse.",
  },
  sourceSystems: [
    {
      id: "workday",
      name: "Workday",
      owns: [
        "employees",
        "positions",
        "compensation_records",
      ],
      protocol: "Workday REST",
      localBacking: [
        "alloydb",
      ],
      toolNames: [
        "query_workday_employees",
        "query_workday_positions",
        "query_workday_compensation_records",
      ],
      evidence: [
        "source_system_record",
        "generated_audit_trail",
      ],
    },
    {
      id: "mercer",
      name: "Mercer",
      owns: [
        "mercer_records",
        "mercer_events",
        "mercer_audit_trail",
      ],
      protocol: "REST API",
      localBacking: [
        "alloydb",
      ],
      toolNames: [
        "query_mercer_mercer_records",
        "query_mercer_mercer_events",
        "query_mercer_mercer_audit_trail",
      ],
      evidence: [
        "source_system_record",
        "generated_audit_trail",
      ],
    },
    {
      id: "radford",
      name: "Radford",
      owns: [
        "radford_records",
        "radford_events",
        "radford_audit_trail",
      ],
      protocol: "REST API",
      localBacking: [
        "alloydb",
      ],
      toolNames: [
        "query_radford_radford_records",
        "query_radford_radford_events",
        "query_radford_radford_audit_trail",
      ],
      evidence: [
        "source_system_record",
        "generated_audit_trail",
      ],
    },
    {
      id: "google_sheets",
      name: "Google Sheets",
      owns: [
        "sheets",
        "named_ranges",
        "edit_history",
      ],
      protocol: "Workspace API",
      localBacking: [
        "cloud-storage",
      ],
      toolNames: [
        "query_google_sheets_sheets",
        "query_google_sheets_named_ranges",
        "query_google_sheets_edit_history",
      ],
      evidence: [
        "source_system_record",
        "generated_audit_trail",
      ],
    },
  ],
  entities: [
    {
      name: "employees",
      sourceSystemId: "workday",
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
          name: "name",
          type: "person.fullName",
          required: true,
        },
        {
          name: "email",
          type: "internet.email",
          required: true,
        },
        {
          name: "department",
          type: "enum",
          values: [
            "Finance",
            "HR",
            "IT",
            "Marketing",
            "Procurement",
            "Engineering",
            "Operations",
          ],
          required: true,
        },
        {
          name: "region",
          type: "enum",
          values: [
            "US",
            "EMEA",
            "APAC",
            "LATAM",
          ],
          required: true,
        },
        {
          name: "status",
          type: "enum",
          values: [
            "active",
            "on_leave",
            "inactive",
          ],
          weights: [
            0.85,
            0.1,
            0.05,
          ],
          required: true,
        },
        {
          name: "level",
          type: "enum",
          values: [
            "L3",
            "L4",
            "L5",
            "L6",
            "L7",
          ],
          required: true,
        },
        {
          name: "hired_on",
          type: "date",
          required: true,
        },
      ],
    },
    {
      name: "positions",
      sourceSystemId: "workday",
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
          name: "name",
          type: "person.fullName",
          required: true,
        },
        {
          name: "email",
          type: "internet.email",
          required: true,
        },
        {
          name: "department",
          type: "enum",
          values: [
            "Finance",
            "HR",
            "IT",
            "Marketing",
            "Procurement",
            "Engineering",
            "Operations",
          ],
          required: true,
        },
        {
          name: "region",
          type: "enum",
          values: [
            "US",
            "EMEA",
            "APAC",
            "LATAM",
          ],
          required: true,
        },
        {
          name: "status",
          type: "enum",
          values: [
            "active",
            "on_leave",
            "inactive",
          ],
          weights: [
            0.85,
            0.1,
            0.05,
          ],
          required: true,
        },
        {
          name: "level",
          type: "enum",
          values: [
            "L3",
            "L4",
            "L5",
            "L6",
            "L7",
          ],
          required: true,
        },
        {
          name: "hired_on",
          type: "date",
          required: true,
        },
      ],
    },
    {
      name: "compensation_records",
      sourceSystemId: "workday",
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
          name: "name",
          type: "person.fullName",
          required: true,
        },
        {
          name: "email",
          type: "internet.email",
          required: true,
        },
        {
          name: "department",
          type: "enum",
          values: [
            "Finance",
            "HR",
            "IT",
            "Marketing",
            "Procurement",
            "Engineering",
            "Operations",
          ],
          required: true,
        },
        {
          name: "region",
          type: "enum",
          values: [
            "US",
            "EMEA",
            "APAC",
            "LATAM",
          ],
          required: true,
        },
        {
          name: "status",
          type: "enum",
          values: [
            "active",
            "on_leave",
            "inactive",
          ],
          weights: [
            0.85,
            0.1,
            0.05,
          ],
          required: true,
        },
        {
          name: "level",
          type: "enum",
          values: [
            "L3",
            "L4",
            "L5",
            "L6",
            "L7",
          ],
          required: true,
        },
        {
          name: "hired_on",
          type: "date",
          required: true,
        },
      ],
    },
    {
      name: "mercer_records",
      sourceSystemId: "mercer",
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
      name: "mercer_events",
      sourceSystemId: "mercer",
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
          name: "mercer_record_id",
          type: "ref",
          ref: "mercer_records.id",
          required: true,
        },
      ],
    },
    {
      name: "mercer_audit_trail",
      sourceSystemId: "mercer",
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
      name: "radford_records",
      sourceSystemId: "radford",
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
      name: "radford_events",
      sourceSystemId: "radford",
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
          name: "radford_record_id",
          type: "ref",
          ref: "radford_records.id",
          required: true,
        },
      ],
    },
    {
      name: "radford_audit_trail",
      sourceSystemId: "radford",
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
      name: "sheets",
      sourceSystemId: "google_sheets",
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
      name: "named_ranges",
      sourceSystemId: "google_sheets",
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
      name: "edit_history",
      sourceSystemId: "google_sheets",
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
          name: "sheet_id",
          type: "ref",
          ref: "sheets.id",
          required: true,
        },
      ],
    },
  ],
  relationships: [
    {
      from: "mercer_events.mercer_record_id",
      to: "mercer_records.id",
      cardinality: "many-to-one",
      orphanPolicy: "none",
    },
    {
      from: "radford_events.radford_record_id",
      to: "radford_records.id",
      cardinality: "many-to-one",
      orphanPolicy: "none",
    },
    {
      from: "edit_history.sheet_id",
      to: "sheets.id",
      cardinality: "many-to-one",
      orphanPolicy: "none",
    },
  ],
  documents: [
    {
      id: "offer-package-modeler-agent-policy-handbook",
      sourceSystemId: "workday",
      type: "policy",
      title: "Offer Package Modeler Agent Policy Handbook",
      requiredSections: [
        "Eligibility and scope",
        "Workflow steps",
        "Manager responsibilities",
        "Compliance and audit",
        "Sensitive-data handling",
      ],
      linkedEntities: [
        "employees",
        "positions",
        "compensation_records",
      ],
      minimumWordCount: 500,
      citationAnchors: [
        "eligibility",
        "workflow",
        "compliance",
        "sensitive-data",
      ],
    },
  ],
  apis: [
    {
      id: "workday_trigger_api",
      sourceSystemId: "workday",
      method: "POST",
      path: "/api/workday/trigger",
      description: "Synchronous endpoint the agent calls to trigger in Workday after evidence gating.",
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
      id: "offer-package-modeler-agent-baseline-gap",
      description: "Seed a realistic gap where Offer modeling sits between 2 days and 10 min, so the agent can detect, narrate, and recommend remediation.",
      affectedEntities: [
        "employees",
        "positions",
      ],
      discoveryPath: [
        "Inspect Workday records for the affected entities",
        "Compare against Mercer historical baseline",
        "Generate a citation-backed recommendation",
      ],
      expectedEvidence: [
        "source-system record",
        "historical baseline metric",
        "generated audit trail",
      ],
      expectedRecommendation: "Explain the gap, cite supporting evidence, and propose the next Comp Manager action.",
    },
  ],
  datastorePackaging: {
    alloydb: {
      database: "offer_package_modeler_agent",
      schemas: [
        "workday",
        "mercer",
        "radford",
        "google_sheets",
      ],
    },
    bigquery: {
      dataset: "hr_offer_package_modeler_agent",
      tables: [
        "kpi_summary",
        "evidence_index",
      ],
    },
    cloudStorage: {
      bucketSuffix: "offer-package-modeler-agent-evidence",
      prefixes: [
        "documents",
        "audit-trails",
        "exports",
      ],
    },
    apis: {
      serviceName: "offer-package-modeler-agent-source-adapters",
      deploymentTarget: "cloud_run",
    },
  },
  validation: {
    smokePrompt: "Run the Offer Package Modeler Agent workflow and cite source-system evidence for every claim.",
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

export const OfferPackageModeler = () => (
  <UseCaseSlide
    title="Offer Package Modeler Agent"
    subtitle="A-209 • Offer & Pre-boarding"
    icon={DollarSign}
    domainId="domain-2"
    layer="Layer 3: Custom ADK"
    persona="Comp Manager"
    systems={["Workday", "Mercer", "Radford", "Google Sheets"]}
    kpis={[
      { label: "Offer modeling", before: "2 days", after: "10 min" },
      { label: "Competitive win rate", before: "65%", after: "85%" },
      { label: "Approval cycle", before: "5 days", after: "Same day" }
    ]}
    triggerType="event"
    swimlane={swimlane}
    hitl={{ actor: "Comp Manager", action: "Approve offer", description: "Agent models multiple offer scenarios against market data. Comp Manager reviews package competitiveness and approves before offer is extended." }}
    architecture={architecture}
    statusQuo={[
      "Offer packages built manually by referencing multiple compensation spreadsheets and market survey PDFs.",
      "Approval cycles are slow and sequential, causing competitive offers to be lost to faster-moving employers.",
      "No easy way to model trade-offs between base salary, equity, signing bonus, and total compensation scenarios."
    ]}
    agentification={[
      "Real-time market-calibrated offer modeling using live compensation benchmarks and internal equity data.",
      "Scenario comparison across base, equity, and bonus mix with visual impact analysis for candidate and budget.",
      "Automated approval routing with SLA tracking, escalation triggers, and parallel approval paths for urgent hires."
    ]}
    flow={[
      { label: "Candidate Data", icon: Upload, description: "Experience, location, current comp gathered.", trigger: "Selection Made", systems: ["ATS"] },
      { label: "Market Modeling", icon: BarChart, description: "Base/equity/bonus scenarios modeled vs market.", systems: ["Gemini", "Comp Data"], integration: "ADK" },
      { label: "Scenario Compare", icon: Layers, description: "Multiple offer configurations ranked by competitiveness." },
      { label: "Approval & Letter", icon: Send, description: "Optimal package routed for approval, letter generated.", output: "Offer Package" }
    ] as FlowStep[]}
  />
);
