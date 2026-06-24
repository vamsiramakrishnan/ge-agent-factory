import React from "react";
import { UseCaseSlide } from "../../../agent/UseCaseSlide";
import { FlowStep } from "../../../agent/ProcessFlow";
import { SwimlaneFlow } from "../../../agent/SwimlaneFlow";
import { AgentArchitecture, UseCaseGenerationSpec, AgentBehaviorContract} from "../../../../types/architecture";
import { BarChart3, Database, TrendingUp, Brain, FileText } from "lucide-react";

const swimlane: SwimlaneFlow = {
  nodes: [
    { id: "s1", label: "Monthly Cycle", lane: "system", type: "trigger" },
    { id: "a1", label: "Usage Collection", lane: "agent", type: "action" },
    { id: "a2", label: "Insight Generation", lane: "agent", type: "action" },
    { id: "a3", label: "Analytics Report", lane: "agent", type: "output" },
    { id: "h1", label: "IT Lead Reviews", lane: "human", type: "hitl" },
  ],
  connections: [["s1", "a1"], ["a1", "a2"], ["a2", "a3"], ["a3", "h1"]],
};

const flow: FlowStep[] = [
  { label: "Usage Aggregation", icon: Database, description: "Productivity tool usage metrics aggregated from Google Workspace, Slack, Zoom, and Microsoft 365.", trigger: "Monthly", systems: ["Google Workspace", "Microsoft 365"] },
  { label: "Pattern Analysis", icon: TrendingUp, description: "Tool adoption curves, collaboration patterns, and license utilization scored.", systems: ["BigQuery"], integration: "ADK" },
  { label: "Insight Generation", icon: Brain, description: "Gemini generates actionable insights on tool adoption, shadow IT signals, and cost optimization.", systems: ["Vertex AI"] },
  { label: "Recommendation Report", icon: FileText, description: "End User Support Lead reviews insights and approves tool rationalization actions.", output: "Workspace Analytics Report" },
];

const architecture: AgentArchitecture = {
  connections: [
    { system: "Google Workspace", description: "Docs/Sheets/Slides usage, Gmail activity, Drive storage", direction: "read", protocol: "Workspace API", category: "collaboration" },
    { system: "Microsoft 365", description: "Teams usage, SharePoint activity, OneDrive storage", direction: "read", protocol: "REST API", category: "collaboration" },
    { system: "Slack", description: "Channel activity, message volume, integration usage", direction: "read", protocol: "REST API", category: "collaboration" },
    { system: "BigQuery", description: "Tool usage warehouse, adoption trending, cost-per-user analytics", direction: "bidirectional", protocol: "BigQuery SQL", category: "analytics" },
    { system: "Vertex AI (Gemini)", description: "Usage pattern reasoning, optimization recommendations", direction: "bidirectional", protocol: "gRPC", category: "ai" },
  ],
  pipeline: [
    { label: "Multi-Platform Collection", description: "Collect usage metrics from Google Workspace, Microsoft 365, Slack, and Zoom. Aggregate at user, team, and department levels. Calculate active usage vs. license allocation.", systems: ["Google Workspace", "Microsoft 365", "Slack"], layer: "integration", dataIn: "Platform usage APIs", dataOut: "Unified usage dataset by user × tool" },
    { label: "Adoption & Utilization Analysis", description: "Calculate tool adoption curves, identify declining vs. growing tools, score license utilization, and detect collaboration pattern shifts. Flag overlapping tools and shadow IT signals.", systems: ["BigQuery"], layer: "ml", dataIn: "Unified usage data + license costs", dataOut: "Adoption metrics + utilization scores + overlap detection" },
    { label: "Insight Synthesis", description: "Gemini synthesizes quantitative metrics into actionable insights: 'Google Docs usage dropped 15% since Notion pilot — formalize the evaluation before it becomes shadow IT. 34% of Zoom licenses unused since the Google Meet migration.'", systems: ["Vertex AI (Gemini)"], layer: "llm", dataIn: "Usage metrics + cost data + trends", dataOut: "Actionable insights with cost optimization recommendations" },
    { label: "Report Delivery", description: "Generate workspace analytics report with tool health scorecards, cost optimization opportunities, and adoption recommendations. Publish to Looker dashboard.", systems: ["BigQuery"], layer: "integration", dataIn: "Approved insights", dataOut: "Published analytics report + dashboard" },
  ],
};


