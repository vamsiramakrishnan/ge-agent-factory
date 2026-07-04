---
type: Agent Tool
title: query_docusign_envelopes
description: "Retrieve envelopes from DocuSign for the Account Opening Document Follow-Up Agent workflow."
tags:
  - banking
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
source_kind: generationSpec
source_path: behaviorContract.toolIntents
generation_status: generated
ge_status: generated
---

# query_docusign_envelopes

Retrieve envelopes from DocuSign for the Account Opening Document Follow-Up Agent workflow.

- **Kind:** query
- **Source system:** [DocuSign](/systems/docusign.md)

## Inputs

- lookup_key
- date_range

## Outputs

- envelopes_records
- envelopes_summary

## Side Effects

- No mutation is declared by the spec for this tool.

## Idempotency

No idempotency key declared; no mutation is declared by the spec for this tool.

## Confirmation

No write confirmation policy is derivable from the spec.

## Permissions

No explicit permission scopes declared; source-system access is tied to [DocuSign](/systems/docusign.md).

## Failure Modes

No explicit failure modes are declared in the spec; rely on refusal/escalation policies for unsafe or incomplete evidence.

## Used By

- [docu_sign_envelope_recipient_reconciliation](/workflow/docu-sign-envelope-recipient-reconciliation.md)

## Evals

- [Run the Account Opening Document Follow-Up Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/account-opening-doc-followup-agent-end-to-end.md)
- [Core account 40218273 (product_type savings) was booked 14 days ago with reg_dd_disclosure_acknowledged still false. Its DocuSign envelope shows status 'sent' as of yesterday, but the audit_trails record has no completed action from the customer. Branch staff say they saw an email reply and want the exception closed today. Determine whether the document packet is actually cured and what should happen next.](/tests/account-opening-doc-followup-agent-stale-envelope-conflict.md)
- [Two savings accounts opened the same week need a decision today: account 55901234 (open_date 12 days ago, signature card still unsigned in DocuSign) and account 55901240 (open_date 9 days ago, its envelope shows status terminated with no identity-verification document on file in core_accounts). Reconcile which exception must escalate now versus stay on the reminder cadence, and recommend the next action for each.](/tests/account-opening-doc-followup-agent-aging-threshold-reconciliation.md)

## Evidence emitted

- source_system_record

## Required inputs

- lookup_key
- date_range

## Produces

- envelopes_records
- envelopes_summary

# Examples

```
query_docusign_envelopes(lookup_key=<lookup_key>, date_range=<date_range>)
```

# Citations

- [DocuSign](/systems/docusign.md)
