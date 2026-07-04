---
type: Proof Obligation
title: "Golden eval obligation — Run the Commercial Credit Memo Drafting Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
description: golden eval proof obligation
source_id: "eval-commercial-credit-memo-drafting-agent-end-to-end"
tags:
  - banking
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
source_kind: generationSpec
source_path: behaviorContract.goldenEvals.0
generation_status: generated
ge_status: generated
---

# Golden eval obligation — Run the Commercial Credit Memo Drafting Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

- **Kind:** golden eval
- **Spec source:** behaviorContract.goldenEvals.0
- **Eval:** [commercial-credit-memo-drafting-agent-end-to-end](/tests/commercial-credit-memo-drafting-agent-end-to-end.md)


## Mechanisms

- [query_ncino_loan_origination_loan_applications](/tools/query-ncino-loan-origination-loan-applications.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [query_banking_3_banking_3_records](/tools/query-banking-3-banking-3-records.md)
- [lookup_commercial_credit_memo_drafting_agent_compliance_policy](/tools/lookup-commercial-credit-memo-drafting-agent-compliance-policy.md)
- [action_ncino_loan_origination_generate](/tools/action-ncino-loan-origination-generate.md)

## Entities that must be referenced

- loan_applications
- analytics_events
- banking_3_records

## Forbidden behaviors

- do not invent KPI numbers
- do not skip the evidence_lookup step before any recommendation
- do not execute generate without two-system evidence

# Citations

- [commercial-credit-memo-drafting-agent-compliance-policy](/documents/commercial-credit-memo-drafting-agent-compliance-policy.md)
