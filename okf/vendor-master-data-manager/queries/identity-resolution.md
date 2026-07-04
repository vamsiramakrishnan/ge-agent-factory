---
type: Query Capability
title: "Gemini resolves vendor identity ambiguity — are 'Acme Corp' and 'Acme Industr..."
description: "Gemini resolves vendor identity ambiguity — are 'Acme Corp' and 'Acme Industries LLC' the same entity? Analyzes TIN, bank accounts, addresses, and corporate relationships."
source_id: "identity-resolution"
generation_status: inferred
tags:
  - finance
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Gemini resolves vendor identity ambiguity — are 'Acme Corp' and 'Acme Industries LLC' the same entity? Analyzes TIN, bank accounts, addresses, and corporate relationships.

## Tools used

- [query_irs_tin_matching_irs_tin_matching_records](/tools/query-irs-tin-matching-irs-tin-matching-records.md)
- [lookup_vendor_master_data_manager_controls_playbook](/tools/lookup-vendor-master-data-manager-controls-playbook.md)

## Runs in

- [identity_resolution](/workflow/identity-resolution.md)

## Evidence expected

- source_system_record
- document_reference

## Evals

- [Run the Vendor Master Data Manager workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/vendor-master-data-manager-end-to-end.md)

# Citations

- [Vendor Master Data Manager Controls Playbook](/documents/vendor-master-data-manager-controls-playbook.md)
