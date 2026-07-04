---
type: Workflow Stage
title: "Failure-mode clustering"
description: "Cluster each ranked asset's work order narratives against failure_codes.failure_mode and failure_mechanism to summarize the recurring mechanism driving its bad-actor status."
source_id: failure_mode_clustering
tags:
  - manufacturing
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Failure-mode clustering

Cluster each ranked asset's work order narratives against failure_codes.failure_mode and failure_mechanism to summarize the recurring mechanism driving its bad-actor status.

- **Mode:** sequential
- **Stage:** 3 of 5

## Tools

- [query_ibm_maximo_maintenance_work_orders](/tools/query-ibm-maximo-maintenance-work-orders.md)
- [lookup_bad_actor_asset_analyzer_sop](/tools/lookup-bad-actor-asset-analyzer-sop.md)

Next: [SOP and playbook evidence gate](/workflow/sop-and-playbook-evidence-gate.md)
