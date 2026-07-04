---
type: Workflow Stage
title: "Case Intake & Classification"
description: "Ingest new ER case from ServiceNow with details and evidence. Auto-classify by type, severity, and applicable policy domain. Pull employee context from Workday."
source_id: case_intake_classification
tags:
  - hr
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Case Intake & Classification

Ingest new ER case from ServiceNow with details and evidence. Auto-classify by type, severity, and applicable policy domain. Pull employee context from Workday.

- **Mode:** sequential
- **Stage:** 1 of 4

## Tools

- [query_servicenow_tickets](/tools/query-servicenow-tickets.md)
- [query_workday_employees](/tools/query-workday-employees.md)
- [lookup_er_case_intelligence_policy_handbook](/tools/lookup-er-case-intelligence-policy-handbook.md)
- [action_servicenow_recommend](/tools/action-servicenow-recommend.md)

Next: [Precedent Research](/workflow/precedent-research.md)
