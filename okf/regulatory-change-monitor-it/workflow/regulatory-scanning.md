---
type: Workflow Stage
title: Regulatory Scanning
description: "Scan Thomson Reuters feeds and OneTrust regulatory catalog for new and amended regulations. Filter for relevance based on industry, jurisdiction, and IT operations scope."
source_id: regulatory_scanning
tags:
  - it
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Regulatory Scanning

Scan Thomson Reuters feeds and OneTrust regulatory catalog for new and amended regulations. Filter for relevance based on industry, jurisdiction, and IT operations scope.

- **Mode:** sequential
- **Stage:** 1 of 4

## Tools

- [query_thomson_reuters_thomson_reuters_records](/tools/query-thomson-reuters-thomson-reuters-records.md)
- [query_onetrust_onetrust_records](/tools/query-onetrust-onetrust-records.md)
- [lookup_regulatory_change_monitor_runbook](/tools/lookup-regulatory-change-monitor-runbook.md)
- [action_thomson_reuters_update](/tools/action-thomson-reuters-update.md)

Next: [Control Mapping](/workflow/control-mapping.md)
