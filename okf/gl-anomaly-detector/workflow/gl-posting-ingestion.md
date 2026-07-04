---
type: Workflow Stage
title: GL Posting Ingestion
description: "Continuously ingest GL postings from SAP. Capture posting amount, account combination, user, timestamp, and memo field for analysis."
source_id: gl_posting_ingestion
tags:
  - finance
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# GL Posting Ingestion

Continuously ingest GL postings from SAP. Capture posting amount, account combination, user, timestamp, and memo field for analysis.

- **Mode:** sequential
- **Stage:** 1 of 3

## Tools

- [query_sap_s_4hana_fi_gl_entries](/tools/query-sap-s-4hana-fi-gl-entries.md)
- [action_sap_s_4hana_fi_post](/tools/action-sap-s-4hana-fi-post.md)

Next: [Statistical Anomaly Detection](/workflow/statistical-anomaly-detection.md)
