---
type: Proof Obligation
title: "Golden eval obligation — Run the P-Card Reconciliation Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
description: golden eval proof obligation
source_id: "eval-p-card-reconciliation-agent-end-to-end"
tags:
  - procurement
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
source_kind: generationSpec
source_path: behaviorContract.goldenEvals.0
generation_status: generated
ge_status: generated
---

# Golden eval obligation — Run the P-Card Reconciliation Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

- **Kind:** golden eval
- **Spec source:** behaviorContract.goldenEvals.0
- **Eval:** [p-card-reconciliation-agent-end-to-end](/tests/p-card-reconciliation-agent-end-to-end.md)


## Mechanisms

- [query_citibank_jp_morgan_commercial_card_citibank_jp_morgan_commercial_card_records](/tools/query-citibank-jp-morgan-commercial-card-citibank-jp-morgan-commercial-card-records.md)
- [query_sap_concur_expense_reports](/tools/query-sap-concur-expense-reports.md)
- [query_coupa_requisitions](/tools/query-coupa-requisitions.md)
- [lookup_p_card_reconciliation_agent_policy_guide](/tools/lookup-p-card-reconciliation-agent-policy-guide.md)
- [action_citibank_jp_morgan_commercial_card_approve](/tools/action-citibank-jp-morgan-commercial-card-approve.md)

## Entities that must be referenced

- citibank_jp_morgan_commercial_card_records
- expense_reports
- requisitions

## Forbidden behaviors

- do not invent KPI numbers
- do not skip the evidence_lookup step before any recommendation
- do not execute approve without two-system evidence

# Citations

- [p-card-reconciliation-agent-policy-guide](/documents/p-card-reconciliation-agent-policy-guide.md)
