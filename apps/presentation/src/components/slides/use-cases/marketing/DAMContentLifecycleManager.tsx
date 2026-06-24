import React from "react";
import { UseCaseSlide } from "../../../agent/UseCaseSlide";
import { FlowStep } from "../../../agent/ProcessFlow";
import { SwimlaneFlow } from "../../../agent/SwimlaneFlow";
import { AgentArchitecture, UseCaseGenerationSpec, AgentBehaviorContract} from "../../../../types/architecture";
import { Archive, Search, AlertTriangle, RefreshCw, Send } from "lucide-react";

const swimlane: SwimlaneFlow = {
  nodes: [
    { id: "s1", label: "Weekly / Expiration Alert", lane: "system", type: "trigger" },
    { id: "a1", label: "Asset Scan", lane: "agent", type: "action" },
    { id: "a2", label: "Deprecation Analysis", lane: "agent", type: "action" },
    { id: "a3", label: "Action Notifications", lane: "agent", type: "output" },
  ],
  connections: [["s1", "a1"], ["a1", "a2"], ["a2", "a3"]],
};

const flow: FlowStep[] = [
  { label: "DAM Scan", icon: Search, description: "DAM scanned for asset expiration dates, usage rights, outdated brand elements, and duplicates.", trigger: "Weekly + Event", systems: ["Bynder", "Brandfolder"] },
  { label: "Content Analysis", icon: AlertTriangle, description: "Assets reviewed for references to outdated product names, former executives, or discontinued features.", systems: ["Vertex AI"], integration: "Agent Designer" },
  { label: "Lifecycle Actions", icon: RefreshCw, description: "Expired content archived, deprecation recommendations generated with replacement suggestions.", systems: ["Google Drive", "WordPress"] },
  { label: "Owner Notifications", icon: Send, description: "Asset owners notified of expiration, compliance issues, and recommended actions.", output: "Lifecycle Report" },
];

const architecture: AgentArchitecture = {
  connections: [
    { system: "Bynder", description: "DAM asset metadata, expiration dates, usage tracking", direction: "bidirectional", protocol: "REST API", category: "collaboration" },
    { system: "Brandfolder", description: "Brand asset library, version control, access management", direction: "bidirectional", protocol: "REST API", category: "collaboration" },
    { system: "Google Drive", description: "Supplementary asset storage, team file management", direction: "bidirectional", protocol: "Workspace API", category: "collaboration" },
    { system: "WordPress", description: "Published content referencing DAM assets, embedded media", direction: "read", protocol: "REST API", category: "collaboration" },
    { system: "Contentful", description: "CMS content referencing managed assets", direction: "read", protocol: "REST API", category: "collaboration" },
  ],
  pipeline: [
    { label: "Asset Scanning", description: "Scan DAM for asset expiration dates, usage rights expirations, outdated brand elements. Track utilization metrics and detect duplicates.", systems: ["Bynder", "Brandfolder", "Google Drive"], layer: "integration", dataIn: "DAM asset metadata + usage rights + brand elements", dataOut: "Asset inventory with expiration and compliance flags" },
    { label: "Utilization & Duplicate Analysis", description: "Asset utilization tracking across channels. Duplicate detection using visual and metadata similarity. Version control analytics and storage optimization.", systems: ["BigQuery"], layer: "ml", dataIn: "Asset usage data + visual fingerprints", dataOut: "Utilization scores + duplicate clusters + storage report" },
    { label: "Content-Level Review", description: "Review asset metadata and content to identify references to outdated product names, former executives, or discontinued features \u2014 things metadata scans would miss. Generate deprecation recommendations with replacement suggestions.", systems: ["Vertex AI (Gemini)"], layer: "llm", dataIn: "Asset content + product catalog + org changes", dataOut: "Deprecation recommendations with replacement suggestions" },
    { label: "Notification & Archival", description: "Notify asset owners of expiration, compliance issues, and recommended actions. Archive expired content with proper record-keeping.", systems: ["Bynder", "Email"], layer: "integration", dataIn: "Action items + owner assignments", dataOut: "Notifications sent + assets archived" },
  ],
};


