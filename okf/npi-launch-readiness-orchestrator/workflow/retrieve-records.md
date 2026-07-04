---
type: Workflow Stage
title: Retrieve Records
description: Query engineering change orders and bom revisions from PTC Windchill PLM and correlate with Jira for the NPI Launch Readiness Orchestrator workflow.
source_id: retrieve_records
tags:
  - manufacturing
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Retrieve Records

Query engineering change orders and bom revisions from PTC Windchill PLM and correlate with Jira for the NPI Launch Readiness Orchestrator workflow.

- **Mode:** sequential
- **Stage:** 1 of 4

## Tools

- [query_ptc_windchill_plm_engineering_change_orders](/tools/query-ptc-windchill-plm-engineering-change-orders.md)
- [query_jira_issues](/tools/query-jira-issues.md)
- [lookup_npi_launch_readiness_orchestrator_sop](/tools/lookup-npi-launch-readiness-orchestrator-sop.md)
- [action_ptc_windchill_plm_escalate](/tools/action-ptc-windchill-plm-escalate.md)

Next: [Analyze & Detect](/workflow/analyze-detect.md)
