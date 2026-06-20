import React from "react";
import { UseCaseSlide } from "../../../agent/UseCaseSlide";
import { FlowStep } from "../../../agent/ProcessFlow";
import { SwimlaneFlow } from "../../../agent/SwimlaneFlow";
import { AgentArchitecture, UseCaseGenerationSpec, AgentBehaviorContract} from "../../../../types/architecture";
import { Users, Database, Layers, FileText, Send } from "lucide-react";

const swimlane: SwimlaneFlow = {
  nodes: [
    { id: "s1", label: "Monthly Refresh", lane: "system", type: "trigger" },
    { id: "a1", label: "Data Aggregation", lane: "agent", type: "action" },
    { id: "a2", label: "Clustering & Scoring", lane: "agent", type: "action" },
    { id: "a3", label: "Segment Narratives", lane: "agent", type: "output" },
  ],
  connections: [["s1", "a1"], ["a1", "a2"], ["a2", "a3"]],
};

const flow: FlowStep[] = [
  { label: "Data Ingest", icon: Database, description: "Contact, account, behavioral, and intent data aggregated from CRM, MAP, and intent platforms.", trigger: "Monthly", systems: ["Salesforce CRM", "HubSpot", "6sense"] },
  { label: "Clustering", icon: Layers, description: "K-means clustering on firmographic and behavioral attributes with propensity scoring and lookalike modeling.", systems: ["BigQuery"], integration: "BigQuery ML" },
  { label: "Narrative Generation", icon: FileText, description: "Gemini synthesizes quantitative segments with qualitative context to create personalized outreach narratives.", systems: ["Vertex AI"] },
  { label: "Segment Push", icon: Send, description: "Enriched segments pushed back to MAP for campaign targeting and personalization.", output: "Audience Segments" },
];

const architecture: AgentArchitecture = {
  connections: [
    { system: "Salesforce CRM", description: "Account firmographics, deal history, contact roles", direction: "read", protocol: "REST API", category: "erp" },
    { system: "HubSpot", description: "Behavioral data, content engagement, email interactions", direction: "bidirectional", protocol: "REST API", category: "erp" },
    { system: "6sense", description: "Intent data, buying stage signals, anonymous visitor matching", direction: "read", protocol: "REST API", category: "market-data" },
    { system: "BigQuery", description: "Unified customer data, clustering models, propensity scores", direction: "bidirectional", protocol: "BigQuery SQL", category: "analytics" },
    { system: "Vertex AI (Gemini)", description: "Qualitative signal interpretation, segment narrative generation", direction: "bidirectional", protocol: "gRPC", category: "ai" },
  ],
  pipeline: [
    { label: "Data Aggregation", description: "Pull contact and account data from CRM, behavioral data from HubSpot, intent data from 6sense. Aggregate in BigQuery with entity resolution across sources.", systems: ["Salesforce CRM", "HubSpot", "6sense", "BigQuery"], layer: "integration", dataIn: "Raw contact, account, behavioral, and intent data", dataOut: "Unified customer profile dataset" },
    { label: "Clustering & Scoring", description: "K-means clustering on firmographic and behavioral attributes. Propensity scoring for conversion likelihood. RFM segmentation and lookalike modeling from best customer profiles.", systems: ["BigQuery ML"], layer: "ml", dataIn: "Unified customer profiles", dataOut: "Quantitative segments with propensity scores" },
    { label: "Qualitative Enrichment", description: "Gemini interprets qualitative signals that scoring models miss \u2014 prospect blog posts signaling evaluation, job postings indicating org changes, LinkedIn activity suggesting buying intent.", systems: ["Vertex AI (Gemini)"], layer: "llm", dataIn: "Quantitative segments + qualitative signals", dataOut: "Enriched segment narratives for personalization" },
    { label: "Segment Distribution", description: "Enriched segments pushed back to HubSpot for campaign targeting. Dynamic segment membership updated for real-time personalization.", systems: ["HubSpot"], layer: "integration", dataIn: "Enriched segments", dataOut: "Activated audience segments in MAP" },
  ],
};


