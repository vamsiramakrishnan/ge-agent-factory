---
type: Workflow Stage
title: "SOP & Export-Control Evidence Validation"
description: "Invoke lookup_engineering_change_backlog_analyzer_sop to cite the governing SOP sections, and check export_controlled and itar_restricted flags on engineering_change_orders and cad_document_records against the Technology Control Plan before any finding is narrated."
source_id: sop_export_control_evidence_validation
tags:
  - manufacturing
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# SOP & Export-Control Evidence Validation

Invoke lookup_engineering_change_backlog_analyzer_sop to cite the governing SOP sections, and check export_controlled and itar_restricted flags on engineering_change_orders and cad_document_records against the Technology Control Plan before any finding is narrated.

- **Mode:** sequential
- **Stage:** 4 of 5

## Tools

- [query_ptc_windchill_plm_engineering_change_orders](/tools/query-ptc-windchill-plm-engineering-change-orders.md)
- [lookup_engineering_change_backlog_analyzer_sop](/tools/lookup-engineering-change-backlog-analyzer-sop.md)

Next: [Change Board Agenda Drafting & Audit](/workflow/change-board-agenda-drafting-audit.md)
