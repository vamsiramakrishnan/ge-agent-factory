import React from "react";
import { UseCaseSlide } from "../../../agent/UseCaseSlide";
import { FlowStep } from "../../../agent/ProcessFlow";
import { SwimlaneFlow } from "../../../agent/SwimlaneFlow";
import { AgentArchitecture, UseCaseGenerationSpec, AgentBehaviorContract} from "../../../../types/architecture";
import { Calendar, Database, PenTool, Clock, CheckCircle } from "lucide-react";

const swimlane: SwimlaneFlow = {
  nodes: [
    { id: "s1", label: "Weekly Schedule", lane: "system", type: "trigger" },
    { id: "a1", label: "Calendar Sync", lane: "agent", type: "action" },
    { id: "a2", label: "Content Draft", lane: "agent", type: "action" },
    { id: "a3", label: "Calendar Published", lane: "agent", type: "output" },
    { id: "h1", label: "Social Mgr Approves", lane: "human", type: "hitl" },
  ],
  connections: [["s1", "a1"], ["a1", "a2"], ["a2", "a3"], ["a3", "h1"]],
};

const flow: FlowStep[] = [
  { label: "Calendar Sync", icon: Calendar, description: "Sync marketing calendar, industry events, and trending topics for the coming week.", trigger: "Weekly", systems: ["Sprout Social", "HubSpot"] },
  { label: "Content Generation", icon: PenTool, description: "Generate platform-adapted social content — LinkedIn thought leadership, Twitter concise, Instagram visual-first.", systems: ["Vertex AI"] },
  { label: "Scheduling", icon: Clock, description: "Optimal posting time analysis and content queued for publishing across platforms.", systems: ["Sprout Social", "Hootsuite"] },
  { label: "Manager Approval", icon: CheckCircle, description: "Social Media Manager reviews and approves weekly content calendar.", output: "Weekly Calendar" },
];

const architecture: AgentArchitecture = {
  connections: [
    { system: "Sprout Social", description: "Publishing calendar, scheduling, approval workflows, analytics", direction: "bidirectional", protocol: "REST API", category: "collaboration" },
    { system: "Hootsuite", description: "Cross-platform scheduling, bulk publishing, team collaboration", direction: "bidirectional", protocol: "REST API", category: "collaboration" },
    { system: "HubSpot", description: "Campaign calendar sync, content assets, marketing calendar", direction: "read", protocol: "REST API", category: "erp" },
    { system: "Canva", description: "Visual asset generation for social posts", direction: "read", protocol: "REST API", category: "collaboration" },
    { system: "Vertex AI (Gemini)", description: "Platform-adapted content generation, tone and format adaptation", direction: "bidirectional", protocol: "gRPC", category: "ai" },
    { system: "BigQuery", description: "Optimal posting time analysis, engagement history", direction: "read", protocol: "BigQuery SQL", category: "analytics" },
  ],
  pipeline: [
    { label: "Calendar & Trend Intake", description: "Sync marketing campaign calendar from HubSpot, pull industry events, monitor trending topics. Assemble content themes for the week.", systems: ["HubSpot", "Sprout Social"], layer: "integration", dataIn: "Campaign calendar + industry trends", dataOut: "Weekly content themes" },
    { label: "Posting Optimization", description: "Analyze optimal posting times by platform and audience segment. Content type performance ranking and posting frequency optimization from historical data.", systems: ["BigQuery"], layer: "ml", dataIn: "Historical engagement data", dataOut: "Optimal posting schedule" },
    { label: "Platform-Adapted Content", description: "Gemini generates a full week of social content — each post adapted for the platform: LinkedIn professional thought leadership, Twitter/X concise and provocative, Instagram visual-first with storytelling captions. Balance promotional, educational, and engagement content.", systems: ["Vertex AI (Gemini)"], layer: "llm", dataIn: "Content themes + platform requirements", dataOut: "Platform-specific post drafts" },
    { label: "Schedule & Approval", description: "Queue posts in Sprout Social/Hootsuite at optimal times. Route weekly calendar to Social Media Manager for review and approval before publishing.", systems: ["Sprout Social", "Hootsuite"], layer: "integration", dataIn: "Approved posts + schedule", dataOut: "Scheduled social calendar" },
  ],
};


