import React from "react";
import { UseCaseSlide } from "../../../agent/UseCaseSlide";
import { FlowStep } from "../../../agent/ProcessFlow";
import { SwimlaneFlow } from "../../../agent/SwimlaneFlow";
import { AgentArchitecture, UseCaseGenerationSpec, AgentBehaviorContract} from "../../../../types/architecture";
import { Repeat, FileText, Layers, Share2, CheckCircle } from "lucide-react";

const swimlane: SwimlaneFlow = {
  nodes: [
    { id: "s1", label: "Content Published", lane: "system", type: "trigger" },
    { id: "a1", label: "Content Analysis", lane: "agent", type: "action" },
    { id: "a2", label: "Derivative Generation", lane: "agent", type: "action" },
    { id: "a3", label: "Derivatives Queued", lane: "agent", type: "output" },
    { id: "h1", label: "Strategist Approval", lane: "human", type: "hitl" },
  ],
  connections: [["s1", "a1"], ["a1", "a2"], ["a2", "a3"], ["a3", "h1"]],
};

const flow: FlowStep[] = [
  { label: "Publication Detection", icon: FileText, description: "New long-form content publication detected in WordPress or CMS.", trigger: "Content published", systems: ["WordPress", "Google Docs"] },
  { label: "Platform Adaptation", icon: Layers, description: "Content intelligently repurposed into LinkedIn posts, tweet threads, email snippets, infographic outlines, and video scripts.", systems: ["Vertex AI"], integration: "OOTB" },
  { label: "Channel Distribution", icon: Share2, description: "Derivative assets queued for respective channels with platform-specific formatting.", systems: ["HubSpot", "LinkedIn", "Canva"] },
  { label: "Strategist Approval", icon: CheckCircle, description: "Content Strategist reviews repurposed content for quality and brand alignment before publishing.", output: "Derivative Assets" },
];

const architecture: AgentArchitecture = {
  connections: [
    { system: "WordPress", description: "Long-form content source, publication detection webhooks", direction: "read", protocol: "REST API", category: "collaboration" },
    { system: "Google Docs", description: "Source content documents, derivative draft output", direction: "bidirectional", protocol: "Workspace API", category: "collaboration" },
    { system: "Canva", description: "Infographic and visual derivative generation", direction: "write", protocol: "REST API", category: "collaboration" },
    { system: "HubSpot", description: "Email newsletter content, marketing automation integration", direction: "write", protocol: "REST API", category: "erp" },
    { system: "LinkedIn", description: "Professional social content publishing", direction: "write", protocol: "REST API", category: "collaboration" },
    { system: "Vertex AI (Gemini)", description: "Content repurposing, platform adaptation, creative reframing", direction: "bidirectional", protocol: "gRPC", category: "ai" },
  ],
  pipeline: [
    { label: "Content Detection", description: "Detect new long-form content publication via WordPress webhooks. Retrieve full content with metadata and campaign context.", systems: ["WordPress", "Google Docs"], layer: "integration", dataIn: "Published blog post / whitepaper / guide", dataOut: "Full content body with metadata" },
    { label: "Channel Performance Analysis", description: "Channel-specific format performance analysis. Optimal content length by platform. Engagement prediction for derivative types.", systems: ["BigQuery"], layer: "ml", dataIn: "Historical derivative performance by platform", dataOut: "Format recommendations and engagement predictions" },
    { label: "Intelligent Repurposing", description: "Take long-form content and intelligently repurpose into LinkedIn posts, tweet threads, email newsletter sections, infographic outlines, and video scripts \u2014 each adapted for the platform\u2019s style. Creative reframing, not mechanical extraction.", systems: ["Vertex AI (Gemini)"], layer: "llm", dataIn: "Source content + platform guidelines + performance data", dataOut: "5-8 platform-adapted derivative assets" },
    { label: "Queue & Distribution", description: "Derivative assets queued for approval with platform-specific formatting. Approved assets published to respective channels.", systems: ["HubSpot", "LinkedIn", "Canva"], layer: "integration", dataIn: "Approved derivatives", dataOut: "Published content across channels" },
  ],
};


