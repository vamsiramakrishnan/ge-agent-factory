import React from "react";
import { UseCaseSlide } from "../../../agent/UseCaseSlide";
import { FlowStep } from "../../../agent/ProcessFlow";
import { SwimlaneFlow } from "../../../agent/SwimlaneFlow";
import { AgentArchitecture, UseCaseGenerationSpec, AgentBehaviorContract} from "../../../../types/architecture";
import { Scale, Database, Cpu, Brain, CheckCircle } from "lucide-react";

const swimlane: SwimlaneFlow = {
  nodes: [
    { id: "s1", label: "Dispute Raised", lane: "system", type: "trigger" },
    { id: "a1", label: "Categorize & Route", lane: "agent", type: "action" },
    { id: "a2", label: "Evidence Analysis", lane: "agent", type: "action" },
    { id: "a3", label: "Resolution Draft", lane: "agent", type: "output" },
    { id: "h1", label: "AR Approves", lane: "human", type: "hitl" },
  ],
  connections: [["s1", "a1"], ["a1", "a2"], ["a2", "a3"], ["a3", "h1"]],
};

const flow: FlowStep[] = [
  { label: "Dispute Intake", icon: Database, description: "Dispute logged from customer communication, deduction, or sales team escalation.", trigger: "Dispute raised", systems: ["HighRadius", "SAP S/4HANA FI"] },
  { label: "Root Cause Analysis", icon: Cpu, description: "ML categorizes dispute type and clusters with similar historical disputes for pattern recognition.", systems: ["BigQuery"], integration: "ADK" },
  { label: "Evidence Review", icon: Brain, description: "Gemini cross-references delivery records, contracts, and customer communications to validate or refute the dispute claim.", systems: ["Vertex AI"] },
  { label: "Resolution Approval", icon: CheckCircle, description: "AR Specialist reviews resolution recommendation -- full credit, partial credit, or rejection with supporting evidence.", output: "Dispute Resolution" },
];

const architecture: AgentArchitecture = {
  connections: [
    { system: "HighRadius", description: "Dispute management, deduction tracking, resolution workflow", direction: "bidirectional", protocol: "REST API", category: "erp" },
    { system: "SAP S/4HANA FI", description: "Invoice details, delivery records, credit memo posting", direction: "bidirectional", protocol: "RFC/BAPI", category: "erp" },
    { system: "Salesforce", description: "Customer relationship context, sales team communications, account notes", direction: "read", protocol: "REST API", category: "erp" },
    { system: "BigQuery", description: "Dispute categorization model, root cause clustering, resolution time analytics", direction: "bidirectional", protocol: "BigQuery SQL", category: "analytics" },
    { system: "Vertex AI (Gemini)", description: "Evidence cross-referencing, claim validation, resolution recommendation generation", direction: "bidirectional", protocol: "gRPC", category: "ai" },
  ],
  pipeline: [
    { label: "Dispute Intake & Categorization", description: "Log incoming dispute from customer, deduction, or internal escalation. ML auto-categorizes by type -- pricing, quality, delivery, billing error -- and routes to appropriate team.", systems: ["HighRadius", "SAP S/4HANA FI"], layer: "integration", dataIn: "Dispute notification with customer claim", dataOut: "Categorized dispute record with routing assignment" },
    { label: "Pattern & Root Cause Analysis", description: "Cluster dispute with similar historical cases to identify patterns. Predict resolution outcome and timeline based on category, amount, customer, and historical precedent.", systems: ["BigQuery"], layer: "ml", dataIn: "Categorized dispute + historical dispute data", dataOut: "Root cause cluster, predicted outcome, similar case matches" },
    { label: "Evidence Cross-Reference", description: "Gemini reads dispute details and cross-references delivery records, contracts, and communications. 'Customer disputes $45K citing wrong specifications -- PO specs match delivery docs but customer requirements changed post-PO. Recommend partial credit with documented spec change.'", systems: ["Vertex AI (Gemini)", "Salesforce"], layer: "llm", dataIn: "Dispute claim + delivery records + contracts + communications", dataOut: "Resolution recommendation with evidence-based rationale" },
    { label: "Resolution & Posting", description: "Present resolution recommendation to AR team. Post approved credit memos or rejections. Track resolution metrics for continuous improvement.", systems: ["SAP S/4HANA FI", "HighRadius"], layer: "integration", dataIn: "Approved resolution decision", dataOut: "Posted credit memo or documented rejection" },
  ],
};


