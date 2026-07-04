---
type: Workflow Stage
title: Intake Aggregation
description: "Pull project proposals from ServiceNow demand intake and Jira Portfolio. Cross-reference resource capacity from HRIS and strategic objectives from the OKR system."
source_id: intake_aggregation
tags:
  - it
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Intake Aggregation

Pull project proposals from ServiceNow demand intake and Jira Portfolio. Cross-reference resource capacity from HRIS and strategic objectives from the OKR system.

- **Mode:** sequential
- **Stage:** 1 of 3

## Tools

- [query_servicenow_spm_tickets](/tools/query-servicenow-spm-tickets.md)
- [query_jira_portfolio_issues](/tools/query-jira-portfolio-issues.md)
- [lookup_portfolio_prioritization_engine_runbook](/tools/lookup-portfolio-prioritization-engine-runbook.md)

Next: [Multi-Criteria Scoring & Simulation](/workflow/multi-criteria-scoring-simulation.md)
