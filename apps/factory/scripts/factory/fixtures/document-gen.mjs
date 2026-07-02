// Faker-backed synthetic document generation for workspace fixtures: the
// per-type section templates, the per-domain document sets, and the paragraph/
// entity-reference synthesis cmdGenerate uses to write fixtures/documents/*.md.
// Extracted from factory.mjs verbatim — output is identical to the former
// inline cluster for the same faker seed state. Deliberately NOT self-seeding:
// cmdGenerate owns the faker seed; these functions consume the shared
// singleton's current state.
import { faker } from "@faker-js/faker";
import { parseList } from "@ge/std/list";

const DOC_TEMPLATES = {
  policy: { titlePrefix: "Policy", sections: ["Purpose", "Scope", "Policy Statement", "Procedures", "Compliance", "Exceptions", "Review Cycle"] },
  report: { titlePrefix: "Report", sections: ["Executive Summary", "Key Findings", "Analysis", "Recommendations", "Appendix"] },
  contract: { titlePrefix: "Agreement", sections: ["Parties", "Scope of Services", "Terms", "SLA Requirements", "Payment Terms", "Termination", "Signatures"] },
  sop: { titlePrefix: "SOP", sections: ["Objective", "Prerequisites", "Step-by-Step Procedure", "Validation Checks", "Escalation Path", "Revision History"] },
  knowledge_base: { titlePrefix: "KB Article", sections: ["Question", "Answer", "Related Topics", "Last Updated"] },
  audit: { titlePrefix: "Audit Report", sections: ["Audit Scope", "Methodology", "Findings", "Risk Assessment", "Remediation Plan", "Follow-up Schedule"] },
  memo: { titlePrefix: "Memo", sections: ["To", "From", "Date", "Subject", "Background", "Action Required"] },
};

const DOMAIN_DOC_SETS = {
  hr: [
    { id: "hr-policy-leave", type: "policy", title: "Leave & Absence Policy", topic: "leave management, accrual, carry-over limits, approval workflow" },
    { id: "hr-policy-compensation", type: "policy", title: "Compensation & Pay Equity Policy", topic: "pay bands, equity reviews, adjustment criteria, market benchmarking" },
    { id: "hr-sop-onboarding", type: "sop", title: "New Hire Onboarding Procedure", topic: "system provisioning, orientation schedule, buddy assignment, compliance training" },
    { id: "hr-report-attrition", type: "report", title: "Quarterly Attrition Analysis", topic: "turnover by department, voluntary vs involuntary, exit interview themes, risk indicators" },
    { id: "hr-kb-benefits", type: "knowledge_base", title: "Benefits Enrollment FAQ", topic: "enrollment windows, plan comparison, dependent coverage, HSA contributions" },
  ],
  finance: [
    { id: "fin-policy-expense", type: "policy", title: "Travel & Expense Policy", topic: "approval thresholds, receipt requirements, per diem rates, corporate card usage" },
    { id: "fin-policy-procurement", type: "policy", title: "Procurement Authorization Policy", topic: "purchase thresholds, vendor approval, sole source justification, contract review" },
    { id: "fin-sop-close", type: "sop", title: "Month-End Close Procedure", topic: "accrual entries, reconciliation checklist, sign-off workflow, variance thresholds" },
    { id: "fin-report-variance", type: "report", title: "Budget Variance Report", topic: "actual vs budget by cost center, root cause analysis, forecast adjustments" },
    { id: "fin-audit-controls", type: "audit", title: "Internal Controls Audit", topic: "SOX compliance, segregation of duties, access reviews, remediation status" },
  ],
  it: [
    { id: "it-policy-security", type: "policy", title: "Information Security Policy", topic: "access management, data classification, incident response, encryption standards" },
    { id: "it-policy-change", type: "policy", title: "Change Management Policy", topic: "change advisory board, risk assessment, rollback procedures, emergency changes" },
    { id: "it-sop-incident", type: "sop", title: "Incident Response Procedure", topic: "severity classification, escalation matrix, communication templates, post-mortem" },
    { id: "it-report-sla", type: "report", title: "SLA Performance Report", topic: "uptime metrics, response times, resolution rates, trend analysis" },
    { id: "it-kb-access", type: "knowledge_base", title: "System Access Request FAQ", topic: "role-based access, provisioning timeline, approval chain, deprovisioning" },
  ],
  procurement: [
    { id: "proc-policy-sourcing", type: "policy", title: "Strategic Sourcing Policy", topic: "competitive bidding, supplier diversity, evaluation criteria, contract templates" },
    { id: "proc-sop-rfp", type: "sop", title: "RFP Process Procedure", topic: "requirement gathering, supplier shortlisting, evaluation scoring, negotiation" },
    { id: "proc-contract-master", type: "contract", title: "Master Services Agreement Template", topic: "service levels, liability, data protection, pricing structure, renewal terms" },
    { id: "proc-report-spend", type: "report", title: "Spend Analysis Report", topic: "category breakdown, supplier concentration, savings opportunities, compliance rate" },
    { id: "proc-audit-vendor", type: "audit", title: "Vendor Risk Assessment", topic: "financial health, compliance status, performance scores, contingency plans" },
  ],
  marketing: [
    { id: "mkt-policy-brand", type: "policy", title: "Brand Guidelines & Usage Policy", topic: "logo usage, color palette, typography, tone of voice, approval process" },
    { id: "mkt-sop-campaign", type: "sop", title: "Campaign Launch Procedure", topic: "briefing, creative approval, channel setup, tracking, post-campaign analysis" },
    { id: "mkt-report-performance", type: "report", title: "Campaign Performance Report", topic: "reach, engagement, conversion, ROI, channel attribution, A/B test results" },
    { id: "mkt-memo-budget", type: "memo", title: "Q3 Marketing Budget Reallocation", topic: "performance data, channel shift rationale, projected impact, approval request" },
    { id: "mkt-kb-tools", type: "knowledge_base", title: "Marketing Tech Stack FAQ", topic: "platform access, integration points, data flows, support contacts" },
  ],
};