const behaviorContract: AgentBehaviorContract = {
  role: "End User Support Lead agent for the Workspace Analytics Agent workflow",
  primaryObjective: "Gemini aggregates usage metrics across Google Workspace, Microsoft 365, and Slack into a unified view. LLM synthesizes quantitative data into actionable insights — identifying tool overlap and shadow IT signals. so the End User Support Lead can move the License waste identified KPI.",
  inScope: [
    "Gemini aggregates usage metrics across Google Workspace, Microsoft 365, and Slack into a unified view",
    "LLM synthesizes quantitative data into actionable insights — identifying tool overlap and shadow IT signals",
    "Monthly reports drive license optimization, saving $180K+ annually in reclaimed unused licenses",
  ],
  outOfScope: [
    "Production deployments outside an approved change window",
    "Irreversible destructive actions on shared infrastructure (DROP, force-delete, key rotation)",
    "Security incident attribution requiring forensics",
  ],
  toolIntents: [
    {
      name: "query_google_workspace_accounts",
      kind: "query",
      sourceSystemId: "google_workspace",
      description: "Retrieve accounts from Google Workspace for the Workspace Analytics Agent workflow.",
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
      name: "query_microsoft_365_microsoft_365_records",
      kind: "query",
      sourceSystemId: "microsoft_365",
      description: "Retrieve microsoft 365 records from Microsoft 365 for the Workspace Analytics Agent workflow.",
      requiredInputs: [
        "lookup_key",
        "date_range",
      ],
      produces: [
        "microsoft_365_records_records",
        "microsoft_365_records_summary",
      ],
      evidenceEmitted: [
        "source_system_record",
      ],
    },
    {
      name: "query_slack_messages",
      kind: "query",
      sourceSystemId: "slack",
      description: "Retrieve messages from Slack for the Workspace Analytics Agent workflow.",
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
      name: "query_bigquery_analytics_events",
      kind: "query",
      sourceSystemId: "bigquery",
      description: "Retrieve analytics events from BigQuery for the Workspace Analytics Agent workflow.",
      requiredInputs: [
        "lookup_key",
        "date_range",
      ],
      produces: [
        "analytics_events_records",
        "analytics_events_summary",
      ],
      evidenceEmitted: [
        "sql_result",
      ],
    },
    {
      name: "lookup_workspace_analytics_agent_runbook",
      kind: "evidence_lookup",
      sourceSystemId: "bigquery",
      description: "Look up sections of the Workspace Analytics Agent Operations Runbook to cite in narrative output, escalation rationale, and audit evidence.",
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
      claim: "License waste identified moved from Unknown toward $180K/year reclaimed",
      mustCite: [
        "google_workspace.accounts",
        "microsoft_365.microsoft_365_records",
      ],
      sourceSystemIds: [
        "google_workspace",
        "microsoft_365",
      ],
    },
    {
      claim: "Tool overlap detection moved from Ad-hoc complaints toward Automated monthly",
      mustCite: [
        "google_workspace.accounts",
        "microsoft_365.microsoft_365_records",
      ],
      sourceSystemIds: [
        "google_workspace",
        "microsoft_365",
      ],
    },
  ],
  escalationRules: [
    {
      trigger: "License waste identified regresses past the Unknown baseline by more than 20%",
      action: "escalate_to_human",
      handoffTarget: "End User Support Lead",
      rationale: "Significant regressions need human judgment before automated remediation runs against production records.",
    },
    {
      trigger: "Source-system evidence is incomplete or stale (>24h) for any required entity",
      action: "request_more_info",
      rationale: "Recommendations grounded in stale evidence misrepresent current state and undermine audit defensibility.",
    },
  ],
  refusalRules: [
    "Never fabricate metric values; only publish numbers derived from Google Workspace (and other named systems) entities.",
    "Never bypass End User Support Lead approval on escalation triggers, even when confidence is high.",
    "Never expose individual personal data (PII) in summaries; aggregate or pseudonymise before output.",
    "Never act on data older than the staleness threshold defined in the runbook without a fresh re-query.",
  ],
  goldenEvals: [
    {
      id: "workspace-analytics-agent-end-to-end",
      prompt: "Run the Workspace Analytics Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.",
      expectedToolCalls: [
        "query_google_workspace_accounts",
        "query_microsoft_365_microsoft_365_records",
        "query_slack_messages",
        "query_bigquery_analytics_events",
        "lookup_workspace_analytics_agent_runbook",
      ],
      mustReferenceEntities: [
        "accounts",
        "microsoft_365_records",
        "messages",
        "analytics_events",
      ],
      mustCiteDocuments: [
        "workspace-analytics-agent-runbook",
      ],
      expectedActionOutcome: "End User Support Lead receives a fully-cited recommendation; no external state change without explicit approval.",
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
    rationale: "Row counts sized for Workspace Analytics Agent so the agent can demonstrate the workflow against realistic transactional volume without simulating a production warehouse.",
  },
  sourceSystems: [
    {
      id: "google_workspace",
      name: "Google Workspace",
      owns: [
        "accounts",
        "group_memberships",
        "license_assignments",
      ],
      protocol: "Workspace API",
      localBacking: [
        "alloydb",
      ],
      toolNames: [
        "query_google_workspace_accounts",
        "query_google_workspace_group_memberships",
        "query_google_workspace_license_assignments",
      ],
      evidence: [
        "source_system_record",
        "generated_audit_trail",
      ],
    },
    {
      id: "microsoft_365",
      name: "Microsoft 365",
      owns: [
        "microsoft_365_records",
        "microsoft_365_events",
        "microsoft_365_audit_trail",
      ],
      protocol: "Graph API",
      localBacking: [
        "alloydb",
      ],
      toolNames: [
        "query_microsoft_365_microsoft_365_records",
        "query_microsoft_365_microsoft_365_events",
        "query_microsoft_365_microsoft_365_audit_trail",
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
      id: "bigquery",
      name: "BigQuery",
      owns: [
        "analytics_events",
        "historical_metrics",
        "cached_aggregates",
      ],
      protocol: "BigQuery SQL",
      localBacking: [
        "bigquery",
      ],
      toolNames: [
        "query_bigquery_analytics_events",
        "query_bigquery_historical_metrics",
        "query_bigquery_cached_aggregates",
      ],
      evidence: [
        "source_system_record",
        "generated_audit_trail",
      ],
    },
  ],
  entities: [
    {
      name: "accounts",
      sourceSystemId: "google_workspace",
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
      name: "group_memberships",
      sourceSystemId: "google_workspace",
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
      name: "license_assignments",
      sourceSystemId: "google_workspace",
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
      name: "microsoft_365_records",
      sourceSystemId: "microsoft_365",
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
      name: "microsoft_365_events",
      sourceSystemId: "microsoft_365",
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
          name: "microsoft_365_record_id",
          type: "ref",
          ref: "microsoft_365_records.id",
          required: true,
        },
      ],
    },
    {
      name: "microsoft_365_audit_trail",
      sourceSystemId: "microsoft_365",
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
      name: "analytics_events",
      sourceSystemId: "bigquery",
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
        {
          name: "historical_metric_id",
          type: "ref",
          ref: "historical_metrics.id",
          required: true,
        },
      ],
    },
    {
      name: "historical_metrics",
      sourceSystemId: "bigquery",
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
      name: "cached_aggregates",
      sourceSystemId: "bigquery",
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
  ],
  relationships: [
    {
      from: "microsoft_365_events.microsoft_365_record_id",
      to: "microsoft_365_records.id",
      cardinality: "many-to-one",
      orphanPolicy: "none",
    },
    {
      from: "analytics_events.historical_metric_id",
      to: "historical_metrics.id",
      cardinality: "many-to-one",
      orphanPolicy: "none",
    },
  ],
  documents: [
    {
      id: "workspace-analytics-agent-runbook",
      sourceSystemId: "bigquery",
      type: "runbook",
      title: "Workspace Analytics Agent Operations Runbook",
      requiredSections: [
        "Detection signals",
        "Triage procedures",
        "Remediation actions",
        "Rollback criteria",
        "Post-incident review",
      ],
      linkedEntities: [
        "accounts",
        "group_memberships",
        "license_assignments",
      ],
      minimumWordCount: 500,
      citationAnchors: [
        "detection",
        "triage",
        "remediation",
        "rollback",
      ],
    },
  ],
  apis: [],
  anomalies: [
    {
      id: "workspace-analytics-agent-baseline-gap",
      description: "Seed a realistic gap where License waste identified sits between Unknown and $180K/year reclaimed, so the agent can detect, narrate, and recommend remediation.",
      affectedEntities: [
        "accounts",
        "group_memberships",
      ],
      discoveryPath: [
        "Inspect Google Workspace records for the affected entities",
        "Compare against Microsoft 365 historical baseline",
        "Generate a citation-backed recommendation",
      ],
      expectedEvidence: [
        "source-system record",
        "historical baseline metric",
        "generated audit trail",
      ],
      expectedRecommendation: "Explain the gap, cite supporting evidence, and propose the next End User Support Lead action.",
    },
  ],
  datastorePackaging: {
    alloydb: {
      database: "workspace_analytics_agent",
      schemas: [
        "google_workspace",
        "microsoft_365",
        "slack",
      ],
    },
    bigquery: {
      dataset: "it_workspace_analytics_agent",
      tables: [
        "kpi_summary",
        "evidence_index",
      ],
    },
    cloudStorage: {
      bucketSuffix: "workspace-analytics-agent-evidence",
      prefixes: [
        "documents",
        "audit-trails",
        "exports",
      ],
    },
    apis: {
      serviceName: "workspace-analytics-agent-source-adapters",
      deploymentTarget: "cloud_run",
    },
  },
  validation: {
    smokePrompt: "Run the Workspace Analytics Agent workflow and cite source-system evidence for every claim.",
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

export const WorkspaceAnalyticsAgent = () => (
  <UseCaseSlide
    title="Workspace Analytics Agent"
    subtitle="A-4603 • End User Computing"
    icon={BarChart3}
    domainId="domain-46"
    layer="Layer 4: Data Agent"
    persona="End User Support Lead"
    systems={["Google Workspace", "Microsoft 365", "Slack", "BigQuery", "Vertex AI"]}
    kpis={[
      { label: "License waste identified", before: "Unknown", after: "$180K/year reclaimed" },
      { label: "Tool overlap detection", before: "Ad-hoc complaints", after: "Automated monthly" },
      { label: "Shadow IT visibility", before: "Discovered post-incident", after: "Proactive detection" },
    ]}
    triggerType="scheduled"
    swimlane={swimlane}
    flow={flow}
    architecture={architecture}
    statusQuo={[
      "No unified view of productivity tool usage across platforms — each tool reports separately.",
      "Unused licenses waste budget because no one tracks who stopped using which tool.",
      "Shadow IT emerges when teams adopt unapproved tools — discovered only after data has been shared."
    ]}
    agentification={[
      "Gemini aggregates usage metrics across Google Workspace, Microsoft 365, and Slack into a unified view.",
      "LLM synthesizes quantitative data into actionable insights — identifying tool overlap and shadow IT signals.",
      "Monthly reports drive license optimization, saving $180K+ annually in reclaimed unused licenses."
    ]}
  />
);
