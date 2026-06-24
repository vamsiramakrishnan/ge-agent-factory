import React from "react";
import { UseCaseSlide } from "../../../agent/UseCaseSlide";
import { FlowStep } from "../../../agent/ProcessFlow";
import { SwimlaneFlow } from "../../../agent/SwimlaneFlow";
import { AgentArchitecture, UseCaseGenerationSpec, AgentBehaviorContract} from "../../../../types/architecture";
import { MessageCircle, Search, Database, FileText, CheckCircle } from "lucide-react";

const swimlane: SwimlaneFlow = {
  nodes: [
    { id: "s1", label: "User Question", lane: "human", type: "trigger" },
    { id: "a1", label: "Query Routing", lane: "agent", type: "action" },
    { id: "a2", label: "Context Retrieval", lane: "agent", type: "action" },
    { id: "a3", label: "Answer Generation", lane: "agent", type: "output" },
    { id: "s2", label: "Contextual Answer", lane: "system", type: "output" },
  ],
  connections: [["s1", "a1"], ["a1", "a2"], ["a2", "a3"], ["a3", "s2"]],
};

const flow: FlowStep[] = [
  { label: "Query Intake", icon: MessageCircle, description: "Strategic question received via chat — initiative status, timeline, or decision context.", trigger: "Chat", systems: ["Chat Interface"] },
  { label: "Source Routing", icon: Search, description: "Query routed to Confluence docs, Jira data, and analytics based on intent classification.", systems: ["Confluence", "Jira"], integration: "API" },
  { label: "Context Retrieval", icon: Database, description: "Relevant documents, project status, and analytics retrieved and ranked for relevance.", systems: ["BigQuery", "Vertex AI"] },
  { label: "Answer Generation", icon: FileText, description: "Gemini synthesizes a contextual answer with current status and actionable detail.", output: "Contextual Answer" },
];

const architecture: AgentArchitecture = {
  connections: [
    { system: "Confluence", description: "Strategy documents, ADRs, meeting notes, program charters", direction: "read", protocol: "REST API", category: "collaboration" },
    { system: "Jira", description: "Initiative status, epic progress, milestone data", direction: "read", protocol: "REST API", category: "erp" },
    { system: "BigQuery", description: "Analytics data, KPI actuals, historical query patterns", direction: "read", protocol: "BigQuery SQL", category: "analytics" },
    { system: "Vertex AI (Gemini)", description: "Natural language understanding, answer synthesis, context ranking", direction: "bidirectional", protocol: "gRPC", category: "ai" },
  ],
  pipeline: [
    { label: "Intent Classification & Routing", description: "Classify the strategic question and route to appropriate data sources — Confluence for strategy docs, Jira for execution status, BigQuery for metrics.", systems: ["Vertex AI (Gemini)"], layer: "llm", dataIn: "Natural language question from user", dataOut: "Classified intent with source routing plan" },
    { label: "Context Retrieval", description: "Retrieve relevant documents from Confluence, project status from Jira, and analytics from BigQuery. Rank results by relevance and recency.", systems: ["Confluence", "Jira", "BigQuery"], layer: "integration", dataIn: "Routing plan with search parameters", dataOut: "Retrieved context documents and data points" },
    { label: "Answer Synthesis", description: "Gemini synthesizes a contextual answer: 'Cloud migration Phase 2 is 75% complete — 142 of 189 workloads migrated. Remaining 47 are regulated workloads pending security review, expected end of Q2.'", systems: ["Vertex AI (Gemini)"], layer: "llm", dataIn: "Retrieved context + original question", dataOut: "Comprehensive answer with supporting data" },
  ],
};


