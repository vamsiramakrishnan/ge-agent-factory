---
type: Workflow Stage
title: Skills Inventory Assembly
description: "Aggregate skills data from Workday job profiles, Cornerstone certifications, and Degreed self-assessments. Normalize against a unified skills taxonomy."
source_id: skills_inventory_assembly
tags:
  - hr
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Skills Inventory Assembly

Aggregate skills data from Workday job profiles, Cornerstone certifications, and Degreed self-assessments. Normalize against a unified skills taxonomy.

- **Mode:** sequential
- **Stage:** 1 of 2

## Tools

- [query_workday_employees](/tools/query-workday-employees.md)
- [query_skills_db_skills_db_records](/tools/query-skills-db-skills-db-records.md)
- [lookup_skills_gap_analyzer_policy_handbook](/tools/lookup-skills-gap-analyzer-policy-handbook.md)

Next: [Gap Analysis](/workflow/gap-analysis.md)
