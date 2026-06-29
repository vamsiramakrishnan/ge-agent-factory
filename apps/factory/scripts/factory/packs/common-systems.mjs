import { applyNoop, hasAny, textOf } from "./pack-utils.mjs";

export const hrEmployeeRecordsPack = {
  id: "system_hr_employee_records",
  layer: "system",
  description: "Common employee/workforce record patterns for Workday-backed HR workflows.",
  departments: ["hr"],
  systems: ["workday"],
  capabilities: ["employee_records", "workforce", "manager_hierarchy"],
  match(context) {
    return hasAny(textOf(context), [/workday/, /employees/, /positions/, /compensation_records/, /life_events/]);
  },
  apply: applyNoop,
};

export const itsmPack = {
  id: "system_itsm",
  layer: "system",
  description: "Common ITSM patterns for ServiceNow, incidents, tickets, change requests, SLAs, and remediation workflows.",
  departments: ["it"],
  systems: ["servicenow", "jira"],
  capabilities: ["tickets", "incidents", "change_management", "sla"],
  match(context) {
    return hasAny(textOf(context), [/servicenow/, /\bjira\b/, /incident/, /ticket/, /change_request/, /\bsla\b/, /remediat/]);
  },
  apply: applyNoop,
};

export const crmMarketingOpsPack = {
  id: "system_crm_marketing_ops",
  layer: "system",
  description: "Common CRM and marketing-operations patterns for Salesforce, HubSpot, campaigns, leads, audiences, and funnel analytics.",
  departments: ["marketing"],
  systems: ["salesforce_crm", "hubspot", "marketo"],
  capabilities: ["campaigns", "leads", "audiences", "funnel"],
  match(context) {
    return hasAny(textOf(context), [/salesforce/, /hubspot/, /marketo/, /campaign/, /lead/, /audience/, /funnel/, /utm/]);
  },
  apply: applyNoop,
};

export const procurementOpsPack = {
  id: "system_procurement_ops",
  layer: "system",
  description: "Common procurement and supplier operations patterns for Coupa, Ariba, SAP procurement, suppliers, POs, contracts, risk, and spend.",
  departments: ["procurement"],
  systems: ["coupa", "sap_ariba", "sap_s_4hana"],
  capabilities: ["supplier", "sourcing", "contracts", "purchase_orders", "spend"],
  match(context) {
    return hasAny(textOf(context), [/coupa/, /ariba/, /supplier/, /sourcing/, /contract/, /purchase_order/, /requisition/, /\bspend\b/]);
  },
  apply: applyNoop,
};

export const financeErpPack = {
  id: "system_finance_erp",
  layer: "system",
  description: "Common finance ERP patterns for SAP S/4HANA FI/CO, GL, AP, AR, close, treasury, tax, and controls.",
  departments: ["finance"],
  systems: ["sap_s_4hana_fi", "sap_s_4hana"],
  capabilities: ["gl", "ap", "ar", "close", "treasury", "tax"],
  match(context) {
    return hasAny(textOf(context), [/sap_s_4hana/, /sap s\/4hana/, /gl_entries/, /subledger/, /accounts_payable/, /accounts_receivable/, /treasury/, /\btax\b/, /\bclose\b/]);
  },
  apply: applyNoop,
};

export const contentCollaborationPack = {
  id: "system_content_collaboration",
  layer: "system",
  description: "Common document, meeting, and collaboration patterns for Docs, Drive, Slack, content drafting, review, and publishing workflows.",
  systems: ["google_docs", "google_drive", "slack", "google_meet", "wordpress", "contentful"],
  capabilities: ["document_grounding", "content_review", "collaboration", "publishing"],
  match(context) {
    return hasAny(textOf(context), [/google_docs/, /google_drive/, /\bslack\b/, /google_meet/, /document/, /revision_history/, /comments/, /draft/, /publish/, /contentful/, /wordpress/]);
  },
  apply: applyNoop,
};

export const learningTalentPack = {
  id: "system_learning_talent",
  layer: "system",
  description: "Common learning, recruiting, and talent patterns for LMS, ATS, interview scorecards, quizzes, training content, and selection workflows.",
  departments: ["hr"],
  systems: ["lms", "ats", "google_calendar", "youtube"],
  capabilities: ["learning", "training", "recruiting", "selection"],
  match(context) {
    return hasAny(textOf(context), [/\blms\b/, /\bats\b/, /training/, /learning/, /quiz/, /interview/, /scorecard/, /selection/, /candidate/]);
  },
  apply: applyNoop,
};

export const identitySecurityPack = {
  id: "system_identity_security",
  layer: "system",
  description: "Common identity and security-control patterns for Okta, BeyondCorp, network controls, access grants, zero trust, and policy evaluation.",
  departments: ["it"],
  systems: ["okta", "google_beyondcorp", "palo_alto_prisma"],
  capabilities: ["identity", "access_policy", "security_controls", "zero_trust"],
  match(context) {
    return hasAny(textOf(context), [/okta/, /beyondcorp/, /palo_alto/, /zero trust/, /access_grants/, /identity access/, /security_controls/]);
  },
  apply: applyNoop,
};

export const digitalAssetPack = {
  id: "system_digital_assets",
  layer: "system",
  description: "Common brand, creative, DAM, and asset lifecycle patterns for Bynder, Brandfolder, Figma, Canva, and approval queues.",
  departments: ["marketing"],
  systems: ["bynder", "brandfolder", "figma", "canva"],
  capabilities: ["brand_governance", "asset_lifecycle", "creative_review"],
  match(context) {
    return hasAny(textOf(context), [/bynder/, /brandfolder/, /figma/, /canva/, /brand_guideline/, /assets/, /asset_versions/, /approval_queues/]);
  },
  apply: applyNoop,
};

export const seoMonitoringPack = {
  id: "system_seo_monitoring",
  layer: "system",
  description: "Common SEO and web-performance monitoring patterns for Search Console, Ahrefs, crawlers, keyword rankings, and technical remediation.",
  departments: ["marketing"],
  systems: ["google_search_console", "ahrefs", "screaming_frog"],
  capabilities: ["seo", "web_monitoring", "crawler_findings", "rankings"],
  match(context) {
    return hasAny(textOf(context), [/google_search_console/, /ahrefs/, /screaming_frog/, /\bseo\b/, /keyword_rankings/, /crawler/, /search console/]);
  },
  apply: applyNoop,
};

export const thirdPartyRiskPack = {
  id: "system_third_party_risk",
  layer: "system",
  description: "Common sanctions, watchlist, and third-party risk screening patterns for OFAC, World-Check, LexisNexis, and risk-compliance feeds.",
  departments: ["procurement"],
  systems: ["ofac_sdn", "world_check", "lexisnexis", "dow_jones_risk_compliance"],
  capabilities: ["sanctions_screening", "watchlist", "third_party_risk", "compliance"],
  match(context) {
    return hasAny(textOf(context), [/ofac/, /world_check/, /lexisnexis/, /dow_jones_risk/, /sanctions/, /watchlist/, /screening/, /third.party risk/]);
  },
  apply: applyNoop,
};
