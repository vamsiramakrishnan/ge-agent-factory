---
type: Eval Scenario
title: Run the Agency Production Performance Monitor workflow for the current period...
description: "Run the Agency Production Performance Monitor workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
source_id: "agency-production-performance-monitor-end-to-end"
generation_status: inferred
tags:
  - insurance
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Run the Agency Production Performance Monitor workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

## Validates

- [agency-book-scan-baseline-pull](/queries/agency-book-scan-baseline-pull.md)

## Mechanisms to call

- [query_duck_creek_policy_policy_forms](/tools/query-duck-creek-policy-policy-forms.md)
- [query_salesforce_marketing_cloud_accounts](/tools/query-salesforce-marketing-cloud-accounts.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [query_looker_dashboards](/tools/query-looker-dashboards.md)
- [lookup_agency_production_performance_monitor_authority_guide](/tools/lookup-agency-production-performance-monitor-authority-guide.md)
- [action_duck_creek_policy_recommend](/tools/action-duck-creek-policy-recommend.md)

## Success rubric

Action recommend executed against Duck Creek Policy, with audit-trail entry and Agency Distribution Manager notified of outcomes.

# Citations

- [Agency Production Performance Monitor Authority & Referral Guide](/documents/agency-production-performance-monitor-authority-guide.md)
