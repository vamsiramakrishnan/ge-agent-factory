import { appendPackEvalHint, ensureRow, findTableDef, hasAny, hasColumn, setIfColumn, tableRows, textOf } from "./pack-utils.mjs";

const DEPARTMENT_METRICS = {
  finance: ["close_cycle_days", "auto_certified_accounts", "reconciliation_exception_rate", "working_capital_forecast_accuracy"],
  hr: ["employee_experience_score", "case_resolution_sla_rate", "offer_acceptance_rate", "learning_completion_rate"],
  it: ["incident_mttr_hours", "change_failure_rate", "service_availability_pct", "automation_remediation_rate"],
  marketing: ["campaign_pipeline_influence", "qualified_lead_conversion_rate", "content_engagement_score", "brand_compliance_rate"],
  procurement: ["addressable_spend_coverage", "supplier_risk_score", "contract_cycle_days", "sourcing_savings_rate"],
  general: ["operational_health_score", "backlog_resolution_rate", "forecast_accuracy", "exception_rate"],
};

function metricNamesFor(schema) {
  const department = schema?.useCaseSpec?.department || schema?.domain || "general";
  const base = DEPARTMENT_METRICS[department] || DEPARTMENT_METRICS.general;
  const title = String(schema?.useCaseSpec?.title || "").toLowerCase();
  if (/forecast|predict/.test(title)) return ["forecast_accuracy", "projected_variance_pct", ...base].slice(0, 4);
  if (/risk|compliance|control|audit/.test(title)) return ["risk_exposure_score", "control_exception_rate", ...base].slice(0, 4);
  if (/sla|ticket|incident|case/.test(title)) return ["sla_attainment_rate", "backlog_aging_days", ...base].slice(0, 4);
  return base;
}

function setMetricRow(row, columns, metricName, index, options = {}) {
  const period = options.period || ["week", "month", "quarter"][index % 3];
  const baseline = options.baseline ?? 120 + index * 17;
  const variance = options.variance ?? [-12.5, -4.2, 3.8, 9.6][index % 4];
  const value = options.value ?? Number((baseline * (1 + variance / 100)).toFixed(2));
  setIfColumn(row, columns, "period", period);
  setIfColumn(row, columns, "metric_name", metricName);
  setIfColumn(row, columns, "value", value);
  setIfColumn(row, columns, "variance_pct", variance);
  setIfColumn(row, columns, "computed_at", options.computedAt || `2026-05-${String(24 + (index % 7)).padStart(2, "0")}`);
  setIfColumn(row, columns, "status", variance < -10 ? "at_risk" : variance > 8 ? "above_target" : "on_track");
}

function seedMetricTable(schema, generatedTables, tableName, metrics, options = {}) {
  const tableDef = findTableDef(schema, tableName);
  const rows = tableRows(generatedTables, tableName);
  if (!tableDef || !rows.length || !hasColumn(tableDef, "metric_name")) return;
  metrics.forEach((metricName, index) => {
    const row = ensureRow(rows, index);
    setMetricRow(row, tableDef.columns, metricName, index, options);
  });
}

function connectAnalyticsEvents(schema, generatedTables) {
  const eventsDef = findTableDef(schema, "analytics_events");
  const history = tableRows(generatedTables, "historical_metrics");
  const events = tableRows(generatedTables, "analytics_events");
  if (!eventsDef || !events.length || !history.length) return;
  events.slice(0, Math.min(events.length, history.length)).forEach((row, index) => {
    const metricName = history[index]?.metric_name || row.metric_name || `metric_${index + 1}`;
    setMetricRow(row, eventsDef.columns, metricName, index, {
      variance: [-15.1, -6.4, 2.7, 11.3][index % 4],
      computedAt: `2026-05-${String(25 + (index % 6)).padStart(2, "0")}`,
    });
    setIfColumn(row, eventsDef.columns, "historical_metric_id", history[index]?.id || row.historical_metric_id);
  });
}

function seedGenericAnalyticsTables(schema, generatedTables, metrics) {
  for (const tableDef of schema?.tables || []) {
    const tableName = tableDef.name;
    if (["analytics_events", "historical_metrics", "cached_aggregates"].includes(tableName)) continue;
    if (!hasColumn(tableDef, "metric_name") || !hasColumn(tableDef, "value")) continue;
    const rows = tableRows(generatedTables, tableName);
    if (!rows.length) continue;
    metrics.forEach((metricName, index) => {
      setMetricRow(ensureRow(rows, index), tableDef.columns, metricName, index, {
        variance: [-8.2, 1.5, 6.9, 14.4][index % 4],
      });
    });
  }
}

export const analyticsPack = {
  id: "system_analytics",
  layer: "system",
  description: "Common analytics warehouse/reporting recipe for BigQuery, Looker, dashboards, metrics, trends, and forecast use cases.",
  systems: ["bigquery", "looker", "google_bigquery"],
  capabilities: ["analytics", "dashboard", "forecast", "metrics", "fixture_recipe"],
  simulatorInterop: {
    archetypes: ["data_platform", "digital_analytics", "planning_epm"],
    collections: ["datasets", "tables", "pipelines", "jobs", "quality_checks", "events", "conversions"],
    materializes: "analytics tables, metric rows, forecasts, freshness signals, and quality checks into simulator seed overlays",
  },
  match(context) {
    return hasAny(textOf(context), [/bigquery/, /looker/, /analytics_events/, /historical_metrics/, /cached_aggregates/, /dashboard/, /forecast/, /metric/]);
  },
  apply({ schema, generatedTables }) {
    const metrics = metricNamesFor(schema);
    seedMetricTable(schema, generatedTables, "historical_metrics", metrics, { variance: 0, computedAt: "2026-04-30" });
    seedMetricTable(schema, generatedTables, "cached_aggregates", metrics, { variance: 4.8, computedAt: "2026-05-31" });
    connectAnalyticsEvents(schema, generatedTables);
    seedGenericAnalyticsTables(schema, generatedTables, metrics);
  },
  enrichContract({ contract }) {
    appendPackEvalHint(contract, {
      packId: "system_analytics",
      expectedToolKinds: ["query", "calculation"],
      mustReferenceEntities: ["analytics_events", "historical_metrics", "cached_aggregates"],
      successCriteria: ["Derive metric claims from warehouse-backed rows.", "Compare current values against historical or cached baselines.", "Call out negative variance and stale computed_at dates."],
      refusalRules: ["Do not invent metric values, trends, or forecast confidence when analytics rows are missing."],
    });
  },
};
