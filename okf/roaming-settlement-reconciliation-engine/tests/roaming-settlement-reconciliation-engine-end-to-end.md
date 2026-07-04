---
type: Eval Scenario
title: Run the Roaming Settlement Reconciliation Engine workflow for the current per...
description: "Run the Roaming Settlement Reconciliation Engine workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
source_id: "roaming-settlement-reconciliation-engine-end-to-end"
generation_status: inferred
tags:
  - telco
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Run the Roaming Settlement Reconciliation Engine workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

## Validates

- [tap-bce-file-intake-mediation-batch-validation](/queries/tap-bce-file-intake-mediation-batch-validation.md)

## Mechanisms to call

- [query_amdocs_ces_billing_billing_accounts](/tools/query-amdocs-ces-billing-billing-accounts.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [query_looker_dashboards](/tools/query-looker-dashboards.md)
- [lookup_roaming_settlement_reconciliation_engine_assurance_runbook](/tools/lookup-roaming-settlement-reconciliation-engine-assurance-runbook.md)
- [action_amdocs_ces_billing_file](/tools/action-amdocs-ces-billing-file.md)

## Success rubric

Action file executed against Amdocs CES Billing, with audit-trail entry and Wholesale Settlements Analyst notified of outcomes.

# Citations

- [Roaming Settlement Reconciliation Engine Service Assurance Runbook](/documents/roaming-settlement-reconciliation-engine-assurance-runbook.md)
