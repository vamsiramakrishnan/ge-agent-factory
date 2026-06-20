import React from "react";
import { UseCaseSlide } from "../../../agent/UseCaseSlide";
import { FlowStep } from "../../../agent/ProcessFlow";
import { SwimlaneFlow } from "../../../agent/SwimlaneFlow";
import { AgentArchitecture, UseCaseGenerationSpec, AgentBehaviorContract} from "../../../../types/architecture";
import { ShieldCheck, Database, Search, Brain, CheckCircle } from "lucide-react";

const swimlane: SwimlaneFlow = {
  nodes: [
    { id: "s1", label: "New Txn / Daily Batch", lane: "system", type: "trigger" },
    { id: "a1", label: "Fuzzy Name Match", lane: "agent", type: "action" },
    { id: "a2", label: "Ambiguity Resolution", lane: "agent", type: "action" },
    { id: "a3", label: "Match Report", lane: "agent", type: "output" },
    { id: "h1", label: "Compliance Review", lane: "human", type: "hitl" },
  ],
  connections: [["s1", "a1"], ["a1", "a2"], ["a2", "a3"], ["a3", "h1"]],
};

const flow: FlowStep[] = [
  { label: "Entity Screening", icon: Database, description: "Active vendor master and new transactions screened against global sanctions lists daily.", trigger: "Event + Daily", systems: ["OFAC/SDN", "EU Sanctions", "World-Check"] },
  { label: "Fuzzy Matching", icon: Search, description: "Name/alias matching across transliterations and entity formats with confidence scoring.", systems: ["LexisNexis", "Dow Jones R&C"], integration: "ADK" },
  { label: "Ambiguity Resolution", icon: Brain, description: "LLM resolves ambiguous matches — 47 'Mohammad Al-Hassan' entries differentiated by context.", systems: ["Vertex AI"] },
  { label: "Compliance Decision", icon: CheckCircle, description: "Compliance Manager reviews flagged matches with contextual evidence and recommended action.", output: "Screening Report" },
];

const architecture: AgentArchitecture = {
  connections: [
    { system: "OFAC/SDN", description: "US sanctions lists, Specially Designated Nationals screening", direction: "read", protocol: "REST API", category: "market-data" },
    { system: "World-Check", description: "Global PEP and sanctions screening, adverse media", direction: "read", protocol: "REST API", category: "market-data" },
    { system: "LexisNexis", description: "Entity verification, beneficial ownership, adverse media in multiple languages", direction: "read", protocol: "REST API", category: "market-data" },
    { system: "Dow Jones Risk & Compliance", description: "Sanctions lists, PEP data, adverse media monitoring", direction: "read", protocol: "REST API", category: "market-data" },
    { system: "Vertex AI (Gemini)", description: "Ambiguous match resolution, entity context reasoning, adverse media interpretation", direction: "bidirectional", protocol: "gRPC", category: "ai" },
  ],
  pipeline: [
    { label: "Batch & Event Screening", description: "Run daily batch screening of active vendor master against updated OFAC, EU, UN, and OFSI sanctions lists. Screen new suppliers at onboarding and transactions against restricted party lists. Log all results for audit trail.", systems: ["OFAC/SDN", "World-Check", "Dow Jones Risk & Compliance"], layer: "integration", dataIn: "Vendor master + new supplier/transaction events", dataOut: "Raw match candidates with confidence scores" },
    { label: "Fuzzy Entity Matching", description: "Name/alias matching across transliterations and entity formats with configurable confidence thresholds. PEP screening with match confidence scoring against global sanctions databases.", systems: ["LexisNexis", "Dow Jones Risk & Compliance"], layer: "ml", dataIn: "Raw entity names + aliases", dataOut: "Match candidates scored by confidence with entity context" },
    { label: "Ambiguity Resolution", description: "Gemini resolves matches that fuzzy matching cannot adjudicate: 47 'Mohammad Al-Hassan' entries differentiated by country, industry, associated entities, and dates. Reads adverse media in multiple languages and distinguishes entity-level vs. beneficial owner vs. board member matches for appropriate escalation paths.", systems: ["Vertex AI (Gemini)"], layer: "llm", dataIn: "Ambiguous match candidates with entity context", dataOut: "Resolved matches with disposition recommendations for Compliance Manager" },
  ],
};


