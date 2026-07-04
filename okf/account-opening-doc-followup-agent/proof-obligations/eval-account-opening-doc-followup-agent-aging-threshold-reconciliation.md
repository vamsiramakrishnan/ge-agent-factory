---
type: Proof Obligation
title: "Golden eval obligation — Two savings accounts opened the same week need a decision today: account 55901234 (open_date 12 days ago, signature card still unsigned in DocuSign) and account 55901240 (open_date 9 days ago, its envelope shows status terminated with no identity-verification document on file in core_accounts). Reconcile which exception must escalate now versus stay on the reminder cadence, and recommend the next action for each."
description: golden eval proof obligation
source_id: "eval-account-opening-doc-followup-agent-aging-threshold-reconciliation"
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

# Golden eval obligation — Two savings accounts opened the same week need a decision today: account 55901234 (open_date 12 days ago, signature card still unsigned in DocuSign) and account 55901240 (open_date 9 days ago, its envelope shows status terminated with no identity-verification document on file in core_accounts). Reconcile which exception must escalate now versus stay on the reminder cadence, and recommend the next action for each.

- **Kind:** golden eval
- **Spec source:** behaviorContract.goldenEvals.4
- **Eval:** [account-opening-doc-followup-agent-aging-threshold-reconciliation](/tests/account-opening-doc-followup-agent-aging-threshold-reconciliation.md)


## Mechanisms

- [query_temenos_transact_core_accounts](/tools/query-temenos-transact-core-accounts.md)
- [query_docusign_envelopes](/tools/query-docusign-envelopes.md)
- [lookup_account_opening_doc_followup_agent_compliance_policy](/tools/lookup-account-opening-doc-followup-agent-compliance-policy.md)
- [action_temenos_transact_escalate](/tools/action-temenos-transact-escalate.md)

## Entities that must be referenced

- core_accounts
- envelopes
- recipients

## Forbidden behaviors

- escalating both accounts identically without distinguishing severity
- invoking action_temenos_transact_escalate for either account without citing the required evidence for that specific account

# Citations

- [account-opening-doc-followup-agent-compliance-policy](/documents/account-opening-doc-followup-agent-compliance-policy.md)
- [account-opening-required-document-checklist-runbook](/documents/account-opening-required-document-checklist-runbook.md)
