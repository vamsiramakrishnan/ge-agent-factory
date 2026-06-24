import React from "react";
import { UseCaseSlide } from "../../../agent/UseCaseSlide";
import { FlowStep } from "../../../agent/ProcessFlow";
import { SwimlaneFlow } from "../../../agent/SwimlaneFlow";
import { AgentArchitecture, UseCaseGenerationSpec, AgentBehaviorContract} from "../../../../types/architecture";
import { MessageSquare, Database, Brain, AlertTriangle, FileText } from "lucide-react";

const swimlane: SwimlaneFlow = {
  nodes: [
    { id: "s1", label: "Daily Scan", lane: "system", type: "trigger" },
    { id: "a1", label: "Review Collection", lane: "agent", type: "action" },
    { id: "a2", label: "Intelligence Extract", lane: "agent", type: "action" },
    { id: "a3", label: "Insights Report", lane: "agent", type: "output" },
    { id: "h1", label: "PMM Reviews Negative", lane: "human", type: "hitl" },
  ],
  connections: [["s1", "a1"], ["a1", "a2"], ["a2", "a3"], ["a3", "h1"]],
};

const flow: FlowStep[] = [
  { label: "Review Ingest", icon: Database, description: "Customer reviews scraped and ingested from G2, Trustpilot, Gartner Peer Insights, and app stores.", trigger: "Daily", systems: ["G2", "Trustpilot"] },
  { label: "Topic Extraction", icon: Brain, description: "Product intelligence extracted — feature requests, pain points, and competitive mentions.", systems: ["Vertex AI", "BigQuery"], integration: "ADK" },
  { label: "Negative Alert", icon: AlertTriangle, description: "Negative reviews flagged with response recommendations and product team routing.", systems: ["Vertex AI"] },
  { label: "Intelligence Report", icon: FileText, description: "PMM reviews negative feedback patterns and coordinates response and product actions.", output: "Customer Voice Report" },
];

const architecture: AgentArchitecture = {
  connections: [
    { system: "G2", description: "User reviews, product comparisons, satisfaction scores, feature ratings", direction: "read", protocol: "REST API", category: "market-data" },
    { system: "Trustpilot", description: "Customer reviews, rating trends, response management", direction: "bidirectional", protocol: "REST API", category: "market-data" },
    { system: "Gartner Peer Insights", description: "Enterprise user reviews, deployment insights, alternatives considered", direction: "read", protocol: "REST API", category: "market-data" },
    { system: "Vertex AI (Gemini)", description: "Review analysis, product intelligence extraction, response drafting", direction: "bidirectional", protocol: "gRPC", category: "ai" },
    { system: "BigQuery", description: "Review analytics, topic trends, sentiment time series, competitive comparison", direction: "bidirectional", protocol: "BigQuery SQL", category: "analytics" },
    { system: "Slack", description: "Negative review alerts, product feedback routing, response coordination", direction: "write", protocol: "Webhook", category: "collaboration" },
  ],
  pipeline: [
    { label: "Review Collection", description: "Ingest reviews daily from G2, Trustpilot, Gartner Peer Insights, and app stores. Deduplicate cross-posted reviews and normalize rating scales.", systems: ["G2", "Trustpilot", "Gartner Peer Insights"], layer: "integration", dataIn: "Raw reviews across platforms", dataOut: "Normalized review corpus" },
    { label: "Sentiment & Topic Analysis", description: "Score review sentiment, extract topic clusters, detect rating trend changes, and compare against competitor review profiles.", systems: ["BigQuery ML"], layer: "ml", dataIn: "Normalized reviews", dataOut: "Scored reviews with topic clusters" },
    { label: "Product Intelligence", description: "Gemini reads reviews to extract product intelligence beyond sentiment — specific feature gaps, integration pain points, and competitive displacement signals. Identifies patterns like 'three enterprise reviews this month mention reporting limitations.'", systems: ["Vertex AI (Gemini)"], layer: "llm", dataIn: "Scored reviews + product roadmap context", dataOut: "Product intelligence brief with feature gap analysis" },
    { label: "Response & Routing", description: "Draft review responses for negative reviews. Route product intelligence to engineering roadmap. Alert PMM on competitive displacement patterns. Track response impact on review ratings.", systems: ["Slack", "Trustpilot"], layer: "integration", dataIn: "Intelligence brief + response drafts", dataOut: "Published responses + product feedback" },
  ],
};


