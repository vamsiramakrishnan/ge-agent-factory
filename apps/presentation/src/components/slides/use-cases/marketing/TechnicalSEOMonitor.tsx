import React from "react";
import { UseCaseSlide } from "../../../agent/UseCaseSlide";
import { FlowStep } from "../../../agent/ProcessFlow";
import { SwimlaneFlow } from "../../../agent/SwimlaneFlow";
import { AgentArchitecture, UseCaseGenerationSpec, AgentBehaviorContract} from "../../../../types/architecture";
import { Shield, Globe, AlertTriangle, Bell, CheckCircle } from "lucide-react";

const swimlane: SwimlaneFlow = {
  nodes: [
    { id: "s1", label: "Daily Crawl", lane: "system", type: "trigger" },
    { id: "a1", label: "Issue Detection", lane: "agent", type: "action" },
    { id: "a2", label: "Root Cause", lane: "agent", type: "action" },
    { id: "a3", label: "Alert & Tickets", lane: "agent", type: "output" },
  ],
  connections: [["s1", "a1"], ["a1", "a2"], ["a2", "a3"]],
};

const flow: FlowStep[] = [
  { label: "Daily Crawl", icon: Globe, description: "Automated daily crawl checks and Search Console monitoring for indexing issues.", trigger: "Daily", systems: ["Google Search Console", "Ahrefs"] },
  { label: "Issue Detection", icon: AlertTriangle, description: "Detect 404 errors, redirect chains, canonicalization issues, and Core Web Vitals regressions.", systems: ["Screaming Frog"] },
  { label: "Diagnosis", icon: Shield, description: "LLM diagnoses complex technical issues that automated tools flag but cannot explain.", systems: ["Vertex AI"], integration: "Agent Designer" },
  { label: "Alert & Track", icon: Bell, description: "Alert team via Slack and create fix tickets with prioritized resolution steps.", output: "Fix Tickets" },
];

const architecture: AgentArchitecture = {
  connections: [
    { system: "Google Search Console", description: "Indexation status, crawl errors, Core Web Vitals, mobile usability", direction: "read", protocol: "REST API", category: "analytics" },
    { system: "Ahrefs", description: "Backlink monitoring, broken link detection, domain health", direction: "read", protocol: "REST API", category: "analytics" },
    { system: "Screaming Frog", description: "Technical crawl data, redirect chains, canonical issues", direction: "read", protocol: "REST API", category: "analytics" },
    { system: "Vertex AI (Gemini)", description: "Complex technical issue diagnosis, root cause explanation", direction: "bidirectional", protocol: "gRPC", category: "ai" },
    { system: "Slack", description: "Real-time alerts for critical SEO issues", direction: "write", protocol: "Webhook", category: "collaboration" },
  ],
  pipeline: [
    { label: "Automated Crawl & Monitoring", description: "Run daily crawl checks via Screaming Frog and Ahrefs. Monitor Google Search Console for new indexing issues, crawl errors, and Core Web Vitals regressions.", systems: ["Screaming Frog", "Ahrefs", "Google Search Console"], layer: "integration", dataIn: "Daily crawl data + Search Console signals", dataOut: "Detected technical issues" },
    { label: "Pattern & Trend Analysis", description: "Crawl budget analysis, indexation rate tracking, page speed trend monitoring, and mobile usability scoring. Detect patterns indicating systematic issues.", systems: ["BigQuery"], layer: "ml", dataIn: "Technical issue data + historical trends", dataOut: "Prioritized issue list with severity scores" },
    { label: "Root Cause Diagnosis", description: "Gemini diagnoses complex issues tools flag but can't explain — e.g., a subdirectory with 15% indexation despite correct robots.txt because thin content triggers soft penalties. Recommends consolidation.", systems: ["Vertex AI (Gemini)"], layer: "llm", dataIn: "Flagged issues + page content context", dataOut: "Root cause analysis with fix recommendations" },
    { label: "Alert & Ticket Creation", description: "Critical issues alert via Slack immediately. All issues logged with prioritized fix steps. Trend dashboards updated for ongoing monitoring.", systems: ["Slack"], layer: "integration", dataIn: "Diagnosed issues with fixes", dataOut: "Slack alerts + fix tickets" },
  ],
};


