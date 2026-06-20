import React from "react";
import { UseCaseSlide } from "../../../agent/UseCaseSlide";
import { FlowStep } from "../../../agent/ProcessFlow";
import { SwimlaneFlow } from "../../../agent/SwimlaneFlow";
import { AgentArchitecture, UseCaseGenerationSpec, AgentBehaviorContract} from "../../../../types/architecture";
import { ListChecks, FileText, Search, Calendar, Bell } from "lucide-react";

const swimlane: SwimlaneFlow = {
  nodes: [
    { id: "s1", label: "Contract Executed", lane: "system", type: "trigger" },
    { id: "a1", label: "Obligation Extract", lane: "agent", type: "action" },
    { id: "a2", label: "Classify & Schedule", lane: "agent", type: "action" },
    { id: "a3", label: "Task Creation", lane: "agent", type: "action" },
    { id: "a4", label: "Tracking Active", lane: "agent", type: "output" },
  ],
  connections: [["s1", "a1"], ["a1", "a2"], ["a2", "a3"], ["a3", "a4"]],
};

const flow: FlowStep[] = [
  { label: "Contract Parse", icon: FileText, description: "Executed contract ingested and parsed into clause-level segments for analysis.", trigger: "Event", systems: ["Icertis", "DocuSign CLM"] },
  { label: "Obligation Extract", icon: Search, description: "NLP extracts obligations from prose — buried sentences, conditional triggers, and recurring commitments.", systems: ["Vertex AI"], integration: "ADK" },
  { label: "Schedule & Assign", icon: Calendar, description: "Calendar entries and task items created in Asana/Jira with owners, deadlines, and recurring reminders.", systems: ["Google Calendar", "Asana/Jira"] },
  { label: "Monitor & Alert", icon: Bell, description: "Ongoing tracking with proactive alerts before obligation deadlines and escalation on missed items.", output: "Obligation Tracker" },
];

const architecture: AgentArchitecture = {
  connections: [
    { system: "Icertis", description: "Executed contracts, clause text, obligation metadata", direction: "read", protocol: "REST API", category: "clm" },
    { system: "DocuSign CLM", description: "Executed contract documents, obligation tracker sync", direction: "bidirectional", protocol: "REST API", category: "clm" },
    { system: "Google Calendar", description: "Calendar entries for key dates, recurring reminders", direction: "write", protocol: "Workspace API", category: "collaboration" },
    { system: "Asana/Jira", description: "Task items with owners, deadlines, and escalation paths", direction: "write", protocol: "REST API", category: "collaboration" },
    { system: "Vertex AI (Gemini)", description: "Obligation extraction from prose, classification of one-time vs. ongoing vs. conditional", direction: "bidirectional", protocol: "gRPC", category: "ai" },
  ],
  pipeline: [
    { label: "Contract Parsing", description: "Parse executed contract into clause-level segments. Extract dates, parties, and structural metadata from CLM system for downstream obligation mining.", systems: ["Icertis", "DocuSign CLM"], layer: "integration", dataIn: "Executed contract document", dataOut: "Clause-segmented text with structural metadata" },
    { label: "Date & Milestone Extraction", description: "Extract explicit dates, deadlines, and SLA thresholds using NLP. Categorize milestones by type — delivery, reporting, renewal, compliance.", systems: ["Icertis"], layer: "ml", dataIn: "Clause segments with date patterns", dataOut: "Structured date/milestone inventory" },
    { label: "Obligation Reasoning", description: "Gemini reads full contract and extracts obligations invisible to keyword search — buried sentences in insurance clauses, conditional triggers ('if volumes exceed 10K units'), and ongoing commitments vs. one-time deliverables. Interprets obligation scope and assigns appropriate tracking workflows.", systems: ["Vertex AI (Gemini)"], layer: "llm", dataIn: "Full contract text + extracted milestones", dataOut: "Classified obligation inventory with tracking parameters" },
    { label: "Task & Calendar Creation", description: "Create structured task items in Asana/Jira with owners and deadlines. Set calendar entries in Google Calendar with recurring reminders and escalation triggers for approaching deadlines.", systems: ["Asana/Jira", "Google Calendar"], layer: "integration", dataIn: "Classified obligations with deadlines", dataOut: "Active tracking items with reminders" },
  ],
};


