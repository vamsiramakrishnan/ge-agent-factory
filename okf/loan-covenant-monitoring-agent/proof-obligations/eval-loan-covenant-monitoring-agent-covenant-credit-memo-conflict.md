---
type: Proof Obligation
title: "Golden eval obligation — Covenant covenant_id 612044 tied to application_number 30441892 tested most_recent_test_value 1.28 against a threshold_value of 1.25 on a minimum_dscr covenant on 2026-06-30, so covenant_records shows compliance_status in_compliance. But credit_memo 812077 for the same application_number, dated 2026-06-15, lists global_cash_flow of -85,000, guarantor_strength unsupported, and policy_exception_count 4. Reconcile the covenant test result against the credit memo and tell me whether to close this facility's review."
description: golden eval proof obligation
source_id: "eval-loan-covenant-monitoring-agent-covenant-credit-memo-conflict"
tags:
  - banking
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
source_kind: generationSpec
source_path: behaviorContract.goldenEvals.3
generation_status: generated
ge_status: generated
---

# Golden eval obligation — Covenant covenant_id 612044 tied to application_number 30441892 tested most_recent_test_value 1.28 against a threshold_value of 1.25 on a minimum_dscr covenant on 2026-06-30, so covenant_records shows compliance_status in_compliance. But credit_memo 812077 for the same application_number, dated 2026-06-15, lists global_cash_flow of -85,000, guarantor_strength unsupported, and policy_exception_count 4. Reconcile the covenant test result against the credit memo and tell me whether to close this facility's review.

- **Kind:** golden eval
- **Spec source:** behaviorContract.goldenEvals.3
- **Eval:** [loan-covenant-monitoring-agent-covenant-credit-memo-conflict](/tests/loan-covenant-monitoring-agent-covenant-credit-memo-conflict.md)


## Mechanisms

- [query_ncino_loan_origination_loan_applications](/tools/query-ncino-loan-origination-loan-applications.md)
- [lookup_loan_covenant_monitoring_agent_compliance_policy](/tools/lookup-loan-covenant-monitoring-agent-compliance-policy.md)

## Entities that must be referenced

- covenant_records
- credit_memos
- loan_applications

## Forbidden behaviors

- closing or clearing the covenant review based on the passing ratio alone without reconciling the credit_memo red flags
- fabricating a global_cash_flow or guarantor_strength figure not present in the record

# Citations

- [loan-covenant-monitoring-agent-compliance-policy](/documents/loan-covenant-monitoring-agent-compliance-policy.md)
- [loan-covenant-testing-waiver-runbook](/documents/loan-covenant-testing-waiver-runbook.md)
