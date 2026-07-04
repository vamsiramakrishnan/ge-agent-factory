---
type: Query Capability
title: Pull project proposals from ServiceNow demand intake and Jira Portfolio. Cros...
description: "Pull project proposals from ServiceNow demand intake and Jira Portfolio. Cross-reference resource capacity from HRIS and strategic objectives from the OKR system."
source_id: "intake-aggregation"
generation_status: inferred
tags:
  - it
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Pull project proposals from ServiceNow demand intake and Jira Portfolio. Cross-reference resource capacity from HRIS and strategic objectives from the OKR system.

## Tools used

- [query_servicenow_spm_tickets](/tools/query-servicenow-spm-tickets.md)
- [query_jira_portfolio_issues](/tools/query-jira-portfolio-issues.md)
- [lookup_portfolio_prioritization_engine_runbook](/tools/lookup-portfolio-prioritization-engine-runbook.md)

## Runs in

- [intake_aggregation](/workflow/intake-aggregation.md)

## Evidence expected

- source_system_record
- document_reference

## Evals

- [Run the Portfolio Prioritization Engine workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/portfolio-prioritization-engine-end-to-end.md)

# Citations

- [Portfolio Prioritization Engine Operations Runbook](/documents/portfolio-prioritization-engine-runbook.md)