const behaviorContract: AgentBehaviorContract = {
  role: "SEO/SEM Specialist agent for the Technical SEO Monitor workflow",
  primaryObjective: "Daily automated monitoring with instant Slack alerts for critical SEO issues. Gemini diagnoses complex issues — explaining why thin content triggers soft penalties, not just flagging the symptom. so the SEO/SEM Specialist can move the Issue detection speed KPI.",
  inScope: [
    "Daily automated monitoring with instant Slack alerts for critical SEO issues",
    "Gemini diagnoses complex issues — explaining why thin content triggers soft penalties, not just flagging the symptom",
    "Prioritized fix tickets with specific resolution steps generated automatically",
  ],
  outOfScope: [
    "Final approval of paid spend reallocations above the governance threshold",
    "Trademark, legal, or regulated-industry claim approval",
    "Crisis communications without comms-team sign-off",
  ],
  toolIntents: [
    {
      name: "query_google_search_console_google_search_console_records",
      kind: "query",
      sourceSystemId: "google_search_console",
      description: "Retrieve google search console records from Google Search Console for the Technical SEO Monitor workflow.",
      requiredInputs: [
        "lookup_key",
        "date_range",
      ],
      produces: [
        "google_search_console_records_records",
        "google_search_console_records_summary",
      ],
      evidenceEmitted: [
        "source_system_record",
      ],
    },
    {
      name: "query_ahrefs_keyword_rankings",
      kind: "query",
      sourceSystemId: "ahrefs",
      description: "Retrieve keyword rankings from Ahrefs for the Technical SEO Monitor workflow.",
      requiredInputs: [
        "lookup_key",
        "date_range",
      ],
      produces: [
        "keyword_rankings_records",
        "keyword_rankings_summary",
      ],
      evidenceEmitted: [
        "source_system_record",
      ],
    },
    {
      name: "query_screaming_frog_screaming_frog_records",
      kind: "query",
      sourceSystemId: "screaming_frog",
      description: "Retrieve screaming frog records from Screaming Frog for the Technical SEO Monitor workflow.",
      requiredInputs: [
        "lookup_key",
        "date_range",
      ],
      produces: [
        "screaming_frog_records_records",
        "screaming_frog_records_summary",
      ],
      evidenceEmitted: [
        "source_system_record",
      ],
    },
    {
      name: "query_slack_messages",
      kind: "query",
      sourceSystemId: "slack",
      description: "Retrieve messages from Slack for the Technical SEO Monitor workflow.",
      requiredInputs: [
        "lookup_key",
        "date_range",
      ],
      produces: [
        "messages_records",
        "messages_summary",
      ],
      evidenceEmitted: [
        "source_system_record",
      ],
    },
    {
      name: "lookup_technical_seo_monitor_playbook",
      kind: "evidence_lookup",
      sourceSystemId: "google_search_console",
      description: "Look up sections of the Technical SEO Monitor Playbook to cite in narrative output, escalation rationale, and audit evidence.",
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
      name: "action_google_search_console_generate",
      kind: "action",
      sourceSystemId: "google_search_console",
      description: "Execute the generate step in Google Search Console after the agent has gathered evidence and validated escalation gates.",
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
      claim: "Issue detection speed moved from Weekly manual toward Real-time",
      mustCite: [
        "google_search_console.google_search_console_records",
        "ahrefs.keyword_rankings",
      ],
      sourceSystemIds: [
        "google_search_console",
        "ahrefs",
      ],
    },
    {
      claim: "Crawl error resolution moved from 5-7 days toward Same day",
      mustCite: [
        "google_search_console.google_search_console_records",
        "ahrefs.keyword_rankings",
      ],
      sourceSystemIds: [
        "google_search_console",
        "ahrefs",
      ],
    },
  ],
  escalationRules: [
    {
      trigger: "Issue detection speed regresses past the Weekly manual baseline by more than 20%",
      action: "escalate_to_human",
      handoffTarget: "SEO/SEM Specialist",
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
    "Never fabricate metric values; only publish numbers derived from Google Search Console (and other named systems) entities.",
    "Never bypass SEO/SEM Specialist approval on escalation triggers, even when confidence is high.",
    "Never expose individual personal data (PII) in summaries; aggregate or pseudonymise before output.",
    "Never act on data older than the staleness threshold defined in the runbook without a fresh re-query.",
  ],
  goldenEvals: [
    {
      id: "technical-seo-monitor-end-to-end",
      prompt: "Run the Technical SEO Monitor workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.",
      expectedToolCalls: [
        "query_google_search_console_google_search_console_records",
        "query_ahrefs_keyword_rankings",
        "query_screaming_frog_screaming_frog_records",
        "query_slack_messages",
        "lookup_technical_seo_monitor_playbook",
        "action_google_search_console_generate",
      ],
      mustReferenceEntities: [
        "google_search_console_records",
        "keyword_rankings",
        "screaming_frog_records",
        "messages",
      ],
      mustCiteDocuments: [
        "technical-seo-monitor-playbook",
      ],
      expectedActionOutcome: "Action generate executed against Google Search Console, with audit-trail entry and SEO/SEM Specialist notified of outcomes.",
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
    rationale: "Row counts sized for Technical SEO Monitor so the agent can demonstrate the workflow against realistic transactional volume without simulating a production warehouse.",
  },
  sourceSystems: [
    {
      id: "google_search_console",
      name: "Google Search Console",
      owns: [
        "google_search_console_records",
        "google_search_console_events",
        "google_search_console_audit_trail",
      ],
      protocol: "REST API",
      localBacking: [
        "alloydb",
      ],
      toolNames: [
        "query_google_search_console_google_search_console_records",
        "query_google_search_console_google_search_console_events",
        "query_google_search_console_google_search_console_audit_trail",
      ],
      evidence: [
        "source_system_record",
        "generated_audit_trail",
      ],
    },
    {
      id: "ahrefs",
      name: "Ahrefs",
      owns: [
        "keyword_rankings",
        "backlink_profile",
        "competitor_data",
      ],
      protocol: "REST API",
      localBacking: [
        "alloydb",
      ],
      toolNames: [
        "query_ahrefs_keyword_rankings",
        "query_ahrefs_backlink_profile",
        "query_ahrefs_competitor_data",
      ],
      evidence: [
        "source_system_record",
        "generated_audit_trail",
      ],
    },
    {
      id: "screaming_frog",
      name: "Screaming Frog",
      owns: [
        "screaming_frog_records",
        "screaming_frog_events",
        "screaming_frog_audit_trail",
      ],
      protocol: "REST API",
      localBacking: [
        "alloydb",
      ],
      toolNames: [
        "query_screaming_frog_screaming_frog_records",
        "query_screaming_frog_screaming_frog_events",
        "query_screaming_frog_screaming_frog_audit_trail",
      ],
      evidence: [
        "source_system_record",
        "generated_audit_trail",
      ],
    },
    {
      id: "slack",
      name: "Slack",
      owns: [
        "messages",
        "channels",
        "thread_replies",
      ],
      protocol: "Slack API",
      localBacking: [
        "json-api",
      ],
      toolNames: [
        "query_slack_messages",
        "query_slack_channels",
        "query_slack_thread_replies",
      ],
      evidence: [
        "source_system_record",
        "generated_audit_trail",
      ],
    },
  ],
  entities: [
    {
      name: "google_search_console_records",
      sourceSystemId: "google_search_console",
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
      name: "google_search_console_events",
      sourceSystemId: "google_search_console",
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
          name: "google_search_console_record_id",
          type: "ref",
          ref: "google_search_console_records.id",
          required: true,
        },
      ],
    },
    {
      name: "google_search_console_audit_trail",
      sourceSystemId: "google_search_console",
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
      name: "keyword_rankings",
      sourceSystemId: "ahrefs",
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
      name: "backlink_profile",
      sourceSystemId: "ahrefs",
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
      name: "competitor_data",
      sourceSystemId: "ahrefs",
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
      name: "screaming_frog_records",
      sourceSystemId: "screaming_frog",
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
      name: "screaming_frog_events",
      sourceSystemId: "screaming_frog",
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
          name: "screaming_frog_record_id",
          type: "ref",
          ref: "screaming_frog_records.id",
          required: true,
        },
      ],
    },
    {
      name: "screaming_frog_audit_trail",
      sourceSystemId: "screaming_frog",
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
      name: "messages",
      sourceSystemId: "slack",
      datastore: "json-api",
      rowCount: 60,
      primaryKey: "id",
      columns: [
        {
          name: "id",
          type: "seq",
          required: true,
        },
        {
          name: "channel",
          type: "lorem.words",
          required: true,
        },
        {
          name: "author",
          type: "person.fullName",
          required: true,
        },
        {
          name: "body",
          type: "lorem.sentence",
          required: true,
        },
        {
          name: "sentiment",
          type: "enum",
          values: [
            "positive",
            "neutral",
            "negative",
          ],
          weights: [
            0.4,
            0.4,
            0.2,
          ],
          required: true,
        },
        {
          name: "sent_at",
          type: "date",
          required: true,
        },
      ],
    },
    {
      name: "channels",
      sourceSystemId: "slack",
      datastore: "json-api",
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
      name: "thread_replies",
      sourceSystemId: "slack",
      datastore: "json-api",
      rowCount: 60,
      primaryKey: "id",
      columns: [
        {
          name: "id",
          type: "seq",
          required: true,
        },
        {
          name: "channel",
          type: "lorem.words",
          required: true,
        },
        {
          name: "author",
          type: "person.fullName",
          required: true,
        },
        {
          name: "body",
          type: "lorem.sentence",
          required: true,
        },
        {
          name: "sentiment",
          type: "enum",
          values: [
            "positive",
            "neutral",
            "negative",
          ],
          weights: [
            0.4,
            0.4,
            0.2,
          ],
          required: true,
        },
        {
          name: "sent_at",
          type: "date",
          required: true,
        },
      ],
    },
  ],
  relationships: [
    {
      from: "google_search_console_events.google_search_console_record_id",
      to: "google_search_console_records.id",
      cardinality: "many-to-one",
      orphanPolicy: "none",
    },
    {
      from: "screaming_frog_events.screaming_frog_record_id",
      to: "screaming_frog_records.id",
      cardinality: "many-to-one",
      orphanPolicy: "none",
    },
  ],
  documents: [
    {
      id: "technical-seo-monitor-playbook",
      sourceSystemId: "google_search_console",
      type: "playbook",
      title: "Technical SEO Monitor Playbook",
      requiredSections: [
        "Audience guidelines",
        "Brand voice rules",
        "Channel-specific guardrails",
        "Measurement framework",
        "Approval thresholds",
      ],
      linkedEntities: [
        "google_search_console_records",
        "google_search_console_events",
        "google_search_console_audit_trail",
      ],
      minimumWordCount: 500,
      citationAnchors: [
        "audience",
        "brand-voice",
        "channels",
        "approvals",
      ],
    },
  ],
  apis: [
    {
      id: "google_search_console_generate_api",
      sourceSystemId: "google_search_console",
      method: "POST",
      path: "/api/google_search_console/generate",
      description: "Synchronous endpoint the agent calls to generate in Google Search Console after evidence gating.",
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
      id: "technical-seo-monitor-baseline-gap",
      description: "Seed a realistic gap where Issue detection speed sits between Weekly manual and Real-time, so the agent can detect, narrate, and recommend remediation.",
      affectedEntities: [
        "google_search_console_records",
        "google_search_console_events",
      ],
      discoveryPath: [
        "Inspect Google Search Console records for the affected entities",
        "Compare against Ahrefs historical baseline",
        "Generate a citation-backed recommendation",
      ],
      expectedEvidence: [
        "source-system record",
        "historical baseline metric",
        "generated audit trail",
      ],
      expectedRecommendation: "Explain the gap, cite supporting evidence, and propose the next SEO/SEM Specialist action.",
    },
  ],
  datastorePackaging: {
    alloydb: {
      database: "technical_seo_monitor",
      schemas: [
        "google_search_console",
        "ahrefs",
        "screaming_frog",
        "slack",
      ],
    },
    bigquery: {
      dataset: "marketing_technical_seo_monitor",
      tables: [
        "kpi_summary",
        "evidence_index",
      ],
    },
    cloudStorage: {
      bucketSuffix: "technical-seo-monitor-evidence",
      prefixes: [
        "documents",
        "audit-trails",
        "exports",
      ],
    },
    apis: {
      serviceName: "technical-seo-monitor-source-adapters",
      deploymentTarget: "cloud_run",
    },
  },
  validation: {
    smokePrompt: "Run the Technical SEO Monitor workflow and cite source-system evidence for every claim.",
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

export const TechnicalSEOMonitor = () => (
  <UseCaseSlide
    title="Technical SEO Monitor"
    subtitle="A-3206 • Digital Marketing & SEO/SEM"
    icon={Shield}
    domainId="domain-32"
    layer="Layer 2: Agent Designer"
    persona="SEO/SEM Specialist"
    systems={["Google Search Console", "Ahrefs", "Screaming Frog", "Slack", "Vertex AI"]}
    kpis={[
      { label: "Issue detection speed", before: "Weekly manual", after: "Real-time" },
      { label: "Crawl error resolution", before: "5-7 days", after: "Same day" },
      { label: "Indexation rate", before: "78%", after: "95%+" },
    ]}
    triggerType="scheduled"
    swimlane={swimlane}
    flow={flow}
    architecture={architecture}
    statusQuo={[
      "Technical SEO checks done weekly or ad-hoc — issues linger for days before detection.",
      "Crawl errors and indexation drops discovered reactively when traffic declines.",
      "Complex technical issues flagged by tools but root cause requires manual investigation."
    ]}
    agentification={[
      "Daily automated monitoring with instant Slack alerts for critical SEO issues.",
      "Gemini diagnoses complex issues — explaining why thin content triggers soft penalties, not just flagging the symptom.",
      "Prioritized fix tickets with specific resolution steps generated automatically."
    ]}
  />
);
