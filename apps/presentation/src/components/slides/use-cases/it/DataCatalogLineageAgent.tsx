import React from "react";
import { UseCaseSlide } from "../../../agent/UseCaseSlide";
import { FlowStep } from "../../../agent/ProcessFlow";
import { SwimlaneFlow } from "../../../agent/SwimlaneFlow";
import { AgentArchitecture, UseCaseGenerationSpec, AgentBehaviorContract} from "../../../../types/architecture";
import { GitBranch, Database, MessageSquare, Search, Map } from "lucide-react";

const swimlane: SwimlaneFlow = {
  nodes: [
    { id: "s1", label: "Data Query / Event", lane: "system", type: "trigger" },
    { id: "a1", label: "Catalog Search", lane: "agent", type: "action" },
    { id: "a2", label: "Lineage Tracing", lane: "agent", type: "action" },
    { id: "a3", label: "Data Answer", lane: "agent", type: "output" },
    { id: "h1", label: "Analyst Uses Data", lane: "human", type: "hitl" },
  ],
  connections: [["s1", "a1"], ["a1", "a2"], ["a2", "a3"], ["a3", "h1"]],
};

const flow: FlowStep[] = [
  { label: "Discovery Query", icon: MessageSquare, description: "Analyst asks 'where does this data come from?' or a new table triggers auto-cataloging.", trigger: "Chat + Event", systems: ["Google Dataplex", "BigQuery"] },
  { label: "Catalog Search", icon: Search, description: "Semantic search across data catalog with auto-classification of PII and sensitive columns.", systems: ["BigQuery", "dbt"], integration: "ADK" },
  { label: "Lineage Answer", icon: GitBranch, description: "LLM traces column-level lineage and explains data provenance in natural language.", systems: ["Vertex AI"] },
  { label: "Analyst Usage", icon: Database, description: "Analyst uses the canonical data source with confidence in its provenance and quality.", output: "Data Discovery Answer" },
];

const architecture: AgentArchitecture = {
  connections: [
    { system: "Google Dataplex", description: "Data catalog, metadata management, policy tags", direction: "bidirectional", protocol: "gRPC", category: "analytics" },
    { system: "dbt", description: "Model lineage, column-level transformations, documentation", direction: "read", protocol: "CLI / REST API", category: "erp" },
    { system: "BigQuery", description: "Table schemas, usage statistics, access patterns", direction: "bidirectional", protocol: "BigQuery SQL", category: "analytics" },
    { system: "Vertex AI (Gemini)", description: "Natural language data discovery, lineage explanation", direction: "bidirectional", protocol: "gRPC", category: "ai" },
  ],
  pipeline: [
    { label: "Auto-Cataloging", description: "Detect new tables created in BigQuery. Auto-catalog with metadata: schema, owner, description, PII classification, and quality scores. Index in Dataplex for discovery.", systems: ["Google Dataplex", "BigQuery"], layer: "integration", dataIn: "New table events + schema metadata", dataOut: "Cataloged dataset with auto-classifications" },
    { label: "Lineage Graph Construction", description: "Build column-level lineage graph from dbt model definitions and BigQuery query logs. Track data flow from source system through transformations to consumption layer.", systems: ["dbt", "BigQuery"], layer: "ml", dataIn: "dbt models + query execution logs", dataOut: "Column-level lineage graph" },
    { label: "Natural Language Data Discovery", description: "Gemini answers data discovery questions in natural language — 'the canonical source for customer revenue is dwh.dim_customer joined with fact_orders.' Warns against using staging tables directly.", systems: ["Vertex AI (Gemini)"], layer: "llm", dataIn: "User query + catalog + lineage graph", dataOut: "Data discovery answer with provenance explanation" },
    { label: "PII Classification & Governance", description: "Auto-classify columns containing PII using pattern matching and context analysis. Apply Dataplex policy tags and enforce access controls based on data sensitivity.", systems: ["Google Dataplex", "BigQuery"], layer: "integration", dataIn: "Column values + metadata", dataOut: "PII classifications + policy tags" },
  ],
};


