import React from "react";
import { UseCaseSlide } from "../../../agent/UseCaseSlide";
import { FlowStep } from "../../../agent/ProcessFlow";
import { SwimlaneFlow } from "../../../agent/SwimlaneFlow";
import { AgentArchitecture, UseCaseGenerationSpec, AgentBehaviorContract} from "../../../../types/architecture";
import { ShieldCheck, Scan, BarChart3, FileText, Lock } from "lucide-react";

const swimlane: SwimlaneFlow = {
  nodes: [
    { id: "s1", label: "Monthly Review", lane: "system", type: "trigger" },
    { id: "a1", label: "Policy Evaluation", lane: "agent", type: "action" },
    { id: "a2", label: "Gap Analysis", lane: "agent", type: "action" },
    { id: "a3", label: "Maturity Report", lane: "agent", type: "output" },
    { id: "h1", label: "CISO Reviews", lane: "human", type: "hitl" },
  ],
  connections: [["s1", "a1"], ["a1", "a2"], ["a2", "a3"], ["a3", "h1"]],
};

const flow: FlowStep[] = [
  { label: "Policy Collection", icon: Scan, description: "Access policies gathered from identity providers, network segmentation, and device trust systems.", trigger: "Monthly + Chat", systems: ["Okta", "Palo Alto Prisma"] },
  { label: "Gap Identification", icon: BarChart3, description: "Access patterns analyzed against zero trust principles — least privilege, micro-segmentation, device posture.", systems: ["Google BeyondCorp", "BigQuery"], integration: "ADK" },
  { label: "Maturity Assessment", icon: FileText, description: "LLM generates zero trust maturity report with prioritized improvement roadmap.", systems: ["Vertex AI"] },
  { label: "CISO Approval", icon: ShieldCheck, description: "CISO reviews zero trust maturity assessment and approves migration priorities.", output: "ZT Maturity Report" },
];

const architecture: AgentArchitecture = {
  connections: [
    { system: "Okta", description: "Access policies, conditional access rules, MFA coverage", direction: "read", protocol: "REST API", category: "erp" },
    { system: "Palo Alto Prisma", description: "Network segmentation, micro-segmentation coverage", direction: "read", protocol: "REST API", category: "erp" },
    { system: "Google BeyondCorp", description: "Device trust policies, context-aware access rules", direction: "read", protocol: "gRPC", category: "erp" },
    { system: "BigQuery", description: "Access pattern analysis, policy compliance history", direction: "bidirectional", protocol: "BigQuery SQL", category: "analytics" },
    { system: "Vertex AI (Gemini)", description: "Zero trust maturity reasoning, gap prioritization", direction: "bidirectional", protocol: "gRPC", category: "ai" },
  ],
  pipeline: [
    { label: "Policy Inventory", description: "Collect access policies from Okta (conditional access, MFA), Palo Alto Prisma (network segmentation), and BeyondCorp (device trust). Map policies to applications and data assets.", systems: ["Okta", "Palo Alto Prisma", "Google BeyondCorp"], layer: "integration", dataIn: "Access policies across identity, network, and device layers", dataOut: "Unified policy inventory mapped to assets" },
    { label: "Zero Trust Gap Analysis", description: "Evaluate policies against zero trust pillars: identity verification, device posture, least-privilege access, micro-segmentation, and continuous monitoring. Score coverage per application.", systems: ["BigQuery"], layer: "ml", dataIn: "Policy inventory + application catalog", dataOut: "Per-application zero trust coverage scores" },
    { label: "Maturity Assessment & Roadmap", description: "Gemini assesses overall zero trust maturity level and generates prioritized improvement roadmap, focusing on PII-handling applications and internet-facing services first.", systems: ["Vertex AI (Gemini)"], layer: "llm", dataIn: "Coverage scores + asset criticality", dataOut: "Zero trust maturity report with migration priorities" },
    { label: "Migration Tracking", description: "Track zero trust migration progress per application. Monitor adoption metrics and policy enforcement effectiveness.", systems: ["BigQuery"], layer: "integration", dataIn: "Approved migration plan", dataOut: "Migration progress dashboard" },
  ],
};


