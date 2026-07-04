---
type: Workflow Stage
title: Data Assembly
description: "Pull workforce model outputs, org data, and scenario results from Workday and BigQuery. Structure data into document-ready format with charts and tables."
source_id: data_assembly
tags:
  - hr
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Data Assembly

Pull workforce model outputs, org data, and scenario results from Workday and BigQuery. Structure data into document-ready format with charts and tables.

- **Mode:** sequential
- **Stage:** 1 of 3

## Tools

- [query_workday_employees](/tools/query-workday-employees.md)
- [lookup_workforce_plan_document_drafter_policy_handbook](/tools/lookup-workforce-plan-document-drafter-policy-handbook.md)

Next: [Narrative Generation](/workflow/narrative-generation.md)
