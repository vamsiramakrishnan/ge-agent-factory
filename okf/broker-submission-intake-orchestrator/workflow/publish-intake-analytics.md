---
type: Workflow Stage
title: "Publish & Intake Analytics"
description: "Execute action_duck_creek_policy_publish once evidence gates pass, and publish the clean submission dataset to BigQuery analytics_events and historical_metrics (query_bigquery_analytics_events) so submission data entry time and follow-up cycle KPIs stay current for the Underwriting Assistant."
source_id: publish_intake_analytics
tags:
  - insurance
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Publish & Intake Analytics

Execute action_duck_creek_policy_publish once evidence gates pass, and publish the clean submission dataset to BigQuery analytics_events and historical_metrics (query_bigquery_analytics_events) so submission data entry time and follow-up cycle KPIs stay current for the Underwriting Assistant.

- **Mode:** sequential
- **Stage:** 5 of 5

## Tools

- [query_duck_creek_policy_policy_forms](/tools/query-duck-creek-policy-policy-forms.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [lookup_broker_submission_intake_orchestrator_authority_guide](/tools/lookup-broker-submission-intake-orchestrator-authority-guide.md)
- [action_duck_creek_policy_publish](/tools/action-duck-creek-policy-publish.md)
