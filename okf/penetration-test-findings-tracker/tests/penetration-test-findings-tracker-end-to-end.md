---
type: Eval Scenario
title: Run the Penetration Test Findings Tracker workflow for the current period. Ci...
description: "Run the Penetration Test Findings Tracker workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
source_id: "penetration-test-findings-tracker-end-to-end"
generation_status: inferred
tags:
  - it
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Run the Penetration Test Findings Tracker workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

## Validates

- [ticket-creation-tracking](/queries/ticket-creation-tracking.md)

## Mechanisms to call

- [query_jira_issues](/tools/query-jira-issues.md)
- [query_hackerone_hackerone_records](/tools/query-hackerone-hackerone-records.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [lookup_penetration_test_findings_tracker_runbook](/tools/lookup-penetration-test-findings-tracker-runbook.md)
- [action_jira_recommend](/tools/action-jira-recommend.md)

## Success rubric

Action recommend executed against Jira, with audit-trail entry and Security Analyst notified of outcomes.

# Citations

- [Penetration Test Findings Tracker Operations Runbook](/documents/penetration-test-findings-tracker-runbook.md)
