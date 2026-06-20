import React from "react";
import { UseCaseSlide } from "../../../agent/UseCaseSlide";
import { FileCheck, Download, Brain, FileText, CheckCircle } from "lucide-react";
import { FlowStep } from "../../../agent/ProcessFlow";
import { SwimlaneFlow } from "../../../agent/SwimlaneFlow";
import { AgentArchitecture, UseCaseGenerationSpec, AgentBehaviorContract} from "../../../../types/architecture";

const swimlane: SwimlaneFlow = {
  nodes: [
    { id: "s1", label: "Interviews Complete", lane: "system", type: "trigger" },
    { id: "a1", label: "Feedback Synthesis", lane: "agent", type: "action" },
    { id: "a2", label: "Consensus Analysis", lane: "agent", type: "action" },
    { id: "a3", label: "Debrief Report", lane: "agent", type: "output" },
  ],
  connections: [["s1", "a1"], ["a1", "a2"], ["a2", "a3"]],
};

const architecture: AgentArchitecture = {
  connections: [
    { system: "Greenhouse", description: "Interview scorecards, panel feedback, candidate evaluations", direction: "read", protocol: "REST API", category: "erp" },
    { system: "Google Docs", description: "Structured debrief summaries, selection rationale documents", direction: "write", protocol: "Workspace API", category: "collaboration" },
    { system: "Vertex AI (Gemini)", description: "Feedback synthesis, consensus analysis, rationale generation", direction: "bidirectional", protocol: "gRPC", category: "ai" },
  ],
  pipeline: [
    { label: "Feedback Collection", description: "Aggregate all interviewer scorecards, written feedback, and evaluation notes from Greenhouse after interview completion.", systems: ["Greenhouse"], layer: "integration", dataIn: "Raw scorecards + interviewer notes", dataOut: "Structured feedback by competency area" },
    { label: "Synthesis & Consensus", description: "Gemini synthesizes feedback into structured debrief document. Identifies consensus areas and disagreements across the panel with evidence citations.", systems: ["Vertex AI (Gemini)"], layer: "llm", dataIn: "Structured feedback + role requirements", dataOut: "Debrief summary with consensus analysis" },
    { label: "Documentation & Audit", description: "Selection rationale documented in Google Docs with full audit trail linking decisions to scorecard evidence for compliance.", systems: ["Google Docs"], layer: "integration", dataIn: "Debrief summary + decision rationale", dataOut: "Auditable selection documentation" },
  ],
};


