---
type: Agent Tool
title: lookup_journal_entry_auto_posting_controls_playbook
description: "Look up sections of the Journal Entry Auto-Posting Controls Playbook to cite in narrative output, escalation rationale, and audit evidence."
tags:
  - finance
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
source_kind: generationSpec
source_path: behaviorContract.toolIntents
generation_status: generated
ge_status: generated
---

# lookup_journal_entry_auto_posting_controls_playbook

Look up sections of the Journal Entry Auto-Posting Controls Playbook to cite in narrative output, escalation rationale, and audit evidence.

- **Kind:** evidence_lookup
- **Source system:** [SAP S/4HANA FI](/systems/sap-s-4hana-fi.md)

## Inputs

- section_anchor

## Outputs

- document_section
- citation_anchor

## Side Effects

- No mutation is declared by the spec for this tool.

## Idempotency

No idempotency key declared; no mutation is declared by the spec for this tool.

## Confirmation

No write confirmation policy is derivable from the spec.

## Permissions

No explicit permission scopes declared; source-system access is tied to [SAP S/4HANA FI](/systems/sap-s-4hana-fi.md).

## Failure Modes

No explicit failure modes are declared in the spec; rely on refusal/escalation policies for unsafe or incomplete evidence.

## Used By

- [transaction_reception](/workflow/transaction-reception.md)
- [pattern_matching_classification](/workflow/pattern-matching-classification.md)
- [non_standard_interpretation](/workflow/non-standard-interpretation.md)
- [posting_audit_trail](/workflow/posting-audit-trail.md)

## Evals

- [Run the Journal Entry Auto-Posting workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/journal-entry-auto-posting-end-to-end.md)

## Evidence emitted

- document_reference

## Required inputs

- section_anchor

## Produces

- document_section
- citation_anchor

# Examples

```
lookup_journal_entry_auto_posting_controls_playbook(section_anchor=<section_anchor>)
```

# Citations

- [SAP S/4HANA FI](/systems/sap-s-4hana-fi.md)
