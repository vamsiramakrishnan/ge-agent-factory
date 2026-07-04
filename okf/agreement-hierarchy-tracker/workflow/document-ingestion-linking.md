---
type: Workflow Stage
title: "Document Ingestion & Linking"
description: "Receive new amendment, SOW, or change order. Link to parent agreement in CLM. Update relationship graph in BigQuery: MSA to SOW to amendments to change orders to POs. Validate linkages on each new document."
source_id: document_ingestion_linking
tags:
  - procurement
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Document Ingestion & Linking

Receive new amendment, SOW, or change order. Link to parent agreement in CLM. Update relationship graph in BigQuery: MSA to SOW to amendments to change orders to POs. Validate linkages on each new document.

- **Mode:** sequential
- **Stage:** 1 of 3

## Tools

- [query_docusign_clm_contracts](/tools/query-docusign-clm-contracts.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [lookup_agreement_hierarchy_tracker_policy_guide](/tools/lookup-agreement-hierarchy-tracker-policy-guide.md)
- [action_icertis_update](/tools/action-icertis-update.md)

Next: [Graph Analytics & Orphan Detection](/workflow/graph-analytics-orphan-detection.md)