const behaviorContract: AgentBehaviorContract = {
  role: "Social Media Mgr agent for the Social Content Calendar Manager workflow",
  primaryObjective: "Gemini generates platform-adapted content — LinkedIn thought leadership, Twitter concise, Instagram visual-first storytelling. Optimal posting times calculated per platform and audience segment from historical engagement. so the Social Media Mgr can move the Calendar creation time KPI.",
  inScope: [
    "Gemini generates platform-adapted content — LinkedIn thought leadership, Twitter concise, Instagram visual-first storytelling",
    "Optimal posting times calculated per platform and audience segment from historical engagement",
    "Balanced mix of promotional, educational, and engagement content generated automatically",
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
      description: "Retrieve social posts from Sprout Social for the Social Content Calendar Manager workflow.",
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
      name: "query_hootsuite_social_posts",
      kind: "query",
      sourceSystemId: "hootsuite",
      description: "Retrieve social posts from Hootsuite for the Social Content Calendar Manager workflow.",
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
      description: "Retrieve contacts from HubSpot for the Social Content Calendar Manager workflow.",
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
      name: "query_canva_assets",
      kind: "query",
      sourceSystemId: "canva",
      description: "Retrieve assets from Canva for the Social Content Calendar Manager workflow.",
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
      name: "lookup_social_content_calendar_manager_playbook",
      kind: "evidence_lookup",
      sourceSystemId: "canva",
      description: "Look up sections of the Social Content Calendar Manager Playbook to cite in narrative output, escalation rationale, and audit evidence.",
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
      name: "action_sprout_social_generate",
      kind: "action",
      sourceSystemId: "sprout_social",
      description: "Execute the generate step in Sprout Social after the agent has gathered evidence and validated escalation gates.",
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
      claim: "Calendar creation time moved from 6-8 hours/week toward 45 minutes",
      mustCite: [
        "sprout_social.social_posts",
        "hootsuite.social_posts",
      ],
      sourceSystemIds: [
        "sprout_social",
        "hootsuite",
      ],
    },
    {
      claim: "Posts per week moved from 8-10 manual toward 25+ automated",
      mustCite: [
        "sprout_social.social_posts",
        "hootsuite.social_posts",
      ],
      sourceSystemIds: [
        "sprout_social",
        "hootsuite",
      ],
    },
  ],
  escalationRules: [
    {
      trigger: "Calendar creation time regresses past the 6-8 hours/week baseline by more than 20%",
      action: "escalate_to_human",
      handoffTarget: "Social Media Mgr",
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
    "Never fabricate metric values; only publish numbers derived from Sprout Social (and other named systems) entities.",
    "Never bypass Social Media Mgr approval on escalation triggers, even when confidence is high.",
    "Never expose individual personal data (PII) in summaries; aggregate or pseudonymise before output.",
    "Never act on data older than the staleness threshold defined in the runbook without a fresh re-query.",
  ],
  goldenEvals: [
    {
      id: "social-content-calendar-manager-end-to-end",
      prompt: "Run the Social Content Calendar Manager workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.",
      expectedToolCalls: [
        "query_sprout_social_social_posts",
        "query_hootsuite_social_posts",
        "query_hubspot_contacts",
        "query_canva_assets",
        "lookup_social_content_calendar_manager_playbook",
        "action_sprout_social_generate",
      ],
      mustReferenceEntities: [
        "social_posts",
        "social_posts",
        "contacts",
        "assets",
      ],
      mustCiteDocuments: [
        "social-content-calendar-manager-playbook",
      ],
      expectedActionOutcome: "Action generate executed against Sprout Social, with audit-trail entry and Social Media Mgr notified of outcomes.",
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
    rationale: "Row counts sized for Social Content Calendar Manager so the agent can demonstrate the workflow against realistic transactional volume without simulating a production warehouse.",
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
      id: "hootsuite",
      name: "Hootsuite",
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
        "query_hootsuite_social_posts",
        "query_hootsuite_engagement_metrics",
        "query_hootsuite_publishing_queue",
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
  ],
  relationships: [
    {
      from: "engagement_events.contact_id",
      to: "contacts.id",
      cardinality: "many-to-one",
      orphanPolicy: "none",
    },
  ],
  documents: [
    {
      id: "social-content-calendar-manager-playbook",
      sourceSystemId: "sprout_social",
      type: "playbook",
      title: "Social Content Calendar Manager Playbook",
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
      id: "sprout_social_generate_api",
      sourceSystemId: "sprout_social",
      method: "POST",
      path: "/api/sprout_social/generate",
      description: "Synchronous endpoint the agent calls to generate in Sprout Social after evidence gating.",
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
      id: "social-content-calendar-manager-baseline-gap",
      description: "Seed a realistic gap where Calendar creation time sits between 6-8 hours/week and 45 minutes, so the agent can detect, narrate, and recommend remediation.",
      affectedEntities: [
        "social_posts",
        "engagement_metrics",
      ],
      discoveryPath: [
        "Inspect Sprout Social records for the affected entities",
        "Compare against Hootsuite historical baseline",
        "Generate a citation-backed recommendation",
      ],
      expectedEvidence: [
        "source-system record",
        "historical baseline metric",
        "generated audit trail",
      ],
      expectedRecommendation: "Explain the gap, cite supporting evidence, and propose the next Social Media Mgr action.",
    },
  ],
  datastorePackaging: {
    alloydb: {
      database: "social_content_calendar_manager",
      schemas: [
        "sprout_social",
        "hootsuite",
        "hubspot",
        "canva",
      ],
    },
    bigquery: {
      dataset: "marketing_social_content_calendar_manager",
      tables: [
        "kpi_summary",
        "evidence_index",
      ],
    },
    cloudStorage: {
      bucketSuffix: "social-content-calendar-manager-evidence",
      prefixes: [
        "documents",
        "audit-trails",
        "exports",
      ],
    },
    apis: {
      serviceName: "social-content-calendar-manager-source-adapters",
      deploymentTarget: "cloud_run",
    },
  },
  validation: {
    smokePrompt: "Run the Social Content Calendar Manager workflow and cite source-system evidence for every claim.",
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

export const SocialContentCalendarManager = () => (
  <UseCaseSlide
    title="Social Content Calendar Manager"
    subtitle="A-3301 • Social Media & Community"
    icon={Calendar}
    domainId="domain-33"
    layer="Layer 2: Agent Designer"
    persona="Social Media Mgr"
    systems={["Sprout Social", "Hootsuite", "HubSpot", "Canva", "Vertex AI"]}
    kpis={[
      { label: "Calendar creation time", before: "6-8 hours/week", after: "45 minutes" },
      { label: "Posts per week", before: "8-10 manual", after: "25+ automated" },
      { label: "Engagement rate", before: "2.1%", after: "3.8%" },
    ]}
    triggerType="scheduled"
    swimlane={swimlane}
    flow={flow}
    architecture={architecture}
    hitl={{ actor: "Social Media Mgr", action: "Approve weekly content", description: "Social Media Manager reviews generated content calendar, adjusts tone and timing, and approves posts before scheduling." }}
    statusQuo={[
      "Social content calendar built manually in spreadsheets with copy-paste across platforms.",
      "Same messaging used across LinkedIn, Twitter, and Instagram without platform adaptation.",
      "Posting times based on general best practices rather than audience-specific data."
    ]}
    agentification={[
      "Gemini generates platform-adapted content — LinkedIn thought leadership, Twitter concise, Instagram visual-first storytelling.",
      "Optimal posting times calculated per platform and audience segment from historical engagement.",
      "Balanced mix of promotional, educational, and engagement content generated automatically."
    ]}
  />
);
