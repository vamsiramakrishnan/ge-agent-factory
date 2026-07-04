---
type: Query Capability
title: "Confirm validated goods receipt or service entry in ERP, triggering three-way..."
description: "Confirm validated goods receipt or service entry in ERP, triggering three-way match eligibility for invoice processing."
source_id: "receipt-confirmation-downstream-trigger"
generation_status: inferred
tags:
  - procurement
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Confirm validated goods receipt or service entry in ERP, triggering three-way match eligibility for invoice processing.

## Tools used

- [lookup_goods_receipt_service_entry_validator_policy_guide](/tools/lookup-goods-receipt-service-entry-validator-policy-guide.md)
- [action_sap_s_4hana_mm_migo_trigger](/tools/action-sap-s-4hana-mm-migo-trigger.md)

## Runs in

- [receipt_confirmation_downstream_trigger](/workflow/receipt-confirmation-downstream-trigger.md)

## Evidence expected

- document_reference
- api_response
- generated_audit_trail

## Evals

- [Run the Goods Receipt & Service Entry Validator workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/goods-receipt-service-entry-validator-end-to-end.md)

# Citations

- [Goods Receipt & Service Entry Validator Procurement Policy Guide](/documents/goods-receipt-service-entry-validator-policy-guide.md)
