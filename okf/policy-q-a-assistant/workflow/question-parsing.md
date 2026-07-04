---
type: Workflow Stage
title: Question Parsing
description: "Parse employee's natural language policy question. Identify intent and relevant policy domain. Pull employee context from Workday for jurisdiction-specific answers."
source_id: question_parsing
tags:
  - hr
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Question Parsing

Parse employee's natural language policy question. Identify intent and relevant policy domain. Pull employee context from Workday for jurisdiction-specific answers.

- **Mode:** sequential
- **Stage:** 1 of 3

## Tools

- [query_workday_employees](/tools/query-workday-employees.md)
- [lookup_policy_q_a_assistant_policy_handbook](/tools/lookup-policy-q-a-assistant-policy-handbook.md)

Next: [Policy Retrieval](/workflow/policy-retrieval.md)
