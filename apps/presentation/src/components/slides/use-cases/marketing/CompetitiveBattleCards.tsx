import React from "react";
import { UseCaseSlide } from "../../../agent/UseCaseSlide";
import { FlowStep } from "../../../agent/ProcessFlow";
import { SwimlaneFlow } from "../../../agent/SwimlaneFlow";
import { AgentArchitecture, UseCaseGenerationSpec, AgentBehaviorContract} from "../../../../types/architecture";
import { Swords, Database, Headphones, PenTool, CheckCircle } from "lucide-react";

const swimlane: SwimlaneFlow = {
  nodes: [
    { id: "s1", label: "Competitive Deal", lane: "system", type: "trigger" },
    { id: "a1", label: "Intel Gathering", lane: "agent", type: "action" },
    { id: "a2", label: "Card Generation", lane: "agent", type: "action" },
    { id: "h1", label: "PMM Approves", lane: "human", type: "hitl" },
    { id: "a3", label: "Sales Enabled", lane: "agent", type: "output" },
  ],
  connections: [["s1", "a1"], ["a1", "a2"], ["a2", "h1"], ["h1", "a3"]],
};

const flow: FlowStep[] = [
  { label: "Competitive Signal", icon: Database, description: "Competitive deal flagged or monthly refresh cycle triggers battle card update.", trigger: "Event + Monthly", systems: ["Salesforce CRM", "Gong"] },
  { label: "Multi-Source Intel", icon: Headphones, description: "CRM data, call transcripts, G2 comparisons, and SEMrush positioning aggregated.", systems: ["G2", "SEMrush", "BigQuery"], integration: "ADK" },
  { label: "Battle Card Draft", icon: PenTool, description: "Contextual battle cards generated with win/loss patterns and counter-messaging.", systems: ["Vertex AI"] },
  { label: "PMM Approval", icon: CheckCircle, description: "Product Marketing Manager validates accuracy and approves for sales distribution.", output: "Competitive Battle Card" },
];

const architecture: AgentArchitecture = {
  connections: [
    { system: "Salesforce CRM", description: "Competitive deal flags, win/loss data, competitor mentions in opportunities", direction: "read", protocol: "REST API", category: "erp" },
    { system: "Gong", description: "Competitive call transcripts, objection patterns, buyer language analysis", direction: "read", protocol: "REST API", category: "analytics" },
    { system: "SEMrush", description: "Competitor positioning, keyword strategy, ad copy, content themes", direction: "read", protocol: "REST API", category: "market-data" },
    { system: "G2", description: "Head-to-head comparisons, feature ratings, user sentiment by category", direction: "read", protocol: "REST API", category: "market-data" },
    { system: "Vertex AI (Gemini)", description: "Battle card generation, counter-messaging, contextual guidance", direction: "bidirectional", protocol: "gRPC", category: "ai" },
    { system: "Highspot", description: "Battle card distribution, sales content management, usage tracking", direction: "write", protocol: "REST API", category: "collaboration" },
  ],
  pipeline: [
    { label: "Intelligence Collection", description: "Pull competitive data from CRM (competitor mentions, win/loss), Gong (competitive call analysis), SEMrush (competitor positioning and ad spend), and G2 (comparison data). Aggregate by competitor.", systems: ["Salesforce CRM", "Gong", "SEMrush", "G2"], layer: "integration", dataIn: "Competitive signals across systems", dataOut: "Competitor intelligence package" },
    { label: "Win/Loss Quantification", description: "Calculate competitive win rates by segment, deal size, and selling scenario. Identify statistically significant differentiators and vulnerability patterns.", systems: ["BigQuery ML"], layer: "ml", dataIn: "Competitive deal outcomes", dataOut: "Win/loss metrics by competitor and scenario" },
    { label: "Battle Card Generation", description: "Gemini generates contextual battle cards — not generic feature comparisons but sales-ready guidance. Includes specific objection handlers, competitive displacements to reference, and messaging angles that win based on actual deal data.", systems: ["Vertex AI (Gemini)"], layer: "llm", dataIn: "Intelligence package + win/loss metrics", dataOut: "Contextual battle card with win guidance" },
    { label: "Sales Distribution", description: "Publish approved battle cards to Highspot. Push competitive alerts to sales reps on active deals against that competitor. Track battle card usage and influence on outcomes.", systems: ["Highspot", "Salesforce CRM"], layer: "integration", dataIn: "Approved battle cards", dataOut: "Distributed to sales + usage tracking" },
  ],
};


