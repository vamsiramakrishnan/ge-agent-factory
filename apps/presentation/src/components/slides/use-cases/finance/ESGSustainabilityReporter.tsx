import React from "react";
import { UseCaseSlide } from "../../../agent/UseCaseSlide";
import { FlowStep } from "../../../agent/ProcessFlow";
import { SwimlaneFlow } from "../../../agent/SwimlaneFlow";
import { AgentArchitecture, UseCaseGenerationSpec, AgentBehaviorContract} from "../../../../types/architecture";
import { Leaf, Database, FileText, CheckCircle, Globe } from "lucide-react";

const swimlane: SwimlaneFlow = {
  nodes: [
    { id: "s1", label: "Annual ESG Cycle", lane: "system", type: "trigger" },
    { id: "a1", label: "Data Collection", lane: "agent", type: "action" },
    { id: "a2", label: "Narrative Drafting", lane: "agent", type: "action" },
    { id: "a3", label: "ESG Report", lane: "agent", type: "output" },
    { id: "h1", label: "CFO + Sustainability Officer Review", lane: "human", type: "hitl" },
  ],
  connections: [["s1", "a1"], ["a1", "a2"], ["a2", "a3"], ["a3", "h1"]],
};

const flow: FlowStep[] = [
  { label: "ESG Data Collection", icon: Globe, description: "Collect environmental, social, and governance data across operations — emissions, energy, diversity, governance metrics.", trigger: "Annual", systems: ["Workiva", "BigQuery"] },
  { label: "Metric Computation", icon: Database, description: "Calculate carbon emissions (Scope 1-3), energy intensity, social impact scores, and YoY comparisons.", systems: ["BigQuery"], integration: "ADK" },
  { label: "Disclosure Drafting", icon: FileText, description: "Gemini drafts ESG disclosures meeting GRI, SASB, and TCFD framework requirements with appropriate language.", systems: ["Vertex AI"] },
  { label: "Executive Review", icon: CheckCircle, description: "CFO and Sustainability Officer review and approve the ESG report before publication.", output: "ESG Sustainability Report" },
];

const architecture: AgentArchitecture = {
  connections: [
    { system: "Workiva", description: "ESG reporting templates, prior year reports, framework requirements", direction: "bidirectional", protocol: "REST API", category: "collaboration" },
    { system: "CDP", description: "Carbon disclosure project submissions, climate risk data", direction: "read", protocol: "REST API", category: "market-data" },
    { system: "BigQuery", description: "Emissions calculations, energy data, social metrics, supply chain data", direction: "bidirectional", protocol: "BigQuery SQL", category: "analytics" },
    { system: "Vertex AI (Gemini)", description: "ESG narrative drafting, TCFD disclosure generation, framework compliance", direction: "bidirectional", protocol: "gRPC", category: "ai" },
  ],
  pipeline: [
    { label: "Data Aggregation", description: "Collect ESG data from across the enterprise: energy consumption from facilities, fleet emissions, water usage, workforce demographics, supply chain sustainability scores, governance metrics.", systems: ["BigQuery", "CDP"], layer: "integration", dataIn: "Raw ESG data from operations", dataOut: "Validated ESG metric dataset" },
    { label: "Metric Computation", description: "Calculate Scope 1, 2, and 3 emissions using GHG Protocol methodology. Compute energy intensity ratios, social impact scores, and year-over-year comparisons against targets.", systems: ["BigQuery"], layer: "ml", dataIn: "Validated ESG data", dataOut: "Computed ESG metrics with trend analysis" },
    { label: "Disclosure Drafting", description: "Gemini drafts ESG disclosures mapped to GRI, SASB, and TCFD frameworks. Ensures completeness: 'Scope 1+2 emissions decreased 8% but Scope 3 increased 12% due to supply chain growth — explain the Scope 3 strategy.'", systems: ["Vertex AI (Gemini)"], layer: "llm", dataIn: "Computed metrics + framework requirements", dataOut: "Draft ESG disclosures by framework" },
    { label: "Report Assembly", description: "Assemble the full ESG report in Workiva with cross-referenced metrics, framework mapping tables, and assurance-ready documentation.", systems: ["Workiva"], layer: "integration", dataIn: "Draft disclosures + metrics", dataOut: "Publication-ready ESG report" },
  ],
};


