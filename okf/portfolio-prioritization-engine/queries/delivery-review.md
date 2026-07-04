---
type: Query Capability
title: "Portfolio ranking formatted as a board-ready presentation. CIO reviews and ap..."
description: "Portfolio ranking formatted as a board-ready presentation. CIO reviews and approves investment allocation before organizational communication."
source_id: "delivery-review"
generation_status: inferred
tags:
  - it
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Portfolio ranking formatted as a board-ready presentation. CIO reviews and approves investment allocation before organizational communication.

## Tools used

- [query_jira_portfolio_issues](/tools/query-jira-portfolio-issues.md)
- [lookup_portfolio_prioritization_engine_runbook](/tools/lookup-portfolio-prioritization-engine-runbook.md)

## Runs in

- [delivery_review](/workflow/delivery-review.md)

## Evidence expected

- source_system_record
- document_reference

## Evals

- [Run the Portfolio Prioritization Engine workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/portfolio-prioritization-engine-end-to-end.md)

# Citations

- [Portfolio Prioritization Engine Operations Runbook](/documents/portfolio-prioritization-engine-runbook.md)
