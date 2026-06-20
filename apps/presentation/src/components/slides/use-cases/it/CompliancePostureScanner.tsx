import React from "react";
import { UseCaseSlide } from "../../../agent/UseCaseSlide";
import { FlowStep } from "../../../agent/ProcessFlow";
import { SwimlaneFlow } from "../../../agent/SwimlaneFlow";
import { AgentArchitecture, UseCaseGenerationSpec, AgentBehaviorContract} from "../../../../types/architecture";
import { ClipboardCheck, Scan, BarChart3, FileText, Shield } from "lucide-react";

const swimlane: SwimlaneFlow = {
  nodes: [
    { id: "s1", label: "Weekly Scan Cycle", lane: "system", type: "trigger" },
    { id: "a1", label: "Control Checks", lane: "agent", type: "action" },
    { id: "a2", label: "Gap Analysis", lane: "agent", type: "action" },
    { id: "a3", label: "Compliance Report", lane: "agent", type: "output" },
    { id: "h1", label: "GRC Lead Reviews", lane: "human", type: "hitl" },
  ],
  connections: [["s1", "a1"], ["a1", "a2"], ["a2", "a3"], ["a3", "h1"]],
};

const flow: FlowStep[] = [
  { label: "Benchmark Scan", icon: Scan, description: "Compliance checks executed against CIS benchmarks, SOC 2 controls, and internal security policies.", trigger: "Weekly", systems: ["Qualys", "AWS Security Hub"] },
  { label: "Gap Analysis", icon: BarChart3, description: "Control effectiveness scored with drift detection and remediation time trending.", systems: ["GCP Security Command Center", "BigQuery"], integration: "ADK" },
  { label: "Narrative Report", icon: FileText, description: "LLM generates compliance narrative with gap prioritization and audit readiness assessment.", systems: ["Vertex AI"] },
  { label: "GRC Review", icon: ClipboardCheck, description: "Compliance Lead reviews posture report and allocates remediation resources.", output: "Compliance Report" },
];

const architecture: AgentArchitecture = {
  connections: [
    { system: "Qualys", description: "CIS benchmark compliance scans, configuration audit", direction: "read", protocol: "REST API", category: "erp" },
    { system: "AWS Security Hub", description: "AWS security findings, compliance standards", direction: "read", protocol: "REST API", category: "erp" },
    { system: "GCP Security Command Center", description: "GCP security posture, misconfiguration alerts", direction: "read", protocol: "gRPC", category: "erp" },
    { system: "CrowdStrike", description: "Endpoint compliance status, policy enforcement", direction: "read", protocol: "REST API", category: "erp" },
    { system: "BigQuery", description: "Compliance history, control effectiveness trends", direction: "bidirectional", protocol: "BigQuery SQL", category: "analytics" },
    { system: "Vertex AI (Gemini)", description: "Compliance narrative generation, gap prioritization", direction: "bidirectional", protocol: "gRPC", category: "ai" },
  ],
  pipeline: [
    { label: "Multi-Framework Scanning", description: "Execute compliance checks against CIS benchmarks, SOC 2 CC controls, and ISO 27001 requirements across cloud and endpoint environments.", systems: ["Qualys", "AWS Security Hub", "GCP Security Command Center"], layer: "integration", dataIn: "Cloud configurations + endpoint policies", dataOut: "Raw compliance findings per framework" },
    { label: "Control Effectiveness Scoring", description: "Score control effectiveness based on finding severity, recurrence, and remediation velocity. Detect compliance drift from previous baselines.", systems: ["BigQuery", "CrowdStrike"], layer: "ml", dataIn: "Raw findings + historical compliance data", dataOut: "Scored controls with drift indicators" },
    { label: "Compliance Narrative Generation", description: "Gemini generates audit-ready compliance narrative explaining posture, gaps, and remediation priorities in business terms. Maps findings to specific framework requirements.", systems: ["Vertex AI (Gemini)"], layer: "llm", dataIn: "Scored controls + framework mappings", dataOut: "Compliance report with remediation roadmap" },
    { label: "Evidence Collection & Distribution", description: "Compliance report packaged with evidence artifacts for audit readiness. Remediation tasks distributed to responsible teams with SLA targets.", systems: ["BigQuery"], layer: "integration", dataIn: "Approved compliance report", dataOut: "Audit-ready evidence package + remediation tasks" },
  ],
};


