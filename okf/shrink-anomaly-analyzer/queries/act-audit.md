---
type: Query Capability
title: "Execute the file step in Oracle Xstore POS with a full audit trail, and escal..."
description: "Execute the file step in Oracle Xstore POS with a full audit trail, and escalate exceptions to the Loss Prevention Manager."
source_id: "act-audit"
generation_status: inferred
tags:
  - retail
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Execute the file step in Oracle Xstore POS with a full audit trail, and escalate exceptions to the Loss Prevention Manager.

## Tools used

- [query_oracle_xstore_pos_pos_transactions](/tools/query-oracle-xstore-pos-pos-transactions.md)
- [action_oracle_xstore_pos_file](/tools/action-oracle-xstore-pos-file.md)

## Runs in

- [act_audit](/workflow/act-audit.md)

## Evidence expected

- source_system_record
- api_response
- generated_audit_trail

## Evals

- [Run the Shrink Anomaly Analyzer workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/shrink-anomaly-analyzer-end-to-end.md)

# Citations

- [Shrink Anomaly Analyzer Retail Execution Playbook](/documents/shrink-anomaly-analyzer-execution-playbook.md)