const behaviorContract: AgentBehaviorContract = {
  role: "Compliance Manager agent for the Sanctions & Watchlist Screener workflow",
  primaryObjective: "Fuzzy name/alias matching across OFAC, EU, UN, and OFSI lists with configurable confidence thresholds. LLM resolves ambiguous matches using entity context — country, industry, associated entities, dates — to separate true hits from false positives. so the Compliance Manager can move the False positive rate KPI.",
  inScope: [
    "Fuzzy name/alias matching across OFAC, EU, UN, and OFSI lists with configurable confidence thresholds",
    "LLM resolves ambiguous matches using entity context — country, industry, associated entities, dates — to separate true hits from false positives",
    "Distinguishes sanctions on the supplier entity vs. beneficial owner vs. board member, routing to appropriate escalation paths",
  ],
  outOfScope: [
    "Contract execution without legal review",
    "Supplier disqualification decisions (category lead retains authority)",
    "Single-source justification overrides above policy threshold",
  ],
  toolIntents: [
    {
      name: "query_ofac_sdn_ofac_sdn_records",
      kind: "query",
      sourceSystemId: "ofac_sdn",
      description: "Retrieve ofac sdn records from OFAC/SDN for the Sanctions & Watchlist Screener workflow.",
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
      name: "query_eu_sanctions_eu_sanctions_records",
      kind: "query",
      sourceSystemId: "eu_sanctions",
      description: "Retrieve eu sanctions records from EU Sanctions for the Sanctions & Watchlist Screener workflow.",
      requiredInputs: [
        "lookup_key",
        "date_range",
      ],
      produces: [
        "eu_sanctions_records_records",
        "eu_sanctions_records_summary",
      ],
      evidenceEmitted: [
        "source_system_record",
      ],
    },
    {
      name: "query_world_check_world_check_records",
      kind: "query",
      sourceSystemId: "world_check",
      description: "Retrieve world check records from World-Check for the Sanctions & Watchlist Screener workflow.",
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
      name: "query_lexisnexis_lexisnexis_records",
      kind: "query",
      sourceSystemId: "lexisnexis",
      description: "Retrieve lexisnexis records from LexisNexis for the Sanctions & Watchlist Screener workflow.",
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
      name: "lookup_sanctions_watchlist_screener_policy_guide",
      kind: "evidence_lookup",
      sourceSystemId: "ofac_sdn",
      description: "Look up sections of the Sanctions & Watchlist Screener Procurement Policy Guide to cite in narrative output, escalation rationale, and audit evidence.",
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
      name: "action_ofac_sdn_match",
      kind: "action",
      sourceSystemId: "ofac_sdn",
      description: "Execute the match step in OFAC/SDN after the agent has gathered evidence and validated escalation gates.",
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
      claim: "False positive rate moved from 85% manual triage toward 15% with LLM context",
      mustCite: [
        "ofac_sdn.ofac_sdn_records",
        "eu_sanctions.eu_sanctions_records",
      ],
      sourceSystemIds: [
        "ofac_sdn",
        "eu_sanctions",
      ],
    },
    {
      claim: "Screening coverage moved from New suppliers only toward Full vendor master daily",
      mustCite: [
        "ofac_sdn.ofac_sdn_records",
        "eu_sanctions.eu_sanctions_records",
      ],
      sourceSystemIds: [
        "ofac_sdn",
        "eu_sanctions",
      ],
    },
  ],
  escalationRules: [
    {
      trigger: "False positive rate regresses past the 85% manual triage baseline by more than 20%",
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
    "Never fabricate metric values; only publish numbers derived from OFAC/SDN (and other named systems) entities.",
    "Never bypass Compliance Manager approval on escalation triggers, even when confidence is high.",
    "Never expose individual personal data (PII) in summaries; aggregate or pseudonymise before output.",
    "Never act on data older than the staleness threshold defined in the runbook without a fresh re-query.",
  ],
  goldenEvals: [
    {
      id: "sanctions-watchlist-screener-end-to-end",
      prompt: "Run the Sanctions & Watchlist Screener workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.",
      expectedToolCalls: [
        "query_ofac_sdn_ofac_sdn_records",
        "query_eu_sanctions_eu_sanctions_records",
        "query_world_check_world_check_records",
        "query_lexisnexis_lexisnexis_records",
        "lookup_sanctions_watchlist_screener_policy_guide",
        "action_ofac_sdn_match",
      ],
      mustReferenceEntities: [
        "ofac_sdn_records",
        "eu_sanctions_records",
        "world_check_records",
        "lexisnexis_records",
        "dow_jones_risk_compliance_records",
      ],
      mustCiteDocuments: [
        "sanctions-watchlist-screener-policy-guide",
      ],
      expectedActionOutcome: "Action match executed against OFAC/SDN, with audit-trail entry and Compliance Manager notified of outcomes.",
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
    rationale: "Row counts sized for Sanctions & Watchlist Screener so the agent can demonstrate the workflow against realistic transactional volume without simulating a production warehouse.",
  },
  sourceSystems: [
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
      id: "eu_sanctions",
      name: "EU Sanctions",
      owns: [
        "eu_sanctions_records",
        "eu_sanctions_events",
        "eu_sanctions_audit_trail",
      ],
      protocol: "REST API",
      localBacking: [
        "alloydb",
      ],
      toolNames: [
        "query_eu_sanctions_eu_sanctions_records",
        "query_eu_sanctions_eu_sanctions_events",
        "query_eu_sanctions_eu_sanctions_audit_trail",
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
      id: "dow_jones_risk_compliance",
      name: "Dow Jones Risk & Compliance",
      owns: [
        "dow_jones_risk_compliance_records",
        "dow_jones_risk_compliance_events",
        "dow_jones_risk_compliance_audit_trail",
      ],
      protocol: "REST API",
      localBacking: [
        "alloydb",
      ],
      toolNames: [
        "query_dow_jones_risk_compliance_dow_jones_risk_compliance_records",
        "query_dow_jones_risk_compliance_dow_jones_risk_compliance_events",
        "query_dow_jones_risk_compliance_dow_jones_risk_compliance_audit_trail",
      ],
      evidence: [
        "source_system_record",
        "generated_audit_trail",
      ],
    },
  ],
  entities: [
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
      name: "eu_sanctions_records",
      sourceSystemId: "eu_sanctions",
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
      name: "eu_sanctions_events",
      sourceSystemId: "eu_sanctions",
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
          name: "eu_sanctions_record_id",
          type: "ref",
          ref: "eu_sanctions_records.id",
          required: true,
        },
      ],
    },
    {
      name: "eu_sanctions_audit_trail",
      sourceSystemId: "eu_sanctions",
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
      name: "dow_jones_risk_compliance_records",
      sourceSystemId: "dow_jones_risk_compliance",
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
      name: "dow_jones_risk_compliance_events",
      sourceSystemId: "dow_jones_risk_compliance",
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
          name: "dow_jones_risk_compliance_record_id",
          type: "ref",
          ref: "dow_jones_risk_compliance_records.id",
          required: true,
        },
      ],
    },
    {
      name: "dow_jones_risk_compliance_audit_trail",
      sourceSystemId: "dow_jones_risk_compliance",
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
      from: "ofac_sdn_events.ofac_sdn_record_id",
      to: "ofac_sdn_records.id",
      cardinality: "many-to-one",
      orphanPolicy: "none",
    },
    {
      from: "eu_sanctions_events.eu_sanctions_record_id",
      to: "eu_sanctions_records.id",
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
      from: "lexisnexis_events.lexisnexis_record_id",
      to: "lexisnexis_records.id",
      cardinality: "many-to-one",
      orphanPolicy: "none",
    },
    {
      from: "dow_jones_risk_compliance_events.dow_jones_risk_compliance_record_id",
      to: "dow_jones_risk_compliance_records.id",
      cardinality: "many-to-one",
      orphanPolicy: "none",
    },
  ],
  documents: [
    {
      id: "sanctions-watchlist-screener-policy-guide",
      sourceSystemId: "ofac_sdn",
      type: "policy",
      title: "Sanctions & Watchlist Screener Procurement Policy Guide",
      requiredSections: [
        "Sourcing principles",
        "Approval thresholds",
        "Supplier risk requirements",
        "Contract and compliance gates",
        "Exception handling",
      ],
      linkedEntities: [
        "ofac_sdn_records",
        "ofac_sdn_events",
        "ofac_sdn_audit_trail",
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
      id: "ofac_sdn_match_api",
      sourceSystemId: "ofac_sdn",
      method: "POST",
      path: "/api/ofac_sdn/match",
      description: "Synchronous endpoint the agent calls to match in OFAC/SDN after evidence gating.",
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
      id: "sanctions-watchlist-screener-baseline-gap",
      description: "Seed a realistic gap where False positive rate sits between 85% manual triage and 15% with LLM context, so the agent can detect, narrate, and recommend remediation.",
      affectedEntities: [
        "ofac_sdn_records",
        "ofac_sdn_events",
      ],
      discoveryPath: [
        "Inspect OFAC/SDN records for the affected entities",
        "Compare against EU Sanctions historical baseline",
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
      database: "sanctions_watchlist_screener",
      schemas: [
        "ofac_sdn",
        "eu_sanctions",
        "world_check",
        "lexisnexis",
        "dow_jones_risk_compliance",
      ],
    },
    bigquery: {
      dataset: "procurement_sanctions_watchlist_screener",
      tables: [
        "kpi_summary",
        "evidence_index",
      ],
    },
    cloudStorage: {
      bucketSuffix: "sanctions-watchlist-screener-evidence",
      prefixes: [
        "documents",
        "audit-trails",
        "exports",
      ],
    },
    apis: {
      serviceName: "sanctions-watchlist-screener-source-adapters",
      deploymentTarget: "cloud_run",
    },
  },
  validation: {
    smokePrompt: "Run the Sanctions & Watchlist Screener workflow and cite source-system evidence for every claim.",
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

export const SanctionsWatchlistScreener = () => (
  <UseCaseSlide
    title="Sanctions & Watchlist Screener"
    subtitle="A-1603 • Supplier Risk"
    icon={ShieldCheck}
    domainId="domain-16"
    layer="Layer 3: Custom ADK"
    persona="Compliance Manager"
    systems={["OFAC/SDN", "EU Sanctions", "World-Check", "LexisNexis", "Dow Jones Risk & Compliance"]}
    kpis={[
      { label: "False positive rate", before: "85% manual triage", after: "15% with LLM context" },
      { label: "Screening coverage", before: "New suppliers only", after: "Full vendor master daily" },
      { label: "Resolution time per match", before: "2-4 hours", after: "15 minutes" },
    ]}
    triggerType="event"
    swimlane={swimlane}
    flow={flow}
    architecture={architecture}
    hitl={{ actor: "Compliance Manager", action: "Review sanctions matches", description: "Compliance Manager reviews LLM-enriched match reports with entity context, confidence scoring, and recommended disposition before clearing or escalating." }}
    statusQuo={[
      "Sanctions screening generates hundreds of false positives — compliance team drowns in manual triage.",
      "Fuzzy matching can't distinguish between 47 'Mohammad Al-Hassan' entries across sanctions lists.",
      "Screening limited to onboarding — existing suppliers not continuously monitored against list updates."
    ]}
    agentification={[
      "Fuzzy name/alias matching across OFAC, EU, UN, and OFSI lists with configurable confidence thresholds.",
      "LLM resolves ambiguous matches using entity context — country, industry, associated entities, dates — to separate true hits from false positives.",
      "Distinguishes sanctions on the supplier entity vs. beneficial owner vs. board member, routing to appropriate escalation paths."
    ]}
  />
);
