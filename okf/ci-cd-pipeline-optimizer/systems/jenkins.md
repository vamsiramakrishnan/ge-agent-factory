---
type: Source System
title: Jenkins
description: "Build logs, pipeline stage durations, failure traces"
tags:
  - it
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Jenkins

Build logs, pipeline stage durations, failure traces

- **Protocol:** REST API
- **Local backing:** alloydb

# Schema

- [pipeline_runs](/tables/pipeline-runs.md)
- [deployments](/tables/deployments.md)
- [test_results](/tables/test-results.md)

## Tools using this system

- [query_jenkins_pipeline_runs](/tools/query-jenkins-pipeline-runs.md)
- [action_jenkins_recommend](/tools/action-jenkins-recommend.md)
