---
type: Workflow Stage
title: "Duplicate & Quality Detection"
description: "Check for duplicate vendors using data quality scoring — name similarity, address matching, TIN comparison. Identify dormant vendors for cleanup."
source_id: duplicate_quality_detection
tags:
  - finance
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Duplicate & Quality Detection

Check for duplicate vendors using data quality scoring — name similarity, address matching, TIN comparison. Identify dormant vendors for cleanup.

- **Mode:** sequential
- **Stage:** 2 of 4

## Tools

- [query_irs_tin_matching_irs_tin_matching_records](/tools/query-irs-tin-matching-irs-tin-matching-records.md)
- [lookup_vendor_master_data_manager_controls_playbook](/tools/lookup-vendor-master-data-manager-controls-playbook.md)

Next: [Identity Resolution](/workflow/identity-resolution.md)