const behaviorContract: AgentBehaviorContract = {
  role: "Content Strategist agent for the DAM & Content Lifecycle Manager workflow",
  primaryObjective: "Gemini reviews asset content to identify references to outdated product names, former executives, or discontinued features that metadata scans miss. Generates deprecation recommendations with replacement suggestions, not just expiration flags. so the Content Strategist can move the Expired asset detection KPI.",
  inScope: [
    "Gemini reviews asset content to identify references to outdated product names, former executives, or discontinued features that metadata scans miss",
    "Generates deprecation recommendations with replacement suggestions, not just expiration flags",
    "Continuous automated lifecycle management replaces quarterly manual audits",
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
      description: "Retrieve assets from Bynder for the DAM & Content Lifecycle Manager workflow.",
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
      name: "query_brandfolder_brandfolder_records",
      kind: "query",
      sourceSystemId: "brandfolder",
      description: "Retrieve brandfolder records from Brandfolder for the DAM & Content Lifecycle Manager workflow.",
      requiredInputs: [
        "lookup_key",
        "date_range",
      ],
      produces: [
        "brandfolder_records_records",
        "brandfolder_records_summary",
      ],
      evidenceEmitted: [
        "source_system_record",
      ],
    },
    {
      name: "query_google_drive_documents",
      kind: "query",
      sourceSystemId: "google_drive",
      description: "Retrieve documents from Google Drive for the DAM & Content Lifecycle Manager workflow.",
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
      description: "Retrieve content entries from WordPress for the DAM & Content Lifecycle Manager workflow.",
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
      name: "lookup_dam_content_lifecycle_manager_playbook",
      kind: "evidence_lookup",
      sourceSystemId: "bynder",
      description: "Look up sections of the DAM & Content Lifecycle Manager Playbook to cite in narrative output, escalation rationale, and audit evidence.",
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
      name: "action_bynder_recommend",
      kind: "action",
      sourceSystemId: "bynder",
      description: "Execute the recommend step in Bynder after the agent has gathered evidence and validated escalation gates.",
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
      claim: "Expired asset detection moved from Months late toward Pre-expiration alerts",
      mustCite: [
        "bynder.assets",
        "brandfolder.brandfolder_records",
      ],
      sourceSystemIds: [
        "bynder",
        "brandfolder",
      ],
    },
    {
      claim: "Outdated content in use moved from Unknown toward < 2%",
      mustCite: [
        "bynder.assets",
        "brandfolder.brandfolder_records",
      ],
      sourceSystemIds: [
        "bynder",
        "brandfolder",
      ],
    },
  ],
  escalationRules: [
    {
      trigger: "Expired asset detection regresses past the Months late baseline by more than 20%",
      action: "escalate_to_human",
      handoffTarget: "Content Strategist",
      rationale: "Significant regressions need human judgment before automated remediation runs against production records.",
    },
    {
      trigger: "Source-system evidence is incomplete or stale (>24h) for any required entity",
      action: "request_more_info",
      rationale: "Recommendations grounded in stale evidence misrepresent current state and undermine audit defensibility.",
    },
    {
      trigger: "Proposed recommend action lacks supporting evidence from at least two systems",
      action: "refuse",
      rationale: "Single-system evidence is insufficient to authorize external state changes without manual review.",
    },
  ],
  refusalRules: [
    "Never fabricate metric values; only publish numbers derived from Bynder (and other named systems) entities.",
    "Never bypass Content Strategist approval on escalation triggers, even when confidence is high.",
    "Never expose individual personal data (PII) in summaries; aggregate or pseudonymise before output.",
    "Never act on data older than the staleness threshold defined in the runbook without a fresh re-query.",
  ],
  goldenEvals: [
    {
      id: "dam-content-lifecycle-manager-end-to-end",
      prompt: "Run the DAM & Content Lifecycle Manager workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.",
      expectedToolCalls: [
        "query_bynder_assets",
        "query_brandfolder_brandfolder_records",
        "query_google_drive_documents",
        "query_wordpress_content_entries",
        "lookup_dam_content_lifecycle_manager_playbook",
        "action_bynder_recommend",
      ],
      mustReferenceEntities: [
        "assets",
        "brandfolder_records",
        "documents",
        "content_entries",
        "content_entries",
      ],
      mustCiteDocuments: [
        "dam-content-lifecycle-manager-playbook",
      ],
      expectedActionOutcome: "Action recommend executed against Bynder, with audit-trail entry and Content Strategist notified of outcomes.",
      forbiddenBehaviors: [
        "do not invent KPI numbers",
        "do not skip the evidence_lookup step before any recommendation",
        "do not execute recommend without two-system evidence",
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
    rationale: "Row counts sized for DAM & Content Lifecycle Manager so the agent can demonstrate the workflow against realistic transactional volume without simulating a production warehouse.",
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
      id: "brandfolder",
      name: "Brandfolder",
      owns: [
        "brandfolder_records",
        "brandfolder_events",
        "brandfolder_audit_trail",
      ],
      protocol: "REST API",
      localBacking: [
        "alloydb",
      ],
      toolNames: [
        "query_brandfolder_brandfolder_records",
        "query_brandfolder_brandfolder_events",
        "query_brandfolder_brandfolder_audit_trail",
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
      name: "brandfolder_records",
      sourceSystemId: "brandfolder",
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
      name: "brandfolder_events",
      sourceSystemId: "brandfolder",
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
          name: "brandfolder_record_id",
          type: "ref",
          ref: "brandfolder_records.id",
          required: true,
        },
      ],
    },
    {
      name: "brandfolder_audit_trail",
      sourceSystemId: "brandfolder",
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
  ],
  relationships: [
    {
      from: "brandfolder_events.brandfolder_record_id",
      to: "brandfolder_records.id",
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
      id: "dam-content-lifecycle-manager-playbook",
      sourceSystemId: "bynder",
      type: "playbook",
      title: "DAM & Content Lifecycle Manager Playbook",
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
      id: "bynder_recommend_api",
      sourceSystemId: "bynder",
      method: "POST",
      path: "/api/bynder/recommend",
      description: "Synchronous endpoint the agent calls to recommend in Bynder after evidence gating.",
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
      id: "dam-content-lifecycle-manager-baseline-gap",
      description: "Seed a realistic gap where Expired asset detection sits between Months late and Pre-expiration alerts, so the agent can detect, narrate, and recommend remediation.",
      affectedEntities: [
        "assets",
        "asset_versions",
      ],
      discoveryPath: [
        "Inspect Bynder records for the affected entities",
        "Compare against Brandfolder historical baseline",
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
      database: "dam_content_lifecycle_manager",
      schemas: [
        "bynder",
        "brandfolder",
        "google_drive",
        "wordpress",
        "contentful",
      ],
    },
    bigquery: {
      dataset: "marketing_dam_content_lifecycle_manager",
      tables: [
        "kpi_summary",
        "evidence_index",
      ],
    },
    cloudStorage: {
      bucketSuffix: "dam-content-lifecycle-manager-evidence",
      prefixes: [
        "documents",
        "audit-trails",
        "exports",
      ],
    },
    apis: {
      serviceName: "dam-content-lifecycle-manager-source-adapters",
      deploymentTarget: "cloud_run",
    },
  },
  validation: {
    smokePrompt: "Run the DAM & Content Lifecycle Manager workflow and cite source-system evidence for every claim.",
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

export const DAMContentLifecycleManager = () => (
  <UseCaseSlide
    title="DAM & Content Lifecycle Manager"
    subtitle="A-3008 \u2022 Content & Creative"
    icon={Archive}
    domainId="domain-30"
    layer="Layer 2: Agent Designer"
    persona="Content Strategist"
    systems={["Bynder", "Brandfolder", "Google Drive", "WordPress", "Contentful"]}
    kpis={[
      { label: "Expired asset detection", before: "Months late", after: "Pre-expiration alerts" },
      { label: "Outdated content in use", before: "Unknown", after: "< 2%" },
      { label: "DAM hygiene audit time", before: "2 weeks/quarter", after: "Continuous automated" },
    ]}
    triggerType="scheduled"
    swimlane={swimlane}
    flow={flow}
    architecture={architecture}
    statusQuo={[
      "DAM asset expirations discovered only when someone notices outdated content in the wild.",
      "No systematic detection of assets referencing discontinued products, former executives, or old brand elements.",
      "Quarterly manual DAM audits take weeks and miss content-level issues that metadata scans cannot catch."
    ]}
    agentification={[
      "Gemini reviews asset content to identify references to outdated product names, former executives, or discontinued features that metadata scans miss.",
      "Generates deprecation recommendations with replacement suggestions, not just expiration flags.",
      "Continuous automated lifecycle management replaces quarterly manual audits."
    ]}
  />
);
