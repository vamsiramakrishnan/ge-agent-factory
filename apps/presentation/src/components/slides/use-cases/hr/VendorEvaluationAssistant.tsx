import React from "react";
import { UseCaseSlide } from "../../../agent/UseCaseSlide";
import { FlowStep } from "../../../agent/ProcessFlow";
import { SwimlaneFlow } from "../../../agent/SwimlaneFlow";
import { AgentArchitecture, UseCaseGenerationSpec, AgentBehaviorContract} from "../../../../types/architecture";
import { ShoppingCart, Upload, Search, Layers, Calculator } from "lucide-react";

const swimlane: SwimlaneFlow = {
  nodes: [
    { id: "n1", label: "Evaluation Request", lane: "human", type: "trigger" },
    { id: "n2", label: "Proposal Analysis", lane: "agent", type: "action" },
    { id: "n3", label: "Comparison Matrix", lane: "agent", type: "action" },
    { id: "n4", label: "Vendor Scorecard", lane: "agent", type: "output" },
  ],
  connections: [["n1", "n2"], ["n2", "n3"], ["n3", "n4"]],
};

const architecture: AgentArchitecture = {
  connections: [
    { system: "Gartner", description: "Market research, Magic Quadrant positioning, capability assessments", direction: "read", protocol: "REST API", category: "market-data" },
    { system: "G2", description: "User reviews, satisfaction ratings, feature comparison data", direction: "read", protocol: "REST API", category: "market-data" },
    { system: "Google Docs", description: "Requirements documents, evaluation criteria, vendor proposals", direction: "bidirectional", protocol: "Workspace API", category: "collaboration" },
    { system: "Vertex AI (Gemini)", description: "Proposal analysis, feature-gap detection, TCO modeling, recommendation generation", direction: "bidirectional", protocol: "gRPC", category: "ai" },
  ],
  pipeline: [
    { label: "Requirements Intake", description: "Ingest evaluation criteria and requirements from Google Docs. Pull market context from Gartner Magic Quadrants and G2 user reviews for the relevant vendor category.", systems: ["Google Docs", "Gartner", "G2"], layer: "integration", dataIn: "Evaluation criteria + vendor proposals + market data", dataOut: "Structured requirements matrix with market context" },
    { label: "Proposal Analysis", description: "Gemini analyzes vendor proposals against weighted evaluation criteria. Score each vendor on functional fit, technical alignment, and strategic value.", systems: ["Vertex AI (Gemini)"], layer: "llm", dataIn: "Structured requirements + vendor proposals", dataOut: "Vendor scores with functional fit analysis" },
    { label: "Feature-Gap Analysis", description: "Generate competitive feature comparison matrix identifying gaps, differentiators, and must-have capabilities. Cross-reference with G2 user satisfaction data.", systems: ["Vertex AI (Gemini)"], layer: "llm", dataIn: "Vendor scores + feature lists + G2 reviews", dataOut: "Feature-gap matrix with competitive comparison" },
    { label: "TCO & Recommendation", description: "Model total cost of ownership including implementation, training, and ongoing support. Generate final recommendation with implementation risk assessment and timeline.", systems: ["Vertex AI (Gemini)"], layer: "llm", dataIn: "Feature-gap analysis + pricing data + risk factors", dataOut: "Vendor scorecard with TCO model and recommendation" },
  ],
};