const behaviorContract: AgentBehaviorContract = {
  role: "Content Strategist agent for the Content Repurposing Agent workflow",
  primaryObjective: "Gemini intelligently repurposes content into 5-8 platform-adapted assets \\u2014 not mechanical extraction but creative reframing. Each derivative adapted for the platform\\u2019s style: LinkedIn thought leadership, Twitter concise hooks, email storytelling. so the Content Strategist can move the Derivatives per long-form piece KPI.",
  inScope: [
    "Gemini intelligently repurposes content into 5-8 platform-adapted assets \\u2014 not mechanical extraction but creative reframing",
    "Each derivative adapted for the platform\\u2019s style: LinkedIn thought leadership, Twitter concise hooks, email storytelling",
    "Preserves core insights while fitting the medium, enabling same-day cross-channel amplification",
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
      description: "Retrieve documents from Google Docs for the Content Repurposing Agent workflow.",
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
      description: "Retrieve content entries from WordPress for the Content Repurposing Agent workflow.",
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
      name: "query_canva_assets",
      kind: "query",
      sourceSystemId: "canva",
      description: "Retrieve assets from Canva for the Content Repurposing Agent workflow.",
      requiredInputs: [
        "lookup_key",
        "date_range",
      ],
      produces: [
        "assets_records",
        "assets_summary",
      ],
      evidenceEmitted: [
        "source_system_record",
      ],
    },
    {
      name: "query_hubspot_contacts",
      kind: "query",
      sourceSystemId: "hubspot",
      description: "Retrieve contacts from HubSpot for the Content Repurposing Agent workflow.",
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
      name: "lookup_content_repurposing_agent_playbook",
      kind: "evidence_lookup",
      sourceSystemId: "google_docs",
      description: "Look up sections of the Content Repurposing Agent Playbook to cite in narrative output, escalation rationale, and audit evidence.",
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
      claim: "Derivatives per long-form piece moved from 1-2 manual toward 5-8 automated",
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
      claim: "Repurposing turnaround moved from 1-2 weeks toward Same day",
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
      trigger: "Derivatives per long-form piece regresses past the 1-2 manual baseline by more than 20%",
      action: "escalate_to_human",
      handoffTarget: "Content Strategist",
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
    "Never bypass Content Strategist approval on escalation triggers, even when confidence is high.",
    "Never expose individual personal data (PII) in summaries; aggregate or pseudonymise before output.",
    "Never act on data older than the staleness threshold defined in the runbook without a fresh re-query.",
  ],
  goldenEvals: [
    {
      id: "content-repurposing-agent-end-to-end",
      prompt: "Run the Content Repurposing Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.",
      expectedToolCalls: [
        "query_google_docs_documents",
        "query_wordpress_content_entries",
        "query_canva_assets",
        "query_hubspot_contacts",
        "lookup_content_repurposing_agent_playbook",
      ],
      mustReferenceEntities: [
        "documents",
        "content_entries",
        "assets",
        "contacts",
        "linkedin_records",
      ],
      mustCiteDocuments: [
        "content-repurposing-agent-playbook",
      ],
      expectedActionOutcome: "Content Strategist receives a fully-cited recommendation; no external state change without explicit approval.",
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
    rationale: "Row counts sized for Content Repurposing Agent so the agent can demonstrate the workflow against realistic transactional volume without simulating a production warehouse.",
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
      id: "canva",
      name: "Canva",
      owns: [
        "assets",
        "asset_versions",
        "approval_queues",
      ],
      protocol: "REST API",
      localBacking: [
        "cloud-storage",
      ],
      toolNames: [
        "query_canva_assets",
        "query_canva_asset_versions",
        "query_canva_approval_queues",
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
    {
      id: "linkedin",
      name: "LinkedIn",
      owns: [
        "linkedin_records",
        "linkedin_events",
        "linkedin_audit_trail",
      ],
      protocol: "REST API",
      localBacking: [
        "alloydb",
      ],
      toolNames: [
        "query_linkedin_linkedin_records",
        "query_linkedin_linkedin_events",
        "query_linkedin_linkedin_audit_trail",
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
      name: "assets",
      sourceSystemId: "canva",
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
      name: "asset_versions",
      sourceSystemId: "canva",
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
      name: "approval_queues",
      sourceSystemId: "canva",
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
    {
      name: "linkedin_records",
      sourceSystemId: "linkedin",
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
      name: "linkedin_events",
      sourceSystemId: "linkedin",
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
          name: "linkedin_record_id",
          type: "ref",
          ref: "linkedin_records.id",
          required: true,
        },
      ],
    },
    {
      name: "linkedin_audit_trail",
      sourceSystemId: "linkedin",
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
      from: "engagement_events.contact_id",
      to: "contacts.id",
      cardinality: "many-to-one",
      orphanPolicy: "none",
    },
    {
      from: "linkedin_events.linkedin_record_id",
      to: "linkedin_records.id",
      cardinality: "many-to-one",
      orphanPolicy: "none",
    },
  ],
  documents: [
    {
      id: "content-repurposing-agent-playbook",
      sourceSystemId: "google_docs",
      type: "playbook",
      title: "Content Repurposing Agent Playbook",
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
  apis: [],
  anomalies: [
    {
      id: "content-repurposing-agent-baseline-gap",
      description: "Seed a realistic gap where Derivatives per long-form piece sits between 1-2 manual and 5-8 automated, so the agent can detect, narrate, and recommend remediation.",
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
      expectedRecommendation: "Explain the gap, cite supporting evidence, and propose the next Content Strategist action.",
    },
  ],
  datastorePackaging: {
    alloydb: {
      database: "content_repurposing_agent",
      schemas: [
        "google_docs",
        "wordpress",
        "canva",
        "hubspot",
        "linkedin",
      ],
    },
    bigquery: {
      dataset: "marketing_content_repurposing_agent",
      tables: [
        "kpi_summary",
        "evidence_index",
      ],
    },
    cloudStorage: {
      bucketSuffix: "content-repurposing-agent-evidence",
      prefixes: [
        "documents",
        "audit-trails",
        "exports",
      ],
    },
    apis: {
      serviceName: "content-repurposing-agent-source-adapters",
      deploymentTarget: "cloud_run",
    },
  },
  validation: {
    smokePrompt: "Run the Content Repurposing Agent workflow and cite source-system evidence for every claim.",
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

export const ContentRepurposingAgent = () => (
  <UseCaseSlide
    title="Content Repurposing Agent"
    subtitle="A-3006 \u2022 Content & Creative"
    icon={Repeat}
    domainId="domain-30"
    layer="Layer 1: OOTB"
    persona="Content Strategist"
    systems={["Google Docs", "WordPress", "Canva", "HubSpot", "LinkedIn", "Vertex AI"]}
    kpis={[
      { label: "Derivatives per long-form piece", before: "1-2 manual", after: "5-8 automated" },
      { label: "Repurposing turnaround", before: "1-2 weeks", after: "Same day" },
      { label: "Content amplification reach", before: "1 channel", after: "5+ channels" },
    ]}
    triggerType="event"
    swimlane={swimlane}
    flow={flow}
    architecture={architecture}
    hitl={{ actor: "Content Strategist", action: "Approve repurposed content", description: "Content Strategist reviews derivative assets for quality, brand alignment, and platform appropriateness before cross-channel publishing." }}
    statusQuo={[
      "Long-form content published on blog with minimal repurposing \u2014 maybe 1 LinkedIn post manually extracted.",
      "Repurposing done weeks after publication when content is no longer timely.",
      "Platform-specific adaptation requires separate effort for each channel with no systematic approach."
    ]}
    agentification={[
      "Gemini intelligently repurposes content into 5-8 platform-adapted assets \u2014 not mechanical extraction but creative reframing.",
      "Each derivative adapted for the platform\u2019s style: LinkedIn thought leadership, Twitter concise hooks, email storytelling.",
      "Preserves core insights while fitting the medium, enabling same-day cross-channel amplification."
    ]}
  />
);
