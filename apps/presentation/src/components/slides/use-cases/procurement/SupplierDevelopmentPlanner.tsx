import React from "react";
import { UseCaseSlide } from "../../../agent/UseCaseSlide";
import { FlowStep } from "../../../agent/ProcessFlow";
import { SwimlaneFlow } from "../../../agent/SwimlaneFlow";
import { AgentArchitecture, UseCaseGenerationSpec, AgentBehaviorContract} from "../../../../types/architecture";
import { Wrench, AlertCircle, BarChart3, Brain, CheckCircle } from "lucide-react";

const swimlane: SwimlaneFlow = {
  nodes: [
    { id: "s1", label: "Score Threshold", lane: "system", type: "trigger" },
    { id: "a1", label: "Gap Analysis", lane: "agent", type: "action" },
    { id: "a2", label: "Program Design", lane: "agent", type: "action" },
    { id: "a3", label: "Dev Plan Draft", lane: "agent", type: "output" },
    { id: "h1", label: "Cat Mgr Reviews", lane: "human", type: "hitl" },
  ],
  connections: [["s1", "a1"], ["a1", "a2"], ["a2", "a3"], ["a3", "h1"]],
};

const flow: FlowStep[] = [
  { label: "Threshold Trigger", icon: AlertCircle, description: "Scorecard falls below performance threshold, triggering development evaluation.", trigger: "Scorecard event", systems: ["Scorecard Data"] },
  { label: "Gap Assessment", icon: BarChart3, description: "Current vs. target performance gaps quantified with ROI modeling on improvement investments.", systems: ["BigQuery", "Benchmarks"], integration: "ADK" },
  { label: "Program Design", icon: Brain, description: "LLM reasons about which development program fits — SPC training, Kaizen event, or resident engineer.", systems: ["Vertex AI"] },
  { label: "Manager Approval", icon: CheckCircle, description: "Category Manager validates development proposal with timelines and investment-to-savings projections.", output: "Development Plan" },
];

const architecture: AgentArchitecture = {
  connections: [
    { system: "Scorecard Data", description: "Supplier performance scorecards, KPI history, threshold triggers", direction: "read", protocol: "REST API", category: "analytics" },
    { system: "Capability Assessments", description: "Supplier capability evaluation results, process maturity ratings", direction: "read", protocol: "REST API", category: "erp" },
    { system: "Industry Benchmarks", description: "Category peer performance standards, best-practice benchmarks", direction: "read", protocol: "REST API", category: "market-data" },
    { system: "BigQuery", description: "Gap analysis, ROI modeling, improvement investment scenarios", direction: "bidirectional", protocol: "BigQuery SQL", category: "analytics" },
    { system: "Vertex AI (Gemini)", description: "Development program design, supplier maturity reasoning, proposal drafting", direction: "bidirectional", protocol: "gRPC", category: "ai" },
  ],
  pipeline: [
    { label: "Threshold Detection & Data Pull", description: "Triggered when supplier scorecard falls below performance threshold. Pull historical performance data, capability assessment results, and industry benchmark comparisons.", systems: ["Scorecard Data", "Capability Assessments", "Industry Benchmarks"], layer: "integration", dataIn: "Scorecard trigger + historical performance + capability data", dataOut: "Supplier performance profile with benchmark comparison" },
    { label: "Gap Analysis & ROI Modeling", description: "Quantify current vs. target performance gaps on each KPI dimension. Model ROI on different improvement investments. Benchmark comparison against category peers to calibrate realistic targets.", systems: ["BigQuery"], layer: "ml", dataIn: "Performance profile + benchmarks", dataOut: "Gap analysis with investment-to-savings projections" },
    { label: "Development Program Design", description: "Gemini reasons about which development program fits the supplier's situation: 'Quality issues stem from lack of SPC capability — a resident engineer program focused on SPC implementation is more effective than a general Kaizen event.' Tailors recommendations to supplier maturity — small family-owned machine shop vs. large tier-1 automotive supplier. Drafts proposal with timelines and milestones.", systems: ["Vertex AI (Gemini)"], layer: "llm", dataIn: "Gap analysis + capability assessment + supplier profile", dataOut: "Tailored development proposal for Category Manager approval" },
  ],
};