const behaviorContract: AgentBehaviorContract = {
  role: "Hiring Manager agent for the Selection Debrief Summarizer workflow",
  primaryObjective: "Auto-summarizes interviewer feedback into structured debrief documents with competency-level roll-ups. Highlights consensus and disagreement areas across the interview panel to focus calibration discussions. so the Hiring Manager can move the Debrief prep KPI.",
  inScope: [
    "Auto-summarizes interviewer feedback into structured debrief documents with competency-level roll-ups",
    "Highlights consensus and disagreement areas across the interview panel to focus calibration discussions",
    "Generates auditable selection rationale documentation tied to scorecard data and role requirements",
  ],
  outOfScope: [
    "Final hiring, termination, or compensation decisions (HRBP/leadership retains authority)",
    "Performance management adjudication and disciplinary action",
    "Legal interpretation of employment law in ambiguous jurisdictions",
  ],
  toolIntents: [
    {
      name: "query_ats_ats_records",
      kind: "query",
      sourceSystemId: "ats",
      description: "Retrieve ats records from ATS for the Selection Debrief Summarizer workflow.",
      requiredInputs: [
        "lookup_key",
        "date_range",
      ],
      produces: [
        "ats_records_records",
        "ats_records_summary",
      ],
      evidenceEmitted: [
        "source_system_record",
      ],
    },
    {
      name: "query_google_docs_documents",
      kind: "query",
      sourceSystemId: "google_docs",
      description: "Retrieve documents from Google Docs for the Selection Debrief Summarizer workflow.",
      requiredInputs: [
        "lookup_key",
        "date_range",
      ],
      produces: [
        "documents_records",
        "documents_summary",
      ],
      evidenceEmitted: [
        "source_system_record",
      ],
    },
    {
      name: "query_google_meet_google_meet_records",
      kind: "query",
      sourceSystemId: "google_meet",
      description: "Retrieve google meet records from Google Meet for the Selection Debrief Summarizer workflow.",
      requiredInputs: [
        "lookup_key",
        "date_range",
      ],
      produces: [
        "google_meet_records_records",
        "google_meet_records_summary",
      ],
      evidenceEmitted: [
        "source_system_record",
      ],
    },
    {
      name: "lookup_selection_debrief_summarizer_policy_handbook",
      kind: "evidence_lookup",
      sourceSystemId: "google_docs",
      description: "Look up sections of the Selection Debrief Summarizer Policy Handbook to cite in narrative output, escalation rationale, and audit evidence.",
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
      name: "action_ats_generate",
      kind: "action",
      sourceSystemId: "ats",
      description: "Execute the generate step in ATS after the agent has gathered evidence and validated escalation gates.",
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
      claim: "Debrief prep moved from 1 hour toward Auto",
      mustCite: [
        "ats.ats_records",
        "google_docs.documents",
      ],
      sourceSystemIds: [
        "ats",
        "google_docs",
      ],
    },
    {
      claim: "Documentation moved from Informal notes toward Structured report",
      mustCite: [
        "ats.ats_records",
        "google_docs.documents",
      ],
      sourceSystemIds: [
        "ats",
        "google_docs",
      ],
    },
  ],
  escalationRules: [
    {
      trigger: "Debrief prep regresses past the 1 hour baseline by more than 20%",
      action: "escalate_to_human",
      handoffTarget: "Hiring Manager",
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
    "Never fabricate metric values; only publish numbers derived from ATS (and other named systems) entities.",
    "Never bypass Hiring Manager approval on escalation triggers, even when confidence is high.",
    "Never expose individual personal data (PII) in summaries; aggregate or pseudonymise before output.",
    "Never act on data older than the staleness threshold defined in the runbook without a fresh re-query.",
  ],
  goldenEvals: [
    {
      id: "selection-debrief-summarizer-end-to-end",
      prompt: "Run the Selection Debrief Summarizer workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.",
      expectedToolCalls: [
        "query_ats_ats_records",
        "query_google_docs_documents",
        "query_google_meet_google_meet_records",
        "lookup_selection_debrief_summarizer_policy_handbook",
        "action_ats_generate",
      ],
      mustReferenceEntities: [
        "ats_records",
        "documents",
        "google_meet_records",
      ],
      mustCiteDocuments: [
        "selection-debrief-summarizer-policy-handbook",
      ],
      expectedActionOutcome: "Action generate executed against ATS, with audit-trail entry and Hiring Manager notified of outcomes.",
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
    rationale: "Row counts sized for Selection Debrief Summarizer so the agent can demonstrate the workflow against realistic transactional volume without simulating a production warehouse.",
  },
  sourceSystems: [
    {
      id: "ats",
      name: "ATS",
      owns: [
        "ats_records",
        "ats_events",
        "ats_audit_trail",
      ],
      protocol: "REST API",
      localBacking: [
        "alloydb",
      ],
      toolNames: [
        "query_ats_ats_records",
        "query_ats_ats_events",
        "query_ats_ats_audit_trail",
      ],
      evidence: [
        "source_system_record",
        "generated_audit_trail",
      ],
    },
    {
      id: "google_docs",
      name: "Google Docs",
      owns: [
        "documents",
        "comments",
        "revision_history",
      ],
      protocol: "Workspace API",
      localBacking: [
        "cloud-storage",
      ],
      toolNames: [
        "query_google_docs_documents",
        "query_google_docs_comments",
        "query_google_docs_revision_history",
      ],
      evidence: [
        "source_system_record",
        "generated_audit_trail",
      ],
    },
    {
      id: "google_meet",
      name: "Google Meet",
      owns: [
        "google_meet_records",
        "google_meet_events",
        "google_meet_audit_trail",
      ],
      protocol: "REST API",
      localBacking: [
        "alloydb",
      ],
      toolNames: [
        "query_google_meet_google_meet_records",
        "query_google_meet_google_meet_events",
        "query_google_meet_google_meet_audit_trail",
      ],
      evidence: [
        "source_system_record",
        "generated_audit_trail",
      ],
    },
  ],
  entities: [
    {
      name: "ats_records",
      sourceSystemId: "ats",
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
      name: "ats_events",
      sourceSystemId: "ats",
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
          name: "ats_record_id",
          type: "ref",
          ref: "ats_records.id",
          required: true,
        },
      ],
    },
    {
      name: "ats_audit_trail",
      sourceSystemId: "ats",
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
      name: "documents",
      sourceSystemId: "google_docs",
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
      sourceSystemId: "google_docs",
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
      name: "revision_history",
      sourceSystemId: "google_docs",
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
          name: "document_id",
          type: "ref",
          ref: "documents.id",
          required: true,
        },
      ],
    },
    {
      name: "google_meet_records",
      sourceSystemId: "google_meet",
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
      name: "google_meet_events",
      sourceSystemId: "google_meet",
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
          name: "google_meet_record_id",
          type: "ref",
          ref: "google_meet_records.id",
          required: true,
        },
      ],
    },
    {
      name: "google_meet_audit_trail",
      sourceSystemId: "google_meet",
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
      from: "ats_events.ats_record_id",
      to: "ats_records.id",
      cardinality: "many-to-one",
      orphanPolicy: "none",
    },
    {
      from: "revision_history.document_id",
      to: "documents.id",
      cardinality: "many-to-one",
      orphanPolicy: "none",
    },
    {
      from: "google_meet_events.google_meet_record_id",
      to: "google_meet_records.id",
      cardinality: "many-to-one",
      orphanPolicy: "none",
    },
  ],
  documents: [
    {
      id: "selection-debrief-summarizer-policy-handbook",
      sourceSystemId: "ats",
      type: "policy",
      title: "Selection Debrief Summarizer Policy Handbook",
      requiredSections: [
        "Eligibility and scope",
        "Workflow steps",
        "Manager responsibilities",
        "Compliance and audit",
        "Sensitive-data handling",
      ],
      linkedEntities: [
        "ats_records",
        "ats_events",
        "ats_audit_trail",
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
      id: "ats_generate_api",
      sourceSystemId: "ats",
      method: "POST",
      path: "/api/ats/generate",
      description: "Synchronous endpoint the agent calls to generate in ATS after evidence gating.",
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
      id: "selection-debrief-summarizer-baseline-gap",
      description: "Seed a realistic gap where Debrief prep sits between 1 hour and Auto, so the agent can detect, narrate, and recommend remediation.",
      affectedEntities: [
        "ats_records",
        "ats_events",
      ],
      discoveryPath: [
        "Inspect ATS records for the affected entities",
        "Compare against Google Docs historical baseline",
        "Generate a citation-backed recommendation",
      ],
      expectedEvidence: [
        "source-system record",
        "historical baseline metric",
        "generated audit trail",
      ],
      expectedRecommendation: "Explain the gap, cite supporting evidence, and propose the next Hiring Manager action.",
    },
  ],
  datastorePackaging: {
    alloydb: {
      database: "selection_debrief_summarizer",
      schemas: [
        "ats",
        "google_docs",
        "google_meet",
      ],
    },
    bigquery: {
      dataset: "hr_selection_debrief_summarizer",
      tables: [
        "kpi_summary",
        "evidence_index",
      ],
    },
    cloudStorage: {
      bucketSuffix: "selection-debrief-summarizer-evidence",
      prefixes: [
        "documents",
        "audit-trails",
        "exports",
      ],
    },
    apis: {
      serviceName: "selection-debrief-summarizer-source-adapters",
      deploymentTarget: "cloud_run",
    },
  },
  validation: {
    smokePrompt: "Run the Selection Debrief Summarizer workflow and cite source-system evidence for every claim.",
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

export const SelectionDebriefSummarizer = () => (
  <UseCaseSlide
    title="Selection Debrief Summarizer"
    subtitle="A-208 • Interview & Selection"
    icon={FileCheck}
    domainId="domain-2"
    layer="Layer 1: OOTB"
    persona="Hiring Manager"
    systems={["ATS", "Google Docs", "Google Meet"]}
    kpis={[
      { label: "Debrief prep", before: "1 hour", after: "Auto" },
      { label: "Documentation", before: "Informal notes", after: "Structured report" },
      { label: "Decision audit trail", before: "None", after: "Complete" }
    ]}
    triggerType="event"
    swimlane={swimlane}
    architecture={architecture}
    statusQuo={[
      "Debrief meetings are unstructured, often dominated by loudest voices rather than evidence-based assessment.",
      "Selection rationale poorly documented, creating compliance risk and limiting process improvement insights.",
      "Calibration sessions lack data grounding — interviewers rely on memory rather than scorecard evidence."
    ]}
    agentification={[
      "Auto-summarizes interviewer feedback into structured debrief documents with competency-level roll-ups.",
      "Highlights consensus and disagreement areas across the interview panel to focus calibration discussions.",
      "Generates auditable selection rationale documentation tied to scorecard data and role requirements."
    ]}
    flow={[
      { label: "Feedback Collected", icon: Download, description: "Scorecards and notes aggregated from panel.", trigger: "Interviews Complete", systems: ["ATS"] },
      { label: "Synthesis", icon: Brain, description: "Consensus, disagreements, themes identified.", systems: ["Gemini"], integration: "OOTB" },
      { label: "Debrief Doc", icon: FileText, description: "Structured summary with recommendation generated." },
      { label: "Decision Logged", icon: CheckCircle, description: "Selection rationale documented for compliance.", output: "Debrief Report" }
    ] as FlowStep[]}
  />
);
