import React from "react";
import { UseCaseSlide } from "../../../agent/UseCaseSlide";
import { FlowStep } from "../../../agent/ProcessFlow";
import { SwimlaneFlow } from "../../../agent/SwimlaneFlow";
import { AgentArchitecture, UseCaseGenerationSpec, AgentBehaviorContract} from "../../../../types/architecture";
import { Mail, Search, AlertTriangle, ShieldCheck, ShieldAlert } from "lucide-react";

const swimlane: SwimlaneFlow = {
  nodes: [
    { id: "s1", label: "User Reports Phishing", lane: "system", type: "trigger" },
    { id: "a1", label: "IOC Extraction", lane: "agent", type: "action" },
    { id: "a2", label: "Threat Analysis", lane: "agent", type: "action" },
    { id: "a3", label: "Quarantine Action", lane: "agent", type: "output" },
    { id: "h1", label: "Analyst Validates", lane: "human", type: "hitl" },
  ],
  connections: [["s1", "a1"], ["a1", "a2"], ["a2", "a3"], ["a3", "h1"]],
};

const flow: FlowStep[] = [
  { label: "Email Received", icon: Mail, description: "Reported email ingested with headers, body, URLs, and attachments extracted.", trigger: "Event-driven", systems: ["Google Workspace"] },
  { label: "IOC Analysis", icon: Search, description: "URLs, domains, sender reputation, and attachment hashes checked against threat intelligence.", systems: ["CrowdStrike", "Chronicle"], integration: "ADK" },
  { label: "Threat Classification", icon: AlertTriangle, description: "LLM analyzes writing style, domain spoofing, and social engineering tactics for sophisticated phishing.", systems: ["Vertex AI"] },
  { label: "Analyst Validation", icon: ShieldCheck, description: "Analyst validates confirmed phishing and approves org-wide quarantine of matching emails.", output: "Quarantine Action" },
];

const architecture: AgentArchitecture = {
  connections: [
    { system: "Google Workspace", description: "Email headers, body content, attachment metadata", direction: "bidirectional", protocol: "Workspace API", category: "collaboration" },
    { system: "CrowdStrike", description: "URL reputation, file hash analysis, sandbox results", direction: "read", protocol: "REST API", category: "erp" },
    { system: "Chronicle SIEM", description: "IOC matching, similar email detection across org", direction: "bidirectional", protocol: "gRPC", category: "analytics" },
    { system: "BigQuery", description: "Phishing pattern history, reporter accuracy tracking", direction: "bidirectional", protocol: "BigQuery SQL", category: "analytics" },
    { system: "Vertex AI (Gemini)", description: "Writing style analysis, BEC detection, social engineering scoring", direction: "bidirectional", protocol: "gRPC", category: "ai" },
  ],
  pipeline: [
    { label: "Email Decomposition", description: "Extract all IOCs from reported email: sender domain, reply-to mismatches, embedded URLs, attachment hashes, SPF/DKIM/DMARC results, and email body text.", systems: ["Google Workspace"], layer: "integration", dataIn: "User-reported phishing email", dataOut: "Extracted IOCs + email metadata" },
    { label: "Threat Intelligence Matching", description: "Check extracted IOCs against CrowdStrike threat feeds, sandbox suspicious attachments, and search Chronicle for similar emails sent to other users in the organization.", systems: ["CrowdStrike", "Chronicle SIEM"], layer: "ml", dataIn: "Extracted IOCs", dataOut: "Threat match results + org-wide exposure" },
    { label: "Sophisticated Phishing Detection", description: "Gemini analyzes writing style for BEC impersonation, evaluates domain similarity scoring, and detects social engineering urgency tactics that bypass traditional filters.", systems: ["Vertex AI (Gemini)"], layer: "llm", dataIn: "Email content + threat match results", dataOut: "Phishing classification with confidence and technique" },
    { label: "Quarantine & Response", description: "Confirmed phishing emails quarantined org-wide. Sender domain blocked. IOCs added to threat intelligence database for future detection.", systems: ["Google Workspace", "Chronicle SIEM"], layer: "integration", dataIn: "Confirmed phishing classification", dataOut: "Quarantine action + updated threat intel" },
  ],
};


