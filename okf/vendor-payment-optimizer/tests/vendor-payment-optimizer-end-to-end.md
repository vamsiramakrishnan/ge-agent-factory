---
type: Eval Scenario
title: Run the Vendor Payment Optimizer workflow for the current period. Cite the re...
description: "Run the Vendor Payment Optimizer workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
source_id: "vendor-payment-optimizer-end-to-end"
generation_status: inferred
tags:
  - finance
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Run the Vendor Payment Optimizer workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

## Validates

- [payment-cash-aggregation](/queries/payment-cash-aggregation.md)

## Mechanisms to call

- [query_sap_s_4hana_fi_gl_entries](/tools/query-sap-s-4hana-fi-gl-entries.md)
- [query_kyriba_cash_positions](/tools/query-kyriba-cash-positions.md)
- [query_taulia_taulia_records](/tools/query-taulia-taulia-records.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [lookup_vendor_payment_optimizer_controls_playbook](/tools/lookup-vendor-payment-optimizer-controls-playbook.md)
- [action_sap_s_4hana_fi_recommend](/tools/action-sap-s-4hana-fi-recommend.md)

## Success rubric

Action recommend executed against SAP S/4HANA FI, with audit-trail entry and AP Manager / Treasurer notified of outcomes.

# Citations

- [Vendor Payment Optimizer Controls Playbook](/documents/vendor-payment-optimizer-controls-playbook.md)
