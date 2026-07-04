---
type: Workflow Stage
title: "SOP & Export-Control Citation Gate"
description: "Invoke lookup_component_obsolescence_risk_monitor_sop against the Component Obsolescence Risk Monitor SOP and the Export Control Classification & ITAR/EAR Technical Data Handling Policy to confirm control limits, staleness thresholds, and ITAR/EAR handling before any disposition is proposed."
source_id: sop_export_control_citation_gate
tags:
  - manufacturing
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# SOP & Export-Control Citation Gate

Invoke lookup_component_obsolescence_risk_monitor_sop against the Component Obsolescence Risk Monitor SOP and the Export Control Classification & ITAR/EAR Technical Data Handling Policy to confirm control limits, staleness thresholds, and ITAR/EAR handling before any disposition is proposed.

- **Mode:** sequential
- **Stage:** 3 of 5

## Tools

- [lookup_component_obsolescence_risk_monitor_sop](/tools/lookup-component-obsolescence-risk-monitor-sop.md)

Next: [Disposition Recommendation & Change-Control Routing](/workflow/disposition-recommendation-change-control-routing.md)
