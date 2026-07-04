---
type: Index
title: Query Capabilities
description: "The questions and requests this agent can answer, each with the tools it uses."
timestamp: "2026-07-04T00:00:00.000Z"
---

# Query Capabilities

- [Query policy_forms, rating_worksheets, and endorsement_records from Duck Creek Policy and accounts/opportunities from Salesforce Marketing Cloud (query_duck_creek_policy_policy_forms, query_salesforce_marketing_cloud_accounts) to assemble the current-period production picture per agency.](/queries/agency-book-scan-baseline-pull.md)
- [Compare current quote volume, hit ratio, and retention signals against BigQuery historical_metrics and analytics_events via query_bigquery_analytics_events to flag agencies whose production has slipped past the Agency Distribution Manager's threshold.](/queries/variance-scoring-against-historical-baseline.md)
- [Cross-check every flagged-agency finding against the Agency Production Performance Monitor Authority & Referral Guide using lookup_agency_production_performance_monitor_authority_guide before any recommendation or outreach is queued.](/queries/authority-guide-validation.md)
- [Pull Looker dashboards and metric_definitions via query_looker_dashboards to build the trend-chart briefing pack and recommended talking points ahead of the distribution manager's agency visit.](/queries/briefing-pack-talking-point-assembly.md)
- [Execute action_duck_creek_policy_recommend with a full audit trail and, where two-system evidence supports it, hand off segmented re-engagement campaign triggers through Salesforce Marketing Cloud campaign_influence.](/queries/recommend-re-engagement-execution.md)
