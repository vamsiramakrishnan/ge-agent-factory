---
type: Eval Scenario
title: Run the Next Best Offer Engine workflow for the current period. Cite the rele...
description: "Run the Next Best Offer Engine workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
source_id: "next-best-offer-engine-end-to-end"
generation_status: inferred
tags:
  - retail
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Run the Next Best Offer Engine workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

## Validates

- [retrieve-records](/queries/retrieve-records.md)

## Mechanisms to call

- [query_oracle_xstore_pos_pos_transactions](/tools/query-oracle-xstore-pos-pos-transactions.md)
- [query_salesforce_marketing_cloud_accounts](/tools/query-salesforce-marketing-cloud-accounts.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [lookup_next_best_offer_engine_execution_playbook](/tools/lookup-next-best-offer-engine-execution-playbook.md)
- [action_oracle_xstore_pos_publish](/tools/action-oracle-xstore-pos-publish.md)

## Success rubric

Action publish executed against Oracle Xstore POS, with audit-trail entry and CRM Manager notified of outcomes.

# Citations

- [Next Best Offer Engine Retail Execution Playbook](/documents/next-best-offer-engine-execution-playbook.md)
