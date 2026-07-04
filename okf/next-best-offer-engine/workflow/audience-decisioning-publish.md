---
type: Workflow Stage
title: "Audience Decisioning & Publish"
description: "Assemble the decisioned send audience, execute action_oracle_xstore_pos_publish to commit the offer set to Oracle Xstore POS, and record the audit_record_id for every published loyalty_id."
source_id: audience_decisioning_publish
tags:
  - retail
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Audience Decisioning & Publish

Assemble the decisioned send audience, execute action_oracle_xstore_pos_publish to commit the offer set to Oracle Xstore POS, and record the audit_record_id for every published loyalty_id.

- **Mode:** sequential
- **Stage:** 4 of 5

## Tools

- [query_oracle_xstore_pos_pos_transactions](/tools/query-oracle-xstore-pos-pos-transactions.md)
- [lookup_next_best_offer_engine_execution_playbook](/tools/lookup-next-best-offer-engine-execution-playbook.md)
- [action_oracle_xstore_pos_publish](/tools/action-oracle-xstore-pos-publish.md)

Next: [Holdout Measurement & Escalation](/workflow/holdout-measurement-escalation.md)
