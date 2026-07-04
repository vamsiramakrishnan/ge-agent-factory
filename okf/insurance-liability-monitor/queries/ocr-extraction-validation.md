---
type: Query Capability
title: "Google Document AI reads COIs in non-standard formats from different insurers..."
description: "Google Document AI reads COIs in non-standard formats from different insurers. Extracts policy type, coverage limits, deductibles, named insured, additional insured status, and endorsements. Validates extracted amounts against contractual minimums."
source_id: "ocr-extraction-validation"
generation_status: inferred
tags:
  - procurement
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Google Document AI reads COIs in non-standard formats from different insurers. Extracts policy type, coverage limits, deductibles, named insured, additional insured status, and endorsements. Validates extracted amounts against contractual minimums.

## Tools used

- [query_contract_system_contract_system_records](/tools/query-contract-system-contract-system-records.md)
- [query_google_document_ai_google_document_ai_records](/tools/query-google-document-ai-google-document-ai-records.md)
- [lookup_insurance_liability_monitor_policy_guide](/tools/lookup-insurance-liability-monitor-policy-guide.md)
- [action_insurance_cert_management_validate](/tools/action-insurance-cert-management-validate.md)

## Runs in

- [ocr_extraction_validation](/workflow/ocr-extraction-validation.md)

## Evidence expected

- source_system_record
- document_reference
- api_response
- generated_audit_trail

## Evals

- [Run the Insurance & Liability Monitor workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/insurance-liability-monitor-end-to-end.md)

# Citations

- [Insurance & Liability Monitor Procurement Policy Guide](/documents/insurance-liability-monitor-policy-guide.md)
