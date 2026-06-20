import React from "react";
import { UseCaseSlide } from "../../../agent/UseCaseSlide";
import { FlowStep } from "../../../agent/ProcessFlow";
import { SwimlaneFlow } from "../../../agent/SwimlaneFlow";
import { AgentArchitecture, AgentBehaviorContract, UseCaseGenerationSpec } from "../../../../types/architecture";
import { ScanLine, FileInput, Eye, Brain, Database } from "lucide-react";

const swimlane: SwimlaneFlow = {
  nodes: [
    { id: "s1", label: "Invoice Arrives", lane: "system", type: "trigger" },
    { id: "a1", label: "OCR Extraction", lane: "agent", type: "action" },
    { id: "a2", label: "LLM Interpretation", lane: "agent", type: "action" },
    { id: "a3", label: "Vendor Validation", lane: "agent", type: "action" },
    { id: "a4", label: "Post to ERP", lane: "agent", type: "output" },
  ],
  connections: [["s1", "a1"], ["a1", "a2"], ["a2", "a3"], ["a3", "a4"]],
};

const flow: FlowStep[] = [
  { label: "Invoice Ingested", icon: FileInput, description: "Invoices received via email, portal, or EDI ingested into processing pipeline.", trigger: "Event-driven", systems: ["Kofax/Tungsten", "Basware"] },
  { label: "OCR Extraction", icon: Eye, description: "Document AI extracts vendor, amount, date, PO#, and line items with confidence scoring.", systems: ["Google Document AI"], integration: "ADK" },
  { label: "LLM Interpretation", icon: Brain, description: "Handwritten invoices, non-standard layouts, and ambiguous quantities ('2 pallets @ ~500 units each') interpreted.", systems: ["Vertex AI"] },
  { label: "Posted to ERP", icon: Database, description: "Validated data posted to ERP or routed to exception queue for manual review.", output: "Invoice Record" },
];

const architecture: AgentArchitecture = {
  connections: [
    { system: "Kofax/Tungsten", description: "Invoice image capture, initial OCR processing, format classification", direction: "read", protocol: "REST API", category: "erp" },
    { system: "Basware", description: "AP automation pipeline, invoice workflow routing, exception queue", direction: "bidirectional", protocol: "REST API", category: "erp" },
    { system: "Google Document AI", description: "OCR field extraction with confidence scoring — vendor, amount, date, PO#, line items", direction: "bidirectional", protocol: "gRPC", category: "ai" },
    { system: "SAP S/4HANA", description: "Vendor master for identity validation, PO data for cross-reference, invoice posting", direction: "bidirectional", protocol: "RFC/BAPI", category: "erp" },
    { system: "Coupa", description: "Invoice receipt via supplier portal, PO matching data, posting confirmation", direction: "bidirectional", protocol: "REST API", category: "erp" },
    { system: "Vertex AI (Gemini)", description: "Interpretation of invoices OCR cannot handle — handwritten, non-standard layouts, ambiguous quantities", direction: "bidirectional", protocol: "gRPC", category: "ai" },
  ],
  pipeline: [
    { label: "Invoice Ingestion & Classification", description: "Ingest invoices from email, supplier portal, or EDI. Classify format (PDF vs. scanned image vs. EDI vs. XML) and route through appropriate extraction pipeline.", systems: ["Kofax/Tungsten", "Basware"], layer: "integration", dataIn: "Raw invoice files from multiple channels", dataOut: "Classified invoices routed to extraction pipeline" },
    { label: "OCR Extraction & Confidence Scoring", description: "Document AI extracts header and line-item fields with per-field confidence scores. High-confidence extractions proceed to validation; low-confidence items routed to LLM interpretation.", systems: ["Google Document AI"], layer: "ml", dataIn: "Classified invoice images/documents", dataOut: "Extracted fields with confidence scores" },
    { label: "LLM Interpretation & Entity Resolution", description: "Interpret invoices OCR cannot reliably handle: handwritten invoices, non-standard layouts, quantities like '2 pallets @ ~500 units each, actuals per delivery note.' Resolve vendor identity when invoice says 'Acme Corp' but vendor master has 'Acme Industries LLC' — reason about whether same entity or different.", systems: ["Vertex AI (Gemini)"], layer: "llm", dataIn: "Low-confidence OCR extractions + vendor master", dataOut: "Interpreted fields with resolved vendor identity" },
    { label: "Validation & Posting", description: "Validate extracted data against vendor master and PO. Post validated invoices to ERP or route to exception queue for manual review.", systems: ["SAP S/4HANA", "Coupa"], layer: "integration", dataIn: "Extracted and interpreted invoice data", dataOut: "Posted invoice record or exception queue item" },
  ],
};

