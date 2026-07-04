---
type: Query Capability
title: "Scan CMDB and SAM for all technology versions in use. Cross-reference with ve..."
description: "Scan CMDB and SAM for all technology versions in use. Cross-reference with vendor EOL announcements and LeanIX lifecycle status to build a complete technology age map."
source_id: "technology-census"
generation_status: inferred
tags:
  - it
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Scan CMDB and SAM for all technology versions in use. Cross-reference with vendor EOL announcements and LeanIX lifecycle status to build a complete technology age map.

## Tools used

- [query_servicenow_cmdb_tickets](/tools/query-servicenow-cmdb-tickets.md)
- [query_servicenow_sam_tickets](/tools/query-servicenow-sam-tickets.md)
- [query_leanix_leanix_records](/tools/query-leanix-leanix-records.md)
- [lookup_technology_lifecycle_manager_runbook](/tools/lookup-technology-lifecycle-manager-runbook.md)
- [action_servicenow_cmdb_generate](/tools/action-servicenow-cmdb-generate.md)

## Runs in

- [technology_census](/workflow/technology-census.md)

## Evidence expected

- source_system_record
- document_reference
- api_response
- generated_audit_trail

## Evals

- [Run the Technology Lifecycle Manager workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/technology-lifecycle-manager-end-to-end.md)

# Citations

- [Technology Lifecycle Manager Operations Runbook](/documents/technology-lifecycle-manager-runbook.md)
