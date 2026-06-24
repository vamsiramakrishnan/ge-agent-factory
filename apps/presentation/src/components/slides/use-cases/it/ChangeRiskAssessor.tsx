import React from "react";
import { UseCaseSlide } from "../../../agent/UseCaseSlide";
import { FlowStep } from "../../../agent/ProcessFlow";
import { SwimlaneFlow } from "../../../agent/SwimlaneFlow";
import { AgentArchitecture, UseCaseGenerationSpec, AgentBehaviorContract} from "../../../../types/architecture";
import { GitBranch, FileSearch, AlertTriangle, CheckCircle, ShieldCheck } from "lucide-react";

const swimlane: SwimlaneFlow = {
  nodes: [
    { id: "s1", label: "Change Request", lane: "system", type: "trigger" },
    { id: "a1", label: "Impact Analysis", lane: "agent", type: "action" },
    { id: "a2", label: "Risk Scoring", lane: "agent", type: "action" },
    { id: "a3", label: "Risk Assessment", lane: "agent", type: "output" },
    { id: "h1", label: "CAB Approves", lane: "human", type: "hitl" },
  ],
  connections: [["s1", "a1"], ["a1", "a2"], ["a2", "a3"], ["a3", "h1"]],
};

const flow: FlowStep[] = [
  { label: "Change Submitted", icon: GitBranch, description: "Change request submitted with scope, timing, and affected systems.", trigger: "Event-driven", systems: ["ServiceNow"] },
  { label: "Impact Analysis", icon: FileSearch, description: "Blast radius estimated using dependency maps, recent changes, and feature flag conflicts.", systems: ["Jira", "GitHub", "Datadog"], integration: "ADK" },
  { label: "Risk Scoring", icon: AlertTriangle, description: "LLM assesses change holistically — conflict detection, optimal window recommendation, rollback plan validation.", systems: ["Vertex AI"] },
  { label: "CAB Review", icon: CheckCircle, description: "Change Advisory Board reviews high-risk changes with agent's risk assessment and recommendation.", output: "Change Risk Score" },
];

const architecture: AgentArchitecture = {
  connections: [
    { system: "ServiceNow", description: "Change requests, approval workflows, change calendar", direction: "bidirectional", protocol: "REST API", category: "erp" },
    { system: "Jira", description: "Related user stories, deployment tickets", direction: "read", protocol: "REST API", category: "collaboration" },
    { system: "GitHub", description: "Code changes, PR diffs, deployment manifests", direction: "read", protocol: "REST API", category: "collaboration" },
    { system: "Datadog", description: "Service health, dependency maps, error baselines", direction: "read", protocol: "REST API", category: "analytics" },
    { system: "BigQuery", description: "Historical change failure rates, blast radius analytics", direction: "bidirectional", protocol: "BigQuery SQL", category: "analytics" },
    { system: "Vertex AI (Gemini)", description: "Change risk reasoning, conflict detection, window optimization", direction: "bidirectional", protocol: "gRPC", category: "ai" },
  ],
  pipeline: [
    { label: "Change Context Collection", description: "Pull change request details from ServiceNow, related code changes from GitHub, and deployment context from Jira. Map affected services using Datadog dependency graph.", systems: ["ServiceNow", "Jira", "GitHub", "Datadog"], layer: "integration", dataIn: "Change request + code diff + service map", dataOut: "Enriched change context with blast radius" },
    { label: "Conflict & Dependency Analysis", description: "Detect scheduling conflicts with other changes, feature flag dependencies, and database schema coupling. Score change failure probability from historical patterns.", systems: ["BigQuery", "Datadog"], layer: "ml", dataIn: "Change context + change calendar + historical data", dataOut: "Conflict list + failure probability score" },
    { label: "Holistic Risk Assessment", description: "Gemini assesses change risk holistically — considering dependency chains, active feature flags, deployment window risks, and rollback plan completeness. Recommends optimal deployment timing.", systems: ["Vertex AI (Gemini)"], layer: "llm", dataIn: "Conflicts + failure probability + dependency chain", dataOut: "Risk assessment with deployment recommendations" },
    { label: "CAB Preparation", description: "Risk assessment formatted for Change Advisory Board review. High-risk changes flagged with specific concerns and recommended mitigations.", systems: ["ServiceNow"], layer: "integration", dataIn: "Risk assessment", dataOut: "CAB-ready change review package" },
  ],
};


