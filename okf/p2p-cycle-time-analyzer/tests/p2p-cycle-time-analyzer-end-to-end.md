---
type: Eval Scenario
title: Run the P2P Cycle Time Analyzer workflow for the current period. Cite the rel...
description: "Run the P2P Cycle Time Analyzer workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
source_id: "p2p-cycle-time-analyzer-end-to-end"
generation_status: inferred
tags:
  - procurement
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Run the P2P Cycle Time Analyzer workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

## Validates

- [event-log-extraction](/queries/event-log-extraction.md)

## Mechanisms to call

- [query_sap_s_4hana_transactions](/tools/query-sap-s-4hana-transactions.md)
- [query_coupa_requisitions](/tools/query-coupa-requisitions.md)
- [query_celonis_celonis_records](/tools/query-celonis-celonis-records.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [lookup_p2p_cycle_time_analyzer_policy_guide](/tools/lookup-p2p-cycle-time-analyzer-policy-guide.md)
- [action_sap_s_4hana_recommend](/tools/action-sap-s-4hana-recommend.md)

## Success rubric

Action recommend executed against SAP S/4HANA, with audit-trail entry and P2P Operations Manager notified of outcomes.

# Citations

- [P2P Cycle Time Analyzer Procurement Policy Guide](/documents/p2p-cycle-time-analyzer-policy-guide.md)
