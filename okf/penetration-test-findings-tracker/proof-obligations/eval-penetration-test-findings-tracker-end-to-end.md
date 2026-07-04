---
type: Proof Obligation
title: "Golden eval obligation — Run the Penetration Test Findings Tracker workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
description: golden eval proof obligation
source_id: "eval-penetration-test-findings-tracker-end-to-end"
tags:
  - it
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
source_kind: generationSpec
source_path: behaviorContract.goldenEvals.0
generation_status: generated
ge_status: generated
---

# Golden eval obligation — Run the Penetration Test Findings Tracker workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

- **Kind:** golden eval
- **Spec source:** behaviorContract.goldenEvals.0
- **Eval:** [penetration-test-findings-tracker-end-to-end](/tests/penetration-test-findings-tracker-end-to-end.md)


## Mechanisms

- [query_jira_issues](/tools/query-jira-issues.md)
- [query_hackerone_hackerone_records](/tools/query-hackerone-hackerone-records.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [lookup_penetration_test_findings_tracker_runbook](/tools/lookup-penetration-test-findings-tracker-runbook.md)
- [action_jira_recommend](/tools/action-jira-recommend.md)

## Entities that must be referenced

- issues
- hackerone_records
- analytics_events

## Forbidden behaviors

- do not invent KPI numbers
- do not skip the evidence_lookup step before any recommendation
- do not execute recommend without two-system evidence

# Citations

- [penetration-test-findings-tracker-runbook](/documents/penetration-test-findings-tracker-runbook.md)
