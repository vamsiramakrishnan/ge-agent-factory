import React from "react";
import { UseCaseSlide } from "../../../agent/UseCaseSlide";
import { FlowStep } from "../../../agent/ProcessFlow";
import { SwimlaneFlow } from "../../../agent/SwimlaneFlow";
import { AgentArchitecture, UseCaseGenerationSpec, AgentBehaviorContract} from "../../../../types/architecture";
import { BookOpen, Database, Zap, Search, CheckCircle } from "lucide-react";

const swimlane: SwimlaneFlow = {
  nodes: [
    { id: "s1", label: "Source Transaction", lane: "system", type: "trigger" },
    { id: "a1", label: "Rule Matching", lane: "agent", type: "action" },
    { id: "a2", label: "Classification", lane: "agent", type: "action" },
    { id: "a3", label: "JE Posted", lane: "agent", type: "output" },
    { id: "h1", label: "Accountant Reviews", lane: "human", type: "hitl" },
  ],
  connections: [["s1", "a1"], ["a1", "a2"], ["a2", "a3"], ["a3", "h1"]],
};

const flow: FlowStep[] = [
  { label: "Transaction Intake", icon: Database, description: "Receive transactions from sub-ledgers and apply posting rules.", trigger: "Event", systems: ["SAP S/4HANA FI", "Oracle Financials"] },
  { label: "Auto-Classification", icon: Zap, description: "Pattern matching for recurring entries and auto-classification of GL accounts.", systems: ["BlackLine", "BigQuery"], integration: "ADK" },
  { label: "Non-Standard Handling", icon: Search, description: "Handle transactions that don't match posting rules by reading approval context.", systems: ["Vertex AI"] },
  { label: "Posting Confirmation", icon: CheckCircle, description: "Post journal entry to ERP with full audit trail.", output: "Posted JE" },
];

const architecture: AgentArchitecture = {
  connections: [
    { system: "SAP S/4HANA FI", description: "Sub-ledger transactions, GL posting rules, chart of accounts", direction: "bidirectional", protocol: "RFC/BAPI", category: "erp" },
    { system: "Oracle Financials", description: "Secondary ERP journal entries, cross-system postings", direction: "read", protocol: "REST API", category: "erp" },
    { system: "BlackLine", description: "Posting rule engine, reconciliation status, exception management", direction: "bidirectional", protocol: "REST API", category: "erp" },
    { system: "Vertex AI (Gemini)", description: "Non-standard transaction interpretation, approval context reading", direction: "bidirectional", protocol: "gRPC", category: "ai" },
  ],
  pipeline: [
    { label: "Transaction Reception", description: "Receive transactions from AP, AR, and other sub-ledgers. Apply standard posting rules from the chart of accounts.", systems: ["SAP S/4HANA FI", "Oracle Financials"], layer: "integration", dataIn: "Sub-ledger transactions", dataOut: "Classified transactions with posting rules" },
    { label: "Pattern Matching & Classification", description: "Match against recurring entry patterns, auto-classify GL accounts for standard transactions, detect anomalies in unusual postings.", systems: ["BlackLine", "BigQuery"], layer: "ml", dataIn: "Classified transactions", dataOut: "Auto-posted standard JEs + exceptions" },
    { label: "Non-Standard Interpretation", description: "Gemini handles transactions that don't match posting rules by reading approval emails and supporting documentation to determine correct GL classification.", systems: ["Vertex AI (Gemini)"], layer: "llm", dataIn: "Exception transactions + approval context", dataOut: "Correctly classified non-standard JEs" },
    { label: "Posting & Audit Trail", description: "Post journal entries to ERP with complete audit trail. Route non-standard entries to GL accountant for review.", systems: ["SAP S/4HANA FI", "BlackLine"], layer: "integration", dataIn: "All classified JEs", dataOut: "Posted entries with audit trail" },
  ],
};


