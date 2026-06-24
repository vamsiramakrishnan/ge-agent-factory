import React from "react";
import { UseCaseSlide } from "../../../agent/UseCaseSlide";
import { FlowStep } from "../../../agent/ProcessFlow";
import { SwimlaneFlow } from "../../../agent/SwimlaneFlow";
import { AgentArchitecture, UseCaseGenerationSpec, AgentBehaviorContract} from "../../../../types/architecture";
import { Puzzle, Database, Cpu, Brain, CheckCircle } from "lucide-react";

const swimlane: SwimlaneFlow = {
  nodes: [
    { id: "s1", label: "Pre-Sourcing Wave", lane: "system", type: "trigger" },
    { id: "a1", label: "Spec Extraction", lane: "agent", type: "action" },
    { id: "a2", label: "NLP Clustering", lane: "agent", type: "action" },
    { id: "a3", label: "Equivalence Analysis", lane: "agent", type: "output" },
    { id: "h1", label: "Engineering Reviews", lane: "human", type: "hitl" },
  ],
  connections: [["s1", "a1"], ["a1", "a2"], ["a2", "a3"], ["a3", "h1"]],
};

const flow: FlowStep[] = [
  { label: "Spec Extraction", icon: Database, description: "Material master descriptions and engineering specs extracted from ERP and PLM systems across business units.", trigger: "Pre-sourcing", systems: ["SAP S/4HANA", "PLM systems"] },
  { label: "NLP Clustering", icon: Cpu, description: "Similar specifications clustered across BUs/plants using NLP on structured attributes — dimensions, materials, tolerances.", systems: ["BigQuery"], integration: "ADK" },
  { label: "Equivalence Reasoning", icon: Brain, description: "Gemini reads specs to determine if '316L stainless, 2mm wall, 150mm OD' and 'SS316L seamless tube, NPS 6, Sch 10S' are the same part.", systems: ["Vertex AI"] },
  { label: "Engineering Validation", icon: CheckCircle, description: "Engineering and Category teams validate consolidation recommendations, confirming functional equivalence vs. meaningful differences.", output: "Consolidation Report" },
];

const architecture: AgentArchitecture = {
  connections: [
    { system: "SAP S/4HANA", description: "Material master descriptions, material groups, and BOM references", direction: "read", protocol: "RFC/BAPI", category: "erp" },
    { system: "PLM Systems", description: "Engineering drawings, specifications, and revision history", direction: "read", protocol: "REST API", category: "erp" },
    { system: "BigQuery", description: "NLP clustering results, duplicate detection models, and consolidation analytics", direction: "bidirectional", protocol: "BigQuery SQL", category: "analytics" },
    { system: "Vertex AI (Gemini)", description: "Specification equivalence reasoning and functional difference assessment", direction: "bidirectional", protocol: "gRPC", category: "ai" },
  ],
  pipeline: [
    { label: "Spec Extraction", description: "Extract material master descriptions and specifications from SAP S/4HANA across all BUs and plants. Pull engineering drawings and revision history from PLM systems. Normalize into comparable format.", systems: ["SAP S/4HANA", "PLM Systems"], layer: "integration", dataIn: "Material master records + engineering drawings across plants", dataOut: "Normalized specification dataset across all BUs" },
    { label: "NLP Clustering & Duplicate Detection", description: "Cluster similar specifications across BUs and plants using NLP on structured attributes — dimensions, materials, tolerances. Detect duplicates on structured fields. Score similarity confidence for borderline cases.", systems: ["BigQuery ML"], layer: "ml", dataIn: "Normalized specification dataset", dataOut: "Specification clusters with similarity scores" },
    { label: "Equivalence Reasoning", description: "Gemini reads engineering specs and understands that '316L stainless, 2mm wall, 150mm OD' and 'SS316L seamless tube, NPS 6, Sch 10S' are the same part described differently. Reasons about whether differences are functionally meaningful vs. legacy fragmentation. Quantifies volume leverage from consolidation.", systems: ["Vertex AI (Gemini)"], layer: "llm", dataIn: "Specification clusters + engineering context", dataOut: "Consolidation recommendations with volume leverage estimate" },
  ],
};


