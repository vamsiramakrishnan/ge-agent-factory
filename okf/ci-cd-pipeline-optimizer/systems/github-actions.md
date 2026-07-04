---
type: Source System
title: GitHub Actions
description: "Workflow run telemetry, PR build status, action logs"
tags:
  - it
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# GitHub Actions

Workflow run telemetry, PR build status, action logs

- **Protocol:** REST API
- **Local backing:** alloydb

# Schema

- [pull_requests](/tables/pull-requests.md)
- [commits](/tables/commits.md)
- [workflow_runs](/tables/workflow-runs.md)

## Tools using this system

- [query_github_actions_pull_requests](/tools/query-github-actions-pull-requests.md)
