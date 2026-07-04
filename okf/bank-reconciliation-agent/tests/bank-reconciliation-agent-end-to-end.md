---
type: Eval Scenario
title: Run the Bank Reconciliation Agent workflow for the current period. Cite the r...
description: "Run the Bank Reconciliation Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
source_id: "bank-reconciliation-agent-end-to-end"
generation_status: inferred
tags:
  - finance
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Run the Bank Reconciliation Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

## Validates

- [clearing-reporting](/queries/clearing-reporting.md)

## Mechanisms to call

- [query_kyriba_cash_positions](/tools/query-kyriba-cash-positions.md)
- [query_sap_s_4hana_fi_gl_entries](/tools/query-sap-s-4hana-fi-gl-entries.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [lookup_bank_reconciliation_agent_controls_playbook](/tools/lookup-bank-reconciliation-agent-controls-playbook.md)
- [action_kyriba_match](/tools/action-kyriba-match.md)

## Success rubric

Action match executed against Kyriba, with audit-trail entry and Treasury Accountant notified of outcomes.

# Citations

- [Bank Reconciliation Agent Controls Playbook](/documents/bank-reconciliation-agent-controls-playbook.md)
