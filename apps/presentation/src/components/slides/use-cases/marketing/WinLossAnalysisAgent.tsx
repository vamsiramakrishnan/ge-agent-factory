import React from "react";
import { UseCaseSlide } from "../../../agent/UseCaseSlide";
import { FlowStep } from "../../../agent/ProcessFlow";
import { SwimlaneFlow } from "../../../agent/SwimlaneFlow";
import { AgentArchitecture, UseCaseGenerationSpec, AgentBehaviorContract} from "../../../../types/architecture";
import { Scale, Zap, Headphones, Brain, FileText } from "lucide-react";

const swimlane: SwimlaneFlow = {
  nodes: [
    { id: "s1", label: "Deal Closed", lane: "system", type: "trigger" },
    { id: "a1", label: "Data Collection", lane: "agent", type: "action" },
    { id: "a2", label: "Transcript Analysis", lane: "agent", type: "action" },
    { id: "a3", label: "Win/Loss Report", lane: "agent", type: "output" },
    { id: "h1", label: "PMM Review", lane: "human", type: "hitl" },
  ],
  connections: [["s1", "a1"], ["a1", "a2"], ["a2", "a3"], ["a3", "h1"]],
};

const flow: FlowStep[] = [
  { label: "Deal Trigger", icon: Zap, description: "Deal closed won or lost triggers win/loss analysis workflow.", trigger: "Event", systems: ["Salesforce CRM"] },
  { label: "Evidence Collection", icon: Headphones, description: "CRM data, Gong call recordings, and buyer survey responses aggregated.", systems: ["Gong", "Salesforce CRM"], integration: "ADK" },
  { label: "Transcript Analysis", icon: Brain, description: "Call transcripts analyzed to surface real reasons — not CRM dropdown selections.", systems: ["Vertex AI"] },
  { label: "Pattern Report", icon: FileText, description: "Win/loss patterns with competitive insights and product feedback surfaced.", output: "Win/Loss Intelligence" },
];

const architecture: AgentArchitecture = {
  connections: [
    { system: "Salesforce CRM", description: "Opportunity data, deal stage history, competitor mentions, loss reason codes", direction: "read", protocol: "REST API", category: "erp" },
    { system: "Gong", description: "Call recordings, transcripts, conversation analytics, buyer sentiment", direction: "read", protocol: "REST API", category: "analytics" },
    { system: "Google Workspace", description: "Win/loss survey templates, analysis reports, stakeholder briefs", direction: "bidirectional", protocol: "Workspace API", category: "collaboration" },
    { system: "Vertex AI (Gemini)", description: "Transcript analysis, pattern detection, insight synthesis", direction: "bidirectional", protocol: "gRPC", category: "ai" },
    { system: "BigQuery", description: "Win rate trends, competitive analysis, loss pattern aggregation", direction: "bidirectional", protocol: "BigQuery SQL", category: "analytics" },
    { system: "Slack", description: "Win/loss alerts, competitive intelligence notifications", direction: "write", protocol: "Webhook", category: "collaboration" },
  ],
  pipeline: [
    { label: "Evidence Aggregation", description: "On deal close, pull opportunity data from Salesforce, retrieve Gong call recordings and transcripts, and trigger buyer win/loss survey. Aggregate all evidence for analysis.", systems: ["Salesforce CRM", "Gong"], layer: "integration", dataIn: "Deal close event + opportunity ID", dataOut: "Complete deal evidence package" },
    { label: "Quantitative Patterns", description: "Calculate win rates by segment, competitor, deal size, and sales cycle length. Detect statistically significant patterns in competitive outcomes and pricing sensitivity.", systems: ["BigQuery ML"], layer: "ml", dataIn: "Deal data + historical outcomes", dataOut: "Win/loss metrics with trend analysis" },
    { label: "Transcript Intelligence", description: "Gemini analyzes Gong call transcripts to identify the real reasons for wins and losses — not CRM dropdown selections. Correlates verbal buyer feedback with quantitative patterns to surface product gaps vs. pricing vs. competitive positioning issues.", systems: ["Vertex AI (Gemini)"], layer: "llm", dataIn: "Call transcripts + CRM loss reasons + survey responses", dataOut: "True win/loss reasons with evidence" },
    { label: "Insight Distribution", description: "Generate win/loss intelligence reports for Product Marketing, Sales Leadership, and Product teams. Route competitive insights to battle card updates. Feed product gaps to roadmap planning.", systems: ["Google Workspace", "Slack"], layer: "integration", dataIn: "Analyzed win/loss patterns", dataOut: "Stakeholder-specific intelligence reports" },
  ],
};


