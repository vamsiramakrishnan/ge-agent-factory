---
type: Workflow Stage
title: Breach Probability Modeling
description: "Predict resolution time based on ticket complexity (text length, attachments, category), assignee workload, and historical patterns for similar tickets."
source_id: breach_probability_modeling
tags:
  - it
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Breach Probability Modeling

Predict resolution time based on ticket complexity (text length, attachments, category), assignee workload, and historical patterns for similar tickets.

- **Mode:** sequential
- **Stage:** 2 of 4

## Tools

- [query_servicenow_tickets](/tools/query-servicenow-tickets.md)
- [lookup_sla_breach_predictor_runbook](/tools/lookup-sla-breach-predictor-runbook.md)

Next: [Systemic Correlation & Recommendations](/workflow/systemic-correlation-recommendations.md)
