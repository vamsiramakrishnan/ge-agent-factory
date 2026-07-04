---
type: Workflow Stage
title: "Bill Intake & Line-Item Extraction"
description: "Pull claim, claim_exposures, and reserve_lines records for the incoming CMS-1500/UB-04 bill from Guidewire ClaimCenter (query_guidewire_claimcenter_claims) to anchor every billed line to the correct claim_number, coverage_code, and injury profile."
source_id: bill_intake_line_item_extraction
tags:
  - insurance
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Bill Intake & Line-Item Extraction

Pull claim, claim_exposures, and reserve_lines records for the incoming CMS-1500/UB-04 bill from Guidewire ClaimCenter (query_guidewire_claimcenter_claims) to anchor every billed line to the correct claim_number, coverage_code, and injury profile.

- **Mode:** sequential
- **Stage:** 1 of 6

## Tools

- [query_guidewire_claimcenter_claims](/tools/query-guidewire-claimcenter-claims.md)
- [query_insurance_3_insurance_3_records](/tools/query-insurance-3-insurance-3-records.md)
- [lookup_medical_bill_review_engine_authority_guide](/tools/lookup-medical-bill-review-engine-authority-guide.md)
- [action_guidewire_claimcenter_file](/tools/action-guidewire-claimcenter-file.md)

Next: [Fee Schedule & Coding Validation](/workflow/fee-schedule-coding-validation.md)