const behaviorContract: AgentBehaviorContract = {
  role: "Demand Gen Manager agent for the Audience Segmentation Engine workflow",
  primaryObjective: "Gemini interprets qualitative signals that scoring models miss \\u2014 prospect blog posts, job postings, and LinkedIn activity signaling buying intent. K-means clustering with propensity scoring creates data-driven micro-segments beyond basic firmographics. so the Demand Gen Manager can move the Segmentation refresh KPI.",
  inScope: [
    "Gemini interprets qualitative signals that scoring models miss \\u2014 prospect blog posts, job postings, and LinkedIn activity signaling buying intent",
    "K-means clustering with propensity scoring creates data-driven micro-segments beyond basic firmographics",
    "Synthesizes quantitative segments with qualitative context to create segment narratives for personalized outreach",
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
      description: "Retrieve accounts from Salesforce CRM for the Audience Segmentation Engine workflow.",
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
      name: "query_hubspot_contacts",
      kind: "query",
      sourceSystemId: "hubspot",
      description: "Retrieve contacts from HubSpot for the Audience Segmentation Engine workflow.",
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
      name: "query_6sense_6sense_records",
      kind: "query",
      sourceSystemId: "6sense",
      description: "Retrieve 6sense records from 6sense for the Audience Segmentation Engine workflow.",
      requiredInputs: [
        "lookup_key",
        "date_range",
      ],
      produces: [
        "6sense_records_records",
        "6sense_records_summary",
      ],
      evidenceEmitted: [
        "source_system_record",
      ],
    },
    {
      name: "query_bigquery_analytics_events",
      kind: "query",
      sourceSystemId: "bigquery",
      description: "Retrieve analytics events from BigQuery for the Audience Segmentation Engine workflow.",
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
      name: "lookup_audience_segmentation_engine_playbook",
      kind: "evidence_lookup",
      sourceSystemId: "bigquery",
      description: "Look up sections of the Audience Segmentation Engine Playbook to cite in narrative output, escalation rationale, and audit evidence.",
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
      name: "action_salesforce_crm_create",
      kind: "action",
      sourceSystemId: "salesforce_crm",
      description: "Execute the create step in Salesforce CRM after the agent has gathered evidence and validated escalation gates.",
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
      claim: "Segmentation refresh moved from Quarterly manual toward Monthly automated",
      mustCite: [
        "salesforce_crm.accounts",
        "hubspot.contacts",
      ],
      sourceSystemIds: [
        "salesforce_crm",
        "hubspot",
      ],
    },
    {
      claim: "Segment personalization depth moved from Firmographic only toward Behavioral + intent + qualitative",
      mustCite: [
        "salesforce_crm.accounts",
        "hubspot.contacts",
      ],
      sourceSystemIds: [
        "salesforce_crm",
        "hubspot",
      ],
    },
  ],
  escalationRules: [
    {
      trigger: "Segmentation refresh regresses past the Quarterly manual baseline by more than 20%",
      action: "escalate_to_human",
      handoffTarget: "Demand Gen Manager",
      rationale: "Significant regressions need human judgment before automated remediation runs against production records.",
    },
    {
      trigger: "Source-system evidence is incomplete or stale (>24h) for any required entity",
      action: "request_more_info",
      rationale: "Recommendations grounded in stale evidence misrepresent current state and undermine audit defensibility.",
    },
    {
      trigger: "Proposed create action lacks supporting evidence from at least two systems",
      action: "refuse",
      rationale: "Single-system evidence is insufficient to authorize external state changes without manual review.",
    },
  ],
  refusalRules: [
    "Never fabricate metric values; only publish numbers derived from Salesforce CRM (and other named systems) entities.",
    "Never bypass Demand Gen Manager approval on escalation triggers, even when confidence is high.",
    "Never expose individual personal data (PII) in summaries; aggregate or pseudonymise before output.",
    "Never act on data older than the staleness threshold defined in the runbook without a fresh re-query.",
  ],
  goldenEvals: [
    {
      id: "audience-segmentation-engine-end-to-end",
      prompt: "Run the Audience Segmentation Engine workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.",
      expectedToolCalls: [
        "query_salesforce_crm_accounts",
        "query_hubspot_contacts",
        "query_6sense_6sense_records",
        "query_bigquery_analytics_events",
        "lookup_audience_segmentation_engine_playbook",
        "action_salesforce_crm_create",
      ],
      mustReferenceEntities: [
        "accounts",
        "contacts",
        "6sense_records",
        "analytics_events",
      ],
      mustCiteDocuments: [
        "audience-segmentation-engine-playbook",
      ],
      expectedActionOutcome: "Action create executed against Salesforce CRM, with audit-trail entry and Demand Gen Manager notified of outcomes.",
      forbiddenBehaviors: [
        "do not invent KPI numbers",
        "do not skip the evidence_lookup step before any recommendation",
        "do not execute create without two-system evidence",
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
    rationale: "Row counts sized for Audience Segmentation Engine so the agent can demonstrate the workflow against realistic transactional volume without simulating a production warehouse.",
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
      id: "6sense",
      name: "6sense",
      owns: [
        "6sense_records",
        "6sense_events",
        "6sense_audit_trail",
      ],
      protocol: "REST API",
      localBacking: [
        "alloydb",
      ],
      toolNames: [
        "query_6sense_6sense_records",
        "query_6sense_6sense_events",
        "query_6sense_6sense_audit_trail",
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
      name: "6sense_records",
      sourceSystemId: "6sense",
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
      name: "6sense_events",
      sourceSystemId: "6sense",
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
          name: "6sense_record_id",
          type: "ref",
          ref: "6sense_records.id",
          required: true,
        },
      ],
    },
    {
      name: "6sense_audit_trail",
      sourceSystemId: "6sense",
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
      from: "engagement_events.contact_id",
      to: "contacts.id",
      cardinality: "many-to-one",
      orphanPolicy: "none",
    },
    {
      from: "6sense_events.6sense_record_id",
      to: "6sense_records.id",
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
      id: "audience-segmentation-engine-playbook",
      sourceSystemId: "bigquery",
      type: "playbook",
      title: "Audience Segmentation Engine Playbook",
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
      id: "salesforce_crm_create_api",
      sourceSystemId: "salesforce_crm",
      method: "POST",
      path: "/api/salesforce_crm/create",
      description: "Synchronous endpoint the agent calls to create in Salesforce CRM after evidence gating.",
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
      id: "audience-segmentation-engine-baseline-gap",
      description: "Seed a realistic gap where Segmentation refresh sits between Quarterly manual and Monthly automated, so the agent can detect, narrate, and recommend remediation.",
      affectedEntities: [
        "accounts",
        "opportunities",
      ],
      discoveryPath: [
        "Inspect Salesforce CRM records for the affected entities",
        "Compare against HubSpot historical baseline",
        "Generate a citation-backed recommendation",
      ],
      expectedEvidence: [
        "source-system record",
        "historical baseline metric",
        "generated audit trail",
      ],
      expectedRecommendation: "Explain the gap, cite supporting evidence, and propose the next Demand Gen Manager action.",
    },
  ],
  datastorePackaging: {
    alloydb: {
      database: "audience_segmentation_engine",
      schemas: [
        "salesforce_crm",
        "hubspot",
        "6sense",
      ],
    },
    bigquery: {
      dataset: "marketing_audience_segmentation_engine",
      tables: [
        "kpi_summary",
        "evidence_index",
      ],
    },
    cloudStorage: {
      bucketSuffix: "audience-segmentation-engine-evidence",
      prefixes: [
        "documents",
        "audit-trails",
        "exports",
      ],
    },
    apis: {
      serviceName: "audience-segmentation-engine-source-adapters",
      deploymentTarget: "cloud_run",
    },
  },
  validation: {
    smokePrompt: "Run the Audience Segmentation Engine workflow and cite source-system evidence for every claim.",
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

export const AudienceSegmentationEngine = () => (
  <UseCaseSlide
    title="Audience Segmentation Engine"
    subtitle="A-2905 \u2022 Marketing Strategy"
    icon={Users}
    domainId="domain-29"
    layer="Layer 4: Data Agent"
    persona="Demand Gen Manager"
    systems={["Salesforce CRM", "HubSpot", "6sense", "BigQuery", "Vertex AI"]}
    kpis={[
      { label: "Segmentation refresh", before: "Quarterly manual", after: "Monthly automated" },
      { label: "Segment personalization depth", before: "Firmographic only", after: "Behavioral + intent + qualitative" },
      { label: "Campaign targeting precision", before: "Broad personas", after: "Data-driven micro-segments" },
    ]}
    triggerType="scheduled"
    swimlane={swimlane}
    flow={flow}
    architecture={architecture}
    statusQuo={[
      "Audience segments defined by basic firmographic filters in CRM with no behavioral or intent enrichment.",
      "Segmentation updated quarterly by analysts with manual data pulls and spreadsheet clustering.",
      "Qualitative signals like prospect blog posts or job postings ignored in targeting decisions."
    ]}
    agentification={[
      "Gemini interprets qualitative signals that scoring models miss \u2014 prospect blog posts, job postings, and LinkedIn activity signaling buying intent.",
      "K-means clustering with propensity scoring creates data-driven micro-segments beyond basic firmographics.",
      "Synthesizes quantitative segments with qualitative context to create segment narratives for personalized outreach."
    ]}
  />
);
