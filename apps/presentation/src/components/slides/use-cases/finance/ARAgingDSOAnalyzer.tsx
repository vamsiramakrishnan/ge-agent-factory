import React from "react";
import { UseCaseSlide } from "../../../agent/UseCaseSlide";
import { FlowStep } from "../../../agent/ProcessFlow";
import { SwimlaneFlow } from "../../../agent/SwimlaneFlow";
import { AgentArchitecture, UseCaseGenerationSpec, AgentBehaviorContract} from "../../../../types/architecture";
import { BarChart3, Database, Cpu, Brain, FileText } from "lucide-react";

const swimlane: SwimlaneFlow = {
  nodes: [
    { id: "s1", label: "Weekly Cycle", lane: "system", type: "trigger" },
    { id: "a1", label: "Extract AR Data", lane: "agent", type: "action" },
    { id: "a2", label: "DSO Analytics", lane: "agent", type: "action" },
    { id: "a3", label: "Narrative Report", lane: "agent", type: "output" },
    { id: "h1", label: "AR Mgr Reviews", lane: "human", type: "hitl" },
  ],
  connections: [["s1", "a1"], ["a1", "a2"], ["a2", "a3"], ["a3", "h1"]],
};

const flow: FlowStep[] = [
  { label: "Data Extraction", icon: Database, description: "AR aging data extracted by segment, region, customer, and invoice type.", trigger: "Weekly", systems: ["SAP S/4HANA FI"] },
  { label: "DSO Analytics", icon: Cpu, description: "DSO trending, aging migration analysis, bad debt provision modeling, and segment-level collection rate calculations.", systems: ["BigQuery"], integration: "ADK" },
  { label: "Narrative Generation", icon: Brain, description: "Gemini generates AR narrative explaining DSO movement drivers and recommending segment-specific tracking changes.", systems: ["Vertex AI"] },
  { label: "Management Review", icon: FileText, description: "AR Manager reviews dashboard and narrative, identifies action items for collections team.", output: "AR Dashboard & Narrative" },
];

const architecture: AgentArchitecture = {
  connections: [
    { system: "SAP S/4HANA FI", description: "AR sub-ledger, open invoices, payment history, customer master", direction: "read", protocol: "RFC/BAPI", category: "erp" },
    { system: "BigQuery", description: "DSO calculations, aging migration matrices, provision models, trend analytics", direction: "bidirectional", protocol: "BigQuery SQL", category: "analytics" },
    { system: "Looker", description: "AR aging dashboards, DSO trend visualizations, segment drill-downs", direction: "write", protocol: "REST API", category: "analytics" },
    { system: "Vertex AI (Gemini)", description: "AR narrative generation, root cause interpretation, recommendation synthesis", direction: "bidirectional", protocol: "gRPC", category: "ai" },
  ],
  pipeline: [
    { label: "AR Data Extraction", description: "Pull AR aging data from SAP segmented by customer, region, industry, and invoice type. Include payment history and dispute status for each open item.", systems: ["SAP S/4HANA FI"], layer: "integration", dataIn: "AR sub-ledger data", dataOut: "Structured aging data by multiple dimensions" },
    { label: "DSO & Aging Analytics", description: "Calculate DSO by segment, region, and customer tier. Run aging migration analysis to track how receivables move across buckets over time. Model bad debt provisions using historical write-off patterns.", systems: ["BigQuery", "Looker"], layer: "ml", dataIn: "Structured aging data with historical baseline", dataOut: "DSO metrics, migration matrices, provision estimates" },
    { label: "Narrative Synthesis", description: "Gemini generates AR narrative: 'DSO increased 5 days to 48 -- driven entirely by 2 large government contracts with 60-day terms. Excluding government, commercial DSO improved by 2 days. Recommend tracking government and commercial DSO separately.'", systems: ["Vertex AI (Gemini)"], layer: "llm", dataIn: "DSO analytics + segment breakdowns + trend data", dataOut: "AR narrative with root cause analysis and recommendations" },
    { label: "Dashboard Delivery", description: "Refresh AR aging dashboards in Looker with current data and attach narrative commentary. Distribute to AR Manager and CFO.", systems: ["Looker"], layer: "integration", dataIn: "Analytics results + narrative", dataOut: "Updated AR dashboards with narrative overlay" },
  ],
};


