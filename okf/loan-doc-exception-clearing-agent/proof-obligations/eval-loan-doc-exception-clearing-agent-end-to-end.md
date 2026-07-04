---
type: Proof Obligation
title: "Golden eval obligation — Run the Loan Documentation Exception Clearing Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
description: golden eval proof obligation
source_id: "eval-loan-doc-exception-clearing-agent-end-to-end"
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

# Golden eval obligation — Run the Loan Documentation Exception Clearing Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

- **Kind:** golden eval
- **Spec source:** behaviorContract.goldenEvals.0
- **Eval:** [loan-doc-exception-clearing-agent-end-to-end](/tests/loan-doc-exception-clearing-agent-end-to-end.md)


## Mechanisms

- [query_ncino_loan_origination_loan_applications](/tools/query-ncino-loan-origination-loan-applications.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [query_docusign_envelopes](/tools/query-docusign-envelopes.md)
- [query_servicenow_tickets](/tools/query-servicenow-tickets.md)
- [lookup_loan_doc_exception_clearing_agent_compliance_policy](/tools/lookup-loan-doc-exception-clearing-agent-compliance-policy.md)
- [action_ncino_loan_origination_escalate](/tools/action-ncino-loan-origination-escalate.md)

## Entities that must be referenced

- loan_applications
- analytics_events
- envelopes
- tickets

## Forbidden behaviors

- do not invent KPI numbers
- do not skip the evidence_lookup step before any recommendation
- do not execute escalate without two-system evidence

# Citations

- [loan-doc-exception-clearing-agent-compliance-policy](/documents/loan-doc-exception-clearing-agent-compliance-policy.md)
