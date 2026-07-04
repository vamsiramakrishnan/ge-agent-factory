---
type: Query Capability
title: "Execute the generate step in Oracle Xstore POS with a full audit trail, and e..."
description: "Execute the generate step in Oracle Xstore POS with a full audit trail, and escalate exceptions to the Retention Marketing Manager."
source_id: "act-audit"
generation_status: inferred
tags:
  - retail
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Execute the generate step in Oracle Xstore POS with a full audit trail, and escalate exceptions to the Retention Marketing Manager.

## Tools used

- [query_oracle_xstore_pos_pos_transactions](/tools/query-oracle-xstore-pos-pos-transactions.md)
- [query_salesforce_marketing_cloud_accounts](/tools/query-salesforce-marketing-cloud-accounts.md)
- [action_oracle_xstore_pos_generate](/tools/action-oracle-xstore-pos-generate.md)

## Runs in

- [act_audit](/workflow/act-audit.md)

## Evidence expected

- source_system_record
- api_response
- generated_audit_trail

## Evals

- [Run the Lapsed Member Win-Back Orchestrator workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/member-winback-orchestrator-end-to-end.md)

# Citations

- [Lapsed Member Win-Back Orchestrator Retail Execution Playbook](/documents/member-winback-orchestrator-execution-playbook.md)
