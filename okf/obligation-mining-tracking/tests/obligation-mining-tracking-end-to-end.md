---
type: Eval Scenario
title: "Run the Obligation Mining & Tracking workflow for the current period. Cite th..."
description: "Run the Obligation Mining & Tracking workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
source_id: "obligation-mining-tracking-end-to-end"
generation_status: inferred
tags:
  - procurement
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Run the Obligation Mining & Tracking workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

## Validates

- [task-calendar-creation](/queries/task-calendar-creation.md)

## Mechanisms to call

- [query_icertis_contracts](/tools/query-icertis-contracts.md)
- [query_docusign_clm_contracts](/tools/query-docusign-clm-contracts.md)
- [query_google_calendar_events](/tools/query-google-calendar-events.md)
- [query_asana_jira_issues](/tools/query-asana-jira-issues.md)
- [lookup_obligation_mining_tracking_policy_guide](/tools/lookup-obligation-mining-tracking-policy-guide.md)
- [action_icertis_create](/tools/action-icertis-create.md)

## Success rubric

Action create executed against Icertis, with audit-trail entry and Contract Manager notified of outcomes.

# Citations

- [Obligation Mining & Tracking Procurement Policy Guide](/documents/obligation-mining-tracking-policy-guide.md)
