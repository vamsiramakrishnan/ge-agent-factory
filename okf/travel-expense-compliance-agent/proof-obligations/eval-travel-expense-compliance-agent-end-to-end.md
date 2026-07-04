---
type: Proof Obligation
title: "Golden eval obligation — Run the Travel & Expense Compliance Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
description: golden eval proof obligation
source_id: "eval-travel-expense-compliance-agent-end-to-end"
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

# Golden eval obligation — Run the Travel & Expense Compliance Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

- **Kind:** golden eval
- **Spec source:** behaviorContract.goldenEvals.0
- **Eval:** [travel-expense-compliance-agent-end-to-end](/tests/travel-expense-compliance-agent-end-to-end.md)


## Mechanisms

- [query_sap_concur_expense_reports](/tools/query-sap-concur-expense-reports.md)
- [query_egencia_navan_egencia_navan_records](/tools/query-egencia-navan-egencia-navan-records.md)
- [query_p_card_data_p_card_data_records](/tools/query-p-card-data-p-card-data-records.md)
- [query_policy_docs_policy_docs_records](/tools/query-policy-docs-policy-docs-records.md)
- [lookup_travel_expense_compliance_agent_policy_guide](/tools/lookup-travel-expense-compliance-agent-policy-guide.md)
- [action_sap_concur_submit](/tools/action-sap-concur-submit.md)

## Entities that must be referenced

- expense_reports
- egencia_navan_records
- p_card_data_records
- policy_docs_records

## Forbidden behaviors

- do not invent KPI numbers
- do not skip the evidence_lookup step before any recommendation
- do not execute submit without two-system evidence

# Citations

- [travel-expense-compliance-agent-policy-guide](/documents/travel-expense-compliance-agent-policy-guide.md)
