---
type: Eval Scenario
title: Run the Regulatory Change Monitor workflow for the current period. Cite the r...
description: "Run the Regulatory Change Monitor workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
source_id: "regulatory-change-monitor-end-to-end"
generation_status: inferred
tags:
  - finance
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Run the Regulatory Change Monitor workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

## Validates

- [regulatory-feed-monitoring](/queries/regulatory-feed-monitoring.md)

## Mechanisms to call

- [query_bloomberg_tax_bloomberg_tax_records](/tools/query-bloomberg-tax-bloomberg-tax-records.md)
- [query_cch_answerconnect_cch_answerconnect_records](/tools/query-cch-answerconnect-cch-answerconnect-records.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [lookup_regulatory_change_monitor_controls_playbook](/tools/lookup-regulatory-change-monitor-controls-playbook.md)

## Success rubric

Tax Director receives a fully-cited recommendation; no external state change without explicit approval.

# Citations

- [Regulatory Change Monitor Controls Playbook](/documents/regulatory-change-monitor-controls-playbook.md)
