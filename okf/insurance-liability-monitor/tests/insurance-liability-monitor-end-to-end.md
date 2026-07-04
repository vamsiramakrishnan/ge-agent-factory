---
type: Eval Scenario
title: "Run the Insurance & Liability Monitor workflow for the current period. Cite t..."
description: "Run the Insurance & Liability Monitor workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
source_id: "insurance-liability-monitor-end-to-end"
generation_status: inferred
tags:
  - procurement
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Run the Insurance & Liability Monitor workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

## Validates

- [certificate-collection-tracking](/queries/certificate-collection-tracking.md)

## Mechanisms to call

- [query_insurance_cert_management_insurance_cert_management_records](/tools/query-insurance-cert-management-insurance-cert-management-records.md)
- [query_contract_system_contract_system_records](/tools/query-contract-system-contract-system-records.md)
- [query_supplier_portal_supplier_portal_records](/tools/query-supplier-portal-supplier-portal-records.md)
- [query_google_document_ai_google_document_ai_records](/tools/query-google-document-ai-google-document-ai-records.md)
- [lookup_insurance_liability_monitor_policy_guide](/tools/lookup-insurance-liability-monitor-policy-guide.md)
- [action_insurance_cert_management_validate](/tools/action-insurance-cert-management-validate.md)

## Success rubric

Action validate executed against Insurance Cert Management, with audit-trail entry and Contract Manager notified of outcomes.

# Citations

- [Insurance & Liability Monitor Procurement Policy Guide](/documents/insurance-liability-monitor-policy-guide.md)
