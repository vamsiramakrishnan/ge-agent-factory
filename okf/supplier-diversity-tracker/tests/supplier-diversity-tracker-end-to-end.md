---
type: Eval Scenario
title: Run the Supplier Diversity Tracker workflow for the current period. Cite the ...
description: "Run the Supplier Diversity Tracker workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
source_id: "supplier-diversity-tracker-end-to-end"
generation_status: inferred
tags:
  - procurement
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Run the Supplier Diversity Tracker workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

## Validates

- [certification-sync-vendor-matching](/queries/certification-sync-vendor-matching.md)

## Mechanisms to call

- [query_supplier_io_supplier_io_records](/tools/query-supplier-io-supplier-io-records.md)
- [query_nmsdc_nmsdc_records](/tools/query-nmsdc-nmsdc-records.md)
- [query_wbenc_wbenc_records](/tools/query-wbenc-wbenc-records.md)
- [query_sba_sba_records](/tools/query-sba-sba-records.md)
- [lookup_supplier_diversity_tracker_policy_guide](/tools/lookup-supplier-diversity-tracker-policy-guide.md)
- [action_supplier_io_generate](/tools/action-supplier-io-generate.md)

## Success rubric

Action generate executed against Supplier.io, with audit-trail entry and Supplier Development Mgr notified of outcomes.

# Citations

- [Supplier Diversity Tracker Procurement Policy Guide](/documents/supplier-diversity-tracker-policy-guide.md)