const behaviorContract: AgentBehaviorContract = {
  role: "HR Tech Lead agent for the Vendor Evaluation Assistant workflow",
  primaryObjective: "Structured vendor evaluation framework with weighted scoring and stakeholder input. Automated feature-gap analysis against documented requirements and priorities. so the HR Tech Lead can move the Evaluation consistency KPI.",
  inScope: [
    "Structured vendor evaluation framework with weighted scoring and stakeholder input",
    "Automated feature-gap analysis against documented requirements and priorities",
    "TCO modeling with implementation risk assessment and timeline projections",
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
      description: "Retrieve documents from Google Docs for the Vendor Evaluation Assistant workflow.",
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
      name: "query_google_sheets_sheets",
      kind: "query",
      sourceSystemId: "google_sheets",
      description: "Retrieve sheets from Google Sheets for the Vendor Evaluation Assistant workflow.",
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
      name: "query_web_web_records",
      kind: "query",
      sourceSystemId: "web",
      description: "Retrieve web records from Web for the Vendor Evaluation Assistant workflow.",
      requiredInputs: [
        "lookup_key",
        "date_range",
      ],
      produces: [
        "web_records_records",
        "web_records_summary",
      ],
      evidenceEmitted: [
        "source_system_record",
      ],
    },
    {
      name: "lookup_vendor_evaluation_assistant_policy_handbook",
      kind: "evidence_lookup",
      sourceSystemId: "google_docs",
      description: "Look up sections of the Vendor Evaluation Assistant Policy Handbook to cite in narrative output, escalation rationale, and audit evidence.",
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
      claim: "Evaluation consistency moved from Varies by evaluator toward Standardized",
      mustCite: [
        "google_docs.documents",
        "google_sheets.sheets",
      ],
      sourceSystemIds: [
        "google_docs",
        "google_sheets",
      ],
    },
    {
      claim: "TCO accuracy moved from Estimate toward Modeled",
      mustCite: [
        "google_docs.documents",
        "google_sheets.sheets",
      ],
      sourceSystemIds: [
        "google_docs",
        "google_sheets",
      ],
    },
  ],
  escalationRules: [
    {
      trigger: "Evaluation consistency regresses past the Varies by evaluator baseline by more than 20%",
      action: "escalate_to_human",
      handoffTarget: "HR Tech Lead",
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
    "Never bypass HR Tech Lead approval on escalation triggers, even when confidence is high.",
    "Never expose individual personal data (PII) in summaries; aggregate or pseudonymise before output.",
    "Never act on data older than the staleness threshold defined in the runbook without a fresh re-query.",
  ],
  goldenEvals: [
    {
      id: "vendor-evaluation-assistant-end-to-end",
      prompt: "Run the Vendor Evaluation Assistant workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.",
      expectedToolCalls: [
        "query_google_docs_documents",
        "query_google_sheets_sheets",
        "query_web_web_records",
        "lookup_vendor_evaluation_assistant_policy_handbook",
      ],
      mustReferenceEntities: [
        "documents",
        "sheets",
        "web_records",
      ],
      mustCiteDocuments: [
        "vendor-evaluation-assistant-policy-handbook",
      ],
      expectedActionOutcome: "HR Tech Lead receives a fully-cited recommendation; no external state change without explicit approval.",
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
    rationale: "Row counts sized for Vendor Evaluation Assistant so the agent can demonstrate the workflow against realistic transactional volume without simulating a production warehouse.",
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
    {
      id: "web",
      name: "Web",
      owns: [
        "web_records",
        "web_events",
        "web_audit_trail",
      ],
      protocol: "REST API",
      localBacking: [
        "alloydb",
      ],
      toolNames: [
        "query_web_web_records",
        "query_web_web_events",
        "query_web_web_audit_trail",
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
    {
      name: "web_records",
      sourceSystemId: "web",
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
      name: "web_events",
      sourceSystemId: "web",
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
          name: "web_record_id",
          type: "ref",
          ref: "web_records.id",
          required: true,
        },
      ],
    },
    {
      name: "web_audit_trail",
      sourceSystemId: "web",
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
      from: "edit_history.sheet_id",
      to: "sheets.id",
      cardinality: "many-to-one",
      orphanPolicy: "none",
    },
    {
      from: "web_events.web_record_id",
      to: "web_records.id",
      cardinality: "many-to-one",
      orphanPolicy: "none",
    },
  ],
  documents: [
    {
      id: "vendor-evaluation-assistant-policy-handbook",
      sourceSystemId: "google_docs",
      type: "policy",
      title: "Vendor Evaluation Assistant Policy Handbook",
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
      id: "vendor-evaluation-assistant-baseline-gap",
      description: "Seed a realistic gap where Evaluation consistency sits between Varies by evaluator and Standardized, so the agent can detect, narrate, and recommend remediation.",
      affectedEntities: [
        "documents",
        "comments",
      ],
      discoveryPath: [
        "Inspect Google Docs records for the affected entities",
        "Compare against Google Sheets historical baseline",
        "Generate a citation-backed recommendation",
      ],
      expectedEvidence: [
        "source-system record",
        "historical baseline metric",
        "generated audit trail",
      ],
      expectedRecommendation: "Explain the gap, cite supporting evidence, and propose the next HR Tech Lead action.",
    },
  ],
  datastorePackaging: {
    alloydb: {
      database: "vendor_evaluation_assistant",
      schemas: [
        "google_docs",
        "google_sheets",
        "web",
      ],
    },
    bigquery: {
      dataset: "hr_vendor_evaluation_assistant",
      tables: [
        "kpi_summary",
        "evidence_index",
      ],
    },
    cloudStorage: {
      bucketSuffix: "vendor-evaluation-assistant-evidence",
      prefixes: [
        "documents",
        "audit-trails",
        "exports",
      ],
    },
    apis: {
      serviceName: "vendor-evaluation-assistant-source-adapters",
      deploymentTarget: "cloud_run",
    },
  },
  validation: {
    smokePrompt: "Run the Vendor Evaluation Assistant workflow and cite source-system evidence for every claim.",
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

export const VendorEvaluationAssistant = () => (
  <UseCaseSlide
    triggerType="chat"
    swimlane={swimlane}
    title="Vendor Evaluation Assistant"
    subtitle="A-1005 • HR Technology Management"
    icon={ShoppingCart}
    domainId="domain-10"
    layer="Layer 1: OOTB"
    persona="HR Tech Lead"
    systems={["Google Docs", "Google Sheets", "Web"]}
    kpis={[
      { label: "Evaluation consistency", before: "Varies by evaluator", after: "Standardized" },
      { label: "TCO accuracy", before: "Estimate", after: "Modeled" },
      { label: "Decision speed", before: "Months", after: "Weeks" }
    ]}
    statusQuo={[
      "Vendor evaluations done in ad-hoc spreadsheets with inconsistent criteria.",
      "Feature comparison varies across evaluators with no standardized framework.",
      "Total cost of ownership poorly estimated, leading to budget surprises post-implementation."
    ]}
    agentification={[
      "Structured vendor evaluation framework with weighted scoring and stakeholder input.",
      "Automated feature-gap analysis against documented requirements and priorities.",
      "TCO modeling with implementation risk assessment and timeline projections."
    ]}
    architecture={architecture}
    flow={[
      { label: "Requirements", icon: Upload, description: "Evaluation criteria and requirements defined.", trigger: "Vendor Eval", systems: ["Docs"] },
      { label: "Analysis", icon: Search, description: "Vendor proposals analyzed against weighted criteria.", systems: ["Gemini"], integration: "OOTB" },
      { label: "Comparison", icon: Layers, description: "Feature-gap analysis and competitive matrix generated." },
      { label: "TCO & Recommendation", icon: Calculator, description: "TCO model with implementation risk assessment.", output: "Vendor Scorecard" }
    ]}
  />
);
