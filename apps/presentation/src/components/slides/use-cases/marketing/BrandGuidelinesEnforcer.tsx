import React from "react";
import { UseCaseSlide } from "../../../agent/UseCaseSlide";
import { FlowStep } from "../../../agent/ProcessFlow";
import { SwimlaneFlow } from "../../../agent/SwimlaneFlow";
import { AgentArchitecture, UseCaseGenerationSpec, AgentBehaviorContract} from "../../../../types/architecture";
import { ShieldCheck, Upload, Search, AlertTriangle, CheckCircle } from "lucide-react";

const swimlane: SwimlaneFlow = {
  nodes: [
    { id: "s1", label: "Asset Submitted", lane: "system", type: "trigger" },
    { id: "a1", label: "Visual Compliance", lane: "agent", type: "action" },
    { id: "a2", label: "Tone & Message Check", lane: "agent", type: "action" },
    { id: "a3", label: "Compliance Report", lane: "agent", type: "output" },
    { id: "h1", label: "Brand Mgr Reviews", lane: "human", type: "hitl" },
  ],
  connections: [["s1", "a1"], ["a1", "a2"], ["a2", "a3"], ["a3", "h1"]],
};

const flow: FlowStep[] = [
  { label: "Asset Intake", icon: Upload, description: "Design or content asset submitted for brand compliance review.", trigger: "Event", systems: ["Bynder", "Figma"] },
  { label: "Visual Scan", icon: Search, description: "Color palette, logo usage, typography, and layout checked against brand standards.", systems: ["Vertex AI"], integration: "ADK" },
  { label: "Tone Analysis", icon: AlertTriangle, description: "Messaging tone, terminology, and voice assessed for brand alignment.", systems: ["Vertex AI"] },
  { label: "Compliance Verdict", icon: CheckCircle, description: "Brand Manager reviews flagged violations and decides on corrections.", output: "Brand Compliance Report" },
];

const architecture: AgentArchitecture = {
  connections: [
    { system: "Bynder", description: "DAM asset submissions, brand templates, approved asset library", direction: "bidirectional", protocol: "REST API", category: "collaboration" },
    { system: "Figma", description: "Design file submissions, component library, design system", direction: "read", protocol: "REST API", category: "collaboration" },
    { system: "Google Drive", description: "Content documents, presentation files, marketing collateral", direction: "read", protocol: "Workspace API", category: "collaboration" },
    { system: "Vertex AI (Gemini)", description: "Visual compliance checking, tone analysis, messaging assessment", direction: "bidirectional", protocol: "gRPC", category: "ai" },
    { system: "Canva", description: "Design template compliance, brand kit enforcement", direction: "read", protocol: "REST API", category: "collaboration" },
    { system: "Slack", description: "Violation alerts, correction guidance, approval notifications", direction: "write", protocol: "Webhook", category: "collaboration" },
  ],
  pipeline: [
    { label: "Asset Ingestion", description: "Hook into design and content submission workflows across Bynder, Figma, and Google Drive. Extract visual elements and text content for analysis.", systems: ["Bynder", "Figma", "Google Drive"], layer: "integration", dataIn: "Submitted asset (visual or text)", dataOut: "Extracted elements for analysis" },
    { label: "Visual Compliance", description: "Check color hex codes against brand palette, verify logo placement and clear space, validate typography selections, and assess layout against approved templates.", systems: ["Vertex AI"], layer: "ml", dataIn: "Visual elements + brand guidelines DB", dataOut: "Visual compliance score with violations" },
    { label: "Messaging & Tone Assessment", description: "Gemini reads content and assesses whether it sounds like 'us' — catching tonal mismatches, prohibited language, and voice inconsistencies. Distinguishes between appropriately formal (whitepaper) and inappropriately stiff (blog post).", systems: ["Vertex AI (Gemini)"], layer: "llm", dataIn: "Text content + brand voice guidelines", dataOut: "Tone compliance report with rewrite suggestions" },
    { label: "Report & Remediation", description: "Generate compliance report with specific correction guidance. Route violations to Brand Manager for review. Provide suggested rewrites for text and reference assets for visual fixes.", systems: ["Slack", "Bynder"], layer: "integration", dataIn: "Compliance results", dataOut: "Annotated feedback to asset creator" },
  ],
};


