import React from "react";
import { UseCaseSlide } from "../../../agent/UseCaseSlide";
import { FlowStep } from "../../../agent/ProcessFlow";
import { SwimlaneFlow } from "../../../agent/SwimlaneFlow";
import { AgentArchitecture, UseCaseGenerationSpec, AgentBehaviorContract} from "../../../../types/architecture";
import { ShieldAlert, Database, TrendingDown, Brain, AlertTriangle } from "lucide-react";

const swimlane: SwimlaneFlow = {
  nodes: [
    { id: "s1", label: "Monthly Cycle", lane: "system", type: "trigger" },
    { id: "a1", label: "Risk Data Ingest", lane: "agent", type: "action" },
    { id: "a2", label: "ML Scoring Model", lane: "agent", type: "action" },
    { id: "a3", label: "Signal Synthesis", lane: "agent", type: "action" },
    { id: "a4", label: "Risk Narrative", lane: "agent", type: "output" },
    { id: "s2", label: "BigQuery Store", lane: "system", type: "output" },
  ],
  connections: [["s1", "a1"], ["a1", "a2"], ["a2", "a3"], ["a3", "a4"], ["a4", "s2"]],
};

const flow: FlowStep[] = [
  { label: "Data Aggregation", icon: Database, description: "Financial, operational, cyber, and geopolitical risk signals pulled from 6+ providers.", trigger: "Monthly", systems: ["D&B", "RapidRatings", "Resilinc"] },
  { label: "Multi-Factor Scoring", icon: TrendingDown, description: "ML model weights financial stability, operational capacity, cyber risk, and concentration.", systems: ["BigQuery", "Vertex AI"], integration: "Data Agent" },
  { label: "Pattern Synthesis", icon: Brain, description: "LLM connects individually minor signals — D&B downgrade, exec departure, declining OTIF — into distress narratives.", systems: ["Vertex AI"] },
  { label: "Risk Alert", icon: AlertTriangle, description: "Composite risk score with narrative explanation published to risk dashboards.", output: "Risk Scorecard" },
];

const architecture: AgentArchitecture = {
  connections: [
    { system: "Dun & Bradstreet", description: "Financial stability scores, credit ratings, corporate linkage", direction: "read", protocol: "REST API", category: "market-data" },
    { system: "RapidRatings", description: "Financial health ratings, predictive default probabilities", direction: "read", protocol: "REST API", category: "market-data" },
    { system: "Resilinc", description: "Operational risk signals, disruption alerts, supply chain mapping", direction: "read", protocol: "REST API", category: "market-data" },
    { system: "BitSight", description: "Cyber risk ratings, security posture assessment", direction: "read", protocol: "REST API", category: "market-data" },
    { system: "BigQuery", description: "Unified risk data warehouse, composite scoring, time-series analytics", direction: "bidirectional", protocol: "BigQuery SQL", category: "analytics" },
    { system: "Vertex AI (Gemini)", description: "Multi-signal synthesis, distress pattern reasoning, risk narrative generation", direction: "bidirectional", protocol: "gRPC", category: "ai" },
  ],
  pipeline: [
    { label: "Risk Data Aggregation", description: "Pull financial stability data from D&B and RapidRatings, cyber risk from BitSight, operational signals from Resilinc, and credit ratings from Moody's. Normalize into a common risk framework in BigQuery.", systems: ["Dun & Bradstreet", "RapidRatings", "Resilinc", "BitSight"], layer: "integration", dataIn: "Raw risk feeds from 6+ providers", dataOut: "Normalized risk signals in common framework" },
    { label: "Multi-Factor Risk Scoring", description: "ML model weights financial stability, operational capacity, geopolitical exposure, concentration, and cyber risk into composite scores. Predictive risk trajectory modeling using time-series on score evolution.", systems: ["BigQuery", "Vertex AI"], layer: "ml", dataIn: "Normalized risk signals", dataOut: "Composite risk scores with confidence intervals" },
    { label: "Distress Pattern Synthesis", description: "Gemini connects individually minor signals — a small D&B downgrade + executive departure in trade press + delayed QBR response + declining OTIF over 3 months — into a coherent distress narrative. No single signal triggers an alert, but the pattern indicates trouble.", systems: ["Vertex AI (Gemini)"], layer: "llm", dataIn: "Composite scores + unstructured signals", dataOut: "Risk narratives explaining the story behind the score" },
    { label: "Alert & Dashboard Delivery", description: "Risk scorecards with narrative explanations published to dashboards and pushed to risk team via alerts on score threshold changes.", systems: ["BigQuery", "Email"], layer: "integration", dataIn: "Risk narratives + score changes", dataOut: "Distributed risk scorecards with alerts" },
  ],
};


