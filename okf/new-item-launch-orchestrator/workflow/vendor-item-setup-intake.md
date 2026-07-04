---
type: Workflow Stage
title: Vendor Item Setup Intake
description: "Pull the vendor-submitted item_master record (SKU, UPC, department, brand, unit_cost, base_retail, case_pack) and the linked cost_changes row from Oracle Retail MFCS as soon as the new-item form lands, before any hierarchy or price work begins."
source_id: vendor_item_setup_intake
tags:
  - retail
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Vendor Item Setup Intake

Pull the vendor-submitted item_master record (SKU, UPC, department, brand, unit_cost, base_retail, case_pack) and the linked cost_changes row from Oracle Retail MFCS as soon as the new-item form lands, before any hierarchy or price work begins.

- **Mode:** sequential
- **Stage:** 1 of 5

## Tools

- [query_oracle_retail_mfcs_item_master](/tools/query-oracle-retail-mfcs-item-master.md)
- [lookup_new_item_launch_orchestrator_execution_playbook](/tools/lookup-new-item-launch-orchestrator-execution-playbook.md)
- [action_oracle_retail_mfcs_publish](/tools/action-oracle-retail-mfcs-publish.md)

Next: [Attribute & Cost Validation Gate](/workflow/attribute-cost-validation-gate.md)