const behaviorContract: AgentBehaviorContract = {
  role: "IT Service Desk Manager agent for the Change Risk Assessor workflow",
  primaryObjective: "Gemini assesses change risk holistically — detecting feature flag conflicts and schema dependencies automatically. LLM recommends optimal deployment windows based on traffic patterns and change calendar. so the IT Service Desk Manager can move the Change failure rate KPI.",
  inScope: [
    "Gemini assesses change risk holistically — detecting feature flag conflicts and schema dependencies automatically",
    "LLM recommends optimal deployment windows based on traffic patterns and change calendar",
    "Data-driven risk scoring reduces change failure rate from 12% to 4%",
  ],
  outOfScope: [
    "Production deployments outside an approved change window",
    "Irreversible destructive actions on shared infrastructure (DROP, force-delete, key rotation)",
    "Security incident attribution requiring forensics",
  ],
  toolIntents: [
    {
      name: "query_servicenow_tickets",
      kind: "query",
      sourceSystemId: "servicenow",
      description: "Retrieve tickets from ServiceNow for the Change Risk Assessor workflow.",
      requiredInputs: [
        "lookup_key",
        "date_range",
      ],
      produces: [
        "tickets_records",
        "tickets_summary",
      ],
      evidenceEmitted: [
        "source_system_record",
      ],
    },
    {
      name: "query_jira_issues",
      kind: "query",
      sourceSystemId: "jira",
      description: "Retrieve issues from Jira for the Change Risk Assessor workflow.",
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
      name: "query_github_pull_requests",
      kind: "query",
      sourceSystemId: "github",
      description: "Retrieve pull requests from GitHub for the Change Risk Assessor workflow.",
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
      description: "Retrieve alerts from Datadog for the Change Risk Assessor workflow.",
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
      name: "lookup_change_risk_assessor_runbook",
      kind: "evidence_lookup",
      sourceSystemId: "datadog",
      description: "Look up sections of the Change Risk Assessor Operations Runbook to cite in narrative output, escalation rationale, and audit evidence.",
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
      name: "action_servicenow_recommend",
      kind: "action",
      sourceSystemId: "servicenow",
      description: "Execute the recommend step in ServiceNow after the agent has gathered evidence and validated escalation gates.",
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
      claim: "Change failure rate moved from 12% of changes toward 4% with risk scoring",
      mustCite: [
        "servicenow.tickets",
        "jira.issues",
      ],
      sourceSystemIds: [
        "servicenow",
        "jira",
      ],
    },
    {
      claim: "Risk assessment time moved from 2-3 hours manual toward 15 minutes",
      mustCite: [
        "servicenow.tickets",
        "jira.issues",
      ],
      sourceSystemIds: [
        "servicenow",
        "jira",
      ],
    },
  ],
  escalationRules: [
    {
      trigger: "Change failure rate regresses past the 12% of changes baseline by more than 20%",
      action: "escalate_to_human",
      handoffTarget: "IT Service Desk Manager",
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
    "Never fabricate metric values; only publish numbers derived from ServiceNow (and other named systems) entities.",
    "Never bypass IT Service Desk Manager approval on escalation triggers, even when confidence is high.",
    "Never expose individual personal data (PII) in summaries; aggregate or pseudonymise before output.",
    "Never act on data older than the staleness threshold defined in the runbook without a fresh re-query.",
  ],
  goldenEvals: [
    {
      id: "change-risk-assessor-end-to-end",
      prompt: "Run the Change Risk Assessor workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.",
      expectedToolCalls: [
        "query_servicenow_tickets",
        "query_jira_issues",
        "query_github_pull_requests",
        "query_datadog_alerts",
        "lookup_change_risk_assessor_runbook",
        "action_servicenow_recommend",
      ],
      mustReferenceEntities: [
        "tickets",
        "issues",
        "pull_requests",
        "alerts",
      ],
      mustCiteDocuments: [
        "change-risk-assessor-runbook",
      ],
      expectedActionOutcome: "Action recommend executed against ServiceNow, with audit-trail entry and IT Service Desk Manager notified of outcomes.",
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
    rationale: "Row counts sized for Change Risk Assessor so the agent can demonstrate the workflow against realistic transactional volume without simulating a production warehouse.",
  },
  sourceSystems: [
    {
      id: "servicenow",
      name: "ServiceNow",
      owns: [
        "tickets",
        "change_requests",
        "incidents",
      ],
      protocol: "REST API",
      localBacking: [
        "alloydb",
      ],
      toolNames: [
        "query_servicenow_tickets",
        "query_servicenow_change_requests",
        "query_servicenow_incidents",
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
  ],
  entities: [
    {
      name: "tickets",
      sourceSystemId: "servicenow",
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
      name: "change_requests",
      sourceSystemId: "servicenow",
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
      name: "incidents",
      sourceSystemId: "servicenow",
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
  ],
  relationships: [],
  documents: [
    {
      id: "change-risk-assessor-runbook",
      sourceSystemId: "datadog",
      type: "runbook",
      title: "Change Risk Assessor Operations Runbook",
      requiredSections: [
        "Detection signals",
        "Triage procedures",
        "Remediation actions",
        "Rollback criteria",
        "Post-incident review",
      ],
      linkedEntities: [
        "tickets",
        "change_requests",
        "incidents",
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
      id: "servicenow_recommend_api",
      sourceSystemId: "servicenow",
      method: "POST",
      path: "/api/servicenow/recommend",
      description: "Synchronous endpoint the agent calls to recommend in ServiceNow after evidence gating.",
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
      id: "change-risk-assessor-baseline-gap",
      description: "Seed a realistic gap where Change failure rate sits between 12% of changes and 4% with risk scoring, so the agent can detect, narrate, and recommend remediation.",
      affectedEntities: [
        "tickets",
        "change_requests",
      ],
      discoveryPath: [
        "Inspect ServiceNow records for the affected entities",
        "Compare against Jira historical baseline",
        "Generate a citation-backed recommendation",
      ],
      expectedEvidence: [
        "source-system record",
        "historical baseline metric",
        "generated audit trail",
      ],
      expectedRecommendation: "Explain the gap, cite supporting evidence, and propose the next IT Service Desk Manager action.",
    },
  ],
  datastorePackaging: {
    alloydb: {
      database: "change_risk_assessor",
      schemas: [
        "servicenow",
        "jira",
        "github",
      ],
    },
    bigquery: {
      dataset: "it_change_risk_assessor",
      tables: [
        "kpi_summary",
        "evidence_index",
      ],
    },
    cloudStorage: {
      bucketSuffix: "change-risk-assessor-evidence",
      prefixes: [
        "documents",
        "audit-trails",
        "exports",
      ],
    },
    apis: {
      serviceName: "change-risk-assessor-source-adapters",
      deploymentTarget: "cloud_run",
    },
  },
  validation: {
    smokePrompt: "Run the Change Risk Assessor workflow and cite source-system evidence for every claim.",
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

export const ChangeRiskAssessor = () => (
  <UseCaseSlide
    title="Change Risk Assessor"
    subtitle="IT5-04 • IT Service Management"
    icon={ShieldCheck}
    domainId="domain-42"
    layer="Layer 3: Custom ADK"
    persona="IT Service Desk Manager"
    systems={["ServiceNow", "Jira", "GitHub", "Datadog", "Vertex AI"]}
    kpis={[
      { label: "Change failure rate", before: "12% of changes", after: "4% with risk scoring" },
      { label: "Risk assessment time", before: "2-3 hours manual", after: "15 minutes" },
      { label: "Conflict detection", before: "Discovered in production", after: "Caught pre-deployment" },
    ]}
    triggerType="event"
    swimlane={swimlane}
    flow={flow}
    architecture={architecture}
    hitl={{ actor: "Change Advisory Board", action: "Approve high-risk changes", description: "CAB reviews agent's risk assessment for high-risk changes, validating the blast radius analysis and approving deployment window." }}
    statusQuo={[
      "Change risk assessed manually using static templates without dependency analysis.",
      "Scheduling conflicts between changes discovered in production rather than pre-deployment.",
      "CAB reviews lack data-driven risk scoring, relying on subjective assessment.",
    ]}
    agentification={[
      "Gemini assesses change risk holistically — detecting feature flag conflicts and schema dependencies automatically.",
      "LLM recommends optimal deployment windows based on traffic patterns and change calendar.",
      "Data-driven risk scoring reduces change failure rate from 12% to 4%.",
    ]}
  />
);
