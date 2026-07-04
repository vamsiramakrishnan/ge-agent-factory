---
type: Workflow Stage
title: "Verification & Consistency Checks"
description: "TIN/W-9 validated via IRS matching service. Bank account verified. Entity name consistency checked across all documents — bank letter says 'Acme LLC' but W-9 says 'Acme Industries Inc.' flagged for verification rather than creating duplicates."
source_id: verification_consistency_checks
tags:
  - procurement
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Verification & Consistency Checks

TIN/W-9 validated via IRS matching service. Bank account verified. Entity name consistency checked across all documents — bank letter says 'Acme LLC' but W-9 says 'Acme Industries Inc.' flagged for verification rather than creating duplicates.

- **Mode:** sequential
- **Stage:** 2 of 3

## Tools

- [query_irs_tin_irs_tin_records](/tools/query-irs-tin-irs-tin-records.md)

Next: [Vendor Master Creation & Provisioning](/workflow/vendor-master-creation-provisioning.md)
