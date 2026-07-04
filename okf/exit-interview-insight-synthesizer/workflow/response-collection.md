---
type: Workflow Stage
title: Response Collection
description: "Aggregate exit interview transcripts and survey data from Qualtrics. Enrich with Workday demographics — tenure, level, department, manager — for segmented analysis."
source_id: response_collection
tags:
  - hr
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Response Collection

Aggregate exit interview transcripts and survey data from Qualtrics. Enrich with Workday demographics — tenure, level, department, manager — for segmented analysis.

- **Mode:** sequential
- **Stage:** 1 of 2

## Tools

- [query_survey_platform_survey_platform_records](/tools/query-survey-platform-survey-platform-records.md)
- [query_workday_employees](/tools/query-workday-employees.md)
- [lookup_exit_interview_insight_synthesizer_policy_handbook](/tools/lookup-exit-interview-insight-synthesizer-policy-handbook.md)
- [action_survey_platform_recommend](/tools/action-survey-platform-recommend.md)

Next: [Leadership Brief](/workflow/leadership-brief.md)
