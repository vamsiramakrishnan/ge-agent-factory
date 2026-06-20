import React from "react";
import { UseCaseSlide } from "../../../agent/UseCaseSlide";
import { FlowStep } from "../../../agent/ProcessFlow";
import { SwimlaneFlow } from "../../../agent/SwimlaneFlow";
import { AgentArchitecture, UseCaseGenerationSpec, AgentBehaviorContract} from "../../../../types/architecture";
import { Radio, Database, Cpu, Brain, AlertTriangle } from "lucide-react";

const swimlane: SwimlaneFlow = {
  nodes: [
    { id: "s1", label: "New Regulation", lane: "system", type: "trigger" },
    { id: "a1", label: "Relevance Filter", lane: "agent", type: "action" },
    { id: "a2", label: "Impact Assessment", lane: "agent", type: "action" },
    { id: "a3", label: "Action Brief", lane: "agent", type: "output" },
    { id: "h1", label: "Tax Dir Reviews", lane: "human", type: "hitl" },
  ],
  connections: [["s1", "a1"], ["a1", "a2"], ["a2", "a3"], ["a3", "h1"]],
};

const flow: FlowStep[] = [
  { label: "Regulatory Feed", icon: Database, description: "Continuous monitoring of tax legislation, IRS guidance, OECD publications, and state regulatory changes.", trigger: "Continuous + new regulation", systems: ["Bloomberg Tax", "CCH"] },
  { label: "Relevance Classification", icon: Cpu, description: "Keyword-based filtering by jurisdiction, entity type, and topic area with impact classification (high/medium/low).", systems: ["BigQuery"], integration: "ADK" },
  { label: "Impact Analysis", icon: Brain, description: "Gemini reads new regulations and assesses entity-level impact -- Pillar Two safe harbors, state nexus changes, treaty modifications.", systems: ["Vertex AI"] },
  { label: "Tax Director Action", icon: AlertTriangle, description: "Tax Director reviews impact assessment and determines compliance timeline and resource requirements.", output: "Regulatory Impact Brief" },
];

const architecture: AgentArchitecture = {
  connections: [
    { system: "Bloomberg Tax", description: "Tax legislation tracking, regulatory alerts, international tax developments", direction: "read", protocol: "REST API", category: "market-data" },
    { system: "CCH AnswerConnect", description: "State tax changes, IRS guidance, proposed regulations", direction: "read", protocol: "REST API", category: "market-data" },
    { system: "BigQuery", description: "Relevance filtering, impact scoring, entity mapping, compliance tracking", direction: "bidirectional", protocol: "BigQuery SQL", category: "analytics" },
    { system: "Vertex AI (Gemini)", description: "Regulation interpretation, entity-level impact assessment, action plan generation", direction: "bidirectional", protocol: "gRPC", category: "ai" },
  ],
  pipeline: [
    { label: "Regulatory Feed Monitoring", description: "Continuously monitor Bloomberg Tax, CCH, IRS.gov, OECD, and state department of revenue feeds for new legislation, regulations, guidance, and rulings relevant to the company's tax footprint.", systems: ["Bloomberg Tax", "CCH AnswerConnect"], layer: "integration", dataIn: "Raw regulatory feed data", dataOut: "Filtered regulatory changes by jurisdiction and topic" },
    { label: "Relevance & Impact Scoring", description: "Score each regulatory change for relevance based on company's entity structure, jurisdictions, and transaction types. Classify impact as high (requires action), medium (requires monitoring), or low (informational).", systems: ["BigQuery"], layer: "ml", dataIn: "Filtered changes + entity map + jurisdiction exposure", dataOut: "Scored and classified regulatory changes" },
    { label: "Impact Assessment & Action Planning", description: "Gemini reads new regulations and assesses impact: 'Pillar Two global minimum tax requires CbCR-based ETR calculations starting FY2025. 3 Irish entities at 12.5% need transition safe harbor analysis -- estimate $1.2M annual impact if safe harbor does not apply.' Generates action plan.", systems: ["Vertex AI (Gemini)"], layer: "llm", dataIn: "Scored changes + entity financials + current compliance posture", dataOut: "Impact assessment with entity-level analysis and action plan" },
    { label: "Alert Distribution", description: "Distribute high-impact alerts to Tax Director immediately. Compile medium/low items into weekly digest. Track compliance implementation against action plan timelines.", systems: ["BigQuery"], layer: "integration", dataIn: "Impact assessments and action plans", dataOut: "Distributed alerts and compliance tracking" },
  ],
};


