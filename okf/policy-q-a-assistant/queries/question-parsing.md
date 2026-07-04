---
type: Query Capability
title: "Parse employee's natural language policy question. Identify intent and releva..."
description: "Parse employee's natural language policy question. Identify intent and relevant policy domain. Pull employee context from Workday for jurisdiction-specific answers."
source_id: "question-parsing"
generation_status: inferred
tags:
  - hr
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Parse employee's natural language policy question. Identify intent and relevant policy domain. Pull employee context from Workday for jurisdiction-specific answers.

## Tools used

- [query_workday_employees](/tools/query-workday-employees.md)
- [lookup_policy_q_a_assistant_policy_handbook](/tools/lookup-policy-q-a-assistant-policy-handbook.md)

## Runs in

- [question_parsing](/workflow/question-parsing.md)

## Evidence expected

- source_system_record
- document_reference

## Evals

- [Run the Policy Q&A Assistant workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/policy-q-a-assistant-end-to-end.md)

# Citations

- [Policy Q&A Assistant Policy Handbook](/documents/policy-q-a-assistant-policy-handbook.md)
