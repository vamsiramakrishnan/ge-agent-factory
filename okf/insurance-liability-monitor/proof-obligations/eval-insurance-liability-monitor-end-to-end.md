---
type: Proof Obligation
title: "Golden eval obligation — Run the Insurance & Liability Monitor workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
description: golden eval proof obligation
source_id: "eval-insurance-liability-monitor-end-to-end"
tags:
  - procurement
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
source_kind: generationSpec
source_path: behaviorContract.goldenEvals.0
generation_status: generated
ge_status: generated
---

# Golden eval obligation — Run the Insurance & Liability Monitor workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

- **Kind:** golden eval
- **Spec source:** behaviorContract.goldenEvals.0
- **Eval:** [insurance-liability-monitor-end-to-end](/tests/insurance-liability-monitor-end-to-end.md)


## Mechanisms

- [query_insurance_cert_management_insurance_cert_management_records](/tools/query-insurance-cert-management-insurance-cert-management-records.md)
- [query_contract_system_contract_system_records](/tools/query-contract-system-contract-system-records.md)
- [query_supplier_portal_supplier_portal_records](/tools/query-supplier-portal-supplier-portal-records.md)
- [query_google_document_ai_google_document_ai_records](/tools/query-google-document-ai-google-document-ai-records.md)
- [lookup_insurance_liability_monitor_policy_guide](/tools/lookup-insurance-liability-monitor-policy-guide.md)
- [action_insurance_cert_management_validate](/tools/action-insurance-cert-management-validate.md)

## Entities that must be referenced

- insurance_cert_management_records
- contract_system_records
- supplier_portal_records
- google_document_ai_records

## Forbidden behaviors

- do not invent KPI numbers
- do not skip the evidence_lookup step before any recommendation
- do not execute validate without two-system evidence

# Citations

- [insurance-liability-monitor-policy-guide](/documents/insurance-liability-monitor-policy-guide.md)
