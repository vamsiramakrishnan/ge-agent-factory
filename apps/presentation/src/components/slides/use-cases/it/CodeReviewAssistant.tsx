import React from "react";
import { UseCaseSlide } from "../../../agent/UseCaseSlide";
import { FlowStep } from "../../../agent/ProcessFlow";
import { SwimlaneFlow } from "../../../agent/SwimlaneFlow";
import { AgentArchitecture, UseCaseGenerationSpec, AgentBehaviorContract} from "../../../../types/architecture";
import { CodeXml, GitPullRequest, ShieldCheck, FileText, CheckCircle } from "lucide-react";

const swimlane: SwimlaneFlow = {
  nodes: [
    { id: "s1", label: "PR Created", lane: "system", type: "trigger" },
    { id: "a1", label: "Diff Analysis", lane: "agent", type: "action" },
    { id: "a2", label: "Policy & Security Check", lane: "agent", type: "action" },
    { id: "a3", label: "Review Comments", lane: "agent", type: "output" },
    { id: "s2", label: "PR Updated", lane: "system", type: "output" },
  ],
  connections: [["s1", "a1"], ["a1", "a2"], ["a2", "a3"], ["a3", "s2"]],
};

const flow: FlowStep[] = [
  { label: "PR Webhook", icon: GitPullRequest, description: "Pull request created event triggers review — diff extracted and static analysis initiated.", trigger: "PR Created", systems: ["GitHub", "GitLab"] },
  { label: "Static Analysis", icon: ShieldCheck, description: "Code complexity scoring, security pattern matching, test coverage gaps, and duplicate detection.", systems: ["SonarQube", "Vertex AI"], integration: "ADK" },
  { label: "Contextual Review", icon: FileText, description: "Gemini provides review beyond linting — PII handling violations, architecture drift, and design patterns.", systems: ["Vertex AI"] },
  { label: "Comments Posted", icon: CheckCircle, description: "Review comments posted to PR with severity levels and remediation suggestions.", output: "Review Comments" },
];

const architecture: AgentArchitecture = {
  connections: [
    { system: "GitHub / GitLab", description: "PR diffs, commit history, file context, review comments", direction: "bidirectional", protocol: "GraphQL API", category: "erp" },
    { system: "SonarQube", description: "Static analysis results, code quality metrics, security hotspots", direction: "read", protocol: "REST API", category: "analytics" },
    { system: "Vertex AI (Gemini)", description: "Contextual code review, policy compliance, architecture validation", direction: "bidirectional", protocol: "gRPC", category: "ai" },
  ],
  pipeline: [
    { label: "PR Intake & Diff Extraction", description: "Receive PR webhook, extract diff, pull file context for changed files. Identify scope of changes — new files, modified functions, deleted tests.", systems: ["GitHub / GitLab"], layer: "integration", dataIn: "PR webhook with diff metadata", dataOut: "Structured diff with file context and change scope" },
    { label: "Static & Security Analysis", description: "Run SonarQube analysis for code complexity, security pattern matching, test coverage gap analysis, and duplicate code detection. Map findings to severity levels.", systems: ["SonarQube"], layer: "ml", dataIn: "Structured diff", dataOut: "Static analysis findings with severity scores" },
    { label: "Contextual LLM Review", description: "Gemini provides review beyond linting: 'This function handles PII but doesn't use the encryption wrapper — required by policy SEC-014. Error handling swallows exceptions silently — recommend logging with correlation ID.'", systems: ["Vertex AI (Gemini)"], layer: "llm", dataIn: "Diff + static findings + policy docs", dataOut: "Contextual review comments with remediation guidance" },
    { label: "Comment Posting", description: "Review comments posted inline on the PR with severity levels. Auto-approve PRs with no issues; flag critical findings for human reviewer attention.", systems: ["GitHub / GitLab"], layer: "integration", dataIn: "Review comments", dataOut: "PR updated with review feedback" },
  ],
};


