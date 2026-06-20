import React from "react";
import { UseCaseSlide } from "../../../agent/UseCaseSlide";
import { FlowStep } from "../../../agent/ProcessFlow";
import { SwimlaneFlow } from "../../../agent/SwimlaneFlow";
import { AgentArchitecture, UseCaseGenerationSpec, AgentBehaviorContract} from "../../../../types/architecture";
import { Heart, Zap, Search, FileText, CheckCircle } from "lucide-react";

const swimlane: SwimlaneFlow = {
  nodes: [
    { id: "s1", label: "UGC Detected", lane: "system", type: "trigger" },
    { id: "a1", label: "Quality Assessment", lane: "agent", type: "action" },
    { id: "a2", label: "Amplification Plan", lane: "agent", type: "action" },
    { id: "a3", label: "Outreach Queued", lane: "agent", type: "output" },
    { id: "h1", label: "Brand Mgr Approves", lane: "human", type: "hitl" },
  ],
  connections: [["s1", "a1"], ["a1", "a2"], ["a2", "a3"], ["a3", "h1"]],
};

const flow: FlowStep[] = [
  { label: "UGC Detection", icon: Zap, description: "Monitor for user-generated content — customer mentions, product posts, testimonials.", trigger: "Event + Monthly", systems: ["Sprout Social", "HubSpot"] },
  { label: "Quality Evaluation", icon: Search, description: "Assess content quality, sentiment, brand alignment, and amplification potential.", systems: ["Vertex AI"] },
  { label: "Outreach Draft", icon: FileText, description: "Draft permission requests and suggest amplification strategies for top UGC.", systems: ["Vertex AI"] },
  { label: "Brand Approval", icon: CheckCircle, description: "Brand Manager approves UGC usage and amplification plan before outreach.", output: "UGC Campaign Plan" },
];

const architecture: AgentArchitecture = {
  connections: [
    { system: "Sprout Social", description: "UGC detection, customer mention monitoring, engagement tracking", direction: "read", protocol: "REST API", category: "analytics" },
    { system: "HubSpot", description: "Customer advocacy program tracking, testimonial pipeline", direction: "bidirectional", protocol: "REST API", category: "erp" },
    { system: "Salesforce CRM", description: "Customer status, account value, success metrics for case studies", direction: "read", protocol: "REST API", category: "erp" },
    { system: "Google Drive", description: "UGC asset library, permission documentation, case study drafts", direction: "write", protocol: "Workspace API", category: "collaboration" },
    { system: "Vertex AI (Gemini)", description: "Content quality evaluation, amplification strategy, outreach drafting", direction: "bidirectional", protocol: "gRPC", category: "ai" },
  ],
  pipeline: [
    { label: "UGC Detection & Curation", description: "Monitor for user-generated content and customer mentions across social platforms via Sprout Social. Track customer advocacy metrics in HubSpot. Pull customer value and success data from Salesforce CRM.", systems: ["Sprout Social", "HubSpot", "Salesforce CRM"], layer: "integration", dataIn: "Social mentions + CRM data", dataOut: "Curated UGC candidates" },
    { label: "Quality & Sentiment Scoring", description: "Sentiment analysis on customer content. Quality scoring based on specificity, authenticity, and reach. Advocate engagement tracking and testimonial pipeline management.", systems: ["BigQuery"], layer: "ml", dataIn: "UGC candidates + customer data", dataOut: "Quality-scored UGC list" },
    { label: "Amplification Strategy", description: "Gemini evaluates whether UGC is usable for marketing — checking quality, relevance, and brand alignment. 'This customer's LinkedIn post mentions $2M saved with specific implementation details — authentic enthusiasm with real results. Request permission and feature in next case study campaign.'", systems: ["Vertex AI (Gemini)"], layer: "llm", dataIn: "Scored UGC + customer context", dataOut: "Amplification plan with outreach drafts" },
    { label: "Outreach & Archival", description: "Draft permission request messages. Store approved UGC assets in Google Drive library. Coordinate with customer success for testimonial development. Route plans to Brand Manager for approval.", systems: ["Google Drive"], layer: "integration", dataIn: "Approved amplification plan", dataOut: "Permission requests + asset library" },
  ],
};


