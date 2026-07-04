---
type: Workflow Stage
title: "Act & Audit"
description: "Execute the publish step in Kinaxis RapidResponse with a full audit trail, and escalate exceptions to the Materials Manager."
source_id: act_audit
tags:
  - manufacturing
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Act & Audit

Execute the publish step in Kinaxis RapidResponse with a full audit trail, and escalate exceptions to the Materials Manager.

- **Mode:** sequential
- **Stage:** 4 of 4

## Tools

- [query_kinaxis_rapidresponse_supply_plans](/tools/query-kinaxis-rapidresponse-supply-plans.md)
- [lookup_supplier_delivery_risk_analyzer_sop](/tools/lookup-supplier-delivery-risk-analyzer-sop.md)
- [action_sap_s_4hana_mm_publish](/tools/action-sap-s-4hana-mm-publish.md)
