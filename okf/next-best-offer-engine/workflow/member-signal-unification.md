---
type: Workflow Stage
title: Member Signal Unification
description: "Pull pos_transactions and tender_records from Oracle Xstore POS and join them with accounts and campaign_influence from Salesforce Marketing Cloud, landing a unified per-loyalty_id interaction history in BigQuery analytics_events."
source_id: member_signal_unification
tags:
  - retail
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Member Signal Unification

Pull pos_transactions and tender_records from Oracle Xstore POS and join them with accounts and campaign_influence from Salesforce Marketing Cloud, landing a unified per-loyalty_id interaction history in BigQuery analytics_events.

- **Mode:** sequential
- **Stage:** 1 of 5

## Tools

- [query_oracle_xstore_pos_pos_transactions](/tools/query-oracle-xstore-pos-pos-transactions.md)
- [query_salesforce_marketing_cloud_accounts](/tools/query-salesforce-marketing-cloud-accounts.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [lookup_next_best_offer_engine_execution_playbook](/tools/lookup-next-best-offer-engine-execution-playbook.md)
- [action_oracle_xstore_pos_publish](/tools/action-oracle-xstore-pos-publish.md)

Next: [Propensity & Price-Sensitivity Scoring](/workflow/propensity-price-sensitivity-scoring.md)
