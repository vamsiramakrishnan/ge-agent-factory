---
type: Workflow Stage
title: "Manager Routing & Audit"
description: "Execute action_oracle_retail_mfcs_route to route finished scorecards and compliance-claim packets to the Vendor Performance Manager in Oracle Retail MFCS, logging a full audit trail and escalating threshold breaches."
source_id: manager_routing_audit
tags:
  - retail
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Manager Routing & Audit

Execute action_oracle_retail_mfcs_route to route finished scorecards and compliance-claim packets to the Vendor Performance Manager in Oracle Retail MFCS, logging a full audit trail and escalating threshold breaches.

- **Mode:** sequential
- **Stage:** 5 of 5

## Tools

- [query_oracle_retail_mfcs_item_master](/tools/query-oracle-retail-mfcs-item-master.md)
- [lookup_vendor_scorecard_analyzer_execution_playbook](/tools/lookup-vendor-scorecard-analyzer-execution-playbook.md)
- [action_oracle_retail_mfcs_route](/tools/action-oracle-retail-mfcs-route.md)
