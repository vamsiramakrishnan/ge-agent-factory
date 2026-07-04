---
type: Query Capability
title: Gemini generates personalized answers grounded in retrieved policy documents ...
description: "Gemini generates personalized answers grounded in retrieved policy documents and employee-specific data. Include self-service action links where applicable."
source_id: "answer-generation"
generation_status: inferred
tags:
  - hr
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Gemini generates personalized answers grounded in retrieved policy documents and employee-specific data. Include self-service action links where applicable.

## Tools used

- [lookup_employee_query_resolution_policy_handbook](/tools/lookup-employee-query-resolution-policy-handbook.md)

## Runs in

- [answer_generation](/workflow/answer-generation.md)

## Evidence expected

- document_reference

## Evals

- [Run the Employee Query Resolution workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/employee-query-resolution-end-to-end.md)

# Citations

- [Employee Query Resolution Policy Handbook](/documents/employee-query-resolution-policy-handbook.md)
