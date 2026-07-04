---
type: Eval Scenario
title: "Run the Lapsed Member Win-Back Orchestrator workflow for the current period. ..."
description: "Run the Lapsed Member Win-Back Orchestrator workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
source_id: "member-winback-orchestrator-end-to-end"
generation_status: inferred
tags:
  - retail
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Run the Lapsed Member Win-Back Orchestrator workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

## Validates

- [retrieve-records](/queries/retrieve-records.md)

## Mechanisms to call

- [query_oracle_xstore_pos_pos_transactions](/tools/query-oracle-xstore-pos-pos-transactions.md)
- [query_salesforce_marketing_cloud_accounts](/tools/query-salesforce-marketing-cloud-accounts.md)
- [query_segment_segment_records](/tools/query-segment-segment-records.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [lookup_member_winback_orchestrator_execution_playbook](/tools/lookup-member-winback-orchestrator-execution-playbook.md)
- [action_oracle_xstore_pos_generate](/tools/action-oracle-xstore-pos-generate.md)

## Success rubric

Action generate executed against Oracle Xstore POS, with audit-trail entry and Retention Marketing Manager notified of outcomes.

# Citations

- [Lapsed Member Win-Back Orchestrator Retail Execution Playbook](/documents/member-winback-orchestrator-execution-playbook.md)
