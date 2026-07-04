---
type: Workflow Stage
title: "PM & Failure History Pull"
description: "Query IBM Maximo's maintenance_work_orders, asset_registry_entries, and failure_codes for every active PM task and its completion/finding history."
source_id: pm_failure_history_pull
tags:
  - manufacturing
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# PM & Failure History Pull

Query IBM Maximo's maintenance_work_orders, asset_registry_entries, and failure_codes for every active PM task and its completion/finding history.

- **Mode:** sequential
- **Stage:** 1 of 5

## Tools

- [query_ibm_maximo_maintenance_work_orders](/tools/query-ibm-maximo-maintenance-work-orders.md)
- [action_ibm_maximo_route](/tools/action-ibm-maximo-route.md)

Next: [Runtime Correlation](/workflow/runtime-correlation.md)
