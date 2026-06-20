import React from "react";
import { UseCaseSlide } from "../../../agent/UseCaseSlide";
import { FlowStep } from "../../../agent/ProcessFlow";
import { SwimlaneFlow } from "../../../agent/SwimlaneFlow";
import { AgentArchitecture, UseCaseGenerationSpec, AgentBehaviorContract} from "../../../../types/architecture";
import { Award, Database, BarChart3, Brain, FileText } from "lucide-react";

const swimlane: SwimlaneFlow = {
  nodes: [
    { id: "s1", label: "User Query / Annual", lane: "system", type: "trigger" },
    { id: "a1", label: "Benchmark Retrieval", lane: "agent", type: "action" },
    { id: "a2", label: "Peer Comparison", lane: "agent", type: "action" },
    { id: "a3", label: "Contextualized Analysis", lane: "agent", type: "action" },
    { id: "a4", label: "Improvement Roadmap", lane: "agent", type: "output" },
  ],
  connections: [["s1", "a1"], ["a1", "a2"], ["a2", "a3"], ["a3", "a4"]],
};

const flow: FlowStep[] = [
  { label: "Data Retrieval", icon: Database, description: "Internal KPIs and external benchmark datasets retrieved from analytics platforms.", trigger: "Chat / Annual", systems: ["BigQuery", "Hackett", "CAPS"] },
  { label: "Peer Comparison", icon: BarChart3, description: "Percentile ranking and maturity gap scoring across benchmark dimensions.", systems: ["BigQuery", "Gartner", "Ardent Partners"], integration: "ADK" },
  { label: "Contextual Interpretation", icon: Brain, description: "LLM contextualizes comparisons — engineered-to-order vs. consumer goods peers have different baselines.", systems: ["Vertex AI"] },
  { label: "Prioritized Roadmap", icon: FileText, description: "Improvement roadmap prioritized by impact and feasibility, accounting for industry context.", output: "Benchmark Report" },
];

const architecture: AgentArchitecture = {
  connections: [
    { system: "Hackett", description: "Procurement benchmark datasets, best-in-class metrics, peer comparisons", direction: "read", protocol: "REST API", category: "market-data" },
    { system: "CAPS/Gartner", description: "Industry benchmark data, maturity model frameworks, trend reports", direction: "read", protocol: "REST API", category: "market-data" },
    { system: "Ardent Partners", description: "P2P benchmark data, touchless processing rates, cycle time benchmarks", direction: "read", protocol: "REST API", category: "market-data" },
    { system: "BigQuery", description: "Internal KPI data warehouse, peer comparison analytics, gap scoring", direction: "bidirectional", protocol: "BigQuery SQL", category: "analytics" },
    { system: "Vertex AI (Gemini)", description: "Contextual benchmark interpretation, irrelevant benchmark challenge, improvement roadmap generation", direction: "bidirectional", protocol: "gRPC", category: "ai" },
  ],
  pipeline: [
    { label: "Benchmark Data Retrieval", description: "Pull internal KPI data from BigQuery and retrieve benchmark datasets from Hackett, CAPS, Gartner, and Ardent Partners. Align metrics across different benchmark methodologies for comparable analysis.", systems: ["BigQuery", "Hackett", "CAPS/Gartner", "Ardent Partners"], layer: "integration", dataIn: "Internal KPIs + external benchmark datasets", dataOut: "Aligned benchmark comparison dataset" },
    { label: "Peer Comparison & Gap Scoring", description: "Percentile ranking across benchmark dimensions with maturity gap scoring. Improvement trajectory projection based on historical rate of change. Identify dimensions where gap closure has highest ROI.", systems: ["BigQuery"], layer: "ml", dataIn: "Aligned benchmark data", dataOut: "Ranked gaps with improvement trajectory" },
    { label: "Contextual Interpretation & Roadmap", description: "Gemini contextualizes comparisons for business model relevance — 'our 4.2-day cycle time is 3rd quartile overall but top-quartile for engineered-to-order procurement.' Challenges irrelevant benchmarks rather than accepting them naively. Generates improvement roadmaps prioritized by impact and feasibility.", systems: ["Vertex AI (Gemini)"], layer: "llm", dataIn: "Ranked gaps + business model context", dataOut: "Contextualized benchmark report with improvement roadmap" },
  ],
};


