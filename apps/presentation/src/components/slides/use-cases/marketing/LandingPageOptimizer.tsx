import React from "react";
import { UseCaseSlide } from "../../../agent/UseCaseSlide";
import { FlowStep } from "../../../agent/ProcessFlow";
import { SwimlaneFlow } from "../../../agent/SwimlaneFlow";
import { AgentArchitecture, UseCaseGenerationSpec, AgentBehaviorContract} from "../../../../types/architecture";
import { Layout, BarChart3, PenTool, Beaker, Send } from "lucide-react";

const swimlane: SwimlaneFlow = {
  nodes: [
    { id: "s1", label: "Page Published / Weekly", lane: "system", type: "trigger" },
    { id: "a1", label: "Performance Analysis", lane: "agent", type: "action" },
    { id: "a2", label: "Copy Optimization", lane: "agent", type: "action" },
    { id: "a3", label: "Test Configuration", lane: "agent", type: "output" },
  ],
  connections: [["s1", "a1"], ["a1", "a2"], ["a2", "a3"]],
};

const flow: FlowStep[] = [
  { label: "Performance Monitoring", icon: BarChart3, description: "Landing page conversion rates, form submissions, and engagement metrics tracked in GA4.", trigger: "Published + Weekly", systems: ["GA4", "HubSpot"] },
  { label: "Conversion Analysis", icon: PenTool, description: "Gemini reviews copy, structure, and CTA with optimization recommendations grounded in conversion principles.", systems: ["Vertex AI"], integration: "ADK" },
  { label: "A/B Test Setup", icon: Beaker, description: "Test variants configured with headline, CTA, and form field optimizations based on analysis.", systems: ["Google Optimize", "Unbounce"] },
  { label: "Results Distribution", icon: Send, description: "Test results with statistical significance and conversion impact published to optimization backlog.", output: "Optimized Pages" },
];

const architecture: AgentArchitecture = {
  connections: [
    { system: "WordPress", description: "Landing page content, URL structure, page templates", direction: "read", protocol: "REST API", category: "collaboration" },
    { system: "Unbounce", description: "Landing page builder, variant creation, A/B test management", direction: "bidirectional", protocol: "REST API", category: "collaboration" },
    { system: "Google Analytics 4", description: "Page performance, conversion tracking, user behavior", direction: "read", protocol: "REST API", category: "analytics" },
    { system: "HubSpot", description: "Form submission data, lead attribution, conversion tracking", direction: "read", protocol: "REST API", category: "erp" },
    { system: "Google Optimize", description: "A/B test configuration, variant serving, test results", direction: "bidirectional", protocol: "REST API", category: "analytics" },
    { system: "Vertex AI (Gemini)", description: "Copy analysis, headline generation, CTA optimization, conversion reasoning", direction: "bidirectional", protocol: "gRPC", category: "ai" },
  ],
  pipeline: [
    { label: "Performance Monitoring", description: "Monitor landing page performance in GA4. Track form submission rates from HubSpot. Capture user behavior patterns for conversion analysis.", systems: ["Google Analytics 4", "HubSpot", "WordPress"], layer: "integration", dataIn: "Page traffic + conversion + form data", dataOut: "Page performance profiles" },
    { label: "Conversion Modeling", description: "Conversion rate prediction by traffic source. Heatmap-based layout optimization insights. Form field analysis (optimal number/types). Load time impact modeling on conversion.", systems: ["BigQuery"], layer: "ml", dataIn: "Historical conversion data + page attributes", dataOut: "Conversion predictions + form optimization recs" },
    { label: "Copy & CTA Optimization", description: "Review landing page copy, structure, and CTA. Generate optimization recommendations grounded in conversion principles. Test headline alternatives and form field configurations.", systems: ["Vertex AI (Gemini)"], layer: "llm", dataIn: "Page content + audience context + conversion data", dataOut: "Headline variants + CTA improvements + form recommendations" },
    { label: "Test Configuration", description: "Set up A/B tests in Google Optimize or Unbounce with generated variants. Configure statistical significance thresholds and auto-declare winners.", systems: ["Google Optimize", "Unbounce"], layer: "integration", dataIn: "Test variants + configuration", dataOut: "Active A/B tests with monitoring" },
  ],
};


