import React from "react";
import { UseCaseSlide } from "../../../agent/UseCaseSlide";
import { FlowStep } from "../../../agent/ProcessFlow";
import { SwimlaneFlow } from "../../../agent/SwimlaneFlow";
import { AgentArchitecture, UseCaseGenerationSpec, AgentBehaviorContract} from "../../../../types/architecture";
import { ShieldAlert, Database, Fingerprint, Brain, FileWarning, CheckCircle } from "lucide-react";

const swimlane: SwimlaneFlow = {
  nodes: [
    { id: "s1", label: "Pre-Award Trigger", lane: "system", type: "trigger" },
    { id: "a1", label: "Entity Screening", lane: "agent", type: "action" },
    { id: "a2", label: "Adverse Media Scan", lane: "agent", type: "action" },
    { id: "a3", label: "Risk Synthesis", lane: "agent", type: "action" },
    { id: "a4", label: "Due Diligence Report", lane: "agent", type: "output" },
    { id: "h1", label: "Compliance Review", lane: "human", type: "hitl" },
  ],
  connections: [["s1", "a1"], ["a1", "a2"], ["a2", "a3"], ["a3", "a4"], ["a4", "h1"]],
};

const flow: FlowStep[] = [
  { label: "Sanctions Screening", icon: Database, description: "Entity screened against OFAC/SDN, World-Check, and EU sanctions lists with fuzzy name matching.", trigger: "On-demand", systems: ["OFAC/SDN", "World-Check"] },
  { label: "Identity Resolution", icon: Fingerprint, description: "Fuzzy name and alias matching across different formats and transliterations with confidence scoring.", systems: ["LexisNexis", "D&B"], integration: "ADK" },
  { label: "Media Analysis", icon: Brain, description: "LLM reads adverse media articles and distinguishes relevant risk signals from noise.", systems: ["Vertex AI"] },
  { label: "Compliance Decision", icon: CheckCircle, description: "Compliance and Sourcing Lead review risk-rated due diligence summary before award.", output: "Due Diligence Report" },
];

const architecture: AgentArchitecture = {
  connections: [
    { system: "LexisNexis", description: "Adverse media feeds, entity intelligence, litigation records", direction: "read", protocol: "REST API", category: "market-data" },
    { system: "OFAC/SDN", description: "US sanctions lists, specially designated nationals screening", direction: "read", protocol: "REST API", category: "market-data" },
    { system: "World-Check", description: "Global sanctions, PEP screening, entity risk profiles", direction: "read", protocol: "REST API", category: "market-data" },
    { system: "Dun & Bradstreet", description: "Entity verification, beneficial ownership, corporate hierarchy", direction: "read", protocol: "REST API", category: "market-data" },
    { system: "Google News", description: "Real-time adverse media monitoring across languages", direction: "read", protocol: "REST API", category: "market-data" },
    { system: "Vertex AI (Gemini)", description: "Adverse media relevance filtering, entity relationship reasoning, due diligence synthesis", direction: "bidirectional", protocol: "gRPC", category: "ai" },
  ],
  pipeline: [
    { label: "Sanctions & Watchlist Screening", description: "Query OFAC/SDN, World-Check, and LexisNexis sanctions lists. Run fuzzy name and alias matching across different formats and transliterations. Score match confidence to separate likely hits from false positives.", systems: ["OFAC/SDN", "World-Check", "LexisNexis"], layer: "integration", dataIn: "Supplier entity name, aliases, country, beneficial owners", dataOut: "Screening hits with match confidence scores" },
    { label: "Entity Resolution & Fuzzy Matching", description: "Fuzzy name/alias matching against sanctions lists with configurable thresholds. Entity resolution across different name formats and transliterations. D&B corporate hierarchy analysis for beneficial ownership tracing.", systems: ["Dun & Bradstreet", "LexisNexis"], layer: "ml", dataIn: "Raw screening hits + entity context data", dataOut: "Resolved entity matches with confidence scoring" },
    { label: "Adverse Media Analysis & Risk Synthesis", description: "LLM reads adverse media articles and distinguishes relevant risk signals from noise — bribery investigation is critical, charity sponsorship is not. Reasons about entity relationships: 'beneficial owner controls a company on EU sanctions lists in 2022.' Synthesizes into risk-rated due diligence summary.", systems: ["Vertex AI (Gemini)", "Google News"], layer: "llm", dataIn: "Resolved matches + adverse media articles + entity relationships", dataOut: "Risk-rated due diligence report for compliance review" },
  ],
};