const behaviorContract: AgentBehaviorContract = {
  role: "AR Manager agent for the AR Aging & DSO Analyzer workflow",
  primaryObjective: "Automated segment-level DSO analysis reveals that a 5-day DSO increase is driven entirely by 2 government contracts, not a systemic issue. Gemini generates narrative context that transforms numbers into actionable intelligence for the AR Manager. so the AR Manager can move the Reporting cycle KPI.",
  inScope: [
    "Automated segment-level DSO analysis reveals that a 5-day DSO increase is driven entirely by 2 government contracts, not a systemic issue",
    "Gemini generates narrative context that transforms numbers into actionable intelligence for the AR Manager",
    "ML-based provision modeling improves bad debt forecast accuracy from 60% to 88% by learning from historical patterns",
  ],
  outOfScope: [
    "Final sign-off on materially significant journal entries (Controller retains authority)",
    "Restatement of prior-period filings",
    "Tax position changes that require external advisor review",
  ],
  toolIntents: [
    {
      name: "query_sap_s_4hana_fi_gl_entries",
      kind: "query",
      sourceSystemId: "sap_s_4hana_fi",
      description: "Retrieve gl entries from SAP S/4HANA FI for the AR Aging & DSO Analyzer workflow.",
      requiredInputs: [
        "lookup_key",
        "date_range",
      ],
      produces: [
        "gl_entries_records",
        "gl_entries_summary",
      ],
      evidenceEmitted: [
        "source_system_record",
      ],
    },
    {
      name: "query_bigquery_analytics_events",
      kind: "query",
      sourceSystemId: "bigquery",
      description: "Retrieve analytics events from BigQuery for the AR Aging & DSO Analyzer workflow.",
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
      name: "query_looker_dashboards",
      kind: "query",
      sourceSystemId: "looker",
      description: "Retrieve dashboards from Looker for the AR Aging & DSO Analyzer workflow.",
      requiredInputs: [
        "lookup_key",
        "date_range",
      ],
      produces: [
        "dashboards_records",
        "dashboards_summary",
      ],
      evidenceEmitted: [
        "sql_result",
      ],
    },
    {
      name: "lookup_ar_aging_dso_analyzer_controls_playbook",
      kind: "evidence_lookup",
      sourceSystemId: "bigquery",
      description: "Look up sections of the AR Aging & DSO Analyzer Controls Playbook to cite in narrative output, escalation rationale, and audit evidence.",
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
      name: "action_sap_s_4hana_fi_generate",
      kind: "action",
      sourceSystemId: "sap_s_4hana_fi",
      description: "Execute the generate step in SAP S/4HANA FI after the agent has gathered evidence and validated escalation gates.",
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
      claim: "Reporting cycle moved from Manual weekly toward Auto-refreshed daily",
      mustCite: [
        "sap_s_4hana_fi.gl_entries",
        "bigquery.analytics_events",
      ],
      sourceSystemIds: [
        "sap_s_4hana_fi",
        "bigquery",
      ],
    },
    {
      claim: "Root cause visibility moved from Top-line DSO only toward Segment-level with narrative",
      mustCite: [
        "sap_s_4hana_fi.gl_entries",
        "bigquery.analytics_events",
      ],
      sourceSystemIds: [
        "sap_s_4hana_fi",
        "bigquery",
      ],
    },
  ],
  escalationRules: [
    {
      trigger: "Reporting cycle regresses past the Manual weekly baseline by more than 20%",
      action: "escalate_to_human",
      handoffTarget: "AR Manager",
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
    "Never fabricate metric values; only publish numbers derived from SAP S/4HANA FI (and other named systems) entities.",
    "Never bypass AR Manager approval on escalation triggers, even when confidence is high.",
    "Never expose individual personal data (PII) in summaries; aggregate or pseudonymise before output.",
    "Never act on data older than the staleness threshold defined in the runbook without a fresh re-query.",
  ],
  goldenEvals: [
    {
      id: "ar-aging-dso-analyzer-end-to-end",
      prompt: "Run the AR Aging & DSO Analyzer workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.",
      expectedToolCalls: [
        "query_sap_s_4hana_fi_gl_entries",
        "query_bigquery_analytics_events",
        "query_looker_dashboards",
        "lookup_ar_aging_dso_analyzer_controls_playbook",
        "action_sap_s_4hana_fi_generate",
      ],
      mustReferenceEntities: [
        "gl_entries",
        "analytics_events",
        "dashboards",
      ],
      mustCiteDocuments: [
        "ar-aging-dso-analyzer-controls-playbook",
      ],
      expectedActionOutcome: "Action generate executed against SAP S/4HANA FI, with audit-trail entry and AR Manager notified of outcomes.",
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
    rationale: "Row counts sized for AR Aging & DSO Analyzer so the agent can demonstrate the workflow against realistic transactional volume without simulating a production warehouse.",
  },
  sourceSystems: [
    {
      id: "sap_s_4hana_fi",
      name: "SAP S/4HANA FI",
      owns: [
        "gl_entries",
        "subledger_balances",
        "open_items",
      ],
      protocol: "RFC/BAPI",
      localBacking: [
        "alloydb",
      ],
      toolNames: [
        "query_sap_s_4hana_fi_gl_entries",
        "query_sap_s_4hana_fi_subledger_balances",
        "query_sap_s_4hana_fi_open_items",
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
    {
      id: "looker",
      name: "Looker",
      owns: [
        "dashboards",
        "explore_queries",
        "metric_definitions",
      ],
      protocol: "LookerML",
      localBacking: [
        "bigquery",
      ],
      toolNames: [
        "query_looker_dashboards",
        "query_looker_explore_queries",
        "query_looker_metric_definitions",
      ],
      evidence: [
        "source_system_record",
        "generated_audit_trail",
      ],
    },
  ],
  entities: [
    {
      name: "gl_entries",
      sourceSystemId: "sap_s_4hana_fi",
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
          name: "posting_date",
          type: "date",
          required: true,
        },
        {
          name: "account",
          type: "enum",
          values: [
            "1000-Cash",
            "2000-AP",
            "2100-AR",
            "3000-Revenue",
            "4000-Expense",
            "5000-COGS",
          ],
          required: true,
        },
        {
          name: "amount",
          type: "float",
          min: -50000,
          max: 50000,
          decimals: 2,
          required: true,
        },
        {
          name: "currency",
          type: "enum",
          values: [
            "USD",
            "EUR",
            "GBP",
          ],
          required: true,
        },
        {
          name: "description",
          type: "lorem.sentence",
          required: true,
        },
        {
          name: "status",
          type: "enum",
          values: [
            "posted",
            "pending",
            "reversed",
          ],
          weights: [
            0.8,
            0.15,
            0.05,
          ],
          required: true,
        },
      ],
    },
    {
      name: "subledger_balances",
      sourceSystemId: "sap_s_4hana_fi",
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
          name: "posting_date",
          type: "date",
          required: true,
        },
        {
          name: "account",
          type: "enum",
          values: [
            "1000-Cash",
            "2000-AP",
            "2100-AR",
            "3000-Revenue",
            "4000-Expense",
            "5000-COGS",
          ],
          required: true,
        },
        {
          name: "amount",
          type: "float",
          min: -50000,
          max: 50000,
          decimals: 2,
          required: true,
        },
        {
          name: "currency",
          type: "enum",
          values: [
            "USD",
            "EUR",
            "GBP",
          ],
          required: true,
        },
        {
          name: "description",
          type: "lorem.sentence",
          required: true,
        },
        {
          name: "status",
          type: "enum",
          values: [
            "posted",
            "pending",
            "reversed",
          ],
          weights: [
            0.8,
            0.15,
            0.05,
          ],
          required: true,
        },
      ],
    },
    {
      name: "open_items",
      sourceSystemId: "sap_s_4hana_fi",
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
          name: "posting_date",
          type: "date",
          required: true,
        },
        {
          name: "account",
          type: "enum",
          values: [
            "1000-Cash",
            "2000-AP",
            "2100-AR",
            "3000-Revenue",
            "4000-Expense",
            "5000-COGS",
          ],
          required: true,
        },
        {
          name: "amount",
          type: "float",
          min: -50000,
          max: 50000,
          decimals: 2,
          required: true,
        },
        {
          name: "currency",
          type: "enum",
          values: [
            "USD",
            "EUR",
            "GBP",
          ],
          required: true,
        },
        {
          name: "description",
          type: "lorem.sentence",
          required: true,
        },
        {
          name: "status",
          type: "enum",
          values: [
            "posted",
            "pending",
            "reversed",
          ],
          weights: [
            0.8,
            0.15,
            0.05,
          ],
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
    {
      name: "dashboards",
      sourceSystemId: "looker",
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
      name: "explore_queries",
      sourceSystemId: "looker",
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
      name: "metric_definitions",
      sourceSystemId: "looker",
      datastore: "bigquery",
      rowCount: 30,
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
      from: "analytics_events.historical_metric_id",
      to: "historical_metrics.id",
      cardinality: "many-to-one",
      orphanPolicy: "none",
    },
  ],
  documents: [
    {
      id: "ar-aging-dso-analyzer-controls-playbook",
      sourceSystemId: "bigquery",
      type: "policy",
      title: "AR Aging & DSO Analyzer Controls Playbook",
      requiredSections: [
        "Workflow scope",
        "Materiality thresholds",
        "Escalation triggers",
        "Audit evidence requirements",
        "Quarter-end variations",
      ],
      linkedEntities: [
        "gl_entries",
        "subledger_balances",
        "open_items",
      ],
      minimumWordCount: 500,
      citationAnchors: [
        "scope",
        "materiality",
        "escalation",
        "audit-evidence",
      ],
    },
  ],
  apis: [
    {
      id: "sap_s_4hana_fi_generate_api",
      sourceSystemId: "sap_s_4hana_fi",
      method: "POST",
      path: "/api/sap_s_4hana_fi/generate",
      description: "Synchronous endpoint the agent calls to generate in SAP S/4HANA FI after evidence gating.",
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
      id: "ar-aging-dso-analyzer-baseline-gap",
      description: "Seed a realistic gap where Reporting cycle sits between Manual weekly and Auto-refreshed daily, so the agent can detect, narrate, and recommend remediation.",
      affectedEntities: [
        "gl_entries",
        "subledger_balances",
      ],
      discoveryPath: [
        "Inspect SAP S/4HANA FI records for the affected entities",
        "Compare against BigQuery historical baseline",
        "Generate a citation-backed recommendation",
      ],
      expectedEvidence: [
        "source-system record",
        "historical baseline metric",
        "generated audit trail",
      ],
      expectedRecommendation: "Explain the gap, cite supporting evidence, and propose the next AR Manager action.",
    },
  ],
  datastorePackaging: {
    alloydb: {
      database: "ar_aging_dso_analyzer",
      schemas: [
        "sap_s_4hana_fi",
      ],
    },
    bigquery: {
      dataset: "finance_ar_aging_dso_analyzer",
      tables: [
        "kpi_summary",
        "evidence_index",
      ],
    },
    cloudStorage: {
      bucketSuffix: "ar-aging-dso-analyzer-evidence",
      prefixes: [
        "documents",
        "audit-trails",
        "exports",
      ],
    },
    apis: {
      serviceName: "ar-aging-dso-analyzer-source-adapters",
      deploymentTarget: "cloud_run",
    },
  },
  validation: {
    smokePrompt: "Run the AR Aging & DSO Analyzer workflow and cite source-system evidence for every claim.",
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

export const ARAgingDSOAnalyzer = () => (
  <UseCaseSlide
    title="AR Aging & DSO Analyzer"
    subtitle="A-2305 - AR & Collections"
    icon={BarChart3}
    domainId="domain-23"
    layer="Layer 4: Data Agent"
    persona="AR Manager"
    systems={["SAP S/4HANA FI", "BigQuery", "Looker", "Vertex AI"]}
    kpis={[
      { label: "Reporting cycle", before: "Manual weekly", after: "Auto-refreshed daily" },
      { label: "Root cause visibility", before: "Top-line DSO only", after: "Segment-level with narrative" },
      { label: "Bad debt forecast accuracy", before: "60%", after: "88%" },
    ]}
    triggerType="scheduled"
    swimlane={swimlane}
    flow={flow}
    architecture={architecture}
    hitl={{ actor: "AR Manager", action: "Review AR narrative and action items", description: "AR Manager reviews DSO trends, aging migration, and narrative commentary to prioritize collections strategy adjustments." }}
    statusQuo={[
      "AR aging reports are static Excel exports reviewed weekly with no narrative explaining the 'why' behind DSO movements.",
      "Government and commercial receivables mixed together masks improving commercial collections performance.",
      "Bad debt provisions based on simple aging bucket percentages, not predictive modeling."
    ]}
    agentification={[
      "Automated segment-level DSO analysis reveals that a 5-day DSO increase is driven entirely by 2 government contracts, not a systemic issue.",
      "Gemini generates narrative context that transforms numbers into actionable intelligence for the AR Manager.",
      "ML-based provision modeling improves bad debt forecast accuracy from 60% to 88% by learning from historical patterns."
    ]}
  />
);
