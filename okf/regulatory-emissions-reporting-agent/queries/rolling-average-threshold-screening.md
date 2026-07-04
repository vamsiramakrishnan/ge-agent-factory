---
type: Query Capability
title: "Compare each emission_source's co2e_tonnes trend against historical_metrics a..."
description: "Compare each emission_source's co2e_tonnes trend against historical_metrics and cached_aggregates baselines in BigQuery to flag any pollutant rolling average heading toward its permit_limit_tonnes before the quarter closes."
source_id: "rolling-average-threshold-screening"
generation_status: inferred
tags:
  - manufacturing
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Compare each emission_source's co2e_tonnes trend against historical_metrics and cached_aggregates baselines in BigQuery to flag any pollutant rolling average heading toward its permit_limit_tonnes before the quarter closes.

## Tools used

- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)

## Runs in

- [rolling_average_threshold_screening](/workflow/rolling-average-threshold-screening.md)

## Evidence expected

- sql_result

## Evals

- [Run the Regulatory Emissions Reporting Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/regulatory-emissions-reporting-agent-end-to-end.md)
- [Emissions reading #987214 for the paint_line_rto source on 2026-06-28 shows co2e_tonnes of 812.40 against a permit_limit_tonnes of 800.0, but Sphera EHS has exceedance flagged false. The linked permit record #151203 shows permit_status 'expired' as of 2026-05-15. Reconcile whether this reading should trigger a Title V deviation report before we lock the Q2 submission.](/tests/regulatory-emissions-reporting-agent-exceedance-permit-conflict.md)
- [The CEMS analyzer on asset #148820 (boiler_stack) last posted a sensor_reading at 2026-06-30T22:00:00Z, and the OSIsoft PI System shows a downtime_event on the same asset starting 2026-07-01T06:00:00Z for 'breakdown' lasting 640 minutes. BigQuery's cached_aggregates for the June monthly period already report full CO2e coverage for that source. Should June's boiler_stack emissions go into the report as-is?](/tests/regulatory-emissions-reporting-agent-stale-cems-evidence-gap.md)

# Citations

- [Regulatory Emissions Reporting Agent Standard Operating Procedure](/documents/regulatory-emissions-reporting-agent-sop.md)
- [Title V Deviation Reporting & Emission Factor Rate Manual](/documents/title-v-deviation-reporting-rate-manual.md)
