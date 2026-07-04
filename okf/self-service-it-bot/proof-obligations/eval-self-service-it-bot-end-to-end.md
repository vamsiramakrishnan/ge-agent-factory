---
type: Proof Obligation
title: "Golden eval obligation — Run the Self-Service IT Bot workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
description: golden eval proof obligation
source_id: "eval-self-service-it-bot-end-to-end"
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

# Golden eval obligation — Run the Self-Service IT Bot workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

- **Kind:** golden eval
- **Spec source:** behaviorContract.goldenEvals.0
- **Eval:** [self-service-it-bot-end-to-end](/tests/self-service-it-bot-end-to-end.md)


## Mechanisms

- [query_slack_messages](/tools/query-slack-messages.md)
- [query_servicenow_tickets](/tools/query-servicenow-tickets.md)
- [query_okta_users](/tools/query-okta-users.md)
- [query_google_workspace_accounts](/tools/query-google-workspace-accounts.md)
- [lookup_self_service_it_bot_runbook](/tools/lookup-self-service-it-bot-runbook.md)
- [action_slack_execute](/tools/action-slack-execute.md)

## Entities that must be referenced

- messages
- tickets
- users
- accounts

## Forbidden behaviors

- do not invent KPI numbers
- do not skip the evidence_lookup step before any recommendation
- do not execute execute without two-system evidence

# Citations

- [self-service-it-bot-runbook](/documents/self-service-it-bot-runbook.md)
