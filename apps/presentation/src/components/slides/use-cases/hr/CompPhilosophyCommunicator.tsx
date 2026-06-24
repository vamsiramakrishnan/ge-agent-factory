import React from "react";
import { UseCaseSlide } from "../../../agent/UseCaseSlide";
import { FlowStep } from "../../../agent/ProcessFlow";
import { SwimlaneFlow } from "../../../agent/SwimlaneFlow";
import { AgentArchitecture, UseCaseGenerationSpec, AgentBehaviorContract} from "../../../../types/architecture";
import { Megaphone, Upload, FileText, Users, Send } from "lucide-react";

const flow: FlowStep[] = [
  { label: "Philosophy Input", icon: Upload, description: "Comp philosophy and market positioning loaded.", trigger: "On-demand", systems: ["Comp System"] },
  { label: "Content Generation", icon: FileText, description: "Interactive guides and scenario-based training created.", systems: ["Gemini"], integration: "OOTB" },
  { label: "Contextualization", icon: Users, description: "Role-specific examples for each manager level." },
  { label: "Distribution", icon: Send, description: "Guides published via LMS and manager portal.", output: "Manager Guides" },
];

const swimlane: SwimlaneFlow = {
  nodes: [
    { id: "trigger", label: "Manager Question", lane: "human", type: "trigger" },
    { id: "content", label: "Content Generation", lane: "agent", type: "action" },
    { id: "context", label: "Contextualization", lane: "agent", type: "action" },
    { id: "output", label: "Manager Guide", lane: "agent", type: "output" },
  ],
  connections: [["trigger", "content"], ["content", "context"], ["context", "output"]],
};

const architecture: AgentArchitecture = {
  connections: [
    { system: "Workday", description: "Compensation philosophy documents, pay structures, grade bands", direction: "read", protocol: "REST API", category: "erp" },
    { system: "Google Docs", description: "Manager guides, FAQ content, scenario-based training materials", direction: "write", protocol: "Workspace API", category: "collaboration" },
    { system: "Vertex AI (Gemini)", description: "Context-aware content generation, manager Q&A, scenario creation", direction: "bidirectional", protocol: "gRPC", category: "ai" },
  ],
  pipeline: [
    { label: "Philosophy Ingestion", description: "Load compensation philosophy, market positioning strategy, and pay structure documentation from Workday and internal policy stores.", systems: ["Workday"], layer: "integration", dataIn: "Comp philosophy PDFs, pay structures, grade bands", dataOut: "Structured philosophy knowledge base" },
    { label: "Content Generation", description: "Gemini generates interactive manager guides with role-specific examples, scenario-based decision support, and FAQ content tailored to each manager's org context.", systems: ["Vertex AI (Gemini)"], layer: "llm", dataIn: "Philosophy knowledge base + manager context", dataOut: "Personalized manager guides with scenarios" },
    { label: "Distribution & Tracking", description: "Guides published to Google Docs and LMS with completion tracking. Manager portal surfaces contextual guidance at point of pay decision.", systems: ["Google Docs", "LMS"], layer: "integration", dataIn: "Generated guide content", dataOut: "Published guides with read tracking" },
  ],
};