const behaviorContract: AgentBehaviorContract = {
  role: "AR Specialist agent for the Dispute Resolution Agent workflow",
  primaryObjective: "Gemini cross-references delivery records, contracts, and customer communications to build evidence-based resolution recommendations. ML clustering reveals dispute patterns -- 40% of quality disputes trace to the same supplier component -- enabling upstream fixes. so the AR Specialist can move the Resolution cycle time KPI.",
  inScope: [
    "Gemini cross-references delivery records, contracts, and customer communications to build evidence-based resolution recommendations",
    "ML clustering reveals dispute patterns -- 40% of quality disputes trace to the same supplier component -- enabling upstream fixes",
    "Evidence-based resolutions reduce invalid credit acceptance from 18% to 4%, recovering $2M+ annually",
  ],
  outOfScope: [
    "Final sign-off on materially significant journal entries (Controller retains authority)",
    "Restatement of prior-period filings",
    "Tax position changes that require external advisor review",
  ],
  toolIntents: [
    {
      name: "query_highradius_payment_remittances",
      kind: "query",
      sourceSystemId: "highradius",
      description: "Retrieve payment remittances from HighRadius for the Dispute Resolution Agent workflow.",
      requiredInputs: [
        "lookup_key",
        "date_range",
      ],
      produces: [
        "payment_remittances_records",
        "payment_remittances_summary",
      ],
      evidenceEmitted: [
        "source_system_record",
      ],
    },
    {
      name: "query_sap_s_4hana_fi_gl_entries",
      kind: "query",
      sourceSystemId: "sap_s_4hana_fi",
      description: "Retrieve gl entries from SAP S/4HANA FI for the Dispute Resolution Agent workflow.",
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
      name: "query_salesforce_accounts",
      kind: "query",
      sourceSystemId: "salesforce",
      description: "Retrieve accounts from Salesforce for the Dispute Resolution Agent workflow.",
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
      description: "Retrieve analytics events from BigQuery for the Dispute Resolution Agent workflow.",
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
      name: "lookup_dispute_resolution_agent_controls_playbook",
      kind: "evidence_lookup",
      sourceSystemId: "bigquery",
      description: "Look up sections of the Dispute Resolution Agent Controls Playbook to cite in narrative output, escalation rationale, and audit evidence.",
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
      name: "action_highradius_recommend",
      kind: "action",
      sourceSystemId: "highradius",
      description: "Execute the recommend step in HighRadius after the agent has gathered evidence and validated escalation gates.",
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
      claim: "Resolution cycle time moved from 15-20 days toward 3-5 days",
      mustCite: [
        "highradius.payment_remittances",
        "sap_s_4hana_fi.gl_entries",
      ],
      sourceSystemIds: [
        "highradius",
        "sap_s_4hana_fi",
      ],
    },
    {
      claim: "Invalid disputes accepted moved from 18% toward 4%",
      mustCite: [
        "highradius.payment_remittances",
        "sap_s_4hana_fi.gl_entries",
      ],
      sourceSystemIds: [
        "highradius",
        "sap_s_4hana_fi",
      ],
    },
  ],
  escalationRules: [
    {
      trigger: "Resolution cycle time regresses past the 15-20 days baseline by more than 20%",
      action: "escalate_to_human",
      handoffTarget: "AR Specialist",
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
    "Never fabricate metric values; only publish numbers derived from HighRadius (and other named systems) entities.",
    "Never bypass AR Specialist approval on escalation triggers, even when confidence is high.",
    "Never expose individual personal data (PII) in summaries; aggregate or pseudonymise before output.",
    "Never act on data older than the staleness threshold defined in the runbook without a fresh re-query.",
  ],
  goldenEvals: [
    {
      id: "dispute-resolution-agent-end-to-end",
      prompt: "Run the Dispute Resolution Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.",
      expectedToolCalls: [
        "query_highradius_payment_remittances",
        "query_sap_s_4hana_fi_gl_entries",
        "query_salesforce_accounts",
        "query_bigquery_analytics_events",
        "lookup_dispute_resolution_agent_controls_playbook",
        "action_highradius_recommend",
      ],
      mustReferenceEntities: [
        "payment_remittances",
        "gl_entries",
        "accounts",
        "analytics_events",
      ],
      mustCiteDocuments: [
        "dispute-resolution-agent-controls-playbook",
      ],
      expectedActionOutcome: "Action recommend executed against HighRadius, with audit-trail entry and AR Specialist notified of outcomes.",
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
    rationale: "Row counts sized for Dispute Resolution Agent so the agent can demonstrate the workflow against realistic transactional volume without simulating a production warehouse.",
  },
  sourceSystems: [
    {
      id: "highradius",
      name: "HighRadius",
      owns: [
        "payment_remittances",
        "collections_queues",
        "deduction_cases",
      ],
      protocol: "REST API",
      localBacking: [
        "alloydb",
      ],
      toolNames: [
        "query_highradius_payment_remittances",
        "query_highradius_collections_queues",
        "query_highradius_deduction_cases",
      ],
      evidence: [
        "source_system_record",
        "generated_audit_trail",
      ],
    },
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
      id: "salesforce",
      name: "Salesforce",
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
        "query_salesforce_accounts",
        "query_salesforce_opportunities",
        "query_salesforce_campaign_influence",
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
      name: "payment_remittances",
      sourceSystemId: "highradius",
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
          name: "vendor",
          type: "company.name",
          required: true,
        },
        {
          name: "amount",
          type: "float",
          min: 100,
          max: 100000,
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
            "JPY",
          ],
          weights: [
            0.7,
            0.15,
            0.1,
            0.05,
          ],
          required: true,
        },
        {
          name: "status",
          type: "enum",
          values: [
            "draft",
            "pending",
            "approved",
            "paid",
            "rejected",
          ],
          weights: [
            0.1,
            0.3,
            0.3,
            0.2,
            0.1,
          ],
          required: true,
        },
        {
          name: "created_at",
          type: "date",
          required: true,
        },
        {
          name: "due_date",
          type: "date",
          required: true,
        },
      ],
    },
    {
      name: "collections_queues",
      sourceSystemId: "highradius",
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
      name: "deduction_cases",
      sourceSystemId: "highradius",
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
      name: "accounts",
      sourceSystemId: "salesforce",
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
      sourceSystemId: "salesforce",
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
      sourceSystemId: "salesforce",
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
      id: "dispute-resolution-agent-controls-playbook",
      sourceSystemId: "bigquery",
      type: "policy",
      title: "Dispute Resolution Agent Controls Playbook",
      requiredSections: [
        "Workflow scope",
        "Materiality thresholds",
        "Escalation triggers",
        "Audit evidence requirements",
        "Quarter-end variations",
      ],
      linkedEntities: [
        "payment_remittances",
        "collections_queues",
        "deduction_cases",
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
      id: "highradius_recommend_api",
      sourceSystemId: "highradius",
      method: "POST",
      path: "/api/highradius/recommend",
      description: "Synchronous endpoint the agent calls to recommend in HighRadius after evidence gating.",
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
      id: "dispute-resolution-agent-baseline-gap",
      description: "Seed a realistic gap where Resolution cycle time sits between 15-20 days and 3-5 days, so the agent can detect, narrate, and recommend remediation.",
      affectedEntities: [
        "payment_remittances",
        "collections_queues",
      ],
      discoveryPath: [
        "Inspect HighRadius records for the affected entities",
        "Compare against SAP S/4HANA FI historical baseline",
        "Generate a citation-backed recommendation",
      ],
      expectedEvidence: [
        "source-system record",
        "historical baseline metric",
        "generated audit trail",
      ],
      expectedRecommendation: "Explain the gap, cite supporting evidence, and propose the next AR Specialist action.",
    },
  ],
  datastorePackaging: {
    alloydb: {
      database: "dispute_resolution_agent",
      schemas: [
        "highradius",
        "sap_s_4hana_fi",
        "salesforce",
      ],
    },
    bigquery: {
      dataset: "finance_dispute_resolution_agent",
      tables: [
        "kpi_summary",
        "evidence_index",
      ],
    },
    cloudStorage: {
      bucketSuffix: "dispute-resolution-agent-evidence",
      prefixes: [
        "documents",
        "audit-trails",
        "exports",
      ],
    },
    apis: {
      serviceName: "dispute-resolution-agent-source-adapters",
      deploymentTarget: "cloud_run",
    },
  },
  validation: {
    smokePrompt: "Run the Dispute Resolution Agent workflow and cite source-system evidence for every claim.",
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

export const DisputeResolutionAgent = () => (
  <UseCaseSlide
    title="Dispute Resolution Agent"
    subtitle="A-2306 - AR & Collections"
    icon={Scale}
    domainId="domain-23"
    layer="Layer 3: Custom ADK"
    persona="AR Specialist"
    systems={["HighRadius", "SAP S/4HANA FI", "Salesforce", "BigQuery", "Vertex AI"]}
    kpis={[
      { label: "Resolution cycle time", before: "15-20 days", after: "3-5 days" },
      { label: "Invalid disputes accepted", before: "18%", after: "4%" },
      { label: "Dispute root cause visibility", before: "Manual categorization", after: "ML-driven pattern detection" },
    ]}
    triggerType="event"
    swimlane={swimlane}
    flow={flow}
    architecture={architecture}
    hitl={{ actor: "AR Specialist", action: "Approve resolution recommendation", description: "AR Specialist reviews evidence-based resolution recommendation and approves credit, partial credit, or rejection with supporting rationale." }}
    statusQuo={[
      "Disputes investigated manually by pulling delivery records, contracts, and emails from 3+ systems.",
      "Resolution often defaults to customer credit to preserve the relationship, even when the claim is invalid.",
      "No systematic pattern detection across disputes to identify root causes like recurring quality issues."
    ]}
    agentification={[
      "Gemini cross-references delivery records, contracts, and customer communications to build evidence-based resolution recommendations.",
      "ML clustering reveals dispute patterns -- 40% of quality disputes trace to the same supplier component -- enabling upstream fixes.",
      "Evidence-based resolutions reduce invalid credit acceptance from 18% to 4%, recovering $2M+ annually."
    ]}
  />
);
