---
type: Workflow Stage
title: Metadata Extraction
description: "Extract contract metadata from CLM — cycle times (request-to-signature), deviation rates by clause type, compliance scores, expiry dates. Aggregate in BigQuery dimensional model for trend analysis."
source_id: metadata_extraction
tags:
  - procurement
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Metadata Extraction

Extract contract metadata from CLM — cycle times (request-to-signature), deviation rates by clause type, compliance scores, expiry dates. Aggregate in BigQuery dimensional model for trend analysis.

- **Mode:** sequential
- **Stage:** 1 of 2

## Tools

- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [lookup_contract_analytics_dashboard_policy_guide](/tools/lookup-contract-analytics-dashboard-policy-guide.md)

Next: [Narrative Commentary](/workflow/narrative-commentary.md)