const behaviorContract: AgentBehaviorContract = {
  role: "VP Engineering / DevOps Lead agent for the Code Review Assistant workflow",
  primaryObjective: "Gemini catches policy violations and architecture drift that even experienced reviewers miss in high-volume review cycles. Every PR gets security pattern analysis, not just the ones that happen to land with a security-aware reviewer. so the VP Engineering / DevOps Lead can move the Review turnaround time KPI.",
  inScope: [
    "Gemini catches policy violations and architecture drift that even experienced reviewers miss in high-volume review cycles",
    "Every PR gets security pattern analysis, not just the ones that happen to land with a security-aware reviewer",
    "Senior engineers freed from routine review to focus on design decisions and mentoring",
  ],
  outOfScope: [
    "Production deployments outside an approved change window",
    "Irreversible destructive actions on shared infrastructure (DROP, force-delete, key rotation)",
    "Security incident attribution requiring forensics",
  ],
  toolIntents: [
    {
      name: "query_github_pull_requests",
      kind: "query",
      sourceSystemId: "github",
      description: "Retrieve pull requests from GitHub for the Code Review Assistant workflow.",
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
      name: "query_gitlab_merge_requests",
      kind: "query",
      sourceSystemId: "gitlab",
      description: "Retrieve merge requests from GitLab for the Code Review Assistant workflow.",
      requiredInputs: [
        "lookup_key",
        "date_range",
      ],
      produces: [
        "merge_requests_records",
        "merge_requests_summary",
      ],
      evidenceEmitted: [
        "source_system_record",
      ],
    },
    {
      name: "query_sonarqube_code_smells",
      kind: "query",
      sourceSystemId: "sonarqube",
      description: "Retrieve code smells from SonarQube for the Code Review Assistant workflow.",
      requiredInputs: [
        "lookup_key",
        "date_range",
      ],
      produces: [
        "code_smells_records",
        "code_smells_summary",
      ],
      evidenceEmitted: [
        "source_system_record",
      ],
    },
    {
      name: "lookup_code_review_assistant_runbook",
      kind: "evidence_lookup",
      sourceSystemId: "github",
      description: "Look up sections of the Code Review Assistant Operations Runbook to cite in narrative output, escalation rationale, and audit evidence.",
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
      claim: "Review turnaround time moved from 4-8 hours toward <15 minutes",
      mustCite: [
        "github.pull_requests",
        "gitlab.merge_requests",
      ],
      sourceSystemIds: [
        "github",
        "gitlab",
      ],
    },
    {
      claim: "Security issues caught pre-merge moved from 30% toward 95%",
      mustCite: [
        "github.pull_requests",
        "gitlab.merge_requests",
      ],
      sourceSystemIds: [
        "github",
        "gitlab",
      ],
    },
  ],
  escalationRules: [
    {
      trigger: "Review turnaround time regresses past the 4-8 hours baseline by more than 20%",
      action: "escalate_to_human",
      handoffTarget: "VP Engineering / DevOps Lead",
      rationale: "Significant regressions need human judgment before automated remediation runs against production records.",
    },
    {
      trigger: "Source-system evidence is incomplete or stale (>24h) for any required entity",
      action: "request_more_info",
      rationale: "Recommendations grounded in stale evidence misrepresent current state and undermine audit defensibility.",
    },
  ],
  refusalRules: [
    "Never fabricate metric values; only publish numbers derived from GitHub (and other named systems) entities.",
    "Never bypass VP Engineering / DevOps Lead approval on escalation triggers, even when confidence is high.",
    "Never expose individual personal data (PII) in summaries; aggregate or pseudonymise before output.",
    "Never act on data older than the staleness threshold defined in the runbook without a fresh re-query.",
  ],
  goldenEvals: [
    {
      id: "code-review-assistant-end-to-end",
      prompt: "Run the Code Review Assistant workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.",
      expectedToolCalls: [
        "query_github_pull_requests",
        "query_gitlab_merge_requests",
        "query_sonarqube_code_smells",
        "lookup_code_review_assistant_runbook",
      ],
      mustReferenceEntities: [
        "pull_requests",
        "merge_requests",
        "code_smells",
      ],
      mustCiteDocuments: [
        "code-review-assistant-runbook",
      ],
      expectedActionOutcome: "VP Engineering / DevOps Lead receives a fully-cited recommendation; no external state change without explicit approval.",
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
    rationale: "Row counts sized for Code Review Assistant so the agent can demonstrate the workflow against realistic transactional volume without simulating a production warehouse.",
  },
  sourceSystems: [
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
      id: "gitlab",
      name: "GitLab",
      owns: [
        "merge_requests",
        "pipelines",
        "code_reviews",
      ],
      protocol: "REST API",
      localBacking: [
        "alloydb",
      ],
      toolNames: [
        "query_gitlab_merge_requests",
        "query_gitlab_pipelines",
        "query_gitlab_code_reviews",
      ],
      evidence: [
        "source_system_record",
        "generated_audit_trail",
      ],
    },
    {
      id: "sonarqube",
      name: "SonarQube",
      owns: [
        "code_smells",
        "security_hotspots",
        "quality_gates",
      ],
      protocol: "REST API",
      localBacking: [
        "alloydb",
      ],
      toolNames: [
        "query_sonarqube_code_smells",
        "query_sonarqube_security_hotspots",
        "query_sonarqube_quality_gates",
      ],
      evidence: [
        "source_system_record",
        "generated_audit_trail",
      ],
    },
  ],
  entities: [
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
      name: "merge_requests",
      sourceSystemId: "gitlab",
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
      name: "pipelines",
      sourceSystemId: "gitlab",
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
      name: "code_reviews",
      sourceSystemId: "gitlab",
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
      name: "code_smells",
      sourceSystemId: "sonarqube",
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
          name: "severity",
          type: "enum",
          values: [
            "low",
            "medium",
            "high",
            "critical",
          ],
          weights: [
            0.4,
            0.35,
            0.2,
            0.05,
          ],
          required: true,
        },
        {
          name: "status",
          type: "enum",
          values: [
            "open",
            "triaged",
            "mitigated",
            "accepted_risk",
            "closed",
          ],
          required: true,
        },
        {
          name: "detected_at",
          type: "date",
          required: true,
        },
        {
          name: "asset",
          type: "lorem.words",
          required: true,
        },
      ],
    },
    {
      name: "security_hotspots",
      sourceSystemId: "sonarqube",
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
          name: "severity",
          type: "enum",
          values: [
            "low",
            "medium",
            "high",
            "critical",
          ],
          weights: [
            0.4,
            0.35,
            0.2,
            0.05,
          ],
          required: true,
        },
        {
          name: "status",
          type: "enum",
          values: [
            "open",
            "triaged",
            "mitigated",
            "accepted_risk",
            "closed",
          ],
          required: true,
        },
        {
          name: "detected_at",
          type: "date",
          required: true,
        },
        {
          name: "asset",
          type: "lorem.words",
          required: true,
        },
      ],
    },
    {
      name: "quality_gates",
      sourceSystemId: "sonarqube",
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
          name: "severity",
          type: "enum",
          values: [
            "low",
            "medium",
            "high",
            "critical",
          ],
          weights: [
            0.4,
            0.35,
            0.2,
            0.05,
          ],
          required: true,
        },
        {
          name: "status",
          type: "enum",
          values: [
            "open",
            "triaged",
            "mitigated",
            "accepted_risk",
            "closed",
          ],
          required: true,
        },
        {
          name: "detected_at",
          type: "date",
          required: true,
        },
        {
          name: "asset",
          type: "lorem.words",
          required: true,
        },
      ],
    },
  ],
  relationships: [],
  documents: [
    {
      id: "code-review-assistant-runbook",
      sourceSystemId: "github",
      type: "runbook",
      title: "Code Review Assistant Operations Runbook",
      requiredSections: [
        "Detection signals",
        "Triage procedures",
        "Remediation actions",
        "Rollback criteria",
        "Post-incident review",
      ],
      linkedEntities: [
        "pull_requests",
        "commits",
        "workflow_runs",
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
      id: "code-review-assistant-baseline-gap",
      description: "Seed a realistic gap where Review turnaround time sits between 4-8 hours and <15 minutes, so the agent can detect, narrate, and recommend remediation.",
      affectedEntities: [
        "pull_requests",
        "commits",
      ],
      discoveryPath: [
        "Inspect GitHub records for the affected entities",
        "Compare against GitLab historical baseline",
        "Generate a citation-backed recommendation",
      ],
      expectedEvidence: [
        "source-system record",
        "historical baseline metric",
        "generated audit trail",
      ],
      expectedRecommendation: "Explain the gap, cite supporting evidence, and propose the next VP Engineering / DevOps Lead action.",
    },
  ],
  datastorePackaging: {
    alloydb: {
      database: "code_review_assistant",
      schemas: [
        "github",
        "gitlab",
        "sonarqube",
      ],
    },
    bigquery: {
      dataset: "it_code_review_assistant",
      tables: [
        "kpi_summary",
        "evidence_index",
      ],
    },
    cloudStorage: {
      bucketSuffix: "code-review-assistant-evidence",
      prefixes: [
        "documents",
        "audit-trails",
        "exports",
      ],
    },
    apis: {
      serviceName: "code-review-assistant-source-adapters",
      deploymentTarget: "cloud_run",
    },
  },
  validation: {
    smokePrompt: "Run the Code Review Assistant workflow and cite source-system evidence for every claim.",
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

export const CodeReviewAssistant = () => (
  <UseCaseSlide
    title="Code Review Assistant"
    subtitle="A-3902 • Software Engineering & DevOps"
    icon={CodeXml}
    domainId="domain-39"
    layer="Layer 3: Custom ADK"
    persona="VP Engineering / DevOps Lead"
    systems={["GitHub", "GitLab", "SonarQube", "Vertex AI"]}
    kpis={[
      { label: "Review turnaround time", before: "4-8 hours", after: "<15 minutes" },
      { label: "Security issues caught pre-merge", before: "30%", after: "95%" },
      { label: "Policy compliance violations", before: "Found in audit", after: "Caught in PR" },
    ]}
    triggerType="event"
    swimlane={swimlane}
    flow={flow}
    architecture={architecture}
    statusQuo={[
      "Senior engineers spend 2-3 hours daily reviewing PRs, with inconsistent coverage across the codebase.",
      "Security issues like PII handling violations discovered in quarterly audits, not during code review.",
      "Architecture drift happens one PR at a time — no one catches individual boundary violations."
    ]}
    agentification={[
      "Gemini catches policy violations and architecture drift that even experienced reviewers miss in high-volume review cycles.",
      "Every PR gets security pattern analysis, not just the ones that happen to land with a security-aware reviewer.",
      "Senior engineers freed from routine review to focus on design decisions and mentoring."
    ]}
  />
);
