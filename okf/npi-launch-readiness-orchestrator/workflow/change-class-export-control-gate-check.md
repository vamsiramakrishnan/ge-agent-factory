---
type: Workflow Stage
title: "Change-Class & Export-Control Gate Check"
description: "Cross-check each engineering_change_orders record's change_class, effectivity_type, and export_controlled flag, and each cad_document_records itar_restricted flag, against the NPI Launch Readiness Orchestrator Standard Operating Procedure (lookup_npi_launch_readiness_orchestrator_sop) to catch Class 1 changes, effectivity conflicts, and export-control access mismatches before they surface at the gate."
source_id: change_class_export_control_gate_check
tags:
  - manufacturing
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Change-Class & Export-Control Gate Check

Cross-check each engineering_change_orders record's change_class, effectivity_type, and export_controlled flag, and each cad_document_records itar_restricted flag, against the NPI Launch Readiness Orchestrator Standard Operating Procedure (lookup_npi_launch_readiness_orchestrator_sop) to catch Class 1 changes, effectivity conflicts, and export-control access mismatches before they surface at the gate.

- **Mode:** sequential
- **Stage:** 3 of 5

## Tools

- [query_ptc_windchill_plm_engineering_change_orders](/tools/query-ptc-windchill-plm-engineering-change-orders.md)
- [lookup_npi_launch_readiness_orchestrator_sop](/tools/lookup-npi-launch-readiness-orchestrator-sop.md)

Next: [Critical-Path Escalation](/workflow/critical-path-escalation.md)
