---
type: Workflow Stage
title: "Post-Change Verification & Rollback"
description: "Re-query performance_counters within 24 hours and publish results to Looker dashboards; automatically roll back any change where accessibility or retention KPIs regress past the runbook threshold."
source_id: post_change_verification_rollback
tags:
  - telco
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Post-Change Verification & Rollback

Re-query performance_counters within 24 hours and publish results to Looker dashboards; automatically roll back any change where accessibility or retention KPIs regress past the runbook threshold.

- **Mode:** sequential
- **Stage:** 6 of 6

## Tools

- [query_looker_dashboards](/tools/query-looker-dashboards.md)
- [lookup_ran_parameter_optimization_agent_assurance_runbook](/tools/lookup-ran-parameter-optimization-agent-assurance-runbook.md)
