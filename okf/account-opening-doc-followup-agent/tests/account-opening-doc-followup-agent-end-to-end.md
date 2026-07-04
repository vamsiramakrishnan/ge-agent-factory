---
type: Eval Scenario
title: "Run the Account Opening Document Follow-Up Agent workflow for the current per..."
description: "Run the Account Opening Document Follow-Up Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
source_id: "account-opening-doc-followup-agent-end-to-end"
generation_status: inferred
tags:
  - banking
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Run the Account Opening Document Follow-Up Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

## Validates

- [new-account-document-exception-detection](/queries/new-account-document-exception-detection.md)

## Mechanisms to call

- [query_temenos_transact_core_accounts](/tools/query-temenos-transact-core-accounts.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [query_docusign_envelopes](/tools/query-docusign-envelopes.md)
- [lookup_account_opening_doc_followup_agent_compliance_policy](/tools/lookup-account-opening-doc-followup-agent-compliance-policy.md)
- [action_temenos_transact_escalate](/tools/action-temenos-transact-escalate.md)

## Success rubric

Action escalate executed against Temenos Transact, with audit-trail entry and Branch Operations Manager notified of outcomes.

# Citations

- [Account Opening Document Follow-Up Agent Banking Compliance Policy](/documents/account-opening-doc-followup-agent-compliance-policy.md)
