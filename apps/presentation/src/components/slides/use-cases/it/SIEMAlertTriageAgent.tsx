import React from "react";
import { UseCaseSlide } from "../../../agent/UseCaseSlide";
import { FlowStep } from "../../../agent/ProcessFlow";
import { SwimlaneFlow } from "../../../agent/SwimlaneFlow";
import { AgentArchitecture, UseCaseGenerationSpec, AgentBehaviorContract} from "../../../../types/architecture";
import { Bell, Search, Brain, CheckCircle, ShieldAlert } from "lucide-react";

const swimlane: SwimlaneFlow = {
  nodes: [
    { id: "s1", label: "SIEM Alert Fired", lane: "system", type: "trigger" },
    { id: "a1", label: "Context Enrichment", lane: "agent", type: "action" },
    { id: "a2", label: "Correlation & Classification", lane: "agent", type: "action" },
    { id: "a3", label: "Triage Decision", lane: "agent", type: "output" },
    { id: "h1", label: "Analyst Confirms", lane: "human", type: "hitl" },
  ],
  connections: [["s1", "a1"], ["a1", "a2"], ["a2", "a3"], ["a3", "h1"]],
};

const flow: FlowStep[] = [
  { label: "Alert Received", icon: Bell, description: "SIEM alert ingested with initial severity, source IP, user, and event type.", trigger: "Event-driven", systems: ["Chronicle SIEM", "Splunk"] },
  { label: "Context Enrichment", icon: Search, description: "Alert enriched with asset ownership, user role, recent activity, and VPN/device context.", systems: ["CrowdStrike", "Okta"], integration: "ADK" },
  { label: "Intelligent Triage", icon: Brain, description: "LLM reasons about alert legitimacy using enriched context and historical analyst decisions.", systems: ["Vertex AI"] },
  { label: "Analyst Confirmation", icon: CheckCircle, description: "Security Analyst reviews confirmed incidents and initiates investigation workflow.", output: "Triage Decision" },
];

const architecture: AgentArchitecture = {
  connections: [
    { system: "Chronicle SIEM", description: "Security alerts, log correlation, detection rules", direction: "read", protocol: "gRPC", category: "analytics" },
    { system: "Splunk", description: "Historical security events, search queries", direction: "read", protocol: "REST API", category: "analytics" },
    { system: "CrowdStrike", description: "Endpoint telemetry, process activity, threat indicators", direction: "read", protocol: "REST API", category: "erp" },
    { system: "Okta", description: "User authentication events, device trust, session context", direction: "read", protocol: "REST API", category: "erp" },
    { system: "BigQuery", description: "Historical triage decisions, false positive patterns", direction: "bidirectional", protocol: "BigQuery SQL", category: "analytics" },
    { system: "Vertex AI (Gemini)", description: "Alert reasoning, context-aware triage decisions", direction: "bidirectional", protocol: "gRPC", category: "ai" },
  ],
  pipeline: [
    { label: "Alert Ingestion & Normalization", description: "Receive SIEM alerts from Chronicle and Splunk. Normalize alert schema, extract key entities (user, IP, asset, action), and deduplicate correlated alerts.", systems: ["Chronicle SIEM", "Splunk"], layer: "integration", dataIn: "Raw SIEM alerts across detection rules", dataOut: "Normalized alert with extracted entities" },
    { label: "Context Enrichment", description: "Enrich alert with user context from Okta (role, location, device trust), endpoint context from CrowdStrike (process activity, EDR score), and historical patterns from BigQuery.", systems: ["Okta", "CrowdStrike", "BigQuery"], layer: "ml", dataIn: "Normalized alert entities", dataOut: "Fully enriched alert with behavioral context" },
    { label: "Intelligent Classification", description: "Gemini reasons about alert legitimacy by comparing enriched context against known benign patterns and historical analyst decisions. Provides evidence-based triage recommendation.", systems: ["Vertex AI (Gemini)"], layer: "llm", dataIn: "Enriched alert + historical triage patterns", dataOut: "Triage decision with confidence score and evidence" },
    { label: "Routing & Feedback Loop", description: "Confirmed incidents routed to investigation workflow. Auto-closed alerts logged for model improvement. Analyst feedback captured to improve future triage accuracy.", systems: ["Chronicle SIEM", "BigQuery"], layer: "integration", dataIn: "Triage decision + analyst feedback", dataOut: "Updated triage model + investigation ticket" },
  ],
};


