---
type: Eval Scenario
title: Run the Cash Application Agent workflow for the current period. Cite the rele...
description: "Run the Cash Application Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
source_id: "cash-application-agent-end-to-end"
generation_status: inferred
tags:
  - finance
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Run the Cash Application Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

## Validates

- [ml-invoice-matching](/queries/ml-invoice-matching.md)

## Mechanisms to call

- [query_highradius_payment_remittances](/tools/query-highradius-payment-remittances.md)
- [query_sap_s_4hana_fi_gl_entries](/tools/query-sap-s-4hana-fi-gl-entries.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [lookup_cash_application_agent_controls_playbook](/tools/lookup-cash-application-agent-controls-playbook.md)
- [action_highradius_match](/tools/action-highradius-match.md)

## Success rubric

Action match executed against HighRadius, with audit-trail entry and AR Specialist notified of outcomes.

# Citations

- [Cash Application Agent Controls Playbook](/documents/cash-application-agent-controls-playbook.md)