const behaviorContract: AgentBehaviorContract = {
  role: "Category Manager agent for the Specification Standardization Agent workflow",
  primaryObjective: "Gemini reads engineering specs and understands that '316L stainless, 2mm wall, 150mm OD' and 'SS316L seamless tube, NPS 6, Sch 10S' are the same part described differently. LLM reasons about whether differences are functionally meaningful: 'Plant A requires FDA-compliant surface finish, Plant B does not — these cannot be consolidated.' so the Category Manager can move the Spec clusters identified KPI.",
  inScope: [
    "Gemini reads engineering specs and understands that '316L stainless, 2mm wall, 150mm OD' and 'SS316L seamless tube, NPS 6, Sch 10S' are the same part described differently",
    "LLM reasons about whether differences are functionally meaningful: 'Plant A requires FDA-compliant surface finish, Plant B does not — these cannot be consolidated.'",
    "Quantifies volume leverage from consolidation, giving category managers a business case for specification standardization",
  ],
  outOfScope: [
    "Contract execution without legal review",
    "Supplier disqualification decisions (category lead retains authority)",
    "Single-source justification overrides above policy threshold",
  ],
  toolIntents: [
    {
      name: "query_sap_s_4hana_material_master_sap_s_4hana_material_master_records",
      kind: "query",
      sourceSystemId: "sap_s_4hana_material_master",
      description: "Retrieve sap s 4hana material master records from SAP S/4HANA Material Master for the Specification Standardization Agent workflow.",
      requiredInputs: [
        "lookup_key",
        "date_range",
      ],
      produces: [
        "sap_s_4hana_material_master_records_records",
        "sap_s_4hana_material_master_records_summary",
      ],
      evidenceEmitted: [
        "source_system_record",
      ],
    },
    {
      name: "query_plm_systems_plm_systems_records",
      kind: "query",
      sourceSystemId: "plm_systems",
      description: "Retrieve plm systems records from PLM systems for the Specification Standardization Agent workflow.",
      requiredInputs: [
        "lookup_key",
        "date_range",
      ],
      produces: [
        "plm_systems_records_records",
        "plm_systems_records_summary",
      ],
      evidenceEmitted: [
        "source_system_record",
      ],
    },
    {
      name: "query_engineering_drawings_engineering_drawings_records",
      kind: "query",
      sourceSystemId: "engineering_drawings",
      description: "Retrieve engineering drawings records from Engineering drawings for the Specification Standardization Agent workflow.",
      requiredInputs: [
        "lookup_key",
        "date_range",
      ],
      produces: [
        "engineering_drawings_records_records",
        "engineering_drawings_records_summary",
      ],
      evidenceEmitted: [
        "source_system_record",
      ],
    },
    {
      name: "lookup_specification_standardization_agent_policy_guide",
      kind: "evidence_lookup",
      sourceSystemId: "sap_s_4hana_material_master",
      description: "Look up sections of the Specification Standardization Agent Procurement Policy Guide to cite in narrative output, escalation rationale, and audit evidence.",
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
      claim: "Spec clusters identified moved from Manual review toward Automated across all BUs",
      mustCite: [
        "sap_s_4hana_material_master.sap_s_4hana_material_master_records",
        "plm_systems.plm_systems_records",
      ],
      sourceSystemIds: [
        "sap_s_4hana_material_master",
        "plm_systems",
      ],
    },
    {
      claim: "Volume leverage from consolidation moved from Unknown fragmentation toward 15-25% addressable",
      mustCite: [
        "sap_s_4hana_material_master.sap_s_4hana_material_master_records",
        "plm_systems.plm_systems_records",
      ],
      sourceSystemIds: [
        "sap_s_4hana_material_master",
        "plm_systems",
      ],
    },
  ],
  escalationRules: [
    {
      trigger: "Spec clusters identified regresses past the Manual review baseline by more than 20%",
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
    "Never fabricate metric values; only publish numbers derived from SAP S/4HANA Material Master (and other named systems) entities.",
    "Never bypass Category Manager approval on escalation triggers, even when confidence is high.",
    "Never expose individual personal data (PII) in summaries; aggregate or pseudonymise before output.",
    "Never act on data older than the staleness threshold defined in the runbook without a fresh re-query.",
  ],
  goldenEvals: [
    {
      id: "specification-standardization-agent-end-to-end",
      prompt: "Run the Specification Standardization Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.",
      expectedToolCalls: [
        "query_sap_s_4hana_material_master_sap_s_4hana_material_master_records",
        "query_plm_systems_plm_systems_records",
        "query_engineering_drawings_engineering_drawings_records",
        "lookup_specification_standardization_agent_policy_guide",
      ],
      mustReferenceEntities: [
        "sap_s_4hana_material_master_records",
        "plm_systems_records",
        "engineering_drawings_records",
      ],
      mustCiteDocuments: [
        "specification-standardization-agent-policy-guide",
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
    rationale: "Row counts sized for Specification Standardization Agent so the agent can demonstrate the workflow against realistic transactional volume without simulating a production warehouse.",
  },
  sourceSystems: [
    {
      id: "sap_s_4hana_material_master",
      name: "SAP S/4HANA Material Master",
      owns: [
        "sap_s_4hana_material_master_records",
        "sap_s_4hana_material_master_events",
        "sap_s_4hana_material_master_audit_trail",
      ],
      protocol: "RFC/BAPI",
      localBacking: [
        "alloydb",
      ],
      toolNames: [
        "query_sap_s_4hana_material_master_sap_s_4hana_material_master_records",
        "query_sap_s_4hana_material_master_sap_s_4hana_material_master_events",
        "query_sap_s_4hana_material_master_sap_s_4hana_material_master_audit_trail",
      ],
      evidence: [
        "source_system_record",
        "generated_audit_trail",
      ],
    },
    {
      id: "plm_systems",
      name: "PLM systems",
      owns: [
        "plm_systems_records",
        "plm_systems_events",
        "plm_systems_audit_trail",
      ],
      protocol: "REST API",
      localBacking: [
        "alloydb",
      ],
      toolNames: [
        "query_plm_systems_plm_systems_records",
        "query_plm_systems_plm_systems_events",
        "query_plm_systems_plm_systems_audit_trail",
      ],
      evidence: [
        "source_system_record",
        "generated_audit_trail",
      ],
    },
    {
      id: "engineering_drawings",
      name: "Engineering drawings",
      owns: [
        "engineering_drawings_records",
        "engineering_drawings_events",
        "engineering_drawings_audit_trail",
      ],
      protocol: "REST API",
      localBacking: [
        "alloydb",
      ],
      toolNames: [
        "query_engineering_drawings_engineering_drawings_records",
        "query_engineering_drawings_engineering_drawings_events",
        "query_engineering_drawings_engineering_drawings_audit_trail",
      ],
      evidence: [
        "source_system_record",
        "generated_audit_trail",
      ],
    },
  ],
  entities: [
    {
      name: "sap_s_4hana_material_master_records",
      sourceSystemId: "sap_s_4hana_material_master",
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
      name: "sap_s_4hana_material_master_events",
      sourceSystemId: "sap_s_4hana_material_master",
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
          name: "sap_s_4hana_material_master_record_id",
          type: "ref",
          ref: "sap_s_4hana_material_master_records.id",
          required: true,
        },
      ],
    },
    {
      name: "sap_s_4hana_material_master_audit_trail",
      sourceSystemId: "sap_s_4hana_material_master",
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
      name: "plm_systems_records",
      sourceSystemId: "plm_systems",
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
      name: "plm_systems_events",
      sourceSystemId: "plm_systems",
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
          name: "plm_systems_record_id",
          type: "ref",
          ref: "plm_systems_records.id",
          required: true,
        },
      ],
    },
    {
      name: "plm_systems_audit_trail",
      sourceSystemId: "plm_systems",
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
      name: "engineering_drawings_records",
      sourceSystemId: "engineering_drawings",
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
      name: "engineering_drawings_events",
      sourceSystemId: "engineering_drawings",
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
          name: "engineering_drawings_record_id",
          type: "ref",
          ref: "engineering_drawings_records.id",
          required: true,
        },
      ],
    },
    {
      name: "engineering_drawings_audit_trail",
      sourceSystemId: "engineering_drawings",
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
      from: "sap_s_4hana_material_master_events.sap_s_4hana_material_master_record_id",
      to: "sap_s_4hana_material_master_records.id",
      cardinality: "many-to-one",
      orphanPolicy: "none",
    },
    {
      from: "plm_systems_events.plm_systems_record_id",
      to: "plm_systems_records.id",
      cardinality: "many-to-one",
      orphanPolicy: "none",
    },
    {
      from: "engineering_drawings_events.engineering_drawings_record_id",
      to: "engineering_drawings_records.id",
      cardinality: "many-to-one",
      orphanPolicy: "none",
    },
  ],
  documents: [
    {
      id: "specification-standardization-agent-policy-guide",
      sourceSystemId: "sap_s_4hana_material_master",
      type: "policy",
      title: "Specification Standardization Agent Procurement Policy Guide",
      requiredSections: [
        "Sourcing principles",
        "Approval thresholds",
        "Supplier risk requirements",
        "Contract and compliance gates",
        "Exception handling",
      ],
      linkedEntities: [
        "sap_s_4hana_material_master_records",
        "sap_s_4hana_material_master_events",
        "sap_s_4hana_material_master_audit_trail",
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
      id: "specification-standardization-agent-baseline-gap",
      description: "Seed a realistic gap where Spec clusters identified sits between Manual review and Automated across all BUs, so the agent can detect, narrate, and recommend remediation.",
      affectedEntities: [
        "sap_s_4hana_material_master_records",
        "sap_s_4hana_material_master_events",
      ],
      discoveryPath: [
        "Inspect SAP S/4HANA Material Master records for the affected entities",
        "Compare against PLM systems historical baseline",
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
      database: "specification_standardization_agent",
      schemas: [
        "sap_s_4hana_material_master",
        "plm_systems",
        "engineering_drawings",
      ],
    },
    bigquery: {
      dataset: "procurement_specification_standardization_agent",
      tables: [
        "kpi_summary",
        "evidence_index",
      ],
    },
    cloudStorage: {
      bucketSuffix: "specification-standardization-agent-evidence",
      prefixes: [
        "documents",
        "audit-trails",
        "exports",
      ],
    },
    apis: {
      serviceName: "specification-standardization-agent-source-adapters",
      deploymentTarget: "cloud_run",
    },
  },
  validation: {
    smokePrompt: "Run the Specification Standardization Agent workflow and cite source-system evidence for every claim.",
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

export const SpecStandardizationAgent = () => (
  <UseCaseSlide
    title="Specification Standardization Agent"
    subtitle="A-1211 • Strategic Sourcing"
    icon={Puzzle}
    domainId="domain-12"
    layer="Layer 3: Custom ADK"
    persona="Category Manager"
    systems={["SAP S/4HANA Material Master", "PLM systems", "Engineering drawings", "Vertex AI"]}
    kpis={[
      { label: "Spec clusters identified", before: "Manual review", after: "Automated across all BUs" },
      { label: "Volume leverage from consolidation", before: "Unknown fragmentation", after: "15-25% addressable" },
      { label: "Unique part numbers reduced", before: "Baseline", after: "20-30% reduction" },
    ]}
    triggerType="scheduled"
    swimlane={swimlane}
    flow={flow}
    architecture={architecture}
    hitl={{ actor: "Engineering", action: "Validate spec consolidation", description: "Engineering team confirms which specification differences are functionally meaningful vs. legacy fragmentation before consolidation proceeds." }}
    statusQuo={[
      "Each plant maintains its own material specifications independently — 'the same part' exists under 5 different part numbers with 5 different descriptions.",
      "Consolidation opportunities are invisible because specification equivalence requires engineering knowledge that procurement teams lack.",
      "Volume leverage is fragmented across variants that could be consolidated but nobody has the bandwidth to analyze cross-plant."
    ]}
    agentification={[
      "Gemini reads engineering specs and understands that '316L stainless, 2mm wall, 150mm OD' and 'SS316L seamless tube, NPS 6, Sch 10S' are the same part described differently.",
      "LLM reasons about whether differences are functionally meaningful: 'Plant A requires FDA-compliant surface finish, Plant B does not — these cannot be consolidated.'",
      "Quantifies volume leverage from consolidation, giving category managers a business case for specification standardization."
    ]}
  />
);
