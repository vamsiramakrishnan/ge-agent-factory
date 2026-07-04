---
type: Query Capability
title: Collect vendor data from request form or existing master. Validate TIN agains...
description: "Collect vendor data from request form or existing master. Validate TIN against IRS matching service, verify business existence via D&B."
source_id: "data-collection-validation"
generation_status: inferred
tags:
  - finance
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Collect vendor data from request form or existing master. Validate TIN against IRS matching service, verify business existence via D&B.

## Tools used

- [query_irs_tin_matching_irs_tin_matching_records](/tools/query-irs-tin-matching-irs-tin-matching-records.md)
- [lookup_vendor_master_data_manager_controls_playbook](/tools/lookup-vendor-master-data-manager-controls-playbook.md)

## Runs in

- [data_collection_validation](/workflow/data-collection-validation.md)

## Evidence expected

- source_system_record
- document_reference

## Evals

- [Run the Vendor Master Data Manager workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/vendor-master-data-manager-end-to-end.md)

# Citations

- [Vendor Master Data Manager Controls Playbook](/documents/vendor-master-data-manager-controls-playbook.md)
