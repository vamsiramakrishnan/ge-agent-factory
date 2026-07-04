---
type: Query Capability
title: "Update LeanIX with approved lifecycle decisions, migration timelines, and sun..."
description: "Update LeanIX with approved lifecycle decisions, migration timelines, and sunset dates. Notify affected teams."
source_id: "portfolio-update"
generation_status: inferred
tags:
  - it
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Update LeanIX with approved lifecycle decisions, migration timelines, and sunset dates. Notify affected teams.

## Tools used

- [query_leanix_leanix_records](/tools/query-leanix-leanix-records.md)
- [lookup_technology_lifecycle_manager_runbook](/tools/lookup-technology-lifecycle-manager-runbook.md)

## Runs in

- [portfolio_update](/workflow/portfolio-update.md)

## Evidence expected

- source_system_record
- document_reference

## Evals

- [Run the Technology Lifecycle Manager workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/technology-lifecycle-manager-end-to-end.md)

# Citations

- [Technology Lifecycle Manager Operations Runbook](/documents/technology-lifecycle-manager-runbook.md)