export function generateDocument(docDef, domain, generatedTables) {
  const type = docDef.type || "policy";
  const template = DOC_TEMPLATES[type] || DOC_TEMPLATES.policy;
  const title = docDef.title || `${template.titlePrefix}: ${docDef.id}`;
  const topic = docDef.topic || docDef.description || domain || "general operations";
  const requiredSections = Array.isArray(docDef.requiredSections) && docDef.requiredSections.length
    ? docDef.requiredSections
    : template.sections;
  const citationAnchors = Array.isArray(docDef.citationAnchors) ? docDef.citationAnchors : [];
  const minimumWordCount = Number(docDef.minimumWordCount || 0);

  const entityRefs = pickEntityRefs(generatedTables, 3);
  const dateStr = faker.date.between({ from: "2025-01-01", to: "2026-06-01" }).toISOString().slice(0, 10);

  const lines = [
    `# ${title}`,
    "",
    `**Document ID:** ${docDef.id}`,
    `**Effective Date:** ${dateStr}`,
    `**Domain:** ${domain}`,
    `**Source System:** ${docDef.sourceSystem || docDef.sourceSystemId || "Synthetic source system"}`,
    `**Classification:** Internal`,
    "",
  ];

  for (const [sectionIndex, section] of requiredSections.entries()) {
    lines.push(`## ${section}`, "");
    const paraCount = section === "Executive Summary" || section === "Purpose" ? 2 : faker.number.int({ min: 1, max: 3 });
    for (let i = 0; i < paraCount; i++) {
      lines.push(generateParagraph(topic, entityRefs) + "\n");
    }
    if (citationAnchors[sectionIndex]) {
      lines.push(`Citation anchor: [${citationAnchors[sectionIndex]}]`, "");
    }
  }

  if (entityRefs.length > 0) {
    lines.push("## Referenced Records", "");
    for (const ref of entityRefs) {
      lines.push(`- \`${ref.id}\`: ${ref.context}`);
    }
    lines.push("");
  }

  while (minimumWordCount > 0 && lines.join("\n").split(/\s+/).filter(Boolean).length < minimumWordCount) {
    lines.push(generateParagraph(topic, entityRefs) + "\n");
  }

  lines.push("---", `*Generated for ${domain} domain demonstration. All data is synthetic.*`);

  return { title, content: lines.join("\n") };
}

export function generateDomainDocuments(domain, generatedTables) {
  const docSet = DOMAIN_DOC_SETS[domain] || DOMAIN_DOC_SETS.hr;
  return docSet.map((def) => {
    const doc = generateDocument(def, domain, generatedTables);
    return { id: def.id, title: doc.title, type: def.type, content: doc.content };
  });
}

export function generateParagraph(topic, entityRefs) {
  const subjects = [
    "This section establishes the operational framework",
    "The organization requires all stakeholders to adhere to",
    "Based on current analysis and industry benchmarks",
    "To ensure compliance with regulatory requirements",
    "The following procedures have been implemented to address",
    "Risk assessment indicates that the current approach to",
    "Performance metrics demonstrate that improvements in",
    "Cross-functional alignment is critical for effective",
  ];
  const connectors = [
    "Furthermore, ongoing monitoring ensures",
    "In addition, quarterly reviews validate",
    "The responsible parties must document",
    "Exceptions require written approval from",
    "Historical data from the past 12 months shows",
    "Automated checks verify compliance with",
  ];

  const subject = faker.helpers.arrayElement(subjects);
  const connector = faker.helpers.arrayElement(connectors);
  const topicWords = parseList(topic);
  const focus = faker.helpers.arrayElement(topicWords.length > 0 ? topicWords : ["operations"]);

  let para = `${subject} ${focus} within the defined scope. ${connector} ${focus} standards are met.`;

  if (entityRefs.length > 0 && faker.datatype.boolean({ probability: 0.4 })) {
    const ref = faker.helpers.arrayElement(entityRefs);
    para += ` See record \`${ref.id}\` for supporting evidence.`;
  }

  return para;
}

export function pickEntityRefs(generatedTables, count) {
  const refs = [];
  for (const [tableName, rows] of Object.entries(generatedTables)) {
    if (!Array.isArray(rows) || rows.length === 0) continue;
    const sample = faker.helpers.arrayElements(rows, { min: 1, max: Math.min(count, rows.length) });
    for (const row of sample) {
      const idField = Object.keys(row).find((k) => k === "id" || k.endsWith("_id")) || Object.keys(row)[0];
      refs.push({ id: String(row[idField] || ""), context: `${tableName} record (${row.name || row.title || row[idField] || ""})` });
    }
    if (refs.length >= count) break;
  }
  return refs.slice(0, count);
}