const behaviorContract: AgentBehaviorContract = {
  role: "Supplier Risk Analyst agent for the Supplier Risk Scoring Engine workflow",
  primaryObjective: "Multi-factor ML model integrates financial (RapidRatings), cyber (BitSight), operational (Resilinc), and credit (Moody's) data. LLM synthesizes individually minor signals — small D&B downgrade + executive departure + declining OTIF — into distress pattern narratives. so the Supplier Risk Analyst can move the Risk signal sources KPI.",
  inScope: [
    "Multi-factor ML model integrates financial (RapidRatings), cyber (BitSight), operational (Resilinc), and credit (Moody's) data",
    "LLM synthesizes individually minor signals — small D&B downgrade + executive departure + declining OTIF — into distress pattern narratives",
    "Generates risk stories that explain the 'why' behind the score, enabling proactive supplier engagement",
  ],
  outOfScope: [
    "Contract execution without legal review",
    "Supplier disqualification decisions (category lead retains authority)",
    "Single-source justification overrides above policy threshold",
  ],
  toolIntents: [
    {
      name: "query_d_b_d_b_records",
      kind: "query",
      sourceSystemId: "d_b",
      description: "Retrieve d b records from D&B for the Supplier Risk Scoring Engine workflow.",
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
      name: "query_rapidratings_rapidratings_records",
      kind: "query",
      sourceSystemId: "rapidratings",
      description: "Retrieve rapidratings records from RapidRatings for the Supplier Risk Scoring Engine workflow.",
      requiredInputs: [
        "lookup_key",
        "date_range",
      ],
      produces: [
        "rapidratings_records_records",
        "rapidratings_records_summary",
      ],
      evidenceEmitted: [
        "source_system_record",
      ],
    },
    {
      name: "query_resilinc_resilinc_records",
      kind: "query",
      sourceSystemId: "resilinc",
      description: "Retrieve resilinc records from Resilinc for the Supplier Risk Scoring Engine workflow.",
      requiredInputs: [
        "lookup_key",
        "date_range",
      ],
      produces: [
        "resilinc_records_records",
        "resilinc_records_summary",
      ],
      evidenceEmitted: [
        "source_system_record",
      ],
    },
    {
      name: "query_moody_s_moody_s_records",
      kind: "query",
      sourceSystemId: "moody_s",
      description: "Retrieve moody s records from Moody's for the Supplier Risk Scoring Engine workflow.",
      requiredInputs: [
        "lookup_key",
        "date_range",
      ],
      produces: [
        "moody_s_records_records",
        "moody_s_records_summary",
      ],
      evidenceEmitted: [
        "source_system_record",
      ],
    },
    {
      name: "lookup_supplier_risk_scoring_engine_policy_guide",
      kind: "evidence_lookup",
      sourceSystemId: "bigquery",
      description: "Look up sections of the Supplier Risk Scoring Engine Procurement Policy Guide to cite in narrative output, escalation rationale, and audit evidence.",
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
      name: "action_d_b_generate",
      kind: "action",
      sourceSystemId: "d_b",
      description: "Execute the generate step in D&B after the agent has gathered evidence and validated escalation gates.",
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
      claim: "Risk signal sources moved from 2-3 manual checks toward 7 automated feeds",
      mustCite: [
        "d_b.d_b_records",
        "rapidratings.rapidratings_records",
      ],
      sourceSystemIds: [
        "d_b",
        "rapidratings",
      ],
    },
    {
      claim: "Score refresh cycle moved from Quarterly toward Continuous",
      mustCite: [
        "d_b.d_b_records",
        "rapidratings.rapidratings_records",
      ],
      sourceSystemIds: [
        "d_b",
        "rapidratings",
      ],
    },
  ],
  escalationRules: [
    {
      trigger: "Risk signal sources regresses past the 2-3 manual checks baseline by more than 20%",
      action: "escalate_to_human",
      handoffTarget: "Supplier Risk Analyst",
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
    "Never fabricate metric values; only publish numbers derived from D&B (and other named systems) entities.",
    "Never bypass Supplier Risk Analyst approval on escalation triggers, even when confidence is high.",
    "Never expose individual personal data (PII) in summaries; aggregate or pseudonymise before output.",
    "Never act on data older than the staleness threshold defined in the runbook without a fresh re-query.",
  ],
  goldenEvals: [
    {
      id: "supplier-risk-scoring-engine-end-to-end",
      prompt: "Run the Supplier Risk Scoring Engine workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.",
      expectedToolCalls: [
        "query_d_b_d_b_records",
        "query_rapidratings_rapidratings_records",
        "query_resilinc_resilinc_records",
        "query_moody_s_moody_s_records",
        "lookup_supplier_risk_scoring_engine_policy_guide",
        "action_d_b_generate",
      ],
      mustReferenceEntities: [
        "d_b_records",
        "rapidratings_records",
        "resilinc_records",
        "moody_s_records",
        "bitsight_records",
        "analytics_events",
      ],
      mustCiteDocuments: [
        "supplier-risk-scoring-engine-policy-guide",
      ],
      expectedActionOutcome: "Action generate executed against D&B, with audit-trail entry and Supplier Risk Analyst notified of outcomes.",
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
    rationale: "Row counts sized for Supplier Risk Scoring Engine so the agent can demonstrate the workflow against realistic transactional volume without simulating a production warehouse.",
  },
  sourceSystems: [
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
      id: "rapidratings",
      name: "RapidRatings",
      owns: [
        "rapidratings_records",
        "rapidratings_events",
        "rapidratings_audit_trail",
      ],
      protocol: "REST API",
      localBacking: [
        "alloydb",
      ],
      toolNames: [
        "query_rapidratings_rapidratings_records",
        "query_rapidratings_rapidratings_events",
        "query_rapidratings_rapidratings_audit_trail",
      ],
      evidence: [
        "source_system_record",
        "generated_audit_trail",
      ],
    },
    {
      id: "resilinc",
      name: "Resilinc",
      owns: [
        "resilinc_records",
        "resilinc_events",
        "resilinc_audit_trail",
      ],
      protocol: "REST API",
      localBacking: [
        "alloydb",
      ],
      toolNames: [
        "query_resilinc_resilinc_records",
        "query_resilinc_resilinc_events",
        "query_resilinc_resilinc_audit_trail",
      ],
      evidence: [
        "source_system_record",
        "generated_audit_trail",
      ],
    },
    {
      id: "moody_s",
      name: "Moody's",
      owns: [
        "moody_s_records",
        "moody_s_events",
        "moody_s_audit_trail",
      ],
      protocol: "REST API",
      localBacking: [
        "alloydb",
      ],
      toolNames: [
        "query_moody_s_moody_s_records",
        "query_moody_s_moody_s_events",
        "query_moody_s_moody_s_audit_trail",
      ],
      evidence: [
        "source_system_record",
        "generated_audit_trail",
      ],
    },
    {
      id: "bitsight",
      name: "BitSight",
      owns: [
        "bitsight_records",
        "bitsight_events",
        "bitsight_audit_trail",
      ],
      protocol: "REST API",
      localBacking: [
        "alloydb",
      ],
      toolNames: [
        "query_bitsight_bitsight_records",
        "query_bitsight_bitsight_events",
        "query_bitsight_bitsight_audit_trail",
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
      name: "rapidratings_records",
      sourceSystemId: "rapidratings",
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
      name: "rapidratings_events",
      sourceSystemId: "rapidratings",
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
          name: "rapidratings_record_id",
          type: "ref",
          ref: "rapidratings_records.id",
          required: true,
        },
      ],
    },
    {
      name: "rapidratings_audit_trail",
      sourceSystemId: "rapidratings",
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
      name: "resilinc_records",
      sourceSystemId: "resilinc",
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
      name: "resilinc_events",
      sourceSystemId: "resilinc",
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
          name: "resilinc_record_id",
          type: "ref",
          ref: "resilinc_records.id",
          required: true,
        },
      ],
    },
    {
      name: "resilinc_audit_trail",
      sourceSystemId: "resilinc",
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
      name: "moody_s_records",
      sourceSystemId: "moody_s",
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
      name: "moody_s_events",
      sourceSystemId: "moody_s",
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
          name: "moody_s_record_id",
          type: "ref",
          ref: "moody_s_records.id",
          required: true,
        },
      ],
    },
    {
      name: "moody_s_audit_trail",
      sourceSystemId: "moody_s",
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
      name: "bitsight_records",
      sourceSystemId: "bitsight",
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
      name: "bitsight_events",
      sourceSystemId: "bitsight",
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
          name: "bitsight_record_id",
          type: "ref",
          ref: "bitsight_records.id",
          required: true,
        },
      ],
    },
    {
      name: "bitsight_audit_trail",
      sourceSystemId: "bitsight",
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
      from: "d_b_events.d_b_record_id",
      to: "d_b_records.id",
      cardinality: "many-to-one",
      orphanPolicy: "none",
    },
    {
      from: "rapidratings_events.rapidratings_record_id",
      to: "rapidratings_records.id",
      cardinality: "many-to-one",
      orphanPolicy: "none",
    },
    {
      from: "resilinc_events.resilinc_record_id",
      to: "resilinc_records.id",
      cardinality: "many-to-one",
      orphanPolicy: "none",
    },
    {
      from: "moody_s_events.moody_s_record_id",
      to: "moody_s_records.id",
      cardinality: "many-to-one",
      orphanPolicy: "none",
    },
    {
      from: "bitsight_events.bitsight_record_id",
      to: "bitsight_records.id",
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
      id: "supplier-risk-scoring-engine-policy-guide",
      sourceSystemId: "bigquery",
      type: "policy",
      title: "Supplier Risk Scoring Engine Procurement Policy Guide",
      requiredSections: [
        "Sourcing principles",
        "Approval thresholds",
        "Supplier risk requirements",
        "Contract and compliance gates",
        "Exception handling",
      ],
      linkedEntities: [
        "d_b_records",
        "d_b_events",
        "d_b_audit_trail",
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
      id: "d_b_generate_api",
      sourceSystemId: "d_b",
      method: "POST",
      path: "/api/d_b/generate",
      description: "Synchronous endpoint the agent calls to generate in D&B after evidence gating.",
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
      id: "supplier-risk-scoring-engine-baseline-gap",
      description: "Seed a realistic gap where Risk signal sources sits between 2-3 manual checks and 7 automated feeds, so the agent can detect, narrate, and recommend remediation.",
      affectedEntities: [
        "d_b_records",
        "d_b_events",
      ],
      discoveryPath: [
        "Inspect D&B records for the affected entities",
        "Compare against RapidRatings historical baseline",
        "Generate a citation-backed recommendation",
      ],
      expectedEvidence: [
        "source-system record",
        "historical baseline metric",
        "generated audit trail",
      ],
      expectedRecommendation: "Explain the gap, cite supporting evidence, and propose the next Supplier Risk Analyst action.",
    },
  ],
  datastorePackaging: {
    alloydb: {
      database: "supplier_risk_scoring_engine",
      schemas: [
        "d_b",
        "rapidratings",
        "resilinc",
        "moody_s",
        "bitsight",
      ],
    },
    bigquery: {
      dataset: "procurement_supplier_risk_scoring_engine",
      tables: [
        "kpi_summary",
        "evidence_index",
      ],
    },
    cloudStorage: {
      bucketSuffix: "supplier-risk-scoring-engine-evidence",
      prefixes: [
        "documents",
        "audit-trails",
        "exports",
      ],
    },
    apis: {
      serviceName: "supplier-risk-scoring-engine-source-adapters",
      deploymentTarget: "cloud_run",
    },
  },
  validation: {
    smokePrompt: "Run the Supplier Risk Scoring Engine workflow and cite source-system evidence for every claim.",
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

export const SupplierRiskScoringEngine = () => (
  <UseCaseSlide
    title="Supplier Risk Scoring Engine"
    subtitle="A-1601 • Supplier Risk"
    icon={ShieldAlert}
    domainId="domain-16"
    layer="Layer 4: Data Agent"
    persona="Supplier Risk Analyst"
    systems={["D&B", "RapidRatings", "Resilinc", "Moody's", "BitSight", "BigQuery", "Vertex AI"]}
    kpis={[
      { label: "Risk signal sources", before: "2-3 manual checks", after: "7 automated feeds" },
      { label: "Score refresh cycle", before: "Quarterly", after: "Continuous" },
      { label: "Early distress detection", before: "After disruption", after: "3-6 months advance" },
    ]}
    triggerType="scheduled"
    swimlane={swimlane}
    flow={flow}
    architecture={architecture}
    statusQuo={[
      "Risk assessments rely on annual D&B reports — stale by the time they're reviewed.",
      "No way to connect weak signals across financial, operational, and cyber dimensions.",
      "Risk scores are numbers without narrative — stakeholders don't know what to do with a '65'."
    ]}
    agentification={[
      "Multi-factor ML model integrates financial (RapidRatings), cyber (BitSight), operational (Resilinc), and credit (Moody's) data.",
      "LLM synthesizes individually minor signals — small D&B downgrade + executive departure + declining OTIF — into distress pattern narratives.",
      "Generates risk stories that explain the 'why' behind the score, enabling proactive supplier engagement."
    ]}
  />
);
