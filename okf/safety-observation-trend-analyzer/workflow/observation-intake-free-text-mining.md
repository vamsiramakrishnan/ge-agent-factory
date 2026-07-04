---
type: Workflow Stage
title: "Observation Intake & Free-Text Mining"
description: "Pull the week's Sphera EHS safety_incidents observation free-text via query_sphera_ehs_safety_incidents and tokenize it by area, shift (first/second/third/weekend), and task type ahead of clustering."
source_id: observation_intake_free_text_mining
tags:
  - manufacturing
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Observation Intake & Free-Text Mining

Pull the week's Sphera EHS safety_incidents observation free-text via query_sphera_ehs_safety_incidents and tokenize it by area, shift (first/second/third/weekend), and task type ahead of clustering.

- **Mode:** sequential
- **Stage:** 1 of 6

## Tools

- [query_sphera_ehs_safety_incidents](/tools/query-sphera-ehs-safety-incidents.md)
- [lookup_safety_observation_trend_analyzer_sop](/tools/lookup-safety-observation-trend-analyzer-sop.md)
- [action_sphera_ehs_publish](/tools/action-sphera-ehs-publish.md)

Next: [Trend Clustering & Leading-Indicator Correlation](/workflow/trend-clustering-leading-indicator-correlation.md)
