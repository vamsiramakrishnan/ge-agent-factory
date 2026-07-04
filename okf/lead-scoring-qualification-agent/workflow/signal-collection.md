---
type: Workflow Stage
title: Signal Collection
description: Receive behavioral events from MAP. Enrich with firmographic data from 6sense/Demandbase. Match to CRM records with account hierarchy resolution.
source_id: signal_collection
tags:
  - marketing
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Signal Collection

Receive behavioral events from MAP. Enrich with firmographic data from 6sense/Demandbase. Match to CRM records with account hierarchy resolution.

- **Mode:** sequential
- **Stage:** 1 of 4

## Tools

- [query_salesforce_crm_accounts](/tools/query-salesforce-crm-accounts.md)
- [query_6sense_6sense_records](/tools/query-6sense-6sense-records.md)
- [query_demandbase_demandbase_records](/tools/query-demandbase-demandbase-records.md)

Next: [Predictive Scoring](/workflow/predictive-scoring.md)
