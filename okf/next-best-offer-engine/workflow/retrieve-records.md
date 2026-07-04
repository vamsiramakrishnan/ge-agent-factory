---
type: Workflow Stage
title: Retrieve Records
description: Query pos transactions and tender records from Oracle Xstore POS and correlate with Salesforce Marketing Cloud for the Next Best Offer Engine workflow.
source_id: retrieve_records
tags:
  - retail
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Retrieve Records

Query pos transactions and tender records from Oracle Xstore POS and correlate with Salesforce Marketing Cloud for the Next Best Offer Engine workflow.

- **Mode:** sequential
- **Stage:** 1 of 4

## Tools

- [query_oracle_xstore_pos_pos_transactions](/tools/query-oracle-xstore-pos-pos-transactions.md)
- [query_salesforce_marketing_cloud_accounts](/tools/query-salesforce-marketing-cloud-accounts.md)
- [lookup_next_best_offer_engine_execution_playbook](/tools/lookup-next-best-offer-engine-execution-playbook.md)
- [action_oracle_xstore_pos_publish](/tools/action-oracle-xstore-pos-publish.md)

Next: [Analyze & Detect](/workflow/analyze-detect.md)
