---
type: Query Capability
title: "Refresh Looker dashboards and distribute variance bridge report to FP&A team ..."
description: "Refresh Looker dashboards and distribute variance bridge report to FP&A team and business partners."
source_id: "report-delivery"
generation_status: inferred
tags:
  - finance
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Refresh Looker dashboards and distribute variance bridge report to FP&A team and business partners.

## Tools used

- [query_looker_dashboards](/tools/query-looker-dashboards.md)
- [lookup_variance_analysis_agent_controls_playbook](/tools/lookup-variance-analysis-agent-controls-playbook.md)

## Runs in

- [report_delivery](/workflow/report-delivery.md)

## Evidence expected

- sql_result
- document_reference

## Evals

- [Run the Variance Analysis Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/variance-analysis-agent-end-to-end.md)

# Citations

- [Variance Analysis Agent Controls Playbook](/documents/variance-analysis-agent-controls-playbook.md)