const behaviorContract: AgentBehaviorContract = {
  role: "Procurement Analytics Lead agent for the Benchmark Intelligence Agent workflow",
  primaryObjective: "RAG over Hackett, CAPS, Gartner, and Ardent Partners benchmarks with internal KPI comparison. LLM contextualizes comparisons: 'Our 4.2-day cycle time is 3rd quartile overall but top-quartile for engineered-to-order procurement.' so the Procurement Analytics Lead can move the Benchmark comparison time KPI.",
  inScope: [
    "RAG over Hackett, CAPS, Gartner, and Ardent Partners benchmarks with internal KPI comparison",
    "LLM contextualizes comparisons: 'Our 4.2-day cycle time is 3rd quartile overall but top-quartile for engineered-to-order procurement.'",
    "Generates improvement roadmaps that challenge irrelevant benchmarks and prioritize by impact and feasibility",
  ],
  outOfScope: [
    "Contract execution without legal review",
    "Supplier disqualification decisions (category lead retains authority)",
    "Single-source justification overrides above policy threshold",
  ],
  toolIntents: [
    {
      name: "query_hackett_hackett_records",
      kind: "query",
      sourceSystemId: "hackett",
      description: "Retrieve hackett records from Hackett for the Benchmark Intelligence Agent workflow.",
      requiredInputs: [
        "lookup_key",
        "date_range",
      ],
      produces: [
        "hackett_records_records",
        "hackett_records_summary",
      ],
      evidenceEmitted: [
        "source_system_record",
      ],
    },
    {
      name: "query_caps_caps_records",
      kind: "query",
      sourceSystemId: "caps",
      description: "Retrieve caps records from CAPS for the Benchmark Intelligence Agent workflow.",
      requiredInputs: [
        "lookup_key",
        "date_range",
      ],
      produces: [
        "caps_records_records",
        "caps_records_summary",
      ],
      evidenceEmitted: [
        "source_system_record",
      ],
    },
    {
      name: "query_gartner_gartner_records",
      kind: "query",
      sourceSystemId: "gartner",
      description: "Retrieve gartner records from Gartner for the Benchmark Intelligence Agent workflow.",
      requiredInputs: [
        "lookup_key",
        "date_range",
      ],
      produces: [
        "gartner_records_records",
        "gartner_records_summary",
      ],
      evidenceEmitted: [
        "source_system_record",
      ],
    },
    {
      name: "query_ardent_partners_ardent_partners_records",
      kind: "query",
      sourceSystemId: "ardent_partners",
      description: "Retrieve ardent partners records from Ardent Partners for the Benchmark Intelligence Agent workflow.",
      requiredInputs: [
        "lookup_key",
        "date_range",
      ],
      produces: [
        "ardent_partners_records_records",
        "ardent_partners_records_summary",
      ],
      evidenceEmitted: [
        "source_system_record",
      ],
    },
    {
      name: "lookup_benchmark_intelligence_agent_policy_guide",
      kind: "evidence_lookup",
      sourceSystemId: "bigquery",
      description: "Look up sections of the Benchmark Intelligence Agent Procurement Policy Guide to cite in narrative output, escalation rationale, and audit evidence.",
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
      name: "action_hackett_generate",
      kind: "action",
      sourceSystemId: "hackett",
      description: "Execute the generate step in Hackett after the agent has gathered evidence and validated escalation gates.",
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
      claim: "Benchmark comparison time moved from 2-3 weeks analyst toward On-demand chat",
      mustCite: [
        "hackett.hackett_records",
        "caps.caps_records",
      ],
      sourceSystemIds: [
        "hackett",
        "caps",
      ],
    },
    {
      claim: "Peer context accuracy moved from Naive cross-industry toward Industry-adjusted",
      mustCite: [
        "hackett.hackett_records",
        "caps.caps_records",
      ],
      sourceSystemIds: [
        "hackett",
        "caps",
      ],
    },
  ],
  escalationRules: [
    {
      trigger: "Benchmark comparison time regresses past the 2-3 weeks analyst baseline by more than 20%",
      action: "escalate_to_human",
      handoffTarget: "Procurement Analytics Lead",
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
    "Never fabricate metric values; only publish numbers derived from Hackett (and other named systems) entities.",
    "Never bypass Procurement Analytics Lead approval on escalation triggers, even when confidence is high.",
    "Never expose individual personal data (PII) in summaries; aggregate or pseudonymise before output.",
    "Never act on data older than the staleness threshold defined in the runbook without a fresh re-query.",
  ],
  goldenEvals: [
    {
      id: "benchmark-intelligence-agent-end-to-end",
      prompt: "Run the Benchmark Intelligence Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.",
      expectedToolCalls: [
        "query_hackett_hackett_records",
        "query_caps_caps_records",
        "query_gartner_gartner_records",
        "query_ardent_partners_ardent_partners_records",
        "lookup_benchmark_intelligence_agent_policy_guide",
        "action_hackett_generate",
      ],
      mustReferenceEntities: [
        "hackett_records",
        "caps_records",
        "gartner_records",
        "ardent_partners_records",
        "analytics_events",
      ],
      mustCiteDocuments: [
        "benchmark-intelligence-agent-policy-guide",
      ],
      expectedActionOutcome: "Action generate executed against Hackett, with audit-trail entry and Procurement Analytics Lead notified of outcomes.",
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
    rationale: "Row counts sized for Benchmark Intelligence Agent so the agent can demonstrate the workflow against realistic transactional volume without simulating a production warehouse.",
  },
  sourceSystems: [
    {
      id: "hackett",
      name: "Hackett",
      owns: [
        "hackett_records",
        "hackett_events",
        "hackett_audit_trail",
      ],
      protocol: "REST API",
      localBacking: [
        "alloydb",
      ],
      toolNames: [
        "query_hackett_hackett_records",
        "query_hackett_hackett_events",
        "query_hackett_hackett_audit_trail",
      ],
      evidence: [
        "source_system_record",
        "generated_audit_trail",
      ],
    },
    {
      id: "caps",
      name: "CAPS",
      owns: [
        "caps_records",
        "caps_events",
        "caps_audit_trail",
      ],
      protocol: "REST API",
      localBacking: [
        "alloydb",
      ],
      toolNames: [
        "query_caps_caps_records",
        "query_caps_caps_events",
        "query_caps_caps_audit_trail",
      ],
      evidence: [
        "source_system_record",
        "generated_audit_trail",
      ],
    },
    {
      id: "gartner",
      name: "Gartner",
      owns: [
        "gartner_records",
        "gartner_events",
        "gartner_audit_trail",
      ],
      protocol: "REST API",
      localBacking: [
        "alloydb",
      ],
      toolNames: [
        "query_gartner_gartner_records",
        "query_gartner_gartner_events",
        "query_gartner_gartner_audit_trail",
      ],
      evidence: [
        "source_system_record",
        "generated_audit_trail",
      ],
    },
    {
      id: "ardent_partners",
      name: "Ardent Partners",
      owns: [
        "ardent_partners_records",
        "ardent_partners_events",
        "ardent_partners_audit_trail",
      ],
      protocol: "REST API",
      localBacking: [
        "alloydb",
      ],
      toolNames: [
        "query_ardent_partners_ardent_partners_records",
        "query_ardent_partners_ardent_partners_events",
        "query_ardent_partners_ardent_partners_audit_trail",
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
      name: "hackett_records",
      sourceSystemId: "hackett",
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
      name: "hackett_events",
      sourceSystemId: "hackett",
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
          name: "hackett_record_id",
          type: "ref",
          ref: "hackett_records.id",
          required: true,
        },
      ],
    },
    {
      name: "hackett_audit_trail",
      sourceSystemId: "hackett",
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
      name: "caps_records",
      sourceSystemId: "caps",
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
      name: "caps_events",
      sourceSystemId: "caps",
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
          name: "caps_record_id",
          type: "ref",
          ref: "caps_records.id",
          required: true,
        },
      ],
    },
    {
      name: "caps_audit_trail",
      sourceSystemId: "caps",
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
      name: "gartner_records",
      sourceSystemId: "gartner",
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
      name: "gartner_events",
      sourceSystemId: "gartner",
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
          name: "gartner_record_id",
          type: "ref",
          ref: "gartner_records.id",
          required: true,
        },
      ],
    },
    {
      name: "gartner_audit_trail",
      sourceSystemId: "gartner",
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
      name: "ardent_partners_records",
      sourceSystemId: "ardent_partners",
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
      name: "ardent_partners_events",
      sourceSystemId: "ardent_partners",
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
          name: "ardent_partners_record_id",
          type: "ref",
          ref: "ardent_partners_records.id",
          required: true,
        },
      ],
    },
    {
      name: "ardent_partners_audit_trail",
      sourceSystemId: "ardent_partners",
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
      from: "hackett_events.hackett_record_id",
      to: "hackett_records.id",
      cardinality: "many-to-one",
      orphanPolicy: "none",
    },
    {
      from: "caps_events.caps_record_id",
      to: "caps_records.id",
      cardinality: "many-to-one",
      orphanPolicy: "none",
    },
    {
      from: "gartner_events.gartner_record_id",
      to: "gartner_records.id",
      cardinality: "many-to-one",
      orphanPolicy: "none",
    },
    {
      from: "ardent_partners_events.ardent_partners_record_id",
      to: "ardent_partners_records.id",
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
      id: "benchmark-intelligence-agent-policy-guide",
      sourceSystemId: "bigquery",
      type: "policy",
      title: "Benchmark Intelligence Agent Procurement Policy Guide",
      requiredSections: [
        "Sourcing principles",
        "Approval thresholds",
        "Supplier risk requirements",
        "Contract and compliance gates",
        "Exception handling",
      ],
      linkedEntities: [
        "hackett_records",
        "hackett_events",
        "hackett_audit_trail",
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
      id: "hackett_generate_api",
      sourceSystemId: "hackett",
      method: "POST",
      path: "/api/hackett/generate",
      description: "Synchronous endpoint the agent calls to generate in Hackett after evidence gating.",
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
      id: "benchmark-intelligence-agent-baseline-gap",
      description: "Seed a realistic gap where Benchmark comparison time sits between 2-3 weeks analyst and On-demand chat, so the agent can detect, narrate, and recommend remediation.",
      affectedEntities: [
        "hackett_records",
        "hackett_events",
      ],
      discoveryPath: [
        "Inspect Hackett records for the affected entities",
        "Compare against CAPS historical baseline",
        "Generate a citation-backed recommendation",
      ],
      expectedEvidence: [
        "source-system record",
        "historical baseline metric",
        "generated audit trail",
      ],
      expectedRecommendation: "Explain the gap, cite supporting evidence, and propose the next Procurement Analytics Lead action.",
    },
  ],
  datastorePackaging: {
    alloydb: {
      database: "benchmark_intelligence_agent",
      schemas: [
        "hackett",
        "caps",
        "gartner",
        "ardent_partners",
      ],
    },
    bigquery: {
      dataset: "procurement_benchmark_intelligence_agent",
      tables: [
        "kpi_summary",
        "evidence_index",
      ],
    },
    cloudStorage: {
      bucketSuffix: "benchmark-intelligence-agent-evidence",
      prefixes: [
        "documents",
        "audit-trails",
        "exports",
      ],
    },
    apis: {
      serviceName: "benchmark-intelligence-agent-source-adapters",
      deploymentTarget: "cloud_run",
    },
  },
  validation: {
    smokePrompt: "Run the Benchmark Intelligence Agent workflow and cite source-system evidence for every claim.",
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

export const BenchmarkIntelligenceAgent = () => (
  <UseCaseSlide
    title="Benchmark Intelligence Agent"
    subtitle="A-1909 • Spend Analytics"
    icon={Award}
    domainId="domain-19"
    layer="Layer 3: Custom ADK"
    persona="Procurement Analytics Lead"
    systems={["Hackett", "CAPS", "Gartner", "Ardent Partners", "BigQuery", "Vertex AI"]}
    kpis={[
      { label: "Benchmark comparison time", before: "2-3 weeks analyst", after: "On-demand chat" },
      { label: "Peer context accuracy", before: "Naive cross-industry", after: "Industry-adjusted" },
      { label: "Actionable improvement items", before: "Generic best practices", after: "Specific to our maturity" },
    ]}
    triggerType="chat"
    swimlane={swimlane}
    flow={flow}
    architecture={architecture}
    statusQuo={[
      "Benchmark comparisons made naively against cross-industry averages, ignoring business model differences.",
      "Hackett 'best-in-class' touchless PO rate of 90% assumed as target — unrealistic for engineered-to-order procurement.",
      "Analytics lead spends 2-3 weeks manually preparing benchmark slides for CPO's leadership meeting."
    ]}
    agentification={[
      "RAG over Hackett, CAPS, Gartner, and Ardent Partners benchmarks with internal KPI comparison.",
      "LLM contextualizes comparisons: 'Our 4.2-day cycle time is 3rd quartile overall but top-quartile for engineered-to-order procurement.'",
      "Generates improvement roadmaps that challenge irrelevant benchmarks and prioritize by impact and feasibility."
    ]}
  />
);
