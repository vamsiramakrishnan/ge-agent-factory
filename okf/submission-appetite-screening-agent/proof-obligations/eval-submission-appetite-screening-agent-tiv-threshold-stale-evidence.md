---
type: Proof Obligation
title: "Golden eval obligation — Submission 51190 (insured Harbor Ridge Manufacturing LLC, NAICS 332312, ACORD_125_commercial_app) lists total_insured_value of $24,800,000 in Guidewire PolicyCenter as of 2026-07-01, but the broker's cover letter references a revised property schedule that would push TIV to $26,100,000. The BigQuery analytics_events snapshot used for the turnaround KPI is dated 2026-06-20. Screen this submission and tell me if it's in appetite."
description: golden eval proof obligation
source_id: "eval-submission-appetite-screening-agent-tiv-threshold-stale-evidence"
tags:
  - insurance
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
source_kind: generationSpec
source_path: behaviorContract.goldenEvals.4
generation_status: generated
ge_status: generated
---

# Golden eval obligation — Submission 51190 (insured Harbor Ridge Manufacturing LLC, NAICS 332312, ACORD_125_commercial_app) lists total_insured_value of $24,800,000 in Guidewire PolicyCenter as of 2026-07-01, but the broker's cover letter references a revised property schedule that would push TIV to $26,100,000. The BigQuery analytics_events snapshot used for the turnaround KPI is dated 2026-06-20. Screen this submission and tell me if it's in appetite.

- **Kind:** golden eval
- **Spec source:** behaviorContract.goldenEvals.4
- **Eval:** [submission-appetite-screening-agent-tiv-threshold-stale-evidence](/tests/submission-appetite-screening-agent-tiv-threshold-stale-evidence.md)


## Mechanisms

- [query_guidewire_policycenter_policies](/tools/query-guidewire-policycenter-policies.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [lookup_submission_appetite_screening_agent_authority_guide](/tools/lookup-submission-appetite-screening-agent-authority-guide.md)

## Entities that must be referenced

- underwriting_submissions
- analytics_events

## Forbidden behaviors

- confirming in-appetite status using the stale analytics_events snapshot without a fresh re-query
- ignoring the broker's referenced TIV revision that could push the submission past the large-account authority threshold

# Citations

- [submission-appetite-screening-agent-authority-guide](/documents/submission-appetite-screening-agent-authority-guide.md)
