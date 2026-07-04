---
type: Query Capability
title: "Pull transaction data by channel from Coupa catalog, Amazon Business, and Ari..."
description: "Pull transaction data by channel from Coupa catalog, Amazon Business, and Ariba — catalog, PO, P-card, spot buy. Aggregate spend patterns with frequency, value, and complexity attributes."
source_id: "transaction-data-assembly"
generation_status: inferred
tags:
  - procurement
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Pull transaction data by channel from Coupa catalog, Amazon Business, and Ariba — catalog, PO, P-card, spot buy. Aggregate spend patterns with frequency, value, and complexity attributes.

## Tools used

- [query_coupa_catalog_catalog_items](/tools/query-coupa-catalog-catalog-items.md)
- [query_amazon_business_amazon_business_records](/tools/query-amazon-business-amazon-business-records.md)
- [query_sap_ariba_suppliers](/tools/query-sap-ariba-suppliers.md)
- [lookup_sourcing_channel_optimizer_policy_guide](/tools/lookup-sourcing-channel-optimizer-policy-guide.md)
- [action_coupa_catalog_generate](/tools/action-coupa-catalog-generate.md)

## Runs in

- [transaction_data_assembly](/workflow/transaction-data-assembly.md)

## Evidence expected

- source_system_record
- document_reference
- api_response
- generated_audit_trail

## Evals

- [Run the Sourcing Channel Optimizer workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/sourcing-channel-optimizer-end-to-end.md)

# Citations

- [Sourcing Channel Optimizer Procurement Policy Guide](/documents/sourcing-channel-optimizer-policy-guide.md)