const behaviorContract: AgentBehaviorContract = {
  role: "Tax Director agent for the Regulatory Change Monitor workflow",
  primaryObjective: "Continuous monitoring across Bloomberg Tax, CCH, and regulatory feeds ensures zero regulatory surprises. Gemini reads new regulations and assesses entity-level impact within 48 hours -- Pillar Two, state nexus, treaty changes. so the Tax Director can move the Change detection KPI.",
  inScope: [
    "Continuous monitoring across Bloomberg Tax, CCH, and regulatory feeds ensures zero regulatory surprises",
    "Gemini reads new regulations and assesses entity-level impact within 48 hours -- Pillar Two, state nexus, treaty changes",
    "Proactive action plans give the tax team months of lead time rather than reactive scrambles at compliance deadlines",
  ],
  outOfScope: [
    "Final sign-off on materially significant journal entries (Controller retains authority)",
    "Restatement of prior-period filings",
    "Tax position changes that require external advisor review",
  ],
  toolIntents: [
    {
      name: "query_bloomberg_tax_bloomberg_tax_records",
      kind: "query",
      sourceSystemId: "bloomberg_tax",
      description: "Retrieve bloomberg tax records from Bloomberg Tax for the Regulatory Change Monitor workflow.",
      requiredInputs: [
        "lookup_key",
        "date_range",
      ],
      produces: [
        "bloomberg_tax_records_records",
        "bloomberg_tax_records_summary",
      ],
      evidenceEmitted: [
        "source_system_record",
      ],
    },
    {
      name: "query_cch_answerconnect_cch_answerconnect_records",
      kind: "query",
      sourceSystemId: "cch_answerconnect",
      description: "Retrieve cch answerconnect records from CCH AnswerConnect for the Regulatory Change Monitor workflow.",
      requiredInputs: [
        "lookup_key",
        "date_range",
      ],
      produces: [
        "cch_answerconnect_records_records",
        "cch_answerconnect_records_summary",
      ],
      evidenceEmitted: [
        "source_system_record",
      ],
    },
    {
      name: "query_bigquery_analytics_events",
      kind: "query",
      sourceSystemId: "bigquery",
      description: "Retrieve analytics events from BigQuery for the Regulatory Change Monitor workflow.",
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
      name: "lookup_regulatory_change_monitor_controls_playbook",
      kind: "evidence_lookup",
      sourceSystemId: "bigquery",
      description: "Look up sections of the Regulatory Change Monitor Controls Playbook to cite in narrative output, escalation rationale, and audit evidence.",
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
      claim: "Change detection moved from Ad-hoc awareness toward Continuous automated",
      mustCite: [
        "bloomberg_tax.bloomberg_tax_records",
        "cch_answerconnect.cch_answerconnect_records",
      ],
      sourceSystemIds: [
        "bloomberg_tax",
        "cch_answerconnect",
      ],
    },
    {
      claim: "Impact assessment time moved from 2-4 weeks toward 48 hours",
      mustCite: [
        "bloomberg_tax.bloomberg_tax_records",
        "cch_answerconnect.cch_answerconnect_records",
      ],
      sourceSystemIds: [
        "bloomberg_tax",
        "cch_answerconnect",
      ],
    },
  ],
  escalationRules: [
    {
      trigger: "Change detection regresses past the Ad-hoc awareness baseline by more than 20%",
      action: "escalate_to_human",
      handoffTarget: "Tax Director",
      rationale: "Significant regressions need human judgment before automated remediation runs against production records.",
    },
    {
      trigger: "Source-system evidence is incomplete or stale (>24h) for any required entity",
      action: "request_more_info",
      rationale: "Recommendations grounded in stale evidence misrepresent current state and undermine audit defensibility.",
    },
  ],
  refusalRules: [
    "Never fabricate metric values; only publish numbers derived from Bloomberg Tax (and other named systems) entities.",
    "Never bypass Tax Director approval on escalation triggers, even when confidence is high.",
    "Never expose individual personal data (PII) in summaries; aggregate or pseudonymise before output.",
    "Never act on data older than the staleness threshold defined in the runbook without a fresh re-query.",
  ],
  goldenEvals: [
    {
      id: "regulatory-change-monitor-end-to-end",
      prompt: "Run the Regulatory Change Monitor workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.",
      expectedToolCalls: [
        "query_bloomberg_tax_bloomberg_tax_records",
        "query_cch_answerconnect_cch_answerconnect_records",
        "query_bigquery_analytics_events",
        "lookup_regulatory_change_monitor_controls_playbook",
      ],
      mustReferenceEntities: [
        "bloomberg_tax_records",
        "cch_answerconnect_records",
        "analytics_events",
      ],
      mustCiteDocuments: [
        "regulatory-change-monitor-controls-playbook",
      ],
      expectedActionOutcome: "Tax Director receives a fully-cited recommendation; no external state change without explicit approval.",
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
    rationale: "Row counts sized for Regulatory Change Monitor so the agent can demonstrate the workflow against realistic transactional volume without simulating a production warehouse.",
  },
  sourceSystems: [
    {
      id: "bloomberg_tax",
      name: "Bloomberg Tax",
      owns: [
        "bloomberg_tax_records",
        "bloomberg_tax_events",
        "bloomberg_tax_audit_trail",
      ],
      protocol: "REST API",
      localBacking: [
        "alloydb",
      ],
      toolNames: [
        "query_bloomberg_tax_bloomberg_tax_records",
        "query_bloomberg_tax_bloomberg_tax_events",
        "query_bloomberg_tax_bloomberg_tax_audit_trail",
      ],
      evidence: [
        "source_system_record",
        "generated_audit_trail",
      ],
    },
    {
      id: "cch_answerconnect",
      name: "CCH AnswerConnect",
      owns: [
        "cch_answerconnect_records",
        "cch_answerconnect_events",
        "cch_answerconnect_audit_trail",
      ],
      protocol: "REST API",
      localBacking: [
        "alloydb",
      ],
      toolNames: [
        "query_cch_answerconnect_cch_answerconnect_records",
        "query_cch_answerconnect_cch_answerconnect_events",
        "query_cch_answerconnect_cch_answerconnect_audit_trail",
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
      name: "bloomberg_tax_records",
      sourceSystemId: "bloomberg_tax",
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
      name: "bloomberg_tax_events",
      sourceSystemId: "bloomberg_tax",
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
          name: "bloomberg_tax_record_id",
          type: "ref",
          ref: "bloomberg_tax_records.id",
          required: true,
        },
      ],
    },
    {
      name: "bloomberg_tax_audit_trail",
      sourceSystemId: "bloomberg_tax",
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
      name: "cch_answerconnect_records",
      sourceSystemId: "cch_answerconnect",
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
      name: "cch_answerconnect_events",
      sourceSystemId: "cch_answerconnect",
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
          name: "cch_answerconnect_record_id",
          type: "ref",
          ref: "cch_answerconnect_records.id",
          required: true,
        },
      ],
    },
    {
      name: "cch_answerconnect_audit_trail",
      sourceSystemId: "cch_answerconnect",
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
      from: "bloomberg_tax_events.bloomberg_tax_record_id",
      to: "bloomberg_tax_records.id",
      cardinality: "many-to-one",
      orphanPolicy: "none",
    },
    {
      from: "cch_answerconnect_events.cch_answerconnect_record_id",
      to: "cch_answerconnect_records.id",
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
      id: "regulatory-change-monitor-controls-playbook",
      sourceSystemId: "bigquery",
      type: "policy",
      title: "Regulatory Change Monitor Controls Playbook",
      requiredSections: [
        "Workflow scope",
        "Materiality thresholds",
        "Escalation triggers",
        "Audit evidence requirements",
        "Quarter-end variations",
      ],
      linkedEntities: [
        "bloomberg_tax_records",
        "bloomberg_tax_events",
        "bloomberg_tax_audit_trail",
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
  apis: [],
  anomalies: [
    {
      id: "regulatory-change-monitor-baseline-gap",
      description: "Seed a realistic gap where Change detection sits between Ad-hoc awareness and Continuous automated, so the agent can detect, narrate, and recommend remediation.",
      affectedEntities: [
        "bloomberg_tax_records",
        "bloomberg_tax_events",
      ],
      discoveryPath: [
        "Inspect Bloomberg Tax records for the affected entities",
        "Compare against CCH AnswerConnect historical baseline",
        "Generate a citation-backed recommendation",
      ],
      expectedEvidence: [
        "source-system record",
        "historical baseline metric",
        "generated audit trail",
      ],
      expectedRecommendation: "Explain the gap, cite supporting evidence, and propose the next Tax Director action.",
    },
  ],
  datastorePackaging: {
    alloydb: {
      database: "regulatory_change_monitor",
      schemas: [
        "bloomberg_tax",
        "cch_answerconnect",
      ],
    },
    bigquery: {
      dataset: "finance_regulatory_change_monitor",
      tables: [
        "kpi_summary",
        "evidence_index",
      ],
    },
    cloudStorage: {
      bucketSuffix: "regulatory-change-monitor-evidence",
      prefixes: [
        "documents",
        "audit-trails",
        "exports",
      ],
    },
    apis: {
      serviceName: "regulatory-change-monitor-source-adapters",
      deploymentTarget: "cloud_run",
    },
  },
  validation: {
    smokePrompt: "Run the Regulatory Change Monitor workflow and cite source-system evidence for every claim.",
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

export const RegulatoryChangeMonitor = () => (
  <UseCaseSlide
    title="Regulatory Change Monitor"
    subtitle="A-2508 - Tax & Compliance"
    icon={Radio}
    domainId="domain-25"
    layer="Layer 3: Custom ADK"
    persona="Tax Director"
    systems={["Bloomberg Tax", "CCH AnswerConnect", "BigQuery", "Vertex AI"]}
    kpis={[
      { label: "Change detection", before: "Ad-hoc awareness", after: "Continuous automated" },
      { label: "Impact assessment time", before: "2-4 weeks", after: "48 hours" },
      { label: "Compliance surprises", before: "2-3/year", after: "Zero" },
    ]}
    triggerType="event"
    swimlane={swimlane}
    flow={flow}
    architecture={architecture}
    hitl={{ actor: "Tax Director", action: "Review impact and set priorities", description: "Tax Director reviews entity-level impact assessment and determines compliance timeline, resource allocation, and external advisor engagement." }}
    statusQuo={[
      "Regulatory changes discovered through conferences, peer networks, or -- worst case -- during audits.",
      "Impact assessment takes 2-4 weeks as the tax team manually reads new regulations and maps to entity structure.",
      "2-3 compliance surprises per year from regulations that were effective before the team was aware."
    ]}
    agentification={[
      "Continuous monitoring across Bloomberg Tax, CCH, and regulatory feeds ensures zero regulatory surprises.",
      "Gemini reads new regulations and assesses entity-level impact within 48 hours -- Pillar Two, state nexus, treaty changes.",
      "Proactive action plans give the tax team months of lead time rather than reactive scrambles at compliance deadlines."
    ]}
  />
);
