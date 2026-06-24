import React from "react";
import { UseCaseSlide } from "../../../agent/UseCaseSlide";
import { FlowStep } from "../../../agent/ProcessFlow";
import { SwimlaneFlow } from "../../../agent/SwimlaneFlow";
import { AgentArchitecture, UseCaseGenerationSpec, AgentBehaviorContract} from "../../../../types/architecture";
import { PackageSearch, Search, ShoppingBag, GitCompare, CheckCircle } from "lucide-react";

const swimlane: SwimlaneFlow = {
  nodes: [
    { id: "s1", label: "User Search", lane: "system", type: "trigger" },
    { id: "a1", label: "NLP Query Parse", lane: "agent", type: "action" },
    { id: "a2", label: "Collab Filtering", lane: "agent", type: "action" },
    { id: "a3", label: "Alt Suggestion", lane: "agent", type: "output" },
    { id: "s2", label: "Catalog Result", lane: "system", type: "output" },
  ],
  connections: [["s1", "a1"], ["a1", "a2"], ["a2", "a3"], ["a3", "s2"]],
};

const flow: FlowStep[] = [
  { label: "User Search", icon: Search, description: "Requester searches or browses the procurement catalog with natural-language query.", trigger: "On search", systems: ["Coupa catalog", "Ariba"] },
  { label: "NLP Interpretation", icon: PackageSearch, description: "LLM interprets intent behind non-standard queries and maps to catalog taxonomy.", systems: ["Vertex AI"], integration: "Agent Designer" },
  { label: "Smart Matching", icon: GitCompare, description: "Collaborative filtering surfaces products based on purchase patterns and spec equivalencies.", systems: ["Coupa catalog", "Amazon Business"] },
  { label: "Compliant Result", icon: CheckCircle, description: "Contracted alternatives presented with price comparisons and product summaries.", output: "Catalog Recommendation" },
];

const architecture: AgentArchitecture = {
  connections: [
    { system: "Coupa Catalog", description: "Product listings, pricing, availability, contracted suppliers", direction: "bidirectional", protocol: "REST API", category: "erp" },
    { system: "Amazon Business", description: "Punchout product catalog, pricing comparisons, availability", direction: "read", protocol: "Punchout/cXML", category: "erp" },
    { system: "Ariba Catalog", description: "Punchout supplier product feeds, contract-linked items", direction: "read", protocol: "cXML", category: "erp" },
    { system: "Vertex AI (Gemini)", description: "Natural-language search interpretation, product equivalency reasoning", direction: "bidirectional", protocol: "gRPC", category: "ai" },
    { system: "BigQuery", description: "Purchase pattern history for collaborative filtering, usage analytics", direction: "read", protocol: "BigQuery SQL", category: "analytics" },
  ],
  pipeline: [
    { label: "Query Interpretation", description: "Parse natural-language search queries that do not match catalog taxonomy — 'something to organize cables under my standing desk' mapped to cable management products. Intent classification routes between catalog search, spec-match, and alternative suggestion.", systems: ["Vertex AI (Gemini)"], layer: "llm", dataIn: "User search query in natural language", dataOut: "Structured product search parameters" },
    { label: "Smart Matching & Filtering", description: "Collaborative filtering on purchase patterns (users who bought X also bought Y). Price comparison across contracted suppliers with spec equivalency matching when preferred brand is unavailable.", systems: ["BigQuery", "Coupa Catalog", "Amazon Business"], layer: "ml", dataIn: "Structured search + user purchase history", dataOut: "Ranked product results with alternatives" },
    { label: "Result Presentation", description: "Compliant product recommendations presented with price comparisons, product summaries, and contracted-supplier prioritization. Higher-value items include generated comparison narratives.", systems: ["Coupa Catalog", "Ariba Catalog"], layer: "integration", dataIn: "Ranked product matches", dataOut: "Catalog recommendation with compliance context" },
  ],
};


