---
type: Workflow Stage
title: Gate Review Readiness Pack Compilation
description: "Assemble the readiness pack from reconciled engineering_change_orders, bom_revisions, and issues status, cite the governing SOP sections (lookup_npi_launch_readiness_orchestrator_sop) for every open exception, and publish it to the NPI Program Manager ahead of the scheduled gate review."
source_id: gate_review_readiness_pack_compilation
tags:
  - manufacturing
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Gate Review Readiness Pack Compilation

Assemble the readiness pack from reconciled engineering_change_orders, bom_revisions, and issues status, cite the governing SOP sections (lookup_npi_launch_readiness_orchestrator_sop) for every open exception, and publish it to the NPI Program Manager ahead of the scheduled gate review.

- **Mode:** sequential
- **Stage:** 5 of 5

## Tools

- [query_ptc_windchill_plm_engineering_change_orders](/tools/query-ptc-windchill-plm-engineering-change-orders.md)
- [query_jira_issues](/tools/query-jira-issues.md)
- [lookup_npi_launch_readiness_orchestrator_sop](/tools/lookup-npi-launch-readiness-orchestrator-sop.md)
