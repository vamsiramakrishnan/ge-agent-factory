---
type: Query Capability
title: Create vendor master record in SAP S/4HANA (XK01) with validated data. Config...
description: "Create vendor master record in SAP S/4HANA (XK01) with validated data. Configure payment terms, purchasing organization assignments, and system access. Send welcome notification with portal credentials."
source_id: "vendor-master-creation-provisioning"
generation_status: inferred
tags:
  - procurement
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Create vendor master record in SAP S/4HANA (XK01) with validated data. Configure payment terms, purchasing organization assignments, and system access. Send welcome notification with portal credentials.

## Tools used

- [query_sap_s_4hana_xk01_sap_s_4hana_xk01_records](/tools/query-sap-s-4hana-xk01-sap-s-4hana-xk01-records.md)
- [lookup_supplier_onboarding_orchestrator_policy_guide](/tools/lookup-supplier-onboarding-orchestrator-policy-guide.md)
- [action_sap_s_4hana_xk01_generate](/tools/action-sap-s-4hana-xk01-generate.md)

## Runs in

- [vendor_master_creation_provisioning](/workflow/vendor-master-creation-provisioning.md)

## Evidence expected

- source_system_record
- document_reference
- api_response
- generated_audit_trail

## Evals

- [Run the Supplier Onboarding Orchestrator workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/supplier-onboarding-orchestrator-end-to-end.md)

# Citations

- [Supplier Onboarding Orchestrator Procurement Policy Guide](/documents/supplier-onboarding-orchestrator-policy-guide.md)