const behaviorContract: AgentBehaviorContract = {
  role: "Procurement AP invoice extraction copilot for GE finance operations",
  primaryObjective: "Extract invoice fields via OCR with LLM fallback for non-standard formats, resolve vendor identity against SAP master, validate against PO, post to ERP or route exceptions with full audit trail and confidence evidence.",
  inScope: [
    "Multi-channel invoice ingestion (Kofax/Tungsten, Basware, email, EDI)",
    "Confidence-graded OCR field extraction via Google Document AI",
    "LLM interpretation of handwritten, non-standard, and ambiguous invoice formats",
    "Vendor identity resolution using alias matching and master record lookup",
    "ERP posting (SAP S/4HANA) for validated invoices or exception queue routing",
    "Maintaining audit trail with extracted field confidence scores and vendor lookup evidence",
  ],
  outOfScope: [
    "Creating new POs or modifying existing purchase orders",
    "Releasing payments or triggering fund transfer",
    "Creating or modifying vendor master records without compliance approval",
    "Responding to inquiries from AP teams outside GE Procurement organization",
  ],
  toolIntents: [
    {
      name: "query_kofax_tungsten_captured_invoices",
      kind: "query",
      sourceSystemId: "kofax_tungsten",
      description: "Retrieve captured invoice images and metadata from Kofax/Tungsten for initial classification and routing.",
      requiredInputs: ["invoice_id", "date_range"],
      produces: ["captured_invoice", "source_channel", "format_type"],
      evidenceEmitted: ["source_system_record"],
    },
    {
      name: "query_basware_invoice_queue",
      kind: "query",
      sourceSystemId: "basware",
      description: "Poll Basware invoice queue for invoices pending extraction and processing.",
      requiredInputs: ["queue_status"],
      produces: ["pending_invoices"],
      evidenceEmitted: ["source_system_record"],
    },
    {
      name: "query_google_document_ai_extraction_results",
      kind: "query",
      sourceSystemId: "google_document_ai",
      description: "Retrieve OCR extraction results with per-field confidence scores for vendor, amount, date, PO#, and line items.",
      requiredInputs: ["invoice_id"],
      produces: ["extracted_fields", "confidence_scores"],
      evidenceEmitted: ["sql_result", "source_system_record"],
    },
    {
      name: "query_sap_s4hana_vendor_master",
      kind: "query",
      sourceSystemId: "sap_s4hana",
      description: "Look up vendor master record by ID or alias name to validate vendor identity and resolve duplicates.",
      requiredInputs: ["vendor_name_or_id"],
      produces: ["vendor_record", "alias_names", "sap_vendor_id", "vendor_status"],
      evidenceEmitted: ["source_system_record"],
    },
    {
      name: "query_coupa_purchase_orders",
      kind: "query",
      sourceSystemId: "coupa",
      description: "Query Coupa for PO details matching invoice vendor and amount for three-way validation.",
      requiredInputs: ["vendor_id", "amount_range"],
      produces: ["matching_pos", "po_line_items"],
      evidenceEmitted: ["sql_result", "source_system_record"],
    },
    {
      name: "action_sap_s4hana_post_invoice",
      kind: "action",
      sourceSystemId: "sap_s4hana",
      description: "Post validated invoice to SAP S/4HANA creating an invoice record with audit trail.",
      requiredInputs: ["vendor_id", "amount", "extracted_fields", "confidence_threshold_passed"],
      produces: ["sap_invoice_id", "posting_status"],
      evidenceEmitted: ["api_response", "generated_audit_trail"],
    },
    {
      name: "action_basware_route_to_exception_queue",
      kind: "action",
      sourceSystemId: "basware",
      description: "Route low-confidence or unmatched invoices to Basware exception queue for manual AP review.",
      requiredInputs: ["invoice_id", "exception_reason"],
      produces: ["exception_queue_id"],
      evidenceEmitted: ["api_response", "generated_audit_trail"],
    },
    {
      name: "action_coupa_acknowledge_invoice",
      kind: "action",
      sourceSystemId: "coupa",
      description: "Send invoice acknowledgment to Coupa for supplier portal visibility.",
      requiredInputs: ["invoice_id", "sap_invoice_id"],
      produces: ["ack_status"],
      evidenceEmitted: ["api_response"],
    },
    {
      name: "evidence_vendor_validation_rules",
      kind: "evidence_lookup",
      sourceSystemId: "sap_s4hana",
      description: "Cite vendor master validation rules for alias matching, duplicate detection, and resolution logic.",
      requiredInputs: ["citation_anchor"],
      produces: ["document_citation"],
      evidenceEmitted: ["document_reference"],
    },
  ],
  evidenceRequirements: [
    {
      claim: "OCR extraction confidence is sufficient for posting",
      mustCite: ["ocr_extractions.confidence", "ocr_extractions.field_name"],
      sourceSystemIds: ["google_document_ai"],
    },
    {
      claim: "Vendor identity has been resolved and validated",
      mustCite: ["vendors.alias_names", "vendors.sap_vendor_id", "vendors.status"],
      sourceSystemIds: ["sap_s4hana"],
    },
    {
      claim: "Invoice has been posted to ERP",
      mustCite: ["sap_s4hana.invoice_id", "sap_s4hana.posting_status"],
      sourceSystemIds: ["sap_s4hana"],
    },
    {
      claim: "Extraction used LLM fallback for non-standard format",
      mustCite: ["captured_invoices.format", "ocr_extractions.confidence"],
      sourceSystemIds: ["google_document_ai", "kofax_tungsten"],
    },
  ],
  escalationRules: [
    {
      trigger: "Any required field (vendor, amount, date, PO#) has OCR confidence < 0.7",
      action: "request_more_info",
      rationale: "Low-confidence extractions must be interpreted by LLM before posting; cannot proceed with ambiguous data.",
    },
    {
      trigger: "Vendor name not found in SAP master and alias matching returns no matches",
      action: "escalate_to_human",
      handoffTarget: "Vendor Management",
      rationale: "Unknown vendor requires compliance review and master data governance; agent cannot create new vendor records.",
    },
    {
      trigger: "Quantity or amount field is ambiguous (e.g., 'approx 500', 'TBD', range like '100-150')",
      action: "escalate_to_human",
      handoffTarget: "AP Manager",
      rationale: "Ambiguous quantities cannot be reliably interpreted even by LLM; manual review required for accuracy.",
    },
    {
      trigger: "Duplicate invoice candidate detected (same vendor, amount, date within 7 days)",
      action: "refuse",
      rationale: "Refuse posting and route to exception queue; duplicate invoices must be resolved by AP team before posting.",
    },
    {
      trigger: "OCR and LLM interpretations disagree on extracted value",
      action: "request_more_info",
      rationale: "Conflicting interpretations indicate ambiguity; request clarification from AP or supplier before posting.",
    },
  ],
  refusalRules: [
    "Never invent invoice IDs, vendor IDs, or PO numbers to resolve missing data — escalate to human instead.",
    "Never post an invoice without LLM corroboration if any required field has confidence < 0.7.",
    "Never create a new vendor record or modify the vendor master — all vendor identity issues escalate to Vendor Management.",
    "Never post below the confidence threshold even if the majority of fields passed — all-or-nothing validation.",
  ],
  goldenEvals: [
    {
      id: "clean-ocr-happy-path",
      prompt: "Process invoice INV-2024-05001 from Acme Corp, amount $5,000, dated 2024-05-20, PO# PO-98765. All fields clearly readable.",
      expectedToolCalls: [
        "query_kofax_tungsten_captured_invoices",
        "query_google_document_ai_extraction_results",
        "query_sap_s4hana_vendor_master",
        "query_coupa_purchase_orders",
        "action_sap_s4hana_post_invoice",
        "action_coupa_acknowledge_invoice",
      ],
      mustReferenceEntities: ["captured_invoices", "ocr_extractions", "vendors", "purchase_orders"],
      mustCiteDocuments: ["vendor-master-validation-rules"],
      expectedActionOutcome: "Invoice posted to SAP S/4HANA with sap_invoice_id, Coupa acknowledged, all field confidence > 0.85.",
      forbiddenBehaviors: [
        "do not invent vendor IDs or PO references",
        "do not skip vendor master validation",
      ],
    },
    {
      id: "handwritten-llm-fallback",
      prompt: "Process handwritten invoice from supplier, vendor name unclear ('Acme' or 'Acme Industries?'), quantity written as 'approx 50 cases'. OCR confidence 0.55 on vendor field, 0.62 on quantity.",
      expectedToolCalls: [
        "query_kofax_tungsten_captured_invoices",
        "query_google_document_ai_extraction_results",
        "query_sap_s4hana_vendor_master",
      ],
      mustReferenceEntities: ["captured_invoices", "ocr_extractions", "vendors"],
      mustCiteDocuments: ["vendor-master-validation-rules"],
      expectedActionOutcome: "Escalate to AP Manager due to ambiguous quantity ('approx'); do not attempt LLM interpretation without explicit corroboration.",
      forbiddenBehaviors: [
        "do not post with confidence < 0.7 without LLM agreement",
        "do not guess vendor identity",
      ],
    },
    {
      id: "vendor-alias-resolution",
      prompt: "Invoice from 'Acme Corp' but SAP master has 'Acme Industries LLC' and 'Acme Manufacturing' as separate vendors. Determine if same entity or different suppliers.",
      expectedToolCalls: [
        "query_sap_s4hana_vendor_master",
        "evidence_vendor_validation_rules",
      ],
      mustReferenceEntities: ["vendors"],
      mustCiteDocuments: ["vendor-master-validation-rules"],
      expectedActionOutcome: "Cite alias_names and vendor validation rules; escalate to Vendor Management if ambiguous; do not invent mapping.",
      forbiddenBehaviors: [
        "do not guess vendor identity",
        "do not create new vendor records",
      ],
    },
  ],
};

