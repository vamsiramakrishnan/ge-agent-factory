import React from "react";
import { UseCaseSlide } from "../../../agent/UseCaseSlide";
import { FlowStep } from "../../../agent/ProcessFlow";
import { SwimlaneFlow } from "../../../agent/SwimlaneFlow";
import { AgentArchitecture, UseCaseGenerationSpec, AgentBehaviorContract} from "../../../../types/architecture";
import { ShieldCheck, FileText, Search, MessageSquare, Send } from "lucide-react";

const swimlane: SwimlaneFlow = {
  nodes: [
    { id: "s1", label: "Content Submitted", lane: "system", type: "trigger" },
    { id: "a1", label: "Style Analysis", lane: "agent", type: "action" },
    { id: "a2", label: "Deviation Detection", lane: "agent", type: "action" },
    { id: "a3", label: "Annotated Feedback", lane: "agent", type: "output" },
  ],
  connections: [["s1", "a1"], ["a1", "a2"], ["a2", "a3"]],
};

const flow: FlowStep[] = [
  { label: "Content Ingest", icon: FileText, description: "Content submitted for review intercepted from submission workflows.", trigger: "Content submitted", systems: ["Google Docs", "WordPress"] },
  { label: "Style Scanning", icon: Search, description: "Content scanned against brand guidelines for terminology compliance and readability metrics.", systems: ["Vertex AI", "Contentful"], integration: "ADK" },
  { label: "Tonal Assessment", icon: MessageSquare, description: "Gemini assesses whether content sounds like the brand, catching tonal mismatches beyond prohibited terms.", systems: ["Vertex AI"] },
  { label: "Feedback Delivery", icon: Send, description: "Annotated feedback with specific suggested rewrites returned to content authors.", output: "Brand Audit" },
];

const architecture: AgentArchitecture = {
  connections: [
    { system: "Google Docs", description: "Content submission intake, annotated feedback output", direction: "bidirectional", protocol: "Workspace API", category: "collaboration" },
    { system: "WordPress", description: "Blog content review, CMS publishing workflow integration", direction: "read", protocol: "REST API", category: "collaboration" },
    { system: "Contentful", description: "Headless CMS content review, component-level checking", direction: "read", protocol: "REST API", category: "collaboration" },
    { system: "HubSpot", description: "Email and landing page content review integration", direction: "read", protocol: "REST API", category: "erp" },
    { system: "Vertex AI (Gemini)", description: "Tonal analysis, brand voice matching, rewrite suggestions", direction: "bidirectional", protocol: "gRPC", category: "ai" },
  ],
  pipeline: [
    { label: "Content Interception", description: "Hook into content submission workflows across Google Docs, WordPress, Contentful, and HubSpot. Capture submitted content with metadata and content type.", systems: ["Google Docs", "WordPress", "Contentful", "HubSpot"], layer: "integration", dataIn: "Submitted content across platforms", dataOut: "Content body + type + author metadata" },
    { label: "Style Consistency Scoring", description: "Score content against brand guidelines database. Check terminology compliance, readability metrics, and structural consistency.", systems: ["BigQuery"], layer: "ml", dataIn: "Content text + brand guidelines database", dataOut: "Style compliance scores + terminology flags" },
    { label: "Tonal Assessment", description: "Read content and assess whether it sounds like the brand \u2014 catching not just prohibited terms but tonal mismatches. Distinguish between appropriately formal (whitepaper) and inappropriately stiff (blog post) within the same brand voice framework.", systems: ["Vertex AI (Gemini)"], layer: "llm", dataIn: "Content + brand voice parameters + content type", dataOut: "Tonal assessment with suggested rewrites" },
    { label: "Feedback Delivery", description: "Annotated feedback returned to authors via the original submission platform with specific rewrite suggestions and brand guideline references.", systems: ["Google Docs"], layer: "integration", dataIn: "Assessment results + rewrite suggestions", dataOut: "Annotated content document" },
  ],
};


