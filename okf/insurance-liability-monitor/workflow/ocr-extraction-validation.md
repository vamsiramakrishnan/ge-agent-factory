---
type: Workflow Stage
title: "OCR Extraction & Validation"
description: "Google Document AI reads COIs in non-standard formats from different insurers. Extracts policy type, coverage limits, deductibles, named insured, additional insured status, and endorsements. Validates extracted amounts against contractual minimums."
source_id: ocr_extraction_validation
tags:
  - procurement
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# OCR Extraction & Validation

Google Document AI reads COIs in non-standard formats from different insurers. Extracts policy type, coverage limits, deductibles, named insured, additional insured status, and endorsements. Validates extracted amounts against contractual minimums.

- **Mode:** sequential
- **Stage:** 2 of 3

## Tools

- [query_contract_system_contract_system_records](/tools/query-contract-system-contract-system-records.md)
- [query_google_document_ai_google_document_ai_records](/tools/query-google-document-ai-google-document-ai-records.md)
- [lookup_insurance_liability_monitor_policy_guide](/tools/lookup-insurance-liability-monitor-policy-guide.md)
- [action_insurance_cert_management_validate](/tools/action-insurance-cert-management-validate.md)

Next: [Coverage Gap & Endorsement Analysis](/workflow/coverage-gap-endorsement-analysis.md)
