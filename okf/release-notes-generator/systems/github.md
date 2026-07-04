---
type: Source System
title: GitHub
description: "Commits, PRs, release tags, diff between versions"
tags:
  - it
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# GitHub

Commits, PRs, release tags, diff between versions

- **Protocol:** REST API
- **Local backing:** alloydb

# Schema

- [pull_requests](/tables/pull-requests.md)
- [commits](/tables/commits.md)
- [workflow_runs](/tables/workflow-runs.md)

## Tools using this system

- [query_github_pull_requests](/tools/query-github-pull-requests.md)
- [action_github_release](/tools/action-github-release.md)
