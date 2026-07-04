---
type: Eval Scenario
title: Run the Internal Communications Drafter workflow for the current period. Cite...
description: "Run the Internal Communications Drafter workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
source_id: "internal-communications-drafter-end-to-end"
generation_status: inferred
tags:
  - marketing
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Run the Internal Communications Drafter workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

## Validates

- [audience-aware-drafting](/queries/audience-aware-drafting.md)

## Mechanisms to call

- [query_google_workspace_accounts](/tools/query-google-workspace-accounts.md)
- [query_slack_messages](/tools/query-slack-messages.md)
- [query_salesforce_accounts](/tools/query-salesforce-accounts.md)
- [lookup_internal_communications_drafter_playbook](/tools/lookup-internal-communications-drafter-playbook.md)
- [action_google_workspace_draft](/tools/action-google-workspace-draft.md)

## Success rubric

Action draft executed against Google Workspace, with audit-trail entry and VP Marketing notified of outcomes.

# Citations

- [Internal Communications Drafter Playbook](/documents/internal-communications-drafter-playbook.md)
