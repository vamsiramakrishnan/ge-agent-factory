---
type: Query Capability
title: "Continuous sync of OKR progress from Lattice, project delivery signals from J..."
description: "Continuous sync of OKR progress from Lattice, project delivery signals from Jira, and performance indicators from Workday into BigQuery."
source_id: "progress-signal-collection"
generation_status: inferred
tags:
  - hr
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Continuous sync of OKR progress from Lattice, project delivery signals from Jira, and performance indicators from Workday into BigQuery.

## Tools used

- [query_workday_employees](/tools/query-workday-employees.md)
- [query_jira_issues](/tools/query-jira-issues.md)
- [lookup_okr_progress_tracker_agent_policy_handbook](/tools/lookup-okr-progress-tracker-agent-policy-handbook.md)

## Runs in

- [progress_signal_collection](/workflow/progress-signal-collection.md)

## Evidence expected

- source_system_record
- document_reference

## Evals

- [Run the OKR Progress Tracker Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/okr-progress-tracker-agent-end-to-end.md)

# Citations

- [OKR Progress Tracker Agent Policy Handbook](/documents/okr-progress-tracker-agent-policy-handbook.md)
