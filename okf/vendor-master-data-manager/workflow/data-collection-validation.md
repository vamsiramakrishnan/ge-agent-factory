---
type: Workflow Stage
title: "Data Collection & Validation"
description: "Collect vendor data from request form or existing master. Validate TIN against IRS matching service, verify business existence via D&B."
source_id: data_collection_validation
tags:
  - finance
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Data Collection & Validation

Collect vendor data from request form or existing master. Validate TIN against IRS matching service, verify business existence via D&B.

- **Mode:** sequential
- **Stage:** 1 of 4

## Tools

- [query_irs_tin_matching_irs_tin_matching_records](/tools/query-irs-tin-matching-irs-tin-matching-records.md)
- [lookup_vendor_master_data_manager_controls_playbook](/tools/lookup-vendor-master-data-manager-controls-playbook.md)

Next: [Duplicate & Quality Detection](/workflow/duplicate-quality-detection.md)
