---
type: Workflow Stage
title: "SOP & Severity Gate"
description: "Validate the finding against the Predictive Asset Failure Monitor Standard Operating Procedure and the criticality_ranking in asset_registry_entries, citing governing sections before any recommendation is issued."
source_id: sop_severity_gate
tags:
  - manufacturing
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# SOP & Severity Gate

Validate the finding against the Predictive Asset Failure Monitor Standard Operating Procedure and the criticality_ranking in asset_registry_entries, citing governing sections before any recommendation is issued.

- **Mode:** sequential
- **Stage:** 4 of 5

## Tools

- [lookup_predictive_asset_failure_monitor_sop](/tools/lookup-predictive-asset-failure-monitor-sop.md)
- [action_ibm_maximo_recommend](/tools/action-ibm-maximo-recommend.md)

Next: [Work Order Issuance & Escalation](/workflow/work-order-issuance-escalation.md)
