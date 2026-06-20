import React from "react";
import { UseCaseSlide } from "../../../agent/UseCaseSlide";
import { FlowStep } from "../../../agent/ProcessFlow";
import { SwimlaneFlow } from "../../../agent/SwimlaneFlow";
import { AgentArchitecture, UseCaseGenerationSpec, AgentBehaviorContract} from "../../../../types/architecture";
import { Award, FileInput, Scale, Brain, ListChecks } from "lucide-react";

const swimlane: SwimlaneFlow = {
  nodes: [
    { id: "s1", label: "RFI Response", lane: "system", type: "trigger" },
    { id: "a1", label: "Response Normalization", lane: "agent", type: "action" },
    { id: "a2", label: "Weighted Scoring", lane: "agent", type: "action" },
    { id: "a3", label: "Narrative Assessment", lane: "agent", type: "action" },
    { id: "a4", label: "Capability Report", lane: "agent", type: "output" },
  ],
  connections: [["s1", "a1"], ["a1", "a2"], ["a2", "a3"], ["a3", "a4"]],
};

const flow: FlowStep[] = [
  { label: "Response Collection", icon: FileInput, description: "RFI and questionnaire responses collected from Ariba SLP or Jaggaer and normalized.", trigger: "On-demand", systems: ["Ariba SLP", "Jaggaer"] },
  { label: "Criteria Scoring", icon: Scale, description: "Weighted scoring against technical and commercial criteria with incumbent comparison.", systems: ["Vertex AI"], integration: "ADK" },
  { label: "Narrative Evaluation", icon: Brain, description: "LLM evaluates capability claims against PPM data and contextual credibility signals.", systems: ["Vertex AI"] },
  { label: "Recommendation", icon: ListChecks, description: "Synthesized assessment with recommendation — qualify, trial order, or reject — delivered to sourcing.", output: "Capability Assessment" },
];

const architecture: AgentArchitecture = {
  connections: [
    { system: "Ariba SLP", description: "RFI/questionnaire responses, supplier capability submissions", direction: "read", protocol: "REST API", category: "erp" },
    { system: "Jaggaer", description: "Alternate supplier lifecycle portal, RFI collection", direction: "read", protocol: "REST API", category: "erp" },
    { system: "Vertex AI (Gemini)", description: "Narrative capability evaluation, credibility assessment, recommendation synthesis", direction: "bidirectional", protocol: "gRPC", category: "ai" },
    { system: "BigQuery", description: "Historical supplier PPM data, incumbent performance benchmarks", direction: "read", protocol: "BigQuery SQL", category: "analytics" },
  ],
  pipeline: [
    { label: "Response Collection & Normalization", description: "Collect RFI and questionnaire responses from Ariba SLP or Jaggaer. Normalize submissions across different formats and structures into a consistent evaluation framework.", systems: ["Ariba SLP", "Jaggaer"], layer: "integration", dataIn: "Raw RFI/questionnaire responses in varying formats", dataOut: "Normalized response set aligned to evaluation criteria" },
    { label: "Weighted Criteria Scoring", description: "Apply weighted scoring against 40+ technical and commercial criteria. Compare challenger suppliers against incumbent on structured attributes. Pull historical PPM and quality data for validation.", systems: ["BigQuery"], layer: "ml", dataIn: "Normalized responses + incumbent performance data", dataOut: "Scored criteria matrix with incumbent comparison" },
    { label: "Narrative Assessment & Recommendation", description: "LLM evaluates capability claims in context — supplier claims 'state-of-the-art quality systems' but PPM data shows 450 vs. incumbent's 120. Assesses credibility of experience claims. Synthesizes into actionable recommendation: qualify, trial order, or reject.", systems: ["Vertex AI (Gemini)"], layer: "llm", dataIn: "Scored criteria + narrative responses + PPM data", dataOut: "Capability assessment report with recommendation" },
  ],
};