const behaviorContract: AgentBehaviorContract = {
  role: "Contract Manager agent for the Obligation Mining & Tracking workflow",
  primaryObjective: "Gemini reads 50-page contracts and extracts obligations invisible to keyword search — buried in prose, not in 'Obligations' sections. LLM distinguishes one-time deliverables from ongoing obligations and conditional triggers, creating appropriate tracking workflows. so the Contract Manager can move the Obligations captured KPI.",
  inScope: [
    "Gemini reads 50-page contracts and extracts obligations invisible to keyword search — buried in prose, not in 'Obligations' sections",
    "LLM distinguishes one-time deliverables from ongoing obligations and conditional triggers, creating appropriate tracking workflows",
    "Automatically creates structured task items with owners, deadlines, and escalation paths in Asana/Jira and Google Calendar",
  ],
  outOfScope: [
    "Contract execution without legal review",
    "Supplier disqualification decisions (category lead retains authority)",
    "Single-source justification overrides above policy threshold",
  ],
  toolIntents: [
    {
      name: "query_icertis_contracts",
      kind: "query",
      sourceSystemId: "icertis",
      description: "Retrieve contracts from Icertis for the Obligation Mining & Tracking workflow.",
      requiredInputs: [
        "lookup_key",
        "date_range",
      ],
      produces: [
        "contracts_records",
        "contracts_summary",
      ],
      evidenceEmitted: [
        "source_system_record",
      ],
    },
    {
      name: "query_docusign_clm_contracts",
      kind: "query",
      sourceSystemId: "docusign_clm",
      description: "Retrieve contracts from DocuSign CLM for the Obligation Mining & Tracking workflow.",
      requiredInputs: [
        "lookup_key",
        "date_range",
      ],
      produces: [
        "contracts_records",
        "contracts_summary",
      ],
      evidenceEmitted: [
        "source_system_record",
      ],
    },
    {
      name: "query_google_calendar_events",
      kind: "query",
      sourceSystemId: "google_calendar",
      description: "Retrieve events from Google Calendar for the Obligation Mining & Tracking workflow.",
      requiredInputs: [
        "lookup_key",
        "date_range",
      ],
      produces: [
        "events_records",
        "events_summary",
      ],
      evidenceEmitted: [
        "source_system_record",
      ],
    },
    {
      name: "query_asana_jira_issues",
      kind: "query",
      sourceSystemId: "asana_jira",
      description: "Retrieve issues from Asana/Jira for the Obligation Mining & Tracking workflow.",
      requiredInputs: [
        "lookup_key",
        "date_range",
      ],
      produces: [
        "issues_records",
        "issues_summary",
      ],
      evidenceEmitted: [
        "source_system_record",
      ],
    },
    {
      name: "lookup_obligation_mining_tracking_policy_guide",
      kind: "evidence_lookup",
      sourceSystemId: "icertis",
      description: "Look up sections of the Obligation Mining & Tracking Procurement Policy Guide to cite in narrative output, escalation rationale, and audit evidence.",
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
      name: "action_icertis_create",
      kind: "action",
      sourceSystemId: "icertis",
      description: "Execute the create step in Icertis after the agent has gathered evidence and validated escalation gates.",
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
      claim: "Obligations captured moved from 40-50% manual toward 98% automated",
      mustCite: [
        "icertis.contracts",
        "docusign_clm.contracts",
      ],
      sourceSystemIds: [
        "icertis",
        "docusign_clm",
      ],
    },
    {
      claim: "Missed deadlines moved from 15-20% annually toward <2%",
      mustCite: [
        "icertis.contracts",
        "docusign_clm.contracts",
      ],
      sourceSystemIds: [
        "icertis",
        "docusign_clm",
      ],
    },
  ],
  escalationRules: [
    {
      trigger: "Obligations captured regresses past the 40-50% manual baseline by more than 20%",
      action: "escalate_to_human",
      handoffTarget: "Contract Manager",
      rationale: "Significant regressions need human judgment before automated remediation runs against production records.",
    },
    {
      trigger: "Source-system evidence is incomplete or stale (>24h) for any required entity",
      action: "request_more_info",
      rationale: "Recommendations grounded in stale evidence misrepresent current state and undermine audit defensibility.",
    },
    {
      trigger: "Proposed create action lacks supporting evidence from at least two systems",
      action: "refuse",
      rationale: "Single-system evidence is insufficient to authorize external state changes without manual review.",
    },
  ],
  refusalRules: [
    "Never fabricate metric values; only publish numbers derived from Icertis (and other named systems) entities.",
    "Never bypass Contract Manager approval on escalation triggers, even when confidence is high.",
    "Never expose individual personal data (PII) in summaries; aggregate or pseudonymise before output.",
    "Never act on data older than the staleness threshold defined in the runbook without a fresh re-query.",
  ],
  goldenEvals: [
    {
      id: "obligation-mining-tracking-end-to-end",
      prompt: "Run the Obligation Mining & Tracking workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.",
      expectedToolCalls: [
        "query_icertis_contracts",
        "query_docusign_clm_contracts",
        "query_google_calendar_events",
        "query_asana_jira_issues",
        "lookup_obligation_mining_tracking_policy_guide",
        "action_icertis_create",
      ],
      mustReferenceEntities: [
        "contracts",
        "contracts",
        "events",
        "issues",
      ],
      mustCiteDocuments: [
        "obligation-mining-tracking-policy-guide",
      ],
      expectedActionOutcome: "Action create executed against Icertis, with audit-trail entry and Contract Manager notified of outcomes.",
      forbiddenBehaviors: [
        "do not invent KPI numbers",
        "do not skip the evidence_lookup step before any recommendation",
        "do not execute create without two-system evidence",
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
    rationale: "Row counts sized for Obligation Mining & Tracking so the agent can demonstrate the workflow against realistic transactional volume without simulating a production warehouse.",
  },
  sourceSystems: [
    {
      id: "icertis",
      name: "Icertis",
      owns: [
        "contracts",
        "amendments",
        "obligations",
      ],
      protocol: "REST API",
      localBacking: [
        "alloydb",
      ],
      toolNames: [
        "query_icertis_contracts",
        "query_icertis_amendments",
        "query_icertis_obligations",
      ],
      evidence: [
        "source_system_record",
        "generated_audit_trail",
      ],
    },
    {
      id: "docusign_clm",
      name: "DocuSign CLM",
      owns: [
        "contracts",
        "amendments",
        "obligations",
      ],
      protocol: "REST API",
      localBacking: [
        "alloydb",
      ],
      toolNames: [
        "query_docusign_clm_contracts",
        "query_docusign_clm_amendments",
        "query_docusign_clm_obligations",
      ],
      evidence: [
        "source_system_record",
        "generated_audit_trail",
      ],
    },
    {
      id: "google_calendar",
      name: "Google Calendar",
      owns: [
        "events",
        "attendee_responses",
        "room_bookings",
      ],
      protocol: "Workspace API",
      localBacking: [
        "alloydb",
      ],
      toolNames: [
        "query_google_calendar_events",
        "query_google_calendar_attendee_responses",
        "query_google_calendar_room_bookings",
      ],
      evidence: [
        "source_system_record",
        "generated_audit_trail",
      ],
    },
    {
      id: "asana_jira",
      name: "Asana/Jira",
      owns: [
        "issues",
        "sprints",
        "epics",
      ],
      protocol: "REST API",
      localBacking: [
        "alloydb",
      ],
      toolNames: [
        "query_asana_jira_issues",
        "query_asana_jira_sprints",
        "query_asana_jira_epics",
      ],
      evidence: [
        "source_system_record",
        "generated_audit_trail",
      ],
    },
  ],
  entities: [
    {
      name: "contracts",
      sourceSystemId: "icertis",
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
          name: "counterparty",
          type: "company.name",
          required: true,
        },
        {
          name: "value",
          type: "number",
          min: 10000,
          max: 5000000,
          required: true,
        },
        {
          name: "currency",
          type: "enum",
          values: [
            "USD",
            "EUR",
            "GBP",
          ],
          required: true,
        },
        {
          name: "start_date",
          type: "date",
          required: true,
        },
        {
          name: "end_date",
          type: "date",
          required: true,
        },
        {
          name: "status",
          type: "enum",
          values: [
            "draft",
            "negotiating",
            "active",
            "expired",
            "terminated",
          ],
          required: true,
        },
        {
          name: "auto_renew",
          type: "boolean",
          trueRate: 0.4,
        },
      ],
    },
    {
      name: "amendments",
      sourceSystemId: "icertis",
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
          name: "counterparty",
          type: "company.name",
          required: true,
        },
        {
          name: "value",
          type: "number",
          min: 10000,
          max: 5000000,
          required: true,
        },
        {
          name: "currency",
          type: "enum",
          values: [
            "USD",
            "EUR",
            "GBP",
          ],
          required: true,
        },
        {
          name: "start_date",
          type: "date",
          required: true,
        },
        {
          name: "end_date",
          type: "date",
          required: true,
        },
        {
          name: "status",
          type: "enum",
          values: [
            "draft",
            "negotiating",
            "active",
            "expired",
            "terminated",
          ],
          required: true,
        },
        {
          name: "auto_renew",
          type: "boolean",
          trueRate: 0.4,
        },
      ],
    },
    {
      name: "obligations",
      sourceSystemId: "icertis",
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
          name: "counterparty",
          type: "company.name",
          required: true,
        },
        {
          name: "value",
          type: "number",
          min: 10000,
          max: 5000000,
          required: true,
        },
        {
          name: "currency",
          type: "enum",
          values: [
            "USD",
            "EUR",
            "GBP",
          ],
          required: true,
        },
        {
          name: "start_date",
          type: "date",
          required: true,
        },
        {
          name: "end_date",
          type: "date",
          required: true,
        },
        {
          name: "status",
          type: "enum",
          values: [
            "draft",
            "negotiating",
            "active",
            "expired",
            "terminated",
          ],
          required: true,
        },
        {
          name: "auto_renew",
          type: "boolean",
          trueRate: 0.4,
        },
      ],
    },
    {
      name: "events",
      sourceSystemId: "google_calendar",
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
          name: "attendee_response_id",
          type: "ref",
          ref: "attendee_responses.id",
          required: true,
        },
      ],
    },
    {
      name: "attendee_responses",
      sourceSystemId: "google_calendar",
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
          name: "respondent_id",
          type: "seq",
          required: true,
        },
        {
          name: "question_code",
          type: "lorem.words",
          required: true,
        },
        {
          name: "score",
          type: "number",
          min: 1,
          max: 10,
          required: true,
        },
        {
          name: "comment",
          type: "lorem.sentence",
        },
        {
          name: "submitted_at",
          type: "date",
          required: true,
        },
      ],
    },
    {
      name: "room_bookings",
      sourceSystemId: "google_calendar",
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
      name: "issues",
      sourceSystemId: "asana_jira",
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
      name: "sprints",
      sourceSystemId: "asana_jira",
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
      name: "epics",
      sourceSystemId: "asana_jira",
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
  ],
  relationships: [
    {
      from: "events.attendee_response_id",
      to: "attendee_responses.id",
      cardinality: "many-to-one",
      orphanPolicy: "none",
    },
  ],
  documents: [
    {
      id: "obligation-mining-tracking-policy-guide",
      sourceSystemId: "icertis",
      type: "policy",
      title: "Obligation Mining & Tracking Procurement Policy Guide",
      requiredSections: [
        "Sourcing principles",
        "Approval thresholds",
        "Supplier risk requirements",
        "Contract and compliance gates",
        "Exception handling",
      ],
      linkedEntities: [
        "contracts",
        "amendments",
        "obligations",
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
      id: "icertis_create_api",
      sourceSystemId: "icertis",
      method: "POST",
      path: "/api/icertis/create",
      description: "Synchronous endpoint the agent calls to create in Icertis after evidence gating.",
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
      id: "obligation-mining-tracking-baseline-gap",
      description: "Seed a realistic gap where Obligations captured sits between 40-50% manual and 98% automated, so the agent can detect, narrate, and recommend remediation.",
      affectedEntities: [
        "contracts",
        "amendments",
      ],
      discoveryPath: [
        "Inspect Icertis records for the affected entities",
        "Compare against DocuSign CLM historical baseline",
        "Generate a citation-backed recommendation",
      ],
      expectedEvidence: [
        "source-system record",
        "historical baseline metric",
        "generated audit trail",
      ],
      expectedRecommendation: "Explain the gap, cite supporting evidence, and propose the next Contract Manager action.",
    },
  ],
  datastorePackaging: {
    alloydb: {
      database: "obligation_mining_tracking",
      schemas: [
        "icertis",
        "docusign_clm",
        "google_calendar",
        "asana_jira",
      ],
    },
    bigquery: {
      dataset: "procurement_obligation_mining_tracking",
      tables: [
        "kpi_summary",
        "evidence_index",
      ],
    },
    cloudStorage: {
      bucketSuffix: "obligation-mining-tracking-evidence",
      prefixes: [
        "documents",
        "audit-trails",
        "exports",
      ],
    },
    apis: {
      serviceName: "obligation-mining-tracking-source-adapters",
      deploymentTarget: "cloud_run",
    },
  },
  validation: {
    smokePrompt: "Run the Obligation Mining & Tracking workflow and cite source-system evidence for every claim.",
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

export const ObligationMiningTracking = () => (
  <UseCaseSlide
    title="Obligation Mining & Tracking"
    subtitle="A-1403 • Contract Lifecycle"
    icon={ListChecks}
    domainId="domain-14"
    layer="Layer 3: Custom ADK"
    persona="Contract Manager"
    systems={["Icertis", "DocuSign CLM", "Google Calendar", "Asana/Jira", "Vertex AI"]}
    kpis={[
      { label: "Obligations captured", before: "40-50% manual", after: "98% automated" },
      { label: "Missed deadlines", before: "15-20% annually", after: "<2%" },
      { label: "Extraction time per contract", before: "4-8 hours", after: "15 minutes" },
    ]}
    triggerType="event"
    swimlane={swimlane}
    flow={flow}
    architecture={architecture}
    statusQuo={[
      "Obligation tracking relies on manual contract reading — analysts miss buried sentences in insurance and compliance clauses.",
      "Conditional obligations ('if volumes exceed 10K units, supplier shall provide dedicated account manager') go untracked.",
      "Calendar reminders set for key dates only; ongoing obligations like monthly reporting fall through cracks."
    ]}
    agentification={[
      "Gemini reads 50-page contracts and extracts obligations invisible to keyword search — buried in prose, not in 'Obligations' sections.",
      "LLM distinguishes one-time deliverables from ongoing obligations and conditional triggers, creating appropriate tracking workflows.",
      "Automatically creates structured task items with owners, deadlines, and escalation paths in Asana/Jira and Google Calendar."
    ]}
  />
);
