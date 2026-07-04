---
type: Proof Obligation
title: "Golden eval obligation — Run the Account Opening Document Follow-Up Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
description: golden eval proof obligation
source_id: "eval-account-opening-doc-followup-agent-end-to-end"
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

# Golden eval obligation — Run the Account Opening Document Follow-Up Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

- **Kind:** golden eval
- **Spec source:** behaviorContract.goldenEvals.0
- **Eval:** [account-opening-doc-followup-agent-end-to-end](/tests/account-opening-doc-followup-agent-end-to-end.md)


## Mechanisms

- [query_temenos_transact_core_accounts](/tools/query-temenos-transact-core-accounts.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [query_docusign_envelopes](/tools/query-docusign-envelopes.md)
- [lookup_account_opening_doc_followup_agent_compliance_policy](/tools/lookup-account-opening-doc-followup-agent-compliance-policy.md)
- [action_temenos_transact_escalate](/tools/action-temenos-transact-escalate.md)

## Entities that must be referenced

- core_accounts
- analytics_events
- envelopes

## Forbidden behaviors

- do not invent KPI numbers
- do not skip the evidence_lookup step before any recommendation
- do not execute escalate without two-system evidence

# Citations

- [account-opening-doc-followup-agent-compliance-policy](/documents/account-opening-doc-followup-agent-compliance-policy.md)
