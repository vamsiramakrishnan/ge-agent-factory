import React from "react";
import { UseCaseSlide } from "../../../agent/UseCaseSlide";
import { FlowStep } from "../../../agent/ProcessFlow";
import { SwimlaneFlow } from "../../../agent/SwimlaneFlow";
import { AgentArchitecture, UseCaseGenerationSpec, AgentBehaviorContract} from "../../../../types/architecture";
import { Lightbulb, Upload, Microscope, Brain, CheckCircle } from "lucide-react";

const swimlane: SwimlaneFlow = {
  nodes: [
    { id: "s1", label: "Proposal Submitted", lane: "system", type: "trigger" },
    { id: "a1", label: "Pipeline Triage", lane: "agent", type: "action" },
    { id: "a2", label: "Feasibility Reason", lane: "agent", type: "action" },
    { id: "a3", label: "Value Assessment", lane: "agent", type: "output" },
    { id: "h1", label: "Cat Mgr Evaluates", lane: "human", type: "hitl" },
  ],
  connections: [["s1", "a1"], ["a1", "a2"], ["a2", "a3"], ["a3", "h1"]],
};

const flow: FlowStep[] = [
  { label: "Proposal Intake", icon: Upload, description: "Innovation proposal received via supplier portal and logged in tracking system.", trigger: "Proposal submitted", systems: ["Supplier Portal", "Innovation Mgmt"] },
  { label: "Technical Triage", icon: Microscope, description: "Idea categorized (material substitution, process improvement, design-to-cost) and routed for evaluation.", systems: ["Contract Data", "ECOs"], integration: "ADK" },
  { label: "Feasibility Reasoning", icon: Brain, description: "LLM evaluates technical proposals — Inconel 718 vs titanium substitution with fatigue resistance trade-off analysis.", systems: ["Vertex AI"] },
  { label: "Category Manager Review", icon: CheckCircle, description: "Category Manager reviews value engineering assessment with payback period and requalification cost analysis.", output: "Innovation Decision" },
];

const architecture: AgentArchitecture = {
  connections: [
    { system: "Supplier Portal", description: "Innovation proposal submission, status tracking, supplier communication", direction: "read", protocol: "REST API", category: "collaboration" },
    { system: "Innovation Management", description: "Proposal pipeline tracking, idea categorization, decision workflow", direction: "bidirectional", protocol: "REST API", category: "erp" },
    { system: "Contract Data", description: "Existing pricing, material specifications, volume commitments", direction: "read", protocol: "REST API", category: "clm" },
    { system: "Engineering Change Orders", description: "ECO history, requalification requirements, technical specifications", direction: "read", protocol: "REST API", category: "erp" },
    { system: "Vertex AI (Gemini)", description: "Technical feasibility reasoning, value engineering assessment, payback analysis", direction: "bidirectional", protocol: "gRPC", category: "ai" },
  ],
  pipeline: [
    { label: "Proposal Intake & Triage", description: "Receive innovation proposals via supplier portal and log in tracking system. Categorize proposals (material substitution, process improvement, design-to-cost) and route for technical evaluation.", systems: ["Supplier Portal", "Innovation Management"], layer: "integration", dataIn: "Supplier innovation proposals", dataOut: "Categorized proposals in evaluation pipeline" },
    { label: "Pipeline Analytics & Categorization", description: "Pipeline management metrics — proposals received, accepted, implemented, savings realized. Idea categorization and tracking through decision pipeline. Historical success rates by proposal type.", systems: ["Innovation Management", "Contract Data"], layer: "ml", dataIn: "Proposal pipeline + historical outcomes", dataOut: "Pipeline metrics with success probability scores" },
    { label: "Feasibility Reasoning & Value Assessment", description: "Gemini evaluates technical proposals: 'Inconel 718 has adequate tensile strength but lower fatigue resistance — substitution works for non-critical structural fasteners but not engine mount applications.' Quantifies value engineering: 'Material savings is $2.40/unit but requalification testing costs $85K — payback period is 14 months at current volumes.'", systems: ["Vertex AI (Gemini)"], layer: "llm", dataIn: "Technical proposals + specifications + cost data", dataOut: "Feasibility assessment with payback analysis for Category Manager" },
  ],
};


