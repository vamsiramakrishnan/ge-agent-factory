import React from "react";
import { UseCaseSlide } from "../../../agent/UseCaseSlide";
import { FlowStep } from "../../../agent/ProcessFlow";
import { SwimlaneFlow } from "../../../agent/SwimlaneFlow";
import { AgentArchitecture, UseCaseGenerationSpec, AgentBehaviorContract} from "../../../../types/architecture";
import { Palette, FileText, Image, Layers, CheckCircle } from "lucide-react";

const swimlane: SwimlaneFlow = {
  nodes: [
    { id: "s1", label: "Asset Request", lane: "system", type: "trigger" },
    { id: "a1", label: "Brief Interpretation", lane: "agent", type: "action" },
    { id: "a2", label: "Asset Generation", lane: "agent", type: "action" },
    { id: "a3", label: "Variations Created", lane: "agent", type: "output" },
    { id: "h1", label: "Brand Manager Review", lane: "human", type: "hitl" },
  ],
  connections: [["s1", "a1"], ["a1", "a2"], ["a2", "a3"], ["a3", "h1"]],
};

const flow: FlowStep[] = [
  { label: "Request Ingest", icon: FileText, description: "Campaign asset request with specifications and target audience received.", trigger: "Asset request", systems: ["Figma", "DAM"] },
  { label: "Template & Brand Pull", icon: Image, description: "Brand templates retrieved from DAM and style guidelines applied to asset generation.", systems: ["Bynder", "Google Drive"], integration: "ADK" },
  { label: "Copy & Variation Gen", icon: Layers, description: "Ad copy, social graphics text, and display ad variations generated with brand compliance.", systems: ["Vertex AI"] },
  { label: "Brand Review", icon: CheckCircle, description: "Brand Manager reviews generated assets for guideline compliance and messaging alignment.", output: "Creative Assets" },
];

const architecture: AgentArchitecture = {
  connections: [
    { system: "Figma", description: "Design templates, layout specifications, visual assets", direction: "read", protocol: "REST API", category: "collaboration" },
    { system: "Canva", description: "Template-based asset generation, design variations", direction: "bidirectional", protocol: "REST API", category: "collaboration" },
    { system: "Bynder", description: "Brand templates, approved assets, DAM storage", direction: "bidirectional", protocol: "REST API", category: "collaboration" },
    { system: "Google Drive", description: "Asset file storage, campaign brief documents", direction: "bidirectional", protocol: "Workspace API", category: "collaboration" },
    { system: "Vertex AI (Gemini)", description: "Ad copy generation, messaging reasoning, accessibility descriptions", direction: "bidirectional", protocol: "gRPC", category: "ai" },
  ],
  pipeline: [
    { label: "Request Processing", description: "Receive asset request with specifications (dimensions, platform, audience). Pull brand templates from DAM. Load campaign brief context.", systems: ["Figma", "Bynder", "Google Drive"], layer: "integration", dataIn: "Asset request + specifications + campaign brief", dataOut: "Structured generation parameters with brand assets" },
    { label: "Performance Analysis", description: "Historical performance scoring of visual elements (colors, layouts, CTAs). A/B test result aggregation across creative variants to inform generation.", systems: ["BigQuery"], layer: "ml", dataIn: "Historical creative performance data", dataOut: "Element performance scores and winning patterns" },
    { label: "Copy & Variation Generation", description: "Interpret campaign brief to generate ad copy, social graphics text, email headers, and display ad variations. Reason about messaging angles for target audience and funnel stage. Generate alt-text and accessibility descriptions.", systems: ["Vertex AI (Gemini)"], layer: "llm", dataIn: "Brief + brand guidelines + performance patterns", dataOut: "Creative copy variations with accessibility text" },
    { label: "Approval & Publishing", description: "Generated assets routed for Brand Manager approval. Approved assets published to DAM with proper tagging and metadata.", systems: ["Bynder", "Google Drive"], layer: "integration", dataIn: "Generated assets", dataOut: "Approved assets in DAM" },
  ],
};


