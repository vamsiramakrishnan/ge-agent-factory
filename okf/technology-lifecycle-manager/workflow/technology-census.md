---
type: Workflow Stage
title: Technology Census
description: "Scan CMDB and SAM for all technology versions in use. Cross-reference with vendor EOL announcements and LeanIX lifecycle status to build a complete technology age map."
source_id: technology_census
tags:
  - it
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Technology Census

Scan CMDB and SAM for all technology versions in use. Cross-reference with vendor EOL announcements and LeanIX lifecycle status to build a complete technology age map.

- **Mode:** sequential
- **Stage:** 1 of 4

## Tools

- [query_servicenow_cmdb_tickets](/tools/query-servicenow-cmdb-tickets.md)
- [query_servicenow_sam_tickets](/tools/query-servicenow-sam-tickets.md)
- [query_leanix_leanix_records](/tools/query-leanix-leanix-records.md)
- [lookup_technology_lifecycle_manager_runbook](/tools/lookup-technology-lifecycle-manager-runbook.md)
- [action_servicenow_cmdb_generate](/tools/action-servicenow-cmdb-generate.md)

Next: [Risk & Effort Scoring](/workflow/risk-effort-scoring.md)
