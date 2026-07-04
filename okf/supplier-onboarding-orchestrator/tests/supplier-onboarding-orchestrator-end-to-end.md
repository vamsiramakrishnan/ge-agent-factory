---
type: Eval Scenario
title: Run the Supplier Onboarding Orchestrator workflow for the current period. Cit...
description: "Run the Supplier Onboarding Orchestrator workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
source_id: "supplier-onboarding-orchestrator-end-to-end"
generation_status: inferred
tags:
  - procurement
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Run the Supplier Onboarding Orchestrator workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

## Validates

- [vendor-master-creation-provisioning](/queries/vendor-master-creation-provisioning.md)

## Mechanisms to call

- [query_sap_s_4hana_xk01_sap_s_4hana_xk01_records](/tools/query-sap-s-4hana-xk01-sap-s-4hana-xk01-records.md)
- [query_ariba_slp_ariba_slp_records](/tools/query-ariba-slp-ariba-slp-records.md)
- [query_banking_systems_banking_systems_records](/tools/query-banking-systems-banking-systems-records.md)
- [query_irs_tin_irs_tin_records](/tools/query-irs-tin-irs-tin-records.md)
- [lookup_supplier_onboarding_orchestrator_policy_guide](/tools/lookup-supplier-onboarding-orchestrator-policy-guide.md)
- [action_sap_s_4hana_xk01_generate](/tools/action-sap-s-4hana-xk01-generate.md)

## Success rubric

Action generate executed against SAP S/4HANA (XK01), with audit-trail entry and Buyer notified of outcomes.

# Citations

- [Supplier Onboarding Orchestrator Procurement Policy Guide](/documents/supplier-onboarding-orchestrator-policy-guide.md)