const behaviorContract: AgentBehaviorContract = {
  role: "Category Manager agent for the Innovation & Value Engineering Tracker workflow",
  primaryObjective: "LLM evaluates technical proposals with domain understanding: 'Inconel 718 has adequate tensile strength for this application but lower fatigue resistance — substitution works for non-critical structural fasteners but not engine mount applications.' Quantifies value engineering with proper scope: 'Material savings is $2.40/unit, but requalification testing costs $85K — payback period is 14 months at current volumes.' so the Category Manager can move the Proposal evaluation time KPI.",
  inScope: [
    "LLM evaluates technical proposals with domain understanding: 'Inconel 718 has adequate tensile strength for this application but lower fatigue resistance — substitution works for non-critical structural fasteners but not engine mount applications.'",
    "Quantifies value engineering with proper scope: 'Material savings is $2.40/unit, but requalification testing costs $85K — payback period is 14 months at current volumes.'",
    "Manages innovation pipeline end-to-end: proposals received, accepted, implemented, and savings realized — with categorization across material substitution, process improvement, and design-to-cost",
  ],
  outOfScope: [
    "Contract execution without legal review",
    "Supplier disqualification decisions (category lead retains authority)",
    "Single-source justification overrides above policy threshold",
  ],
  toolIntents: [
    {
      name: "query_supplier_portal_supplier_portal_records",
      kind: "query",
      sourceSystemId: "supplier_portal",
      description: "Retrieve supplier portal records from Supplier Portal for the Innovation & Value Engineering Tracker workflow.",
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
      name: "query_innovation_management_innovation_management_records",
      kind: "query",
      sourceSystemId: "innovation_management",
      description: "Retrieve innovation management records from Innovation Management for the Innovation & Value Engineering Tracker workflow.",
      requiredInputs: [
        "lookup_key",
        "date_range",
      ],
      produces: [
        "innovation_management_records_records",
        "innovation_management_records_summary",
      ],
      evidenceEmitted: [
        "source_system_record",
      ],
    },
    {
      name: "query_contract_data_contract_data_records",
      kind: "query",
      sourceSystemId: "contract_data",
      description: "Retrieve contract data records from Contract Data for the Innovation & Value Engineering Tracker workflow.",
      requiredInputs: [
        "lookup_key",
        "date_range",
      ],
      produces: [
        "contract_data_records_records",
        "contract_data_records_summary",
      ],
      evidenceEmitted: [
        "source_system_record",
      ],
    },
    {
      name: "query_engineering_change_orders_engineering_change_orders_records",
      kind: "query",
      sourceSystemId: "engineering_change_orders",
      description: "Retrieve engineering change orders records from Engineering Change Orders for the Innovation & Value Engineering Tracker workflow.",
      requiredInputs: [
        "lookup_key",
        "date_range",
      ],
      produces: [
        "engineering_change_orders_records_records",
        "engineering_change_orders_records_summary",
      ],
      evidenceEmitted: [
        "source_system_record",
      ],
    },
    {
      name: "lookup_innovation_value_engineering_tracker_policy_guide",
      kind: "evidence_lookup",
      sourceSystemId: "supplier_portal",
      description: "Look up sections of the Innovation & Value Engineering Tracker Procurement Policy Guide to cite in narrative output, escalation rationale, and audit evidence.",
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
      claim: "Proposal evaluation time moved from 4-6 weeks toward 3-5 days",
      mustCite: [
        "supplier_portal.supplier_portal_records",
        "innovation_management.innovation_management_records",
      ],
      sourceSystemIds: [
        "supplier_portal",
        "innovation_management",
      ],
    },
    {
      claim: "Innovation pipeline visibility moved from Scattered spreadsheets toward Unified tracker",
      mustCite: [
        "supplier_portal.supplier_portal_records",
        "innovation_management.innovation_management_records",
      ],
      sourceSystemIds: [
        "supplier_portal",
        "innovation_management",
      ],
    },
  ],
  escalationRules: [
    {
      trigger: "Proposal evaluation time regresses past the 4-6 weeks baseline by more than 20%",
      action: "escalate_to_human",
      handoffTarget: "Category Manager",
      rationale: "Significant regressions need human judgment before automated remediation runs against production records.",
    },
    {
      trigger: "Source-system evidence is incomplete or stale (>24h) for any required entity",
      action: "request_more_info",
      rationale: "Recommendations grounded in stale evidence misrepresent current state and undermine audit defensibility.",
    },
  ],
  refusalRules: [
    "Never fabricate metric values; only publish numbers derived from Supplier Portal (and other named systems) entities.",
    "Never bypass Category Manager approval on escalation triggers, even when confidence is high.",
    "Never expose individual personal data (PII) in summaries; aggregate or pseudonymise before output.",
    "Never act on data older than the staleness threshold defined in the runbook without a fresh re-query.",
  ],
  goldenEvals: [
    {
      id: "innovation-value-engineering-tracker-end-to-end",
      prompt: "Run the Innovation & Value Engineering Tracker workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.",
      expectedToolCalls: [
        "query_supplier_portal_supplier_portal_records",
        "query_innovation_management_innovation_management_records",
        "query_contract_data_contract_data_records",
        "query_engineering_change_orders_engineering_change_orders_records",
        "lookup_innovation_value_engineering_tracker_policy_guide",
      ],
      mustReferenceEntities: [
        "supplier_portal_records",
        "innovation_management_records",
        "contract_data_records",
        "engineering_change_orders_records",
      ],
      mustCiteDocuments: [
        "innovation-value-engineering-tracker-policy-guide",
      ],
      expectedActionOutcome: "Category Manager receives a fully-cited recommendation; no external state change without explicit approval.",
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
    rationale: "Row counts sized for Innovation & Value Engineering Tracker so the agent can demonstrate the workflow against realistic transactional volume without simulating a production warehouse.",
  },
  sourceSystems: [
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
      id: "innovation_management",
      name: "Innovation Management",
      owns: [
        "innovation_management_records",
        "innovation_management_events",
        "innovation_management_audit_trail",
      ],
      protocol: "REST API",
      localBacking: [
        "alloydb",
      ],
      toolNames: [
        "query_innovation_management_innovation_management_records",
        "query_innovation_management_innovation_management_events",
        "query_innovation_management_innovation_management_audit_trail",
      ],
      evidence: [
        "source_system_record",
        "generated_audit_trail",
      ],
    },
    {
      id: "contract_data",
      name: "Contract Data",
      owns: [
        "contract_data_records",
        "contract_data_events",
        "contract_data_audit_trail",
      ],
      protocol: "REST API",
      localBacking: [
        "alloydb",
      ],
      toolNames: [
        "query_contract_data_contract_data_records",
        "query_contract_data_contract_data_events",
        "query_contract_data_contract_data_audit_trail",
      ],
      evidence: [
        "source_system_record",
        "generated_audit_trail",
      ],
    },
    {
      id: "engineering_change_orders",
      name: "Engineering Change Orders",
      owns: [
        "engineering_change_orders_records",
        "engineering_change_orders_events",
        "engineering_change_orders_audit_trail",
      ],
      protocol: "REST API",
      localBacking: [
        "alloydb",
      ],
      toolNames: [
        "query_engineering_change_orders_engineering_change_orders_records",
        "query_engineering_change_orders_engineering_change_orders_events",
        "query_engineering_change_orders_engineering_change_orders_audit_trail",
      ],
      evidence: [
        "source_system_record",
        "generated_audit_trail",
      ],
    },
  ],
  entities: [
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
      name: "innovation_management_records",
      sourceSystemId: "innovation_management",
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
      name: "innovation_management_events",
      sourceSystemId: "innovation_management",
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
          name: "innovation_management_record_id",
          type: "ref",
          ref: "innovation_management_records.id",
          required: true,
        },
      ],
    },
    {
      name: "innovation_management_audit_trail",
      sourceSystemId: "innovation_management",
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
      name: "contract_data_records",
      sourceSystemId: "contract_data",
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
          name: "counterparty",
          type: "company.name",
          required: true,
        },
        {
          name: "value",
          type: "number",
          min: 10000,
          max: 5000000,
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
          name: "start_date",
          type: "date",
          required: true,
        },
        {
          name: "end_date",
          type: "date",
          required: true,
        },
        {
          name: "status",
          type: "enum",
          values: [
            "draft",
            "negotiating",
            "active",
            "expired",
            "terminated",
          ],
          required: true,
        },
        {
          name: "auto_renew",
          type: "boolean",
          trueRate: 0.4,
        },
      ],
    },
    {
      name: "contract_data_events",
      sourceSystemId: "contract_data",
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
          name: "counterparty",
          type: "company.name",
          required: true,
        },
        {
          name: "value",
          type: "number",
          min: 10000,
          max: 5000000,
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
          name: "start_date",
          type: "date",
          required: true,
        },
        {
          name: "end_date",
          type: "date",
          required: true,
        },
        {
          name: "status",
          type: "enum",
          values: [
            "draft",
            "negotiating",
            "active",
            "expired",
            "terminated",
          ],
          required: true,
        },
        {
          name: "auto_renew",
          type: "boolean",
          trueRate: 0.4,
        },
        {
          name: "contract_data_record_id",
          type: "ref",
          ref: "contract_data_records.id",
          required: true,
        },
      ],
    },
    {
      name: "contract_data_audit_trail",
      sourceSystemId: "contract_data",
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
          name: "counterparty",
          type: "company.name",
          required: true,
        },
        {
          name: "value",
          type: "number",
          min: 10000,
          max: 5000000,
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
          name: "start_date",
          type: "date",
          required: true,
        },
        {
          name: "end_date",
          type: "date",
          required: true,
        },
        {
          name: "status",
          type: "enum",
          values: [
            "draft",
            "negotiating",
            "active",
            "expired",
            "terminated",
          ],
          required: true,
        },
        {
          name: "auto_renew",
          type: "boolean",
          trueRate: 0.4,
        },
      ],
    },
    {
      name: "engineering_change_orders_records",
      sourceSystemId: "engineering_change_orders",
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
      name: "engineering_change_orders_events",
      sourceSystemId: "engineering_change_orders",
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
          name: "engineering_change_orders_record_id",
          type: "ref",
          ref: "engineering_change_orders_records.id",
          required: true,
        },
      ],
    },
    {
      name: "engineering_change_orders_audit_trail",
      sourceSystemId: "engineering_change_orders",
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
  ],
  relationships: [
    {
      from: "supplier_portal_events.supplier_portal_record_id",
      to: "supplier_portal_records.id",
      cardinality: "many-to-one",
      orphanPolicy: "none",
    },
    {
      from: "innovation_management_events.innovation_management_record_id",
      to: "innovation_management_records.id",
      cardinality: "many-to-one",
      orphanPolicy: "none",
    },
    {
      from: "contract_data_events.contract_data_record_id",
      to: "contract_data_records.id",
      cardinality: "many-to-one",
      orphanPolicy: "none",
    },
    {
      from: "engineering_change_orders_events.engineering_change_orders_record_id",
      to: "engineering_change_orders_records.id",
      cardinality: "many-to-one",
      orphanPolicy: "none",
    },
  ],
  documents: [
    {
      id: "innovation-value-engineering-tracker-policy-guide",
      sourceSystemId: "supplier_portal",
      type: "policy",
      title: "Innovation & Value Engineering Tracker Procurement Policy Guide",
      requiredSections: [
        "Sourcing principles",
        "Approval thresholds",
        "Supplier risk requirements",
        "Contract and compliance gates",
        "Exception handling",
      ],
      linkedEntities: [
        "supplier_portal_records",
        "supplier_portal_events",
        "supplier_portal_audit_trail",
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
  apis: [],
  anomalies: [
    {
      id: "innovation-value-engineering-tracker-baseline-gap",
      description: "Seed a realistic gap where Proposal evaluation time sits between 4-6 weeks and 3-5 days, so the agent can detect, narrate, and recommend remediation.",
      affectedEntities: [
        "supplier_portal_records",
        "supplier_portal_events",
      ],
      discoveryPath: [
        "Inspect Supplier Portal records for the affected entities",
        "Compare against Innovation Management historical baseline",
        "Generate a citation-backed recommendation",
      ],
      expectedEvidence: [
        "source-system record",
        "historical baseline metric",
        "generated audit trail",
      ],
      expectedRecommendation: "Explain the gap, cite supporting evidence, and propose the next Category Manager action.",
    },
  ],
  datastorePackaging: {
    alloydb: {
      database: "innovation_value_engineering_tracker",
      schemas: [
        "supplier_portal",
        "innovation_management",
        "contract_data",
        "engineering_change_orders",
      ],
    },
    bigquery: {
      dataset: "procurement_innovation_value_engineering_tracker",
      tables: [
        "kpi_summary",
        "evidence_index",
      ],
    },
    cloudStorage: {
      bucketSuffix: "innovation-value-engineering-tracker-evidence",
      prefixes: [
        "documents",
        "audit-trails",
        "exports",
      ],
    },
    apis: {
      serviceName: "innovation-value-engineering-tracker-source-adapters",
      deploymentTarget: "cloud_run",
    },
  },
  validation: {
    smokePrompt: "Run the Innovation & Value Engineering Tracker workflow and cite source-system evidence for every claim.",
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

export const InnovationValueEngTracker = () => (
  <UseCaseSlide
    title="Innovation & Value Engineering Tracker"
    subtitle="A-1707 • Supplier Performance"
    icon={Lightbulb}
    domainId="domain-17"
    layer="Layer 3: Custom ADK"
    persona="Category Manager"
    systems={["Supplier Portal", "Innovation Management", "Contract Data", "Engineering Change Orders"]}
    kpis={[
      { label: "Proposal evaluation time", before: "4-6 weeks", after: "3-5 days" },
      { label: "Innovation pipeline visibility", before: "Scattered spreadsheets", after: "Unified tracker" },
      { label: "Value engineering capture rate", before: "Ad hoc, ~20%", after: "Systematic, 75%+" },
    ]}
    triggerType="event"
    swimlane={swimlane}
    flow={flow}
    architecture={architecture}
    hitl={{ actor: "Category Manager", action: "Evaluate innovation proposal", description: "Category Manager reviews the technical feasibility assessment, cost-benefit analysis, and requalification requirements before accepting or declining the innovation proposal." }}
    statusQuo={[
      "Supplier innovation proposals tracked in scattered emails and spreadsheets — no unified pipeline visibility.",
      "Technical feasibility assessment requires weeks of back-and-forth between engineering and procurement.",
      "Value engineering savings captured ad hoc with no systematic process to quantify requalification costs against savings."
    ]}
    agentification={[
      "LLM evaluates technical proposals with domain understanding: 'Inconel 718 has adequate tensile strength for this application but lower fatigue resistance — substitution works for non-critical structural fasteners but not engine mount applications.'",
      "Quantifies value engineering with proper scope: 'Material savings is $2.40/unit, but requalification testing costs $85K — payback period is 14 months at current volumes.'",
      "Manages innovation pipeline end-to-end: proposals received, accepted, implemented, and savings realized — with categorization across material substitution, process improvement, and design-to-cost."
    ]}
  />
);
