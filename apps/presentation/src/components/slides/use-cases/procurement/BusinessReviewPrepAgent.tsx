import React from "react";
import { UseCaseSlide } from "../../../agent/UseCaseSlide";
import { FlowStep } from "../../../agent/ProcessFlow";
import { SwimlaneFlow } from "../../../agent/SwimlaneFlow";
import { AgentArchitecture, UseCaseGenerationSpec, AgentBehaviorContract} from "../../../../types/architecture";
import { Presentation, Database, MessageSquareText, FileSliders, Monitor } from "lucide-react";

const swimlane: SwimlaneFlow = {
  nodes: [
    { id: "s1", label: "Pre-QBR Trigger", lane: "system", type: "trigger" },
    { id: "a1", label: "Data Synthesis", lane: "agent", type: "action" },
    { id: "a2", label: "Narrative Draft", lane: "agent", type: "action" },
    { id: "a3", label: "Slide Generation", lane: "agent", type: "output" },
    { id: "s2", label: "Google Slides", lane: "system", type: "output" },
  ],
  connections: [["s1", "a1"], ["a1", "a2"], ["a2", "a3"], ["a3", "s2"]],
};

const flow: FlowStep[] = [
  { label: "Data Assembly", icon: Database, description: "Scorecard data, open action items from previous QBRs, contract performance, and market context aggregated.", trigger: "Pre-QBR/SBR", systems: ["Scorecard Data", "Contract Data"] },
  { label: "Narrative Synthesis", icon: MessageSquareText, description: "LLM synthesizes data into compelling talking points with anticipated supplier counterarguments.", systems: ["Vertex AI", "Market Intel"] },
  { label: "Slide Composition", icon: FileSliders, description: "Full QBR deck generated with trend visualizations, action item tracking, and negotiation context.", systems: ["Vertex AI", "Google Slides"] },
  { label: "Review Ready", icon: Monitor, description: "Complete presentation delivered to SRM team with prepared responses and discussion guides.", output: "QBR Deck" },
];

const architecture: AgentArchitecture = {
  connections: [
    { system: "Scorecard Data", description: "Supplier performance scorecards, KPI trends, peer benchmarks", direction: "read", protocol: "REST API", category: "analytics" },
    { system: "Contract Data", description: "Contract terms, pricing formulas, utilization metrics, SLA performance", direction: "read", protocol: "REST API", category: "clm" },
    { system: "Market Intelligence", description: "Commodity price trends, market conditions, supplier financial signals", direction: "read", protocol: "REST API", category: "market-data" },
    { system: "Vertex AI (Gemini)", description: "Presentation narrative synthesis, talking point generation, counterargument preparation", direction: "bidirectional", protocol: "gRPC", category: "ai" },
    { system: "Google Slides", description: "QBR deck generation with trend visualizations and narrative", direction: "write", protocol: "Workspace API", category: "collaboration" },
  ],
  pipeline: [
    { label: "QBR Data Assembly", description: "Pull scorecard data, open action items from previous 3 QBRs, contract performance metrics, and current market conditions. Aggregate into a unified review context.", systems: ["Scorecard Data", "Contract Data", "Market Intelligence"], layer: "integration", dataIn: "Scorecards + prior QBR action items + contract terms + market data", dataOut: "Unified QBR context package" },
    { label: "Trend Visualization & Action Tracking", description: "Generate trend visualizations on KPI trajectories, compute contract utilization metrics, and track action item aging from previous reviews.", systems: ["Scorecard Data", "Contract Data"], layer: "ml", dataIn: "QBR context package", dataOut: "Trend charts + action item status + contract utilization" },
    { label: "Narrative Synthesis & Counterargument Prep", description: "Gemini synthesizes all data into a compelling presentation narrative. Drafts talking points: 'Open with the positive — OTIF improved 4 points. Then address pricing: raw material costs dropped 8% since last negotiation — we should see pass-through savings per the contract formula.' Anticipates supplier counterarguments and prepares responses.", systems: ["Vertex AI (Gemini)", "Google Slides"], layer: "llm", dataIn: "Trend data + action items + market context", dataOut: "Complete QBR deck with strategic narrative and prepared responses" },
  ],
};


