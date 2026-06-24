import React from "react";
import { UseCaseSlide } from "../../../agent/UseCaseSlide";
import { FlowStep } from "../../../agent/ProcessFlow";
import { SwimlaneFlow } from "../../../agent/SwimlaneFlow";
import { AgentArchitecture, UseCaseGenerationSpec, AgentBehaviorContract} from "../../../../types/architecture";
import { Shield, Database, FileCheck, CheckCircle, AlertTriangle } from "lucide-react";

const swimlane: SwimlaneFlow = {
  nodes: [
    { id: "s1", label: "Quarterly SOX Cycle", lane: "system", type: "trigger" },
    { id: "a1", label: "Evidence Collection", lane: "agent", type: "action" },
    { id: "a2", label: "Control Testing", lane: "agent", type: "action" },
    { id: "a3", label: "Deficiency Assessment", lane: "agent", type: "output" },
    { id: "h1", label: "Audit Lead Reviews", lane: "human", type: "hitl" },
  ],
  connections: [["s1", "a1"], ["a1", "a2"], ["a2", "a3"], ["a3", "h1"]],
};

const flow: FlowStep[] = [
  { label: "Evidence Ingest", icon: Database, description: "Pull control evidence from ERP, GRC, and supporting systems for each ITGC and business process control.", trigger: "Quarterly", systems: ["AuditBoard", "SAP GRC"] },
  { label: "Automated Testing", icon: FileCheck, description: "Execute test procedures against sampled transactions, evaluate evidence completeness and timeliness.", systems: ["SAP S/4HANA", "BigQuery"], integration: "ADK" },
  { label: "Deficiency Scoring", icon: AlertTriangle, description: "Score control effectiveness and classify deficiencies by severity — observation, deficiency, or material weakness.", systems: ["Vertex AI"] },
  { label: "Audit Lead Review", icon: CheckCircle, description: "Internal Audit Lead validates test results, approves deficiency classifications, and assigns remediation owners.", output: "SOX Test Report" },
];

const architecture: AgentArchitecture = {
  connections: [
    { system: "AuditBoard", description: "Control library, test plans, prior year results", direction: "bidirectional", protocol: "REST API", category: "erp" },
    { system: "SAP GRC", description: "Access controls, SoD matrix, authorization logs", direction: "read", protocol: "REST API", category: "erp" },
    { system: "SAP S/4HANA", description: "Transaction logs, approval records, journal entries for sampling", direction: "read", protocol: "OData", category: "erp" },
    { system: "BigQuery", description: "Enriched control evidence, historical deficiency trends", direction: "bidirectional", protocol: "BigQuery SQL", category: "analytics" },
    { system: "Vertex AI (Gemini)", description: "Evidence sufficiency evaluation, deficiency classification reasoning", direction: "bidirectional", protocol: "gRPC", category: "ai" },
  ],
  pipeline: [
    { label: "Evidence Collection", description: "Pull control documentation, approval logs, and transaction samples from AuditBoard and SAP. Match evidence to control objectives.", systems: ["AuditBoard", "SAP GRC", "SAP S/4HANA"], layer: "integration", dataIn: "Control library + test plans", dataOut: "Evidence packages per control" },
    { label: "Statistical Sampling & Testing", description: "Risk-based sample selection. Execute test procedures — verify approvals exist, amounts match, timing is within policy. Score pass/fail per sample.", systems: ["BigQuery"], layer: "ml", dataIn: "Evidence packages + transaction data", dataOut: "Test results with pass/fail per sample" },
    { label: "Deficiency Reasoning", description: "Gemini evaluates whether control failures represent isolated incidents or systemic issues. Assesses compensating controls and determines deficiency severity classification.", systems: ["Vertex AI (Gemini)"], layer: "llm", dataIn: "Test results + control context + prior year findings", dataOut: "Deficiency classifications with supporting rationale" },
    { label: "Report & Remediation", description: "Generate SOX test report with findings, severity ratings, and remediation recommendations. Route to Audit Lead for review.", systems: ["AuditBoard"], layer: "integration", dataIn: "Deficiency classifications", dataOut: "SOX test report with remediation plan" },
  ],
};


