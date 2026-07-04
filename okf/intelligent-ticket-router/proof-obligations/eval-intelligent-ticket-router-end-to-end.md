---
type: Proof Obligation
title: "Golden eval obligation — Run the Intelligent Ticket Router workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
description: golden eval proof obligation
source_id: "eval-intelligent-ticket-router-end-to-end"
tags:
  - it
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
source_kind: generationSpec
source_path: behaviorContract.goldenEvals.0
generation_status: generated
ge_status: generated
---

# Golden eval obligation — Run the Intelligent Ticket Router workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

- **Kind:** golden eval
- **Spec source:** behaviorContract.goldenEvals.0
- **Eval:** [intelligent-ticket-router-end-to-end](/tests/intelligent-ticket-router-end-to-end.md)


## Mechanisms

- [query_servicenow_tickets](/tools/query-servicenow-tickets.md)
- [query_jira_service_mgmt_issues](/tools/query-jira-service-mgmt-issues.md)
- [query_slack_messages](/tools/query-slack-messages.md)
- [lookup_intelligent_ticket_router_runbook](/tools/lookup-intelligent-ticket-router-runbook.md)
- [action_servicenow_route](/tools/action-servicenow-route.md)

## Entities that must be referenced

- tickets
- issues
- messages

## Forbidden behaviors

- do not invent KPI numbers
- do not skip the evidence_lookup step before any recommendation
- do not execute route without two-system evidence

# Citations

- [intelligent-ticket-router-runbook](/documents/intelligent-ticket-router-runbook.md)