const behaviorContract: AgentBehaviorContract = {
  role: "Product Marketing Mgr agent for the Win/Loss Analysis Agent workflow",
  primaryObjective: "Gemini analyzes Gong transcripts to surface real loss reasons — product gaps hidden behind 'lost on price' dropdown. LLM detects patterns across deals that individual analysis misses — 4 of last 7 enterprise losses share same gap. so the Product Marketing Mgr can move the Analysis per deal KPI.",
  inScope: [
    "Gemini analyzes Gong transcripts to surface real loss reasons — product gaps hidden behind 'lost on price' dropdown",
    "LLM detects patterns across deals that individual analysis misses — 4 of last 7 enterprise losses share same gap",
    "Routes competitive insights to battle card updates and product feedback to roadmap planning automatically",
  ],
  outOfScope: [
    "Final approval of paid spend reallocations above the governance threshold",
    "Trademark, legal, or regulated-industry claim approval",
    "Crisis communications without comms-team sign-off",
  ],
  toolIntents: [
    {
      name: "query_salesforce_crm_accounts",
      kind: "query",
      sourceSystemId: "salesforce_crm",
      description: "Retrieve accounts from Salesforce CRM for the Win/Loss Analysis Agent workflow.",
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
      name: "query_gong_gong_records",
      kind: "query",
      sourceSystemId: "gong",
      description: "Retrieve gong records from Gong for the Win/Loss Analysis Agent workflow.",
      requiredInputs: [
        "lookup_key",
        "date_range",
      ],
      produces: [
        "gong_records_records",
        "gong_records_summary",
      ],
      evidenceEmitted: [
        "source_system_record",
      ],
    },
    {
      name: "query_google_workspace_accounts",
      kind: "query",
      sourceSystemId: "google_workspace",
      description: "Retrieve accounts from Google Workspace for the Win/Loss Analysis Agent workflow.",
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
      name: "query_bigquery_analytics_events",
      kind: "query",
      sourceSystemId: "bigquery",
      description: "Retrieve analytics events from BigQuery for the Win/Loss Analysis Agent workflow.",
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
      name: "lookup_win_loss_analysis_agent_playbook",
      kind: "evidence_lookup",
      sourceSystemId: "bigquery",
      description: "Look up sections of the Win/Loss Analysis Agent Playbook to cite in narrative output, escalation rationale, and audit evidence.",
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
      name: "action_salesforce_crm_route",
      kind: "action",
      sourceSystemId: "salesforce_crm",
      description: "Execute the route step in Salesforce CRM after the agent has gathered evidence and validated escalation gates.",
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
      claim: "Analysis per deal moved from 10% of deals analyzed toward 100% auto-analyzed",
      mustCite: [
        "salesforce_crm.accounts",
        "gong.gong_records",
      ],
      sourceSystemIds: [
        "salesforce_crm",
        "gong",
      ],
    },
    {
      claim: "True loss reason accuracy moved from CRM dropdowns unreliable toward Transcript-verified",
      mustCite: [
        "salesforce_crm.accounts",
        "gong.gong_records",
      ],
      sourceSystemIds: [
        "salesforce_crm",
        "gong",
      ],
    },
  ],
  escalationRules: [
    {
      trigger: "Analysis per deal regresses past the 10% of deals analyzed baseline by more than 20%",
      action: "escalate_to_human",
      handoffTarget: "Product Marketing Mgr",
      rationale: "Significant regressions need human judgment before automated remediation runs against production records.",
    },
    {
      trigger: "Source-system evidence is incomplete or stale (>24h) for any required entity",
      action: "request_more_info",
      rationale: "Recommendations grounded in stale evidence misrepresent current state and undermine audit defensibility.",
    },
    {
      trigger: "Proposed route action lacks supporting evidence from at least two systems",
      action: "refuse",
      rationale: "Single-system evidence is insufficient to authorize external state changes without manual review.",
    },
  ],
  refusalRules: [
    "Never fabricate metric values; only publish numbers derived from Salesforce CRM (and other named systems) entities.",
    "Never bypass Product Marketing Mgr approval on escalation triggers, even when confidence is high.",
    "Never expose individual personal data (PII) in summaries; aggregate or pseudonymise before output.",
    "Never act on data older than the staleness threshold defined in the runbook without a fresh re-query.",
  ],
  goldenEvals: [
    {
      id: "win-loss-analysis-agent-end-to-end",
      prompt: "Run the Win/Loss Analysis Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.",
      expectedToolCalls: [
        "query_salesforce_crm_accounts",
        "query_gong_gong_records",
        "query_google_workspace_accounts",
        "query_bigquery_analytics_events",
        "lookup_win_loss_analysis_agent_playbook",
        "action_salesforce_crm_route",
      ],
      mustReferenceEntities: [
        "accounts",
        "gong_records",
        "accounts",
        "analytics_events",
      ],
      mustCiteDocuments: [
        "win-loss-analysis-agent-playbook",
      ],
      expectedActionOutcome: "Action route executed against Salesforce CRM, with audit-trail entry and Product Marketing Mgr notified of outcomes.",
      forbiddenBehaviors: [
        "do not invent KPI numbers",
        "do not skip the evidence_lookup step before any recommendation",
        "do not execute route without two-system evidence",
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
    rationale: "Row counts sized for Win/Loss Analysis Agent so the agent can demonstrate the workflow against realistic transactional volume without simulating a production warehouse.",
  },
  sourceSystems: [
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
      id: "gong",
      name: "Gong",
      owns: [
        "gong_records",
        "gong_events",
        "gong_audit_trail",
      ],
      protocol: "REST API",
      localBacking: [
        "alloydb",
      ],
      toolNames: [
        "query_gong_gong_records",
        "query_gong_gong_events",
        "query_gong_gong_audit_trail",
      ],
      evidence: [
        "source_system_record",
        "generated_audit_trail",
      ],
    },
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
      name: "gong_records",
      sourceSystemId: "gong",
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
      name: "gong_events",
      sourceSystemId: "gong",
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
          name: "gong_record_id",
          type: "ref",
          ref: "gong_records.id",
          required: true,
        },
      ],
    },
    {
      name: "gong_audit_trail",
      sourceSystemId: "gong",
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
      from: "gong_events.gong_record_id",
      to: "gong_records.id",
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
      id: "win-loss-analysis-agent-playbook",
      sourceSystemId: "bigquery",
      type: "playbook",
      title: "Win/Loss Analysis Agent Playbook",
      requiredSections: [
        "Audience guidelines",
        "Brand voice rules",
        "Channel-specific guardrails",
        "Measurement framework",
        "Approval thresholds",
      ],
      linkedEntities: [
        "accounts",
        "opportunities",
        "campaign_influence",
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
      id: "salesforce_crm_route_api",
      sourceSystemId: "salesforce_crm",
      method: "POST",
      path: "/api/salesforce_crm/route",
      description: "Synchronous endpoint the agent calls to route in Salesforce CRM after evidence gating.",
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
      id: "win-loss-analysis-agent-baseline-gap",
      description: "Seed a realistic gap where Analysis per deal sits between 10% of deals analyzed and 100% auto-analyzed, so the agent can detect, narrate, and recommend remediation.",
      affectedEntities: [
        "accounts",
        "opportunities",
      ],
      discoveryPath: [
        "Inspect Salesforce CRM records for the affected entities",
        "Compare against Gong historical baseline",
        "Generate a citation-backed recommendation",
      ],
      expectedEvidence: [
        "source-system record",
        "historical baseline metric",
        "generated audit trail",
      ],
      expectedRecommendation: "Explain the gap, cite supporting evidence, and propose the next Product Marketing Mgr action.",
    },
  ],
  datastorePackaging: {
    alloydb: {
      database: "win_loss_analysis_agent",
      schemas: [
        "salesforce_crm",
        "gong",
        "google_workspace",
      ],
    },
    bigquery: {
      dataset: "marketing_win_loss_analysis_agent",
      tables: [
        "kpi_summary",
        "evidence_index",
      ],
    },
    cloudStorage: {
      bucketSuffix: "win-loss-analysis-agent-evidence",
      prefixes: [
        "documents",
        "audit-trails",
        "exports",
      ],
    },
    apis: {
      serviceName: "win-loss-analysis-agent-source-adapters",
      deploymentTarget: "cloud_run",
    },
  },
  validation: {
    smokePrompt: "Run the Win/Loss Analysis Agent workflow and cite source-system evidence for every claim.",
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

export const WinLossAnalysisAgent = () => (
  <UseCaseSlide
    title="Win/Loss Analysis Agent"
    subtitle="A-3702 • Customer & Market Intelligence"
    icon={Scale}
    domainId="domain-37"
    layer="Layer 3: Custom ADK"
    persona="Product Marketing Mgr"
    systems={["Salesforce CRM", "Gong", "Google Workspace", "Vertex AI", "BigQuery"]}
    kpis={[
      { label: "Analysis per deal", before: "10% of deals analyzed", after: "100% auto-analyzed" },
      { label: "True loss reason accuracy", before: "CRM dropdowns unreliable", after: "Transcript-verified" },
      { label: "Insight-to-action cycle", before: "Quarterly batch review", after: "Real-time per deal" },
    ]}
    triggerType="event"
    swimlane={swimlane}
    flow={flow}
    architecture={architecture}
    statusQuo={[
      "Win/loss analysis conducted on < 10% of deals — only large losses get attention.",
      "CRM loss reason codes unreliable — sales reps select 'lost on price' as default regardless of true reason.",
      "Competitive intelligence fragmented — patterns across deals invisible."
    ]}
    agentification={[
      "Gemini analyzes Gong transcripts to surface real loss reasons — product gaps hidden behind 'lost on price' dropdown.",
      "LLM detects patterns across deals that individual analysis misses — 4 of last 7 enterprise losses share same gap.",
      "Routes competitive insights to battle card updates and product feedback to roadmap planning automatically."
    ]}
  />
);