const behaviorContract: AgentBehaviorContract = {
  role: "Internal Audit Lead agent for the SOX Control Testing Agent workflow",
  primaryObjective: "Gemini evaluates control evidence for sufficiency and identifies gaps requiring additional testing. Risk-based statistical sampling ensures high-risk areas receive proportional coverage. so the Internal Audit Lead can move the Test cycle time KPI.",
  inScope: [
    "Gemini evaluates control evidence for sufficiency and identifies gaps requiring additional testing",
    "Risk-based statistical sampling ensures high-risk areas receive proportional coverage",
    "LLM reasons about whether failures are isolated incidents or systemic control breakdowns",
  ],
  outOfScope: [
    "Final sign-off on materially significant journal entries (Controller retains authority)",
    "Restatement of prior-period filings",
    "Tax position changes that require external advisor review",
  ],
  toolIntents: [
    {
      name: "query_auditboard_auditboard_records",
      kind: "query",
      sourceSystemId: "auditboard",
      description: "Retrieve auditboard records from AuditBoard for the SOX Control Testing Agent workflow.",
      requiredInputs: [
        "lookup_key",
        "date_range",
      ],
      produces: [
        "auditboard_records_records",
        "auditboard_records_summary",
      ],
      evidenceEmitted: [
        "source_system_record",
      ],
    },
    {
      name: "query_sap_grc_control_tests",
      kind: "query",
      sourceSystemId: "sap_grc",
      description: "Retrieve control tests from SAP GRC for the SOX Control Testing Agent workflow.",
      requiredInputs: [
        "lookup_key",
        "date_range",
      ],
      produces: [
        "control_tests_records",
        "control_tests_summary",
      ],
      evidenceEmitted: [
        "source_system_record",
      ],
    },
    {
      name: "query_sap_s_4hana_transactions",
      kind: "query",
      sourceSystemId: "sap_s_4hana",
      description: "Retrieve transactions from SAP S/4HANA for the SOX Control Testing Agent workflow.",
      requiredInputs: [
        "lookup_key",
        "date_range",
      ],
      produces: [
        "transactions_records",
        "transactions_summary",
      ],
      evidenceEmitted: [
        "source_system_record",
      ],
    },
    {
      name: "query_bigquery_analytics_events",
      kind: "query",
      sourceSystemId: "bigquery",
      description: "Retrieve analytics events from BigQuery for the SOX Control Testing Agent workflow.",
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
      name: "lookup_sox_control_testing_agent_controls_playbook",
      kind: "evidence_lookup",
      sourceSystemId: "bigquery",
      description: "Look up sections of the SOX Control Testing Agent Controls Playbook to cite in narrative output, escalation rationale, and audit evidence.",
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
      claim: "Test cycle time moved from 6-8 weeks toward 1-2 weeks",
      mustCite: [
        "auditboard.auditboard_records",
        "sap_grc.control_tests",
      ],
      sourceSystemIds: [
        "auditboard",
        "sap_grc",
      ],
    },
    {
      claim: "Controls tested per quarter moved from 50-70 manual toward 200+ automated",
      mustCite: [
        "auditboard.auditboard_records",
        "sap_grc.control_tests",
      ],
      sourceSystemIds: [
        "auditboard",
        "sap_grc",
      ],
    },
  ],
  escalationRules: [
    {
      trigger: "Test cycle time regresses past the 6-8 weeks baseline by more than 20%",
      action: "escalate_to_human",
      handoffTarget: "Internal Audit Lead",
      rationale: "Significant regressions need human judgment before automated remediation runs against production records.",
    },
    {
      trigger: "Source-system evidence is incomplete or stale (>24h) for any required entity",
      action: "request_more_info",
      rationale: "Recommendations grounded in stale evidence misrepresent current state and undermine audit defensibility.",
    },
  ],
  refusalRules: [
    "Never fabricate metric values; only publish numbers derived from AuditBoard (and other named systems) entities.",
    "Never bypass Internal Audit Lead approval on escalation triggers, even when confidence is high.",
    "Never expose individual personal data (PII) in summaries; aggregate or pseudonymise before output.",
    "Never act on data older than the staleness threshold defined in the runbook without a fresh re-query.",
  ],
  goldenEvals: [
    {
      id: "sox-control-testing-agent-end-to-end",
      prompt: "Run the SOX Control Testing Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.",
      expectedToolCalls: [
        "query_auditboard_auditboard_records",
        "query_sap_grc_control_tests",
        "query_sap_s_4hana_transactions",
        "query_bigquery_analytics_events",
        "lookup_sox_control_testing_agent_controls_playbook",
      ],
      mustReferenceEntities: [
        "auditboard_records",
        "control_tests",
        "transactions",
        "analytics_events",
      ],
      mustCiteDocuments: [
        "sox-control-testing-agent-controls-playbook",
      ],
      expectedActionOutcome: "Internal Audit Lead receives a fully-cited recommendation; no external state change without explicit approval.",
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
    rationale: "Row counts sized for SOX Control Testing Agent so the agent can demonstrate the workflow against realistic transactional volume without simulating a production warehouse.",
  },
  sourceSystems: [
    {
      id: "auditboard",
      name: "AuditBoard",
      owns: [
        "auditboard_records",
        "auditboard_events",
        "auditboard_audit_trail",
      ],
      protocol: "REST API",
      localBacking: [
        "alloydb",
      ],
      toolNames: [
        "query_auditboard_auditboard_records",
        "query_auditboard_auditboard_events",
        "query_auditboard_auditboard_audit_trail",
      ],
      evidence: [
        "source_system_record",
        "generated_audit_trail",
      ],
    },
    {
      id: "sap_grc",
      name: "SAP GRC",
      owns: [
        "control_tests",
        "risk_assessments",
        "remediation_actions",
      ],
      protocol: "RFC/BAPI",
      localBacking: [
        "alloydb",
      ],
      toolNames: [
        "query_sap_grc_control_tests",
        "query_sap_grc_risk_assessments",
        "query_sap_grc_remediation_actions",
      ],
      evidence: [
        "source_system_record",
        "generated_audit_trail",
      ],
    },
    {
      id: "sap_s_4hana",
      name: "SAP S/4HANA",
      owns: [
        "transactions",
        "journal_entries",
        "master_data",
      ],
      protocol: "RFC/BAPI",
      localBacking: [
        "alloydb",
      ],
      toolNames: [
        "query_sap_s_4hana_transactions",
        "query_sap_s_4hana_journal_entries",
        "query_sap_s_4hana_master_data",
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
      name: "auditboard_records",
      sourceSystemId: "auditboard",
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
      name: "auditboard_events",
      sourceSystemId: "auditboard",
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
      name: "auditboard_audit_trail",
      sourceSystemId: "auditboard",
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
      name: "control_tests",
      sourceSystemId: "sap_grc",
      datastore: "alloydb",
      rowCount: 30,
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
          name: "status",
          type: "enum",
          values: [
            "open",
            "in_progress",
            "certified",
            "exception",
          ],
          required: true,
        },
        {
          name: "owner",
          type: "person.fullName",
          required: true,
        },
        {
          name: "match_rate",
          type: "float",
          min: 0,
          max: 1,
          decimals: 2,
          required: true,
        },
        {
          name: "last_run",
          type: "date",
          required: true,
        },
      ],
    },
    {
      name: "risk_assessments",
      sourceSystemId: "sap_grc",
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
          name: "status",
          type: "enum",
          values: [
            "open",
            "in_progress",
            "certified",
            "exception",
          ],
          required: true,
        },
        {
          name: "owner",
          type: "person.fullName",
          required: true,
        },
        {
          name: "match_rate",
          type: "float",
          min: 0,
          max: 1,
          decimals: 2,
          required: true,
        },
        {
          name: "last_run",
          type: "date",
          required: true,
        },
      ],
    },
    {
      name: "remediation_actions",
      sourceSystemId: "sap_grc",
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
      name: "transactions",
      sourceSystemId: "sap_s_4hana",
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
      name: "journal_entries",
      sourceSystemId: "sap_s_4hana",
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
      name: "master_data",
      sourceSystemId: "sap_s_4hana",
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
      from: "analytics_events.historical_metric_id",
      to: "historical_metrics.id",
      cardinality: "many-to-one",
      orphanPolicy: "none",
    },
  ],
  documents: [
    {
      id: "sox-control-testing-agent-controls-playbook",
      sourceSystemId: "bigquery",
      type: "policy",
      title: "SOX Control Testing Agent Controls Playbook",
      requiredSections: [
        "Workflow scope",
        "Materiality thresholds",
        "Escalation triggers",
        "Audit evidence requirements",
        "Quarter-end variations",
      ],
      linkedEntities: [
        "auditboard_records",
        "auditboard_events",
        "auditboard_audit_trail",
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
      id: "sox-control-testing-agent-baseline-gap",
      description: "Seed a realistic gap where Test cycle time sits between 6-8 weeks and 1-2 weeks, so the agent can detect, narrate, and recommend remediation.",
      affectedEntities: [
        "auditboard_records",
        "auditboard_events",
      ],
      discoveryPath: [
        "Inspect AuditBoard records for the affected entities",
        "Compare against SAP GRC historical baseline",
        "Generate a citation-backed recommendation",
      ],
      expectedEvidence: [
        "source-system record",
        "historical baseline metric",
        "generated audit trail",
      ],
      expectedRecommendation: "Explain the gap, cite supporting evidence, and propose the next Internal Audit Lead action.",
    },
  ],
  datastorePackaging: {
    alloydb: {
      database: "sox_control_testing_agent",
      schemas: [
        "auditboard",
        "sap_grc",
        "sap_s_4hana",
      ],
    },
    bigquery: {
      dataset: "finance_sox_control_testing_agent",
      tables: [
        "kpi_summary",
        "evidence_index",
      ],
    },
    cloudStorage: {
      bucketSuffix: "sox-control-testing-agent-evidence",
      prefixes: [
        "documents",
        "audit-trails",
        "exports",
      ],
    },
    apis: {
      serviceName: "sox-control-testing-agent-source-adapters",
      deploymentTarget: "cloud_run",
    },
  },
  validation: {
    smokePrompt: "Run the SOX Control Testing Agent workflow and cite source-system evidence for every claim.",
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

export const SOXControlTestingAgent = () => (
  <UseCaseSlide
    title="SOX Control Testing Agent"
    subtitle="A-2601 • Internal Audit & Controls"
    icon={Shield}
    domainId="domain-26"
    layer="Layer 3: Custom ADK"
    persona="Internal Audit Lead"
    systems={["AuditBoard", "SAP GRC", "SAP S/4HANA", "BigQuery", "Vertex AI"]}
    kpis={[
      { label: "Test cycle time", before: "6-8 weeks", after: "1-2 weeks" },
      { label: "Controls tested per quarter", before: "50-70 manual", after: "200+ automated" },
      { label: "Deficiency detection", before: "Year-end discovery", after: "Continuous identification" },
    ]}
    triggerType="scheduled"
    swimlane={swimlane}
    flow={flow}
    architecture={architecture}
    hitl={{ actor: "Internal Audit Lead", action: "Approve deficiency classifications", description: "Audit Lead validates test results and deficiency severity before remediation assignments and audit committee reporting." }}
    statusQuo={[
      "Control testing relies on manual evidence gathering from multiple disconnected systems.",
      "Sample selection is judgmental rather than risk-based, missing high-risk transactions.",
      "Deficiency classification is subjective and inconsistent across audit teams."
    ]}
    agentification={[
      "Gemini evaluates control evidence for sufficiency and identifies gaps requiring additional testing.",
      "Risk-based statistical sampling ensures high-risk areas receive proportional coverage.",
      "LLM reasons about whether failures are isolated incidents or systemic control breakdowns."
    ]}
  />
);
