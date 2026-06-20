import React from "react";
import { UseCaseSlide } from "../../../agent/UseCaseSlide";
import { FlowStep } from "../../../agent/ProcessFlow";
import { SwimlaneFlow } from "../../../agent/SwimlaneFlow";
import { AgentArchitecture, UseCaseGenerationSpec, AgentBehaviorContract} from "../../../../types/architecture";
import { Network, FileInput, GitBranch, Search, FileOutput } from "lucide-react";

const swimlane: SwimlaneFlow = {
  nodes: [
    { id: "s1", label: "New Amendment/SOW", lane: "system", type: "trigger" },
    { id: "a1", label: "Graph Update", lane: "agent", type: "action" },
    { id: "a2", label: "Lineage Validation", lane: "agent", type: "action" },
    { id: "a3", label: "Conflict Detection", lane: "agent", type: "action" },
    { id: "a4", label: "Hierarchy Map", lane: "agent", type: "output" },
  ],
  connections: [["s1", "a1"], ["a1", "a2"], ["a2", "a3"], ["a3", "a4"]],
};

const flow: FlowStep[] = [
  { label: "Document Ingest", icon: FileInput, description: "New amendment, SOW, or change order received and linked to parent agreement.", trigger: "Event", systems: ["Icertis", "DocuSign CLM"] },
  { label: "Graph Construction", icon: GitBranch, description: "Knowledge graph updated: MSA → SOW → amendments → change orders → POs with lineage validation.", systems: ["BigQuery", "SAP Ariba"] },
  { label: "Conflict Resolution", icon: Search, description: "LLM resolves inheritance ambiguity — determines which terms govern when MSA and SOW conflict.", systems: ["Vertex AI"], integration: "ADK" },
  { label: "Hierarchy Output", icon: FileOutput, description: "Visual hierarchy map with conflict alerts, orphan PO detection, and scope creep warnings.", output: "Agreement Map" },
];

const architecture: AgentArchitecture = {
  connections: [
    { system: "Icertis", description: "MSA, SOW, amendment, and change order documents with lineage", direction: "bidirectional", protocol: "REST API", category: "clm" },
    { system: "DocuSign CLM", description: "Document relationships, version history, amendment tracking", direction: "bidirectional", protocol: "REST API", category: "clm" },
    { system: "SAP Ariba", description: "PO-to-contract linkage, purchase order validation against parent agreements", direction: "read", protocol: "REST API", category: "erp" },
    { system: "BigQuery", description: "Knowledge graph storage, lineage tracking, orphan detection analytics", direction: "bidirectional", protocol: "BigQuery SQL", category: "analytics" },
    { system: "Vertex AI (Gemini)", description: "Inheritance ambiguity resolution, scope creep detection, conflict analysis", direction: "bidirectional", protocol: "gRPC", category: "ai" },
  ],
  pipeline: [
    { label: "Document Ingestion & Linking", description: "Receive new amendment, SOW, or change order. Link to parent agreement in CLM. Update relationship graph in BigQuery: MSA to SOW to amendments to change orders to POs. Validate linkages on each new document.", systems: ["Icertis", "DocuSign CLM", "SAP Ariba"], layer: "integration", dataIn: "New amendment/SOW/change order", dataOut: "Updated agreement relationship graph" },
    { label: "Graph Analytics & Orphan Detection", description: "Knowledge graph construction with lineage tracking. Detect orphan POs without valid parent agreements. Identify POs referencing expired or incorrect contracts. Track graph completeness metrics.", systems: ["BigQuery"], layer: "ml", dataIn: "Agreement relationship graph + PO data", dataOut: "Orphan alerts + lineage validation results" },
    { label: "Conflict & Scope Resolution", description: "Gemini reads amendments and determines scope — 'Amendment 5 updates Exhibit B pricing but states all other terms unchanged, confirming Amendments 3 and 4 still effective.' Resolves inheritance ambiguity when MSA and SOW conflict on terms. Detects when change orders create new scope that should be a separate SOW.", systems: ["Vertex AI (Gemini)"], layer: "llm", dataIn: "Amendment text + hierarchy graph + term conflicts", dataOut: "Hierarchy map with conflict alerts and scope creep warnings" },
  ],
};