const behaviorContract: AgentBehaviorContract = {
  role: "GL Accountant / Controller agent for the Journal Entry Auto-Posting workflow",
  primaryObjective: "Pattern matching auto-posts 92% of journal entries without manual intervention. Gemini reads approval context to correctly classify non-standard transactions automatically. so the GL Accountant / Controller can move the Auto-post rate KPI.",
  inScope: [
    "Pattern matching auto-posts 92% of journal entries without manual intervention",
    "Gemini reads approval context to correctly classify non-standard transactions automatically",
    "Full audit trail maintained with exception reasoning documented for each non-standard posting",
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
      description: "Retrieve gl entries from SAP S/4HANA FI for the Journal Entry Auto-Posting workflow.",
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
      name: "query_oracle_financials_oracle_financials_records",
      kind: "query",
      sourceSystemId: "oracle_financials",
      description: "Retrieve oracle financials records from Oracle Financials for the Journal Entry Auto-Posting workflow.",
      requiredInputs: [
        "lookup_key",
        "date_range",
      ],
      produces: [
        "oracle_financials_records_records",
        "oracle_financials_records_summary",
      ],
      evidenceEmitted: [
        "source_system_record",
      ],
    },
    {
      name: "query_blackline_reconciliations",
      kind: "query",
      sourceSystemId: "blackline",
      description: "Retrieve reconciliations from BlackLine for the Journal Entry Auto-Posting workflow.",
      requiredInputs: [
        "lookup_key",
        "date_range",
      ],
      produces: [
        "reconciliations_records",
        "reconciliations_summary",
      ],
      evidenceEmitted: [
        "source_system_record",
      ],
    },
    {
      name: "lookup_journal_entry_auto_posting_controls_playbook",
      kind: "evidence_lookup",
      sourceSystemId: "sap_s_4hana_fi",
      description: "Look up sections of the Journal Entry Auto-Posting Controls Playbook to cite in narrative output, escalation rationale, and audit evidence.",
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
      name: "action_sap_s_4hana_fi_match",
      kind: "action",
      sourceSystemId: "sap_s_4hana_fi",
      description: "Execute the match step in SAP S/4HANA FI after the agent has gathered evidence and validated escalation gates.",
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
      claim: "Auto-post rate moved from 40% manual toward 92% automated",
      mustCite: [
        "sap_s_4hana_fi.gl_entries",
        "oracle_financials.oracle_financials_records",
      ],
      sourceSystemIds: [
        "sap_s_4hana_fi",
        "oracle_financials",
      ],
    },
    {
      claim: "Exception resolution moved from Hours per item toward Minutes",
      mustCite: [
        "sap_s_4hana_fi.gl_entries",
        "oracle_financials.oracle_financials_records",
      ],
      sourceSystemIds: [
        "sap_s_4hana_fi",
        "oracle_financials",
      ],
    },
  ],
  escalationRules: [
    {
      trigger: "Auto-post rate regresses past the 40% manual baseline by more than 20%",
      action: "escalate_to_human",
      handoffTarget: "GL Accountant / Controller",
      rationale: "Significant regressions need human judgment before automated remediation runs against production records.",
    },
    {
      trigger: "Source-system evidence is incomplete or stale (>24h) for any required entity",
      action: "request_more_info",
      rationale: "Recommendations grounded in stale evidence misrepresent current state and undermine audit defensibility.",
    },
    {
      trigger: "Proposed match action lacks supporting evidence from at least two systems",
      action: "refuse",
      rationale: "Single-system evidence is insufficient to authorize external state changes without manual review.",
    },
  ],
  refusalRules: [
    "Never fabricate metric values; only publish numbers derived from SAP S/4HANA FI (and other named systems) entities.",
    "Never bypass GL Accountant / Controller approval on escalation triggers, even when confidence is high.",
    "Never expose individual personal data (PII) in summaries; aggregate or pseudonymise before output.",
    "Never act on data older than the staleness threshold defined in the runbook without a fresh re-query.",
  ],
  goldenEvals: [
    {
      id: "journal-entry-auto-posting-end-to-end",
      prompt: "Run the Journal Entry Auto-Posting workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.",
      expectedToolCalls: [
        "query_sap_s_4hana_fi_gl_entries",
        "query_oracle_financials_oracle_financials_records",
        "query_blackline_reconciliations",
        "lookup_journal_entry_auto_posting_controls_playbook",
        "action_sap_s_4hana_fi_match",
      ],
      mustReferenceEntities: [
        "gl_entries",
        "oracle_financials_records",
        "reconciliations",
      ],
      mustCiteDocuments: [
        "journal-entry-auto-posting-controls-playbook",
      ],
      expectedActionOutcome: "Action match executed against SAP S/4HANA FI, with audit-trail entry and GL Accountant / Controller notified of outcomes.",
      forbiddenBehaviors: [
        "do not invent KPI numbers",
        "do not skip the evidence_lookup step before any recommendation",
        "do not execute match without two-system evidence",
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
    rationale: "Row counts sized for Journal Entry Auto-Posting so the agent can demonstrate the workflow against realistic transactional volume without simulating a production warehouse.",
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
      id: "oracle_financials",
      name: "Oracle Financials",
      owns: [
        "oracle_financials_records",
        "oracle_financials_events",
        "oracle_financials_audit_trail",
      ],
      protocol: "REST API",
      localBacking: [
        "alloydb",
      ],
      toolNames: [
        "query_oracle_financials_oracle_financials_records",
        "query_oracle_financials_oracle_financials_events",
        "query_oracle_financials_oracle_financials_audit_trail",
      ],
      evidence: [
        "source_system_record",
        "generated_audit_trail",
      ],
    },
    {
      id: "blackline",
      name: "BlackLine",
      owns: [
        "reconciliations",
        "matching_rules",
        "certifications",
      ],
      protocol: "REST API",
      localBacking: [
        "alloydb",
      ],
      toolNames: [
        "query_blackline_reconciliations",
        "query_blackline_matching_rules",
        "query_blackline_certifications",
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
      name: "oracle_financials_records",
      sourceSystemId: "oracle_financials",
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
      name: "oracle_financials_events",
      sourceSystemId: "oracle_financials",
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
          name: "oracle_financials_record_id",
          type: "ref",
          ref: "oracle_financials_records.id",
          required: true,
        },
      ],
    },
    {
      name: "oracle_financials_audit_trail",
      sourceSystemId: "oracle_financials",
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
      name: "reconciliations",
      sourceSystemId: "blackline",
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
      name: "matching_rules",
      sourceSystemId: "blackline",
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
      name: "certifications",
      sourceSystemId: "blackline",
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
  ],
  relationships: [
    {
      from: "oracle_financials_events.oracle_financials_record_id",
      to: "oracle_financials_records.id",
      cardinality: "many-to-one",
      orphanPolicy: "none",
    },
  ],
  documents: [
    {
      id: "journal-entry-auto-posting-controls-playbook",
      sourceSystemId: "sap_s_4hana_fi",
      type: "policy",
      title: "Journal Entry Auto-Posting Controls Playbook",
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
      id: "sap_s_4hana_fi_match_api",
      sourceSystemId: "sap_s_4hana_fi",
      method: "POST",
      path: "/api/sap_s_4hana_fi/match",
      description: "Synchronous endpoint the agent calls to match in SAP S/4HANA FI after evidence gating.",
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
      id: "journal-entry-auto-posting-baseline-gap",
      description: "Seed a realistic gap where Auto-post rate sits between 40% manual and 92% automated, so the agent can detect, narrate, and recommend remediation.",
      affectedEntities: [
        "gl_entries",
        "subledger_balances",
      ],
      discoveryPath: [
        "Inspect SAP S/4HANA FI records for the affected entities",
        "Compare against Oracle Financials historical baseline",
        "Generate a citation-backed recommendation",
      ],
      expectedEvidence: [
        "source-system record",
        "historical baseline metric",
        "generated audit trail",
      ],
      expectedRecommendation: "Explain the gap, cite supporting evidence, and propose the next GL Accountant / Controller action.",
    },
  ],
  datastorePackaging: {
    alloydb: {
      database: "journal_entry_auto_posting",
      schemas: [
        "sap_s_4hana_fi",
        "oracle_financials",
        "blackline",
      ],
    },
    bigquery: {
      dataset: "finance_journal_entry_auto_posting",
      tables: [
        "kpi_summary",
        "evidence_index",
      ],
    },
    cloudStorage: {
      bucketSuffix: "journal-entry-auto-posting-evidence",
      prefixes: [
        "documents",
        "audit-trails",
        "exports",
      ],
    },
    apis: {
      serviceName: "journal-entry-auto-posting-source-adapters",
      deploymentTarget: "cloud_run",
    },
  },
  validation: {
    smokePrompt: "Run the Journal Entry Auto-Posting workflow and cite source-system evidence for every claim.",
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

export const JournalEntryAutoPosting = () => (
  <UseCaseSlide
    title="Journal Entry Auto-Posting"
    subtitle="A-2101 • GL & Close"
    icon={BookOpen}
    domainId="domain-21"
    layer="Layer 3: Custom ADK"
    persona="GL Accountant / Controller"
    systems={["SAP S/4HANA FI", "Oracle Financials", "BlackLine", "Vertex AI"]}
    kpis={[
      { label: "Auto-post rate", before: "40% manual", after: "92% automated" },
      { label: "Exception resolution", before: "Hours per item", after: "Minutes" },
      { label: "Posting errors", before: "3-5% error rate", after: "<0.5%" },
    ]}
    triggerType="event"
    swimlane={swimlane}
    flow={flow}
    architecture={architecture}
    hitl={{ actor: "GL Accountant", action: "Review non-standard entries", description: "GL Accountant reviews non-standard journal entries that required LLM interpretation, validating GL classification before final posting." }}
    statusQuo={[
      "Non-standard transactions require manual review of approval emails to determine correct GL account.",
      "Recurring entries are often re-keyed manually each period despite identical posting patterns.",
      "Exception resolution takes hours as accountants chase approvals and supporting documentation."
    ]}
    agentification={[
      "Pattern matching auto-posts 92% of journal entries without manual intervention.",
      "Gemini reads approval context to correctly classify non-standard transactions automatically.",
      "Full audit trail maintained with exception reasoning documented for each non-standard posting."
    ]}
  />
);
