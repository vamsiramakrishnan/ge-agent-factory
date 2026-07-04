---
type: Query Capability
title: Track certificate expiry dates across supplier base. Send renewal reminders t...
description: Track certificate expiry dates across supplier base. Send renewal reminders to suppliers via portal. Collect updated COIs and log in certificate management system.
source_id: "certificate-collection-tracking"
generation_status: inferred
tags:
  - procurement
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Track certificate expiry dates across supplier base. Send renewal reminders to suppliers via portal. Collect updated COIs and log in certificate management system.

## Tools used

- [query_insurance_cert_management_insurance_cert_management_records](/tools/query-insurance-cert-management-insurance-cert-management-records.md)
- [query_contract_system_contract_system_records](/tools/query-contract-system-contract-system-records.md)
- [query_supplier_portal_supplier_portal_records](/tools/query-supplier-portal-supplier-portal-records.md)
- [lookup_insurance_liability_monitor_policy_guide](/tools/lookup-insurance-liability-monitor-policy-guide.md)
- [action_insurance_cert_management_validate](/tools/action-insurance-cert-management-validate.md)

## Runs in

- [certificate_collection_tracking](/workflow/certificate-collection-tracking.md)

## Evidence expected

- source_system_record
- document_reference
- api_response
- generated_audit_trail

## Evals

- [Run the Insurance & Liability Monitor workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/insurance-liability-monitor-end-to-end.md)

# Citations

- [Insurance & Liability Monitor Procurement Policy Guide](/documents/insurance-liability-monitor-policy-guide.md)
