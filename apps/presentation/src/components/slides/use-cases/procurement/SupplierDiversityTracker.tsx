import React from "react";
import { UseCaseSlide } from "../../../agent/UseCaseSlide";
import { FlowStep } from "../../../agent/ProcessFlow";
import { SwimlaneFlow } from "../../../agent/SwimlaneFlow";
import { AgentArchitecture, UseCaseGenerationSpec, AgentBehaviorContract} from "../../../../types/architecture";
import { Users, Database, PieChart, FileText, BarChart3 } from "lucide-react";

const swimlane: SwimlaneFlow = {
  nodes: [
    { id: "s1", label: "Monthly Cycle", lane: "system", type: "trigger" },
    { id: "a1", label: "Certification Sync", lane: "agent", type: "action" },
    { id: "a2", label: "Spend Attribution", lane: "agent", type: "action" },
    { id: "a3", label: "Goal Tracking", lane: "agent", type: "action" },
    { id: "a4", label: "Diversity Report", lane: "agent", type: "output" },
  ],
  connections: [["s1", "a1"], ["a1", "a2"], ["a2", "a3"], ["a3", "a4"]],
};

const flow: FlowStep[] = [
  { label: "Certification Sync", icon: Database, description: "Diversity certifications synced from NMSDC, WBENC, and SBA against vendor master.", trigger: "Monthly", systems: ["Supplier.io", "NMSDC", "WBENC"] },
  { label: "Spend Attribution", icon: PieChart, description: "Spend attributed by diversity classification — MBE, WBE, SDVOB, HUBZone — with tier-2 aggregation.", systems: ["BigQuery", "SBA"], integration: "ADK" },
  { label: "Goal Analysis", icon: BarChart3, description: "Goal-vs-actual tracking with trend analysis and gap identification by category and business unit.", systems: ["BigQuery"] },
  { label: "Report Generation", icon: FileText, description: "Narrative diversity report generated for board and customer compliance reporting.", output: "Diversity Report" },
];

const architecture: AgentArchitecture = {
  connections: [
    { system: "Supplier.io", description: "Diversity certification data, supplier diversity profiles", direction: "read", protocol: "REST API", category: "market-data" },
    { system: "NMSDC/WBENC/SBA", description: "MBE, WBE, SDVOB, HUBZone certification registries", direction: "read", protocol: "REST API", category: "market-data" },
    { system: "Ariba/Coupa", description: "Supplier profiles, vendor master diversity attributes", direction: "read", protocol: "REST API", category: "erp" },
    { system: "BigQuery", description: "Spend attribution by diversity classification, goal tracking analytics", direction: "bidirectional", protocol: "BigQuery SQL", category: "analytics" },
    { system: "Vertex AI (Gemini)", description: "Narrative diversity report generation", direction: "bidirectional", protocol: "gRPC", category: "ai" },
  ],
  pipeline: [
    { label: "Certification Sync & Vendor Matching", description: "Sync diversity certification data from NMSDC, WBENC, and SBA registries. Match certifications against vendor master records in Ariba/Coupa. Flag expired or ambiguous certification statuses.", systems: ["Supplier.io", "NMSDC/WBENC/SBA", "Ariba/Coupa"], layer: "integration", dataIn: "Certification registry feeds + vendor master", dataOut: "Matched vendor-certification pairs with status" },
    { label: "Spend Attribution & Goal Tracking", description: "Attribute spend to certified diverse suppliers by classification (MBE/WBE/SDVOB/HUBZone). Aggregate tier-2 reporting from prime supplier submissions. Goal-vs-actual tracking with trend analysis by category and BU.", systems: ["BigQuery"], layer: "ml", dataIn: "Vendor-certification pairs + PO/invoice spend data", dataOut: "Diversity spend metrics with goal gap analysis" },
    { label: "Narrative Report Generation", description: "LLM generates board-ready diversity reports — 'Achieved 12.3% diverse spend this quarter, up from 10.8%, driven by new MBE supplier onboarded for logistics in the Southeast region.' Interprets ambiguous certification statuses for compliance reporting.", systems: ["Vertex AI (Gemini)"], layer: "llm", dataIn: "Diversity spend metrics + certification status + goals", dataOut: "Narrative diversity report for board/customer compliance" },
  ],
};


