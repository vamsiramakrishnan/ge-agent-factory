import React from "react";
import { UseCaseSlide } from "../../../agent/UseCaseSlide";
import { FlowStep } from "../../../agent/ProcessFlow";
import { SwimlaneFlow } from "../../../agent/SwimlaneFlow";
import { AgentArchitecture, UseCaseGenerationSpec, AgentBehaviorContract} from "../../../../types/architecture";
import { ToggleLeft, Database, BarChart3, FileText, Trash2 } from "lucide-react";

const swimlane: SwimlaneFlow = {
  nodes: [
    { id: "s1", label: "Weekly Audit", lane: "system", type: "trigger" },
    { id: "a1", label: "Flag Inventory", lane: "agent", type: "action" },
    { id: "a2", label: "Lifecycle Analysis", lane: "agent", type: "action" },
    { id: "a3", label: "Cleanup PRs", lane: "agent", type: "output" },
    { id: "s2", label: "Flag Report", lane: "system", type: "output" },
  ],
  connections: [["s1", "a1"], ["a1", "a2"], ["a2", "a3"], ["a3", "s2"]],
};

const flow: FlowStep[] = [
  { label: "Flag Inventory", icon: Database, description: "Feature flags audited across environments — status, rollout percentage, and last modified date.", trigger: "Weekly", systems: ["LaunchDarkly", "GitHub"] },
  { label: "Lifecycle Analysis", icon: BarChart3, description: "Stale flag detection (unchanged >90 days), rollout impact measurement on error rates and latency.", systems: ["Datadog", "BigQuery"], integration: "API" },
  { label: "Cleanup Recommendations", icon: FileText, description: "Gemini recommends flag cleanup with evidence of successful rollout or feature deprecation.", systems: ["Vertex AI"] },
  { label: "Cleanup PRs", icon: Trash2, description: "Auto-generated PRs to remove stale flags with code references and impact analysis.", output: "Cleanup PRs" },
];

const architecture: AgentArchitecture = {
  connections: [
    { system: "LaunchDarkly", description: "Feature flag definitions, rollout percentages, targeting rules", direction: "read", protocol: "REST API", category: "erp" },
    { system: "GitHub", description: "Code references to feature flags, branch contexts", direction: "bidirectional", protocol: "GraphQL API", category: "erp" },
    { system: "Datadog", description: "Error rates and latency metrics correlated with flag changes", direction: "read", protocol: "REST API", category: "analytics" },
    { system: "BigQuery", description: "Flag lifecycle analytics, rollout history, stale flag detection", direction: "bidirectional", protocol: "BigQuery SQL", category: "analytics" },
    { system: "Vertex AI (Gemini)", description: "Cleanup recommendation reasoning, impact assessment", direction: "bidirectional", protocol: "gRPC", category: "ai" },
  ],
  pipeline: [
    { label: "Flag Inventory", description: "Audit feature flags from LaunchDarkly across all environments. Track status, rollout percentage, last modified date, and code references in GitHub.", systems: ["LaunchDarkly", "GitHub"], layer: "integration", dataIn: "Flag definitions + code references", dataOut: "Complete flag inventory with usage metadata" },
    { label: "Lifecycle & Impact Analysis", description: "Detect stale flags unchanged >90 days. Measure rollout impact on error rates and latency via Datadog. Identify flags at 100% rollout that are candidates for permanent enablement.", systems: ["Datadog", "BigQuery"], layer: "ml", dataIn: "Flag inventory + performance metrics", dataOut: "Stale flag list with impact metrics" },
    { label: "Cleanup Reasoning", description: "Gemini recommends actions: '17 flags at 100% rollout for >90 days should be removed. The new-checkout-flow flag shows 2.3% conversion improvement — recommend permanent enablement and code cleanup.'", systems: ["Vertex AI (Gemini)"], layer: "llm", dataIn: "Stale flags + impact data + rollout history", dataOut: "Cleanup recommendations with evidence" },
    { label: "PR Generation", description: "Auto-generated PRs to remove stale flag references from codebase. Each PR includes impact analysis and rollout evidence to give reviewers confidence.", systems: ["GitHub"], layer: "integration", dataIn: "Cleanup recommendations", dataOut: "Cleanup PRs ready for review" },
  ],
};