const behaviorContract: AgentBehaviorContract = {
  role: "Category Manager agent for the Supplier Development Planner workflow",
  primaryObjective: "LLM reasons about root cause to match the right program: 'Quality issues stem from lack of SPC capability — a resident engineer program focused on SPC implementation is more effective than a general Kaizen event.' Tailors recommendations to supplier maturity: a small family-owned machine shop needs different development than a large tier-1 automotive supplier. so the Category Manager can move the Development plan creation KPI.",
  inScope: [
    "LLM reasons about root cause to match the right program: 'Quality issues stem from lack of SPC capability — a resident engineer program focused on SPC implementation is more effective than a general Kaizen event.'",
    "Tailors recommendations to supplier maturity: a small family-owned machine shop needs different development than a large tier-1 automotive supplier",
    "Drafts development proposals with timelines, milestones, and investment-to-savings projections for Category Manager approval",
  ],
  outOfScope: [
    "Contract execution without legal review",
    "Supplier disqualification decisions (category lead retains authority)",
    "Single-source justification overrides above policy threshold",
  ],
  toolIntents: [
    {
      name: "query_scorecard_data_scorecard_data_records",
      kind: "query",
      sourceSystemId: "scorecard_data",
      description: "Retrieve scorecard data records from Scorecard Data for the Supplier Development Planner workflow.",
      requiredInputs: [
        "lookup_key",
        "date_range",
      ],
      produces: [
        "scorecard_data_records_records",
        "scorecard_data_records_summary",
      ],
      evidenceEmitted: [
        "source_system_record",
      ],
    },
    {
      name: "query_capability_assessments_capability_assessments_records",
      kind: "query",
      sourceSystemId: "capability_assessments",
      description: "Retrieve capability assessments records from Capability Assessments for the Supplier Development Planner workflow.",
      requiredInputs: [
        "lookup_key",
        "date_range",
      ],
      produces: [
        "capability_assessments_records_records",
        "capability_assessments_records_summary",
      ],
      evidenceEmitted: [
        "source_system_record",
      ],
    },
    {
      name: "query_industry_benchmarks_industry_benchmarks_records",
      kind: "query",
      sourceSystemId: "industry_benchmarks",
      description: "Retrieve industry benchmarks records from Industry Benchmarks for the Supplier Development Planner workflow.",
      requiredInputs: [
        "lookup_key",
        "date_range",
      ],
      produces: [
        "industry_benchmarks_records_records",
        "industry_benchmarks_records_summary",
      ],
      evidenceEmitted: [
        "source_system_record",
      ],
    },
    {
      name: "lookup_supplier_development_planner_policy_guide",
      kind: "evidence_lookup",
      sourceSystemId: "scorecard_data",
      description: "Look up sections of the Supplier Development Planner Procurement Policy Guide to cite in narrative output, escalation rationale, and audit evidence.",
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
      name: "action_scorecard_data_recommend",
      kind: "action",
      sourceSystemId: "scorecard_data",
      description: "Execute the recommend step in Scorecard Data after the agent has gathered evidence and validated escalation gates.",
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
      claim: "Development plan creation moved from 2-3 weeks toward 2 days",
      mustCite: [
        "scorecard_data.scorecard_data_records",
        "capability_assessments.capability_assessments_records",
      ],
      sourceSystemIds: [
        "scorecard_data",
        "capability_assessments",
      ],
    },
    {
      claim: "Program-to-gap fit moved from Generic templates toward Tailored to root cause",
      mustCite: [
        "scorecard_data.scorecard_data_records",
        "capability_assessments.capability_assessments_records",
      ],
      sourceSystemIds: [
        "scorecard_data",
        "capability_assessments",
      ],
    },
  ],
  escalationRules: [
    {
      trigger: "Development plan creation regresses past the 2-3 weeks baseline by more than 20%",
      action: "escalate_to_human",
      handoffTarget: "Category Manager",
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
    "Never fabricate metric values; only publish numbers derived from Scorecard Data (and other named systems) entities.",
    "Never bypass Category Manager approval on escalation triggers, even when confidence is high.",
    "Never expose individual personal data (PII) in summaries; aggregate or pseudonymise before output.",
    "Never act on data older than the staleness threshold defined in the runbook without a fresh re-query.",
  ],
  goldenEvals: [
    {
      id: "supplier-development-planner-end-to-end",
      prompt: "Run the Supplier Development Planner workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.",
      expectedToolCalls: [
        "query_scorecard_data_scorecard_data_records",
        "query_capability_assessments_capability_assessments_records",
        "query_industry_benchmarks_industry_benchmarks_records",
        "lookup_supplier_development_planner_policy_guide",
        "action_scorecard_data_recommend",
      ],
      mustReferenceEntities: [
        "scorecard_data_records",
        "capability_assessments_records",
        "industry_benchmarks_records",
      ],
      mustCiteDocuments: [
        "supplier-development-planner-policy-guide",
      ],
      expectedActionOutcome: "Action recommend executed against Scorecard Data, with audit-trail entry and Category Manager notified of outcomes.",
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
    rationale: "Row counts sized for Supplier Development Planner so the agent can demonstrate the workflow against realistic transactional volume without simulating a production warehouse.",
  },
  sourceSystems: [
    {
      id: "scorecard_data",
      name: "Scorecard Data",
      owns: [
        "scorecard_data_records",
        "scorecard_data_events",
        "scorecard_data_audit_trail",
      ],
      protocol: "REST API",
      localBacking: [
        "alloydb",
      ],
      toolNames: [
        "query_scorecard_data_scorecard_data_records",
        "query_scorecard_data_scorecard_data_events",
        "query_scorecard_data_scorecard_data_audit_trail",
      ],
      evidence: [
        "source_system_record",
        "generated_audit_trail",
      ],
    },
    {
      id: "capability_assessments",
      name: "Capability Assessments",
      owns: [
        "capability_assessments_records",
        "capability_assessments_events",
        "capability_assessments_audit_trail",
      ],
      protocol: "REST API",
      localBacking: [
        "alloydb",
      ],
      toolNames: [
        "query_capability_assessments_capability_assessments_records",
        "query_capability_assessments_capability_assessments_events",
        "query_capability_assessments_capability_assessments_audit_trail",
      ],
      evidence: [
        "source_system_record",
        "generated_audit_trail",
      ],
    },
    {
      id: "industry_benchmarks",
      name: "Industry Benchmarks",
      owns: [
        "industry_benchmarks_records",
        "industry_benchmarks_events",
        "industry_benchmarks_audit_trail",
      ],
      protocol: "REST API",
      localBacking: [
        "alloydb",
      ],
      toolNames: [
        "query_industry_benchmarks_industry_benchmarks_records",
        "query_industry_benchmarks_industry_benchmarks_events",
        "query_industry_benchmarks_industry_benchmarks_audit_trail",
      ],
      evidence: [
        "source_system_record",
        "generated_audit_trail",
      ],
    },
  ],
  entities: [
    {
      name: "scorecard_data_records",
      sourceSystemId: "scorecard_data",
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
      name: "scorecard_data_events",
      sourceSystemId: "scorecard_data",
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
          name: "scorecard_data_record_id",
          type: "ref",
          ref: "scorecard_data_records.id",
          required: true,
        },
      ],
    },
    {
      name: "scorecard_data_audit_trail",
      sourceSystemId: "scorecard_data",
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
      name: "capability_assessments_records",
      sourceSystemId: "capability_assessments",
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
      name: "capability_assessments_events",
      sourceSystemId: "capability_assessments",
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
          name: "capability_assessments_record_id",
          type: "ref",
          ref: "capability_assessments_records.id",
          required: true,
        },
      ],
    },
    {
      name: "capability_assessments_audit_trail",
      sourceSystemId: "capability_assessments",
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
      name: "industry_benchmarks_records",
      sourceSystemId: "industry_benchmarks",
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
      name: "industry_benchmarks_events",
      sourceSystemId: "industry_benchmarks",
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
          name: "industry_benchmarks_record_id",
          type: "ref",
          ref: "industry_benchmarks_records.id",
          required: true,
        },
      ],
    },
    {
      name: "industry_benchmarks_audit_trail",
      sourceSystemId: "industry_benchmarks",
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
      from: "scorecard_data_events.scorecard_data_record_id",
      to: "scorecard_data_records.id",
      cardinality: "many-to-one",
      orphanPolicy: "none",
    },
    {
      from: "capability_assessments_events.capability_assessments_record_id",
      to: "capability_assessments_records.id",
      cardinality: "many-to-one",
      orphanPolicy: "none",
    },
    {
      from: "industry_benchmarks_events.industry_benchmarks_record_id",
      to: "industry_benchmarks_records.id",
      cardinality: "many-to-one",
      orphanPolicy: "none",
    },
  ],
  documents: [
    {
      id: "supplier-development-planner-policy-guide",
      sourceSystemId: "scorecard_data",
      type: "policy",
      title: "Supplier Development Planner Procurement Policy Guide",
      requiredSections: [
        "Sourcing principles",
        "Approval thresholds",
        "Supplier risk requirements",
        "Contract and compliance gates",
        "Exception handling",
      ],
      linkedEntities: [
        "scorecard_data_records",
        "scorecard_data_events",
        "scorecard_data_audit_trail",
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
      id: "scorecard_data_recommend_api",
      sourceSystemId: "scorecard_data",
      method: "POST",
      path: "/api/scorecard_data/recommend",
      description: "Synchronous endpoint the agent calls to recommend in Scorecard Data after evidence gating.",
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
      id: "supplier-development-planner-baseline-gap",
      description: "Seed a realistic gap where Development plan creation sits between 2-3 weeks and 2 days, so the agent can detect, narrate, and recommend remediation.",
      affectedEntities: [
        "scorecard_data_records",
        "scorecard_data_events",
      ],
      discoveryPath: [
        "Inspect Scorecard Data records for the affected entities",
        "Compare against Capability Assessments historical baseline",
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
      database: "supplier_development_planner",
      schemas: [
        "scorecard_data",
        "capability_assessments",
        "industry_benchmarks",
      ],
    },
    bigquery: {
      dataset: "procurement_supplier_development_planner",
      tables: [
        "kpi_summary",
        "evidence_index",
      ],
    },
    cloudStorage: {
      bucketSuffix: "supplier-development-planner-evidence",
      prefixes: [
        "documents",
        "audit-trails",
        "exports",
      ],
    },
    apis: {
      serviceName: "supplier-development-planner-source-adapters",
      deploymentTarget: "cloud_run",
    },
  },
  validation: {
    smokePrompt: "Run the Supplier Development Planner workflow and cite source-system evidence for every claim.",
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

export const SupplierDevelopmentPlanner = () => (
  <UseCaseSlide
    title="Supplier Development Planner"
    subtitle="A-1705 • Supplier Performance"
    icon={Wrench}
    domainId="domain-17"
    layer="Layer 3: Custom ADK"
    persona="Category Manager"
    systems={["Scorecard Data", "Capability Assessments", "Industry Benchmarks", "Vertex AI"]}
    kpis={[
      { label: "Development plan creation", before: "2-3 weeks", after: "2 days" },
      { label: "Program-to-gap fit", before: "Generic templates", after: "Tailored to root cause" },
      { label: "Improvement ROI tracking", before: "Not measured", after: "Investment-to-savings modeled" },
    ]}
    triggerType="event"
    swimlane={swimlane}
    flow={flow}
    architecture={architecture}
    hitl={{ actor: "Category Manager", action: "Approve development plan", description: "Category Manager validates development recommendations, investment requirements, and milestone timeline before engaging the supplier." }}
    statusQuo={[
      "Supplier development plans are generic templates — same Kaizen playbook applied regardless of root cause.",
      "No systematic way to distinguish whether quality issues stem from lack of SPC capability, tooling, or materials.",
      "Development investments tracked informally with no ROI measurement or milestone accountability."
    ]}
    agentification={[
      "LLM reasons about root cause to match the right program: 'Quality issues stem from lack of SPC capability — a resident engineer program focused on SPC implementation is more effective than a general Kaizen event.'",
      "Tailors recommendations to supplier maturity: a small family-owned machine shop needs different development than a large tier-1 automotive supplier.",
      "Drafts development proposals with timelines, milestones, and investment-to-savings projections for Category Manager approval."
    ]}
  />
);
