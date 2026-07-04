---
type: Workflow Stage
title: "Deal & Cost Intake"
description: "Pull item_master, merchandise_hierarchy, and cost_changes from Oracle Retail MFCS to establish which SKUs carry active vendor deal terms, allowance-driven cost changes, and department/class ownership (buyer_name, gmroi_target) before any funding is reconciled."
source_id: deal_cost_intake
tags:
  - retail
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Deal & Cost Intake

Pull item_master, merchandise_hierarchy, and cost_changes from Oracle Retail MFCS to establish which SKUs carry active vendor deal terms, allowance-driven cost changes, and department/class ownership (buyer_name, gmroi_target) before any funding is reconciled.

- **Mode:** sequential
- **Stage:** 1 of 6

## Tools

- [query_oracle_retail_mfcs_item_master](/tools/query-oracle-retail-mfcs-item-master.md)
- [lookup_vendor_promo_funding_reconciliation_agent_execution_playbook](/tools/lookup-vendor-promo-funding-reconciliation-agent-execution-playbook.md)
- [action_oracle_retail_mfcs_generate](/tools/action-oracle-retail-mfcs-generate.md)

Next: [Scan & Markdown Execution Matching](/workflow/scan-markdown-execution-matching.md)
