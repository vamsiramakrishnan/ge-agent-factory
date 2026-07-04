---
type: Workflow Stage
title: Compensation Data Pull
description: "Extract individual comp changes including base salary, bonus targets, equity grants, and benefits from Workday at comp cycle close."
source_id: compensation_data_pull
tags:
  - hr
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Compensation Data Pull

Extract individual comp changes including base salary, bonus targets, equity grants, and benefits from Workday at comp cycle close.

- **Mode:** sequential
- **Stage:** 1 of 3

## Tools

- [query_workday_employees](/tools/query-workday-employees.md)
- [lookup_compensation_letter_generator_policy_handbook](/tools/lookup-compensation-letter-generator-policy-handbook.md)
- [action_workday_generate](/tools/action-workday-generate.md)

Next: [Letter Personalization](/workflow/letter-personalization.md)