const behaviorContract: AgentBehaviorContract = {
  role: "Brand Manager agent for the Brand Voice Checker workflow",
  primaryObjective: "Gemini assesses whether content sounds like the brand, catching tonal mismatches that go beyond prohibited terms. Understands the difference between appropriately formal (whitepaper) and inappropriately stiff (blog post) within the same brand voice. so the Brand Manager can move the Brand compliance rate KPI.",
  inScope: [
    "Gemini assesses whether content sounds like the brand, catching tonal mismatches that go beyond prohibited terms",
    "Understands the difference between appropriately formal (whitepaper) and inappropriately stiff (blog post) within the same brand voice",
    "Generates specific rewrite suggestions rather than abstract feedback, reducing revision cycles",
  ],
  outOfScope: [
    "Final approval of paid spend reallocations above the governance threshold",
    "Trademark, legal, or regulated-industry claim approval",
    "Crisis communications without comms-team sign-off",
  ],
  toolIntents: [
    {
      name: "query_google_docs_documents",
      kind: "query",
      sourceSystemId: "google_docs",
      description: "Retrieve documents from Google Docs for the Brand Voice Checker workflow.",
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
      name: "query_wordpress_content_entries",
      kind: "query",
      sourceSystemId: "wordpress",
      description: "Retrieve content entries from WordPress for the Brand Voice Checker workflow.",
      requiredInputs: [
        "lookup_key",
        "date_range",
      ],
      produces: [
        "content_entries_records",
        "content_entries_summary",
      ],
      evidenceEmitted: [
        "source_system_record",
      ],
    },
    {
      name: "query_contentful_content_entries",
      kind: "query",
      sourceSystemId: "contentful",
      description: "Retrieve content entries from Contentful for the Brand Voice Checker workflow.",
      requiredInputs: [
        "lookup_key",
        "date_range",
      ],
      produces: [
        "content_entries_records",
        "content_entries_summary",
      ],
      evidenceEmitted: [
        "source_system_record",
      ],
    },
    {
      name: "query_hubspot_contacts",
      kind: "query",
      sourceSystemId: "hubspot",
      description: "Retrieve contacts from HubSpot for the Brand Voice Checker workflow.",
      requiredInputs: [
        "lookup_key",
        "date_range",
      ],
      produces: [
        "contacts_records",
        "contacts_summary",
      ],
      evidenceEmitted: [
        "source_system_record",
      ],
    },
    {
      name: "lookup_brand_voice_checker_playbook",
      kind: "evidence_lookup",
      sourceSystemId: "google_docs",
      description: "Look up sections of the Brand Voice Checker Playbook to cite in narrative output, escalation rationale, and audit evidence.",
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
      name: "action_google_docs_generate",
      kind: "action",
      sourceSystemId: "google_docs",
      description: "Execute the generate step in Google Docs after the agent has gathered evidence and validated escalation gates.",
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
      claim: "Brand compliance rate moved from 72% toward 94%",
      mustCite: [
        "google_docs.documents",
        "wordpress.content_entries",
      ],
      sourceSystemIds: [
        "google_docs",
        "wordpress",
      ],
    },
    {
      claim: "Review turnaround moved from 1-2 days toward < 5 minutes",
      mustCite: [
        "google_docs.documents",
        "wordpress.content_entries",
      ],
      sourceSystemIds: [
        "google_docs",
        "wordpress",
      ],
    },
  ],
  escalationRules: [
    {
      trigger: "Brand compliance rate regresses past the 72% baseline by more than 20%",
      action: "escalate_to_human",
      handoffTarget: "Brand Manager",
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
    "Never fabricate metric values; only publish numbers derived from Google Docs (and other named systems) entities.",
    "Never bypass Brand Manager approval on escalation triggers, even when confidence is high.",
    "Never expose individual personal data (PII) in summaries; aggregate or pseudonymise before output.",
    "Never act on data older than the staleness threshold defined in the runbook without a fresh re-query.",
  ],
  goldenEvals: [
    {
      id: "brand-voice-checker-end-to-end",
      prompt: "Run the Brand Voice Checker workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.",
      expectedToolCalls: [
        "query_google_docs_documents",
        "query_wordpress_content_entries",
        "query_contentful_content_entries",
        "query_hubspot_contacts",
        "lookup_brand_voice_checker_playbook",
        "action_google_docs_generate",
      ],
      mustReferenceEntities: [
        "documents",
        "content_entries",
        "content_entries",
        "contacts",
      ],
      mustCiteDocuments: [
        "brand-voice-checker-playbook",
      ],
      expectedActionOutcome: "Action generate executed against Google Docs, with audit-trail entry and Brand Manager notified of outcomes.",
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
    rationale: "Row counts sized for Brand Voice Checker so the agent can demonstrate the workflow against realistic transactional volume without simulating a production warehouse.",
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
      id: "wordpress",
      name: "WordPress",
      owns: [
        "content_entries",
        "publishing_workflows",
        "media_assets",
      ],
      protocol: "REST API",
      localBacking: [
        "cloud-storage",
      ],
      toolNames: [
        "query_wordpress_content_entries",
        "query_wordpress_publishing_workflows",
        "query_wordpress_media_assets",
      ],
      evidence: [
        "source_system_record",
        "generated_audit_trail",
      ],
    },
    {
      id: "contentful",
      name: "Contentful",
      owns: [
        "content_entries",
        "publishing_workflows",
        "media_assets",
      ],
      protocol: "REST API",
      localBacking: [
        "cloud-storage",
      ],
      toolNames: [
        "query_contentful_content_entries",
        "query_contentful_publishing_workflows",
        "query_contentful_media_assets",
      ],
      evidence: [
        "source_system_record",
        "generated_audit_trail",
      ],
    },
    {
      id: "hubspot",
      name: "HubSpot",
      owns: [
        "contacts",
        "deals",
        "engagement_events",
      ],
      protocol: "REST API",
      localBacking: [
        "alloydb",
      ],
      toolNames: [
        "query_hubspot_contacts",
        "query_hubspot_deals",
        "query_hubspot_engagement_events",
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
      name: "content_entries",
      sourceSystemId: "wordpress",
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
      name: "publishing_workflows",
      sourceSystemId: "wordpress",
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
      name: "media_assets",
      sourceSystemId: "wordpress",
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
      name: "contacts",
      sourceSystemId: "hubspot",
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
          type: "person.fullName",
          required: true,
        },
        {
          name: "email",
          type: "internet.email",
          required: true,
        },
        {
          name: "company",
          type: "company.name",
          required: true,
        },
        {
          name: "score",
          type: "number",
          min: 0,
          max: 100,
          required: true,
        },
        {
          name: "stage",
          type: "enum",
          values: [
            "new",
            "qualified",
            "engaged",
            "opportunity",
            "lost",
          ],
          required: true,
        },
        {
          name: "created_at",
          type: "date",
          required: true,
        },
      ],
    },
    {
      name: "deals",
      sourceSystemId: "hubspot",
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
      name: "engagement_events",
      sourceSystemId: "hubspot",
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
          type: "person.fullName",
          required: true,
        },
        {
          name: "email",
          type: "internet.email",
          required: true,
        },
        {
          name: "company",
          type: "company.name",
          required: true,
        },
        {
          name: "score",
          type: "number",
          min: 0,
          max: 100,
          required: true,
        },
        {
          name: "stage",
          type: "enum",
          values: [
            "new",
            "qualified",
            "engaged",
            "opportunity",
            "lost",
          ],
          required: true,
        },
        {
          name: "created_at",
          type: "date",
          required: true,
        },
        {
          name: "contact_id",
          type: "ref",
          ref: "contacts.id",
          required: true,
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
      from: "engagement_events.contact_id",
      to: "contacts.id",
      cardinality: "many-to-one",
      orphanPolicy: "none",
    },
  ],
  documents: [
    {
      id: "brand-voice-checker-playbook",
      sourceSystemId: "google_docs",
      type: "playbook",
      title: "Brand Voice Checker Playbook",
      requiredSections: [
        "Audience guidelines",
        "Brand voice rules",
        "Channel-specific guardrails",
        "Measurement framework",
        "Approval thresholds",
      ],
      linkedEntities: [
        "documents",
        "comments",
        "revision_history",
      ],
      minimumWordCount: 500,
      citationAnchors: [
        "audience",
        "brand-voice",
        "channels",
        "approvals",
      ],
    },
  ],
  apis: [
    {
      id: "google_docs_generate_api",
      sourceSystemId: "google_docs",
      method: "POST",
      path: "/api/google_docs/generate",
      description: "Synchronous endpoint the agent calls to generate in Google Docs after evidence gating.",
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
      id: "brand-voice-checker-baseline-gap",
      description: "Seed a realistic gap where Brand compliance rate sits between 72% and 94%, so the agent can detect, narrate, and recommend remediation.",
      affectedEntities: [
        "documents",
        "comments",
      ],
      discoveryPath: [
        "Inspect Google Docs records for the affected entities",
        "Compare against WordPress historical baseline",
        "Generate a citation-backed recommendation",
      ],
      expectedEvidence: [
        "source-system record",
        "historical baseline metric",
        "generated audit trail",
      ],
      expectedRecommendation: "Explain the gap, cite supporting evidence, and propose the next Brand Manager action.",
    },
  ],
  datastorePackaging: {
    alloydb: {
      database: "brand_voice_checker",
      schemas: [
        "google_docs",
        "wordpress",
        "contentful",
        "hubspot",
      ],
    },
    bigquery: {
      dataset: "marketing_brand_voice_checker",
      tables: [
        "kpi_summary",
        "evidence_index",
      ],
    },
    cloudStorage: {
      bucketSuffix: "brand-voice-checker-evidence",
      prefixes: [
        "documents",
        "audit-trails",
        "exports",
      ],
    },
    apis: {
      serviceName: "brand-voice-checker-source-adapters",
      deploymentTarget: "cloud_run",
    },
  },
  validation: {
    smokePrompt: "Run the Brand Voice Checker workflow and cite source-system evidence for every claim.",
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

export const BrandVoiceChecker = () => (
  <UseCaseSlide
    title="Brand Voice Checker"
    subtitle="A-3007 \u2022 Content & Creative"
    icon={ShieldCheck}
    domainId="domain-30"
    layer="Layer 3: Custom ADK"
    persona="Brand Manager"
    systems={["Google Docs", "WordPress", "Contentful", "HubSpot", "Vertex AI"]}
    kpis={[
      { label: "Brand compliance rate", before: "72%", after: "94%" },
      { label: "Review turnaround", before: "1-2 days", after: "< 5 minutes" },
      { label: "Revision cycles for voice", before: "2-3 rounds", after: "0-1 rounds" },
    ]}
    triggerType="event"
    swimlane={swimlane}
    flow={flow}
    architecture={architecture}
    statusQuo={[
      "Brand voice consistency checked manually by editors with subjective interpretation of guidelines.",
      "Review bottleneck creates 1-2 day delays for content approval with inconsistent feedback.",
      "Tonal mismatches caught only by experienced editors \u2014 junior writers repeat the same mistakes."
    ]}
    agentification={[
      "Gemini assesses whether content sounds like the brand, catching tonal mismatches that go beyond prohibited terms.",
      "Understands the difference between appropriately formal (whitepaper) and inappropriately stiff (blog post) within the same brand voice.",
      "Generates specific rewrite suggestions rather than abstract feedback, reducing revision cycles."
    ]}
  />
);