const behaviorContract: AgentBehaviorContract = {
  role: "Contract Manager agent for the Agreement Hierarchy Tracker workflow",
  primaryObjective: "Gemini maintains a knowledge graph of agreement relationships — MSA → SOW → amendments → change orders → POs — updated in real time. LLM resolves inheritance ambiguity: 'Amendment 5 updates Exhibit B pricing but states all other terms unchanged — confirms Amendments 3 and 4 still effective.' so the Contract Manager can move the Orphan POs detected KPI.",
  inScope: [
    "Gemini maintains a knowledge graph of agreement relationships — MSA → SOW → amendments → change orders → POs — updated in real time",
    "LLM resolves inheritance ambiguity: 'Amendment 5 updates Exhibit B pricing but states all other terms unchanged — confirms Amendments 3 and 4 still effective.'",
    "Detects when change orders effectively create new scope that should be a separate SOW, preventing scope creep through amendments",
  ],
  outOfScope: [
    "Contract execution without legal review",
    "Supplier disqualification decisions (category lead retains authority)",
    "Single-source justification overrides above policy threshold",
  ],
  toolIntents: [
    {
      name: "query_icertis_contracts",
      kind: "query",
      sourceSystemId: "icertis",
      description: "Retrieve contracts from Icertis for the Agreement Hierarchy Tracker workflow.",
      requiredInputs: [
        "lookup_key",
        "date_range",
      ],
      produces: [
        "contracts_records",
        "contracts_summary",
      ],
      evidenceEmitted: [
        "source_system_record",
      ],
    },
    {
      name: "query_docusign_clm_contracts",
      kind: "query",
      sourceSystemId: "docusign_clm",
      description: "Retrieve contracts from DocuSign CLM for the Agreement Hierarchy Tracker workflow.",
      requiredInputs: [
        "lookup_key",
        "date_range",
      ],
      produces: [
        "contracts_records",
        "contracts_summary",
      ],
      evidenceEmitted: [
        "source_system_record",
      ],
    },
    {
      name: "query_sap_ariba_suppliers",
      kind: "query",
      sourceSystemId: "sap_ariba",
      description: "Retrieve suppliers from SAP Ariba for the Agreement Hierarchy Tracker workflow.",
      requiredInputs: [
        "lookup_key",
        "date_range",
      ],
      produces: [
        "suppliers_records",
        "suppliers_summary",
      ],
      evidenceEmitted: [
        "source_system_record",
      ],
    },
    {
      name: "query_bigquery_analytics_events",
      kind: "query",
      sourceSystemId: "bigquery",
      description: "Retrieve analytics events from BigQuery for the Agreement Hierarchy Tracker workflow.",
      requiredInputs: [
        "lookup_key",
        "date_range",
      ],
      produces: [
        "analytics_events_records",
        "analytics_events_summary",
      ],
      evidenceEmitted: [
        "sql_result",
      ],
    },
    {
      name: "lookup_agreement_hierarchy_tracker_policy_guide",
      kind: "evidence_lookup",
      sourceSystemId: "bigquery",
      description: "Look up sections of the Agreement Hierarchy Tracker Procurement Policy Guide to cite in narrative output, escalation rationale, and audit evidence.",
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
      name: "action_icertis_update",
      kind: "action",
      sourceSystemId: "icertis",
      description: "Execute the update step in Icertis after the agent has gathered evidence and validated escalation gates.",
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
      claim: "Orphan POs detected moved from Unknown toward 100% flagged",
      mustCite: [
        "icertis.contracts",
        "docusign_clm.contracts",
      ],
      sourceSystemIds: [
        "icertis",
        "docusign_clm",
      ],
    },
    {
      claim: "Term conflict resolution moved from Discovered in disputes toward Proactively identified",
      mustCite: [
        "icertis.contracts",
        "docusign_clm.contracts",
      ],
      sourceSystemIds: [
        "icertis",
        "docusign_clm",
      ],
    },
  ],
  escalationRules: [
    {
      trigger: "Orphan POs detected regresses past the Unknown baseline by more than 20%",
      action: "escalate_to_human",
      handoffTarget: "Contract Manager",
      rationale: "Significant regressions need human judgment before automated remediation runs against production records.",
    },
    {
      trigger: "Source-system evidence is incomplete or stale (>24h) for any required entity",
      action: "request_more_info",
      rationale: "Recommendations grounded in stale evidence misrepresent current state and undermine audit defensibility.",
    },
    {
      trigger: "Proposed update action lacks supporting evidence from at least two systems",
      action: "refuse",
      rationale: "Single-system evidence is insufficient to authorize external state changes without manual review.",
    },
  ],
  refusalRules: [
    "Never fabricate metric values; only publish numbers derived from Icertis (and other named systems) entities.",
    "Never bypass Contract Manager approval on escalation triggers, even when confidence is high.",
    "Never expose individual personal data (PII) in summaries; aggregate or pseudonymise before output.",
    "Never act on data older than the staleness threshold defined in the runbook without a fresh re-query.",
  ],
  goldenEvals: [
    {
      id: "agreement-hierarchy-tracker-end-to-end",
      prompt: "Run the Agreement Hierarchy Tracker workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.",
      expectedToolCalls: [
        "query_icertis_contracts",
        "query_docusign_clm_contracts",
        "query_sap_ariba_suppliers",
        "query_bigquery_analytics_events",
        "lookup_agreement_hierarchy_tracker_policy_guide",
        "action_icertis_update",
      ],
      mustReferenceEntities: [
        "contracts",
        "contracts",
        "suppliers",
        "analytics_events",
      ],
      mustCiteDocuments: [
        "agreement-hierarchy-tracker-policy-guide",
      ],
      expectedActionOutcome: "Action update executed against Icertis, with audit-trail entry and Contract Manager notified of outcomes.",
      forbiddenBehaviors: [
        "do not invent KPI numbers",
        "do not skip the evidence_lookup step before any recommendation",
        "do not execute update without two-system evidence",
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
    rationale: "Row counts sized for Agreement Hierarchy Tracker so the agent can demonstrate the workflow against realistic transactional volume without simulating a production warehouse.",
  },
  sourceSystems: [
    {
      id: "icertis",
      name: "Icertis",
      owns: [
        "contracts",
        "amendments",
        "obligations",
      ],
      protocol: "REST API",
      localBacking: [
        "alloydb",
      ],
      toolNames: [
        "query_icertis_contracts",
        "query_icertis_amendments",
        "query_icertis_obligations",
      ],
      evidence: [
        "source_system_record",
        "generated_audit_trail",
      ],
    },
    {
      id: "docusign_clm",
      name: "DocuSign CLM",
      owns: [
        "contracts",
        "amendments",
        "obligations",
      ],
      protocol: "REST API",
      localBacking: [
        "alloydb",
      ],
      toolNames: [
        "query_docusign_clm_contracts",
        "query_docusign_clm_amendments",
        "query_docusign_clm_obligations",
      ],
      evidence: [
        "source_system_record",
        "generated_audit_trail",
      ],
    },
    {
      id: "sap_ariba",
      name: "SAP Ariba",
      owns: [
        "suppliers",
        "sourcing_events",
        "contracts",
      ],
      protocol: "REST API",
      localBacking: [
        "alloydb",
      ],
      toolNames: [
        "query_sap_ariba_suppliers",
        "query_sap_ariba_sourcing_events",
        "query_sap_ariba_contracts",
      ],
      evidence: [
        "source_system_record",
        "generated_audit_trail",
      ],
    },
    {
      id: "bigquery",
      name: "BigQuery",
      owns: [
        "analytics_events",
        "historical_metrics",
        "cached_aggregates",
      ],
      protocol: "BigQuery SQL",
      localBacking: [
        "bigquery",
      ],
      toolNames: [
        "query_bigquery_analytics_events",
        "query_bigquery_historical_metrics",
        "query_bigquery_cached_aggregates",
      ],
      evidence: [
        "source_system_record",
        "generated_audit_trail",
      ],
    },
  ],
  entities: [
    {
      name: "contracts",
      sourceSystemId: "icertis",
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
      name: "amendments",
      sourceSystemId: "icertis",
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
      name: "obligations",
      sourceSystemId: "icertis",
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
      name: "suppliers",
      sourceSystemId: "sap_ariba",
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
          type: "company.name",
          required: true,
        },
        {
          name: "category",
          type: "enum",
          values: [
            "IT",
            "Consulting",
            "Manufacturing",
            "Logistics",
            "Facilities",
            "Marketing",
          ],
          required: true,
        },
        {
          name: "rating",
          type: "number",
          min: 1,
          max: 5,
          required: true,
        },
        {
          name: "annual_spend",
          type: "number",
          min: 10000,
          max: 5000000,
          required: true,
        },
        {
          name: "risk_score",
          type: "enum",
          values: [
            "low",
            "medium",
            "high",
          ],
          weights: [
            0.5,
            0.35,
            0.15,
          ],
          required: true,
        },
        {
          name: "status",
          type: "enum",
          values: [
            "active",
            "pending_review",
            "terminated",
          ],
          required: true,
        },
        {
          name: "onboarded_on",
          type: "date",
          required: true,
        },
      ],
    },
    {
      name: "sourcing_events",
      sourceSystemId: "sap_ariba",
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
          name: "supplier_id",
          type: "ref",
          ref: "suppliers.id",
          required: true,
        },
      ],
    },
    {
      name: "analytics_events",
      sourceSystemId: "bigquery",
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
          name: "period",
          type: "enum",
          values: [
            "day",
            "week",
            "month",
            "quarter",
          ],
          required: true,
        },
        {
          name: "metric_name",
          type: "lorem.words",
          required: true,
        },
        {
          name: "value",
          type: "float",
          min: 0,
          max: 100000,
          decimals: 2,
          required: true,
        },
        {
          name: "variance_pct",
          type: "float",
          min: -50,
          max: 50,
          decimals: 2,
          required: true,
        },
        {
          name: "computed_at",
          type: "date",
          required: true,
        },
        {
          name: "historical_metric_id",
          type: "ref",
          ref: "historical_metrics.id",
          required: true,
        },
      ],
    },
    {
      name: "historical_metrics",
      sourceSystemId: "bigquery",
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
          name: "period",
          type: "enum",
          values: [
            "day",
            "week",
            "month",
            "quarter",
          ],
          required: true,
        },
        {
          name: "metric_name",
          type: "lorem.words",
          required: true,
        },
        {
          name: "value",
          type: "float",
          min: 0,
          max: 100000,
          decimals: 2,
          required: true,
        },
        {
          name: "variance_pct",
          type: "float",
          min: -50,
          max: 50,
          decimals: 2,
          required: true,
        },
        {
          name: "computed_at",
          type: "date",
          required: true,
        },
      ],
    },
    {
      name: "cached_aggregates",
      sourceSystemId: "bigquery",
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
          name: "period",
          type: "enum",
          values: [
            "day",
            "week",
            "month",
            "quarter",
          ],
          required: true,
        },
        {
          name: "metric_name",
          type: "lorem.words",
          required: true,
        },
        {
          name: "value",
          type: "float",
          min: 0,
          max: 100000,
          decimals: 2,
          required: true,
        },
        {
          name: "variance_pct",
          type: "float",
          min: -50,
          max: 50,
          decimals: 2,
          required: true,
        },
        {
          name: "computed_at",
          type: "date",
          required: true,
        },
      ],
    },
  ],
  relationships: [
    {
      from: "sourcing_events.supplier_id",
      to: "suppliers.id",
      cardinality: "many-to-one",
      orphanPolicy: "none",
    },
    {
      from: "analytics_events.historical_metric_id",
      to: "historical_metrics.id",
      cardinality: "many-to-one",
      orphanPolicy: "none",
    },
  ],
  documents: [
    {
      id: "agreement-hierarchy-tracker-policy-guide",
      sourceSystemId: "bigquery",
      type: "policy",
      title: "Agreement Hierarchy Tracker Procurement Policy Guide",
      requiredSections: [
        "Sourcing principles",
        "Approval thresholds",
        "Supplier risk requirements",
        "Contract and compliance gates",
        "Exception handling",
      ],
      linkedEntities: [
        "contracts",
        "amendments",
        "obligations",
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
      id: "icertis_update_api",
      sourceSystemId: "icertis",
      method: "POST",
      path: "/api/icertis/update",
      description: "Synchronous endpoint the agent calls to update in Icertis after evidence gating.",
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
      id: "agreement-hierarchy-tracker-baseline-gap",
      description: "Seed a realistic gap where Orphan POs detected sits between Unknown and 100% flagged, so the agent can detect, narrate, and recommend remediation.",
      affectedEntities: [
        "contracts",
        "amendments",
      ],
      discoveryPath: [
        "Inspect Icertis records for the affected entities",
        "Compare against DocuSign CLM historical baseline",
        "Generate a citation-backed recommendation",
      ],
      expectedEvidence: [
        "source-system record",
        "historical baseline metric",
        "generated audit trail",
      ],
      expectedRecommendation: "Explain the gap, cite supporting evidence, and propose the next Contract Manager action.",
    },
  ],
  datastorePackaging: {
    alloydb: {
      database: "agreement_hierarchy_tracker",
      schemas: [
        "icertis",
        "docusign_clm",
        "sap_ariba",
      ],
    },
    bigquery: {
      dataset: "procurement_agreement_hierarchy_tracker",
      tables: [
        "kpi_summary",
        "evidence_index",
      ],
    },
    cloudStorage: {
      bucketSuffix: "agreement-hierarchy-tracker-evidence",
      prefixes: [
        "documents",
        "audit-trails",
        "exports",
      ],
    },
    apis: {
      serviceName: "agreement-hierarchy-tracker-source-adapters",
      deploymentTarget: "cloud_run",
    },
  },
  validation: {
    smokePrompt: "Run the Agreement Hierarchy Tracker workflow and cite source-system evidence for every claim.",
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

export const AgreementHierarchyTracker = () => (
  <UseCaseSlide
    title="Agreement Hierarchy Tracker"
    subtitle="A-1407 • Contract Lifecycle"
    icon={Network}
    domainId="domain-14"
    layer="Layer 4: Full Orchestration"
    persona="Contract Manager"
    systems={["Icertis", "DocuSign CLM", "SAP Ariba", "BigQuery"]}
    kpis={[
      { label: "Orphan POs detected", before: "Unknown", after: "100% flagged" },
      { label: "Term conflict resolution", before: "Discovered in disputes", after: "Proactively identified" },
      { label: "Agreement mapping time", before: "Days of manual tracing", after: "Real-time graph" },
    ]}
    triggerType="event"
    swimlane={swimlane}
    flow={flow}
    architecture={architecture}
    statusQuo={[
      "Agreement relationships tracked in spreadsheets — MSA-to-SOW-to-amendment lineage breaks down after 3+ amendments.",
      "POs issued against expired or wrong parent agreements because hierarchy is not validated at PO creation.",
      "Conflicting terms between MSA and SOW (e.g., Net 45 vs. Net 30 payment terms) discovered only during disputes."
    ]}
    agentification={[
      "Gemini maintains a knowledge graph of agreement relationships — MSA → SOW → amendments → change orders → POs — updated in real time.",
      "LLM resolves inheritance ambiguity: 'Amendment 5 updates Exhibit B pricing but states all other terms unchanged — confirms Amendments 3 and 4 still effective.'",
      "Detects when change orders effectively create new scope that should be a separate SOW, preventing scope creep through amendments."
    ]}
  />
);
