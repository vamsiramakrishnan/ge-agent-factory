---
type: Eval Scenario
title: Run the HiPo Development Journey Agent workflow for the current period. Cite ...
description: "Run the HiPo Development Journey Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
source_id: "hipo-development-journey-agent-end-to-end"
generation_status: inferred
tags:
  - hr
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Run the HiPo Development Journey Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

## Validates

- [journey-design](/queries/journey-design.md)

## Mechanisms to call

- [query_workday_employees](/tools/query-workday-employees.md)
- [query_lms_lms_records](/tools/query-lms-lms-records.md)
- [query_google_docs_documents](/tools/query-google-docs-documents.md)
- [query_mentoring_platform_mentoring_platform_records](/tools/query-mentoring-platform-mentoring-platform-records.md)
- [lookup_hipo_development_journey_agent_policy_handbook](/tools/lookup-hipo-development-journey-agent-policy-handbook.md)
- [action_workday_assign](/tools/action-workday-assign.md)

## Success rubric

Action assign executed against Workday, with audit-trail entry and L&D Lead notified of outcomes.

# Citations

- [HiPo Development Journey Agent Policy Handbook](/documents/hipo-development-journey-agent-policy-handbook.md)
