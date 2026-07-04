---
type: Eval Scenario
title: "Run the HiPo Identification & Nomination Agent workflow for the current perio..."
description: "Run the HiPo Identification & Nomination Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
source_id: "hipo-identification-nomination-agent-end-to-end"
generation_status: inferred
tags:
  - hr
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Run the HiPo Identification & Nomination Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

## Validates

- [signal-collection](/queries/signal-collection.md)

## Mechanisms to call

- [query_workday_employees](/tools/query-workday-employees.md)
- [query_360_platform_360_platform_records](/tools/query-360-platform-360-platform-records.md)
- [query_google_bigquery_analytics_events](/tools/query-google-bigquery-analytics-events.md)
- [query_lms_lms_records](/tools/query-lms-lms-records.md)
- [lookup_hipo_identification_nomination_agent_policy_handbook](/tools/lookup-hipo-identification-nomination-agent-policy-handbook.md)

## Success rubric

CHRO receives a fully-cited recommendation; no external state change without explicit approval.

# Citations

- [HiPo Identification & Nomination Agent Policy Handbook](/documents/hipo-identification-nomination-agent-policy-handbook.md)