const behaviorContract: AgentBehaviorContract = {
  role: "Product Marketing Mgr agent for the Customer Voice & Review Monitor workflow",
  primaryObjective: "Gemini extracts product intelligence from reviews — feature gaps, integration pain points, competitive signals. LLM detects patterns across reviews that individual reading misses — 'three enterprises mention same gap.' so the Product Marketing Mgr can move the Review coverage KPI.",
  inScope: [
    "Gemini extracts product intelligence from reviews — feature gaps, integration pain points, competitive signals",
    "LLM detects patterns across reviews that individual reading misses — 'three enterprises mention same gap.'",
    "Drafts empathetic review responses that acknowledge feedback and reference upcoming improvements",
  ],
  outOfScope: [
    "Final approval of paid spend reallocations above the governance threshold",
    "Trademark, legal, or regulated-industry claim approval",
    "Crisis communications without comms-team sign-off",
  ],
  toolIntents: [
    {
      name: "query_g2_g2_records",
      kind: "query",
      sourceSystemId: "g2",
      description: "Retrieve g2 records from G2 for the Customer Voice & Review Monitor workflow.",
      requiredInputs: [
        "lookup_key",
        "date_range",
      ],
      produces: [
        "g2_records_records",
        "g2_records_summary",
      ],
      evidenceEmitted: [
        "source_system_record",
      ],
    },
    {
      name: "query_trustpilot_trustpilot_records",
      kind: "query",
      sourceSystemId: "trustpilot",
      description: "Retrieve trustpilot records from Trustpilot for the Customer Voice & Review Monitor workflow.",
      requiredInputs: [
        "lookup_key",
        "date_range",
      ],
      produces: [
        "trustpilot_records_records",
        "trustpilot_records_summary",
      ],
      evidenceEmitted: [
        "source_system_record",
      ],
    },
    {
      name: "query_gartner_peer_insights_gartner_peer_insights_records",
      kind: "query",
      sourceSystemId: "gartner_peer_insights",
      description: "Retrieve gartner peer insights records from Gartner Peer Insights for the Customer Voice & Review Monitor workflow.",
      requiredInputs: [
        "lookup_key",
        "date_range",
      ],
      produces: [
        "gartner_peer_insights_records_records",
        "gartner_peer_insights_records_summary",
      ],
      evidenceEmitted: [
        "source_system_record",
      ],
    },
    {
      name: "query_bigquery_analytics_events",
      kind: "query",
      sourceSystemId: "bigquery",
      description: "Retrieve analytics events from BigQuery for the Customer Voice & Review Monitor workflow.",
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
      name: "lookup_customer_voice_review_monitor_playbook",
      kind: "evidence_lookup",
      sourceSystemId: "bigquery",
      description: "Look up sections of the Customer Voice & Review Monitor Playbook to cite in narrative output, escalation rationale, and audit evidence.",
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
      name: "action_g2_draft",
      kind: "action",
      sourceSystemId: "g2",
      description: "Execute the draft step in G2 after the agent has gathered evidence and validated escalation gates.",
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
      claim: "Review coverage moved from Spot-checked weekly toward 100% daily analysis",
      mustCite: [
        "g2.g2_records",
        "trustpilot.trustpilot_records",
      ],
      sourceSystemIds: [
        "g2",
        "trustpilot",
      ],
    },
    {
      claim: "Negative review response moved from 3-5 day lag toward Same-day draft",
      mustCite: [
        "g2.g2_records",
        "trustpilot.trustpilot_records",
      ],
      sourceSystemIds: [
        "g2",
        "trustpilot",
      ],
    },
  ],
  escalationRules: [
    {
      trigger: "Review coverage regresses past the Spot-checked weekly baseline by more than 20%",
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
      trigger: "Proposed draft action lacks supporting evidence from at least two systems",
      action: "refuse",
      rationale: "Single-system evidence is insufficient to authorize external state changes without manual review.",
    },
  ],
  refusalRules: [
    "Never fabricate metric values; only publish numbers derived from G2 (and other named systems) entities.",
    "Never bypass Product Marketing Mgr approval on escalation triggers, even when confidence is high.",
    "Never expose individual personal data (PII) in summaries; aggregate or pseudonymise before output.",
    "Never act on data older than the staleness threshold defined in the runbook without a fresh re-query.",
  ],
  goldenEvals: [
    {
      id: "customer-voice-review-monitor-end-to-end",
      prompt: "Run the Customer Voice & Review Monitor workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.",
      expectedToolCalls: [
        "query_g2_g2_records",
        "query_trustpilot_trustpilot_records",
        "query_gartner_peer_insights_gartner_peer_insights_records",
        "query_bigquery_analytics_events",
        "lookup_customer_voice_review_monitor_playbook",
        "action_g2_draft",
      ],
      mustReferenceEntities: [
        "g2_records",
        "trustpilot_records",
        "gartner_peer_insights_records",
        "analytics_events",
      ],
      mustCiteDocuments: [
        "customer-voice-review-monitor-playbook",
      ],
      expectedActionOutcome: "Action draft executed against G2, with audit-trail entry and Product Marketing Mgr notified of outcomes.",
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
    rationale: "Row counts sized for Customer Voice & Review Monitor so the agent can demonstrate the workflow against realistic transactional volume without simulating a production warehouse.",
  },
  sourceSystems: [
    {
      id: "g2",
      name: "G2",
      owns: [
        "g2_records",
        "g2_events",
        "g2_audit_trail",
      ],
      protocol: "REST API",
      localBacking: [
        "alloydb",
      ],
      toolNames: [
        "query_g2_g2_records",
        "query_g2_g2_events",
        "query_g2_g2_audit_trail",
      ],
      evidence: [
        "source_system_record",
        "generated_audit_trail",
      ],
    },
    {
      id: "trustpilot",
      name: "Trustpilot",
      owns: [
        "trustpilot_records",
        "trustpilot_events",
        "trustpilot_audit_trail",
      ],
      protocol: "REST API",
      localBacking: [
        "alloydb",
      ],
      toolNames: [
        "query_trustpilot_trustpilot_records",
        "query_trustpilot_trustpilot_events",
        "query_trustpilot_trustpilot_audit_trail",
      ],
      evidence: [
        "source_system_record",
        "generated_audit_trail",
      ],
    },
    {
      id: "gartner_peer_insights",
      name: "Gartner Peer Insights",
      owns: [
        "gartner_peer_insights_records",
        "gartner_peer_insights_events",
        "gartner_peer_insights_audit_trail",
      ],
      protocol: "REST API",
      localBacking: [
        "alloydb",
      ],
      toolNames: [
        "query_gartner_peer_insights_gartner_peer_insights_records",
        "query_gartner_peer_insights_gartner_peer_insights_events",
        "query_gartner_peer_insights_gartner_peer_insights_audit_trail",
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
      name: "g2_records",
      sourceSystemId: "g2",
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
      name: "g2_events",
      sourceSystemId: "g2",
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
          name: "g2_record_id",
          type: "ref",
          ref: "g2_records.id",
          required: true,
        },
      ],
    },
    {
      name: "g2_audit_trail",
      sourceSystemId: "g2",
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
      name: "trustpilot_records",
      sourceSystemId: "trustpilot",
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
      name: "trustpilot_events",
      sourceSystemId: "trustpilot",
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
          name: "trustpilot_record_id",
          type: "ref",
          ref: "trustpilot_records.id",
          required: true,
        },
      ],
    },
    {
      name: "trustpilot_audit_trail",
      sourceSystemId: "trustpilot",
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
      name: "gartner_peer_insights_records",
      sourceSystemId: "gartner_peer_insights",
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
      name: "gartner_peer_insights_events",
      sourceSystemId: "gartner_peer_insights",
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
          name: "gartner_peer_insights_record_id",
          type: "ref",
          ref: "gartner_peer_insights_records.id",
          required: true,
        },
      ],
    },
    {
      name: "gartner_peer_insights_audit_trail",
      sourceSystemId: "gartner_peer_insights",
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
      from: "g2_events.g2_record_id",
      to: "g2_records.id",
      cardinality: "many-to-one",
      orphanPolicy: "none",
    },
    {
      from: "trustpilot_events.trustpilot_record_id",
      to: "trustpilot_records.id",
      cardinality: "many-to-one",
      orphanPolicy: "none",
    },
    {
      from: "gartner_peer_insights_events.gartner_peer_insights_record_id",
      to: "gartner_peer_insights_records.id",
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
      id: "customer-voice-review-monitor-playbook",
      sourceSystemId: "bigquery",
      type: "playbook",
      title: "Customer Voice & Review Monitor Playbook",
      requiredSections: [
        "Audience guidelines",
        "Brand voice rules",
        "Channel-specific guardrails",
        "Measurement framework",
        "Approval thresholds",
      ],
      linkedEntities: [
        "g2_records",
        "g2_events",
        "g2_audit_trail",
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
      id: "g2_draft_api",
      sourceSystemId: "g2",
      method: "POST",
      path: "/api/g2/draft",
      description: "Synchronous endpoint the agent calls to draft in G2 after evidence gating.",
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
      id: "customer-voice-review-monitor-baseline-gap",
      description: "Seed a realistic gap where Review coverage sits between Spot-checked weekly and 100% daily analysis, so the agent can detect, narrate, and recommend remediation.",
      affectedEntities: [
        "g2_records",
        "g2_events",
      ],
      discoveryPath: [
        "Inspect G2 records for the affected entities",
        "Compare against Trustpilot historical baseline",
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
      database: "customer_voice_review_monitor",
      schemas: [
        "g2",
        "trustpilot",
        "gartner_peer_insights",
      ],
    },
    bigquery: {
      dataset: "marketing_customer_voice_review_monitor",
      tables: [
        "kpi_summary",
        "evidence_index",
      ],
    },
    cloudStorage: {
      bucketSuffix: "customer-voice-review-monitor-evidence",
      prefixes: [
        "documents",
        "audit-trails",
        "exports",
      ],
    },
    apis: {
      serviceName: "customer-voice-review-monitor-source-adapters",
      deploymentTarget: "cloud_run",
    },
  },
  validation: {
    smokePrompt: "Run the Customer Voice & Review Monitor workflow and cite source-system evidence for every claim.",
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

export const CustomerVoiceMonitor = () => (
  <UseCaseSlide
    title="Customer Voice & Review Monitor"
    subtitle="A-3703 • Customer & Market Intelligence"
    icon={MessageSquare}
    domainId="domain-37"
    layer="Layer 3: Custom ADK"
    persona="Product Marketing Mgr"
    systems={["G2", "Trustpilot", "Gartner Peer Insights", "BigQuery", "Vertex AI"]}
    kpis={[
      { label: "Review coverage", before: "Spot-checked weekly", after: "100% daily analysis" },
      { label: "Negative review response", before: "3-5 day lag", after: "Same-day draft" },
      { label: "Product feedback loop", before: "Quarterly batch", after: "Real-time routing" },
    ]}
    triggerType="scheduled"
    swimlane={swimlane}
    flow={flow}
    architecture={architecture}
    hitl={{ actor: "Product Marketing Mgr", action: "Review negative feedback", description: "PMM reviews negative review patterns, approves response drafts, and coordinates product team actions for feature gaps." }}
    statusQuo={[
      "Customer reviews checked sporadically — negative reviews go unresponded for days.",
      "Product intelligence buried in review text never reaches engineering roadmap.",
      "Competitive displacement signals invisible until quarterly win/loss review."
    ]}
    agentification={[
      "Gemini extracts product intelligence from reviews — feature gaps, integration pain points, competitive signals.",
      "LLM detects patterns across reviews that individual reading misses — 'three enterprises mention same gap.'",
      "Drafts empathetic review responses that acknowledge feedback and reference upcoming improvements."
    ]}
  />
);