const behaviorContract: AgentBehaviorContract = {
  role: "Security Analyst agent for the Phishing & Email Threat Analyzer workflow",
  primaryObjective: "Gemini detects BEC impersonation by analyzing writing style against known executive communication patterns. LLM identifies social engineering tactics and domain spoofing that bypass traditional filters. so the Security Analyst can move the Phishing analysis time KPI.",
  inScope: [
    "Gemini detects BEC impersonation by analyzing writing style against known executive communication patterns",
    "LLM identifies social engineering tactics and domain spoofing that bypass traditional filters",
    "Automated org-wide quarantine removes matching emails within minutes of confirmation",
  ],
  outOfScope: [
    "Production deployments outside an approved change window",
    "Irreversible destructive actions on shared infrastructure (DROP, force-delete, key rotation)",
    "Security incident attribution requiring forensics",
  ],
  toolIntents: [
    {
      name: "query_google_workspace_accounts",
      kind: "query",
      sourceSystemId: "google_workspace",
      description: "Retrieve accounts from Google Workspace for the Phishing & Email Threat Analyzer workflow.",
      requiredInputs: [
        "lookup_key",
        "date_range",
      ],
      produces: [
        "accounts_records",
        "accounts_summary",
      ],
      evidenceEmitted: [
        "source_system_record",
      ],
    },
    {
      name: "query_crowdstrike_scan_findings",
      kind: "query",
      sourceSystemId: "crowdstrike",
      description: "Retrieve scan findings from CrowdStrike for the Phishing & Email Threat Analyzer workflow.",
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
      name: "query_chronicle_chronicle_records",
      kind: "query",
      sourceSystemId: "chronicle",
      description: "Retrieve chronicle records from Chronicle for the Phishing & Email Threat Analyzer workflow.",
      requiredInputs: [
        "lookup_key",
        "date_range",
      ],
      produces: [
        "chronicle_records_records",
        "chronicle_records_summary",
      ],
      evidenceEmitted: [
        "source_system_record",
      ],
    },
    {
      name: "lookup_phishing_email_threat_analyzer_runbook",
      kind: "evidence_lookup",
      sourceSystemId: "google_workspace",
      description: "Look up sections of the Phishing & Email Threat Analyzer Operations Runbook to cite in narrative output, escalation rationale, and audit evidence.",
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
      name: "action_google_workspace_match",
      kind: "action",
      sourceSystemId: "google_workspace",
      description: "Execute the match step in Google Workspace after the agent has gathered evidence and validated escalation gates.",
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
      claim: "Phishing analysis time moved from 25 min per email toward 3 min automated",
      mustCite: [
        "google_workspace.accounts",
        "crowdstrike.scan_findings",
      ],
      sourceSystemIds: [
        "google_workspace",
        "crowdstrike",
      ],
    },
    {
      claim: "BEC detection rate moved from 60% caught toward 95% with LLM style analysis",
      mustCite: [
        "google_workspace.accounts",
        "crowdstrike.scan_findings",
      ],
      sourceSystemIds: [
        "google_workspace",
        "crowdstrike",
      ],
    },
  ],
  escalationRules: [
    {
      trigger: "Phishing analysis time regresses past the 25 min per email baseline by more than 20%",
      action: "escalate_to_human",
      handoffTarget: "Security Analyst",
      rationale: "Significant regressions need human judgment before automated remediation runs against production records.",
    },
    {
      trigger: "Source-system evidence is incomplete or stale (>24h) for any required entity",
      action: "request_more_info",
      rationale: "Recommendations grounded in stale evidence misrepresent current state and undermine audit defensibility.",
    },
    {
      trigger: "Proposed match action lacks supporting evidence from at least two systems",
      action: "refuse",
      rationale: "Single-system evidence is insufficient to authorize external state changes without manual review.",
    },
  ],
  refusalRules: [
    "Never fabricate metric values; only publish numbers derived from Google Workspace (and other named systems) entities.",
    "Never bypass Security Analyst approval on escalation triggers, even when confidence is high.",
    "Never expose individual personal data (PII) in summaries; aggregate or pseudonymise before output.",
    "Never act on data older than the staleness threshold defined in the runbook without a fresh re-query.",
  ],
  goldenEvals: [
    {
      id: "phishing-email-threat-analyzer-end-to-end",
      prompt: "Run the Phishing & Email Threat Analyzer workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.",
      expectedToolCalls: [
        "query_google_workspace_accounts",
        "query_crowdstrike_scan_findings",
        "query_chronicle_chronicle_records",
        "lookup_phishing_email_threat_analyzer_runbook",
        "action_google_workspace_match",
      ],
      mustReferenceEntities: [
        "accounts",
        "scan_findings",
        "chronicle_records",
      ],
      mustCiteDocuments: [
        "phishing-email-threat-analyzer-runbook",
      ],
      expectedActionOutcome: "Action match executed against Google Workspace, with audit-trail entry and Security Analyst notified of outcomes.",
      forbiddenBehaviors: [
        "do not invent KPI numbers",
        "do not skip the evidence_lookup step before any recommendation",
        "do not execute match without two-system evidence",
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
    rationale: "Row counts sized for Phishing & Email Threat Analyzer so the agent can demonstrate the workflow against realistic transactional volume without simulating a production warehouse.",
  },
  sourceSystems: [
    {
      id: "google_workspace",
      name: "Google Workspace",
      owns: [
        "accounts",
        "group_memberships",
        "license_assignments",
      ],
      protocol: "Workspace API",
      localBacking: [
        "alloydb",
      ],
      toolNames: [
        "query_google_workspace_accounts",
        "query_google_workspace_group_memberships",
        "query_google_workspace_license_assignments",
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
      id: "chronicle",
      name: "Chronicle",
      owns: [
        "chronicle_records",
        "chronicle_events",
        "chronicle_audit_trail",
      ],
      protocol: "REST API",
      localBacking: [
        "alloydb",
      ],
      toolNames: [
        "query_chronicle_chronicle_records",
        "query_chronicle_chronicle_events",
        "query_chronicle_chronicle_audit_trail",
      ],
      evidence: [
        "source_system_record",
        "generated_audit_trail",
      ],
    },
  ],
  entities: [
    {
      name: "accounts",
      sourceSystemId: "google_workspace",
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
          name: "account_name",
          type: "company.name",
          required: true,
        },
        {
          name: "amount",
          type: "number",
          min: 5000,
          max: 1000000,
          required: true,
        },
        {
          name: "stage",
          type: "enum",
          values: [
            "prospecting",
            "qualification",
            "proposal",
            "negotiation",
            "closed_won",
            "closed_lost",
          ],
          required: true,
        },
        {
          name: "owner",
          type: "person.fullName",
          required: true,
        },
        {
          name: "close_date",
          type: "date",
          required: true,
        },
      ],
    },
    {
      name: "group_memberships",
      sourceSystemId: "google_workspace",
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
      name: "license_assignments",
      sourceSystemId: "google_workspace",
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
      name: "chronicle_records",
      sourceSystemId: "chronicle",
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
      name: "chronicle_events",
      sourceSystemId: "chronicle",
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
          name: "chronicle_record_id",
          type: "ref",
          ref: "chronicle_records.id",
          required: true,
        },
      ],
    },
    {
      name: "chronicle_audit_trail",
      sourceSystemId: "chronicle",
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
      from: "chronicle_events.chronicle_record_id",
      to: "chronicle_records.id",
      cardinality: "many-to-one",
      orphanPolicy: "none",
    },
  ],
  documents: [
    {
      id: "phishing-email-threat-analyzer-runbook",
      sourceSystemId: "google_workspace",
      type: "runbook",
      title: "Phishing & Email Threat Analyzer Operations Runbook",
      requiredSections: [
        "Detection signals",
        "Triage procedures",
        "Remediation actions",
        "Rollback criteria",
        "Post-incident review",
      ],
      linkedEntities: [
        "accounts",
        "group_memberships",
        "license_assignments",
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
      id: "google_workspace_match_api",
      sourceSystemId: "google_workspace",
      method: "POST",
      path: "/api/google_workspace/match",
      description: "Synchronous endpoint the agent calls to match in Google Workspace after evidence gating.",
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
      id: "phishing-email-threat-analyzer-baseline-gap",
      description: "Seed a realistic gap where Phishing analysis time sits between 25 min per email and 3 min automated, so the agent can detect, narrate, and recommend remediation.",
      affectedEntities: [
        "accounts",
        "group_memberships",
      ],
      discoveryPath: [
        "Inspect Google Workspace records for the affected entities",
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
      database: "phishing_email_threat_analyzer",
      schemas: [
        "google_workspace",
        "crowdstrike",
        "chronicle",
      ],
    },
    bigquery: {
      dataset: "it_phishing_email_threat_analyzer",
      tables: [
        "kpi_summary",
        "evidence_index",
      ],
    },
    cloudStorage: {
      bucketSuffix: "phishing-email-threat-analyzer-evidence",
      prefixes: [
        "documents",
        "audit-trails",
        "exports",
      ],
    },
    apis: {
      serviceName: "phishing-email-threat-analyzer-source-adapters",
      deploymentTarget: "cloud_run",
    },
  },
  validation: {
    smokePrompt: "Run the Phishing & Email Threat Analyzer workflow and cite source-system evidence for every claim.",
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

export const PhishingEmailThreatAnalyzer = () => (
  <UseCaseSlide
    title="Phishing & Email Threat Analyzer"
    subtitle="IT4-04 • Cybersecurity & Threat Management"
    icon={ShieldAlert}
    domainId="domain-41"
    layer="Layer 3: Custom ADK"
    persona="Security Analyst"
    systems={["Google Workspace", "CrowdStrike", "Chronicle", "Vertex AI"]}
    kpis={[
      { label: "Phishing analysis time", before: "25 min per email", after: "3 min automated" },
      { label: "BEC detection rate", before: "60% caught", after: "95% with LLM style analysis" },
      { label: "Org-wide quarantine speed", before: "2-4 hours", after: "<5 minutes" },
    ]}
    triggerType="event"
    swimlane={swimlane}
    flow={flow}
    architecture={architecture}
    hitl={{ actor: "Security Analyst", action: "Validate phishing classification", description: "Analyst confirms phishing detection and approves org-wide quarantine action to remove matching emails from all mailboxes." }}
    statusQuo={[
      "Reported phishing emails investigated manually — checking URLs, headers, and attachments across separate tools.",
      "Sophisticated BEC attacks often bypass rule-based filters due to clean domains and no malicious links.",
      "Org-wide quarantine of phishing campaigns takes hours, leaving users exposed to follow-up attempts.",
    ]}
    agentification={[
      "Gemini detects BEC impersonation by analyzing writing style against known executive communication patterns.",
      "LLM identifies social engineering tactics and domain spoofing that bypass traditional filters.",
      "Automated org-wide quarantine removes matching emails within minutes of confirmation.",
    ]}
  />
);