const behaviorContract: AgentBehaviorContract = {
  role: "Manager agent for the Compensation Philosophy Communicator workflow",
  primaryObjective: "Interactive compensation philosophy guides tailored to each manager's context. Contextual pay decision support surfacing relevant policy at point of need. so the Manager can move the Manager comp literacy KPI.",
  inScope: [
    "Interactive compensation philosophy guides tailored to each manager's context",
    "Contextual pay decision support surfacing relevant policy at point of need",
    "Scenario-based training content reinforcing consistent compensation practices",
  ],
  outOfScope: [
    "Final hiring, termination, or compensation decisions (HRBP/leadership retains authority)",
    "Performance management adjudication and disciplinary action",
    "Legal interpretation of employment law in ambiguous jurisdictions",
  ],
  toolIntents: [
    {
      name: "query_google_docs_documents",
      kind: "query",
      sourceSystemId: "google_docs",
      description: "Retrieve documents from Google Docs for the Compensation Philosophy Communicator workflow.",
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
      name: "query_slack_messages",
      kind: "query",
      sourceSystemId: "slack",
      description: "Retrieve messages from Slack for the Compensation Philosophy Communicator workflow.",
      requiredInputs: [
        "lookup_key",
        "date_range",
      ],
      produces: [
        "messages_records",
        "messages_summary",
      ],
      evidenceEmitted: [
        "source_system_record",
      ],
    },
    {
      name: "query_lms_lms_records",
      kind: "query",
      sourceSystemId: "lms",
      description: "Retrieve lms records from LMS for the Compensation Philosophy Communicator workflow.",
      requiredInputs: [
        "lookup_key",
        "date_range",
      ],
      produces: [
        "lms_records_records",
        "lms_records_summary",
      ],
      evidenceEmitted: [
        "source_system_record",
      ],
    },
    {
      name: "lookup_compensation_philosophy_communicator_policy_handbook",
      kind: "evidence_lookup",
      sourceSystemId: "google_docs",
      description: "Look up sections of the Compensation Philosophy Communicator Policy Handbook to cite in narrative output, escalation rationale, and audit evidence.",
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
      claim: "Manager comp literacy moved from Low toward High",
      mustCite: [
        "google_docs.documents",
        "slack.messages",
      ],
      sourceSystemIds: [
        "google_docs",
        "slack",
      ],
    },
    {
      claim: "Pay decision consistency moved from Ad-hoc toward Philosophy-aligned",
      mustCite: [
        "google_docs.documents",
        "slack.messages",
      ],
      sourceSystemIds: [
        "google_docs",
        "slack",
      ],
    },
  ],
  escalationRules: [
    {
      trigger: "Manager comp literacy regresses past the Low baseline by more than 20%",
      action: "escalate_to_human",
      handoffTarget: "Manager",
      rationale: "Significant regressions need human judgment before automated remediation runs against production records.",
    },
    {
      trigger: "Source-system evidence is incomplete or stale (>24h) for any required entity",
      action: "request_more_info",
      rationale: "Recommendations grounded in stale evidence misrepresent current state and undermine audit defensibility.",
    },
  ],
  refusalRules: [
    "Never fabricate metric values; only publish numbers derived from Google Docs (and other named systems) entities.",
    "Never bypass Manager approval on escalation triggers, even when confidence is high.",
    "Never expose individual personal data (PII) in summaries; aggregate or pseudonymise before output.",
    "Never act on data older than the staleness threshold defined in the runbook without a fresh re-query.",
  ],
  goldenEvals: [
    {
      id: "compensation-philosophy-communicator-end-to-end",
      prompt: "Run the Compensation Philosophy Communicator workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.",
      expectedToolCalls: [
        "query_google_docs_documents",
        "query_slack_messages",
        "query_lms_lms_records",
        "lookup_compensation_philosophy_communicator_policy_handbook",
      ],
      mustReferenceEntities: [
        "documents",
        "messages",
        "lms_records",
      ],
      mustCiteDocuments: [
        "compensation-philosophy-communicator-policy-handbook",
      ],
      expectedActionOutcome: "Manager receives a fully-cited recommendation; no external state change without explicit approval.",
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
    rationale: "Row counts sized for Compensation Philosophy Communicator so the agent can demonstrate the workflow against realistic transactional volume without simulating a production warehouse.",
  },
  sourceSystems: [
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
      id: "slack",
      name: "Slack",
      owns: [
        "messages",
        "channels",
        "thread_replies",
      ],
      protocol: "Slack API",
      localBacking: [
        "json-api",
      ],
      toolNames: [
        "query_slack_messages",
        "query_slack_channels",
        "query_slack_thread_replies",
      ],
      evidence: [
        "source_system_record",
        "generated_audit_trail",
      ],
    },
    {
      id: "lms",
      name: "LMS",
      owns: [
        "lms_records",
        "lms_events",
        "lms_audit_trail",
      ],
      protocol: "REST API",
      localBacking: [
        "alloydb",
      ],
      toolNames: [
        "query_lms_lms_records",
        "query_lms_lms_events",
        "query_lms_lms_audit_trail",
      ],
      evidence: [
        "source_system_record",
        "generated_audit_trail",
      ],
    },
  ],
  entities: [
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
      name: "messages",
      sourceSystemId: "slack",
      datastore: "json-api",
      rowCount: 60,
      primaryKey: "id",
      columns: [
        {
          name: "id",
          type: "seq",
          required: true,
        },
        {
          name: "channel",
          type: "lorem.words",
          required: true,
        },
        {
          name: "author",
          type: "person.fullName",
          required: true,
        },
        {
          name: "body",
          type: "lorem.sentence",
          required: true,
        },
        {
          name: "sentiment",
          type: "enum",
          values: [
            "positive",
            "neutral",
            "negative",
          ],
          weights: [
            0.4,
            0.4,
            0.2,
          ],
          required: true,
        },
        {
          name: "sent_at",
          type: "date",
          required: true,
        },
      ],
    },
    {
      name: "channels",
      sourceSystemId: "slack",
      datastore: "json-api",
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
      name: "thread_replies",
      sourceSystemId: "slack",
      datastore: "json-api",
      rowCount: 60,
      primaryKey: "id",
      columns: [
        {
          name: "id",
          type: "seq",
          required: true,
        },
        {
          name: "channel",
          type: "lorem.words",
          required: true,
        },
        {
          name: "author",
          type: "person.fullName",
          required: true,
        },
        {
          name: "body",
          type: "lorem.sentence",
          required: true,
        },
        {
          name: "sentiment",
          type: "enum",
          values: [
            "positive",
            "neutral",
            "negative",
          ],
          weights: [
            0.4,
            0.4,
            0.2,
          ],
          required: true,
        },
        {
          name: "sent_at",
          type: "date",
          required: true,
        },
      ],
    },
    {
      name: "lms_records",
      sourceSystemId: "lms",
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
      name: "lms_events",
      sourceSystemId: "lms",
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
          name: "lms_record_id",
          type: "ref",
          ref: "lms_records.id",
          required: true,
        },
      ],
    },
    {
      name: "lms_audit_trail",
      sourceSystemId: "lms",
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
      from: "revision_history.document_id",
      to: "documents.id",
      cardinality: "many-to-one",
      orphanPolicy: "none",
    },
    {
      from: "lms_events.lms_record_id",
      to: "lms_records.id",
      cardinality: "many-to-one",
      orphanPolicy: "none",
    },
  ],
  documents: [
    {
      id: "compensation-philosophy-communicator-policy-handbook",
      sourceSystemId: "google_docs",
      type: "policy",
      title: "Compensation Philosophy Communicator Policy Handbook",
      requiredSections: [
        "Eligibility and scope",
        "Workflow steps",
        "Manager responsibilities",
        "Compliance and audit",
        "Sensitive-data handling",
      ],
      linkedEntities: [
        "documents",
        "comments",
        "revision_history",
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
  apis: [],
  anomalies: [
    {
      id: "compensation-philosophy-communicator-baseline-gap",
      description: "Seed a realistic gap where Manager comp literacy sits between Low and High, so the agent can detect, narrate, and recommend remediation.",
      affectedEntities: [
        "documents",
        "comments",
      ],
      discoveryPath: [
        "Inspect Google Docs records for the affected entities",
        "Compare against Slack historical baseline",
        "Generate a citation-backed recommendation",
      ],
      expectedEvidence: [
        "source-system record",
        "historical baseline metric",
        "generated audit trail",
      ],
      expectedRecommendation: "Explain the gap, cite supporting evidence, and propose the next Manager action.",
    },
  ],
  datastorePackaging: {
    alloydb: {
      database: "compensation_philosophy_communicator",
      schemas: [
        "google_docs",
        "slack",
        "lms",
      ],
    },
    bigquery: {
      dataset: "hr_compensation_philosophy_communicator",
      tables: [
        "kpi_summary",
        "evidence_index",
      ],
    },
    cloudStorage: {
      bucketSuffix: "compensation-philosophy-communicator-evidence",
      prefixes: [
        "documents",
        "audit-trails",
        "exports",
      ],
    },
    apis: {
      serviceName: "compensation-philosophy-communicator-source-adapters",
      deploymentTarget: "cloud_run",
    },
  },
  validation: {
    smokePrompt: "Run the Compensation Philosophy Communicator workflow and cite source-system evidence for every claim.",
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

export const CompPhilosophyCommunicator = () => (
  <UseCaseSlide
    title="Compensation Philosophy Communicator"
    subtitle="A-402 • Total Rewards"
    icon={Megaphone}
    domainId="domain-4"
    layer="Layer 1: OOTB"
    persona="Manager"
    systems={["Google Docs", "Slack", "LMS"]}
    kpis={[
      { label: "Manager comp literacy", before: "Low", after: "High" },
      { label: "Pay decision consistency", before: "Ad-hoc", after: "Philosophy-aligned" },
      { label: "Employee trust", before: "Opaque", after: "Transparent" },
    ]}
    flow={flow}
    triggerType="chat"
    swimlane={swimlane}
    architecture={architecture}
    statusQuo={[
      "Comp philosophy exists as a PDF document nobody reads or references.",
      "Managers make pay decisions without understanding the strategic intent.",
      "Inconsistent messaging erodes employee trust in pay fairness."
    ]}
    agentification={[
      "Interactive compensation philosophy guides tailored to each manager's context.",
      "Contextual pay decision support surfacing relevant policy at point of need.",
      "Scenario-based training content reinforcing consistent compensation practices."
    ]}
  />
);