const behaviorContract: AgentBehaviorContract = {
  role: "Supplier Development Mgr agent for the Supplier Diversity Tracker workflow",
  primaryObjective: "Spend attribution engine maps every dollar to certified diverse suppliers with MBE/WBE/SDVOB/HUBZone classification. Tier-2 reporting aggregated from prime supplier submissions with certification cross-validation. so the Supplier Development Mgr can move the Diversity report generation KPI.",
  inScope: [
    "Spend attribution engine maps every dollar to certified diverse suppliers with MBE/WBE/SDVOB/HUBZone classification",
    "Tier-2 reporting aggregated from prime supplier submissions with certification cross-validation",
    "LLM generates narrative diversity reports — 'Achieved 12.3% diverse spend, up from 10.8%, driven by new MBE logistics supplier in the Southeast.'",
  ],
  outOfScope: [
    "Contract execution without legal review",
    "Supplier disqualification decisions (category lead retains authority)",
    "Single-source justification overrides above policy threshold",
  ],
  toolIntents: [
    {
      name: "query_supplier_io_supplier_io_records",
      kind: "query",
      sourceSystemId: "supplier_io",
      description: "Retrieve supplier io records from Supplier.io for the Supplier Diversity Tracker workflow.",
      requiredInputs: [
        "lookup_key",
        "date_range",
      ],
      produces: [
        "supplier_io_records_records",
        "supplier_io_records_summary",
      ],
      evidenceEmitted: [
        "source_system_record",
      ],
    },
    {
      name: "query_nmsdc_nmsdc_records",
      kind: "query",
      sourceSystemId: "nmsdc",
      description: "Retrieve nmsdc records from NMSDC for the Supplier Diversity Tracker workflow.",
      requiredInputs: [
        "lookup_key",
        "date_range",
      ],
      produces: [
        "nmsdc_records_records",
        "nmsdc_records_summary",
      ],
      evidenceEmitted: [
        "source_system_record",
      ],
    },
    {
      name: "query_wbenc_wbenc_records",
      kind: "query",
      sourceSystemId: "wbenc",
      description: "Retrieve wbenc records from WBENC for the Supplier Diversity Tracker workflow.",
      requiredInputs: [
        "lookup_key",
        "date_range",
      ],
      produces: [
        "wbenc_records_records",
        "wbenc_records_summary",
      ],
      evidenceEmitted: [
        "source_system_record",
      ],
    },
    {
      name: "query_sba_sba_records",
      kind: "query",
      sourceSystemId: "sba",
      description: "Retrieve sba records from SBA for the Supplier Diversity Tracker workflow.",
      requiredInputs: [
        "lookup_key",
        "date_range",
      ],
      produces: [
        "sba_records_records",
        "sba_records_summary",
      ],
      evidenceEmitted: [
        "source_system_record",
      ],
    },
    {
      name: "lookup_supplier_diversity_tracker_policy_guide",
      kind: "evidence_lookup",
      sourceSystemId: "bigquery",
      description: "Look up sections of the Supplier Diversity Tracker Procurement Policy Guide to cite in narrative output, escalation rationale, and audit evidence.",
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
      name: "action_supplier_io_generate",
      kind: "action",
      sourceSystemId: "supplier_io",
      description: "Execute the generate step in Supplier.io after the agent has gathered evidence and validated escalation gates.",
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
      claim: "Diversity report generation moved from 2 weeks manual toward Automated monthly",
      mustCite: [
        "supplier_io.supplier_io_records",
        "nmsdc.nmsdc_records",
      ],
      sourceSystemIds: [
        "supplier_io",
        "nmsdc",
      ],
    },
    {
      claim: "Certification accuracy moved from ~80% (stale data) toward 99%+ real-time sync",
      mustCite: [
        "supplier_io.supplier_io_records",
        "nmsdc.nmsdc_records",
      ],
      sourceSystemIds: [
        "supplier_io",
        "nmsdc",
      ],
    },
  ],
  escalationRules: [
    {
      trigger: "Diversity report generation regresses past the 2 weeks manual baseline by more than 20%",
      action: "escalate_to_human",
      handoffTarget: "Supplier Development Mgr",
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
    "Never fabricate metric values; only publish numbers derived from Supplier.io (and other named systems) entities.",
    "Never bypass Supplier Development Mgr approval on escalation triggers, even when confidence is high.",
    "Never expose individual personal data (PII) in summaries; aggregate or pseudonymise before output.",
    "Never act on data older than the staleness threshold defined in the runbook without a fresh re-query.",
  ],
  goldenEvals: [
    {
      id: "supplier-diversity-tracker-end-to-end",
      prompt: "Run the Supplier Diversity Tracker workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.",
      expectedToolCalls: [
        "query_supplier_io_supplier_io_records",
        "query_nmsdc_nmsdc_records",
        "query_wbenc_wbenc_records",
        "query_sba_sba_records",
        "lookup_supplier_diversity_tracker_policy_guide",
        "action_supplier_io_generate",
      ],
      mustReferenceEntities: [
        "supplier_io_records",
        "nmsdc_records",
        "wbenc_records",
        "sba_records",
        "analytics_events",
      ],
      mustCiteDocuments: [
        "supplier-diversity-tracker-policy-guide",
      ],
      expectedActionOutcome: "Action generate executed against Supplier.io, with audit-trail entry and Supplier Development Mgr notified of outcomes.",
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
    rationale: "Row counts sized for Supplier Diversity Tracker so the agent can demonstrate the workflow against realistic transactional volume without simulating a production warehouse.",
  },
  sourceSystems: [
    {
      id: "supplier_io",
      name: "Supplier.io",
      owns: [
        "supplier_io_records",
        "supplier_io_events",
        "supplier_io_audit_trail",
      ],
      protocol: "REST API",
      localBacking: [
        "alloydb",
      ],
      toolNames: [
        "query_supplier_io_supplier_io_records",
        "query_supplier_io_supplier_io_events",
        "query_supplier_io_supplier_io_audit_trail",
      ],
      evidence: [
        "source_system_record",
        "generated_audit_trail",
      ],
    },
    {
      id: "nmsdc",
      name: "NMSDC",
      owns: [
        "nmsdc_records",
        "nmsdc_events",
        "nmsdc_audit_trail",
      ],
      protocol: "REST API",
      localBacking: [
        "alloydb",
      ],
      toolNames: [
        "query_nmsdc_nmsdc_records",
        "query_nmsdc_nmsdc_events",
        "query_nmsdc_nmsdc_audit_trail",
      ],
      evidence: [
        "source_system_record",
        "generated_audit_trail",
      ],
    },
    {
      id: "wbenc",
      name: "WBENC",
      owns: [
        "wbenc_records",
        "wbenc_events",
        "wbenc_audit_trail",
      ],
      protocol: "REST API",
      localBacking: [
        "alloydb",
      ],
      toolNames: [
        "query_wbenc_wbenc_records",
        "query_wbenc_wbenc_events",
        "query_wbenc_wbenc_audit_trail",
      ],
      evidence: [
        "source_system_record",
        "generated_audit_trail",
      ],
    },
    {
      id: "sba",
      name: "SBA",
      owns: [
        "sba_records",
        "sba_events",
        "sba_audit_trail",
      ],
      protocol: "REST API",
      localBacking: [
        "alloydb",
      ],
      toolNames: [
        "query_sba_sba_records",
        "query_sba_sba_events",
        "query_sba_sba_audit_trail",
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
      name: "supplier_io_records",
      sourceSystemId: "supplier_io",
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
      name: "supplier_io_events",
      sourceSystemId: "supplier_io",
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
          name: "supplier_io_record_id",
          type: "ref",
          ref: "supplier_io_records.id",
          required: true,
        },
      ],
    },
    {
      name: "supplier_io_audit_trail",
      sourceSystemId: "supplier_io",
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
      name: "nmsdc_records",
      sourceSystemId: "nmsdc",
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
      name: "nmsdc_events",
      sourceSystemId: "nmsdc",
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
          name: "nmsdc_record_id",
          type: "ref",
          ref: "nmsdc_records.id",
          required: true,
        },
      ],
    },
    {
      name: "nmsdc_audit_trail",
      sourceSystemId: "nmsdc",
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
      name: "wbenc_records",
      sourceSystemId: "wbenc",
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
      name: "wbenc_events",
      sourceSystemId: "wbenc",
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
          name: "wbenc_record_id",
          type: "ref",
          ref: "wbenc_records.id",
          required: true,
        },
      ],
    },
    {
      name: "wbenc_audit_trail",
      sourceSystemId: "wbenc",
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
      name: "sba_records",
      sourceSystemId: "sba",
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
      name: "sba_events",
      sourceSystemId: "sba",
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
          name: "sba_record_id",
          type: "ref",
          ref: "sba_records.id",
          required: true,
        },
      ],
    },
    {
      name: "sba_audit_trail",
      sourceSystemId: "sba",
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
      from: "supplier_io_events.supplier_io_record_id",
      to: "supplier_io_records.id",
      cardinality: "many-to-one",
      orphanPolicy: "none",
    },
    {
      from: "nmsdc_events.nmsdc_record_id",
      to: "nmsdc_records.id",
      cardinality: "many-to-one",
      orphanPolicy: "none",
    },
    {
      from: "wbenc_events.wbenc_record_id",
      to: "wbenc_records.id",
      cardinality: "many-to-one",
      orphanPolicy: "none",
    },
    {
      from: "sba_events.sba_record_id",
      to: "sba_records.id",
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
      id: "supplier-diversity-tracker-policy-guide",
      sourceSystemId: "bigquery",
      type: "policy",
      title: "Supplier Diversity Tracker Procurement Policy Guide",
      requiredSections: [
        "Sourcing principles",
        "Approval thresholds",
        "Supplier risk requirements",
        "Contract and compliance gates",
        "Exception handling",
      ],
      linkedEntities: [
        "supplier_io_records",
        "supplier_io_events",
        "supplier_io_audit_trail",
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
      id: "supplier_io_generate_api",
      sourceSystemId: "supplier_io",
      method: "POST",
      path: "/api/supplier_io/generate",
      description: "Synchronous endpoint the agent calls to generate in Supplier.io after evidence gating.",
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
      id: "supplier-diversity-tracker-baseline-gap",
      description: "Seed a realistic gap where Diversity report generation sits between 2 weeks manual and Automated monthly, so the agent can detect, narrate, and recommend remediation.",
      affectedEntities: [
        "supplier_io_records",
        "supplier_io_events",
      ],
      discoveryPath: [
        "Inspect Supplier.io records for the affected entities",
        "Compare against NMSDC historical baseline",
        "Generate a citation-backed recommendation",
      ],
      expectedEvidence: [
        "source-system record",
        "historical baseline metric",
        "generated audit trail",
      ],
      expectedRecommendation: "Explain the gap, cite supporting evidence, and propose the next Supplier Development Mgr action.",
    },
  ],
  datastorePackaging: {
    alloydb: {
      database: "supplier_diversity_tracker",
      schemas: [
        "supplier_io",
        "nmsdc",
        "wbenc",
        "sba",
      ],
    },
    bigquery: {
      dataset: "procurement_supplier_diversity_tracker",
      tables: [
        "kpi_summary",
        "evidence_index",
      ],
    },
    cloudStorage: {
      bucketSuffix: "supplier-diversity-tracker-evidence",
      prefixes: [
        "documents",
        "audit-trails",
        "exports",
      ],
    },
    apis: {
      serviceName: "supplier-diversity-tracker-source-adapters",
      deploymentTarget: "cloud_run",
    },
  },
  validation: {
    smokePrompt: "Run the Supplier Diversity Tracker workflow and cite source-system evidence for every claim.",
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

export const SupplierDiversityTracker = () => (
  <UseCaseSlide
    title="Supplier Diversity Tracker"
    subtitle="A-1304 • Supplier Discovery"
    icon={Users}
    domainId="domain-13"
    layer="Layer 4: Data Agent"
    persona="Supplier Development Mgr"
    systems={["Supplier.io", "NMSDC", "WBENC", "SBA", "BigQuery"]}
    kpis={[
      { label: "Diversity report generation", before: "2 weeks manual", after: "Automated monthly" },
      { label: "Certification accuracy", before: "~80% (stale data)", after: "99%+ real-time sync" },
      { label: "Tier-2 spend visibility", before: "None", after: "Full sub-tier tracking" },
    ]}
    triggerType="scheduled"
    swimlane={swimlane}
    flow={flow}
    architecture={architecture}
    statusQuo={[
      "Diversity certifications tracked in a spreadsheet updated quarterly — often stale or incomplete.",
      "Tier-2 diverse spend is self-reported by primes with no verification or aggregation.",
      "Board diversity reports assembled manually from fragmented data across business units."
    ]}
    agentification={[
      "Spend attribution engine maps every dollar to certified diverse suppliers with MBE/WBE/SDVOB/HUBZone classification.",
      "Tier-2 reporting aggregated from prime supplier submissions with certification cross-validation.",
      "LLM generates narrative diversity reports — 'Achieved 12.3% diverse spend, up from 10.8%, driven by new MBE logistics supplier in the Southeast.'"
    ]}
  />
);
