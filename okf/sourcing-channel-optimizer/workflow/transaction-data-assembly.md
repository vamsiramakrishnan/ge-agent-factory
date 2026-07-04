---
type: Workflow Stage
title: Transaction Data Assembly
description: "Pull transaction data by channel from Coupa catalog, Amazon Business, and Ariba — catalog, PO, P-card, spot buy. Aggregate spend patterns with frequency, value, and complexity attributes."
source_id: transaction_data_assembly
tags:
  - procurement
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Transaction Data Assembly

Pull transaction data by channel from Coupa catalog, Amazon Business, and Ariba — catalog, PO, P-card, spot buy. Aggregate spend patterns with frequency, value, and complexity attributes.

- **Mode:** sequential
- **Stage:** 1 of 3

## Tools

- [query_coupa_catalog_catalog_items](/tools/query-coupa-catalog-catalog-items.md)
- [query_amazon_business_amazon_business_records](/tools/query-amazon-business-amazon-business-records.md)
- [query_sap_ariba_suppliers](/tools/query-sap-ariba-suppliers.md)
- [lookup_sourcing_channel_optimizer_policy_guide](/tools/lookup-sourcing-channel-optimizer-policy-guide.md)
- [action_coupa_catalog_generate](/tools/action-coupa-catalog-generate.md)

Next: [Channel Classification](/workflow/channel-classification.md)
