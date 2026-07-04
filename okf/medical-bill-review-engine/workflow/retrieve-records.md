---
type: Workflow Stage
title: Retrieve Records
description: Query claims and claim exposures from Guidewire ClaimCenter for the Medical Bill Review Engine workflow.
source_id: retrieve_records
tags:
  - insurance
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Retrieve Records

Query claims and claim exposures from Guidewire ClaimCenter for the Medical Bill Review Engine workflow.

- **Mode:** sequential
- **Stage:** 1 of 4

## Tools

- [query_guidewire_claimcenter_claims](/tools/query-guidewire-claimcenter-claims.md)
- [query_insurance_3_insurance_3_records](/tools/query-insurance-3-insurance-3-records.md)
- [lookup_medical_bill_review_engine_authority_guide](/tools/lookup-medical-bill-review-engine-authority-guide.md)
- [action_guidewire_claimcenter_file](/tools/action-guidewire-claimcenter-file.md)

Next: [Analyze & Detect](/workflow/analyze-detect.md)
