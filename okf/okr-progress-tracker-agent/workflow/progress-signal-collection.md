---
type: Workflow Stage
title: Progress Signal Collection
description: "Continuous sync of OKR progress from Lattice, project delivery signals from Jira, and performance indicators from Workday into BigQuery."
source_id: progress_signal_collection
tags:
  - hr
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Progress Signal Collection

Continuous sync of OKR progress from Lattice, project delivery signals from Jira, and performance indicators from Workday into BigQuery.

- **Mode:** sequential
- **Stage:** 1 of 2

## Tools

- [query_workday_employees](/tools/query-workday-employees.md)
- [query_jira_issues](/tools/query-jira-issues.md)
- [lookup_okr_progress_tracker_agent_policy_handbook](/tools/lookup-okr-progress-tracker-agent-policy-handbook.md)

Next: [Trajectory Analysis](/workflow/trajectory-analysis.md)
