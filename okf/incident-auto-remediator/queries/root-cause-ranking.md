---
type: Query Capability
title: Rank probable root causes using historical incident patterns. Match symptoms ...
description: Rank probable root causes using historical incident patterns. Match symptoms against runbook database. Score runbook applicability based on symptom similarity and past success rates.
source_id: "root-cause-ranking"
generation_status: inferred
tags:
  - it
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Rank probable root causes using historical incident patterns. Match symptoms against runbook database. Score runbook applicability based on symptom similarity and past success rates.

## Tools used

- [query_bigquery_runbook_history](/tools/query-bigquery-runbook-history.md)
- [action_pagerduty_update_incident](/tools/action-pagerduty-update-incident.md)
- [evidence_runbook_library](/tools/evidence-runbook-library.md)

## Runs in

- [root_cause_ranking](/workflow/root-cause-ranking.md)

## Evidence expected

- sql_result
- api_response
- document_reference

## Evals

- [PagerDuty alert INC-0042: High memory on checkout-api pod, severity Sev-2. Last deployment was 3 days ago. Datadog shows gradual memory growth over 6 hours. Recommend and execute restart after SRE approval.](/tests/memory-leak-restart-happy-path.md)
- [PagerDuty alert INC-0043: Error rate spike on user-api, Sev-1. Deployment 10 minutes ago (v2.14.5 → v2.14.6). Datadog shows errors in new code path. Recommend rollback after SRE approval.](/tests/post-deploy-regression-rollback.md)
- [PagerDuty alert INC-0044: Database connection pool exhaustion, Sev-1. No matching runbook. Request SRE Manager assessment.](/tests/sev1-escalation-no-auto-action.md)

# Citations

- [SRE Runbook Library](/documents/sre-runbook-library.md)
- [Production Change Approval Policy](/documents/production-change-approval-policy.md)
