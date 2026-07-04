---
type: Eval Scenario
title: "Run the On-Shelf Availability Monitor workflow for the current period. Cite t..."
description: "Run the On-Shelf Availability Monitor workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
source_id: "on-shelf-availability-monitor-end-to-end"
generation_status: inferred
tags:
  - retail
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Run the On-Shelf Availability Monitor workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

## Validates

- [retrieve-records](/queries/retrieve-records.md)

## Mechanisms to call

- [query_oracle_xstore_pos_pos_transactions](/tools/query-oracle-xstore-pos-pos-transactions.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [query_looker_dashboards](/tools/query-looker-dashboards.md)
- [lookup_on_shelf_availability_monitor_execution_playbook](/tools/lookup-on-shelf-availability-monitor-execution-playbook.md)
- [action_oracle_xstore_pos_publish](/tools/action-oracle-xstore-pos-publish.md)

## Success rubric

Action publish executed against Oracle Xstore POS, with audit-trail entry and Store Operations Director notified of outcomes.

# Citations

- [On-Shelf Availability Monitor Retail Execution Playbook](/documents/on-shelf-availability-monitor-execution-playbook.md)
