---
type: Query Capability
title: "LLM generates board-ready diversity reports — 'Achieved 12.3% diverse spend t..."
description: "LLM generates board-ready diversity reports — 'Achieved 12.3% diverse spend this quarter, up from 10.8%, driven by new MBE supplier onboarded for logistics in the Southeast region.' Interprets ambiguous certification statuses for compliance reporting."
source_id: "narrative-report-generation"
generation_status: inferred
tags:
  - procurement
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# LLM generates board-ready diversity reports — 'Achieved 12.3% diverse spend this quarter, up from 10.8%, driven by new MBE supplier onboarded for logistics in the Southeast region.' Interprets ambiguous certification statuses for compliance reporting.

## Tools used

- [query_supplier_io_supplier_io_records](/tools/query-supplier-io-supplier-io-records.md)
- [lookup_supplier_diversity_tracker_policy_guide](/tools/lookup-supplier-diversity-tracker-policy-guide.md)
- [action_supplier_io_generate](/tools/action-supplier-io-generate.md)

## Runs in

- [narrative_report_generation](/workflow/narrative-report-generation.md)

## Evidence expected

- source_system_record
- document_reference
- api_response
- generated_audit_trail

## Evals

- [Run the Supplier Diversity Tracker workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/supplier-diversity-tracker-end-to-end.md)

# Citations

- [Supplier Diversity Tracker Procurement Policy Guide](/documents/supplier-diversity-tracker-policy-guide.md)