const behaviorContract: AgentBehaviorContract = {
  role: "DevOps Lead agent for the Feature Flag Manager workflow",
  primaryObjective: "Gemini identifies stale flags with evidence of successful rollout, generating cleanup PRs with impact analysis. Rollout health monitoring via Datadog catches negative flag impacts within hours, not sprint retrospectives. so the DevOps Lead can move the Stale flags in production KPI.",
  inScope: [
    "Gemini identifies stale flags with evidence of successful rollout, generating cleanup PRs with impact analysis",
    "Rollout health monitoring via Datadog catches negative flag impacts within hours, not sprint retrospectives",
    "Auto-generated cleanup PRs lower the barrier to flag removal from 'a day of work' to 'review and merge.'",
  ],
  outOfScope: [
    "Production deployments outside an approved change window",
    "Irreversible destructive actions on shared infrastructure (DROP, force-delete, key rotation)",
    "Security incident attribution requiring forensics",
  ],
  toolIntents: [
    {
      name: "query_launchdarkly_launchdarkly_records",
      kind: "query",
      sourceSystemId: "launchdarkly",
      description: "Retrieve launchdarkly records from LaunchDarkly for the Feature Flag Manager workflow.",
      requiredInputs: [
        "lookup_key",
        "date_range",
      ],
      produces: [
        "launchdarkly_records_records",
        "launchdarkly_records_summary",
      ],
      evidenceEmitted: [
        "source_system_record",
      ],
    },
    {
      name: "query_github_pull_requests",
      kind: "query",
      sourceSystemId: "github",
      description: "Retrieve pull requests from GitHub for the Feature Flag Manager workflow.",
      requiredInputs: [
        "lookup_key",
        "date_range",
      ],
      produces: [
        "pull_requests_records",
        "pull_requests_summary",
      ],
      evidenceEmitted: [
        "source_system_record",
      ],
    },
    {
      name: "query_datadog_alerts",
      kind: "query",
      sourceSystemId: "datadog",
      description: "Retrieve alerts from Datadog for the Feature Flag Manager workflow.",
      requiredInputs: [
        "lookup_key",
        "date_range",
      ],
      produces: [
        "alerts_records",
        "alerts_summary",
      ],
      evidenceEmitted: [
        "sql_result",
      ],
    },
    {
      name: "query_bigquery_analytics_events",
      kind: "query",
      sourceSystemId: "bigquery",
      description: "Retrieve analytics events from BigQuery for the Feature Flag Manager workflow.",
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
      name: "lookup_feature_flag_manager_runbook",
      kind: "evidence_lookup",
      sourceSystemId: "datadog",
      description: "Look up sections of the Feature Flag Manager Operations Runbook to cite in narrative output, escalation rationale, and audit evidence.",
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
      name: "action_launchdarkly_generate",
      kind: "action",
      sourceSystemId: "launchdarkly",
      description: "Execute the generate step in LaunchDarkly after the agent has gathered evidence and validated escalation gates.",
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
      claim: "Stale flags in production moved from 50+ (no tracking) toward <5 at any time",
      mustCite: [
        "launchdarkly.launchdarkly_records",
        "github.pull_requests",
      ],
      sourceSystemIds: [
        "launchdarkly",
        "github",
      ],
    },
    {
      claim: "Flag cleanup cycle moved from Never (accumulate) toward Weekly automated",
      mustCite: [
        "launchdarkly.launchdarkly_records",
        "github.pull_requests",
      ],
      sourceSystemIds: [
        "launchdarkly",
        "github",
      ],
    },
  ],
  escalationRules: [
    {
      trigger: "Stale flags in production regresses past the 50+ (no tracking) baseline by more than 20%",
      action: "escalate_to_human",
      handoffTarget: "DevOps Lead",
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
    "Never fabricate metric values; only publish numbers derived from LaunchDarkly (and other named systems) entities.",
    "Never bypass DevOps Lead approval on escalation triggers, even when confidence is high.",
    "Never expose individual personal data (PII) in summaries; aggregate or pseudonymise before output.",
    "Never act on data older than the staleness threshold defined in the runbook without a fresh re-query.",
  ],
  goldenEvals: [
    {
      id: "feature-flag-manager-end-to-end",
      prompt: "Run the Feature Flag Manager workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.",
      expectedToolCalls: [
        "query_launchdarkly_launchdarkly_records",
        "query_github_pull_requests",
        "query_datadog_alerts",
        "query_bigquery_analytics_events",
        "lookup_feature_flag_manager_runbook",
        "action_launchdarkly_generate",
      ],
      mustReferenceEntities: [
        "launchdarkly_records",
        "pull_requests",
        "alerts",
        "analytics_events",
      ],
      mustCiteDocuments: [
        "feature-flag-manager-runbook",
      ],
      expectedActionOutcome: "Action generate executed against LaunchDarkly, with audit-trail entry and DevOps Lead notified of outcomes.",
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
    rationale: "Row counts sized for Feature Flag Manager so the agent can demonstrate the workflow against realistic transactional volume without simulating a production warehouse.",
  },
  sourceSystems: [
    {
      id: "launchdarkly",
      name: "LaunchDarkly",
      owns: [
        "launchdarkly_records",
        "launchdarkly_events",
        "launchdarkly_audit_trail",
      ],
      protocol: "REST API",
      localBacking: [
        "alloydb",
      ],
      toolNames: [
        "query_launchdarkly_launchdarkly_records",
        "query_launchdarkly_launchdarkly_events",
        "query_launchdarkly_launchdarkly_audit_trail",
      ],
      evidence: [
        "source_system_record",
        "generated_audit_trail",
      ],
    },
    {
      id: "github",
      name: "GitHub",
      owns: [
        "pull_requests",
        "commits",
        "workflow_runs",
      ],
      protocol: "REST API",
      localBacking: [
        "alloydb",
      ],
      toolNames: [
        "query_github_pull_requests",
        "query_github_commits",
        "query_github_workflow_runs",
      ],
      evidence: [
        "source_system_record",
        "generated_audit_trail",
      ],
    },
    {
      id: "datadog",
      name: "Datadog",
      owns: [
        "alerts",
        "monitors",
        "metrics_snapshots",
      ],
      protocol: "REST API",
      localBacking: [
        "bigquery",
      ],
      toolNames: [
        "query_datadog_alerts",
        "query_datadog_monitors",
        "query_datadog_metrics_snapshots",
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
      name: "launchdarkly_records",
      sourceSystemId: "launchdarkly",
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
      name: "launchdarkly_events",
      sourceSystemId: "launchdarkly",
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
          name: "launchdarkly_record_id",
          type: "ref",
          ref: "launchdarkly_records.id",
          required: true,
        },
      ],
    },
    {
      name: "launchdarkly_audit_trail",
      sourceSystemId: "launchdarkly",
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
      name: "pull_requests",
      sourceSystemId: "github",
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
      name: "commits",
      sourceSystemId: "github",
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
      name: "workflow_runs",
      sourceSystemId: "github",
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
          type: "lorem.words",
          required: true,
        },
        {
          name: "status",
          type: "enum",
          values: [
            "pending",
            "running",
            "succeeded",
            "failed",
            "rolled_back",
          ],
          required: true,
        },
        {
          name: "duration_seconds",
          type: "number",
          min: 5,
          max: 7200,
          required: true,
        },
        {
          name: "started_at",
          type: "date",
          required: true,
        },
        {
          name: "environment",
          type: "enum",
          values: [
            "dev",
            "staging",
            "prod",
          ],
          required: true,
        },
      ],
    },
    {
      name: "alerts",
      sourceSystemId: "datadog",
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
          name: "title",
          type: "lorem.sentence",
          required: true,
        },
        {
          name: "priority",
          type: "enum",
          values: [
            "P1",
            "P2",
            "P3",
            "P4",
          ],
          weights: [
            0.05,
            0.15,
            0.4,
            0.4,
          ],
          required: true,
        },
        {
          name: "status",
          type: "enum",
          values: [
            "open",
            "triaged",
            "in_progress",
            "resolved",
            "closed",
          ],
          required: true,
        },
        {
          name: "assignee",
          type: "person.fullName",
          required: true,
        },
        {
          name: "created_at",
          type: "date",
          required: true,
        },
        {
          name: "category",
          type: "enum",
          values: [
            "access",
            "hardware",
            "software",
            "network",
            "policy",
            "billing",
          ],
          required: true,
        },
        {
          name: "sla_met",
          type: "boolean",
          trueRate: 0.78,
        },
      ],
    },
    {
      name: "monitors",
      sourceSystemId: "datadog",
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
      name: "metrics_snapshots",
      sourceSystemId: "datadog",
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
      from: "launchdarkly_events.launchdarkly_record_id",
      to: "launchdarkly_records.id",
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
      id: "feature-flag-manager-runbook",
      sourceSystemId: "datadog",
      type: "runbook",
      title: "Feature Flag Manager Operations Runbook",
      requiredSections: [
        "Detection signals",
        "Triage procedures",
        "Remediation actions",
        "Rollback criteria",
        "Post-incident review",
      ],
      linkedEntities: [
        "launchdarkly_records",
        "launchdarkly_events",
        "launchdarkly_audit_trail",
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
  apis: [
    {
      id: "launchdarkly_generate_api",
      sourceSystemId: "launchdarkly",
      method: "POST",
      path: "/api/launchdarkly/generate",
      description: "Synchronous endpoint the agent calls to generate in LaunchDarkly after evidence gating.",
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
      id: "feature-flag-manager-baseline-gap",
      description: "Seed a realistic gap where Stale flags in production sits between 50+ (no tracking) and <5 at any time, so the agent can detect, narrate, and recommend remediation.",
      affectedEntities: [
        "launchdarkly_records",
        "launchdarkly_events",
      ],
      discoveryPath: [
        "Inspect LaunchDarkly records for the affected entities",
        "Compare against GitHub historical baseline",
        "Generate a citation-backed recommendation",
      ],
      expectedEvidence: [
        "source-system record",
        "historical baseline metric",
        "generated audit trail",
      ],
      expectedRecommendation: "Explain the gap, cite supporting evidence, and propose the next DevOps Lead action.",
    },
  ],
  datastorePackaging: {
    alloydb: {
      database: "feature_flag_manager",
      schemas: [
        "launchdarkly",
        "github",
      ],
    },
    bigquery: {
      dataset: "it_feature_flag_manager",
      tables: [
        "kpi_summary",
        "evidence_index",
      ],
    },
    cloudStorage: {
      bucketSuffix: "feature-flag-manager-evidence",
      prefixes: [
        "documents",
        "audit-trails",
        "exports",
      ],
    },
    apis: {
      serviceName: "feature-flag-manager-source-adapters",
      deploymentTarget: "cloud_run",
    },
  },
  validation: {
    smokePrompt: "Run the Feature Flag Manager workflow and cite source-system evidence for every claim.",
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

export const FeatureFlagManager = () => (
  <UseCaseSlide
    title="Feature Flag Manager"
    subtitle="A-3907 • Software Engineering & DevOps"
    icon={ToggleLeft}
    domainId="domain-39"
    layer="Layer 2: Agent Designer"
    persona="DevOps Lead"
    systems={["LaunchDarkly", "GitHub", "Datadog", "BigQuery", "Vertex AI"]}
    kpis={[
      { label: "Stale flags in production", before: "50+ (no tracking)", after: "<5 at any time" },
      { label: "Flag cleanup cycle", before: "Never (accumulate)", after: "Weekly automated" },
      { label: "Rollout impact visibility", before: "None", after: "Real-time metrics" },
    ]}
    triggerType="scheduled"
    swimlane={swimlane}
    flow={flow}
    architecture={architecture}
    statusQuo={[
      "Feature flags accumulate indefinitely — no one owns cleanup and old flags become technical debt.",
      "Rollout health unknown — flags enabled without monitoring impact on error rates or performance.",
      "Flag removal requires manual code search, impact assessment, and test — so it never happens."
    ]}
    agentification={[
      "Gemini identifies stale flags with evidence of successful rollout, generating cleanup PRs with impact analysis.",
      "Rollout health monitoring via Datadog catches negative flag impacts within hours, not sprint retrospectives.",
      "Auto-generated cleanup PRs lower the barrier to flag removal from 'a day of work' to 'review and merge.'"
    ]}
  />
);
