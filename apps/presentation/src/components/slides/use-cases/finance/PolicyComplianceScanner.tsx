import React from "react";
import { UseCaseSlide } from "../../../agent/UseCaseSlide";
import { FlowStep } from "../../../agent/ProcessFlow";
import { SwimlaneFlow } from "../../../agent/SwimlaneFlow";
import { AgentArchitecture, UseCaseGenerationSpec, AgentBehaviorContract} from "../../../../types/architecture";
import { FileSearch, Database, Filter, CheckCircle, AlertTriangle } from "lucide-react";

const swimlane: SwimlaneFlow = {
  nodes: [
    { id: "s1", label: "Quarterly Scan", lane: "system", type: "trigger" },
    { id: "a1", label: "Transaction Scan", lane: "agent", type: "action" },
    { id: "a2", label: "Exception Interpretation", lane: "agent", type: "action" },
    { id: "a3", label: "Compliance Report", lane: "agent", type: "output" },
    { id: "h1", label: "Compliance Officer Reviews", lane: "human", type: "hitl" },
  ],
  connections: [["s1", "a1"], ["a1", "a2"], ["a2", "a3"], ["a3", "h1"]],
};

const flow: FlowStep[] = [
  { label: "Policy Ingest", icon: Database, description: "Load current corporate policies and scan transactions against approval thresholds, spending limits, and contract requirements.", trigger: "Quarterly", systems: ["SAP S/4HANA", "BigQuery"] },
  { label: "Deviation Detection", icon: Filter, description: "Rule-based scanning identifies policy deviations. Trend analysis spots increasing violation patterns by department.", systems: ["BigQuery"], integration: "ADK" },
  { label: "Context Interpretation", icon: AlertTriangle, description: "Gemini interprets exceptions in context — conference travel in high-cost cities vs. unjustified policy breaches.", systems: ["Vertex AI"] },
  { label: "Compliance Review", icon: CheckCircle, description: "Compliance Officer reviews classified deviations and determines enforcement actions.", output: "Policy Compliance Report" },
];

const architecture: AgentArchitecture = {
  connections: [
    { system: "SharePoint/Google Drive", description: "Corporate policy documents, approval matrices", direction: "read", protocol: "REST API", category: "collaboration" },
    { system: "SAP S/4HANA", description: "Transaction data, expense reports, purchase orders", direction: "read", protocol: "OData", category: "erp" },
    { system: "BigQuery", description: "Deviation analytics, trend dashboards, compliance scores", direction: "bidirectional", protocol: "BigQuery SQL", category: "analytics" },
    { system: "Vertex AI (Gemini)", description: "Policy exception interpretation, contextual classification", direction: "bidirectional", protocol: "gRPC", category: "ai" },
  ],
  pipeline: [
    { label: "Policy Extraction", description: "Parse corporate policy documents to extract quantitative rules — spending limits, approval thresholds, required documentation — into machine-readable format.", systems: ["SharePoint/Google Drive", "Vertex AI (Gemini)"], layer: "llm", dataIn: "Policy documents in natural language", dataOut: "Structured policy rules with thresholds" },
    { label: "Transaction Scanning", description: "Scan all transactions against extracted policy rules. Flag deviations and calculate compliance scores by department and policy area.", systems: ["SAP S/4HANA", "BigQuery"], layer: "ml", dataIn: "Transaction data + policy rules", dataOut: "Flagged deviations with department scores" },
    { label: "Contextual Classification", description: "Gemini interprets flagged deviations in context. Travel expenses over $500/night in NYC during a conference are justified; the same in a low-cost city without documentation is not.", systems: ["Vertex AI (Gemini)"], layer: "llm", dataIn: "Flagged deviations + contextual data", dataOut: "Classified deviations (justified vs. violation)" },
    { label: "Report Generation", description: "Generate compliance report with trend analysis, department-level scores, and recommended enforcement actions.", systems: ["BigQuery"], layer: "integration", dataIn: "Classified deviations", dataOut: "Policy compliance report" },
  ],
};