const behaviorContract: AgentBehaviorContract = {
  role: "Supplier Relationship Manager agent for the Business Review Prep Agent workflow",
  primaryObjective: "LLM synthesizes scorecard data, 3 prior QBR action items, contract performance, and market conditions into a compelling presentation narrative. Drafts strategic talking points: 'Open with the positive — OTIF improved 4 points. Then address pricing: raw material costs dropped 8% since last negotiation — we should see pass-through savings per the contract formula.' so the Supplier Relationship Manager can move the QBR prep time KPI.",
  inScope: [
    "LLM synthesizes scorecard data, 3 prior QBR action items, contract performance, and market conditions into a compelling presentation narrative",
    "Drafts strategic talking points: 'Open with the positive — OTIF improved 4 points. Then address pricing: raw material costs dropped 8% since last negotiation — we should see pass-through savings per the contract formula.'",
    "Anticipates supplier counterarguments and prepares responses — generates the full slide deck narrative, not just data charts",
  ],
  outOfScope: [
    "Contract execution without legal review",
    "Supplier disqualification decisions (category lead retains authority)",
    "Single-source justification overrides above policy threshold",
  ],
  toolIntents: [
    {
      name: "query_scorecard_data_scorecard_data_records",
      kind: "query",
      sourceSystemId: "scorecard_data",
      description: "Retrieve scorecard data records from Scorecard Data for the Business Review Prep Agent workflow.",
      requiredInputs: [
        "lookup_key",
        "date_range",
      ],
      produces: [
        "scorecard_data_records_records",
        "scorecard_data_records_summary",
      ],
      evidenceEmitted: [
        "source_system_record",
      ],
    },
    {
      name: "query_contract_data_contract_data_records",
      kind: "query",
      sourceSystemId: "contract_data",
      description: "Retrieve contract data records from Contract Data for the Business Review Prep Agent workflow.",
      requiredInputs: [
        "lookup_key",
        "date_range",
      ],
      produces: [
        "contract_data_records_records",
        "contract_data_records_summary",
      ],
      evidenceEmitted: [
        "source_system_record",
      ],
    },
    {
      name: "query_market_intelligence_market_intelligence_records",
      kind: "query",
      sourceSystemId: "market_intelligence",
      description: "Retrieve market intelligence records from Market Intelligence for the Business Review Prep Agent workflow.",
      requiredInputs: [
        "lookup_key",
        "date_range",
      ],
      produces: [
        "market_intelligence_records_records",
        "market_intelligence_records_summary",
      ],
      evidenceEmitted: [
        "source_system_record",
      ],
    },
    {
      name: "query_google_slides_presentations",
      kind: "query",
      sourceSystemId: "google_slides",
      description: "Retrieve presentations from Google Slides for the Business Review Prep Agent workflow.",
      requiredInputs: [
        "lookup_key",
        "date_range",
      ],
      produces: [
        "presentations_records",
        "presentations_summary",
      ],
      evidenceEmitted: [
        "source_system_record",
      ],
    },
    {
      name: "lookup_business_review_prep_agent_policy_guide",
      kind: "evidence_lookup",
      sourceSystemId: "google_slides",
      description: "Look up sections of the Business Review Prep Agent Procurement Policy Guide to cite in narrative output, escalation rationale, and audit evidence.",
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
      name: "action_scorecard_data_generate",
      kind: "action",
      sourceSystemId: "scorecard_data",
      description: "Execute the generate step in Scorecard Data after the agent has gathered evidence and validated escalation gates.",
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
      claim: "QBR prep time moved from 8-12 hours manual toward 30 minutes review",
      mustCite: [
        "scorecard_data.scorecard_data_records",
        "contract_data.contract_data_records",
      ],
      sourceSystemIds: [
        "scorecard_data",
        "contract_data",
      ],
    },
    {
      claim: "Talking point quality moved from Data charts only toward Strategic narrative",
      mustCite: [
        "scorecard_data.scorecard_data_records",
        "contract_data.contract_data_records",
      ],
      sourceSystemIds: [
        "scorecard_data",
        "contract_data",
      ],
    },
  ],
  escalationRules: [
    {
      trigger: "QBR prep time regresses past the 8-12 hours manual baseline by more than 20%",
      action: "escalate_to_human",
      handoffTarget: "Supplier Relationship Manager",
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
    "Never fabricate metric values; only publish numbers derived from Scorecard Data (and other named systems) entities.",
    "Never bypass Supplier Relationship Manager approval on escalation triggers, even when confidence is high.",
    "Never expose individual personal data (PII) in summaries; aggregate or pseudonymise before output.",
    "Never act on data older than the staleness threshold defined in the runbook without a fresh re-query.",
  ],
  goldenEvals: [
    {
      id: "business-review-prep-agent-end-to-end",
      prompt: "Run the Business Review Prep Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.",
      expectedToolCalls: [
        "query_scorecard_data_scorecard_data_records",
        "query_contract_data_contract_data_records",
        "query_market_intelligence_market_intelligence_records",
        "query_google_slides_presentations",
        "lookup_business_review_prep_agent_policy_guide",
        "action_scorecard_data_generate",
      ],
      mustReferenceEntities: [
        "scorecard_data_records",
        "contract_data_records",
        "market_intelligence_records",
        "presentations",
      ],
      mustCiteDocuments: [
        "business-review-prep-agent-policy-guide",
      ],
      expectedActionOutcome: "Action generate executed against Scorecard Data, with audit-trail entry and Supplier Relationship Manager notified of outcomes.",
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
    rationale: "Row counts sized for Business Review Prep Agent so the agent can demonstrate the workflow against realistic transactional volume without simulating a production warehouse.",
  },
  sourceSystems: [
    {
      id: "scorecard_data",
      name: "Scorecard Data",
      owns: [
        "scorecard_data_records",
        "scorecard_data_events",
        "scorecard_data_audit_trail",
      ],
      protocol: "REST API",
      localBacking: [
        "alloydb",
      ],
      toolNames: [
        "query_scorecard_data_scorecard_data_records",
        "query_scorecard_data_scorecard_data_events",
        "query_scorecard_data_scorecard_data_audit_trail",
      ],
      evidence: [
        "source_system_record",
        "generated_audit_trail",
      ],
    },
    {
      id: "contract_data",
      name: "Contract Data",
      owns: [
        "contract_data_records",
        "contract_data_events",
        "contract_data_audit_trail",
      ],
      protocol: "REST API",
      localBacking: [
        "alloydb",
      ],
      toolNames: [
        "query_contract_data_contract_data_records",
        "query_contract_data_contract_data_events",
        "query_contract_data_contract_data_audit_trail",
      ],
      evidence: [
        "source_system_record",
        "generated_audit_trail",
      ],
    },
    {
      id: "market_intelligence",
      name: "Market Intelligence",
      owns: [
        "market_intelligence_records",
        "market_intelligence_events",
        "market_intelligence_audit_trail",
      ],
      protocol: "REST API",
      localBacking: [
        "alloydb",
      ],
      toolNames: [
        "query_market_intelligence_market_intelligence_records",
        "query_market_intelligence_market_intelligence_events",
        "query_market_intelligence_market_intelligence_audit_trail",
      ],
      evidence: [
        "source_system_record",
        "generated_audit_trail",
      ],
    },
    {
      id: "google_slides",
      name: "Google Slides",
      owns: [
        "presentations",
        "slide_assets",
        "view_logs",
      ],
      protocol: "Workspace API",
      localBacking: [
        "cloud-storage",
      ],
      toolNames: [
        "query_google_slides_presentations",
        "query_google_slides_slide_assets",
        "query_google_slides_view_logs",
      ],
      evidence: [
        "source_system_record",
        "generated_audit_trail",
      ],
    },
  ],
  entities: [
    {
      name: "scorecard_data_records",
      sourceSystemId: "scorecard_data",
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
      name: "scorecard_data_events",
      sourceSystemId: "scorecard_data",
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
          name: "scorecard_data_record_id",
          type: "ref",
          ref: "scorecard_data_records.id",
          required: true,
        },
      ],
    },
    {
      name: "scorecard_data_audit_trail",
      sourceSystemId: "scorecard_data",
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
      name: "contract_data_records",
      sourceSystemId: "contract_data",
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
          name: "counterparty",
          type: "company.name",
          required: true,
        },
        {
          name: "value",
          type: "number",
          min: 10000,
          max: 5000000,
          required: true,
        },
        {
          name: "currency",
          type: "enum",
          values: [
            "USD",
            "EUR",
            "GBP",
          ],
          required: true,
        },
        {
          name: "start_date",
          type: "date",
          required: true,
        },
        {
          name: "end_date",
          type: "date",
          required: true,
        },
        {
          name: "status",
          type: "enum",
          values: [
            "draft",
            "negotiating",
            "active",
            "expired",
            "terminated",
          ],
          required: true,
        },
        {
          name: "auto_renew",
          type: "boolean",
          trueRate: 0.4,
        },
      ],
    },
    {
      name: "contract_data_events",
      sourceSystemId: "contract_data",
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
          name: "counterparty",
          type: "company.name",
          required: true,
        },
        {
          name: "value",
          type: "number",
          min: 10000,
          max: 5000000,
          required: true,
        },
        {
          name: "currency",
          type: "enum",
          values: [
            "USD",
            "EUR",
            "GBP",
          ],
          required: true,
        },
        {
          name: "start_date",
          type: "date",
          required: true,
        },
        {
          name: "end_date",
          type: "date",
          required: true,
        },
        {
          name: "status",
          type: "enum",
          values: [
            "draft",
            "negotiating",
            "active",
            "expired",
            "terminated",
          ],
          required: true,
        },
        {
          name: "auto_renew",
          type: "boolean",
          trueRate: 0.4,
        },
        {
          name: "contract_data_record_id",
          type: "ref",
          ref: "contract_data_records.id",
          required: true,
        },
      ],
    },
    {
      name: "contract_data_audit_trail",
      sourceSystemId: "contract_data",
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
          name: "counterparty",
          type: "company.name",
          required: true,
        },
        {
          name: "value",
          type: "number",
          min: 10000,
          max: 5000000,
          required: true,
        },
        {
          name: "currency",
          type: "enum",
          values: [
            "USD",
            "EUR",
            "GBP",
          ],
          required: true,
        },
        {
          name: "start_date",
          type: "date",
          required: true,
        },
        {
          name: "end_date",
          type: "date",
          required: true,
        },
        {
          name: "status",
          type: "enum",
          values: [
            "draft",
            "negotiating",
            "active",
            "expired",
            "terminated",
          ],
          required: true,
        },
        {
          name: "auto_renew",
          type: "boolean",
          trueRate: 0.4,
        },
      ],
    },
    {
      name: "market_intelligence_records",
      sourceSystemId: "market_intelligence",
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
      name: "market_intelligence_events",
      sourceSystemId: "market_intelligence",
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
          name: "market_intelligence_record_id",
          type: "ref",
          ref: "market_intelligence_records.id",
          required: true,
        },
      ],
    },
    {
      name: "market_intelligence_audit_trail",
      sourceSystemId: "market_intelligence",
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
      name: "presentations",
      sourceSystemId: "google_slides",
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
          name: "owner",
          type: "person.fullName",
          required: true,
        },
        {
          name: "status",
          type: "enum",
          values: [
            "draft",
            "review",
            "published",
            "archived",
          ],
          required: true,
        },
        {
          name: "last_updated",
          type: "date",
          required: true,
        },
      ],
    },
    {
      name: "slide_assets",
      sourceSystemId: "google_slides",
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
      name: "view_logs",
      sourceSystemId: "google_slides",
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
          name: "presentation_id",
          type: "ref",
          ref: "presentations.id",
          required: true,
        },
      ],
    },
  ],
  relationships: [
    {
      from: "scorecard_data_events.scorecard_data_record_id",
      to: "scorecard_data_records.id",
      cardinality: "many-to-one",
      orphanPolicy: "none",
    },
    {
      from: "contract_data_events.contract_data_record_id",
      to: "contract_data_records.id",
      cardinality: "many-to-one",
      orphanPolicy: "none",
    },
    {
      from: "market_intelligence_events.market_intelligence_record_id",
      to: "market_intelligence_records.id",
      cardinality: "many-to-one",
      orphanPolicy: "none",
    },
    {
      from: "view_logs.presentation_id",
      to: "presentations.id",
      cardinality: "many-to-one",
      orphanPolicy: "none",
    },
  ],
  documents: [
    {
      id: "business-review-prep-agent-policy-guide",
      sourceSystemId: "scorecard_data",
      type: "policy",
      title: "Business Review Prep Agent Procurement Policy Guide",
      requiredSections: [
        "Sourcing principles",
        "Approval thresholds",
        "Supplier risk requirements",
        "Contract and compliance gates",
        "Exception handling",
      ],
      linkedEntities: [
        "scorecard_data_records",
        "scorecard_data_events",
        "scorecard_data_audit_trail",
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
      id: "scorecard_data_generate_api",
      sourceSystemId: "scorecard_data",
      method: "POST",
      path: "/api/scorecard_data/generate",
      description: "Synchronous endpoint the agent calls to generate in Scorecard Data after evidence gating.",
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
      id: "business-review-prep-agent-baseline-gap",
      description: "Seed a realistic gap where QBR prep time sits between 8-12 hours manual and 30 minutes review, so the agent can detect, narrate, and recommend remediation.",
      affectedEntities: [
        "scorecard_data_records",
        "scorecard_data_events",
      ],
      discoveryPath: [
        "Inspect Scorecard Data records for the affected entities",
        "Compare against Contract Data historical baseline",
        "Generate a citation-backed recommendation",
      ],
      expectedEvidence: [
        "source-system record",
        "historical baseline metric",
        "generated audit trail",
      ],
      expectedRecommendation: "Explain the gap, cite supporting evidence, and propose the next Supplier Relationship Manager action.",
    },
  ],
  datastorePackaging: {
    alloydb: {
      database: "business_review_prep_agent",
      schemas: [
        "scorecard_data",
        "contract_data",
        "market_intelligence",
        "google_slides",
      ],
    },
    bigquery: {
      dataset: "procurement_business_review_prep_agent",
      tables: [
        "kpi_summary",
        "evidence_index",
      ],
    },
    cloudStorage: {
      bucketSuffix: "business-review-prep-agent-evidence",
      prefixes: [
        "documents",
        "audit-trails",
        "exports",
      ],
    },
    apis: {
      serviceName: "business-review-prep-agent-source-adapters",
      deploymentTarget: "cloud_run",
    },
  },
  validation: {
    smokePrompt: "Run the Business Review Prep Agent workflow and cite source-system evidence for every claim.",
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

export const BusinessReviewPrepAgent = () => (
  <UseCaseSlide
    title="Business Review Prep Agent"
    subtitle="A-1704 • Supplier Performance"
    icon={Presentation}
    domainId="domain-17"
    layer="Layer 1: OOTB"
    persona="Supplier Relationship Manager"
    systems={["Scorecard Data", "Contract Data", "Market Intelligence", "Vertex AI", "Google Slides"]}
    kpis={[
      { label: "QBR prep time", before: "8-12 hours manual", after: "30 minutes review" },
      { label: "Talking point quality", before: "Data charts only", after: "Strategic narrative" },
      { label: "Counterargument prep", before: "None / ad hoc", after: "Anticipated & drafted" },
    ]}
    triggerType="scheduled"
    swimlane={swimlane}
    flow={flow}
    architecture={architecture}
    statusQuo={[
      "QBR decks assembled manually by copying scorecard charts into PowerPoint — 8+ hours per supplier review.",
      "Talking points are improvised in the meeting — no prepared responses to supplier counterarguments.",
      "Action items from previous QBRs tracked in scattered emails and notes, often lost between reviews."
    ]}
    agentification={[
      "LLM synthesizes scorecard data, 3 prior QBR action items, contract performance, and market conditions into a compelling presentation narrative.",
      "Drafts strategic talking points: 'Open with the positive — OTIF improved 4 points. Then address pricing: raw material costs dropped 8% since last negotiation — we should see pass-through savings per the contract formula.'",
      "Anticipates supplier counterarguments and prepares responses — generates the full slide deck narrative, not just data charts."
    ]}
  />
);