const behaviorContract: AgentBehaviorContract = {
  role: "Brand Manager agent for the Brand Guidelines Enforcer workflow",
  primaryObjective: "Gemini scans every submitted asset for visual and messaging compliance in under 5 minutes. LLM catches tone mismatches that pixel-level checks miss — fear-based language conflicting with empowering brand voice. so the Brand Manager can move the Review turnaround KPI.",
  inScope: [
    "Gemini scans every submitted asset for visual and messaging compliance in under 5 minutes",
    "LLM catches tone mismatches that pixel-level checks miss — fear-based language conflicting with empowering brand voice",
    "Generates specific correction guidance with suggested rewrites, not just violation flags",
  ],
  outOfScope: [
    "Final approval of paid spend reallocations above the governance threshold",
    "Trademark, legal, or regulated-industry claim approval",
    "Crisis communications without comms-team sign-off",
  ],
  toolIntents: [
    {
      name: "query_bynder_assets",
      kind: "query",
      sourceSystemId: "bynder",
      description: "Retrieve assets from Bynder for the Brand Guidelines Enforcer workflow.",
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
      name: "query_figma_assets",
      kind: "query",
      sourceSystemId: "figma",
      description: "Retrieve assets from Figma for the Brand Guidelines Enforcer workflow.",
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
      description: "Retrieve documents from Google Drive for the Brand Guidelines Enforcer workflow.",
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
      name: "query_canva_assets",
      kind: "query",
      sourceSystemId: "canva",
      description: "Retrieve assets from Canva for the Brand Guidelines Enforcer workflow.",
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
      name: "lookup_brand_guidelines_enforcer_playbook",
      kind: "evidence_lookup",
      sourceSystemId: "bynder",
      description: "Look up sections of the Brand Guidelines Enforcer Playbook to cite in narrative output, escalation rationale, and audit evidence.",
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
      name: "action_bynder_generate",
      kind: "action",
      sourceSystemId: "bynder",
      description: "Execute the generate step in Bynder after the agent has gathered evidence and validated escalation gates.",
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
      claim: "Review turnaround moved from 2-3 days manual toward < 5 minutes",
      mustCite: [
        "bynder.assets",
        "figma.assets",
      ],
      sourceSystemIds: [
        "bynder",
        "figma",
      ],
    },
    {
      claim: "Violation catch rate moved from ~60% spot-checked toward 100% automated scan",
      mustCite: [
        "bynder.assets",
        "figma.assets",
      ],
      sourceSystemIds: [
        "bynder",
        "figma",
      ],
    },
  ],
  escalationRules: [
    {
      trigger: "Review turnaround regresses past the 2-3 days manual baseline by more than 20%",
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
    "Never fabricate metric values; only publish numbers derived from Bynder (and other named systems) entities.",
    "Never bypass Brand Manager approval on escalation triggers, even when confidence is high.",
    "Never expose individual personal data (PII) in summaries; aggregate or pseudonymise before output.",
    "Never act on data older than the staleness threshold defined in the runbook without a fresh re-query.",
  ],
  goldenEvals: [
    {
      id: "brand-guidelines-enforcer-end-to-end",
      prompt: "Run the Brand Guidelines Enforcer workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.",
      expectedToolCalls: [
        "query_bynder_assets",
        "query_figma_assets",
        "query_google_drive_documents",
        "query_canva_assets",
        "lookup_brand_guidelines_enforcer_playbook",
        "action_bynder_generate",
      ],
      mustReferenceEntities: [
        "assets",
        "assets",
        "documents",
        "assets",
      ],
      mustCiteDocuments: [
        "brand-guidelines-enforcer-playbook",
      ],
      expectedActionOutcome: "Action generate executed against Bynder, with audit-trail entry and Brand Manager notified of outcomes.",
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
    rationale: "Row counts sized for Brand Guidelines Enforcer so the agent can demonstrate the workflow against realistic transactional volume without simulating a production warehouse.",
  },
  sourceSystems: [
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
      name: "assets",
      sourceSystemId: "bynder",
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
      sourceSystemId: "bynder",
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
      sourceSystemId: "bynder",
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
      id: "brand-guidelines-enforcer-playbook",
      sourceSystemId: "bynder",
      type: "playbook",
      title: "Brand Guidelines Enforcer Playbook",
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
      id: "bynder_generate_api",
      sourceSystemId: "bynder",
      method: "POST",
      path: "/api/bynder/generate",
      description: "Synchronous endpoint the agent calls to generate in Bynder after evidence gating.",
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
      id: "brand-guidelines-enforcer-baseline-gap",
      description: "Seed a realistic gap where Review turnaround sits between 2-3 days manual and < 5 minutes, so the agent can detect, narrate, and recommend remediation.",
      affectedEntities: [
        "assets",
        "asset_versions",
      ],
      discoveryPath: [
        "Inspect Bynder records for the affected entities",
        "Compare against Figma historical baseline",
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
      database: "brand_guidelines_enforcer",
      schemas: [
        "bynder",
        "figma",
        "google_drive",
        "canva",
      ],
    },
    bigquery: {
      dataset: "marketing_brand_guidelines_enforcer",
      tables: [
        "kpi_summary",
        "evidence_index",
      ],
    },
    cloudStorage: {
      bucketSuffix: "brand-guidelines-enforcer-evidence",
      prefixes: [
        "documents",
        "audit-trails",
        "exports",
      ],
    },
    apis: {
      serviceName: "brand-guidelines-enforcer-source-adapters",
      deploymentTarget: "cloud_run",
    },
  },
  validation: {
    smokePrompt: "Run the Brand Guidelines Enforcer workflow and cite source-system evidence for every claim.",
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

export const BrandGuidelinesEnforcer = () => (
  <UseCaseSlide
    title="Brand Guidelines Enforcer"
    subtitle="A-3505 • Brand & Communications"
    icon={ShieldCheck}
    domainId="domain-35"
    layer="Layer 3: Custom ADK"
    persona="Brand Manager"
    systems={["Bynder", "Figma", "Google Drive", "Vertex AI", "Canva"]}
    kpis={[
      { label: "Review turnaround", before: "2-3 days manual", after: "< 5 minutes" },
      { label: "Violation catch rate", before: "~60% spot-checked", after: "100% automated scan" },
      { label: "Brand consistency score", before: "Untracked", after: "92%+ across assets" },
    ]}
    triggerType="event"
    swimlane={swimlane}
    flow={flow}
    architecture={architecture}
    hitl={{ actor: "Brand Manager", action: "Review violations", description: "Brand Manager reviews flagged brand guideline violations and decides on required corrections or approved exceptions." }}
    statusQuo={[
      "Brand compliance relies on manual review by overloaded Brand Manager — many assets skip review.",
      "Visual checks catch obvious issues but miss subtle tone and messaging misalignments.",
      "Regional teams create off-brand materials that erode brand consistency over time."
    ]}
    agentification={[
      "Gemini scans every submitted asset for visual and messaging compliance in under 5 minutes.",
      "LLM catches tone mismatches that pixel-level checks miss — fear-based language conflicting with empowering brand voice.",
      "Generates specific correction guidance with suggested rewrites, not just violation flags."
    ]}
  />
);
