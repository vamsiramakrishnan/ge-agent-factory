---
type: Eval Scenario
title: "Policy PC-100234 shows policy_status = in_force in the latest Guidewire Polic..."
description: "Policy PC-100234 shows policy_status = in_force in the latest Guidewire PolicyCenter pull dated 2026-06-28, but the BigQuery analytics_events snapshot backing exam data call ABC-2026-014 is dated 2026-05-10 (49 days stale). The examiner's data call requests the current disclosure-timeliness metric for this policy's segment. Prepare the response package for this line item."
source_id: "market-conduct-exam-prep-orchestrator-stale-evidence-reconciliation"
generation_status: inferred
tags:
  - insurance
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Policy PC-100234 shows policy_status = in_force in the latest Guidewire PolicyCenter pull dated 2026-06-28, but the BigQuery analytics_events snapshot backing exam data call ABC-2026-014 is dated 2026-05-10 (49 days stale). The examiner's data call requests the current disclosure-timeliness metric for this policy's segment. Prepare the response package for this line item.

## Validates

- [naic-baseline-self-audit](/queries/naic-baseline-self-audit.md)

## Mechanisms to call

- [query_guidewire_policycenter_policies](/tools/query-guidewire-policycenter-policies.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [lookup_market_conduct_exam_prep_orchestrator_authority_guide](/tools/lookup-market-conduct-exam-prep-orchestrator-authority-guide.md)

## Success rubric

Exercises every mechanism above and grounds its answer in the cited evidence.

# Citations

- [Market Conduct Exam Prep Orchestrator Authority & Referral Guide](/documents/market-conduct-exam-prep-orchestrator-authority-guide.md)
- [NAIC Market Conduct Data Call Response Playbook](/documents/naic-market-conduct-data-call-response-playbook.md)
