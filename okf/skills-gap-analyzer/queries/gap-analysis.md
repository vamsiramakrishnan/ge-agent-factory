---
type: Query Capability
title: Gemini compares current skills inventory against role requirements and future...
description: "Gemini compares current skills inventory against role requirements and future-state capability needs. Quantifies gaps by criticality, breadth, and business impact."
source_id: "gap-analysis"
generation_status: inferred
tags:
  - hr
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Gemini compares current skills inventory against role requirements and future-state capability needs. Quantifies gaps by criticality, breadth, and business impact.

## Tools used

- [query_skills_db_skills_db_records](/tools/query-skills-db-skills-db-records.md)
- [lookup_skills_gap_analyzer_policy_handbook](/tools/lookup-skills-gap-analyzer-policy-handbook.md)

## Runs in

- [gap_analysis](/workflow/gap-analysis.md)

## Evidence expected

- source_system_record
- document_reference

## Evals

- [Run the Skills Gap Analyzer workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/skills-gap-analyzer-end-to-end.md)

# Citations

- [Skills Gap Analyzer Policy Handbook](/documents/skills-gap-analyzer-policy-handbook.md)