const behaviorContract: AgentBehaviorContract = {
  role: "Digital Marketing Mgr agent for the Landing Page Optimizer workflow",
  primaryObjective: "Gemini reviews page copy, structure, and CTA with recommendations grounded in conversion principles and audience context. Generates headline alternatives that test different value proposition angles \\u2014 features vs. outcomes vs. social proof. so the Digital Marketing Mgr can move the Conversion rate lift KPI.",
  inScope: [
    "Gemini reviews page copy, structure, and CTA with recommendations grounded in conversion principles and audience context",
    "Generates headline alternatives that test different value proposition angles \\u2014 features vs. outcomes vs. social proof",
    "Systematic form field analysis recommends optimal field count by funnel stage with progressive profiling strategies",
  ],
  outOfScope: [
    "Final approval of paid spend reallocations above the governance threshold",
    "Trademark, legal, or regulated-industry claim approval",
    "Crisis communications without comms-team sign-off",
  ],
  toolIntents: [
    {
      name: "query_wordpress_content_entries",
      kind: "query",
      sourceSystemId: "wordpress",
      description: "Retrieve content entries from WordPress for the Landing Page Optimizer workflow.",
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
      name: "query_unbounce_unbounce_records",
      kind: "query",
      sourceSystemId: "unbounce",
      description: "Retrieve unbounce records from Unbounce for the Landing Page Optimizer workflow.",
      requiredInputs: [
        "lookup_key",
        "date_range",
      ],
      produces: [
        "unbounce_records_records",
        "unbounce_records_summary",
      ],
      evidenceEmitted: [
        "source_system_record",
      ],
    },
    {
      name: "query_ga4_session_events",
      kind: "query",
      sourceSystemId: "ga4",
      description: "Retrieve session events from GA4 for the Landing Page Optimizer workflow.",
      requiredInputs: [
        "lookup_key",
        "date_range",
      ],
      produces: [
        "session_events_records",
        "session_events_summary",
      ],
      evidenceEmitted: [
        "sql_result",
      ],
    },
    {
      name: "query_hubspot_contacts",
      kind: "query",
      sourceSystemId: "hubspot",
      description: "Retrieve contacts from HubSpot for the Landing Page Optimizer workflow.",
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
      name: "lookup_landing_page_optimizer_playbook",
      kind: "evidence_lookup",
      sourceSystemId: "wordpress",
      description: "Look up sections of the Landing Page Optimizer Playbook to cite in narrative output, escalation rationale, and audit evidence.",
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
      name: "action_wordpress_recommend",
      kind: "action",
      sourceSystemId: "wordpress",
      description: "Execute the recommend step in WordPress after the agent has gathered evidence and validated escalation gates.",
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
      claim: "Conversion rate lift moved from Baseline toward +20-35%",
      mustCite: [
        "wordpress.content_entries",
        "unbounce.unbounce_records",
      ],
      sourceSystemIds: [
        "wordpress",
        "unbounce",
      ],
    },
    {
      claim: "A/B tests per quarter moved from 2-3 toward 8-12",
      mustCite: [
        "wordpress.content_entries",
        "unbounce.unbounce_records",
      ],
      sourceSystemIds: [
        "wordpress",
        "unbounce",
      ],
    },
  ],
  escalationRules: [
    {
      trigger: "Conversion rate lift regresses past the Baseline baseline by more than 20%",
      action: "escalate_to_human",
      handoffTarget: "Digital Marketing Mgr",
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
    "Never fabricate metric values; only publish numbers derived from WordPress (and other named systems) entities.",
    "Never bypass Digital Marketing Mgr approval on escalation triggers, even when confidence is high.",
    "Never expose individual personal data (PII) in summaries; aggregate or pseudonymise before output.",
    "Never act on data older than the staleness threshold defined in the runbook without a fresh re-query.",
  ],
  goldenEvals: [
    {
      id: "landing-page-optimizer-end-to-end",
      prompt: "Run the Landing Page Optimizer workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.",
      expectedToolCalls: [
        "query_wordpress_content_entries",
        "query_unbounce_unbounce_records",
        "query_ga4_session_events",
        "query_hubspot_contacts",
        "lookup_landing_page_optimizer_playbook",
        "action_wordpress_recommend",
      ],
      mustReferenceEntities: [
        "content_entries",
        "unbounce_records",
        "session_events",
        "contacts",
        "google_optimize_records",
      ],
      mustCiteDocuments: [
        "landing-page-optimizer-playbook",
      ],
      expectedActionOutcome: "Action recommend executed against WordPress, with audit-trail entry and Digital Marketing Mgr notified of outcomes.",
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
    rationale: "Row counts sized for Landing Page Optimizer so the agent can demonstrate the workflow against realistic transactional volume without simulating a production warehouse.",
  },
  sourceSystems: [
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
      id: "unbounce",
      name: "Unbounce",
      owns: [
        "unbounce_records",
        "unbounce_events",
        "unbounce_audit_trail",
      ],
      protocol: "REST API",
      localBacking: [
        "alloydb",
      ],
      toolNames: [
        "query_unbounce_unbounce_records",
        "query_unbounce_unbounce_events",
        "query_unbounce_unbounce_audit_trail",
      ],
      evidence: [
        "source_system_record",
        "generated_audit_trail",
      ],
    },
    {
      id: "ga4",
      name: "GA4",
      owns: [
        "session_events",
        "conversion_paths",
        "audience_segments",
      ],
      protocol: "REST API",
      localBacking: [
        "bigquery",
      ],
      toolNames: [
        "query_ga4_session_events",
        "query_ga4_conversion_paths",
        "query_ga4_audience_segments",
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
      id: "google_optimize",
      name: "Google Optimize",
      owns: [
        "google_optimize_records",
        "google_optimize_events",
        "google_optimize_audit_trail",
      ],
      protocol: "REST API",
      localBacking: [
        "alloydb",
      ],
      toolNames: [
        "query_google_optimize_google_optimize_records",
        "query_google_optimize_google_optimize_events",
        "query_google_optimize_google_optimize_audit_trail",
      ],
      evidence: [
        "source_system_record",
        "generated_audit_trail",
      ],
    },
  ],
  entities: [
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
      name: "unbounce_records",
      sourceSystemId: "unbounce",
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
      name: "unbounce_events",
      sourceSystemId: "unbounce",
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
          name: "unbounce_record_id",
          type: "ref",
          ref: "unbounce_records.id",
          required: true,
        },
      ],
    },
    {
      name: "unbounce_audit_trail",
      sourceSystemId: "unbounce",
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
      name: "session_events",
      sourceSystemId: "ga4",
      datastore: "bigquery",
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
          name: "conversion_path_id",
          type: "ref",
          ref: "conversion_paths.id",
          required: true,
        },
      ],
    },
    {
      name: "conversion_paths",
      sourceSystemId: "ga4",
      datastore: "bigquery",
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
      name: "audience_segments",
      sourceSystemId: "ga4",
      datastore: "bigquery",
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
      name: "google_optimize_records",
      sourceSystemId: "google_optimize",
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
      name: "google_optimize_events",
      sourceSystemId: "google_optimize",
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
          name: "google_optimize_record_id",
          type: "ref",
          ref: "google_optimize_records.id",
          required: true,
        },
      ],
    },
    {
      name: "google_optimize_audit_trail",
      sourceSystemId: "google_optimize",
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
      from: "unbounce_events.unbounce_record_id",
      to: "unbounce_records.id",
      cardinality: "many-to-one",
      orphanPolicy: "none",
    },
    {
      from: "session_events.conversion_path_id",
      to: "conversion_paths.id",
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
      from: "google_optimize_events.google_optimize_record_id",
      to: "google_optimize_records.id",
      cardinality: "many-to-one",
      orphanPolicy: "none",
    },
  ],
  documents: [
    {
      id: "landing-page-optimizer-playbook",
      sourceSystemId: "ga4",
      type: "playbook",
      title: "Landing Page Optimizer Playbook",
      requiredSections: [
        "Audience guidelines",
        "Brand voice rules",
        "Channel-specific guardrails",
        "Measurement framework",
        "Approval thresholds",
      ],
      linkedEntities: [
        "content_entries",
        "publishing_workflows",
        "media_assets",
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
      id: "wordpress_recommend_api",
      sourceSystemId: "wordpress",
      method: "POST",
      path: "/api/wordpress/recommend",
      description: "Synchronous endpoint the agent calls to recommend in WordPress after evidence gating.",
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
      id: "landing-page-optimizer-baseline-gap",
      description: "Seed a realistic gap where Conversion rate lift sits between Baseline and +20-35%, so the agent can detect, narrate, and recommend remediation.",
      affectedEntities: [
        "content_entries",
        "publishing_workflows",
      ],
      discoveryPath: [
        "Inspect WordPress records for the affected entities",
        "Compare against Unbounce historical baseline",
        "Generate a citation-backed recommendation",
      ],
      expectedEvidence: [
        "source-system record",
        "historical baseline metric",
        "generated audit trail",
      ],
      expectedRecommendation: "Explain the gap, cite supporting evidence, and propose the next Digital Marketing Mgr action.",
    },
  ],
  datastorePackaging: {
    alloydb: {
      database: "landing_page_optimizer",
      schemas: [
        "wordpress",
        "unbounce",
        "hubspot",
        "google_optimize",
      ],
    },
    bigquery: {
      dataset: "marketing_landing_page_optimizer",
      tables: [
        "kpi_summary",
        "evidence_index",
      ],
    },
    cloudStorage: {
      bucketSuffix: "landing-page-optimizer-evidence",
      prefixes: [
        "documents",
        "audit-trails",
        "exports",
      ],
    },
    apis: {
      serviceName: "landing-page-optimizer-source-adapters",
      deploymentTarget: "cloud_run",
    },
  },
  validation: {
    smokePrompt: "Run the Landing Page Optimizer workflow and cite source-system evidence for every claim.",
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

export const LandingPageOptimizer = () => (
  <UseCaseSlide
    title="Landing Page Optimizer"
    subtitle="A-3107 \u2022 Demand Generation"
    icon={Layout}
    domainId="domain-31"
    layer="Layer 3: Custom ADK"
    persona="Digital Marketing Mgr"
    systems={["WordPress", "Unbounce", "GA4", "HubSpot", "Google Optimize", "Vertex AI"]}
    kpis={[
      { label: "Conversion rate lift", before: "Baseline", after: "+20-35%" },
      { label: "A/B tests per quarter", before: "2-3", after: "8-12" },
      { label: "Optimization backlog", before: "Subjective", after: "Data-prioritized" },
    ]}
    triggerType="scheduled"
    swimlane={swimlane}
    flow={flow}
    architecture={architecture}
    statusQuo={[
      "Landing page optimization is ad-hoc with 2-3 A/B tests per quarter based on team hunches.",
      "Copy analysis limited to surface-level review without systematic conversion principle application.",
      "Form field optimization and CTA testing rarely prioritized despite significant conversion impact."
    ]}
    agentification={[
      "Gemini reviews page copy, structure, and CTA with recommendations grounded in conversion principles and audience context.",
      "Generates headline alternatives that test different value proposition angles \u2014 features vs. outcomes vs. social proof.",
      "Systematic form field analysis recommends optimal field count by funnel stage with progressive profiling strategies."
    ]}
  />
);
