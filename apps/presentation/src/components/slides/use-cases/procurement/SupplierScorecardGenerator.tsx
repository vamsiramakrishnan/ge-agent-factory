import React from "react";
import { UseCaseSlide } from "../../../agent/UseCaseSlide";
import { FlowStep } from "../../../agent/ProcessFlow";
import { SwimlaneFlow } from "../../../agent/SwimlaneFlow";
import { AgentArchitecture, UseCaseGenerationSpec, AgentBehaviorContract} from "../../../../types/architecture";
import { Star, Database, BarChart3, FileText, Eye } from "lucide-react";

const swimlane: SwimlaneFlow = {
  nodes: [
    { id: "s1", label: "Quarterly Cycle", lane: "system", type: "trigger" },
    { id: "a1", label: "KPI Aggregation", lane: "agent", type: "action" },
    { id: "a2", label: "Peer Benchmark", lane: "agent", type: "action" },
    { id: "a3", label: "Commentary Gen", lane: "agent", type: "output" },
    { id: "s2", label: "Supplier Portal", lane: "system", type: "output" },
  ],
  connections: [["s1", "a1"], ["a1", "a2"], ["a2", "a3"], ["a3", "s2"]],
};

const flow: FlowStep[] = [
  { label: "KPI Extraction", icon: Database, description: "Quality PPM, OTIF, and pricing data pulled from ERP and procurement systems.", trigger: "Monthly/Quarterly", systems: ["SAP S/4HANA QM/MM", "Coupa"] },
  { label: "Trend & Benchmark", icon: BarChart3, description: "Weighted scoring, trend analysis, and peer benchmarking across category suppliers.", systems: ["BigQuery", "Looker"], integration: "Data Agent" },
  { label: "Scorecard Narrative", icon: FileText, description: "LLM generates commentary explaining the story behind the numbers with contextual insights.", systems: ["Vertex AI"] },
  { label: "Publish & Share", icon: Eye, description: "Scorecards published to supplier portal and distributed to category teams.", output: "Supplier Scorecard" },
];

const architecture: AgentArchitecture = {
  connections: [
    { system: "SAP S/4HANA QM/MM", description: "Quality PPM from QM, OTIF delivery metrics from MM, pricing data from FI", direction: "read", protocol: "REST API", category: "erp" },
    { system: "Coupa", description: "Procurement transaction data, supplier performance inputs", direction: "read", protocol: "REST API", category: "erp" },
    { system: "BigQuery", description: "KPI aggregation, weighted scoring, trend analytics, peer benchmarking", direction: "bidirectional", protocol: "BigQuery SQL", category: "analytics" },
    { system: "Looker", description: "Scorecard visualization, trend dashboards, peer comparison views", direction: "write", protocol: "REST API", category: "analytics" },
    { system: "Vertex AI (Gemini)", description: "Scorecard commentary generation, performance contextualization", direction: "bidirectional", protocol: "gRPC", category: "ai" },
    { system: "Supplier Portal", description: "Published scorecards for supplier self-service access", direction: "write", protocol: "REST API", category: "collaboration" },
  ],
  pipeline: [
    { label: "KPI Data Extraction", description: "Pull quality PPM from SAP QM, OTIF from MM, and pricing from FI. Aggregate procurement data from Coupa. Consolidate into BigQuery for unified KPI computation.", systems: ["SAP S/4HANA QM/MM", "Coupa", "BigQuery"], layer: "integration", dataIn: "Raw quality, delivery, and pricing data from ERP", dataOut: "Unified KPI dataset by supplier × period" },
    { label: "Scoring & Benchmarking", description: "Automated weighted scoring across KPI dimensions. Statistical significance testing on performance changes to separate real shifts from noise. Peer benchmarking across suppliers in the same category.", systems: ["BigQuery", "Looker"], layer: "ml", dataIn: "KPI dataset by supplier", dataOut: "Weighted scores with trend analysis and peer rankings" },
    { label: "Narrative Commentary Generation", description: "Gemini generates scorecard commentary explaining the numbers: 'OTIF dropped from 96% to 89% — driven by a single large order requiring 3 partial shipments due to raw material shortage, not a systemic delivery issue.' Contextualizes performance against peers.", systems: ["Vertex AI (Gemini)"], layer: "llm", dataIn: "Weighted scores + trend data + peer benchmarks", dataOut: "Scorecards with contextual narrative commentary" },
    { label: "Publish & Distribute", description: "Scorecards published to supplier portal for self-service access and distributed to category teams via Looker dashboards.", systems: ["Supplier Portal", "Looker"], layer: "integration", dataIn: "Completed scorecards with commentary", dataOut: "Published scorecards on portal and dashboards" },
  ],
};


