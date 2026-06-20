import React from "react";
import { UseCaseSlide } from "../../../agent/UseCaseSlide";
import { FlowStep } from "../../../agent/ProcessFlow";
import { SwimlaneFlow } from "../../../agent/SwimlaneFlow";
import { AgentArchitecture, UseCaseGenerationSpec, AgentBehaviorContract} from "../../../../types/architecture";
import { GitCompare, Database, Search, FileText, GitPullRequest } from "lucide-react";

const swimlane: SwimlaneFlow = {
  nodes: [
    { id: "s1", label: "Daily Scan", lane: "system", type: "trigger" },
    { id: "a1", label: "Terraform Plan", lane: "agent", type: "action" },
    { id: "a2", label: "Drift Classification", lane: "agent", type: "action" },
    { id: "a3", label: "Remediation PR", lane: "agent", type: "output" },
    { id: "s2", label: "State Reconciled", lane: "system", type: "output" },
  ],
  connections: [["s1", "a1"], ["a1", "a2"], ["a2", "a3"], ["a3", "s2"]],
};

const flow: FlowStep[] = [
  { label: "Terraform Plan", icon: Database, description: "Run terraform plan against all environments to detect drift between declared and actual infrastructure state.", trigger: "Daily", systems: ["Terraform", "AWS CloudFormation"] },
  { label: "Drift Classification", icon: Search, description: "Classify drift patterns, detect recurrence, and estimate blast radius of manual changes.", systems: ["BigQuery", "Vertex AI"], integration: "ADK" },
  { label: "Context Explanation", icon: FileText, description: "Gemini explains drift with incident context — distinguishing emergency workarounds from configuration errors.", systems: ["Vertex AI"] },
  { label: "Remediation PRs", icon: GitPullRequest, description: "Auto-generated PRs to import manual changes into Terraform state or remove stale workarounds.", output: "Remediation PRs" },
];

const architecture: AgentArchitecture = {
  connections: [
    { system: "Terraform", description: "State files, plan output, resource declarations", direction: "bidirectional", protocol: "CLI / REST API", category: "erp" },
    { system: "AWS CloudFormation", description: "Stack drift detection, resource status", direction: "read", protocol: "REST API", category: "erp" },
    { system: "GitHub", description: "IaC repository, PR creation for remediation", direction: "bidirectional", protocol: "GraphQL API", category: "erp" },
    { system: "BigQuery", description: "Drift history, recurrence patterns, blast radius data", direction: "bidirectional", protocol: "BigQuery SQL", category: "analytics" },
    { system: "Vertex AI (Gemini)", description: "Drift context reasoning, import vs. remove recommendation", direction: "bidirectional", protocol: "gRPC", category: "ai" },
  ],
  pipeline: [
    { label: "Drift Detection", description: "Run terraform plan against all environments — production, staging, development. Detect differences between declared Terraform state and actual cloud infrastructure.", systems: ["Terraform", "AWS CloudFormation"], layer: "integration", dataIn: "Terraform state files + cloud provider APIs", dataOut: "Drift report by environment and resource type" },
    { label: "Drift Classification & Analysis", description: "Classify drift patterns (security group, IAM, compute config). Detect recurrence by comparing against historical drift data. Estimate blast radius of unmanaged changes.", systems: ["BigQuery"], layer: "ml", dataIn: "Drift report + historical patterns", dataOut: "Classified drift with recurrence flags and risk scores" },
    { label: "Contextual Explanation", description: "Gemini explains drift: 'Production VPC has 3 security group rules not in Terraform — added manually during the March 15 incident response. Recommend importing into Terraform or removing if workaround no longer needed.'", systems: ["Vertex AI (Gemini)"], layer: "llm", dataIn: "Classified drift + incident history", dataOut: "Contextualized drift explanations with remediation advice" },
    { label: "Remediation PR Generation", description: "Auto-generate PRs to import manual changes into Terraform state or remove stale workarounds. Each PR includes context explanation and blast radius analysis.", systems: ["GitHub"], layer: "integration", dataIn: "Remediation recommendations", dataOut: "PRs ready for DevOps review" },
  ],
};


