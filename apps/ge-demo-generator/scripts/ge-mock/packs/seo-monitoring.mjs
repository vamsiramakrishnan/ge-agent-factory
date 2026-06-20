import { appendPackEvalHint, findTableDef, hasAny, setIfColumn, tableRows, textOf } from "./pack-utils.mjs";

function seedSeoTable(schema, generatedTables, tableName) {
  const tableDef = findTableDef(schema, tableName);
  const rows = tableRows(generatedTables, tableName);
  if (!tableDef || !rows.length) return;
  rows.slice(0, 4).forEach((row, index) => {
    setIfColumn(row, tableDef.columns, "status", ["active", "pending", "closed", "active"][index]);
    setIfColumn(row, tableDef.columns, "owner", ["SEO Lead", "Web Ops", "Content Strategist", "Growth Analyst"][index]);
    setIfColumn(row, tableDef.columns, "created_at", `2026-05-${String(15 + index).padStart(2, "0")}`);
    setIfColumn(row, tableDef.columns, "notes", `${tableName} seeded with ranking, crawler, and remediation evidence for technical SEO monitoring.`);
  });
}

export const seoMonitoringPack = {
  id: "system_seo_monitoring",
  layer: "system",
  description: "Common SEO and web-performance monitoring recipe for Search Console, Ahrefs, crawlers, keyword rankings, and technical remediation.",
  departments: ["marketing"],
  systems: ["google_search_console", "ahrefs", "screaming_frog"],
  capabilities: ["seo", "web_monitoring", "crawler_findings", "rankings", "fixture_recipe"],
  simulatorInterop: {
    archetypes: ["digital_analytics", "external_intelligence"],
    collections: ["properties", "events", "conversions", "audiences", "experiments", "signals", "source_feeds"],
    materializes: "SEO ranking, crawl finding, site property, and external signal rows into analytics simulator seeds",
  },
  match(context) {
    return hasAny(textOf(context), [/google_search_console/, /ahrefs/, /screaming_frog/, /\bseo\b/, /keyword_rankings/, /crawler/, /search console/]);
  },
  apply({ schema, generatedTables }) {
    seedSeoTable(schema, generatedTables, "keyword_rankings");
    seedSeoTable(schema, generatedTables, "crawler_findings");
    seedSeoTable(schema, generatedTables, "google_search_console_records");
    seedSeoTable(schema, generatedTables, "ahrefs_records");
    seedSeoTable(schema, generatedTables, "screaming_frog_records");
  },
  enrichContract({ contract }) {
    appendPackEvalHint(contract, {
      packId: "system_seo_monitoring",
      expectedToolKinds: ["query", "calculation", "notification"],
      mustReferenceEntities: ["keyword_rankings", "crawler_findings", "google_search_console_records"],
      successCriteria: ["Ground SEO recommendations in ranking, crawl, and search-console evidence.", "Prioritize pending or active findings before closed issues.", "Avoid overclaiming traffic impact without analytics evidence."],
      refusalRules: ["Do not state SEO impact, ranking change, or crawl health without source-system evidence."],
    });
  },
};