const behaviorContract: AgentBehaviorContract = {
  role: "CFO agent for the ESG & Sustainability Reporter workflow",
  primaryObjective: "Automated data pipelines replace manual surveys for emissions, energy, and social metrics. Gemini drafts disclosures simultaneously mapped to GRI, SASB, and TCFD frameworks. so the CFO can move the Report preparation KPI.",
  inScope: [
    "Automated data pipelines replace manual surveys for emissions, energy, and social metrics",
    "Gemini drafts disclosures simultaneously mapped to GRI, SASB, and TCFD frameworks",
    "Year-over-year trend tracking with automated target progress assessment",
  ],
  outOfScope: [
    "Final sign-off on materially significant journal entries (Controller retains authority)",
    "Restatement of prior-period filings",
    "Tax position changes that require external advisor review",
  ],
  toolIntents: [
    {
      name: "query_workiva_workiva_records",
      kind: "query",
      sourceSystemId: "workiva",
      description: "Retrieve workiva records from Workiva for the ESG & Sustainability Reporter workflow.",
      requiredInputs: [
        "lookup_key",
        "date_range",
      ],
      produces: [
        "workiva_records_records",
        "workiva_records_summary",
      ],
      evidenceEmitted: [
        "source_system_record",
      ],
    },
    {
      name: "query_cdp_cdp_records",
      kind: "query",
      sourceSystemId: "cdp",
      description: "Retrieve cdp records from CDP for the ESG & Sustainability Reporter workflow.",
      requiredInputs: [
        "lookup_key",
        "date_range",
      ],
      produces: [
        "cdp_records_records",
        "cdp_records_summary",
      ],
      evidenceEmitted: [
        "source_system_record",
      ],
    },
    {
      name: "query_bigquery_analytics_events",
      kind: "query",
      sourceSystemId: "bigquery",
      description: "Retrieve analytics events from BigQuery for the ESG & Sustainability Reporter workflow.",
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
      name: "lookup_esg_sustainability_reporter_controls_playbook",
      kind: "evidence_lookup",
      sourceSystemId: "bigquery",
      description: "Look up sections of the ESG & Sustainability Reporter Controls Playbook to cite in narrative output, escalation rationale, and audit evidence.",
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
      name: "action_workiva_draft",
      kind: "action",
      sourceSystemId: "workiva",
      description: "Execute the draft step in Workiva after the agent has gathered evidence and validated escalation gates.",
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
      claim: "Report preparation moved from 8-12 weeks toward 3-4 weeks",
      mustCite: [
        "workiva.workiva_records",
        "cdp.cdp_records",
      ],
      sourceSystemIds: [
        "workiva",
        "cdp",
      ],
    },
    {
      claim: "Framework coverage moved from 1-2 frameworks toward GRI + SASB + TCFD",
      mustCite: [
        "workiva.workiva_records",
        "cdp.cdp_records",
      ],
      sourceSystemIds: [
        "workiva",
        "cdp",
      ],
    },
  ],
  escalationRules: [
    {
      trigger: "Report preparation regresses past the 8-12 weeks baseline by more than 20%",
      action: "escalate_to_human",
      handoffTarget: "CFO",
      rationale: "Significant regressions need human judgment before automated remediation runs against production records.",
    },
    {
      trigger: "Source-system evidence is incomplete or stale (>24h) for any required entity",
      action: "request_more_info",
      rationale: "Recommendations grounded in stale evidence misrepresent current state and undermine audit defensibility.",
    },
    {
      trigger: "Proposed draft action lacks supporting evidence from at least two systems",
      action: "refuse",
      rationale: "Single-system evidence is insufficient to authorize external state changes without manual review.",
    },
  ],
  refusalRules: [
    "Never fabricate metric values; only publish numbers derived from Workiva (and other named systems) entities.",
    "Never bypass CFO approval on escalation triggers, even when confidence is high.",
    "Never expose individual personal data (PII) in summaries; aggregate or pseudonymise before output.",
    "Never act on data older than the staleness threshold defined in the runbook without a fresh re-query.",
  ],
  goldenEvals: [
    {
      id: "esg-sustainability-reporter-end-to-end",
      prompt: "Run the ESG & Sustainability Reporter workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.",
      expectedToolCalls: [
        "query_workiva_workiva_records",
        "query_cdp_cdp_records",
        "query_bigquery_analytics_events",
        "lookup_esg_sustainability_reporter_controls_playbook",
        "action_workiva_draft",
      ],
      mustReferenceEntities: [
        "workiva_records",
        "cdp_records",
        "analytics_events",
      ],
      mustCiteDocuments: [
        "esg-sustainability-reporter-controls-playbook",
      ],
      expectedActionOutcome: "Action draft executed against Workiva, with audit-trail entry and CFO notified of outcomes.",
      forbiddenBehaviors: [
        "do not invent KPI numbers",
        "do not skip the evidence_lookup step before any recommendation",
        "do not execute draft without two-system evidence",
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
    rationale: "Row counts sized for ESG & Sustainability Reporter so the agent can demonstrate the workflow against realistic transactional volume without simulating a production warehouse.",
  },
  sourceSystems: [
    {
      id: "workiva",
      name: "Workiva",
      owns: [
        "workiva_records",
        "workiva_events",
        "workiva_audit_trail",
      ],
      protocol: "REST API",
      localBacking: [
        "alloydb",
      ],
      toolNames: [
        "query_workiva_workiva_records",
        "query_workiva_workiva_events",
        "query_workiva_workiva_audit_trail",
      ],
      evidence: [
        "source_system_record",
        "generated_audit_trail",
      ],
    },
    {
      id: "cdp",
      name: "CDP",
      owns: [
        "cdp_records",
        "cdp_events",
        "cdp_audit_trail",
      ],
      protocol: "REST API",
      localBacking: [
        "alloydb",
      ],
      toolNames: [
        "query_cdp_cdp_records",
        "query_cdp_cdp_events",
        "query_cdp_cdp_audit_trail",
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
      name: "workiva_records",
      sourceSystemId: "workiva",
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
      name: "workiva_events",
      sourceSystemId: "workiva",
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
          name: "workiva_record_id",
          type: "ref",
          ref: "workiva_records.id",
          required: true,
        },
      ],
    },
    {
      name: "workiva_audit_trail",
      sourceSystemId: "workiva",
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
      name: "cdp_records",
      sourceSystemId: "cdp",
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
      name: "cdp_events",
      sourceSystemId: "cdp",
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
          name: "cdp_record_id",
          type: "ref",
          ref: "cdp_records.id",
          required: true,
        },
      ],
    },
    {
      name: "cdp_audit_trail",
      sourceSystemId: "cdp",
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
      from: "workiva_events.workiva_record_id",
      to: "workiva_records.id",
      cardinality: "many-to-one",
      orphanPolicy: "none",
    },
    {
      from: "cdp_events.cdp_record_id",
      to: "cdp_records.id",
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
      id: "esg-sustainability-reporter-controls-playbook",
      sourceSystemId: "bigquery",
      type: "policy",
      title: "ESG & Sustainability Reporter Controls Playbook",
      requiredSections: [
        "Workflow scope",
        "Materiality thresholds",
        "Escalation triggers",
        "Audit evidence requirements",
        "Quarter-end variations",
      ],
      linkedEntities: [
        "workiva_records",
        "workiva_events",
        "workiva_audit_trail",
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
      id: "workiva_draft_api",
      sourceSystemId: "workiva",
      method: "POST",
      path: "/api/workiva/draft",
      description: "Synchronous endpoint the agent calls to draft in Workiva after evidence gating.",
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
      id: "esg-sustainability-reporter-baseline-gap",
      description: "Seed a realistic gap where Report preparation sits between 8-12 weeks and 3-4 weeks, so the agent can detect, narrate, and recommend remediation.",
      affectedEntities: [
        "workiva_records",
        "workiva_events",
      ],
      discoveryPath: [
        "Inspect Workiva records for the affected entities",
        "Compare against CDP historical baseline",
        "Generate a citation-backed recommendation",
      ],
      expectedEvidence: [
        "source-system record",
        "historical baseline metric",
        "generated audit trail",
      ],
      expectedRecommendation: "Explain the gap, cite supporting evidence, and propose the next CFO action.",
    },
  ],
  datastorePackaging: {
    alloydb: {
      database: "esg_sustainability_reporter",
      schemas: [
        "workiva",
        "cdp",
      ],
    },
    bigquery: {
      dataset: "finance_esg_sustainability_reporter",
      tables: [
        "kpi_summary",
        "evidence_index",
      ],
    },
    cloudStorage: {
      bucketSuffix: "esg-sustainability-reporter-evidence",
      prefixes: [
        "documents",
        "audit-trails",
        "exports",
      ],
    },
    apis: {
      serviceName: "esg-sustainability-reporter-source-adapters",
      deploymentTarget: "cloud_run",
    },
  },
  validation: {
    smokePrompt: "Run the ESG & Sustainability Reporter workflow and cite source-system evidence for every claim.",
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

export const ESGSustainabilityReporter = () => (
  <UseCaseSlide
    title="ESG & Sustainability Reporter"
    subtitle="A-2807 • Finance Analytics & Reporting"
    icon={Leaf}
    domainId="domain-28"
    layer="Layer 3: Custom ADK"
    persona="CFO"
    systems={["Workiva", "CDP", "BigQuery", "Vertex AI"]}
    kpis={[
      { label: "Report preparation", before: "8-12 weeks", after: "3-4 weeks" },
      { label: "Framework coverage", before: "1-2 frameworks", after: "GRI + SASB + TCFD" },
      { label: "Data collection effort", before: "Manual surveys", after: "Automated pipeline" },
    ]}
    triggerType="scheduled"
    swimlane={swimlane}
    flow={flow}
    architecture={architecture}
    hitl={{ actor: "CFO + Sustainability Officer", action: "Review ESG report", description: "CFO and Sustainability Officer validate ESG metrics, disclosure narratives, and framework compliance before publication." }}
    statusQuo={[
      "ESG data collected via manual surveys from dozens of operational teams over months.",
      "Disclosure narratives written from scratch against each reporting framework.",
      "Limited to 1-2 frameworks; coverage of GRI, SASB, and TCFD simultaneously is infeasible manually."
    ]}
    agentification={[
      "Automated data pipelines replace manual surveys for emissions, energy, and social metrics.",
      "Gemini drafts disclosures simultaneously mapped to GRI, SASB, and TCFD frameworks.",
      "Year-over-year trend tracking with automated target progress assessment."
    ]}
  />
);
