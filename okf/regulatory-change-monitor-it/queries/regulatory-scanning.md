---
type: Query Capability
title: Scan Thomson Reuters feeds and OneTrust regulatory catalog for new and amende...
description: "Scan Thomson Reuters feeds and OneTrust regulatory catalog for new and amended regulations. Filter for relevance based on industry, jurisdiction, and IT operations scope."
source_id: "regulatory-scanning"
generation_status: inferred
tags:
  - it
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Scan Thomson Reuters feeds and OneTrust regulatory catalog for new and amended regulations. Filter for relevance based on industry, jurisdiction, and IT operations scope.

## Tools used

- [query_thomson_reuters_thomson_reuters_records](/tools/query-thomson-reuters-thomson-reuters-records.md)
- [query_onetrust_onetrust_records](/tools/query-onetrust-onetrust-records.md)
- [lookup_regulatory_change_monitor_runbook](/tools/lookup-regulatory-change-monitor-runbook.md)
- [action_thomson_reuters_update](/tools/action-thomson-reuters-update.md)

## Runs in

- [regulatory_scanning](/workflow/regulatory-scanning.md)

## Evidence expected

- source_system_record
- document_reference
- api_response
- generated_audit_trail

## Evals

- [Run the Regulatory Change Monitor workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/regulatory-change-monitor-end-to-end.md)

# Citations

- [Regulatory Change Monitor Operations Runbook](/documents/regulatory-change-monitor-runbook.md)
