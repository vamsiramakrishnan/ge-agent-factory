---
type: Eval Scenario
title: Run the Early Payment Discount Agent workflow for the current period. Cite th...
description: "Run the Early Payment Discount Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
source_id: "early-payment-discount-agent-end-to-end"
generation_status: inferred
tags:
  - finance
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Run the Early Payment Discount Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

## Validates

- [discount-eligibility-scan](/queries/discount-eligibility-scan.md)

## Mechanisms to call

- [query_sap_s_4hana_fi_gl_entries](/tools/query-sap-s-4hana-fi-gl-entries.md)
- [query_taulia_taulia_records](/tools/query-taulia-taulia-records.md)
- [query_c2fo_c2fo_records](/tools/query-c2fo-c2fo-records.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [lookup_early_payment_discount_agent_controls_playbook](/tools/lookup-early-payment-discount-agent-controls-playbook.md)
- [action_sap_s_4hana_fi_recommend](/tools/action-sap-s-4hana-fi-recommend.md)

## Success rubric

Action recommend executed against SAP S/4HANA FI, with audit-trail entry and AP Manager / Treasurer notified of outcomes.

# Citations

- [Early Payment Discount Agent Controls Playbook](/documents/early-payment-discount-agent-controls-playbook.md)