const behaviorContract: AgentBehaviorContract = {
  role: "Supplier Relationship Manager agent for the Supplier Scorecard Generator workflow",
  primaryObjective: "Automated KPI aggregation with statistical significance testing on performance changes — flags real shifts vs. noise. LLM generates scorecard commentary: 'OTIF dropped from 96% to 89% — driven by a single large order requiring 3 partial shipments due to raw material shortage, not systemic.' so the Supplier Relationship Manager can move the Scorecard cycle time KPI.",
  inScope: [
    "Automated KPI aggregation with statistical significance testing on performance changes — flags real shifts vs. noise",
    "LLM generates scorecard commentary: 'OTIF dropped from 96% to 89% — driven by a single large order requiring 3 partial shipments due to raw material shortage, not systemic.'",
    "Contextualizes performance against peers: 'Quality PPM of 250 seems high, but peer average for similar complexity machined components is 300.'",
  ],
  outOfScope: [
    "Contract execution without legal review",
    "Supplier disqualification decisions (category lead retains authority)",
    "Single-source justification overrides above policy threshold",
  ],
  toolIntents: [
    {
      name: "query_sap_s_4hana_qm_mm_sap_s_4hana_qm_mm_records",
      kind: "query",
      sourceSystemId: "sap_s_4hana_qm_mm",
      description: "Retrieve sap s 4hana qm mm records from SAP S/4HANA QM/MM for the Supplier Scorecard Generator workflow.",
      requiredInputs: [
        "lookup_key",
        "date_range",
      ],
      produces: [
        "sap_s_4hana_qm_mm_records_records",
        "sap_s_4hana_qm_mm_records_summary",
      ],
      evidenceEmitted: [
        "source_system_record",
      ],
    },
    {
      name: "query_coupa_requisitions",
      kind: "query",
      sourceSystemId: "coupa",
      description: "Retrieve requisitions from Coupa for the Supplier Scorecard Generator workflow.",
      requiredInputs: [
        "lookup_key",
        "date_range",
      ],
      produces: [
        "requisitions_records",
        "requisitions_summary",
      ],
      evidenceEmitted: [
        "source_system_record",
      ],
    },
    {
      name: "query_supplier_portal_supplier_portal_records",
      kind: "query",
      sourceSystemId: "supplier_portal",
      description: "Retrieve supplier portal records from Supplier Portal for the Supplier Scorecard Generator workflow.",
      requiredInputs: [
        "lookup_key",
        "date_range",
      ],
      produces: [
        "supplier_portal_records_records",
        "supplier_portal_records_summary",
      ],
      evidenceEmitted: [
        "source_system_record",
      ],
    },
    {
      name: "query_bigquery_analytics_events",
      kind: "query",
      sourceSystemId: "bigquery",
      description: "Retrieve analytics events from BigQuery for the Supplier Scorecard Generator workflow.",
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
      name: "lookup_supplier_scorecard_generator_policy_guide",
      kind: "evidence_lookup",
      sourceSystemId: "bigquery",
      description: "Look up sections of the Supplier Scorecard Generator Procurement Policy Guide to cite in narrative output, escalation rationale, and audit evidence.",
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
      name: "action_sap_s_4hana_qm_mm_generate",
      kind: "action",
      sourceSystemId: "sap_s_4hana_qm_mm",
      description: "Execute the generate step in SAP S/4HANA QM/MM after the agent has gathered evidence and validated escalation gates.",
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
      claim: "Scorecard cycle time moved from 5-7 days manual toward Automated overnight",
      mustCite: [
        "sap_s_4hana_qm_mm.sap_s_4hana_qm_mm_records",
        "coupa.requisitions",
      ],
      sourceSystemIds: [
        "sap_s_4hana_qm_mm",
        "coupa",
      ],
    },
    {
      claim: "KPI data sources moved from 3-4 siloed toward 12+ integrated",
      mustCite: [
        "sap_s_4hana_qm_mm.sap_s_4hana_qm_mm_records",
        "coupa.requisitions",
      ],
      sourceSystemIds: [
        "sap_s_4hana_qm_mm",
        "coupa",
      ],
    },
  ],
  escalationRules: [
    {
      trigger: "Scorecard cycle time regresses past the 5-7 days manual baseline by more than 20%",
      action: "escalate_to_human",
      handoffTarget: "Supplier Relationship Manager",
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
    "Never fabricate metric values; only publish numbers derived from SAP S/4HANA QM/MM (and other named systems) entities.",
    "Never bypass Supplier Relationship Manager approval on escalation triggers, even when confidence is high.",
    "Never expose individual personal data (PII) in summaries; aggregate or pseudonymise before output.",
    "Never act on data older than the staleness threshold defined in the runbook without a fresh re-query.",
  ],
  goldenEvals: [
    {
      id: "supplier-scorecard-generator-end-to-end",
      prompt: "Run the Supplier Scorecard Generator workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.",
      expectedToolCalls: [
        "query_sap_s_4hana_qm_mm_sap_s_4hana_qm_mm_records",
        "query_coupa_requisitions",
        "query_supplier_portal_supplier_portal_records",
        "query_bigquery_analytics_events",
        "lookup_supplier_scorecard_generator_policy_guide",
        "action_sap_s_4hana_qm_mm_generate",
      ],
      mustReferenceEntities: [
        "sap_s_4hana_qm_mm_records",
        "requisitions",
        "supplier_portal_records",
        "analytics_events",
        "dashboards",
      ],
      mustCiteDocuments: [
        "supplier-scorecard-generator-policy-guide",
      ],
      expectedActionOutcome: "Action generate executed against SAP S/4HANA QM/MM, with audit-trail entry and Supplier Relationship Manager notified of outcomes.",
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
    rationale: "Row counts sized for Supplier Scorecard Generator so the agent can demonstrate the workflow against realistic transactional volume without simulating a production warehouse.",
  },
  sourceSystems: [
    {
      id: "sap_s_4hana_qm_mm",
      name: "SAP S/4HANA QM/MM",
      owns: [
        "sap_s_4hana_qm_mm_records",
        "sap_s_4hana_qm_mm_events",
        "sap_s_4hana_qm_mm_audit_trail",
      ],
      protocol: "RFC/BAPI",
      localBacking: [
        "alloydb",
      ],
      toolNames: [
        "query_sap_s_4hana_qm_mm_sap_s_4hana_qm_mm_records",
        "query_sap_s_4hana_qm_mm_sap_s_4hana_qm_mm_events",
        "query_sap_s_4hana_qm_mm_sap_s_4hana_qm_mm_audit_trail",
      ],
      evidence: [
        "source_system_record",
        "generated_audit_trail",
      ],
    },
    {
      id: "coupa",
      name: "Coupa",
      owns: [
        "requisitions",
        "purchase_orders",
        "invoices",
      ],
      protocol: "REST API",
      localBacking: [
        "alloydb",
      ],
      toolNames: [
        "query_coupa_requisitions",
        "query_coupa_purchase_orders",
        "query_coupa_invoices",
      ],
      evidence: [
        "source_system_record",
        "generated_audit_trail",
      ],
    },
    {
      id: "supplier_portal",
      name: "Supplier Portal",
      owns: [
        "supplier_portal_records",
        "supplier_portal_events",
        "supplier_portal_audit_trail",
      ],
      protocol: "REST API",
      localBacking: [
        "alloydb",
      ],
      toolNames: [
        "query_supplier_portal_supplier_portal_records",
        "query_supplier_portal_supplier_portal_events",
        "query_supplier_portal_supplier_portal_audit_trail",
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
      name: "sap_s_4hana_qm_mm_records",
      sourceSystemId: "sap_s_4hana_qm_mm",
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
      name: "sap_s_4hana_qm_mm_events",
      sourceSystemId: "sap_s_4hana_qm_mm",
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
          name: "sap_s_4hana_qm_mm_record_id",
          type: "ref",
          ref: "sap_s_4hana_qm_mm_records.id",
          required: true,
        },
      ],
    },
    {
      name: "sap_s_4hana_qm_mm_audit_trail",
      sourceSystemId: "sap_s_4hana_qm_mm",
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
      name: "requisitions",
      sourceSystemId: "coupa",
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
      name: "purchase_orders",
      sourceSystemId: "coupa",
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
      name: "invoices",
      sourceSystemId: "coupa",
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
      name: "supplier_portal_records",
      sourceSystemId: "supplier_portal",
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
          type: "company.name",
          required: true,
        },
        {
          name: "category",
          type: "enum",
          values: [
            "IT",
            "Consulting",
            "Manufacturing",
            "Logistics",
            "Facilities",
            "Marketing",
          ],
          required: true,
        },
        {
          name: "rating",
          type: "number",
          min: 1,
          max: 5,
          required: true,
        },
        {
          name: "annual_spend",
          type: "number",
          min: 10000,
          max: 5000000,
          required: true,
        },
        {
          name: "risk_score",
          type: "enum",
          values: [
            "low",
            "medium",
            "high",
          ],
          weights: [
            0.5,
            0.35,
            0.15,
          ],
          required: true,
        },
        {
          name: "status",
          type: "enum",
          values: [
            "active",
            "pending_review",
            "terminated",
          ],
          required: true,
        },
        {
          name: "onboarded_on",
          type: "date",
          required: true,
        },
      ],
    },
    {
      name: "supplier_portal_events",
      sourceSystemId: "supplier_portal",
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
          type: "company.name",
          required: true,
        },
        {
          name: "category",
          type: "enum",
          values: [
            "IT",
            "Consulting",
            "Manufacturing",
            "Logistics",
            "Facilities",
            "Marketing",
          ],
          required: true,
        },
        {
          name: "rating",
          type: "number",
          min: 1,
          max: 5,
          required: true,
        },
        {
          name: "annual_spend",
          type: "number",
          min: 10000,
          max: 5000000,
          required: true,
        },
        {
          name: "risk_score",
          type: "enum",
          values: [
            "low",
            "medium",
            "high",
          ],
          weights: [
            0.5,
            0.35,
            0.15,
          ],
          required: true,
        },
        {
          name: "status",
          type: "enum",
          values: [
            "active",
            "pending_review",
            "terminated",
          ],
          required: true,
        },
        {
          name: "onboarded_on",
          type: "date",
          required: true,
        },
        {
          name: "supplier_portal_record_id",
          type: "ref",
          ref: "supplier_portal_records.id",
          required: true,
        },
      ],
    },
    {
      name: "supplier_portal_audit_trail",
      sourceSystemId: "supplier_portal",
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
          type: "company.name",
          required: true,
        },
        {
          name: "category",
          type: "enum",
          values: [
            "IT",
            "Consulting",
            "Manufacturing",
            "Logistics",
            "Facilities",
            "Marketing",
          ],
          required: true,
        },
        {
          name: "rating",
          type: "number",
          min: 1,
          max: 5,
          required: true,
        },
        {
          name: "annual_spend",
          type: "number",
          min: 10000,
          max: 5000000,
          required: true,
        },
        {
          name: "risk_score",
          type: "enum",
          values: [
            "low",
            "medium",
            "high",
          ],
          weights: [
            0.5,
            0.35,
            0.15,
          ],
          required: true,
        },
        {
          name: "status",
          type: "enum",
          values: [
            "active",
            "pending_review",
            "terminated",
          ],
          required: true,
        },
        {
          name: "onboarded_on",
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
      from: "sap_s_4hana_qm_mm_events.sap_s_4hana_qm_mm_record_id",
      to: "sap_s_4hana_qm_mm_records.id",
      cardinality: "many-to-one",
      orphanPolicy: "none",
    },
    {
      from: "supplier_portal_events.supplier_portal_record_id",
      to: "supplier_portal_records.id",
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
      id: "supplier-scorecard-generator-policy-guide",
      sourceSystemId: "bigquery",
      type: "policy",
      title: "Supplier Scorecard Generator Procurement Policy Guide",
      requiredSections: [
        "Sourcing principles",
        "Approval thresholds",
        "Supplier risk requirements",
        "Contract and compliance gates",
        "Exception handling",
      ],
      linkedEntities: [
        "sap_s_4hana_qm_mm_records",
        "sap_s_4hana_qm_mm_events",
        "sap_s_4hana_qm_mm_audit_trail",
      ],
      minimumWordCount: 500,
      citationAnchors: [
        "sourcing",
        "approvals",
        "supplier-risk",
        "exceptions",
      ],
    },
  ],
  apis: [
    {
      id: "sap_s_4hana_qm_mm_generate_api",
      sourceSystemId: "sap_s_4hana_qm_mm",
      method: "POST",
      path: "/api/sap_s_4hana_qm_mm/generate",
      description: "Synchronous endpoint the agent calls to generate in SAP S/4HANA QM/MM after evidence gating.",
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
      id: "supplier-scorecard-generator-baseline-gap",
      description: "Seed a realistic gap where Scorecard cycle time sits between 5-7 days manual and Automated overnight, so the agent can detect, narrate, and recommend remediation.",
      affectedEntities: [
        "sap_s_4hana_qm_mm_records",
        "sap_s_4hana_qm_mm_events",
      ],
      discoveryPath: [
        "Inspect SAP S/4HANA QM/MM records for the affected entities",
        "Compare against Coupa historical baseline",
        "Generate a citation-backed recommendation",
      ],
      expectedEvidence: [
        "source-system record",
        "historical baseline metric",
        "generated audit trail",
      ],
      expectedRecommendation: "Explain the gap, cite supporting evidence, and propose the next Supplier Relationship Manager action.",
    },
  ],
  datastorePackaging: {
    alloydb: {
      database: "supplier_scorecard_generator",
      schemas: [
        "sap_s_4hana_qm_mm",
        "coupa",
        "supplier_portal",
      ],
    },
    bigquery: {
      dataset: "procurement_supplier_scorecard_generator",
      tables: [
        "kpi_summary",
        "evidence_index",
      ],
    },
    cloudStorage: {
      bucketSuffix: "supplier-scorecard-generator-evidence",
      prefixes: [
        "documents",
        "audit-trails",
        "exports",
      ],
    },
    apis: {
      serviceName: "supplier-scorecard-generator-source-adapters",
      deploymentTarget: "cloud_run",
    },
  },
  validation: {
    smokePrompt: "Run the Supplier Scorecard Generator workflow and cite source-system evidence for every claim.",
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

export const SupplierScorecardGenerator = () => (
  <UseCaseSlide
    title="Supplier Scorecard Generator"
    subtitle="A-1701 • Supplier Performance"
    icon={Star}
    domainId="domain-17"
    layer="Layer 4: Data Agent"
    persona="Supplier Relationship Manager"
    systems={["SAP S/4HANA QM/MM", "Coupa", "Supplier Portal", "BigQuery", "Looker"]}
    kpis={[
      { label: "Scorecard cycle time", before: "5-7 days manual", after: "Automated overnight" },
      { label: "KPI data sources", before: "3-4 siloed", after: "12+ integrated" },
      { label: "Commentary quality", before: "Numbers only", after: "Contextual narrative" },
    ]}
    triggerType="scheduled"
    swimlane={swimlane}
    flow={flow}
    architecture={architecture}
    statusQuo={[
      "Scorecards assembled manually in Excel from 3+ disconnected systems — quality from QM, delivery from MM, pricing from FI.",
      "Commentary is generic boilerplate or skipped entirely — numbers without narrative context.",
      "Peer benchmarking requires ad-hoc analysis that rarely happens due to time constraints."
    ]}
    agentification={[
      "Automated KPI aggregation with statistical significance testing on performance changes — flags real shifts vs. noise.",
      "LLM generates scorecard commentary: 'OTIF dropped from 96% to 89% — driven by a single large order requiring 3 partial shipments due to raw material shortage, not systemic.'",
      "Contextualizes performance against peers: 'Quality PPM of 250 seems high, but peer average for similar complexity machined components is 300.'"
    ]}
  />
);
