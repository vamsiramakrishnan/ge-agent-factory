---
type: Agent Tool
title: lookup_account_reconciliation_agent_controls_playbook
description: "Look up sections of the Account Reconciliation Agent Controls Playbook to cite in narrative output, escalation rationale, and audit evidence."
tags:
  - finance
  - okf
  - brd
timestamp: "2026-06-20T00:25:58.081Z"
---

# lookup_account_reconciliation_agent_controls_playbook

Look up sections of the Account Reconciliation Agent Controls Playbook to cite in narrative output, escalation rationale, and audit evidence.

- **Kind:** evidence_lookup
- **Source system:** [BigQuery](/systems/bigquery.md)

## Required inputs

- section_anchor

## Produces

- document_section
- citation_anchor

## Evidence emitted

- document_reference

# Examples

```
lookup_account_reconciliation_agent_controls_playbook(section_anchor=<section_anchor>)
```

## Used by

- [balance__document__pull](/workflow/balance-document-pull.md)
- [auto__matching__risk__scoring](/workflow/auto-matching-risk-scoring.md)
- [complex__account__validation](/workflow/complex-account-validation.md)
- [workpaper__generation](/workflow/workpaper-generation.md)
