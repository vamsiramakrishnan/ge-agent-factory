---
type: Query Capability
title: "Cross-reference billing_accounts.bill_cycle_day and dashboards KPI views in L..."
description: "Cross-reference billing_accounts.bill_cycle_day and dashboards KPI views in Looker against flagged rated_events to determine which upcoming bill runs would ship a misrated invoice, and size the exposure before invoice generation."
source_id: "bill-cycle-impact-assessment"
generation_status: inferred
tags:
  - telco
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Cross-reference billing_accounts.bill_cycle_day and dashboards KPI views in Looker against flagged rated_events to determine which upcoming bill runs would ship a misrated invoice, and size the exposure before invoice generation.

## Tools used

- [query_amdocs_ces_billing_billing_accounts](/tools/query-amdocs-ces-billing-billing-accounts.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [query_looker_dashboards](/tools/query-looker-dashboards.md)
- [action_amdocs_ces_billing_recommend](/tools/action-amdocs-ces-billing-recommend.md)

## Runs in

- [bill_cycle_impact_assessment](/workflow/bill-cycle-impact-assessment.md)

## Evidence expected

- source_system_record
- sql_result
- api_response
- generated_audit_trail

## Evals

- [Run the Usage Rating Anomaly Monitor workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/usage-rating-anomaly-monitor-end-to-end.md)
- [Mediation batch 44812 posted 3,900 usage_records on 2026-07-02 for rate_plan_code UNL_PLUS_5G. Rated_events show 1,340 of those events flagged zero_rated=true — versus a trailing 7-day average of 310/day for that plan — while billing_account 82234110 (bill_cycle_day 14) is scheduled to invoice on 2026-07-14. Reconcile whether this is a mediation glitch or a rating-group misconfiguration from the 2026-07-01 catalog push, and tell me whether we should hold the 07-14 cycle.](/tests/usage-rating-anomaly-monitor-zero-rate-spike.md)
- [rated_events id 700214455 (event_id 812345990, subscriber_key 3123456789) has been through 3 rerate cycles (rerate_count=3) since 2026-06-28 and is still sitting in guiding_status=suspense as of this morning, 2026-07-04. The last usage_records mediation batch touching it, batch 44790, was last refreshed 2026-07-01 — more than 72 hours ago. Finance wants it force-guided into today's bill run for billing_account 82234110. What do you do?](/tests/usage-rating-anomaly-monitor-rerate-ceiling.md)

# Citations

- [Usage Rating Anomaly Monitor Service Assurance Runbook](/documents/usage-rating-anomaly-monitor-assurance-runbook.md)
- [Rerate & Bill-Cycle Hold Governance Policy](/documents/usage-rating-anomaly-monitor-rerate-billhold-policy.md)