const behaviorContract: AgentBehaviorContract = {
  role: "DevOps Lead agent for the IaC Drift Detector workflow",
  primaryObjective: "Gemini explains drift with incident context — distinguishing emergency workarounds that should be imported from errors to remove. Daily drift detection catches manual changes within 24 hours instead of letting them accumulate for months. so the DevOps Lead can move the Drift detection frequency KPI.",
  inScope: [
    "Gemini explains drift with incident context — distinguishing emergency workarounds that should be imported from errors to remove",
    "Daily drift detection catches manual changes within 24 hours instead of letting them accumulate for months",
    "Auto-generated remediation PRs lower the barrier from 'multi-day effort' to 'review and merge.'",
  ],
  outOfScope: [
    "Production deployments outside an approved change window",
    "Irreversible destructive actions on shared infrastructure (DROP, force-delete, key rotation)",
    "Security incident attribution requiring forensics",
  ],
  toolIntents: [
    {
      name: "query_terraform_modules",
      kind: "query",
      sourceSystemId: "terraform",
      description: "Retrieve modules from Terraform for the IaC Drift Detector workflow.",
      requiredInputs: [
        "lookup_key",
        "date_range",
      ],
      produces: [
        "modules_records",
        "modules_summary",
      ],
      evidenceEmitted: [
        "source_system_record",
      ],
    },
    {
      name: "query_aws_cloudformation_billing_records",
      kind: "query",
      sourceSystemId: "aws_cloudformation",
      description: "Retrieve billing records from AWS CloudFormation for the IaC Drift Detector workflow.",
      requiredInputs: [
        "lookup_key",
        "date_range",
      ],
      produces: [
        "billing_records_records",
        "billing_records_summary",
      ],
      evidenceEmitted: [
        "source_system_record",
      ],
    },
    {
      name: "query_github_pull_requests",
      kind: "query",
      sourceSystemId: "github",
      description: "Retrieve pull requests from GitHub for the IaC Drift Detector workflow.",
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
      name: "lookup_iac_drift_detector_runbook",
      kind: "evidence_lookup",
      sourceSystemId: "terraform",
      description: "Look up sections of the IaC Drift Detector Operations Runbook to cite in narrative output, escalation rationale, and audit evidence.",
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
      name: "action_terraform_generate",
      kind: "action",
      sourceSystemId: "terraform",
      description: "Execute the generate step in Terraform after the agent has gathered evidence and validated escalation gates.",
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
      claim: "Drift detection frequency moved from Quarterly audit toward Daily automated",
      mustCite: [
        "terraform.modules",
        "aws_cloudformation.billing_records",
      ],
      sourceSystemIds: [
        "terraform",
        "aws_cloudformation",
      ],
    },
    {
      claim: "Manual changes in production moved from Unknown toward 100% tracked",
      mustCite: [
        "terraform.modules",
        "aws_cloudformation.billing_records",
      ],
      sourceSystemIds: [
        "terraform",
        "aws_cloudformation",
      ],
    },
  ],
  escalationRules: [
    {
      trigger: "Drift detection frequency regresses past the Quarterly audit baseline by more than 20%",
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
    "Never fabricate metric values; only publish numbers derived from Terraform (and other named systems) entities.",
    "Never bypass DevOps Lead approval on escalation triggers, even when confidence is high.",
    "Never expose individual personal data (PII) in summaries; aggregate or pseudonymise before output.",
    "Never act on data older than the staleness threshold defined in the runbook without a fresh re-query.",
  ],
  goldenEvals: [
    {
      id: "iac-drift-detector-end-to-end",
      prompt: "Run the IaC Drift Detector workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.",
      expectedToolCalls: [
        "query_terraform_modules",
        "query_aws_cloudformation_billing_records",
        "query_github_pull_requests",
        "lookup_iac_drift_detector_runbook",
        "action_terraform_generate",
      ],
      mustReferenceEntities: [
        "modules",
        "billing_records",
        "pull_requests",
      ],
      mustCiteDocuments: [
        "iac-drift-detector-runbook",
      ],
      expectedActionOutcome: "Action generate executed against Terraform, with audit-trail entry and DevOps Lead notified of outcomes.",
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
    rationale: "Row counts sized for IaC Drift Detector so the agent can demonstrate the workflow against realistic transactional volume without simulating a production warehouse.",
  },
  sourceSystems: [
    {
      id: "terraform",
      name: "Terraform",
      owns: [
        "modules",
        "state_versions",
        "plan_diffs",
      ],
      protocol: "HCL/CLI",
      localBacking: [
        "alloydb",
      ],
      toolNames: [
        "query_terraform_modules",
        "query_terraform_state_versions",
        "query_terraform_plan_diffs",
      ],
      evidence: [
        "source_system_record",
        "generated_audit_trail",
      ],
    },
    {
      id: "aws_cloudformation",
      name: "AWS CloudFormation",
      owns: [
        "billing_records",
        "resource_inventory",
        "alarm_events",
      ],
      protocol: "AWS SDK",
      localBacking: [
        "alloydb",
      ],
      toolNames: [
        "query_aws_cloudformation_billing_records",
        "query_aws_cloudformation_resource_inventory",
        "query_aws_cloudformation_alarm_events",
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
  ],
  entities: [
    {
      name: "modules",
      sourceSystemId: "terraform",
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
      name: "state_versions",
      sourceSystemId: "terraform",
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
      name: "plan_diffs",
      sourceSystemId: "terraform",
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
      name: "billing_records",
      sourceSystemId: "aws_cloudformation",
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
          name: "service",
          type: "lorem.words",
          required: true,
        },
        {
          name: "amount",
          type: "float",
          min: 1,
          max: 10000,
          decimals: 2,
          required: true,
        },
        {
          name: "currency",
          type: "enum",
          values: [
            "USD",
            "EUR",
          ],
          required: true,
        },
        {
          name: "period_start",
          type: "date",
          required: true,
        },
        {
          name: "period_end",
          type: "date",
          required: true,
        },
      ],
    },
    {
      name: "resource_inventory",
      sourceSystemId: "aws_cloudformation",
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
      name: "alarm_events",
      sourceSystemId: "aws_cloudformation",
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
          name: "billing_record_id",
          type: "ref",
          ref: "billing_records.id",
          required: true,
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
  ],
  relationships: [
    {
      from: "alarm_events.billing_record_id",
      to: "billing_records.id",
      cardinality: "many-to-one",
      orphanPolicy: "none",
    },
  ],
  documents: [
    {
      id: "iac-drift-detector-runbook",
      sourceSystemId: "terraform",
      type: "runbook",
      title: "IaC Drift Detector Operations Runbook",
      requiredSections: [
        "Detection signals",
        "Triage procedures",
        "Remediation actions",
        "Rollback criteria",
        "Post-incident review",
      ],
      linkedEntities: [
        "modules",
        "state_versions",
        "plan_diffs",
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
      id: "terraform_generate_api",
      sourceSystemId: "terraform",
      method: "POST",
      path: "/api/terraform/generate",
      description: "Synchronous endpoint the agent calls to generate in Terraform after evidence gating.",
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
      id: "iac-drift-detector-baseline-gap",
      description: "Seed a realistic gap where Drift detection frequency sits between Quarterly audit and Daily automated, so the agent can detect, narrate, and recommend remediation.",
      affectedEntities: [
        "modules",
        "state_versions",
      ],
      discoveryPath: [
        "Inspect Terraform records for the affected entities",
        "Compare against AWS CloudFormation historical baseline",
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
      database: "iac_drift_detector",
      schemas: [
        "terraform",
        "aws_cloudformation",
        "github",
      ],
    },
    bigquery: {
      dataset: "it_iac_drift_detector",
      tables: [
        "kpi_summary",
        "evidence_index",
      ],
    },
    cloudStorage: {
      bucketSuffix: "iac-drift-detector-evidence",
      prefixes: [
        "documents",
        "audit-trails",
        "exports",
      ],
    },
    apis: {
      serviceName: "iac-drift-detector-source-adapters",
      deploymentTarget: "cloud_run",
    },
  },
  validation: {
    smokePrompt: "Run the IaC Drift Detector workflow and cite source-system evidence for every claim.",
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

export const IaCDriftDetector = () => (
  <UseCaseSlide
    title="IaC Drift Detector"
    subtitle="A-3909 • Software Engineering & DevOps"
    icon={GitCompare}
    domainId="domain-39"
    layer="Layer 3: Custom ADK"
    persona="DevOps Lead"
    systems={["Terraform", "AWS CloudFormation", "GitHub", "Vertex AI"]}
    kpis={[
      { label: "Drift detection frequency", before: "Quarterly audit", after: "Daily automated" },
      { label: "Manual changes in production", before: "Unknown", after: "100% tracked" },
      { label: "State reconciliation time", before: "Days per environment", after: "Auto-generated PRs" },
    ]}
    triggerType="scheduled"
    swimlane={swimlane}
    flow={flow}
    architecture={architecture}
    statusQuo={[
      "IaC drift detected only during quarterly audits — manual changes accumulate for months unnoticed.",
      "Emergency changes made during incidents never get imported back into Terraform state.",
      "State reconciliation is a multi-day effort per environment, so it keeps getting deferred."
    ]}
    agentification={[
      "Gemini explains drift with incident context — distinguishing emergency workarounds that should be imported from errors to remove.",
      "Daily drift detection catches manual changes within 24 hours instead of letting them accumulate for months.",
      "Auto-generated remediation PRs lower the barrier from 'multi-day effort' to 'review and merge.'"
    ]}
  />
);
