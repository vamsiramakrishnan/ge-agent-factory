---
type: Query Capability
title: "TIN/W-9 validated via IRS matching service. Bank account verified. Entity nam..."
description: "TIN/W-9 validated via IRS matching service. Bank account verified. Entity name consistency checked across all documents — bank letter says 'Acme LLC' but W-9 says 'Acme Industries Inc.' flagged for verification rather than creating duplicates."
source_id: "verification-consistency-checks"
generation_status: inferred
tags:
  - procurement
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# TIN/W-9 validated via IRS matching service. Bank account verified. Entity name consistency checked across all documents — bank letter says 'Acme LLC' but W-9 says 'Acme Industries Inc.' flagged for verification rather than creating duplicates.

## Tools used

- [query_irs_tin_irs_tin_records](/tools/query-irs-tin-irs-tin-records.md)

## Runs in

- [verification_consistency_checks](/workflow/verification-consistency-checks.md)

## Evidence expected

- source_system_record

## Evals

- [Run the Supplier Onboarding Orchestrator workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/supplier-onboarding-orchestrator-end-to-end.md)

# Citations

- [Supplier Onboarding Orchestrator Procurement Policy Guide](/documents/supplier-onboarding-orchestrator-policy-guide.md)
