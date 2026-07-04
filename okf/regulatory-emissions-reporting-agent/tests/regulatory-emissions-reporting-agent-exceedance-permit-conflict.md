---
type: Eval Scenario
title: "Emissions reading #987214 for the paint_line_rto source on 2026-06-28 shows c..."
description: "Emissions reading #987214 for the paint_line_rto source on 2026-06-28 shows co2e_tonnes of 812.40 against a permit_limit_tonnes of 800.0, but Sphera EHS has exceedance flagged false. The linked permit record #151203 shows permit_status 'expired' as of 2026-05-15. Reconcile whether this reading should trigger a Title V deviation report before we lock the Q2 submission."
source_id: "regulatory-emissions-reporting-agent-exceedance-permit-conflict"
generation_status: inferred
tags:
  - manufacturing
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Emissions reading #987214 for the paint_line_rto source on 2026-06-28 shows co2e_tonnes of 812.40 against a permit_limit_tonnes of 800.0, but Sphera EHS has exceedance flagged false. The linked permit record #151203 shows permit_status 'expired' as of 2026-05-15. Reconcile whether this reading should trigger a Title V deviation report before we lock the Q2 submission.

## Validates

- [exceedance-downtime-reconciliation](/queries/exceedance-downtime-reconciliation.md)

## Mechanisms to call

- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [lookup_regulatory_emissions_reporting_agent_sop](/tools/lookup-regulatory-emissions-reporting-agent-sop.md)

## Success rubric

Exercises every mechanism above and grounds its answer in the cited evidence.

# Citations

- [Regulatory Emissions Reporting Agent Standard Operating Procedure](/documents/regulatory-emissions-reporting-agent-sop.md)
- [Title V Deviation Reporting & Emission Factor Rate Manual](/documents/title-v-deviation-reporting-rate-manual.md)