const behaviorContract: AgentBehaviorContract = {
  role: "CISO / Security Analyst agent for the Zero Trust Policy Evaluator workflow",
  primaryObjective: "Gemini continuously evaluates access policies against zero trust principles across all three layers. LLM prioritizes migration of legacy applications, focusing on PII-handling and internet-facing services. so the CISO / Security Analyst can move the Zero trust coverage KPI.",
  inScope: [
    "Gemini continuously evaluates access policies against zero trust principles across all three layers",
    "LLM prioritizes migration of legacy applications, focusing on PII-handling and internet-facing services",
    "Automated tracking replaces manual audits, providing real-time zero trust maturity visibility",
  ],
  outOfScope: [
    "Production deployments outside an approved change window",
    "Irreversible destructive actions on shared infrastructure (DROP, force-delete, key rotation)",
    "Security incident attribution requiring forensics",
  ],
  toolIntents: [
    {
      name: "query_okta_users",
      kind: "query",
      sourceSystemId: "okta",
      description: "Retrieve users from Okta for the Zero Trust Policy Evaluator workflow.",
      requiredInputs: [
        "lookup_key",
        "date_range",
      ],
      produces: [
        "users_records",
        "users_summary",
      ],
      evidenceEmitted: [
        "source_system_record",
      ],
    },
    {
      name: "query_palo_alto_prisma_palo_alto_prisma_records",
      kind: "query",
      sourceSystemId: "palo_alto_prisma",
      description: "Retrieve palo alto prisma records from Palo Alto Prisma for the Zero Trust Policy Evaluator workflow.",
      requiredInputs: [
        "lookup_key",
        "date_range",
      ],
      produces: [
        "palo_alto_prisma_records_records",
        "palo_alto_prisma_records_summary",
      ],
      evidenceEmitted: [
        "source_system_record",
      ],
    },
    {
      name: "query_google_beyondcorp_google_beyondcorp_records",
      kind: "query",
      sourceSystemId: "google_beyondcorp",
      description: "Retrieve google beyondcorp records from Google BeyondCorp for the Zero Trust Policy Evaluator workflow.",
      requiredInputs: [
        "lookup_key",
        "date_range",
      ],
      produces: [
        "google_beyondcorp_records_records",
        "google_beyondcorp_records_summary",
      ],
      evidenceEmitted: [
        "source_system_record",
      ],
    },
    {
      name: "lookup_zero_trust_policy_evaluator_runbook",
      kind: "evidence_lookup",
      sourceSystemId: "okta",
      description: "Look up sections of the Zero Trust Policy Evaluator Operations Runbook to cite in narrative output, escalation rationale, and audit evidence.",
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
      claim: "Zero trust coverage moved from Assessed annually toward Continuous scoring",
      mustCite: [
        "okta.users",
        "palo_alto_prisma.palo_alto_prisma_records",
      ],
      sourceSystemIds: [
        "okta",
        "palo_alto_prisma",
      ],
    },
    {
      claim: "Legacy VPN exceptions moved from Unknown count toward Tracked with migration plan",
      mustCite: [
        "okta.users",
        "palo_alto_prisma.palo_alto_prisma_records",
      ],
      sourceSystemIds: [
        "okta",
        "palo_alto_prisma",
      ],
    },
  ],
  escalationRules: [
    {
      trigger: "Zero trust coverage regresses past the Assessed annually baseline by more than 20%",
      action: "escalate_to_human",
      handoffTarget: "CISO / Security Analyst",
      rationale: "Significant regressions need human judgment before automated remediation runs against production records.",
    },
    {
      trigger: "Source-system evidence is incomplete or stale (>24h) for any required entity",
      action: "request_more_info",
      rationale: "Recommendations grounded in stale evidence misrepresent current state and undermine audit defensibility.",
    },
  ],
  refusalRules: [
    "Never fabricate metric values; only publish numbers derived from Okta (and other named systems) entities.",
    "Never bypass CISO / Security Analyst approval on escalation triggers, even when confidence is high.",
    "Never expose individual personal data (PII) in summaries; aggregate or pseudonymise before output.",
    "Never act on data older than the staleness threshold defined in the runbook without a fresh re-query.",
  ],
  goldenEvals: [
    {
      id: "zero-trust-policy-evaluator-end-to-end",
      prompt: "Run the Zero Trust Policy Evaluator workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.",
      expectedToolCalls: [
        "query_okta_users",
        "query_palo_alto_prisma_palo_alto_prisma_records",
        "query_google_beyondcorp_google_beyondcorp_records",
        "lookup_zero_trust_policy_evaluator_runbook",
      ],
      mustReferenceEntities: [
        "users",
        "palo_alto_prisma_records",
        "google_beyondcorp_records",
      ],
      mustCiteDocuments: [
        "zero-trust-policy-evaluator-runbook",
      ],
      expectedActionOutcome: "CISO / Security Analyst receives a fully-cited recommendation; no external state change without explicit approval.",
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
    rationale: "Row counts sized for Zero Trust Policy Evaluator so the agent can demonstrate the workflow against realistic transactional volume without simulating a production warehouse.",
  },
  sourceSystems: [
    {
      id: "okta",
      name: "Okta",
      owns: [
        "users",
        "groups",
        "access_grants",
      ],
      protocol: "REST API",
      localBacking: [
        "alloydb",
      ],
      toolNames: [
        "query_okta_users",
        "query_okta_groups",
        "query_okta_access_grants",
      ],
      evidence: [
        "source_system_record",
        "generated_audit_trail",
      ],
    },
    {
      id: "palo_alto_prisma",
      name: "Palo Alto Prisma",
      owns: [
        "palo_alto_prisma_records",
        "palo_alto_prisma_events",
        "palo_alto_prisma_audit_trail",
      ],
      protocol: "REST API",
      localBacking: [
        "alloydb",
      ],
      toolNames: [
        "query_palo_alto_prisma_palo_alto_prisma_records",
        "query_palo_alto_prisma_palo_alto_prisma_events",
        "query_palo_alto_prisma_palo_alto_prisma_audit_trail",
      ],
      evidence: [
        "source_system_record",
        "generated_audit_trail",
      ],
    },
    {
      id: "google_beyondcorp",
      name: "Google BeyondCorp",
      owns: [
        "google_beyondcorp_records",
        "google_beyondcorp_events",
        "google_beyondcorp_audit_trail",
      ],
      protocol: "REST API",
      localBacking: [
        "alloydb",
      ],
      toolNames: [
        "query_google_beyondcorp_google_beyondcorp_records",
        "query_google_beyondcorp_google_beyondcorp_events",
        "query_google_beyondcorp_google_beyondcorp_audit_trail",
      ],
      evidence: [
        "source_system_record",
        "generated_audit_trail",
      ],
    },
  ],
  entities: [
    {
      name: "users",
      sourceSystemId: "okta",
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
      name: "groups",
      sourceSystemId: "okta",
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
      name: "access_grants",
      sourceSystemId: "okta",
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
      name: "palo_alto_prisma_records",
      sourceSystemId: "palo_alto_prisma",
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
      name: "palo_alto_prisma_events",
      sourceSystemId: "palo_alto_prisma",
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
          name: "palo_alto_prisma_record_id",
          type: "ref",
          ref: "palo_alto_prisma_records.id",
          required: true,
        },
      ],
    },
    {
      name: "palo_alto_prisma_audit_trail",
      sourceSystemId: "palo_alto_prisma",
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
      name: "google_beyondcorp_records",
      sourceSystemId: "google_beyondcorp",
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
      name: "google_beyondcorp_events",
      sourceSystemId: "google_beyondcorp",
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
          name: "google_beyondcorp_record_id",
          type: "ref",
          ref: "google_beyondcorp_records.id",
          required: true,
        },
      ],
    },
    {
      name: "google_beyondcorp_audit_trail",
      sourceSystemId: "google_beyondcorp",
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
      from: "palo_alto_prisma_events.palo_alto_prisma_record_id",
      to: "palo_alto_prisma_records.id",
      cardinality: "many-to-one",
      orphanPolicy: "none",
    },
    {
      from: "google_beyondcorp_events.google_beyondcorp_record_id",
      to: "google_beyondcorp_records.id",
      cardinality: "many-to-one",
      orphanPolicy: "none",
    },
  ],
  documents: [
    {
      id: "zero-trust-policy-evaluator-runbook",
      sourceSystemId: "okta",
      type: "runbook",
      title: "Zero Trust Policy Evaluator Operations Runbook",
      requiredSections: [
        "Detection signals",
        "Triage procedures",
        "Remediation actions",
        "Rollback criteria",
        "Post-incident review",
      ],
      linkedEntities: [
        "users",
        "groups",
        "access_grants",
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
      id: "zero-trust-policy-evaluator-baseline-gap",
      description: "Seed a realistic gap where Zero trust coverage sits between Assessed annually and Continuous scoring, so the agent can detect, narrate, and recommend remediation.",
      affectedEntities: [
        "users",
        "groups",
      ],
      discoveryPath: [
        "Inspect Okta records for the affected entities",
        "Compare against Palo Alto Prisma historical baseline",
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
      database: "zero_trust_policy_evaluator",
      schemas: [
        "okta",
        "palo_alto_prisma",
        "google_beyondcorp",
      ],
    },
    bigquery: {
      dataset: "it_zero_trust_policy_evaluator",
      tables: [
        "kpi_summary",
        "evidence_index",
      ],
    },
    cloudStorage: {
      bucketSuffix: "zero-trust-policy-evaluator-evidence",
      prefixes: [
        "documents",
        "audit-trails",
        "exports",
      ],
    },
    apis: {
      serviceName: "zero-trust-policy-evaluator-source-adapters",
      deploymentTarget: "cloud_run",
    },
  },
  validation: {
    smokePrompt: "Run the Zero Trust Policy Evaluator workflow and cite source-system evidence for every claim.",
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

export const ZeroTrustPolicyEvaluator = () => (
  <UseCaseSlide
    title="Zero Trust Policy Evaluator"
    subtitle="IT4-09 • Cybersecurity & Threat Management"
    icon={Lock}
    domainId="domain-41"
    layer="Layer 3: Custom ADK"
    persona="CISO / Security Analyst"
    systems={["Okta", "Palo Alto Prisma", "Google BeyondCorp", "Vertex AI"]}
    kpis={[
      { label: "Zero trust coverage", before: "Assessed annually", after: "Continuous scoring" },
      { label: "Legacy VPN exceptions", before: "Unknown count", after: "Tracked with migration plan" },
      { label: "Policy-to-application mapping", before: "Spreadsheet-based", after: "Automated real-time" },
    ]}
    triggerType="scheduled"
    swimlane={swimlane}
    flow={flow}
    architecture={architecture}
    hitl={{ actor: "CISO", action: "Approve zero trust migration priorities", description: "CISO reviews zero trust maturity assessment and approves the prioritized migration roadmap for legacy applications." }}
    statusQuo={[
      "Zero trust posture assessed annually through manual audits with no continuous visibility.",
      "Legacy VPN-based access exceptions accumulate without a formal migration plan.",
      "Policy-to-application mapping maintained in spreadsheets, quickly becoming outdated.",
    ]}
    agentification={[
      "Gemini continuously evaluates access policies against zero trust principles across all three layers.",
      "LLM prioritizes migration of legacy applications, focusing on PII-handling and internet-facing services.",
      "Automated tracking replaces manual audits, providing real-time zero trust maturity visibility.",
    ]}
  />
);
