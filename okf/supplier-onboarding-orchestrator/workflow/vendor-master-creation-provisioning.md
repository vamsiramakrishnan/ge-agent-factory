---
type: Workflow Stage
title: "Vendor Master Creation & Provisioning"
description: "Create vendor master record in SAP S/4HANA (XK01) with validated data. Configure payment terms, purchasing organization assignments, and system access. Send welcome notification with portal credentials."
source_id: vendor_master_creation_provisioning
tags:
  - procurement
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Vendor Master Creation & Provisioning

Create vendor master record in SAP S/4HANA (XK01) with validated data. Configure payment terms, purchasing organization assignments, and system access. Send welcome notification with portal credentials.

- **Mode:** sequential
- **Stage:** 3 of 3

## Tools

- [query_sap_s_4hana_xk01_sap_s_4hana_xk01_records](/tools/query-sap-s-4hana-xk01-sap-s-4hana-xk01-records.md)
- [lookup_supplier_onboarding_orchestrator_policy_guide](/tools/lookup-supplier-onboarding-orchestrator-policy-guide.md)
- [action_sap_s_4hana_xk01_generate](/tools/action-sap-s-4hana-xk01-generate.md)
