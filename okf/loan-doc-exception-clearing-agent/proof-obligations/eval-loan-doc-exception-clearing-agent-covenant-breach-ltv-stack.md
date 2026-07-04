---
type: Proof Obligation
title: "Golden eval obligation — Covenant record 612840 on application_number 34198822, a cre_mortgage product, shows compliance_status breached with most_recent_test_value below its threshold_value and a next_test_date 32 days in the past. The same application's ltv is 0.81 with no additional collateral or guaranty on file. Reconcile whether this credit's documentation exception should be cleared from this week's queue or escalated, and to whom."
description: golden eval proof obligation
source_id: "eval-loan-doc-exception-clearing-agent-covenant-breach-ltv-stack"
tags:
  - banking
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
source_kind: generationSpec
source_path: behaviorContract.goldenEvals.4
generation_status: generated
ge_status: generated
---

# Golden eval obligation — Covenant record 612840 on application_number 34198822, a cre_mortgage product, shows compliance_status breached with most_recent_test_value below its threshold_value and a next_test_date 32 days in the past. The same application's ltv is 0.81 with no additional collateral or guaranty on file. Reconcile whether this credit's documentation exception should be cleared from this week's queue or escalated, and to whom.

- **Kind:** golden eval
- **Spec source:** behaviorContract.goldenEvals.4
- **Eval:** [loan-doc-exception-clearing-agent-covenant-breach-ltv-stack](/tests/loan-doc-exception-clearing-agent-covenant-breach-ltv-stack.md)


## Mechanisms

- [query_ncino_loan_origination_loan_applications](/tools/query-ncino-loan-origination-loan-applications.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [lookup_loan_doc_exception_clearing_agent_compliance_policy](/tools/lookup-loan-doc-exception-clearing-agent-compliance-policy.md)

## Entities that must be referenced

- covenant_records
- loan_applications

## Forbidden behaviors

- clearing the documentation exception from the queue while the covenant breach and LTV threshold remain unresolved
- executing the escalate action against nCino without evidence drawn from both covenant_records and loan_applications

# Citations

- [loan-doc-exception-clearing-agent-compliance-policy](/documents/loan-doc-exception-clearing-agent-compliance-policy.md)
- [collateral-perfection-lien-documentation-cure-runbook](/documents/collateral-perfection-lien-documentation-cure-runbook.md)