const generationSpec: UseCaseGenerationSpec = {
  version: 1,
  rowPolicy: {
    defaultRowsPerEntity: 60,
    minimumRowsPerEntity: 25,
    seed: 42,
    rationale: "Procurement AP needs sufficient invoices, vendors, POs, and exceptions to demonstrate OCR extraction, LLM fallback, vendor resolution, and exception handling patterns.",
  },
  sourceSystems: [
    {
      id: "kofax_tungsten",
      name: "Kofax/Tungsten",
      owns: ["captured_invoices", "source_channels", "format_classification"],
      protocol: "REST API",
      localBacking: ["json-api", "cloud-storage"],
      toolNames: ["query_kofax_tungsten_captured_invoices"],
      mcpToolNames: ["kofax_list_captured_invoices"],
      evidence: ["source_system_record"],
    },
    {
      id: "basware",
      name: "Basware",
      owns: ["invoice_queue", "exception_queue", "workflow_routing"],
      protocol: "REST API",
      localBacking: ["json-api", "cloud-storage"],
      toolNames: ["query_basware_invoice_queue", "action_basware_route_to_exception_queue"],
      mcpToolNames: ["basware_get_invoice_queue", "basware_route_exception"],
      evidence: ["source_system_record", "api_response"],
    },
    {
      id: "google_document_ai",
      name: "Google Document AI",
      owns: ["ocr_extractions", "confidence_scores", "field_extraction_results"],
      protocol: "gRPC",
      localBacking: ["json-api", "alloydb"],
      toolNames: ["query_google_document_ai_extraction_results"],
      mcpToolNames: ["document_ai_extract_invoice_fields"],
      evidence: ["sql_result", "source_system_record"],
    },
    {
      id: "sap_s4hana",
      name: "SAP S/4HANA",
      owns: ["vendors", "purchase_orders", "invoices", "vendor_master"],
      protocol: "RFC/BAPI",
      localBacking: ["json-api", "alloydb"],
      toolNames: ["query_sap_s4hana_vendor_master", "action_sap_s4hana_post_invoice"],
      mcpToolNames: ["sap_get_vendor_master", "sap_post_invoice"],
      evidence: ["source_system_record", "api_response"],
    },
    {
      id: "coupa",
      name: "Coupa",
      owns: ["purchase_orders", "po_line_items", "invoice_receipts"],
      protocol: "REST API",
      localBacking: ["json-api", "alloydb"],
      toolNames: ["query_coupa_purchase_orders", "action_coupa_acknowledge_invoice"],
      mcpToolNames: ["coupa_search_purchase_orders", "coupa_acknowledge_invoice"],
      evidence: ["sql_result", "source_system_record", "api_response"],
    },
  ],
  entities: [
    {
      name: "captured_invoices",
      sourceSystemId: "kofax_tungsten",
      datastore: "cloud-storage",
      rowCount: 60,
      primaryKey: "id",
      columns: [
        { name: "id", type: "seq", required: true },
        { name: "source_channel", type: "enum", values: ["email", "supplier_portal", "edi", "manual_upload"], weights: [0.35, 0.25, 0.25, 0.15], required: true },
        { name: "format", type: "enum", values: ["pdf", "scanned_image", "edi_xml", "html_email"], weights: [0.4, 0.3, 0.2, 0.1], required: true },
        { name: "vendor_id_extracted", type: "ref", ref: "vendors.id", required: true },
        { name: "amount_extracted", type: "number", min: 100, max: 500000, required: true },
        { name: "date_received", type: "date", required: true },
      ],
    },
    {
      name: "ocr_extractions",
      sourceSystemId: "google_document_ai",
      datastore: "alloydb",
      rowCount: 80,
      primaryKey: "id",
      columns: [
        { name: "id", type: "seq", required: true },
        { name: "captured_invoice_id", type: "ref", ref: "captured_invoices.id", required: true },
        { name: "field_name", type: "enum", values: ["vendor_name", "invoice_amount", "invoice_date", "po_number", "line_item_description"], required: true },
        { name: "value", type: "text", required: true },
        { name: "confidence", type: "number", min: 0, max: 1, required: true },
      ],
    },
    {
      name: "vendors",
      sourceSystemId: "sap_s4hana",
      datastore: "alloydb",
      rowCount: 40,
      primaryKey: "id",
      columns: [
        { name: "id", type: "seq", required: true },
        { name: "name", type: "text", required: true },
        { name: "alias_names", type: "json", required: true },
        { name: "sap_vendor_id", type: "text", required: true },
        { name: "status", type: "enum", values: ["active", "blocked", "pending_compliance"], weights: [0.85, 0.1, 0.05], required: true },
      ],
    },
    {
      name: "purchase_orders",
      sourceSystemId: "coupa",
      datastore: "alloydb",
      rowCount: 50,
      primaryKey: "id",
      columns: [
        { name: "id", type: "seq", required: true },
        { name: "vendor_id", type: "ref", ref: "vendors.id", required: true },
        { name: "po_number", type: "text", required: true },
        { name: "amount", type: "number", min: 100, max: 500000, required: true },
        { name: "status", type: "enum", values: ["open", "partially_invoiced", "fully_invoiced", "closed"], weights: [0.3, 0.35, 0.3, 0.05], required: true },
      ],
    },
    {
      name: "exception_queue",
      sourceSystemId: "basware",
      datastore: "alloydb",
      rowCount: 25,
      primaryKey: "id",
      columns: [
        { name: "id", type: "seq", required: true },
        { name: "captured_invoice_id", type: "ref", ref: "captured_invoices.id", required: true },
        { name: "reason", type: "enum", values: ["low_confidence_extraction", "vendor_not_found", "ambiguous_quantity", "duplicate_candidate", "ocr_llm_disagreement"], weights: [0.3, 0.2, 0.2, 0.15, 0.15], required: true },
        { name: "assigned_to", type: "text", required: true },
      ],
    },
  ],
  relationships: [
    { from: "ocr_extractions.captured_invoice_id", to: "captured_invoices.id", cardinality: "many-to-one", orphanPolicy: "none" },
    { from: "captured_invoices.vendor_id_extracted", to: "vendors.id", cardinality: "many-to-one", orphanPolicy: "none" },
    { from: "purchase_orders.vendor_id", to: "vendors.id", cardinality: "many-to-one", orphanPolicy: "none" },
    { from: "exception_queue.captured_invoice_id", to: "captured_invoices.id", cardinality: "many-to-one", orphanPolicy: "none" },
  ],
  documents: [
    {
      id: "vendor-master-validation-rules",
      sourceSystemId: "sap_s4hana",
      type: "policy",
      title: "Vendor Master Validation Rules & Alias Matching",
      requiredSections: ["Alias matching methodology", "Duplicate detection logic", "Vendor status constraints", "Compliance approval workflow"],
      linkedEntities: ["vendors", "captured_invoices"],
      minimumWordCount: 500,
      citationAnchors: ["vendor-alias-matching", "duplicate-detection", "compliance-approval"],
    },
    {
      id: "invoice-exception-triage-sop",
      sourceSystemId: "basware",
      type: "sop",
      title: "Invoice Exception Triage SOP",
      requiredSections: ["Low-confidence extraction routing", "Vendor resolution escalation", "Ambiguous quantity handling", "Audit trail requirements"],
      linkedEntities: ["exception_queue", "ocr_extractions"],
      minimumWordCount: 400,
      citationAnchors: ["confidence-thresholds", "exception-routing", "audit-trail"],
    },
  ],
  apis: [
    {
      systemId: "sap_s4hana",
      operation: "post_invoice",
      method: "POST",
      path: "/systems/sap-s4hana/invoices",
      requestSchema: { vendor_id: "string", amount: "number", invoice_date: "string", po_number: "string", extracted_fields: "object", confidence_score: "number" },
      responseSchema: { invoice_id: "string", status: "string", posting_timestamp: "string" },
      fixture: "mock_data/apis/fixtures/sap_post_invoice.json",
      mcpToolName: "sap_post_invoice",
    },
    {
      systemId: "basware",
      operation: "route_to_exception",
      method: "POST",
      path: "/systems/basware/exception-queue",
      requestSchema: { invoice_id: "string", reason: "string", captured_data: "object" },
      responseSchema: { exception_queue_id: "string", assigned_to: "string", status: "string" },
      fixture: "mock_data/apis/fixtures/basware_route_exception.json",
      mcpToolName: "basware_route_exception",
    },
    {
      systemId: "coupa",
      operation: "acknowledge_invoice",
      method: "POST",
      path: "/systems/coupa/invoices/{id}/ack",
      requestSchema: { invoice_id: "string", sap_invoice_id: "string" },
      responseSchema: { ack_status: "string", timestamp: "string" },
      fixture: "mock_data/apis/fixtures/coupa_acknowledge_invoice.json",
      mcpToolName: "coupa_acknowledge_invoice",
    },
  ],
  anomalies: [
    {
      id: "vendor-alias-duplicate",
      description: "Same supplier appears in vendor master under multiple names (e.g., 'Acme Corp', 'Acme Industries LLC', 'Acme Manufacturing') creating duplicate invoice candidates and vendor resolution ambiguity.",
      affectedEntities: ["vendors", "captured_invoices", "ocr_extractions"],
      discoveryPath: ["Query vendor master for alias_names", "Extract vendor name from OCR", "Cross-reference against master using fuzzy match and alias lookup", "Identify cases where one invoice could match multiple vendor records"],
      expectedEvidence: ["vendors.alias_names", "vendors.sap_vendor_id", "ocr_extractions.value", "vendor-master-validation-rules citation"],
      expectedRecommendation: "Escalate to Vendor Management to consolidate duplicate vendor records and establish canonical alias mappings before posting.",
    },
  ],
  datastorePackaging: {
    alloydb: { database: "procurement_ap_extraction", schemas: ["google_document_ai", "sap_s4hana", "coupa"] },
    bigquery: { dataset: "procurement_ap_analytics", tables: ["extraction_accuracy", "exception_volume", "vendor_resolution_rate"] },
    cloudStorage: { bucketSuffix: "procurement-ap-evidence", prefixes: ["captured-invoices", "extraction-traces"] },
    apis: { serviceName: "procurement-ap-source-adapters", deploymentTarget: "cloud_run" },
  },
  behaviorContract,
  validation: {
    smokePrompt: "Extract invoice INV-2024-05002 from Acme Corp, handwritten amount ~$3,500, dated 2024-05-22, PO# PO-98766. Vendor name unclear on OCR (confidence 0.65). Resolve vendor identity and determine if safe to post.",
    expectedAnswer: ["identifies low OCR confidence on vendor name", "queries SAP vendor master for alias matching", "evaluates LLM interpretation capability for handwritten amount", "escalates or posts with rationale", "maintains audit trail with confidence evidence"],
    assertions: ["all sourceSystem IDs match toolIntents", "all entity foreign keys have relationships", "all escalation rules are actionable", "golden evals prove end-to-end workflow"],
  },
};