const behaviorContract: AgentBehaviorContract = {
  role: "Brand Manager agent for the Creative Asset Generator workflow",
  primaryObjective: "Gemini interprets campaign briefs to generate contextually appropriate ad copy and messaging variations aligned with brand guidelines. Reasons about which messaging angle will resonate based on target audience segment and funnel stage. so the Brand Manager can move the Asset creation time KPI.",
  inScope: [
    "Gemini interprets campaign briefs to generate contextually appropriate ad copy and messaging variations aligned with brand guidelines",
    "Reasons about which messaging angle will resonate based on target audience segment and funnel stage",
    "Generates alt-text and accessibility descriptions for all visual assets automatically",
  ],
  outOfScope: [
    "Final approval of paid spend reallocations above the governance threshold",
    "Trademark, legal, or regulated-industry claim approval",
    "Crisis communications without comms-team sign-off",
  ],
  toolIntents: [
    {
      name: "query_figma_assets",
      kind: "query",
      sourceSystemId: "figma",
      description: "Retrieve assets from Figma for the Creative Asset Generator workflow.",
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
      name: "query_canva_assets",
      kind: "query",
      sourceSystemId: "canva",
      description: "Retrieve assets from Canva for the Creative Asset Generator workflow.",
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
      name: "query_bynder_assets",
      kind: "query",
      sourceSystemId: "bynder",
      description: "Retrieve assets from Bynder for the Creative Asset Generator workflow.",
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
      name: "query_google_drive_documents",
      kind: "query",
      sourceSystemId: "google_drive",
      description: "Retrieve documents from Google Drive for the Creative Asset Generator workflow.",
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
      name: "lookup_creative_asset_generator_playbook",
      kind: "evidence_lookup",
      sourceSystemId: "figma",
      description: "Look up sections of the Creative Asset Generator Playbook to cite in narrative output, escalation rationale, and audit evidence.",
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
      name: "action_figma_generate",
      kind: "action",
      sourceSystemId: "figma",
      description: "Execute the generate step in Figma after the agent has gathered evidence and validated escalation gates.",
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
      claim: "Asset creation time moved from 2-3 days toward 2 hours",
      mustCite: [
        "figma.assets",
        "canva.assets",
      ],
      sourceSystemIds: [
        "figma",
        "canva",
      ],
    },
    {
      claim: "Variations per campaign moved from 3-4 toward 10-15",
      mustCite: [
        "figma.assets",
        "canva.assets",
      ],
      sourceSystemIds: [
        "figma",
        "canva",
      ],
    },
  ],
  escalationRules: [
    {
      trigger: "Asset creation time regresses past the 2-3 days baseline by more than 20%",
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
    "Never fabricate metric values; only publish numbers derived from Figma (and other named systems) entities.",
    "Never bypass Brand Manager approval on escalation triggers, even when confidence is high.",
    "Never expose individual personal data (PII) in summaries; aggregate or pseudonymise before output.",
    "Never act on data older than the staleness threshold defined in the runbook without a fresh re-query.",
  ],
  goldenEvals: [
    {
      id: "creative-asset-generator-end-to-end",
      prompt: "Run the Creative Asset Generator workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.",
      expectedToolCalls: [
        "query_figma_assets",
        "query_canva_assets",
        "query_bynder_assets",
        "query_google_drive_documents",
        "lookup_creative_asset_generator_playbook",
        "action_figma_generate",
      ],
      mustReferenceEntities: [
        "assets",
        "assets",
        "assets",
        "documents",
      ],
      mustCiteDocuments: [
        "creative-asset-generator-playbook",
      ],
      expectedActionOutcome: "Action generate executed against Figma, with audit-trail entry and Brand Manager notified of outcomes.",
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
    rationale: "Row counts sized for Creative Asset Generator so the agent can demonstrate the workflow against realistic transactional volume without simulating a production warehouse.",
  },
  sourceSystems: [
    {
      id: "figma",
      name: "Figma",
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
        "query_figma_assets",
        "query_figma_asset_versions",
        "query_figma_approval_queues",
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
      id: "bynder",
      name: "Bynder",
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
        "query_bynder_assets",
        "query_bynder_asset_versions",
        "query_bynder_approval_queues",
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
      name: "assets",
      sourceSystemId: "figma",
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
      sourceSystemId: "figma",
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
      sourceSystemId: "figma",
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
      from: "share_events.document_id",
      to: "documents.id",
      cardinality: "many-to-one",
      orphanPolicy: "none",
    },
  ],
  documents: [
    {
      id: "creative-asset-generator-playbook",
      sourceSystemId: "figma",
      type: "playbook",
      title: "Creative Asset Generator Playbook",
      requiredSections: [
        "Audience guidelines",
        "Brand voice rules",
        "Channel-specific guardrails",
        "Measurement framework",
        "Approval thresholds",
      ],
      linkedEntities: [
        "assets",
        "asset_versions",
        "approval_queues",
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
      id: "figma_generate_api",
      sourceSystemId: "figma",
      method: "POST",
      path: "/api/figma/generate",
      description: "Synchronous endpoint the agent calls to generate in Figma after evidence gating.",
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
      id: "creative-asset-generator-baseline-gap",
      description: "Seed a realistic gap where Asset creation time sits between 2-3 days and 2 hours, so the agent can detect, narrate, and recommend remediation.",
      affectedEntities: [
        "assets",
        "asset_versions",
      ],
      discoveryPath: [
        "Inspect Figma records for the affected entities",
        "Compare against Canva historical baseline",
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
      database: "creative_asset_generator",
      schemas: [
        "figma",
        "canva",
        "bynder",
        "google_drive",
      ],
    },
    bigquery: {
      dataset: "marketing_creative_asset_generator",
      tables: [
        "kpi_summary",
        "evidence_index",
      ],
    },
    cloudStorage: {
      bucketSuffix: "creative-asset-generator-evidence",
      prefixes: [
        "documents",
        "audit-trails",
        "exports",
      ],
    },
    apis: {
      serviceName: "creative-asset-generator-source-adapters",
      deploymentTarget: "cloud_run",
    },
  },
  validation: {
    smokePrompt: "Run the Creative Asset Generator workflow and cite source-system evidence for every claim.",
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

export const CreativeAssetGenerator = () => (
  <UseCaseSlide
    title="Creative Asset Generator"
    subtitle="A-3003 \u2022 Content & Creative"
    icon={Palette}
    domainId="domain-30"
    layer="Layer 3: Custom ADK"
    persona="Brand Manager"
    systems={["Figma", "Canva", "Bynder", "Google Drive", "Vertex AI"]}
    kpis={[
      { label: "Asset creation time", before: "2-3 days", after: "2 hours" },
      { label: "Variations per campaign", before: "3-4", after: "10-15" },
      { label: "Brand compliance rate", before: "78%", after: "95%" },
    ]}
    triggerType="event"
    swimlane={swimlane}
    flow={flow}
    architecture={architecture}
    hitl={{ actor: "Brand Manager", action: "Approve creative assets", description: "Brand Manager reviews generated assets for brand guideline compliance, messaging alignment, and visual quality before publishing to DAM." }}
    statusQuo={[
      "Creative asset requests bottlenecked by design team capacity with 2-3 day turnaround times.",
      "Limited variations tested per campaign due to production constraints \u2014 3-4 variants at best.",
      "Brand compliance checked manually after production, leading to rework cycles."
    ]}
    agentification={[
      "Gemini interprets campaign briefs to generate contextually appropriate ad copy and messaging variations aligned with brand guidelines.",
      "Reasons about which messaging angle will resonate based on target audience segment and funnel stage.",
      "Generates alt-text and accessibility descriptions for all visual assets automatically."
    ]}
  />
);
