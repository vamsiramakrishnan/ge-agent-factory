---
type: Query Capability
title: "Execute the publish step in Oracle Xstore POS with a full audit trail, and es..."
description: "Execute the publish step in Oracle Xstore POS with a full audit trail, and escalate exceptions to the CRM Manager."
source_id: "act-audit"
generation_status: inferred
tags:
  - retail
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Execute the publish step in Oracle Xstore POS with a full audit trail, and escalate exceptions to the CRM Manager.

## Tools used

- [query_oracle_xstore_pos_pos_transactions](/tools/query-oracle-xstore-pos-pos-transactions.md)
- [action_oracle_xstore_pos_publish](/tools/action-oracle-xstore-pos-publish.md)

## Runs in

- [act_audit](/workflow/act-audit.md)

## Evidence expected

- source_system_record
- api_response
- generated_audit_trail

## Evals

- [Run the Next Best Offer Engine workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/next-best-offer-engine-end-to-end.md)

# Citations

- [Next Best Offer Engine Retail Execution Playbook](/documents/next-best-offer-engine-execution-playbook.md)
