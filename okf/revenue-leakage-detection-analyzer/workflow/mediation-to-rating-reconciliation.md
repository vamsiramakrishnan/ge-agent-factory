---
type: Workflow Stage
title: "Mediation-to-Rating Reconciliation"
description: "Pull usage_records and rated_events from Amdocs CES Billing and reconcile mediation_batch totals against rated_amount_usd by rating_group, flagging guiding_status exceptions (suspense, rejected, rerated) before they reach the next bill run."
source_id: mediation_to_rating_reconciliation
tags:
  - telco
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Mediation-to-Rating Reconciliation

Pull usage_records and rated_events from Amdocs CES Billing and reconcile mediation_batch totals against rated_amount_usd by rating_group, flagging guiding_status exceptions (suspense, rejected, rerated) before they reach the next bill run.

- **Mode:** sequential
- **Stage:** 1 of 5

## Tools

- [query_amdocs_ces_billing_billing_accounts](/tools/query-amdocs-ces-billing-billing-accounts.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [action_amdocs_ces_billing_create](/tools/action-amdocs-ces-billing-create.md)

Next: [Unbilled-Service Detection (Provisioning vs. Catalog)](/workflow/unbilled-service-detection-provisioning-vs-catalog.md)
