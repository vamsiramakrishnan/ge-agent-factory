---
type: Query Capability
title: "Aggregate skills data from Workday job profiles, Cornerstone certifications, ..."
description: "Aggregate skills data from Workday job profiles, Cornerstone certifications, and Degreed self-assessments. Normalize against a unified skills taxonomy."
source_id: "skills-inventory-assembly"
generation_status: inferred
tags:
  - hr
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Aggregate skills data from Workday job profiles, Cornerstone certifications, and Degreed self-assessments. Normalize against a unified skills taxonomy.

## Tools used

- [query_workday_employees](/tools/query-workday-employees.md)
- [query_skills_db_skills_db_records](/tools/query-skills-db-skills-db-records.md)
- [lookup_skills_gap_analyzer_policy_handbook](/tools/lookup-skills-gap-analyzer-policy-handbook.md)

## Runs in

- [skills_inventory_assembly](/workflow/skills-inventory-assembly.md)

## Evidence expected

- source_system_record
- document_reference

## Evals

- [Run the Skills Gap Analyzer workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/skills-gap-analyzer-end-to-end.md)

# Citations

- [Skills Gap Analyzer Policy Handbook](/documents/skills-gap-analyzer-policy-handbook.md)