const behaviorContract: AgentBehaviorContract = {
  role: "Security Analyst agent for the SIEM Alert Triage Agent workflow",
  primaryObjective: "Gemini auto-classifies 92% of alerts as benign with evidence, surfacing only true threats for human review. LLM reasons about alert context — distinguishing VPN artifacts from credential compromise in seconds. so the Security Analyst can move the Alert triage time KPI.",
  inScope: [
    "Gemini auto-classifies 92% of alerts as benign with evidence, surfacing only true threats for human review",
    "LLM reasons about alert context — distinguishing VPN artifacts from credential compromise in seconds",
    "Continuous learning from analyst feedback improves triage accuracy over time",
  ],
  outOfScope: [
    "Production deployments outside an approved change window",
    "Irreversible destructive actions on shared infrastructure (DROP, force-delete, key rotation)",
    "Security incident attribution requiring forensics",
  ],
  toolIntents: [
    {
      name: "query_chronicle_siem_chronicle_siem_records",
      kind: "query",
      sourceSystemId: "chronicle_siem",
      description: "Retrieve chronicle siem records from Chronicle SIEM for the SIEM Alert Triage Agent workflow.",
      requiredInputs: [
        "lookup_key",
        "date_range",
      ],
      produces: [
        "chronicle_siem_records_records",
        "chronicle_siem_records_summary",
      ],
      evidenceEmitted: [
        "source_system_record",
      ],
    },
    {
      name: "query_crowdstrike_scan_findings",
      kind: "query",
      sourceSystemId: "crowdstrike",
      description: "Retrieve scan findings from CrowdStrike for the SIEM Alert Triage Agent workflow.",
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
      name: "query_splunk_log_events",
      kind: "query",
      sourceSystemId: "splunk",
      description: "Retrieve log events from Splunk for the SIEM Alert Triage Agent workflow.",
      requiredInputs: [
        "lookup_key",
        "date_range",
      ],
      produces: [
        "log_events_records",
        "log_events_summary",
      ],
      evidenceEmitted: [
        "sql_result",
      ],
    },
    {
      name: "query_okta_users",
      kind: "query",
      sourceSystemId: "okta",
      description: "Retrieve users from Okta for the SIEM Alert Triage Agent workflow.",
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
      name: "lookup_siem_alert_triage_agent_runbook",
      kind: "evidence_lookup",
      sourceSystemId: "splunk",
      description: "Look up sections of the SIEM Alert Triage Agent Operations Runbook to cite in narrative output, escalation rationale, and audit evidence.",
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
      claim: "Alert triage time moved from 15-30 min each toward <1 min automated",
      mustCite: [
        "chronicle_siem.chronicle_siem_records",
        "crowdstrike.scan_findings",
      ],
      sourceSystemIds: [
        "chronicle_siem",
        "crowdstrike",
      ],
    },
    {
      claim: "False positive rate moved from 90% manual review toward 92% auto-classified",
      mustCite: [
        "chronicle_siem.chronicle_siem_records",
        "crowdstrike.scan_findings",
      ],
      sourceSystemIds: [
        "chronicle_siem",
        "crowdstrike",
      ],
    },
  ],
  escalationRules: [
    {
      trigger: "Alert triage time regresses past the 15-30 min each baseline by more than 20%",
      action: "escalate_to_human",
      handoffTarget: "Security Analyst",
      rationale: "Significant regressions need human judgment before automated remediation runs against production records.",
    },
    {
      trigger: "Source-system evidence is incomplete or stale (>24h) for any required entity",
      action: "request_more_info",
      rationale: "Recommendations grounded in stale evidence misrepresent current state and undermine audit defensibility.",
    },
  ],
  refusalRules: [
    "Never fabricate metric values; only publish numbers derived from Chronicle SIEM (and other named systems) entities.",
    "Never bypass Security Analyst approval on escalation triggers, even when confidence is high.",
    "Never expose individual personal data (PII) in summaries; aggregate or pseudonymise before output.",
    "Never act on data older than the staleness threshold defined in the runbook without a fresh re-query.",
  ],
  goldenEvals: [
    {
      id: "siem-alert-triage-agent-end-to-end",
      prompt: "Run the SIEM Alert Triage Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.",
      expectedToolCalls: [
        "query_chronicle_siem_chronicle_siem_records",
        "query_crowdstrike_scan_findings",
        "query_splunk_log_events",
        "query_okta_users",
        "lookup_siem_alert_triage_agent_runbook",
      ],
      mustReferenceEntities: [
        "chronicle_siem_records",
        "scan_findings",
        "log_events",
        "users",
      ],
      mustCiteDocuments: [
        "siem-alert-triage-agent-runbook",
      ],
      expectedActionOutcome: "Security Analyst receives a fully-cited recommendation; no external state change without explicit approval.",
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
    rationale: "Row counts sized for SIEM Alert Triage Agent so the agent can demonstrate the workflow against realistic transactional volume without simulating a production warehouse.",
  },
  sourceSystems: [
    {
      id: "chronicle_siem",
      name: "Chronicle SIEM",
      owns: [
        "chronicle_siem_records",
        "chronicle_siem_events",
        "chronicle_siem_audit_trail",
      ],
      protocol: "REST API",
      localBacking: [
        "alloydb",
      ],
      toolNames: [
        "query_chronicle_siem_chronicle_siem_records",
        "query_chronicle_siem_chronicle_siem_events",
        "query_chronicle_siem_chronicle_siem_audit_trail",
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
      id: "splunk",
      name: "Splunk",
      owns: [
        "log_events",
        "search_jobs",
        "alert_actions",
      ],
      protocol: "REST API",
      localBacking: [
        "bigquery",
      ],
      toolNames: [
        "query_splunk_log_events",
        "query_splunk_search_jobs",
        "query_splunk_alert_actions",
      ],
      evidence: [
        "source_system_record",
        "generated_audit_trail",
      ],
    },
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
  ],
  entities: [
    {
      name: "chronicle_siem_records",
      sourceSystemId: "chronicle_siem",
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
      name: "chronicle_siem_events",
      sourceSystemId: "chronicle_siem",
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
          name: "chronicle_siem_record_id",
          type: "ref",
          ref: "chronicle_siem_records.id",
          required: true,
        },
      ],
    },
    {
      name: "chronicle_siem_audit_trail",
      sourceSystemId: "chronicle_siem",
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
      name: "scan_findings",
      sourceSystemId: "crowdstrike",
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
      sourceSystemId: "crowdstrike",
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
      sourceSystemId: "crowdstrike",
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
      name: "log_events",
      sourceSystemId: "splunk",
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
          name: "search_job_id",
          type: "ref",
          ref: "search_jobs.id",
          required: true,
        },
      ],
    },
    {
      name: "search_jobs",
      sourceSystemId: "splunk",
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
      name: "alert_actions",
      sourceSystemId: "splunk",
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
  ],
  relationships: [
    {
      from: "chronicle_siem_events.chronicle_siem_record_id",
      to: "chronicle_siem_records.id",
      cardinality: "many-to-one",
      orphanPolicy: "none",
    },
    {
      from: "log_events.search_job_id",
      to: "search_jobs.id",
      cardinality: "many-to-one",
      orphanPolicy: "none",
    },
  ],
  documents: [
    {
      id: "siem-alert-triage-agent-runbook",
      sourceSystemId: "splunk",
      type: "runbook",
      title: "SIEM Alert Triage Agent Operations Runbook",
      requiredSections: [
        "Detection signals",
        "Triage procedures",
        "Remediation actions",
        "Rollback criteria",
        "Post-incident review",
      ],
      linkedEntities: [
        "chronicle_siem_records",
        "chronicle_siem_events",
        "chronicle_siem_audit_trail",
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
      id: "siem-alert-triage-agent-baseline-gap",
      description: "Seed a realistic gap where Alert triage time sits between 15-30 min each and <1 min automated, so the agent can detect, narrate, and recommend remediation.",
      affectedEntities: [
        "chronicle_siem_records",
        "chronicle_siem_events",
      ],
      discoveryPath: [
        "Inspect Chronicle SIEM records for the affected entities",
        "Compare against CrowdStrike historical baseline",
        "Generate a citation-backed recommendation",
      ],
      expectedEvidence: [
        "source-system record",
        "historical baseline metric",
        "generated audit trail",
      ],
      expectedRecommendation: "Explain the gap, cite supporting evidence, and propose the next Security Analyst action.",
    },
  ],
  datastorePackaging: {
    alloydb: {
      database: "siem_alert_triage_agent",
      schemas: [
        "chronicle_siem",
        "crowdstrike",
        "okta",
      ],
    },
    bigquery: {
      dataset: "it_siem_alert_triage_agent",
      tables: [
        "kpi_summary",
        "evidence_index",
      ],
    },
    cloudStorage: {
      bucketSuffix: "siem-alert-triage-agent-evidence",
      prefixes: [
        "documents",
        "audit-trails",
        "exports",
      ],
    },
    apis: {
      serviceName: "siem-alert-triage-agent-source-adapters",
      deploymentTarget: "cloud_run",
    },
  },
  validation: {
    smokePrompt: "Run the SIEM Alert Triage Agent workflow and cite source-system evidence for every claim.",
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

export const SIEMAlertTriageAgent = () => (
  <UseCaseSlide
    title="SIEM Alert Triage Agent"
    subtitle="IT4-03 • Cybersecurity & Threat Management"
    icon={ShieldAlert}
    domainId="domain-41"
    layer="Layer 3: Custom ADK"
    persona="Security Analyst"
    systems={["Chronicle SIEM", "CrowdStrike", "Splunk", "Okta", "Vertex AI"]}
    kpis={[
      { label: "Alert triage time", before: "15-30 min each", after: "<1 min automated" },
      { label: "False positive rate", before: "90% manual review", after: "92% auto-classified" },
      { label: "Analyst alert fatigue", before: "200+ daily alerts", after: "15 curated for review" },
    ]}
    triggerType="event"
    swimlane={swimlane}
    flow={flow}
    architecture={architecture}
    hitl={{ actor: "Security Analyst", action: "Confirm incident classification", description: "Analyst reviews agent's triage decision for confirmed incidents and initiates investigation workflow for true positives." }}
    statusQuo={[
      "Analysts manually investigate 200+ alerts daily, with 90% turning out to be false positives.",
      "Context enrichment requires manual lookup across 4-5 separate tools per alert.",
      "Alert fatigue leads to real threats being missed or delayed in investigation.",
    ]}
    agentification={[
      "Gemini auto-classifies 92% of alerts as benign with evidence, surfacing only true threats for human review.",
      "LLM reasons about alert context — distinguishing VPN artifacts from credential compromise in seconds.",
      "Continuous learning from analyst feedback improves triage accuracy over time.",
    ]}
  />
);
