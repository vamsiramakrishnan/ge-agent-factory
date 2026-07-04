---
type: Query Capability
title: "Aggregate performance data, 360 feedback, learning velocity, and project impa..."
description: "Aggregate performance data, 360 feedback, learning velocity, and project impact signals from Workday. Combine with assessment results in BigQuery."
source_id: "signal-collection"
generation_status: inferred
tags:
  - hr
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Aggregate performance data, 360 feedback, learning velocity, and project impact signals from Workday. Combine with assessment results in BigQuery.

## Tools used

- [query_workday_employees](/tools/query-workday-employees.md)
- [query_360_platform_360_platform_records](/tools/query-360-platform-360-platform-records.md)
- [query_google_bigquery_analytics_events](/tools/query-google-bigquery-analytics-events.md)
- [lookup_hipo_identification_nomination_agent_policy_handbook](/tools/lookup-hipo-identification-nomination-agent-policy-handbook.md)

## Runs in

- [signal_collection](/workflow/signal-collection.md)

## Evidence expected

- source_system_record
- sql_result
- document_reference

## Evals

- [Run the HiPo Identification & Nomination Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/hipo-identification-nomination-agent-end-to-end.md)

# Citations

- [HiPo Identification & Nomination Agent Policy Handbook](/documents/hipo-identification-nomination-agent-policy-handbook.md)
