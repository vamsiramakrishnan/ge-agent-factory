---
type: Query Capability
title: "Sync diversity certification data from NMSDC, WBENC, and SBA registries. Matc..."
description: "Sync diversity certification data from NMSDC, WBENC, and SBA registries. Match certifications against vendor master records in Ariba/Coupa. Flag expired or ambiguous certification statuses."
source_id: "certification-sync-vendor-matching"
generation_status: inferred
tags:
  - procurement
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Sync diversity certification data from NMSDC, WBENC, and SBA registries. Match certifications against vendor master records in Ariba/Coupa. Flag expired or ambiguous certification statuses.

## Tools used

- [query_supplier_io_supplier_io_records](/tools/query-supplier-io-supplier-io-records.md)
- [query_nmsdc_nmsdc_records](/tools/query-nmsdc-nmsdc-records.md)
- [query_wbenc_wbenc_records](/tools/query-wbenc-wbenc-records.md)
- [query_sba_sba_records](/tools/query-sba-sba-records.md)
- [lookup_supplier_diversity_tracker_policy_guide](/tools/lookup-supplier-diversity-tracker-policy-guide.md)

## Runs in

- [certification_sync_vendor_matching](/workflow/certification-sync-vendor-matching.md)

## Evidence expected

- source_system_record
- document_reference

## Evals

- [Run the Supplier Diversity Tracker workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/supplier-diversity-tracker-end-to-end.md)

# Citations

- [Supplier Diversity Tracker Procurement Policy Guide](/documents/supplier-diversity-tracker-policy-guide.md)