const behaviorContract: AgentBehaviorContract = {
  role: "Data Platform Lead agent for the Data Catalog & Lineage Agent workflow",
  primaryObjective: "Gemini answers data discovery questions in natural language with provenance and quality context. LLM warns against using staging tables directly — 'use dwh.dim_customer, not staging.raw_orders.' so the Data Platform Lead can move the Data discovery time KPI.",
  inScope: [
    "Gemini answers data discovery questions in natural language with provenance and quality context",
    "LLM warns against using staging tables directly — 'use dwh.dim_customer, not staging.raw_orders.'",
    "Auto-cataloging and PII classification keep the catalog current without manual documentation effort",
  ],
  outOfScope: [
    "Production deployments outside an approved change window",
    "Irreversible destructive actions on shared infrastructure (DROP, force-delete, key rotation)",
    "Security incident attribution requiring forensics",
  ],
  toolIntents: [
    {
      name: "query_google_dataplex_google_dataplex_records",
      kind: "query",
      sourceSystemId: "google_dataplex",
      description: "Retrieve google dataplex records from Google Dataplex for the Data Catalog & Lineage Agent workflow.",
      requiredInputs: [
        "lookup_key",
        "date_range",
      ],
      produces: [
        "google_dataplex_records_records",
        "google_dataplex_records_summary",
      ],
      evidenceEmitted: [
        "source_system_record",
      ],
    },
    {
      name: "query_dbt_dbt_records",
      kind: "query",
      sourceSystemId: "dbt",
      description: "Retrieve dbt records from dbt for the Data Catalog & Lineage Agent workflow.",
      requiredInputs: [
        "lookup_key",
        "date_range",
      ],
      produces: [
        "dbt_records_records",
        "dbt_records_summary",
      ],
      evidenceEmitted: [
        "source_system_record",
      ],
    },
    {
      name: "query_bigquery_analytics_events",
      kind: "query",
      sourceSystemId: "bigquery",
      description: "Retrieve analytics events from BigQuery for the Data Catalog & Lineage Agent workflow.",
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
      name: "lookup_data_catalog_lineage_agent_runbook",
      kind: "evidence_lookup",
      sourceSystemId: "bigquery",
      description: "Look up sections of the Data Catalog & Lineage Agent Operations Runbook to cite in narrative output, escalation rationale, and audit evidence.",
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
      name: "action_google_dataplex_log_entry",
      kind: "action",
      sourceSystemId: "google_dataplex",
      description: "Execute the log entry step in Google Dataplex after the agent has gathered evidence and validated escalation gates.",
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
      claim: "Data discovery time moved from Hours of asking teams toward Minutes via chat",
      mustCite: [
        "google_dataplex.google_dataplex_records",
        "dbt.dbt_records",
      ],
      sourceSystemIds: [
        "google_dataplex",
        "dbt",
      ],
    },
    {
      claim: "Catalog coverage moved from 30% documented toward 95% auto-cataloged",
      mustCite: [
        "google_dataplex.google_dataplex_records",
        "dbt.dbt_records",
      ],
      sourceSystemIds: [
        "google_dataplex",
        "dbt",
      ],
    },
  ],
  escalationRules: [
    {
      trigger: "Data discovery time regresses past the Hours of asking teams baseline by more than 20%",
      action: "escalate_to_human",
      handoffTarget: "Data Platform Lead",
      rationale: "Significant regressions need human judgment before automated remediation runs against production records.",
    },
    {
      trigger: "Source-system evidence is incomplete or stale (>24h) for any required entity",
      action: "request_more_info",
      rationale: "Recommendations grounded in stale evidence misrepresent current state and undermine audit defensibility.",
    },
    {
      trigger: "Proposed log entry action lacks supporting evidence from at least two systems",
      action: "refuse",
      rationale: "Single-system evidence is insufficient to authorize external state changes without manual review.",
    },
  ],
  refusalRules: [
    "Never fabricate metric values; only publish numbers derived from Google Dataplex (and other named systems) entities.",
    "Never bypass Data Platform Lead approval on escalation triggers, even when confidence is high.",
    "Never expose individual personal data (PII) in summaries; aggregate or pseudonymise before output.",
    "Never act on data older than the staleness threshold defined in the runbook without a fresh re-query.",
  ],
  goldenEvals: [
    {
      id: "data-catalog-lineage-agent-end-to-end",
      prompt: "Run the Data Catalog & Lineage Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.",
      expectedToolCalls: [
        "query_google_dataplex_google_dataplex_records",
        "query_dbt_dbt_records",
        "query_bigquery_analytics_events",
        "lookup_data_catalog_lineage_agent_runbook",
        "action_google_dataplex_log_entry",
      ],
      mustReferenceEntities: [
        "google_dataplex_records",
        "dbt_records",
        "analytics_events",
      ],
      mustCiteDocuments: [
        "data-catalog-lineage-agent-runbook",
      ],
      expectedActionOutcome: "Action log entry executed against Google Dataplex, with audit-trail entry and Data Platform Lead notified of outcomes.",
      forbiddenBehaviors: [
        "do not invent KPI numbers",
        "do not skip the evidence_lookup step before any recommendation",
        "do not execute log entry without two-system evidence",
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
    rationale: "Row counts sized for Data Catalog & Lineage Agent so the agent can demonstrate the workflow against realistic transactional volume without simulating a production warehouse.",
  },
  sourceSystems: [
    {
      id: "google_dataplex",
      name: "Google Dataplex",
      owns: [
        "google_dataplex_records",
        "google_dataplex_events",
        "google_dataplex_audit_trail",
      ],
      protocol: "REST API",
      localBacking: [
        "alloydb",
      ],
      toolNames: [
        "query_google_dataplex_google_dataplex_records",
        "query_google_dataplex_google_dataplex_events",
        "query_google_dataplex_google_dataplex_audit_trail",
      ],
      evidence: [
        "source_system_record",
        "generated_audit_trail",
      ],
    },
    {
      id: "dbt",
      name: "dbt",
      owns: [
        "dbt_records",
        "dbt_events",
        "dbt_audit_trail",
      ],
      protocol: "REST API",
      localBacking: [
        "alloydb",
      ],
      toolNames: [
        "query_dbt_dbt_records",
        "query_dbt_dbt_events",
        "query_dbt_dbt_audit_trail",
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
      name: "google_dataplex_records",
      sourceSystemId: "google_dataplex",
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
      name: "google_dataplex_events",
      sourceSystemId: "google_dataplex",
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
          name: "google_dataplex_record_id",
          type: "ref",
          ref: "google_dataplex_records.id",
          required: true,
        },
      ],
    },
    {
      name: "google_dataplex_audit_trail",
      sourceSystemId: "google_dataplex",
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
      name: "dbt_records",
      sourceSystemId: "dbt",
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
      name: "dbt_events",
      sourceSystemId: "dbt",
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
          name: "dbt_record_id",
          type: "ref",
          ref: "dbt_records.id",
          required: true,
        },
      ],
    },
    {
      name: "dbt_audit_trail",
      sourceSystemId: "dbt",
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
      from: "google_dataplex_events.google_dataplex_record_id",
      to: "google_dataplex_records.id",
      cardinality: "many-to-one",
      orphanPolicy: "none",
    },
    {
      from: "dbt_events.dbt_record_id",
      to: "dbt_records.id",
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
      id: "data-catalog-lineage-agent-runbook",
      sourceSystemId: "bigquery",
      type: "runbook",
      title: "Data Catalog & Lineage Agent Operations Runbook",
      requiredSections: [
        "Detection signals",
        "Triage procedures",
        "Remediation actions",
        "Rollback criteria",
        "Post-incident review",
      ],
      linkedEntities: [
        "google_dataplex_records",
        "google_dataplex_events",
        "google_dataplex_audit_trail",
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
  apis: [
    {
      id: "google_dataplex_log_entry_api",
      sourceSystemId: "google_dataplex",
      method: "POST",
      path: "/api/google_dataplex/log_entry",
      description: "Synchronous endpoint the agent calls to log entry in Google Dataplex after evidence gating.",
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
      id: "data-catalog-lineage-agent-baseline-gap",
      description: "Seed a realistic gap where Data discovery time sits between Hours of asking teams and Minutes via chat, so the agent can detect, narrate, and recommend remediation.",
      affectedEntities: [
        "google_dataplex_records",
        "google_dataplex_events",
      ],
      discoveryPath: [
        "Inspect Google Dataplex records for the affected entities",
        "Compare against dbt historical baseline",
        "Generate a citation-backed recommendation",
      ],
      expectedEvidence: [
        "source-system record",
        "historical baseline metric",
        "generated audit trail",
      ],
      expectedRecommendation: "Explain the gap, cite supporting evidence, and propose the next Data Platform Lead action.",
    },
  ],
  datastorePackaging: {
    alloydb: {
      database: "data_catalog_lineage_agent",
      schemas: [
        "google_dataplex",
        "dbt",
      ],
    },
    bigquery: {
      dataset: "it_data_catalog_lineage_agent",
      tables: [
        "kpi_summary",
        "evidence_index",
      ],
    },
    cloudStorage: {
      bucketSuffix: "data-catalog-lineage-agent-evidence",
      prefixes: [
        "documents",
        "audit-trails",
        "exports",
      ],
    },
    apis: {
      serviceName: "data-catalog-lineage-agent-source-adapters",
      deploymentTarget: "cloud_run",
    },
  },
  validation: {
    smokePrompt: "Run the Data Catalog & Lineage Agent workflow and cite source-system evidence for every claim.",
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

export const DataCatalogLineageAgent = () => (
  <UseCaseSlide
    title="Data Catalog & Lineage Agent"
    subtitle="IT6-06 • Data & AI Platform"
    icon={Map}
    domainId="domain-43"
    layer="Layer 2: Agent Designer"
    persona="Data Platform Lead"
    systems={["Google Dataplex", "dbt", "BigQuery", "Vertex AI"]}
    kpis={[
      { label: "Data discovery time", before: "Hours of asking teams", after: "Minutes via chat" },
      { label: "Catalog coverage", before: "30% documented", after: "95% auto-cataloged" },
      { label: "PII classification", before: "Manual audit annually", after: "Automated continuous" },
    ]}
    triggerType="event"
    swimlane={swimlane}
    flow={flow}
    architecture={architecture}
    hitl={{ actor: "Data Analyst", action: "Use discovered data", description: "Analyst uses the recommended canonical data source with confidence in its provenance, quality, and governance compliance." }}
    statusQuo={[
      "Data discovery requires asking multiple teams — 'who owns this table and is it safe to use?'",
      "Data catalog covers only 30% of tables because manual documentation cannot keep pace.",
      "Column-level lineage unavailable, making impact analysis for schema changes impossible.",
    ]}
    agentification={[
      "Gemini answers data discovery questions in natural language with provenance and quality context.",
      "LLM warns against using staging tables directly — 'use dwh.dim_customer, not staging.raw_orders.'",
      "Auto-cataloging and PII classification keep the catalog current without manual documentation effort.",
    ]}
  />
);
