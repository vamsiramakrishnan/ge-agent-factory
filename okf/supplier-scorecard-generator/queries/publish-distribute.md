---
type: Query Capability
title: "Scorecards published to supplier portal for self-service access and distribut..."
description: "Scorecards published to supplier portal for self-service access and distributed to category teams via Looker dashboards."
source_id: "publish-distribute"
generation_status: inferred
tags:
  - procurement
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Scorecards published to supplier portal for self-service access and distributed to category teams via Looker dashboards.

## Tools used

- [query_supplier_portal_supplier_portal_records](/tools/query-supplier-portal-supplier-portal-records.md)
- [lookup_supplier_scorecard_generator_policy_guide](/tools/lookup-supplier-scorecard-generator-policy-guide.md)

## Runs in

- [publish_distribute](/workflow/publish-distribute.md)

## Evidence expected

- source_system_record
- document_reference

## Evals

- [Run the Supplier Scorecard Generator workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/supplier-scorecard-generator-end-to-end.md)

# Citations

- [Supplier Scorecard Generator Procurement Policy Guide](/documents/supplier-scorecard-generator-policy-guide.md)
