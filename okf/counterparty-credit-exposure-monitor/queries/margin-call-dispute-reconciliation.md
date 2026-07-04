---
type: Query Capability
title: "Reconcile open margin-call valuation breaks using Looker explore_queries and ..."
description: "Reconcile open margin-call valuation breaks using Looker explore_queries and dashboards against Murex MX.3 positions, and draft a dispute summary with both sides' valuations for the collateral team."
source_id: "margin-call-dispute-reconciliation"
generation_status: inferred
tags:
  - banking
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Reconcile open margin-call valuation breaks using Looker explore_queries and dashboards against Murex MX.3 positions, and draft a dispute summary with both sides' valuations for the collateral team.

## Tools used

- [query_murex_mx_3_trades](/tools/query-murex-mx-3-trades.md)
- [query_looker_dashboards](/tools/query-looker-dashboards.md)
- [action_murex_mx_3_file](/tools/action-murex-mx-3-file.md)

## Runs in

- [margin_call_dispute_reconciliation](/workflow/margin-call-dispute-reconciliation.md)

## Evidence expected

- source_system_record
- sql_result
- api_response
- generated_audit_trail

## Evals

- [Run the Counterparty Credit Exposure Monitor workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/counterparty-credit-exposure-monitor-end-to-end.md)

# Citations

- [Counterparty Credit Exposure Monitor Banking Compliance Policy](/documents/counterparty-credit-exposure-monitor-compliance-policy.md)
- [CSA Margin Call Dispute Resolution Runbook](/documents/csa-margin-call-dispute-runbook.md)
