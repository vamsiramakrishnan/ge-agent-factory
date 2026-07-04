---
type: Workflow Stage
title: Requisition Ingestion
description: "Receive requisition from SAP ME51N or Coupa portal. Validate field completeness and extract free-text description for downstream NLP processing."
source_id: requisition_ingestion
tags:
  - procurement
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Requisition Ingestion

Receive requisition from SAP ME51N or Coupa portal. Validate field completeness and extract free-text description for downstream NLP processing.

- **Mode:** sequential
- **Stage:** 1 of 4

## Tools

- [query_sap_s_4hana_mm_me51n_purchase_orders](/tools/query-sap-s-4hana-mm-me51n-purchase-orders.md)
- [query_coupa_requisitions](/tools/query-coupa-requisitions.md)
- [lookup_requisition_intake_smart_routing_policy_guide](/tools/lookup-requisition-intake-smart-routing-policy-guide.md)
- [action_sap_s_4hana_mm_me51n_match](/tools/action-sap-s-4hana-mm-me51n-match.md)

Next: [Classification & Duplicate Detection](/workflow/classification-duplicate-detection.md)