const behaviorContract: AgentBehaviorContract = {
  role: "CISO / Security Analyst agent for the Compliance Posture Scanner workflow",
  primaryObjective: "Gemini generates audit-ready compliance narratives weekly with automated evidence collection. LLM maps findings to specific framework requirements and prioritizes gaps by audit risk. so the CISO / Security Analyst can move the Compliance report generation KPI.",
  inScope: [
    "Gemini generates audit-ready compliance narratives weekly with automated evidence collection",
    "LLM maps findings to specific framework requirements and prioritizes gaps by audit risk",
    "Continuous posture monitoring replaces quarterly assessments, eliminating audit surprises",
  ],
  outOfScope: [
    "Production deployments outside an approved change window",
    "Irreversible destructive actions on shared infrastructure (DROP, force-delete, key rotation)",
    "Security incident attribution requiring forensics",
  ],
  toolIntents: [
    {
      name: "query_qualys_scan_findings",
      kind: "query",
      sourceSystemId: "qualys",
      description: "Retrieve scan findings from Qualys for the Compliance Posture Scanner workflow.",
      requiredInputs: [
        "lookup_key",
        "date_range",
      ],
      produces: [
        "scan_findings_records",
        "scan_findings_summary",
      ],
      evidenceEmitted: [
        "source_system_record",
      ],
    },
    {
      name: "query_crowdstrike_scan_findings",
      kind: "query",
      sourceSystemId: "crowdstrike",
      description: "Retrieve scan findings from CrowdStrike for the Compliance Posture Scanner workflow.",
      requiredInputs: [
        "lookup_key",
        "date_range",
      ],
      produces: [
        "scan_findings_records",
        "scan_findings_summary",
      ],
      evidenceEmitted: [
        "source_system_record",
      ],
    },
    {
      name: "query_aws_security_hub_billing_records",
      kind: "query",
      sourceSystemId: "aws_security_hub",
      description: "Retrieve billing records from AWS Security Hub for the Compliance Posture Scanner workflow.",
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
      name: "query_gcp_security_command_center_gcp_security_command_center_records",
      kind: "query",
      sourceSystemId: "gcp_security_command_center",
      description: "Retrieve gcp security command center records from GCP Security Command Center for the Compliance Posture Scanner workflow.",
      requiredInputs: [
        "lookup_key",
        "date_range",
      ],
      produces: [
        "gcp_security_command_center_records_records",
        "gcp_security_command_center_records_summary",
      ],
      evidenceEmitted: [
        "source_system_record",
      ],
    },
    {
      name: "lookup_compliance_posture_scanner_runbook",
      kind: "evidence_lookup",
      sourceSystemId: "qualys",
      description: "Look up sections of the Compliance Posture Scanner Operations Runbook to cite in narrative output, escalation rationale, and audit evidence.",
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
      name: "action_qualys_generate",
      kind: "action",
      sourceSystemId: "qualys",
      description: "Execute the generate step in Qualys after the agent has gathered evidence and validated escalation gates.",
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
      claim: "Compliance report generation moved from 2-3 weeks manual toward Automated weekly",
      mustCite: [
        "qualys.scan_findings",
        "crowdstrike.scan_findings",
      ],
      sourceSystemIds: [
        "qualys",
        "crowdstrike",
      ],
    },
    {
      claim: "Control coverage moved from 70% assessed quarterly toward 95% assessed weekly",
      mustCite: [
        "qualys.scan_findings",
        "crowdstrike.scan_findings",
      ],
      sourceSystemIds: [
        "qualys",
        "crowdstrike",
      ],
    },
  ],
  escalationRules: [
    {
      trigger: "Compliance report generation regresses past the 2-3 weeks manual baseline by more than 20%",
      action: "escalate_to_human",
      handoffTarget: "CISO / Security Analyst",
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
    "Never fabricate metric values; only publish numbers derived from Qualys (and other named systems) entities.",
    "Never bypass CISO / Security Analyst approval on escalation triggers, even when confidence is high.",
    "Never expose individual personal data (PII) in summaries; aggregate or pseudonymise before output.",
    "Never act on data older than the staleness threshold defined in the runbook without a fresh re-query.",
  ],
  goldenEvals: [
    {
      id: "compliance-posture-scanner-end-to-end",
      prompt: "Run the Compliance Posture Scanner workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.",
      expectedToolCalls: [
        "query_qualys_scan_findings",
        "query_crowdstrike_scan_findings",
        "query_aws_security_hub_billing_records",
        "query_gcp_security_command_center_gcp_security_command_center_records",
        "lookup_compliance_posture_scanner_runbook",
        "action_qualys_generate",
      ],
      mustReferenceEntities: [
        "scan_findings",
        "scan_findings",
        "billing_records",
        "gcp_security_command_center_records",
      ],
      mustCiteDocuments: [
        "compliance-posture-scanner-runbook",
      ],
      expectedActionOutcome: "Action generate executed against Qualys, with audit-trail entry and CISO / Security Analyst notified of outcomes.",
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
    rationale: "Row counts sized for Compliance Posture Scanner so the agent can demonstrate the workflow against realistic transactional volume without simulating a production warehouse.",
  },
  sourceSystems: [
    {
      id: "qualys",
      name: "Qualys",
      owns: [
        "scan_findings",
        "asset_inventory",
        "remediation_tasks",
      ],
      protocol: "REST API",
      localBacking: [
        "alloydb",
      ],
      toolNames: [
        "query_qualys_scan_findings",
        "query_qualys_asset_inventory",
        "query_qualys_remediation_tasks",
      ],
      evidence: [
        "source_system_record",
        "generated_audit_trail",
      ],
    },
    {
      id: "crowdstrike",
      name: "CrowdStrike",
      owns: [
        "scan_findings",
        "asset_inventory",
        "remediation_tasks",
      ],
      protocol: "REST API",
      localBacking: [
        "alloydb",
      ],
      toolNames: [
        "query_crowdstrike_scan_findings",
        "query_crowdstrike_asset_inventory",
        "query_crowdstrike_remediation_tasks",
      ],
      evidence: [
        "source_system_record",
        "generated_audit_trail",
      ],
    },
    {
      id: "aws_security_hub",
      name: "AWS Security Hub",
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
        "query_aws_security_hub_billing_records",
        "query_aws_security_hub_resource_inventory",
        "query_aws_security_hub_alarm_events",
      ],
      evidence: [
        "source_system_record",
        "generated_audit_trail",
      ],
    },
    {
      id: "gcp_security_command_center",
      name: "GCP Security Command Center",
      owns: [
        "gcp_security_command_center_records",
        "gcp_security_command_center_events",
        "gcp_security_command_center_audit_trail",
      ],
      protocol: "GCP SDK",
      localBacking: [
        "alloydb",
      ],
      toolNames: [
        "query_gcp_security_command_center_gcp_security_command_center_records",
        "query_gcp_security_command_center_gcp_security_command_center_events",
        "query_gcp_security_command_center_gcp_security_command_center_audit_trail",
      ],
      evidence: [
        "source_system_record",
        "generated_audit_trail",
      ],
    },
  ],
  entities: [
    {
      name: "scan_findings",
      sourceSystemId: "qualys",
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
      name: "asset_inventory",
      sourceSystemId: "qualys",
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
      name: "remediation_tasks",
      sourceSystemId: "qualys",
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
      sourceSystemId: "aws_security_hub",
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
      sourceSystemId: "aws_security_hub",
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
      sourceSystemId: "aws_security_hub",
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
      name: "gcp_security_command_center_records",
      sourceSystemId: "gcp_security_command_center",
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
      name: "gcp_security_command_center_events",
      sourceSystemId: "gcp_security_command_center",
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
          name: "gcp_security_command_center_record_id",
          type: "ref",
          ref: "gcp_security_command_center_records.id",
          required: true,
        },
      ],
    },
    {
      name: "gcp_security_command_center_audit_trail",
      sourceSystemId: "gcp_security_command_center",
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
      from: "alarm_events.billing_record_id",
      to: "billing_records.id",
      cardinality: "many-to-one",
      orphanPolicy: "none",
    },
    {
      from: "gcp_security_command_center_events.gcp_security_command_center_record_id",
      to: "gcp_security_command_center_records.id",
      cardinality: "many-to-one",
      orphanPolicy: "none",
    },
  ],
  documents: [
    {
      id: "compliance-posture-scanner-runbook",
      sourceSystemId: "qualys",
      type: "runbook",
      title: "Compliance Posture Scanner Operations Runbook",
      requiredSections: [
        "Detection signals",
        "Triage procedures",
        "Remediation actions",
        "Rollback criteria",
        "Post-incident review",
      ],
      linkedEntities: [
        "scan_findings",
        "asset_inventory",
        "remediation_tasks",
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
      id: "qualys_generate_api",
      sourceSystemId: "qualys",
      method: "POST",
      path: "/api/qualys/generate",
      description: "Synchronous endpoint the agent calls to generate in Qualys after evidence gating.",
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
      id: "compliance-posture-scanner-baseline-gap",
      description: "Seed a realistic gap where Compliance report generation sits between 2-3 weeks manual and Automated weekly, so the agent can detect, narrate, and recommend remediation.",
      affectedEntities: [
        "scan_findings",
        "asset_inventory",
      ],
      discoveryPath: [
        "Inspect Qualys records for the affected entities",
        "Compare against CrowdStrike historical baseline",
        "Generate a citation-backed recommendation",
      ],
      expectedEvidence: [
        "source-system record",
        "historical baseline metric",
        "generated audit trail",
      ],
      expectedRecommendation: "Explain the gap, cite supporting evidence, and propose the next CISO / Security Analyst action.",
    },
  ],
  datastorePackaging: {
    alloydb: {
      database: "compliance_posture_scanner",
      schemas: [
        "qualys",
        "crowdstrike",
        "aws_security_hub",
        "gcp_security_command_center",
      ],
    },
    bigquery: {
      dataset: "it_compliance_posture_scanner",
      tables: [
        "kpi_summary",
        "evidence_index",
      ],
    },
    cloudStorage: {
      bucketSuffix: "compliance-posture-scanner-evidence",
      prefixes: [
        "documents",
        "audit-trails",
        "exports",
      ],
    },
    apis: {
      serviceName: "compliance-posture-scanner-source-adapters",
      deploymentTarget: "cloud_run",
    },
  },
  validation: {
    smokePrompt: "Run the Compliance Posture Scanner workflow and cite source-system evidence for every claim.",
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

export const CompliancePostureScanner = () => (
  <UseCaseSlide
    title="Compliance Posture Scanner"
    subtitle="IT4-06 • Cybersecurity & Threat Management"
    icon={Shield}
    domainId="domain-41"
    layer="Layer 4: Data Agent"
    persona="CISO / Security Analyst"
    systems={["Qualys", "CrowdStrike", "AWS Security Hub", "GCP Security Command Center", "Vertex AI"]}
    kpis={[
      { label: "Compliance report generation", before: "2-3 weeks manual", after: "Automated weekly" },
      { label: "Control coverage", before: "70% assessed quarterly", after: "95% assessed weekly" },
      { label: "Audit prep time", before: "4-6 weeks", after: "Continuous readiness" },
    ]}
    triggerType="scheduled"
    swimlane={swimlane}
    flow={flow}
    architecture={architecture}
    hitl={{ actor: "Compliance & GRC Lead", action: "Review compliance posture", description: "GRC Lead reviews compliance report, validates gap prioritization, and allocates remediation resources before audit." }}
    statusQuo={[
      "Compliance posture assessed quarterly with manual evidence collection from 15+ systems.",
      "Control gaps discovered during audits rather than proactively identified and remediated.",
      "Audit evidence packages assembled manually over 4-6 weeks of effort.",
    ]}
    agentification={[
      "Gemini generates audit-ready compliance narratives weekly with automated evidence collection.",
      "LLM maps findings to specific framework requirements and prioritizes gaps by audit risk.",
      "Continuous posture monitoring replaces quarterly assessments, eliminating audit surprises.",
    ]}
  />
);