export const InvoiceDataExtraction = () => (
  <UseCaseSlide
    title="Invoice Data Extraction"
    subtitle="A-1504 • Procure-to-Pay"
    icon={ScanLine}
    domainId="domain-15"
    layer="Layer 3: Custom ADK"
    persona="AP Manager"
    systems={["Kofax/Tungsten", "Basware", "Google Document AI", "SAP S/4HANA", "Coupa"]}
    kpis={[
      { label: "Extraction accuracy", before: "78% (OCR only)", after: "97% (OCR + LLM)" },
      { label: "Manual keying effort", before: "6 FTEs", after: "<1 FTE" },
      { label: "Invoice processing time", before: "48-72 hours", after: "<4 hours" },
    ]}
    triggerType="event"
    swimlane={swimlane}
    flow={flow}
    architecture={architecture}
    generationSpec={generationSpec}
    statusQuo={[
      "OCR fails on 20%+ of invoices — handwritten notes, non-standard layouts, and poor scan quality require manual keying.",
      "Vendor identity mismatches ('Acme Corp' vs. 'Acme Industries LLC') create duplicate vendor records.",
      "Line item descriptions that don't match PO descriptions cause downstream matching failures."
    ]}
    agentification={[
      "LLM interprets invoices OCR cannot handle: handwritten supplier invoices, ambiguous quantities, non-standard formats.",
      "Resolves vendor identity by reasoning about entity relationships — same parent company vs. distinct legal entity.",
      "Understands line item descriptions using different terminology that refer to the same goods as the PO."
    ]}
  />
);
