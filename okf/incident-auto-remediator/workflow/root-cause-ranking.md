---
type: Workflow Stage
title: Root Cause Ranking
description: Rank probable root causes using historical incident patterns. Match symptoms against runbook database. Score runbook applicability based on symptom similarity and past success rates.
source_id: root_cause_ranking
tags:
  - it
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Root Cause Ranking

Rank probable root causes using historical incident patterns. Match symptoms against runbook database. Score runbook applicability based on symptom similarity and past success rates.

- **Mode:** sequential
- **Stage:** 2 of 4

## Tools

- [query_bigquery_runbook_history](/tools/query-bigquery-runbook-history.md)
- [action_pagerduty_update_incident](/tools/action-pagerduty-update-incident.md)
- [evidence_runbook_library](/tools/evidence-runbook-library.md)

Next: [Context-Aware Remediation Selection](/workflow/context-aware-remediation-selection.md)
