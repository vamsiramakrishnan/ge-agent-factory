---
type: Eval Scenario
title: Run the Transfer Pricing Monitor workflow for the current period. Cite the re...
description: "Run the Transfer Pricing Monitor workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
source_id: "transfer-pricing-monitor-end-to-end"
generation_status: inferred
tags:
  - finance
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Run the Transfer Pricing Monitor workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

## Validates

- [ic-transaction-extraction](/queries/ic-transaction-extraction.md)

## Mechanisms to call

- [query_sap_s_4hana_fi_gl_entries](/tools/query-sap-s-4hana-fi-gl-entries.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [query_finance_3_finance_3_records](/tools/query-finance-3-finance-3-records.md)
- [lookup_transfer_pricing_monitor_controls_playbook](/tools/lookup-transfer-pricing-monitor-controls-playbook.md)
- [action_sap_s_4hana_fi_generate](/tools/action-sap-s-4hana-fi-generate.md)

## Success rubric

Action generate executed against SAP S/4HANA FI, with audit-trail entry and Tax Director notified of outcomes.

# Citations

- [Transfer Pricing Monitor Controls Playbook](/documents/transfer-pricing-monitor-controls-playbook.md)
