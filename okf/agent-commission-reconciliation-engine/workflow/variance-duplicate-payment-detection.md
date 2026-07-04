---
type: Workflow Stage
title: "Variance & Duplicate-Payment Detection"
description: "Compare billing_accounts and premium_invoices against BigQuery historical_metrics and cached_aggregates baselines using query_bigquery_analytics_events to flag rate mismatches, missed chargebacks, and duplicate commission payments before they reach the statement."
source_id: variance_duplicate_payment_detection
tags:
  - insurance
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Variance & Duplicate-Payment Detection

Compare billing_accounts and premium_invoices against BigQuery historical_metrics and cached_aggregates baselines using query_bigquery_analytics_events to flag rate mismatches, missed chargebacks, and duplicate commission payments before they reach the statement.

- **Mode:** sequential
- **Stage:** 3 of 5

## Tools

- [query_guidewire_billingcenter_billing_accounts](/tools/query-guidewire-billingcenter-billing-accounts.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [lookup_agent_commission_reconciliation_engine_authority_guide](/tools/lookup-agent-commission-reconciliation-engine-authority-guide.md)

Next: [Dispute Evidence & Variance Reporting](/workflow/dispute-evidence-variance-reporting.md)