const behaviorContract: AgentBehaviorContract = {
  role: "Compliance Manager agent for the Background & Sanctions Screener workflow",
  primaryObjective: "Fuzzy name matching with entity context resolves 90%+ of ambiguous matches automatically — 'Mohammad Al-Hassan' matched against 47 entries by country, industry, and associated entities. LLM distinguishes relevant adverse media from noise — bribery investigation in Nigeria is critical, charity sponsorship is not. so the Compliance Manager can move the Screening turnaround KPI.",
  inScope: [
    "Fuzzy name matching with entity context resolves 90%+ of ambiguous matches automatically — 'Mohammad Al-Hassan' matched against 47 entries by country, industry, and associated entities",
    "LLM distinguishes relevant adverse media from noise — bribery investigation in Nigeria is critical, charity sponsorship is not",
    "Entity relationship reasoning traces beneficial owners — 'owner also controls a company on EU sanctions lists in 2022, sanction lifted, but warrants enhanced due diligence.'",
  ],
  outOfScope: [
    "Contract execution without legal review",
    "Supplier disqualification decisions (category lead retains authority)",
    "Single-source justification overrides above policy threshold",
  ],
  toolIntents: [
    {
      name: "query_lexisnexis_lexisnexis_records",
      kind: "query",
      sourceSystemId: "lexisnexis",
      description: "Retrieve lexisnexis records from LexisNexis for the Background & Sanctions Screener workflow.",
      requiredInputs: [
        "lookup_key",
        "date_range",
      ],
      produces: [
        "lexisnexis_records_records",
        "lexisnexis_records_summary",
      ],
      evidenceEmitted: [
        "source_system_record",
      ],
    },
    {
      name: "query_ofac_sdn_ofac_sdn_records",
      kind: "query",
      sourceSystemId: "ofac_sdn",
      description: "Retrieve ofac sdn records from OFAC/SDN for the Background & Sanctions Screener workflow.",
      requiredInputs: [
        "lookup_key",
        "date_range",
      ],
      produces: [
        "ofac_sdn_records_records",
        "ofac_sdn_records_summary",
      ],
      evidenceEmitted: [
        "source_system_record",
      ],
    },
    {
      name: "query_world_check_world_check_records",
      kind: "query",
      sourceSystemId: "world_check",
      description: "Retrieve world check records from World-Check for the Background & Sanctions Screener workflow.",
      requiredInputs: [
        "lookup_key",
        "date_range",
      ],
      produces: [
        "world_check_records_records",
        "world_check_records_summary",
      ],
      evidenceEmitted: [
        "source_system_record",
      ],
    },
    {
      name: "query_d_b_d_b_records",
      kind: "query",
      sourceSystemId: "d_b",
      description: "Retrieve d b records from D&B for the Background & Sanctions Screener workflow.",
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
      name: "lookup_background_sanctions_screener_policy_guide",
      kind: "evidence_lookup",
      sourceSystemId: "lexisnexis",
      description: "Look up sections of the Background & Sanctions Screener Procurement Policy Guide to cite in narrative output, escalation rationale, and audit evidence.",
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
      name: "action_lexisnexis_match",
      kind: "action",
      sourceSystemId: "lexisnexis",
      description: "Execute the match step in LexisNexis after the agent has gathered evidence and validated escalation gates.",
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
      claim: "Screening turnaround moved from 3-5 business days toward < 2 hours",
      mustCite: [
        "lexisnexis.lexisnexis_records",
        "ofac_sdn.ofac_sdn_records",
      ],
      sourceSystemIds: [
        "lexisnexis",
        "ofac_sdn",
      ],
    },
    {
      claim: "False positive resolution moved from Manual review of all hits toward 90%+ auto-adjudicated",
      mustCite: [
        "lexisnexis.lexisnexis_records",
        "ofac_sdn.ofac_sdn_records",
      ],
      sourceSystemIds: [
        "lexisnexis",
        "ofac_sdn",
      ],
    },
  ],
  escalationRules: [
    {
      trigger: "Screening turnaround regresses past the 3-5 business days baseline by more than 20%",
      action: "escalate_to_human",
      handoffTarget: "Compliance Manager",
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
    "Never fabricate metric values; only publish numbers derived from LexisNexis (and other named systems) entities.",
    "Never bypass Compliance Manager approval on escalation triggers, even when confidence is high.",
    "Never expose individual personal data (PII) in summaries; aggregate or pseudonymise before output.",
    "Never act on data older than the staleness threshold defined in the runbook without a fresh re-query.",
  ],
  goldenEvals: [
    {
      id: "background-sanctions-screener-end-to-end",
      prompt: "Run the Background & Sanctions Screener workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.",
      expectedToolCalls: [
        "query_lexisnexis_lexisnexis_records",
        "query_ofac_sdn_ofac_sdn_records",
        "query_world_check_world_check_records",
        "query_d_b_d_b_records",
        "lookup_background_sanctions_screener_policy_guide",
        "action_lexisnexis_match",
      ],
      mustReferenceEntities: [
        "lexisnexis_records",
        "ofac_sdn_records",
        "world_check_records",
        "d_b_records",
      ],
      mustCiteDocuments: [
        "background-sanctions-screener-policy-guide",
      ],
      expectedActionOutcome: "Action match executed against LexisNexis, with audit-trail entry and Compliance Manager notified of outcomes.",
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
    rationale: "Row counts sized for Background & Sanctions Screener so the agent can demonstrate the workflow against realistic transactional volume without simulating a production warehouse.",
  },
  sourceSystems: [
    {
      id: "lexisnexis",
      name: "LexisNexis",
      owns: [
        "lexisnexis_records",
        "lexisnexis_events",
        "lexisnexis_audit_trail",
      ],
      protocol: "REST API",
      localBacking: [
        "alloydb",
      ],
      toolNames: [
        "query_lexisnexis_lexisnexis_records",
        "query_lexisnexis_lexisnexis_events",
        "query_lexisnexis_lexisnexis_audit_trail",
      ],
      evidence: [
        "source_system_record",
        "generated_audit_trail",
      ],
    },
    {
      id: "ofac_sdn",
      name: "OFAC/SDN",
      owns: [
        "ofac_sdn_records",
        "ofac_sdn_events",
        "ofac_sdn_audit_trail",
      ],
      protocol: "REST API",
      localBacking: [
        "alloydb",
      ],
      toolNames: [
        "query_ofac_sdn_ofac_sdn_records",
        "query_ofac_sdn_ofac_sdn_events",
        "query_ofac_sdn_ofac_sdn_audit_trail",
      ],
      evidence: [
        "source_system_record",
        "generated_audit_trail",
      ],
    },
    {
      id: "world_check",
      name: "World-Check",
      owns: [
        "world_check_records",
        "world_check_events",
        "world_check_audit_trail",
      ],
      protocol: "REST API",
      localBacking: [
        "alloydb",
      ],
      toolNames: [
        "query_world_check_world_check_records",
        "query_world_check_world_check_events",
        "query_world_check_world_check_audit_trail",
      ],
      evidence: [
        "source_system_record",
        "generated_audit_trail",
      ],
    },
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
  ],
  entities: [
    {
      name: "lexisnexis_records",
      sourceSystemId: "lexisnexis",
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
      name: "lexisnexis_events",
      sourceSystemId: "lexisnexis",
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
          name: "lexisnexis_record_id",
          type: "ref",
          ref: "lexisnexis_records.id",
          required: true,
        },
      ],
    },
    {
      name: "lexisnexis_audit_trail",
      sourceSystemId: "lexisnexis",
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
      name: "ofac_sdn_records",
      sourceSystemId: "ofac_sdn",
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
      name: "ofac_sdn_events",
      sourceSystemId: "ofac_sdn",
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
          name: "ofac_sdn_record_id",
          type: "ref",
          ref: "ofac_sdn_records.id",
          required: true,
        },
      ],
    },
    {
      name: "ofac_sdn_audit_trail",
      sourceSystemId: "ofac_sdn",
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
      name: "world_check_records",
      sourceSystemId: "world_check",
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
      name: "world_check_events",
      sourceSystemId: "world_check",
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
          name: "world_check_record_id",
          type: "ref",
          ref: "world_check_records.id",
          required: true,
        },
      ],
    },
    {
      name: "world_check_audit_trail",
      sourceSystemId: "world_check",
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
  ],
  relationships: [
    {
      from: "lexisnexis_events.lexisnexis_record_id",
      to: "lexisnexis_records.id",
      cardinality: "many-to-one",
      orphanPolicy: "none",
    },
    {
      from: "ofac_sdn_events.ofac_sdn_record_id",
      to: "ofac_sdn_records.id",
      cardinality: "many-to-one",
      orphanPolicy: "none",
    },
    {
      from: "world_check_events.world_check_record_id",
      to: "world_check_records.id",
      cardinality: "many-to-one",
      orphanPolicy: "none",
    },
    {
      from: "d_b_events.d_b_record_id",
      to: "d_b_records.id",
      cardinality: "many-to-one",
      orphanPolicy: "none",
    },
  ],
  documents: [
    {
      id: "background-sanctions-screener-policy-guide",
      sourceSystemId: "lexisnexis",
      type: "policy",
      title: "Background & Sanctions Screener Procurement Policy Guide",
      requiredSections: [
        "Sourcing principles",
        "Approval thresholds",
        "Supplier risk requirements",
        "Contract and compliance gates",
        "Exception handling",
      ],
      linkedEntities: [
        "lexisnexis_records",
        "lexisnexis_events",
        "lexisnexis_audit_trail",
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
      id: "lexisnexis_match_api",
      sourceSystemId: "lexisnexis",
      method: "POST",
      path: "/api/lexisnexis/match",
      description: "Synchronous endpoint the agent calls to match in LexisNexis after evidence gating.",
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
      id: "background-sanctions-screener-baseline-gap",
      description: "Seed a realistic gap where Screening turnaround sits between 3-5 business days and < 2 hours, so the agent can detect, narrate, and recommend remediation.",
      affectedEntities: [
        "lexisnexis_records",
        "lexisnexis_events",
      ],
      discoveryPath: [
        "Inspect LexisNexis records for the affected entities",
        "Compare against OFAC/SDN historical baseline",
        "Generate a citation-backed recommendation",
      ],
      expectedEvidence: [
        "source-system record",
        "historical baseline metric",
        "generated audit trail",
      ],
      expectedRecommendation: "Explain the gap, cite supporting evidence, and propose the next Compliance Manager action.",
    },
  ],
  datastorePackaging: {
    alloydb: {
      database: "background_sanctions_screener",
      schemas: [
        "lexisnexis",
        "ofac_sdn",
        "world_check",
        "d_b",
      ],
    },
    bigquery: {
      dataset: "procurement_background_sanctions_screener",
      tables: [
        "kpi_summary",
        "evidence_index",
      ],
    },
    cloudStorage: {
      bucketSuffix: "background-sanctions-screener-evidence",
      prefixes: [
        "documents",
        "audit-trails",
        "exports",
      ],
    },
    apis: {
      serviceName: "background-sanctions-screener-source-adapters",
      deploymentTarget: "cloud_run",
    },
  },
  validation: {
    smokePrompt: "Run the Background & Sanctions Screener workflow and cite source-system evidence for every claim.",
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

export const BackgroundSanctionsScreener = () => (
  <UseCaseSlide
    title="Background & Sanctions Screener"
    subtitle="A-1308 • Supplier Discovery"
    icon={ShieldAlert}
    domainId="domain-13"
    layer="Layer 3: Custom ADK"
    persona="Compliance Manager"
    systems={["LexisNexis", "OFAC/SDN", "World-Check", "D&B", "Vertex AI"]}
    kpis={[
      { label: "Screening turnaround", before: "3-5 business days", after: "< 2 hours" },
      { label: "False positive resolution", before: "Manual review of all hits", after: "90%+ auto-adjudicated" },
      { label: "Beneficial owner tracing", before: "Not performed", after: "Systematic entity relationship mapping" },
    ]}
    triggerType="event"
    swimlane={swimlane}
    flow={flow}
    architecture={architecture}
    hitl={{ actor: "Compliance + Sourcing Lead", action: "Approve due diligence clearance", description: "Compliance Manager and Sourcing Lead review risk-rated due diligence summary including sanctions hits, adverse media findings, and beneficial ownership analysis before award decision." }}
    statusQuo={[
      "Sanctions screening returns hundreds of false positives that compliance analysts manually adjudicate one by one.",
      "Adverse media searches limited to English-language sources with no context filtering — charity sponsorships flagged alongside bribery investigations.",
      "Beneficial ownership and entity relationship analysis not performed — risks from parent companies and board members missed."
    ]}
    agentification={[
      "Fuzzy name matching with entity context resolves 90%+ of ambiguous matches automatically — 'Mohammad Al-Hassan' matched against 47 entries by country, industry, and associated entities.",
      "LLM distinguishes relevant adverse media from noise — bribery investigation in Nigeria is critical, charity sponsorship is not.",
      "Entity relationship reasoning traces beneficial owners — 'owner also controls a company on EU sanctions lists in 2022, sanction lifted, but warrants enhanced due diligence.'"
    ]}
  />
);
