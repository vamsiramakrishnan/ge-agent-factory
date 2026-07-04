---
type: Proof Obligation
title: "Golden eval obligation — Run the Close Checklist Orchestrator workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
description: golden eval proof obligation
source_id: "eval-close-checklist-orchestrator-end-to-end"
tags:
  - finance
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
source_kind: generationSpec
source_path: behaviorContract.goldenEvals.0
generation_status: generated
ge_status: generated
---

# Golden eval obligation — Run the Close Checklist Orchestrator workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

- **Kind:** golden eval
- **Spec source:** behaviorContract.goldenEvals.0
- **Eval:** [close-checklist-orchestrator-end-to-end](/tests/close-checklist-orchestrator-end-to-end.md)


## Mechanisms

- [query_blackline_reconciliations](/tools/query-blackline-reconciliations.md)
- [query_sap_s_4hana_transactions](/tools/query-sap-s-4hana-transactions.md)
- [query_servicenow_tickets](/tools/query-servicenow-tickets.md)
- [query_slack_messages](/tools/query-slack-messages.md)
- [lookup_close_checklist_orchestrator_controls_playbook](/tools/lookup-close-checklist-orchestrator-controls-playbook.md)
- [action_blackline_escalate](/tools/action-blackline-escalate.md)

## Entities that must be referenced

- reconciliations
- transactions
- tickets
- messages

## Forbidden behaviors

- do not invent KPI numbers
- do not skip the evidence_lookup step before any recommendation
- do not execute escalate without two-system evidence

# Citations

- [close-checklist-orchestrator-controls-playbook](/documents/close-checklist-orchestrator-controls-playbook.md)
