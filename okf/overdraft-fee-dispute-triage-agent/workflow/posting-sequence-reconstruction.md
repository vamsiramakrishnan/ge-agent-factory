---
type: Workflow Stage
title: "Posting-Sequence Reconstruction"
description: "Rebuild the actual settled order of account_transactions (and any standing_orders retries) in Temenos Transact around the fee-triggering debit to establish whether the overdraft fee was caused by posting order rather than genuine insufficient funds."
source_id: posting_sequence_reconstruction
tags:
  - banking
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Posting-Sequence Reconstruction

Rebuild the actual settled order of account_transactions (and any standing_orders retries) in Temenos Transact around the fee-triggering debit to establish whether the overdraft fee was caused by posting order rather than genuine insufficient funds.

- **Mode:** sequential
- **Stage:** 2 of 5

## Tools

- [query_temenos_transact_core_accounts](/tools/query-temenos-transact-core-accounts.md)
- [lookup_overdraft_fee_dispute_triage_agent_compliance_policy](/tools/lookup-overdraft-fee-dispute-triage-agent-compliance-policy.md)
- [action_temenos_transact_escalate](/tools/action-temenos-transact-escalate.md)

Next: [Waiver History & Relationship Scoring](/workflow/waiver-history-relationship-scoring.md)
