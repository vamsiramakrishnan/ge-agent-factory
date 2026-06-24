import React from "react";
import { UseCaseSlide } from "../../../agent/UseCaseSlide";
import { FlowStep } from "../../../agent/ProcessFlow";
import { SwimlaneFlow } from "../../../agent/SwimlaneFlow";
import { AgentArchitecture, UseCaseGenerationSpec, AgentBehaviorContract} from "../../../../types/architecture";
import { Search, FileText, Database, Brain, ListChecks } from "lucide-react";

const swimlane: SwimlaneFlow = {
  nodes: [
    { id: "s1", label: "Sourcing Requirement", lane: "system", type: "trigger" },
    { id: "a1", label: "Query Translation", lane: "agent", type: "action" },
    { id: "a2", label: "Multi-Source Search", lane: "agent", type: "action" },
    { id: "a3", label: "Capability Matching", lane: "agent", type: "action" },
    { id: "a4", label: "Ranked Shortlist", lane: "agent", type: "output" },
  ],
  connections: [["s1", "a1"], ["a1", "a2"], ["a2", "a3"], ["a3", "a4"]],
};

const flow: FlowStep[] = [
  { label: "Requirement Intake", icon: FileText, description: "Natural-language sourcing requirement parsed into structured search parameters.", trigger: "On-demand", systems: ["SAP Ariba Discovery"] },
  { label: "Taxonomy Translation", icon: Brain, description: "LLM translates requirement across ThomasNet, Ariba, and D&B taxonomies simultaneously.", systems: ["Vertex AI", "Google Search API"], integration: "ADK" },
  { label: "Semantic Search", icon: Database, description: "Embedding-based search across supplier capability databases with geographic and capacity filters.", systems: ["ThomasNet", "D&B"] },
  { label: "Shortlist Delivery", icon: ListChecks, description: "Ranked supplier shortlist with capability match scores and fit rationale delivered to sourcing team.", output: "Supplier Shortlist" },
];

const architecture: AgentArchitecture = {
  connections: [
    { system: "SAP Ariba Discovery", description: "Supplier database queries, capability profiles", direction: "read", protocol: "REST API", category: "erp" },
    { system: "ThomasNet", description: "North American supplier capability and capacity data", direction: "read", protocol: "REST API", category: "market-data" },
    { system: "Dun & Bradstreet", description: "Company profiles, industry classification, financial basics", direction: "read", protocol: "REST API", category: "market-data" },
    { system: "Google Search API", description: "Web-based supplier discovery and validation", direction: "read", protocol: "REST API", category: "analytics" },
    { system: "Vertex AI (Gemini)", description: "Requirement interpretation, taxonomy translation, fit reasoning", direction: "bidirectional", protocol: "gRPC", category: "ai" },
  ],
  pipeline: [
    { label: "Requirement Parsing & Taxonomy Translation", description: "Interpret natural-language sourcing requirement ('nickel-based superalloy investment casting with NADCAP, North America, 5K units/year') and translate into search queries across Ariba, ThomasNet, and D&B taxonomies simultaneously.", systems: ["Vertex AI (Gemini)"], layer: "llm", dataIn: "Free-text sourcing requirement from specialist", dataOut: "Structured search queries per database taxonomy" },
    { label: "Multi-Source Discovery & Filtering", description: "Execute embedding-based semantic search across supplier capability databases. Apply geographic, capacity, and certification filters. Aggregate results from multiple platforms with different data models.", systems: ["SAP Ariba Discovery", "ThomasNet", "Dun & Bradstreet", "Google Search API"], layer: "integration", dataIn: "Translated search queries per platform", dataOut: "Raw candidate list with capability descriptions" },
    { label: "Semantic Capability Matching & Ranking", description: "Evaluate supplier capability descriptions using embeddings and LLM reasoning — 'precision casting specialists for high-temperature alloys' matched to nickel superalloy investment casting requirement. Score similarity against requirement profile.", systems: ["Vertex AI (Gemini)"], layer: "ml", dataIn: "Raw candidate list + original requirement", dataOut: "Ranked shortlist with match scores and fit rationale" },
  ],
};


