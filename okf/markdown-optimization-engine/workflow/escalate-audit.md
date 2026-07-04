---
type: Workflow Stage
title: "Escalate & Audit"
description: "Execute action_oracle_retail_mfcs_escalate for approved markdown actions in Oracle Retail MFCS with a full audit trail, and route exceptions on price_zones or item_master records to the Pricing Analyst or divisional_merchandise_manager per the escalation rules."
source_id: escalate_audit
tags:
  - retail
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Escalate & Audit

Execute action_oracle_retail_mfcs_escalate for approved markdown actions in Oracle Retail MFCS with a full audit trail, and route exceptions on price_zones or item_master records to the Pricing Analyst or divisional_merchandise_manager per the escalation rules.

- **Mode:** sequential
- **Stage:** 5 of 5

## Tools

- [query_revionics_price_optimization_price_recommendations](/tools/query-revionics-price-optimization-price-recommendations.md)
- [query_oracle_retail_mfcs_item_master](/tools/query-oracle-retail-mfcs-item-master.md)
- [lookup_markdown_optimization_engine_execution_playbook](/tools/lookup-markdown-optimization-engine-execution-playbook.md)
- [action_oracle_retail_mfcs_escalate](/tools/action-oracle-retail-mfcs-escalate.md)
