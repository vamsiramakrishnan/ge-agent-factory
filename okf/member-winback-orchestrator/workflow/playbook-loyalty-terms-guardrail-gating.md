---
type: Workflow Stage
title: "Playbook & Loyalty-Terms Guardrail Gating"
description: "Validate the proposed lapse reason, offer depth, and eligibility window against the Lapsed Member Win-Back Orchestrator Retail Execution Playbook and the Loyalty Program Terms doc (lookup_member_winback_orchestrator_execution_playbook), checking Salesforce Marketing Cloud accounts for do-not-contact, cool-down, and points-expiration flags."
source_id: playbook_loyalty_terms_guardrail_gating
tags:
  - retail
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Playbook & Loyalty-Terms Guardrail Gating

Validate the proposed lapse reason, offer depth, and eligibility window against the Lapsed Member Win-Back Orchestrator Retail Execution Playbook and the Loyalty Program Terms doc (lookup_member_winback_orchestrator_execution_playbook), checking Salesforce Marketing Cloud accounts for do-not-contact, cool-down, and points-expiration flags.

- **Mode:** sequential
- **Stage:** 3 of 5

## Tools

- [query_oracle_xstore_pos_pos_transactions](/tools/query-oracle-xstore-pos-pos-transactions.md)
- [query_salesforce_marketing_cloud_accounts](/tools/query-salesforce-marketing-cloud-accounts.md)
- [lookup_member_winback_orchestrator_execution_playbook](/tools/lookup-member-winback-orchestrator-execution-playbook.md)
- [action_oracle_xstore_pos_generate](/tools/action-oracle-xstore-pos-generate.md)

Next: [Marketing Cloud Journey Dispatch](/workflow/marketing-cloud-journey-dispatch.md)