const behaviorContract: AgentBehaviorContract = {
  role: "Sourcing Specialist agent for the Capability Assessment Agent workflow",
  primaryObjective: "Weighted scoring against 40+ technical and commercial criteria applied consistently across all respondents. LLM evaluates narrative claims in context — supplier claims 'state-of-the-art quality' but PPM data shows 450 vs. incumbent's 120. so the Sourcing Specialist can move the Assessment turnaround KPI.",
  inScope: [
    "Weighted scoring against 40+ technical and commercial criteria applied consistently across all respondents",
    "LLM evaluates narrative claims in context — supplier claims 'state-of-the-art quality' but PPM data shows 450 vs. incumbent's 120",
    "Synthesizes assessment into actionable recommendation: 'Technically capable but unproven at volume — recommend trial order before full qualification.'",
  ],
  outOfScope: [
    "Contract execution without legal review",
    "Supplier disqualification decisions (category lead retains authority)",
    "Single-source justification overrides above policy threshold",
  ],
  toolIntents: [
    {
      name: "query_ariba_slp_ariba_slp_records",
      kind: "query",
      sourceSystemId: "ariba_slp",
      description: "Retrieve ariba slp records from Ariba SLP for the Capability Assessment Agent workflow.",
      requiredInputs: [
        "lookup_key",
        "date_range",
      ],
      produces: [
        "ariba_slp_records_records",
        "ariba_slp_records_summary",
      ],
      evidenceEmitted: [
        "source_system_record",
      ],
    },
    {
      name: "query_jaggaer_supplier_profiles",
      kind: "query",
      sourceSystemId: "jaggaer",
      description: "Retrieve supplier profiles from Jaggaer for the Capability Assessment Agent workflow.",
      requiredInputs: [
        "lookup_key",
        "date_range",
      ],
      produces: [
        "supplier_profiles_records",
        "supplier_profiles_summary",
      ],
      evidenceEmitted: [
        "source_system_record",
      ],
    },
    {
      name: "query_procurement_3_procurement_3_records",
      kind: "query",
      sourceSystemId: "procurement_3",
      description: "Retrieve procurement 3 records from PROCUREMENT 3 for the Capability Assessment Agent workflow.",
      requiredInputs: [
        "lookup_key",
        "date_range",
      ],
      produces: [
        "procurement_3_records_records",
        "procurement_3_records_summary",
      ],
      evidenceEmitted: [
        "source_system_record",
      ],
    },
    {
      name: "lookup_capability_assessment_agent_policy_guide",
      kind: "evidence_lookup",
      sourceSystemId: "ariba_slp",
      description: "Look up sections of the Capability Assessment Agent Procurement Policy Guide to cite in narrative output, escalation rationale, and audit evidence.",
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
      name: "action_ariba_slp_recommend",
      kind: "action",
      sourceSystemId: "ariba_slp",
      description: "Execute the recommend step in Ariba SLP after the agent has gathered evidence and validated escalation gates.",
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
      claim: "Assessment turnaround moved from 1-2 weeks toward < 1 day",
      mustCite: [
        "ariba_slp.ariba_slp_records",
        "jaggaer.supplier_profiles",
      ],
      sourceSystemIds: [
        "ariba_slp",
        "jaggaer",
      ],
    },
    {
      claim: "Criteria evaluated per supplier moved from 10-15 manual toward 40+ automated",
      mustCite: [
        "ariba_slp.ariba_slp_records",
        "jaggaer.supplier_profiles",
      ],
      sourceSystemIds: [
        "ariba_slp",
        "jaggaer",
      ],
    },
  ],
  escalationRules: [
    {
      trigger: "Assessment turnaround regresses past the 1-2 weeks baseline by more than 20%",
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
      trigger: "Proposed recommend action lacks supporting evidence from at least two systems",
      action: "refuse",
      rationale: "Single-system evidence is insufficient to authorize external state changes without manual review.",
    },
  ],
  refusalRules: [
    "Never fabricate metric values; only publish numbers derived from Ariba SLP (and other named systems) entities.",
    "Never bypass Sourcing Specialist approval on escalation triggers, even when confidence is high.",
    "Never expose individual personal data (PII) in summaries; aggregate or pseudonymise before output.",
    "Never act on data older than the staleness threshold defined in the runbook without a fresh re-query.",
  ],
  goldenEvals: [
    {
      id: "capability-assessment-agent-end-to-end",
      prompt: "Run the Capability Assessment Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.",
      expectedToolCalls: [
        "query_ariba_slp_ariba_slp_records",
        "query_jaggaer_supplier_profiles",
        "query_procurement_3_procurement_3_records",
        "lookup_capability_assessment_agent_policy_guide",
        "action_ariba_slp_recommend",
      ],
      mustReferenceEntities: [
        "ariba_slp_records",
        "supplier_profiles",
        "procurement_3_records",
      ],
      mustCiteDocuments: [
        "capability-assessment-agent-policy-guide",
      ],
      expectedActionOutcome: "Action recommend executed against Ariba SLP, with audit-trail entry and Sourcing Specialist notified of outcomes.",
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
    rationale: "Row counts sized for Capability Assessment Agent so the agent can demonstrate the workflow against realistic transactional volume without simulating a production warehouse.",
  },
  sourceSystems: [
    {
      id: "ariba_slp",
      name: "Ariba SLP",
      owns: [
        "ariba_slp_records",
        "ariba_slp_events",
        "ariba_slp_audit_trail",
      ],
      protocol: "REST API",
      localBacking: [
        "alloydb",
      ],
      toolNames: [
        "query_ariba_slp_ariba_slp_records",
        "query_ariba_slp_ariba_slp_events",
        "query_ariba_slp_ariba_slp_audit_trail",
      ],
      evidence: [
        "source_system_record",
        "generated_audit_trail",
      ],
    },
    {
      id: "jaggaer",
      name: "Jaggaer",
      owns: [
        "supplier_profiles",
        "sourcing_events",
        "scorecards",
      ],
      protocol: "REST API",
      localBacking: [
        "alloydb",
      ],
      toolNames: [
        "query_jaggaer_supplier_profiles",
        "query_jaggaer_sourcing_events",
        "query_jaggaer_scorecards",
      ],
      evidence: [
        "source_system_record",
        "generated_audit_trail",
      ],
    },
    {
      id: "procurement_3",
      name: "PROCUREMENT 3",
      owns: [
        "procurement_3_records",
        "procurement_3_events",
      ],
      protocol: "REST API",
      localBacking: [
        "alloydb",
      ],
      toolNames: [
        "query_procurement_3_records",
      ],
      evidence: [
        "source_system_record",
      ],
    },
  ],
  entities: [
    {
      name: "ariba_slp_records",
      sourceSystemId: "ariba_slp",
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
      name: "ariba_slp_events",
      sourceSystemId: "ariba_slp",
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
          name: "ariba_slp_record_id",
          type: "ref",
          ref: "ariba_slp_records.id",
          required: true,
        },
      ],
    },
    {
      name: "ariba_slp_audit_trail",
      sourceSystemId: "ariba_slp",
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
      name: "supplier_profiles",
      sourceSystemId: "jaggaer",
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
      sourceSystemId: "jaggaer",
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
          name: "supplier_profile_id",
          type: "ref",
          ref: "supplier_profiles.id",
          required: true,
        },
      ],
    },
    {
      name: "scorecards",
      sourceSystemId: "jaggaer",
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
      name: "procurement_3_records",
      sourceSystemId: "procurement_3",
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
      name: "procurement_3_events",
      sourceSystemId: "procurement_3",
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
          name: "procurement_3_record_id",
          type: "ref",
          ref: "procurement_3_records.id",
          required: true,
        },
      ],
    },
  ],
  relationships: [
    {
      from: "ariba_slp_events.ariba_slp_record_id",
      to: "ariba_slp_records.id",
      cardinality: "many-to-one",
      orphanPolicy: "none",
    },
    {
      from: "sourcing_events.supplier_profile_id",
      to: "supplier_profiles.id",
      cardinality: "many-to-one",
      orphanPolicy: "none",
    },
    {
      from: "procurement_3_events.procurement_3_record_id",
      to: "procurement_3_records.id",
      cardinality: "many-to-one",
      orphanPolicy: "none",
    },
  ],
  documents: [
    {
      id: "capability-assessment-agent-policy-guide",
      sourceSystemId: "ariba_slp",
      type: "policy",
      title: "Capability Assessment Agent Procurement Policy Guide",
      requiredSections: [
        "Sourcing principles",
        "Approval thresholds",
        "Supplier risk requirements",
        "Contract and compliance gates",
        "Exception handling",
      ],
      linkedEntities: [
        "ariba_slp_records",
        "ariba_slp_events",
        "ariba_slp_audit_trail",
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
      id: "ariba_slp_recommend_api",
      sourceSystemId: "ariba_slp",
      method: "POST",
      path: "/api/ariba_slp/recommend",
      description: "Synchronous endpoint the agent calls to recommend in Ariba SLP after evidence gating.",
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
      id: "capability-assessment-agent-baseline-gap",
      description: "Seed a realistic gap where Assessment turnaround sits between 1-2 weeks and < 1 day, so the agent can detect, narrate, and recommend remediation.",
      affectedEntities: [
        "ariba_slp_records",
        "ariba_slp_events",
      ],
      discoveryPath: [
        "Inspect Ariba SLP records for the affected entities",
        "Compare against Jaggaer historical baseline",
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
      database: "capability_assessment_agent",
      schemas: [
        "ariba_slp",
        "jaggaer",
        "procurement_3",
      ],
    },
    bigquery: {
      dataset: "procurement_capability_assessment_agent",
      tables: [
        "kpi_summary",
        "evidence_index",
      ],
    },
    cloudStorage: {
      bucketSuffix: "capability-assessment-agent-evidence",
      prefixes: [
        "documents",
        "audit-trails",
        "exports",
      ],
    },
    apis: {
      serviceName: "capability-assessment-agent-source-adapters",
      deploymentTarget: "cloud_run",
    },
  },
  validation: {
    smokePrompt: "Run the Capability Assessment Agent workflow and cite source-system evidence for every claim.",
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

export const CapabilityAssessmentAgent = () => (
  <UseCaseSlide
    title="Capability Assessment Agent"
    subtitle="A-1306 • Supplier Discovery"
    icon={Award}
    domainId="domain-13"
    layer="Layer 3: Custom ADK"
    persona="Sourcing Specialist"
    systems={["Ariba SLP", "Jaggaer", "Vertex AI"]}
    kpis={[
      { label: "Assessment turnaround", before: "1-2 weeks", after: "< 1 day" },
      { label: "Criteria evaluated per supplier", before: "10-15 manual", after: "40+ automated" },
      { label: "Claim-vs-data discrepancy detection", before: "Rare", after: "Systematic" },
    ]}
    triggerType="event"
    swimlane={swimlane}
    flow={flow}
    architecture={architecture}
    statusQuo={[
      "RFI responses scored manually on a spreadsheet with subjective weighting and inconsistent evaluator interpretation.",
      "Narrative capability descriptions skimmed for keywords — '15 years of aerospace experience' accepted at face value.",
      "Incumbent comparison is qualitative and biased toward the known supplier rather than data-driven."
    ]}
    agentification={[
      "Weighted scoring against 40+ technical and commercial criteria applied consistently across all respondents.",
      "LLM evaluates narrative claims in context — supplier claims 'state-of-the-art quality' but PPM data shows 450 vs. incumbent's 120.",
      "Synthesizes assessment into actionable recommendation: 'Technically capable but unproven at volume — recommend trial order before full qualification.'"
    ]}
  />
);