const behaviorContract: AgentBehaviorContract = {
  role: "Brand Manager agent for the UGC & Advocacy Manager workflow",
  primaryObjective: "Gemini evaluates UGC quality beyond sentiment — assessing specificity, authenticity, and brand alignment for marketing usage. Automated monitoring surfaces customer content with real results and authentic enthusiasm. so the Brand Manager can move the UGC captured KPI.",
  inScope: [
    "Gemini evaluates UGC quality beyond sentiment — assessing specificity, authenticity, and brand alignment for marketing usage",
    "Automated monitoring surfaces customer content with real results and authentic enthusiasm",
    "Personalized permission requests drafted with context about how the content will be amplified",
  ],
  outOfScope: [
    "Final approval of paid spend reallocations above the governance threshold",
    "Trademark, legal, or regulated-industry claim approval",
    "Crisis communications without comms-team sign-off",
  ],
  toolIntents: [
    {
      name: "query_sprout_social_social_posts",
      kind: "query",
      sourceSystemId: "sprout_social",
      description: "Retrieve social posts from Sprout Social for the UGC & Advocacy Manager workflow.",
      requiredInputs: [
        "lookup_key",
        "date_range",
      ],
      produces: [
        "social_posts_records",
        "social_posts_summary",
      ],
      evidenceEmitted: [
        "source_system_record",
      ],
    },
    {
      name: "query_hubspot_contacts",
      kind: "query",
      sourceSystemId: "hubspot",
      description: "Retrieve contacts from HubSpot for the UGC & Advocacy Manager workflow.",
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
      name: "query_salesforce_crm_accounts",
      kind: "query",
      sourceSystemId: "salesforce_crm",
      description: "Retrieve accounts from Salesforce CRM for the UGC & Advocacy Manager workflow.",
      requiredInputs: [
        "lookup_key",
        "date_range",
      ],
      produces: [
        "accounts_records",
        "accounts_summary",
      ],
      evidenceEmitted: [
        "source_system_record",
      ],
    },
    {
      name: "query_google_drive_documents",
      kind: "query",
      sourceSystemId: "google_drive",
      description: "Retrieve documents from Google Drive for the UGC & Advocacy Manager workflow.",
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
      name: "lookup_ugc_advocacy_manager_playbook",
      kind: "evidence_lookup",
      sourceSystemId: "google_drive",
      description: "Look up sections of the UGC & Advocacy Manager Playbook to cite in narrative output, escalation rationale, and audit evidence.",
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
      name: "action_sprout_social_draft",
      kind: "action",
      sourceSystemId: "sprout_social",
      description: "Execute the draft step in Sprout Social after the agent has gathered evidence and validated escalation gates.",
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
      claim: "UGC captured moved from 5-10/month manual toward 50+ automated",
      mustCite: [
        "sprout_social.social_posts",
        "hubspot.contacts",
      ],
      sourceSystemIds: [
        "sprout_social",
        "hubspot",
      ],
    },
    {
      claim: "Permission response rate moved from 30% toward 65%",
      mustCite: [
        "sprout_social.social_posts",
        "hubspot.contacts",
      ],
      sourceSystemIds: [
        "sprout_social",
        "hubspot",
      ],
    },
  ],
  escalationRules: [
    {
      trigger: "UGC captured regresses past the 5-10/month manual baseline by more than 20%",
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
      trigger: "Proposed draft action lacks supporting evidence from at least two systems",
      action: "refuse",
      rationale: "Single-system evidence is insufficient to authorize external state changes without manual review.",
    },
  ],
  refusalRules: [
    "Never fabricate metric values; only publish numbers derived from Sprout Social (and other named systems) entities.",
    "Never bypass Brand Manager approval on escalation triggers, even when confidence is high.",
    "Never expose individual personal data (PII) in summaries; aggregate or pseudonymise before output.",
    "Never act on data older than the staleness threshold defined in the runbook without a fresh re-query.",
  ],
  goldenEvals: [
    {
      id: "ugc-advocacy-manager-end-to-end",
      prompt: "Run the UGC & Advocacy Manager workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.",
      expectedToolCalls: [
        "query_sprout_social_social_posts",
        "query_hubspot_contacts",
        "query_salesforce_crm_accounts",
        "query_google_drive_documents",
        "lookup_ugc_advocacy_manager_playbook",
        "action_sprout_social_draft",
      ],
      mustReferenceEntities: [
        "social_posts",
        "contacts",
        "accounts",
        "documents",
      ],
      mustCiteDocuments: [
        "ugc-advocacy-manager-playbook",
      ],
      expectedActionOutcome: "Action draft executed against Sprout Social, with audit-trail entry and Brand Manager notified of outcomes.",
      forbiddenBehaviors: [
        "do not invent KPI numbers",
        "do not skip the evidence_lookup step before any recommendation",
        "do not execute draft without two-system evidence",
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
    rationale: "Row counts sized for UGC & Advocacy Manager so the agent can demonstrate the workflow against realistic transactional volume without simulating a production warehouse.",
  },
  sourceSystems: [
    {
      id: "sprout_social",
      name: "Sprout Social",
      owns: [
        "social_posts",
        "engagement_metrics",
        "publishing_queue",
      ],
      protocol: "REST API",
      localBacking: [
        "alloydb",
      ],
      toolNames: [
        "query_sprout_social_social_posts",
        "query_sprout_social_engagement_metrics",
        "query_sprout_social_publishing_queue",
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
      id: "salesforce_crm",
      name: "Salesforce CRM",
      owns: [
        "accounts",
        "opportunities",
        "campaign_influence",
      ],
      protocol: "REST API",
      localBacking: [
        "alloydb",
      ],
      toolNames: [
        "query_salesforce_crm_accounts",
        "query_salesforce_crm_opportunities",
        "query_salesforce_crm_campaign_influence",
      ],
      evidence: [
        "source_system_record",
        "generated_audit_trail",
      ],
    },
    {
      id: "google_drive",
      name: "Google Drive",
      owns: [
        "documents",
        "folder_permissions",
        "share_events",
      ],
      protocol: "Workspace API",
      localBacking: [
        "cloud-storage",
      ],
      toolNames: [
        "query_google_drive_documents",
        "query_google_drive_folder_permissions",
        "query_google_drive_share_events",
      ],
      evidence: [
        "source_system_record",
        "generated_audit_trail",
      ],
    },
  ],
  entities: [
    {
      name: "social_posts",
      sourceSystemId: "sprout_social",
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
      name: "engagement_metrics",
      sourceSystemId: "sprout_social",
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
      name: "publishing_queue",
      sourceSystemId: "sprout_social",
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
      name: "accounts",
      sourceSystemId: "salesforce_crm",
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
      name: "opportunities",
      sourceSystemId: "salesforce_crm",
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
      name: "campaign_influence",
      sourceSystemId: "salesforce_crm",
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
          name: "channel",
          type: "enum",
          values: [
            "email",
            "social",
            "search",
            "display",
            "content",
            "events",
          ],
          required: true,
        },
        {
          name: "segment",
          type: "enum",
          values: [
            "enterprise",
            "mid_market",
            "smb",
          ],
          required: true,
        },
        {
          name: "impressions",
          type: "number",
          min: 1000,
          max: 500000,
          required: true,
        },
        {
          name: "conversions",
          type: "number",
          min: 0,
          max: 5000,
          required: true,
        },
        {
          name: "spend",
          type: "number",
          min: 1000,
          max: 200000,
          required: true,
        },
        {
          name: "ctr",
          type: "float",
          min: 0.1,
          max: 9.5,
          decimals: 2,
          required: true,
        },
        {
          name: "launched_on",
          type: "date",
          required: true,
        },
      ],
    },
    {
      name: "documents",
      sourceSystemId: "google_drive",
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
      name: "folder_permissions",
      sourceSystemId: "google_drive",
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
      name: "share_events",
      sourceSystemId: "google_drive",
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
  ],
  relationships: [
    {
      from: "engagement_events.contact_id",
      to: "contacts.id",
      cardinality: "many-to-one",
      orphanPolicy: "none",
    },
    {
      from: "share_events.document_id",
      to: "documents.id",
      cardinality: "many-to-one",
      orphanPolicy: "none",
    },
  ],
  documents: [
    {
      id: "ugc-advocacy-manager-playbook",
      sourceSystemId: "sprout_social",
      type: "playbook",
      title: "UGC & Advocacy Manager Playbook",
      requiredSections: [
        "Audience guidelines",
        "Brand voice rules",
        "Channel-specific guardrails",
        "Measurement framework",
        "Approval thresholds",
      ],
      linkedEntities: [
        "social_posts",
        "engagement_metrics",
        "publishing_queue",
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
      id: "sprout_social_draft_api",
      sourceSystemId: "sprout_social",
      method: "POST",
      path: "/api/sprout_social/draft",
      description: "Synchronous endpoint the agent calls to draft in Sprout Social after evidence gating.",
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
      id: "ugc-advocacy-manager-baseline-gap",
      description: "Seed a realistic gap where UGC captured sits between 5-10/month manual and 50+ automated, so the agent can detect, narrate, and recommend remediation.",
      affectedEntities: [
        "social_posts",
        "engagement_metrics",
      ],
      discoveryPath: [
        "Inspect Sprout Social records for the affected entities",
        "Compare against HubSpot historical baseline",
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
      database: "ugc_advocacy_manager",
      schemas: [
        "sprout_social",
        "hubspot",
        "salesforce_crm",
        "google_drive",
      ],
    },
    bigquery: {
      dataset: "marketing_ugc_advocacy_manager",
      tables: [
        "kpi_summary",
        "evidence_index",
      ],
    },
    cloudStorage: {
      bucketSuffix: "ugc-advocacy-manager-evidence",
      prefixes: [
        "documents",
        "audit-trails",
        "exports",
      ],
    },
    apis: {
      serviceName: "ugc-advocacy-manager-source-adapters",
      deploymentTarget: "cloud_run",
    },
  },
  validation: {
    smokePrompt: "Run the UGC & Advocacy Manager workflow and cite source-system evidence for every claim.",
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

export const UGCAdvocacyManager = () => (
  <UseCaseSlide
    title="UGC & Advocacy Manager"
    subtitle="A-3306 • Social Media & Community"
    icon={Heart}
    domainId="domain-33"
    layer="Layer 2: Agent Designer"
    persona="Brand Manager"
    systems={["Sprout Social", "HubSpot", "Salesforce CRM", "Google Drive", "Vertex AI"]}
    kpis={[
      { label: "UGC captured", before: "5-10/month manual", after: "50+ automated" },
      { label: "Permission response rate", before: "30%", after: "65%" },
      { label: "Case study pipeline", before: "2/quarter", after: "8/quarter" },
    ]}
    triggerType="event"
    swimlane={swimlane}
    flow={flow}
    architecture={architecture}
    hitl={{ actor: "Brand Manager", action: "Approve UGC usage", description: "Brand Manager reviews UGC quality and brand alignment, approves amplification plans and permission outreach before engagement." }}
    statusQuo={[
      "User-generated content discovered sporadically — no systematic monitoring in place.",
      "Permission requests sent ad-hoc with generic templates that get low response rates.",
      "Customer advocacy program lacks structure — testimonials gathered reactively."
    ]}
    agentification={[
      "Gemini evaluates UGC quality beyond sentiment — assessing specificity, authenticity, and brand alignment for marketing usage.",
      "Automated monitoring surfaces customer content with real results and authentic enthusiasm.",
      "Personalized permission requests drafted with context about how the content will be amplified."
    ]}
  />
);