const behaviorContract: AgentBehaviorContract = {
  role: "Product Marketing Mgr agent for the Competitive Battle Card Generator workflow",
  primaryObjective: "Gemini generates contextual battle cards with specific objection handlers grounded in Gong call analysis. LLM references actual competitive displacements and winning messaging angles from deal data. so the Product Marketing Mgr can move the Battle card freshness KPI.",
  inScope: [
    "Gemini generates contextual battle cards with specific objection handlers grounded in Gong call analysis",
    "LLM references actual competitive displacements and winning messaging angles from deal data",
    "Battle cards continuously refreshed as new competitive intelligence arrives, never stale",
  ],
  outOfScope: [
    "Final approval of paid spend reallocations above the governance threshold",
    "Trademark, legal, or regulated-industry claim approval",
    "Crisis communications without comms-team sign-off",
  ],
  toolIntents: [
    {
      name: "query_salesforce_crm_accounts",
      kind: "query",
      sourceSystemId: "salesforce_crm",
      description: "Retrieve accounts from Salesforce CRM for the Competitive Battle Card Generator workflow.",
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
      name: "query_gong_gong_records",
      kind: "query",
      sourceSystemId: "gong",
      description: "Retrieve gong records from Gong for the Competitive Battle Card Generator workflow.",
      requiredInputs: [
        "lookup_key",
        "date_range",
      ],
      produces: [
        "gong_records_records",
        "gong_records_summary",
      ],
      evidenceEmitted: [
        "source_system_record",
      ],
    },
    {
      name: "query_semrush_keyword_rankings",
      kind: "query",
      sourceSystemId: "semrush",
      description: "Retrieve keyword rankings from SEMrush for the Competitive Battle Card Generator workflow.",
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
      name: "query_g2_g2_records",
      kind: "query",
      sourceSystemId: "g2",
      description: "Retrieve g2 records from G2 for the Competitive Battle Card Generator workflow.",
      requiredInputs: [
        "lookup_key",
        "date_range",
      ],
      produces: [
        "g2_records_records",
        "g2_records_summary",
      ],
      evidenceEmitted: [
        "source_system_record",
      ],
    },
    {
      name: "lookup_competitive_battle_card_generator_playbook",
      kind: "evidence_lookup",
      sourceSystemId: "salesforce_crm",
      description: "Look up sections of the Competitive Battle Card Generator Playbook to cite in narrative output, escalation rationale, and audit evidence.",
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
      name: "action_salesforce_crm_generate",
      kind: "action",
      sourceSystemId: "salesforce_crm",
      description: "Execute the generate step in Salesforce CRM after the agent has gathered evidence and validated escalation gates.",
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
      claim: "Battle card freshness moved from Updated quarterly toward Continuously refreshed",
      mustCite: [
        "salesforce_crm.accounts",
        "gong.gong_records",
      ],
      sourceSystemIds: [
        "salesforce_crm",
        "gong",
      ],
    },
    {
      claim: "Sales adoption moved from 30% use battle cards toward 85% engagement",
      mustCite: [
        "salesforce_crm.accounts",
        "gong.gong_records",
      ],
      sourceSystemIds: [
        "salesforce_crm",
        "gong",
      ],
    },
  ],
  escalationRules: [
    {
      trigger: "Battle card freshness regresses past the Updated quarterly baseline by more than 20%",
      action: "escalate_to_human",
      handoffTarget: "Product Marketing Mgr",
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
    "Never fabricate metric values; only publish numbers derived from Salesforce CRM (and other named systems) entities.",
    "Never bypass Product Marketing Mgr approval on escalation triggers, even when confidence is high.",
    "Never expose individual personal data (PII) in summaries; aggregate or pseudonymise before output.",
    "Never act on data older than the staleness threshold defined in the runbook without a fresh re-query.",
  ],
  goldenEvals: [
    {
      id: "competitive-battle-card-generator-end-to-end",
      prompt: "Run the Competitive Battle Card Generator workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.",
      expectedToolCalls: [
        "query_salesforce_crm_accounts",
        "query_gong_gong_records",
        "query_semrush_keyword_rankings",
        "query_g2_g2_records",
        "lookup_competitive_battle_card_generator_playbook",
        "action_salesforce_crm_generate",
      ],
      mustReferenceEntities: [
        "accounts",
        "gong_records",
        "keyword_rankings",
        "g2_records",
        "highspot_records",
      ],
      mustCiteDocuments: [
        "competitive-battle-card-generator-playbook",
      ],
      expectedActionOutcome: "Action generate executed against Salesforce CRM, with audit-trail entry and Product Marketing Mgr notified of outcomes.",
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
    rationale: "Row counts sized for Competitive Battle Card Generator so the agent can demonstrate the workflow against realistic transactional volume without simulating a production warehouse.",
  },
  sourceSystems: [
    {
      id: "salesforce_crm",
      name: "Salesforce CRM",
      owns: [
        "accounts",
        "opportunities",
        "campaign_influence",
      ],
      protocol: "REST API",
      localBacking: [
        "alloydb",
      ],
      toolNames: [
        "query_salesforce_crm_accounts",
        "query_salesforce_crm_opportunities",
        "query_salesforce_crm_campaign_influence",
      ],
      evidence: [
        "source_system_record",
        "generated_audit_trail",
      ],
    },
    {
      id: "gong",
      name: "Gong",
      owns: [
        "gong_records",
        "gong_events",
        "gong_audit_trail",
      ],
      protocol: "REST API",
      localBacking: [
        "alloydb",
      ],
      toolNames: [
        "query_gong_gong_records",
        "query_gong_gong_events",
        "query_gong_gong_audit_trail",
      ],
      evidence: [
        "source_system_record",
        "generated_audit_trail",
      ],
    },
    {
      id: "semrush",
      name: "SEMrush",
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
        "query_semrush_keyword_rankings",
        "query_semrush_backlink_profile",
        "query_semrush_competitor_data",
      ],
      evidence: [
        "source_system_record",
        "generated_audit_trail",
      ],
    },
    {
      id: "g2",
      name: "G2",
      owns: [
        "g2_records",
        "g2_events",
        "g2_audit_trail",
      ],
      protocol: "REST API",
      localBacking: [
        "alloydb",
      ],
      toolNames: [
        "query_g2_g2_records",
        "query_g2_g2_events",
        "query_g2_g2_audit_trail",
      ],
      evidence: [
        "source_system_record",
        "generated_audit_trail",
      ],
    },
    {
      id: "highspot",
      name: "Highspot",
      owns: [
        "highspot_records",
        "highspot_events",
        "highspot_audit_trail",
      ],
      protocol: "REST API",
      localBacking: [
        "alloydb",
      ],
      toolNames: [
        "query_highspot_highspot_records",
        "query_highspot_highspot_events",
        "query_highspot_highspot_audit_trail",
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
      sourceSystemId: "salesforce_crm",
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
      name: "opportunities",
      sourceSystemId: "salesforce_crm",
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
      name: "campaign_influence",
      sourceSystemId: "salesforce_crm",
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
          type: "lorem.sentence",
          required: true,
        },
        {
          name: "channel",
          type: "enum",
          values: [
            "email",
            "social",
            "search",
            "display",
            "content",
            "events",
          ],
          required: true,
        },
        {
          name: "segment",
          type: "enum",
          values: [
            "enterprise",
            "mid_market",
            "smb",
          ],
          required: true,
        },
        {
          name: "impressions",
          type: "number",
          min: 1000,
          max: 500000,
          required: true,
        },
        {
          name: "conversions",
          type: "number",
          min: 0,
          max: 5000,
          required: true,
        },
        {
          name: "spend",
          type: "number",
          min: 1000,
          max: 200000,
          required: true,
        },
        {
          name: "ctr",
          type: "float",
          min: 0.1,
          max: 9.5,
          decimals: 2,
          required: true,
        },
        {
          name: "launched_on",
          type: "date",
          required: true,
        },
      ],
    },
    {
      name: "gong_records",
      sourceSystemId: "gong",
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
      name: "gong_events",
      sourceSystemId: "gong",
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
          name: "gong_record_id",
          type: "ref",
          ref: "gong_records.id",
          required: true,
        },
      ],
    },
    {
      name: "gong_audit_trail",
      sourceSystemId: "gong",
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
      sourceSystemId: "semrush",
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
      sourceSystemId: "semrush",
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
      sourceSystemId: "semrush",
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
      name: "g2_records",
      sourceSystemId: "g2",
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
      name: "g2_events",
      sourceSystemId: "g2",
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
          name: "g2_record_id",
          type: "ref",
          ref: "g2_records.id",
          required: true,
        },
      ],
    },
    {
      name: "g2_audit_trail",
      sourceSystemId: "g2",
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
      name: "highspot_records",
      sourceSystemId: "highspot",
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
      name: "highspot_events",
      sourceSystemId: "highspot",
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
          name: "highspot_record_id",
          type: "ref",
          ref: "highspot_records.id",
          required: true,
        },
      ],
    },
    {
      name: "highspot_audit_trail",
      sourceSystemId: "highspot",
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
      from: "gong_events.gong_record_id",
      to: "gong_records.id",
      cardinality: "many-to-one",
      orphanPolicy: "none",
    },
    {
      from: "g2_events.g2_record_id",
      to: "g2_records.id",
      cardinality: "many-to-one",
      orphanPolicy: "none",
    },
    {
      from: "highspot_events.highspot_record_id",
      to: "highspot_records.id",
      cardinality: "many-to-one",
      orphanPolicy: "none",
    },
  ],
  documents: [
    {
      id: "competitive-battle-card-generator-playbook",
      sourceSystemId: "salesforce_crm",
      type: "playbook",
      title: "Competitive Battle Card Generator Playbook",
      requiredSections: [
        "Audience guidelines",
        "Brand voice rules",
        "Channel-specific guardrails",
        "Measurement framework",
        "Approval thresholds",
      ],
      linkedEntities: [
        "accounts",
        "opportunities",
        "campaign_influence",
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
      id: "salesforce_crm_generate_api",
      sourceSystemId: "salesforce_crm",
      method: "POST",
      path: "/api/salesforce_crm/generate",
      description: "Synchronous endpoint the agent calls to generate in Salesforce CRM after evidence gating.",
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
      id: "competitive-battle-card-generator-baseline-gap",
      description: "Seed a realistic gap where Battle card freshness sits between Updated quarterly and Continuously refreshed, so the agent can detect, narrate, and recommend remediation.",
      affectedEntities: [
        "accounts",
        "opportunities",
      ],
      discoveryPath: [
        "Inspect Salesforce CRM records for the affected entities",
        "Compare against Gong historical baseline",
        "Generate a citation-backed recommendation",
      ],
      expectedEvidence: [
        "source-system record",
        "historical baseline metric",
        "generated audit trail",
      ],
      expectedRecommendation: "Explain the gap, cite supporting evidence, and propose the next Product Marketing Mgr action.",
    },
  ],
  datastorePackaging: {
    alloydb: {
      database: "competitive_battle_card_generator",
      schemas: [
        "salesforce_crm",
        "gong",
        "semrush",
        "g2",
        "highspot",
      ],
    },
    bigquery: {
      dataset: "marketing_competitive_battle_card_generator",
      tables: [
        "kpi_summary",
        "evidence_index",
      ],
    },
    cloudStorage: {
      bucketSuffix: "competitive-battle-card-generator-evidence",
      prefixes: [
        "documents",
        "audit-trails",
        "exports",
      ],
    },
    apis: {
      serviceName: "competitive-battle-card-generator-source-adapters",
      deploymentTarget: "cloud_run",
    },
  },
  validation: {
    smokePrompt: "Run the Competitive Battle Card Generator workflow and cite source-system evidence for every claim.",
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

export const CompetitiveBattleCards = () => (
  <UseCaseSlide
    title="Competitive Battle Card Generator"
    subtitle="A-3705 • Customer & Market Intelligence"
    icon={Swords}
    domainId="domain-37"
    layer="Layer 1: OOTB"
    persona="Product Marketing Mgr"
    systems={["Salesforce CRM", "Gong", "SEMrush", "G2", "Vertex AI", "Highspot"]}
    kpis={[
      { label: "Battle card freshness", before: "Updated quarterly", after: "Continuously refreshed" },
      { label: "Sales adoption", before: "30% use battle cards", after: "85% engagement" },
      { label: "Competitive win rate", before: "Flat baseline", after: "+12 pts with cards" },
    ]}
    triggerType="event"
    swimlane={swimlane}
    flow={flow}
    architecture={architecture}
    hitl={{ actor: "Product Marketing Mgr", action: "Approve battle card", description: "PMM validates competitive accuracy, approves messaging angles, and authorizes distribution to sales team." }}
    statusQuo={[
      "Battle cards updated quarterly with stale competitive data — outdated by the time sales uses them.",
      "Generic feature comparison format that doesn't tell reps how to actually win the deal.",
      "Sales adoption low because cards don't address the specific objections reps hear."
    ]}
    agentification={[
      "Gemini generates contextual battle cards with specific objection handlers grounded in Gong call analysis.",
      "LLM references actual competitive displacements and winning messaging angles from deal data.",
      "Battle cards continuously refreshed as new competitive intelligence arrives, never stale."
    ]}
  />
);
