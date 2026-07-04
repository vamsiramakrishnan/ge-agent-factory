---
type: Workflow Stage
title: "Certification Sync & Vendor Matching"
description: "Sync diversity certification data from NMSDC, WBENC, and SBA registries. Match certifications against vendor master records in Ariba/Coupa. Flag expired or ambiguous certification statuses."
source_id: certification_sync_vendor_matching
tags:
  - procurement
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Certification Sync & Vendor Matching

Sync diversity certification data from NMSDC, WBENC, and SBA registries. Match certifications against vendor master records in Ariba/Coupa. Flag expired or ambiguous certification statuses.

- **Mode:** sequential
- **Stage:** 1 of 3

## Tools

- [query_supplier_io_supplier_io_records](/tools/query-supplier-io-supplier-io-records.md)
- [query_nmsdc_nmsdc_records](/tools/query-nmsdc-nmsdc-records.md)
- [query_wbenc_wbenc_records](/tools/query-wbenc-wbenc-records.md)
- [query_sba_sba_records](/tools/query-sba-sba-records.md)
- [lookup_supplier_diversity_tracker_policy_guide](/tools/lookup-supplier-diversity-tracker-policy-guide.md)

Next: [Spend Attribution & Goal Tracking](/workflow/spend-attribution-goal-tracking.md)