const behaviorContract: AgentBehaviorContract = {
  role: "Buyer agent for the Catalog Curation & Recommendation workflow",
  primaryObjective: "LLM interprets natural-language searches — 'something to organize cables under my standing desk' returns cable management trays even though the user never used that term. Collaborative filtering recommends products based on what similar buyers purchased; spec-matching suggests compatible alternatives when preferred brand is unavailable. so the Buyer can move the Catalog search success KPI.",
  inScope: [
    "LLM interprets natural-language searches — 'something to organize cables under my standing desk' returns cable management trays even though the user never used that term",
    "Collaborative filtering recommends products based on what similar buyers purchased; spec-matching suggests compatible alternatives when preferred brand is unavailable",
    "Generates product comparison summaries for higher-value items, driving adoption of contracted suppliers over maverick channels",
  ],
  outOfScope: [
    "Contract execution without legal review",
    "Supplier disqualification decisions (category lead retains authority)",
    "Single-source justification overrides above policy threshold",
  ],
  toolIntents: [
    {
      name: "query_coupa_catalog_catalog_items",
      kind: "query",
      sourceSystemId: "coupa_catalog",
      description: "Retrieve catalog items from Coupa catalog for the Catalog Curation & Recommendation workflow.",
      requiredInputs: [
        "lookup_key",
        "date_range",
      ],
      produces: [
        "catalog_items_records",
        "catalog_items_summary",
      ],
      evidenceEmitted: [
        "source_system_record",
      ],
    },
    {
      name: "query_amazon_business_amazon_business_records",
      kind: "query",
      sourceSystemId: "amazon_business",
      description: "Retrieve amazon business records from Amazon Business for the Catalog Curation & Recommendation workflow.",
      requiredInputs: [
        "lookup_key",
        "date_range",
      ],
      produces: [
        "amazon_business_records_records",
        "amazon_business_records_summary",
      ],
      evidenceEmitted: [
        "source_system_record",
      ],
    },
    {
      name: "query_punchout_catalogs_punchout_catalogs_records",
      kind: "query",
      sourceSystemId: "punchout_catalogs",
      description: "Retrieve punchout catalogs records from Punchout catalogs for the Catalog Curation & Recommendation workflow.",
      requiredInputs: [
        "lookup_key",
        "date_range",
      ],
      produces: [
        "punchout_catalogs_records_records",
        "punchout_catalogs_records_summary",
      ],
      evidenceEmitted: [
        "source_system_record",
      ],
    },
    {
      name: "query_ariba_ariba_records",
      kind: "query",
      sourceSystemId: "ariba",
      description: "Retrieve ariba records from Ariba for the Catalog Curation & Recommendation workflow.",
      requiredInputs: [
        "lookup_key",
        "date_range",
      ],
      produces: [
        "ariba_records_records",
        "ariba_records_summary",
      ],
      evidenceEmitted: [
        "source_system_record",
      ],
    },
    {
      name: "lookup_catalog_curation_recommendation_policy_guide",
      kind: "evidence_lookup",
      sourceSystemId: "coupa_catalog",
      description: "Look up sections of the Catalog Curation & Recommendation Procurement Policy Guide to cite in narrative output, escalation rationale, and audit evidence.",
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
      name: "action_coupa_catalog_recommend",
      kind: "action",
      sourceSystemId: "coupa_catalog",
      description: "Execute the recommend step in Coupa catalog after the agent has gathered evidence and validated escalation gates.",
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
      claim: "Catalog search success moved from 45% find match toward 92% find match",
      mustCite: [
        "coupa_catalog.catalog_items",
        "amazon_business.amazon_business_records",
      ],
      sourceSystemIds: [
        "coupa_catalog",
        "amazon_business",
      ],
    },
    {
      claim: "Off-catalog purchases moved from 35% of indirect toward <8%",
      mustCite: [
        "coupa_catalog.catalog_items",
        "amazon_business.amazon_business_records",
      ],
      sourceSystemIds: [
        "coupa_catalog",
        "amazon_business",
      ],
    },
  ],
  escalationRules: [
    {
      trigger: "Catalog search success regresses past the 45% find match baseline by more than 20%",
      action: "escalate_to_human",
      handoffTarget: "Buyer",
      rationale: "Significant regressions need human judgment before automated remediation runs against production records.",
    },
    {
      trigger: "Source-system evidence is incomplete or stale (>24h) for any required entity",
      action: "request_more_info",
      rationale: "Recommendations grounded in stale evidence misrepresent current state and undermine audit defensibility.",
    },
    {
      trigger: "Proposed recommend action lacks supporting evidence from at least two systems",
      action: "refuse",
      rationale: "Single-system evidence is insufficient to authorize external state changes without manual review.",
    },
  ],
  refusalRules: [
    "Never fabricate metric values; only publish numbers derived from Coupa catalog (and other named systems) entities.",
    "Never bypass Buyer approval on escalation triggers, even when confidence is high.",
    "Never expose individual personal data (PII) in summaries; aggregate or pseudonymise before output.",
    "Never act on data older than the staleness threshold defined in the runbook without a fresh re-query.",
  ],
  goldenEvals: [
    {
      id: "catalog-curation-recommendation-end-to-end",
      prompt: "Run the Catalog Curation & Recommendation workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.",
      expectedToolCalls: [
        "query_coupa_catalog_catalog_items",
        "query_amazon_business_amazon_business_records",
        "query_punchout_catalogs_punchout_catalogs_records",
        "query_ariba_ariba_records",
        "lookup_catalog_curation_recommendation_policy_guide",
        "action_coupa_catalog_recommend",
      ],
      mustReferenceEntities: [
        "catalog_items",
        "amazon_business_records",
        "punchout_catalogs_records",
        "ariba_records",
      ],
      mustCiteDocuments: [
        "catalog-curation-recommendation-policy-guide",
      ],
      expectedActionOutcome: "Action recommend executed against Coupa catalog, with audit-trail entry and Buyer notified of outcomes.",
      forbiddenBehaviors: [
        "do not invent KPI numbers",
        "do not skip the evidence_lookup step before any recommendation",
        "do not execute recommend without two-system evidence",
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
    rationale: "Row counts sized for Catalog Curation & Recommendation so the agent can demonstrate the workflow against realistic transactional volume without simulating a production warehouse.",
  },
  sourceSystems: [
    {
      id: "coupa_catalog",
      name: "Coupa catalog",
      owns: [
        "catalog_items",
        "supplier_offerings",
        "punchout_links",
      ],
      protocol: "REST API",
      localBacking: [
        "alloydb",
      ],
      toolNames: [
        "query_coupa_catalog_catalog_items",
        "query_coupa_catalog_supplier_offerings",
        "query_coupa_catalog_punchout_links",
      ],
      evidence: [
        "source_system_record",
        "generated_audit_trail",
      ],
    },
    {
      id: "amazon_business",
      name: "Amazon Business",
      owns: [
        "amazon_business_records",
        "amazon_business_events",
        "amazon_business_audit_trail",
      ],
      protocol: "REST API",
      localBacking: [
        "alloydb",
      ],
      toolNames: [
        "query_amazon_business_amazon_business_records",
        "query_amazon_business_amazon_business_events",
        "query_amazon_business_amazon_business_audit_trail",
      ],
      evidence: [
        "source_system_record",
        "generated_audit_trail",
      ],
    },
    {
      id: "punchout_catalogs",
      name: "Punchout catalogs",
      owns: [
        "punchout_catalogs_records",
        "punchout_catalogs_events",
        "punchout_catalogs_audit_trail",
      ],
      protocol: "REST API",
      localBacking: [
        "alloydb",
      ],
      toolNames: [
        "query_punchout_catalogs_punchout_catalogs_records",
        "query_punchout_catalogs_punchout_catalogs_events",
        "query_punchout_catalogs_punchout_catalogs_audit_trail",
      ],
      evidence: [
        "source_system_record",
        "generated_audit_trail",
      ],
    },
    {
      id: "ariba",
      name: "Ariba",
      owns: [
        "ariba_records",
        "ariba_events",
        "ariba_audit_trail",
      ],
      protocol: "REST API",
      localBacking: [
        "alloydb",
      ],
      toolNames: [
        "query_ariba_ariba_records",
        "query_ariba_ariba_events",
        "query_ariba_ariba_audit_trail",
      ],
      evidence: [
        "source_system_record",
        "generated_audit_trail",
      ],
    },
  ],
  entities: [
    {
      name: "catalog_items",
      sourceSystemId: "coupa_catalog",
      datastore: "alloydb",
      rowCount: 30,
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
          name: "supplier_offering_id",
          type: "ref",
          ref: "supplier_offerings.id",
          required: true,
        },
      ],
    },
    {
      name: "supplier_offerings",
      sourceSystemId: "coupa_catalog",
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
      name: "punchout_links",
      sourceSystemId: "coupa_catalog",
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
      name: "amazon_business_records",
      sourceSystemId: "amazon_business",
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
      name: "amazon_business_events",
      sourceSystemId: "amazon_business",
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
          name: "amazon_business_record_id",
          type: "ref",
          ref: "amazon_business_records.id",
          required: true,
        },
      ],
    },
    {
      name: "amazon_business_audit_trail",
      sourceSystemId: "amazon_business",
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
      name: "punchout_catalogs_records",
      sourceSystemId: "punchout_catalogs",
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
      name: "punchout_catalogs_events",
      sourceSystemId: "punchout_catalogs",
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
      name: "punchout_catalogs_audit_trail",
      sourceSystemId: "punchout_catalogs",
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
      name: "ariba_records",
      sourceSystemId: "ariba",
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
      name: "ariba_events",
      sourceSystemId: "ariba",
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
          name: "ariba_record_id",
          type: "ref",
          ref: "ariba_records.id",
          required: true,
        },
      ],
    },
    {
      name: "ariba_audit_trail",
      sourceSystemId: "ariba",
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
      from: "catalog_items.supplier_offering_id",
      to: "supplier_offerings.id",
      cardinality: "many-to-one",
      orphanPolicy: "none",
    },
    {
      from: "amazon_business_events.amazon_business_record_id",
      to: "amazon_business_records.id",
      cardinality: "many-to-one",
      orphanPolicy: "none",
    },
    {
      from: "ariba_events.ariba_record_id",
      to: "ariba_records.id",
      cardinality: "many-to-one",
      orphanPolicy: "none",
    },
  ],
  documents: [
    {
      id: "catalog-curation-recommendation-policy-guide",
      sourceSystemId: "coupa_catalog",
      type: "policy",
      title: "Catalog Curation & Recommendation Procurement Policy Guide",
      requiredSections: [
        "Sourcing principles",
        "Approval thresholds",
        "Supplier risk requirements",
        "Contract and compliance gates",
        "Exception handling",
      ],
      linkedEntities: [
        "catalog_items",
        "supplier_offerings",
        "punchout_links",
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
      id: "coupa_catalog_recommend_api",
      sourceSystemId: "coupa_catalog",
      method: "POST",
      path: "/api/coupa_catalog/recommend",
      description: "Synchronous endpoint the agent calls to recommend in Coupa catalog after evidence gating.",
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
      id: "catalog-curation-recommendation-baseline-gap",
      description: "Seed a realistic gap where Catalog search success sits between 45% find match and 92% find match, so the agent can detect, narrate, and recommend remediation.",
      affectedEntities: [
        "catalog_items",
        "supplier_offerings",
      ],
      discoveryPath: [
        "Inspect Coupa catalog records for the affected entities",
        "Compare against Amazon Business historical baseline",
        "Generate a citation-backed recommendation",
      ],
      expectedEvidence: [
        "source-system record",
        "historical baseline metric",
        "generated audit trail",
      ],
      expectedRecommendation: "Explain the gap, cite supporting evidence, and propose the next Buyer action.",
    },
  ],
  datastorePackaging: {
    alloydb: {
      database: "catalog_curation_recommendation",
      schemas: [
        "coupa_catalog",
        "amazon_business",
        "punchout_catalogs",
        "ariba",
      ],
    },
    bigquery: {
      dataset: "procurement_catalog_curation_recommendation",
      tables: [
        "kpi_summary",
        "evidence_index",
      ],
    },
    cloudStorage: {
      bucketSuffix: "catalog-curation-recommendation-evidence",
      prefixes: [
        "documents",
        "audit-trails",
        "exports",
      ],
    },
    apis: {
      serviceName: "catalog-curation-recommendation-source-adapters",
      deploymentTarget: "cloud_run",
    },
  },
  validation: {
    smokePrompt: "Run the Catalog Curation & Recommendation workflow and cite source-system evidence for every claim.",
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

export const CatalogCurationRecommendation = () => (
  <UseCaseSlide
    title="Catalog Curation & Recommendation"
    subtitle="A-1802 • Indirect & Tail Spend"
    icon={PackageSearch}
    domainId="domain-18"
    layer="Layer 2: Agent Designer"
    persona="Buyer"
    systems={["Coupa catalog", "Amazon Business", "Punchout catalogs", "Ariba"]}
    kpis={[
      { label: "Catalog search success", before: "45% find match", after: "92% find match" },
      { label: "Off-catalog purchases", before: "35% of indirect", after: "<8%" },
      { label: "Avg time to find item", before: "12 min", after: "< 2 min" },
    ]}
    triggerType="event"
    swimlane={swimlane}
    flow={flow}
    architecture={architecture}
    statusQuo={[
      "Users search catalogs with exact product names — if terminology does not match, they find nothing and buy off-contract.",
      "No product equivalency intelligence — when preferred brand is out of stock, users default to Amazon personal accounts.",
      "Catalog content is stale with outdated pricing and discontinued items, eroding user trust."
    ]}
    agentification={[
      "LLM interprets natural-language searches — 'something to organize cables under my standing desk' returns cable management trays even though the user never used that term.",
      "Collaborative filtering recommends products based on what similar buyers purchased; spec-matching suggests compatible alternatives when preferred brand is unavailable.",
      "Generates product comparison summaries for higher-value items, driving adoption of contracted suppliers over maverick channels."
    ]}
  />
);