const behaviorContract: AgentBehaviorContract = {
  role: "Sourcing Specialist agent for the Supplier Discovery & Matching workflow",
  primaryObjective: "Embedding search across multiple supplier databases matches capabilities semantically, not just by keyword. LLM translates natural-language requirements across Ariba, ThomasNet, and D&B taxonomies simultaneously. so the Sourcing Specialist can move the Supplier identification time KPI.",
  inScope: [
    "Embedding search across multiple supplier databases matches capabilities semantically, not just by keyword",
    "LLM translates natural-language requirements across Ariba, ThomasNet, and D&B taxonomies simultaneously",
    "Evaluates supplier self-descriptions in context — 'precision casting specialists for high-temperature alloys' matched to nickel superalloy investment casting requirements",
  ],
  outOfScope: [
    "Contract execution without legal review",
    "Supplier disqualification decisions (category lead retains authority)",
    "Single-source justification overrides above policy threshold",
  ],
  toolIntents: [
    {
      name: "query_sap_ariba_discovery_suppliers",
      kind: "query",
      sourceSystemId: "sap_ariba_discovery",
      description: "Retrieve suppliers from SAP Ariba Discovery for the Supplier Discovery & Matching workflow.",
      requiredInputs: [
        "lookup_key",
        "date_range",
      ],
      produces: [
        "suppliers_records",
        "suppliers_summary",
      ],
      evidenceEmitted: [
        "source_system_record",
      ],
    },
    {
      name: "query_thomasnet_thomasnet_records",
      kind: "query",
      sourceSystemId: "thomasnet",
      description: "Retrieve thomasnet records from ThomasNet for the Supplier Discovery & Matching workflow.",
      requiredInputs: [
        "lookup_key",
        "date_range",
      ],
      produces: [
        "thomasnet_records_records",
        "thomasnet_records_summary",
      ],
      evidenceEmitted: [
        "source_system_record",
      ],
    },
    {
      name: "query_d_b_d_b_records",
      kind: "query",
      sourceSystemId: "d_b",
      description: "Retrieve d b records from D&B for the Supplier Discovery & Matching workflow.",
      requiredInputs: [
        "lookup_key",
        "date_range",
      ],
      produces: [
        "d_b_records_records",
        "d_b_records_summary",
      ],
      evidenceEmitted: [
        "source_system_record",
      ],
    },
    {
      name: "query_google_search_api_google_search_api_records",
      kind: "query",
      sourceSystemId: "google_search_api",
      description: "Retrieve google search api records from Google Search API for the Supplier Discovery & Matching workflow.",
      requiredInputs: [
        "lookup_key",
        "date_range",
      ],
      produces: [
        "google_search_api_records_records",
        "google_search_api_records_summary",
      ],
      evidenceEmitted: [
        "source_system_record",
      ],
    },
    {
      name: "lookup_supplier_discovery_matching_policy_guide",
      kind: "evidence_lookup",
      sourceSystemId: "sap_ariba_discovery",
      description: "Look up sections of the Supplier Discovery & Matching Procurement Policy Guide to cite in narrative output, escalation rationale, and audit evidence.",
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
      name: "action_sap_ariba_discovery_match",
      kind: "action",
      sourceSystemId: "sap_ariba_discovery",
      description: "Execute the match step in SAP Ariba Discovery after the agent has gathered evidence and validated escalation gates.",
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
      claim: "Supplier identification time moved from 2-3 weeks toward < 1 hour",
      mustCite: [
        "sap_ariba_discovery.suppliers",
        "thomasnet.thomasnet_records",
      ],
      sourceSystemIds: [
        "sap_ariba_discovery",
        "thomasnet",
      ],
    },
    {
      claim: "Discovery databases queried moved from 1-2 manual toward 5+ simultaneous",
      mustCite: [
        "sap_ariba_discovery.suppliers",
        "thomasnet.thomasnet_records",
      ],
      sourceSystemIds: [
        "sap_ariba_discovery",
        "thomasnet",
      ],
    },
  ],
  escalationRules: [
    {
      trigger: "Supplier identification time regresses past the 2-3 weeks baseline by more than 20%",
      action: "escalate_to_human",
      handoffTarget: "Sourcing Specialist",
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
    "Never fabricate metric values; only publish numbers derived from SAP Ariba Discovery (and other named systems) entities.",
    "Never bypass Sourcing Specialist approval on escalation triggers, even when confidence is high.",
    "Never expose individual personal data (PII) in summaries; aggregate or pseudonymise before output.",
    "Never act on data older than the staleness threshold defined in the runbook without a fresh re-query.",
  ],
  goldenEvals: [
    {
      id: "supplier-discovery-matching-end-to-end",
      prompt: "Run the Supplier Discovery & Matching workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.",
      expectedToolCalls: [
        "query_sap_ariba_discovery_suppliers",
        "query_thomasnet_thomasnet_records",
        "query_d_b_d_b_records",
        "query_google_search_api_google_search_api_records",
        "lookup_supplier_discovery_matching_policy_guide",
        "action_sap_ariba_discovery_match",
      ],
      mustReferenceEntities: [
        "suppliers",
        "thomasnet_records",
        "d_b_records",
        "google_search_api_records",
      ],
      mustCiteDocuments: [
        "supplier-discovery-matching-policy-guide",
      ],
      expectedActionOutcome: "Action match executed against SAP Ariba Discovery, with audit-trail entry and Sourcing Specialist notified of outcomes.",
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
    rationale: "Row counts sized for Supplier Discovery & Matching so the agent can demonstrate the workflow against realistic transactional volume without simulating a production warehouse.",
  },
  sourceSystems: [
    {
      id: "sap_ariba_discovery",
      name: "SAP Ariba Discovery",
      owns: [
        "suppliers",
        "sourcing_events",
        "contracts",
      ],
      protocol: "REST API",
      localBacking: [
        "alloydb",
      ],
      toolNames: [
        "query_sap_ariba_discovery_suppliers",
        "query_sap_ariba_discovery_sourcing_events",
        "query_sap_ariba_discovery_contracts",
      ],
      evidence: [
        "source_system_record",
        "generated_audit_trail",
      ],
    },
    {
      id: "thomasnet",
      name: "ThomasNet",
      owns: [
        "thomasnet_records",
        "thomasnet_events",
        "thomasnet_audit_trail",
      ],
      protocol: "REST API",
      localBacking: [
        "alloydb",
      ],
      toolNames: [
        "query_thomasnet_thomasnet_records",
        "query_thomasnet_thomasnet_events",
        "query_thomasnet_thomasnet_audit_trail",
      ],
      evidence: [
        "source_system_record",
        "generated_audit_trail",
      ],
    },
    {
      id: "d_b",
      name: "D&B",
      owns: [
        "d_b_records",
        "d_b_events",
        "d_b_audit_trail",
      ],
      protocol: "REST API",
      localBacking: [
        "alloydb",
      ],
      toolNames: [
        "query_d_b_d_b_records",
        "query_d_b_d_b_events",
        "query_d_b_d_b_audit_trail",
      ],
      evidence: [
        "source_system_record",
        "generated_audit_trail",
      ],
    },
    {
      id: "google_search_api",
      name: "Google Search API",
      owns: [
        "google_search_api_records",
        "google_search_api_events",
        "google_search_api_audit_trail",
      ],
      protocol: "REST API",
      localBacking: [
        "alloydb",
      ],
      toolNames: [
        "query_google_search_api_google_search_api_records",
        "query_google_search_api_google_search_api_events",
        "query_google_search_api_google_search_api_audit_trail",
      ],
      evidence: [
        "source_system_record",
        "generated_audit_trail",
      ],
    },
  ],
  entities: [
    {
      name: "suppliers",
      sourceSystemId: "sap_ariba_discovery",
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
      name: "sourcing_events",
      sourceSystemId: "sap_ariba_discovery",
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
          name: "supplier_id",
          type: "ref",
          ref: "suppliers.id",
          required: true,
        },
      ],
    },
    {
      name: "contracts",
      sourceSystemId: "sap_ariba_discovery",
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
      name: "thomasnet_records",
      sourceSystemId: "thomasnet",
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
      name: "thomasnet_events",
      sourceSystemId: "thomasnet",
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
          name: "thomasnet_record_id",
          type: "ref",
          ref: "thomasnet_records.id",
          required: true,
        },
      ],
    },
    {
      name: "thomasnet_audit_trail",
      sourceSystemId: "thomasnet",
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
      name: "d_b_records",
      sourceSystemId: "d_b",
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
      name: "d_b_events",
      sourceSystemId: "d_b",
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
          name: "d_b_record_id",
          type: "ref",
          ref: "d_b_records.id",
          required: true,
        },
      ],
    },
    {
      name: "d_b_audit_trail",
      sourceSystemId: "d_b",
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
      name: "google_search_api_records",
      sourceSystemId: "google_search_api",
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
      name: "google_search_api_events",
      sourceSystemId: "google_search_api",
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
          name: "google_search_api_record_id",
          type: "ref",
          ref: "google_search_api_records.id",
          required: true,
        },
      ],
    },
    {
      name: "google_search_api_audit_trail",
      sourceSystemId: "google_search_api",
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
      from: "sourcing_events.supplier_id",
      to: "suppliers.id",
      cardinality: "many-to-one",
      orphanPolicy: "none",
    },
    {
      from: "thomasnet_events.thomasnet_record_id",
      to: "thomasnet_records.id",
      cardinality: "many-to-one",
      orphanPolicy: "none",
    },
    {
      from: "d_b_events.d_b_record_id",
      to: "d_b_records.id",
      cardinality: "many-to-one",
      orphanPolicy: "none",
    },
    {
      from: "google_search_api_events.google_search_api_record_id",
      to: "google_search_api_records.id",
      cardinality: "many-to-one",
      orphanPolicy: "none",
    },
  ],
  documents: [
    {
      id: "supplier-discovery-matching-policy-guide",
      sourceSystemId: "sap_ariba_discovery",
      type: "policy",
      title: "Supplier Discovery & Matching Procurement Policy Guide",
      requiredSections: [
        "Sourcing principles",
        "Approval thresholds",
        "Supplier risk requirements",
        "Contract and compliance gates",
        "Exception handling",
      ],
      linkedEntities: [
        "suppliers",
        "sourcing_events",
        "contracts",
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
      id: "sap_ariba_discovery_match_api",
      sourceSystemId: "sap_ariba_discovery",
      method: "POST",
      path: "/api/sap_ariba_discovery/match",
      description: "Synchronous endpoint the agent calls to match in SAP Ariba Discovery after evidence gating.",
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
      id: "supplier-discovery-matching-baseline-gap",
      description: "Seed a realistic gap where Supplier identification time sits between 2-3 weeks and < 1 hour, so the agent can detect, narrate, and recommend remediation.",
      affectedEntities: [
        "suppliers",
        "sourcing_events",
      ],
      discoveryPath: [
        "Inspect SAP Ariba Discovery records for the affected entities",
        "Compare against ThomasNet historical baseline",
        "Generate a citation-backed recommendation",
      ],
      expectedEvidence: [
        "source-system record",
        "historical baseline metric",
        "generated audit trail",
      ],
      expectedRecommendation: "Explain the gap, cite supporting evidence, and propose the next Sourcing Specialist action.",
    },
  ],
  datastorePackaging: {
    alloydb: {
      database: "supplier_discovery_matching",
      schemas: [
        "sap_ariba_discovery",
        "thomasnet",
        "d_b",
        "google_search_api",
      ],
    },
    bigquery: {
      dataset: "procurement_supplier_discovery_matching",
      tables: [
        "kpi_summary",
        "evidence_index",
      ],
    },
    cloudStorage: {
      bucketSuffix: "supplier-discovery-matching-evidence",
      prefixes: [
        "documents",
        "audit-trails",
        "exports",
      ],
    },
    apis: {
      serviceName: "supplier-discovery-matching-source-adapters",
      deploymentTarget: "cloud_run",
    },
  },
  validation: {
    smokePrompt: "Run the Supplier Discovery & Matching workflow and cite source-system evidence for every claim.",
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

export const SupplierDiscoveryMatching = () => (
  <UseCaseSlide
    title="Supplier Discovery & Matching"
    subtitle="A-1301 • Supplier Discovery"
    icon={Search}
    domainId="domain-13"
    layer="Layer 3: Custom ADK"
    persona="Sourcing Specialist"
    systems={["SAP Ariba Discovery", "ThomasNet", "D&B", "Google Search API", "Vertex AI"]}
    kpis={[
      { label: "Supplier identification time", before: "2-3 weeks", after: "< 1 hour" },
      { label: "Discovery databases queried", before: "1-2 manual", after: "5+ simultaneous" },
      { label: "Qualified candidates surfaced", before: "3-5 via network", after: "12-20 data-matched" },
    ]}
    triggerType="event"
    swimlane={swimlane}
    flow={flow}
    architecture={architecture}
    statusQuo={[
      "Sourcing specialists manually search ThomasNet and rely on personal networks to find new suppliers.",
      "Each database uses different category taxonomies, requiring separate searches with different keywords.",
      "Supplier capability descriptions are skimmed for keywords rather than semantically evaluated for fit."
    ]}
    agentification={[
      "Embedding search across multiple supplier databases matches capabilities semantically, not just by keyword.",
      "LLM translates natural-language requirements across Ariba, ThomasNet, and D&B taxonomies simultaneously.",
      "Evaluates supplier self-descriptions in context — 'precision casting specialists for high-temperature alloys' matched to nickel superalloy investment casting requirements."
    ]}
  />
);
