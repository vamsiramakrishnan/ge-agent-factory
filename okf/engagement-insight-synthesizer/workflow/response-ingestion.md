---
type: Workflow Stage
title: Response Ingestion
description: "Pull survey responses with full demographic and org hierarchy context from Qualtrics. Join with Workday data for team-level segmentation and tenure-based analysis."
source_id: response_ingestion
tags:
  - hr
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Response Ingestion

Pull survey responses with full demographic and org hierarchy context from Qualtrics. Join with Workday data for team-level segmentation and tenure-based analysis.

- **Mode:** sequential
- **Stage:** 1 of 3

## Tools

- [query_qualtrics_survey_responses](/tools/query-qualtrics-survey-responses.md)
- [query_workday_employees](/tools/query-workday-employees.md)

Next: [Statistical Driver Analysis](/workflow/statistical-driver-analysis.md)
