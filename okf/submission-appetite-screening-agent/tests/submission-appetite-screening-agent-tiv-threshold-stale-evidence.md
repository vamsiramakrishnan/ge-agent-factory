---
type: Eval Scenario
title: "Submission 51190 (insured Harbor Ridge Manufacturing LLC, NAICS 332312, ACORD..."
description: "Submission 51190 (insured Harbor Ridge Manufacturing LLC, NAICS 332312, ACORD_125_commercial_app) lists total_insured_value of $24,800,000 in Guidewire PolicyCenter as of 2026-07-01, but the broker's cover letter references a revised property schedule that would push TIV to $26,100,000. The BigQuery analytics_events snapshot used for the turnaround KPI is dated 2026-06-20. Screen this submission and tell me if it's in appetite."
source_id: "submission-appetite-screening-agent-tiv-threshold-stale-evidence"
generation_status: inferred
tags:
  - insurance
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Submission 51190 (insured Harbor Ridge Manufacturing LLC, NAICS 332312, ACORD_125_commercial_app) lists total_insured_value of $24,800,000 in Guidewire PolicyCenter as of 2026-07-01, but the broker's cover letter references a revised property schedule that would push TIV to $26,100,000. The BigQuery analytics_events snapshot used for the turnaround KPI is dated 2026-06-20. Screen this submission and tell me if it's in appetite.

## Validates

- [submission-intake-acord-data-capture](/queries/submission-intake-acord-data-capture.md)

## Mechanisms to call

- [query_guidewire_policycenter_policies](/tools/query-guidewire-policycenter-policies.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [lookup_submission_appetite_screening_agent_authority_guide](/tools/lookup-submission-appetite-screening-agent-authority-guide.md)

## Success rubric

Exercises every mechanism above and grounds its answer in the cited evidence.

# Citations

- [Submission Appetite Screening Agent Authority & Referral Guide](/documents/submission-appetite-screening-agent-authority-guide.md)