const behaviorContract: AgentBehaviorContract = {
  role: "CIO / CTO agent for the Strategic Initiative Q&A workflow",
  primaryObjective: "Gemini provides instant, data-backed answers by querying Confluence, Jira, and BigQuery simultaneously. Every answer includes real-time status with citations — not last month's status report. so the CIO / CTO can move the Time to answer KPI.",
  inScope: [
    "Gemini provides instant, data-backed answers by querying Confluence, Jira, and BigQuery simultaneously",
    "Every answer includes real-time status with citations — not last month's status report",
    "Democratizes strategic visibility so any leader can self-serve initiative status without bottlenecking the CIO office",
  ],
  outOfScope: [
    "Production deployments outside an approved change window",
    "Irreversible destructive actions on shared infrastructure (DROP, force-delete, key rotation)",
    "Security incident attribution requiring forensics",
  ],
  toolIntents: [
    {
      name: "query_confluence_pages",
      kind: "query",
      sourceSystemId: "confluence",
      description: "Retrieve pages from Confluence for the Strategic Initiative Q&A workflow.",
      requiredInputs: [
        "lookup_key",
        "date_range",
      ],
      produces: [
        "pages_records",
        "pages_summary",
      ],
      evidenceEmitted: [
        "source_system_record",
      ],
    },
    {
      name: "query_jira_issues",
      kind: "query",
      sourceSystemId: "jira",
      description: "Retrieve issues from Jira for the Strategic Initiative Q&A workflow.",
      requiredInputs: [
        "lookup_key",
        "date_range",
      ],
      produces: [
        "issues_records",
        "issues_summary",
      ],
      evidenceEmitted: [
        "source_system_record",
      ],
    },
    {
      name: "query_bigquery_analytics_events",
      kind: "query",
      sourceSystemId: "bigquery",
      description: "Retrieve analytics events from BigQuery for the Strategic Initiative Q&A workflow.",
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
      name: "lookup_strategic_initiative_q_a_runbook",
      kind: "evidence_lookup",
      sourceSystemId: "confluence",
      description: "Look up sections of the Strategic Initiative Q&A Operations Runbook to cite in narrative output, escalation rationale, and audit evidence.",
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
      claim: "Time to answer moved from Hours (manual research) toward <30 seconds",
      mustCite: [
        "confluence.pages",
        "jira.issues",
      ],
      sourceSystemIds: [
        "confluence",
        "jira",
      ],
    },
    {
      claim: "Data sources queried moved from 1-2 manual toward 5+ automated",
      mustCite: [
        "confluence.pages",
        "jira.issues",
      ],
      sourceSystemIds: [
        "confluence",
        "jira",
      ],
    },
  ],
  escalationRules: [
    {
      trigger: "Time to answer regresses past the Hours (manual research) baseline by more than 20%",
      action: "escalate_to_human",
      handoffTarget: "CIO / CTO",
      rationale: "Significant regressions need human judgment before automated remediation runs against production records.",
    },
    {
      trigger: "Source-system evidence is incomplete or stale (>24h) for any required entity",
      action: "request_more_info",
      rationale: "Recommendations grounded in stale evidence misrepresent current state and undermine audit defensibility.",
    },
  ],
  refusalRules: [
    "Never fabricate metric values; only publish numbers derived from Confluence (and other named systems) entities.",
    "Never bypass CIO / CTO approval on escalation triggers, even when confidence is high.",
    "Never expose individual personal data (PII) in summaries; aggregate or pseudonymise before output.",
    "Never act on data older than the staleness threshold defined in the runbook without a fresh re-query.",
  ],
  goldenEvals: [
    {
      id: "strategic-initiative-q-a-end-to-end",
      prompt: "Run the Strategic Initiative Q&A workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.",
      expectedToolCalls: [
        "query_confluence_pages",
        "query_jira_issues",
        "query_bigquery_analytics_events",
        "lookup_strategic_initiative_q_a_runbook",
      ],
      mustReferenceEntities: [
        "pages",
        "issues",
        "analytics_events",
      ],
      mustCiteDocuments: [
        "strategic-initiative-q-a-runbook",
      ],
      expectedActionOutcome: "CIO / CTO receives a fully-cited recommendation; no external state change without explicit approval.",
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
    rationale: "Row counts sized for Strategic Initiative Q&A so the agent can demonstrate the workflow against realistic transactional volume without simulating a production warehouse.",
  },
  sourceSystems: [
    {
      id: "confluence",
      name: "Confluence",
      owns: [
        "pages",
        "comments",
        "space_permissions",
      ],
      protocol: "REST API",
      localBacking: [
        "cloud-storage",
      ],
      toolNames: [
        "query_confluence_pages",
        "query_confluence_comments",
        "query_confluence_space_permissions",
      ],
      evidence: [
        "source_system_record",
        "generated_audit_trail",
      ],
    },
    {
      id: "jira",
      name: "Jira",
      owns: [
        "issues",
        "sprints",
        "epics",
      ],
      protocol: "REST API",
      localBacking: [
        "alloydb",
      ],
      toolNames: [
        "query_jira_issues",
        "query_jira_sprints",
        "query_jira_epics",
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
      name: "pages",
      sourceSystemId: "confluence",
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
          name: "title",
          type: "lorem.sentence",
          required: true,
        },
        {
          name: "owner",
          type: "person.fullName",
          required: true,
        },
        {
          name: "status",
          type: "enum",
          values: [
            "draft",
            "review",
            "published",
            "archived",
          ],
          required: true,
        },
        {
          name: "last_updated",
          type: "date",
          required: true,
        },
      ],
    },
    {
      name: "comments",
      sourceSystemId: "confluence",
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
      name: "space_permissions",
      sourceSystemId: "confluence",
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
      name: "issues",
      sourceSystemId: "jira",
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
      name: "sprints",
      sourceSystemId: "jira",
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
      name: "epics",
      sourceSystemId: "jira",
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
      id: "strategic-initiative-q-a-runbook",
      sourceSystemId: "bigquery",
      type: "runbook",
      title: "Strategic Initiative Q&A Operations Runbook",
      requiredSections: [
        "Detection signals",
        "Triage procedures",
        "Remediation actions",
        "Rollback criteria",
        "Post-incident review",
      ],
      linkedEntities: [
        "pages",
        "comments",
        "space_permissions",
      ],
      minimumWordCount: 500,
      citationAnchors: [
        "detection",
        "triage",
        "remediation",
        "rollback",
      ],
    },
  ],
  apis: [],
  anomalies: [
    {
      id: "strategic-initiative-q-a-baseline-gap",
      description: "Seed a realistic gap where Time to answer sits between Hours (manual research) and <30 seconds, so the agent can detect, narrate, and recommend remediation.",
      affectedEntities: [
        "pages",
        "comments",
      ],
      discoveryPath: [
        "Inspect Confluence records for the affected entities",
        "Compare against Jira historical baseline",
        "Generate a citation-backed recommendation",
      ],
      expectedEvidence: [
        "source-system record",
        "historical baseline metric",
        "generated audit trail",
      ],
      expectedRecommendation: "Explain the gap, cite supporting evidence, and propose the next CIO / CTO action.",
    },
  ],
  datastorePackaging: {
    alloydb: {
      database: "strategic_initiative_q_a",
      schemas: [
        "confluence",
        "jira",
      ],
    },
    bigquery: {
      dataset: "it_strategic_initiative_q_a",
      tables: [
        "kpi_summary",
        "evidence_index",
      ],
    },
    cloudStorage: {
      bucketSuffix: "strategic-initiative-q-a-evidence",
      prefixes: [
        "documents",
        "audit-trails",
        "exports",
      ],
    },
    apis: {
      serviceName: "strategic-initiative-q-a-source-adapters",
      deploymentTarget: "cloud_run",
    },
  },
  validation: {
    smokePrompt: "Run the Strategic Initiative Q&A workflow and cite source-system evidence for every claim.",
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

export const StrategicInitiativeQA = () => (
  <UseCaseSlide
    title="Strategic Initiative Q&A"
    subtitle="A-3807 • IT Strategy & Portfolio"
    icon={MessageCircle}
    domainId="domain-38"
    layer="Layer 1: OOTB"
    persona="CIO / CTO"
    systems={["Confluence", "Jira", "BigQuery", "Vertex AI"]}
    kpis={[
      { label: "Time to answer", before: "Hours (manual research)", after: "<30 seconds" },
      { label: "Data sources queried", before: "1-2 manual", after: "5+ automated" },
      { label: "Answer accuracy", before: "Variable", after: "95%+ with citations" },
    ]}
    triggerType="chat"
    swimlane={swimlane}
    flow={flow}
    architecture={architecture}
    statusQuo={[
      "Strategic questions require hours of manual research across Confluence, Jira, and multiple dashboards.",
      "Answers depend on who you ask — different stakeholders have different (often outdated) views.",
      "Board prep requires the CIO's EA to manually compile initiative status from 5+ program managers."
    ]}
    agentification={[
      "Gemini provides instant, data-backed answers by querying Confluence, Jira, and BigQuery simultaneously.",
      "Every answer includes real-time status with citations — not last month's status report.",
      "Democratizes strategic visibility so any leader can self-serve initiative status without bottlenecking the CIO office."
    ]}
  />
);
