---
type: Workflow Stage
title: Retrieve Records
description: Query safety incidents and permit records from Sphera EHS for the Safety Observation Trend Analyzer workflow.
source_id: retrieve_records
tags:
  - manufacturing
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Retrieve Records

Query safety incidents and permit records from Sphera EHS for the Safety Observation Trend Analyzer workflow.

- **Mode:** sequential
- **Stage:** 1 of 4

## Tools

- [query_sphera_ehs_safety_incidents](/tools/query-sphera-ehs-safety-incidents.md)
- [lookup_safety_observation_trend_analyzer_sop](/tools/lookup-safety-observation-trend-analyzer-sop.md)
- [action_sphera_ehs_publish](/tools/action-sphera-ehs-publish.md)

Next: [Analyze & Detect](/workflow/analyze-detect.md)
