---
type: Proof Obligation
title: "Golden eval obligation — Run the Internal Communications Drafter workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
description: golden eval proof obligation
source_id: "eval-internal-communications-drafter-end-to-end"
tags:
  - marketing
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
source_kind: generationSpec
source_path: behaviorContract.goldenEvals.0
generation_status: generated
ge_status: generated
---

# Golden eval obligation — Run the Internal Communications Drafter workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

- **Kind:** golden eval
- **Spec source:** behaviorContract.goldenEvals.0
- **Eval:** [internal-communications-drafter-end-to-end](/tests/internal-communications-drafter-end-to-end.md)


## Mechanisms

- [query_google_workspace_accounts](/tools/query-google-workspace-accounts.md)
- [query_slack_messages](/tools/query-slack-messages.md)
- [query_salesforce_accounts](/tools/query-salesforce-accounts.md)
- [lookup_internal_communications_drafter_playbook](/tools/lookup-internal-communications-drafter-playbook.md)
- [action_google_workspace_draft](/tools/action-google-workspace-draft.md)

## Entities that must be referenced

- accounts
- messages
- accounts

## Forbidden behaviors

- do not invent KPI numbers
- do not skip the evidence_lookup step before any recommendation
- do not execute draft without two-system evidence

# Citations

- [internal-communications-drafter-playbook](/documents/internal-communications-drafter-playbook.md)
