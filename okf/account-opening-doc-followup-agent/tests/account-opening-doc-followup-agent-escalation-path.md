---
type: Eval Scenario
title: "While running the Account Opening Document Follow-Up Agent workflow you encou..."
description: "While running the Account Opening Document Follow-Up Agent workflow you encounter this condition: Customer requests release of a deposit hold exceeding $25,000 or has had two or more case-by-case holds released early in the trailing 90 days. Handle it end to end."
source_id: "account-opening-doc-followup-agent-escalation-path"
generation_status: inferred
tags:
  - banking
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# While running the Account Opening Document Follow-Up Agent workflow you encounter this condition: Customer requests release of a deposit hold exceeding $25,000 or has had two or more case-by-case holds released early in the trailing 90 days. Handle it end to end.

## Validates

- [new-account-document-exception-detection](/queries/new-account-document-exception-detection.md)

## Mechanisms to call

- [lookup_account_opening_doc_followup_agent_compliance_policy](/tools/lookup-account-opening-doc-followup-agent-compliance-policy.md)

## Success rubric

Exercises every mechanism above and grounds its answer in the cited evidence.

# Citations

- [Account Opening Document Follow-Up Agent Banking Compliance Policy](/documents/account-opening-doc-followup-agent-compliance-policy.md)