const behaviorContract: AgentBehaviorContract = {
  role: "Chief Audit Executive agent for the Policy Compliance Scanner workflow",
  primaryObjective: "100% transaction scanning replaces manual sampling for complete coverage. Gemini interprets exceptions in context — high-cost city travel vs. unjustified overspend. so the Chief Audit Executive can move the Transactions scanned KPI.",
  inScope: [
    "100% transaction scanning replaces manual sampling for complete coverage",
    "Gemini interprets exceptions in context — high-cost city travel vs. unjustified overspend",
    "Trend analysis by department and policy area enables proactive compliance management",
  ],
  outOfScope: [
    "Final sign-off on materially significant journal entries (Controller retains authority)",
    "Restatement of prior-period filings",
    "Tax position changes that require external advisor review",
  ],
  toolIntents: [
    {
      name: "query_sharepoint_google_drive_documents",
      kind: "query",
      sourceSystemId: "sharepoint_google_drive",
      description: "Retrieve documents from SharePoint/Google Drive for the Policy Compliance Scanner workflow.",
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
      name: "query_sap_s_4hana_transactions",
      kind: "query",
      sourceSystemId: "sap_s_4hana",
      description: "Retrieve transactions from SAP S/4HANA for the Policy Compliance Scanner workflow.",
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
      description: "Retrieve analytics events from BigQuery for the Policy Compliance Scanner workflow.",
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
      name: "lookup_policy_compliance_scanner_controls_playbook",
      kind: "evidence_lookup",
      sourceSystemId: "sharepoint_google_drive",
      description: "Look up sections of the Policy Compliance Scanner Controls Playbook to cite in narrative output, escalation rationale, and audit evidence.",
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
      claim: "Transactions scanned moved from 5-10% sample toward 100% population",
      mustCite: [
        "sharepoint_google_drive.documents",
        "sap_s_4hana.transactions",
      ],
      sourceSystemIds: [
        "sharepoint_google_drive",
        "sap_s_4hana",
      ],
    },
    {
      claim: "False positive rate moved from 50-60% toward < 20%",
      mustCite: [
        "sharepoint_google_drive.documents",
        "sap_s_4hana.transactions",
      ],
      sourceSystemIds: [
        "sharepoint_google_drive",
        "sap_s_4hana",
      ],
    },
  ],
  escalationRules: [
    {
      trigger: "Transactions scanned regresses past the 5-10% sample baseline by more than 20%",
      action: "escalate_to_human",
      handoffTarget: "Chief Audit Executive",
      rationale: "Significant regressions need human judgment before automated remediation runs against production records.",
    },
    {
      trigger: "Source-system evidence is incomplete or stale (>24h) for any required entity",
      action: "request_more_info",
      rationale: "Recommendations grounded in stale evidence misrepresent current state and undermine audit defensibility.",
    },
  ],
  refusalRules: [
    "Never fabricate metric values; only publish numbers derived from SharePoint/Google Drive (and other named systems) entities.",
    "Never bypass Chief Audit Executive approval on escalation triggers, even when confidence is high.",
    "Never expose individual personal data (PII) in summaries; aggregate or pseudonymise before output.",
    "Never act on data older than the staleness threshold defined in the runbook without a fresh re-query.",
  ],
  goldenEvals: [
    {
      id: "policy-compliance-scanner-end-to-end",
      prompt: "Run the Policy Compliance Scanner workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.",
      expectedToolCalls: [
        "query_sharepoint_google_drive_documents",
        "query_sap_s_4hana_transactions",
        "query_bigquery_analytics_events",
        "lookup_policy_compliance_scanner_controls_playbook",
      ],
      mustReferenceEntities: [
        "documents",
        "transactions",
        "analytics_events",
      ],
      mustCiteDocuments: [
        "policy-compliance-scanner-controls-playbook",
      ],
      expectedActionOutcome: "Chief Audit Executive receives a fully-cited recommendation; no external state change without explicit approval.",
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
    rationale: "Row counts sized for Policy Compliance Scanner so the agent can demonstrate the workflow against realistic transactional volume without simulating a production warehouse.",
  },
  sourceSystems: [
    {
      id: "sharepoint_google_drive",
      name: "SharePoint/Google Drive",
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
        "query_sharepoint_google_drive_documents",
        "query_sharepoint_google_drive_folder_permissions",
        "query_sharepoint_google_drive_share_events",
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
      name: "documents",
      sourceSystemId: "sharepoint_google_drive",
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
      sourceSystemId: "sharepoint_google_drive",
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
      sourceSystemId: "sharepoint_google_drive",
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
      from: "share_events.document_id",
      to: "documents.id",
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
      id: "policy-compliance-scanner-controls-playbook",
      sourceSystemId: "bigquery",
      type: "policy",
      title: "Policy Compliance Scanner Controls Playbook",
      requiredSections: [
        "Workflow scope",
        "Materiality thresholds",
        "Escalation triggers",
        "Audit evidence requirements",
        "Quarter-end variations",
      ],
      linkedEntities: [
        "documents",
        "folder_permissions",
        "share_events",
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
      id: "policy-compliance-scanner-baseline-gap",
      description: "Seed a realistic gap where Transactions scanned sits between 5-10% sample and 100% population, so the agent can detect, narrate, and recommend remediation.",
      affectedEntities: [
        "documents",
        "folder_permissions",
      ],
      discoveryPath: [
        "Inspect SharePoint/Google Drive records for the affected entities",
        "Compare against SAP S/4HANA historical baseline",
        "Generate a citation-backed recommendation",
      ],
      expectedEvidence: [
        "source-system record",
        "historical baseline metric",
        "generated audit trail",
      ],
      expectedRecommendation: "Explain the gap, cite supporting evidence, and propose the next Chief Audit Executive action.",
    },
  ],
  datastorePackaging: {
    alloydb: {
      database: "policy_compliance_scanner",
      schemas: [
        "sharepoint_google_drive",
        "sap_s_4hana",
      ],
    },
    bigquery: {
      dataset: "finance_policy_compliance_scanner",
      tables: [
        "kpi_summary",
        "evidence_index",
      ],
    },
    cloudStorage: {
      bucketSuffix: "policy-compliance-scanner-evidence",
      prefixes: [
        "documents",
        "audit-trails",
        "exports",
      ],
    },
    apis: {
      serviceName: "policy-compliance-scanner-source-adapters",
      deploymentTarget: "cloud_run",
    },
  },
  validation: {
    smokePrompt: "Run the Policy Compliance Scanner workflow and cite source-system evidence for every claim.",
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

export const PolicyComplianceScanner = () => (
  <UseCaseSlide
    title="Policy Compliance Scanner"
    subtitle="A-2605 • Internal Audit & Controls"
    icon={FileSearch}
    domainId="domain-26"
    layer="Layer 3: Custom ADK"
    persona="Chief Audit Executive"
    systems={["SharePoint/Google Drive", "SAP S/4HANA", "BigQuery", "Vertex AI"]}
    kpis={[
      { label: "Transactions scanned", before: "5-10% sample", after: "100% population" },
      { label: "False positive rate", before: "50-60%", after: "< 20%" },
      { label: "Policy violation trend visibility", before: "Annual review", after: "Quarterly with trends" },
    ]}
    triggerType="scheduled"
    swimlane={swimlane}
    flow={flow}
    architecture={architecture}
    hitl={{ actor: "Compliance Officer", action: "Review classified deviations", description: "Compliance Officer validates deviation classifications and determines whether enforcement actions are warranted." }}
    statusQuo={[
      "Policy compliance checked on small manual samples, missing systemic violations.",
      "No distinction between justified exceptions and genuine policy breaches.",
      "Department-level compliance trends invisible until annual audit."
    ]}
    agentification={[
      "100% transaction scanning replaces manual sampling for complete coverage.",
      "Gemini interprets exceptions in context — high-cost city travel vs. unjustified overspend.",
      "Trend analysis by department and policy area enables proactive compliance management."
    ]}
  />
);
