---
type: Query Capability
title: "Aggregate post-program data across Kirkpatrick levels: surveys (L1), knowledg..."
description: "Aggregate post-program data across Kirkpatrick levels: surveys (L1), knowledge assessments (L2), behavioral indicators from Workday (L3), and business metrics (L4)."
source_id: "multi-signal-data-collection"
generation_status: inferred
tags:
  - hr
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Aggregate post-program data across Kirkpatrick levels: surveys (L1), knowledge assessments (L2), behavioral indicators from Workday (L3), and business metrics (L4).

## Tools used

- [query_workday_employees](/tools/query-workday-employees.md)
- [query_survey_platform_survey_platform_records](/tools/query-survey-platform-survey-platform-records.md)
- [lookup_program_impact_evaluation_agent_policy_handbook](/tools/lookup-program-impact-evaluation-agent-policy-handbook.md)

## Runs in

- [multi_signal_data_collection](/workflow/multi-signal-data-collection.md)

## Evidence expected

- source_system_record
- document_reference

## Evals

- [Run the Program Impact Evaluation Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/program-impact-evaluation-agent-end-to-end.md)

# Citations

- [Program Impact Evaluation Agent Policy Handbook](/documents/program-impact-evaluation-agent-policy-handbook.md)
