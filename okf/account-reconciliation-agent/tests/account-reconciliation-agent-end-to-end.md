---
type: Eval Scenario
title: Run the Account Reconciliation Agent workflow for the current period. Cite th...
description: "Run the Account Reconciliation Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
source_id: "account-reconciliation-agent-end-to-end"
generation_status: inferred
tags:
  - finance
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Run the Account Reconciliation Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

## Validates

- [balance-document-pull](/queries/balance-document-pull.md)

## Mechanisms to call

- [query_sap_s_4hana_fi_gl_entries](/tools/query-sap-s-4hana-fi-gl-entries.md)
- [query_blackline_reconciliations](/tools/query-blackline-reconciliations.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [lookup_account_reconciliation_agent_controls_playbook](/tools/lookup-account-reconciliation-agent-controls-playbook.md)
- [action_sap_s_4hana_fi_close](/tools/action-sap-s-4hana-fi-close.md)

## Success rubric

Action close executed against SAP S/4HANA FI, with audit-trail entry and Controller notified of outcomes.

# Citations

- [Account Reconciliation Agent Controls Playbook](/documents/account-reconciliation-agent-controls-playbook.md)
