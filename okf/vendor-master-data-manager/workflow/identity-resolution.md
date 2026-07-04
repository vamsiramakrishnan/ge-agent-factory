---
type: Workflow Stage
title: Identity Resolution
description: "Gemini resolves vendor identity ambiguity — are 'Acme Corp' and 'Acme Industries LLC' the same entity? Analyzes TIN, bank accounts, addresses, and corporate relationships."
source_id: identity_resolution
tags:
  - finance
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Identity Resolution

Gemini resolves vendor identity ambiguity — are 'Acme Corp' and 'Acme Industries LLC' the same entity? Analyzes TIN, bank accounts, addresses, and corporate relationships.

- **Mode:** sequential
- **Stage:** 3 of 4

## Tools

- [query_irs_tin_matching_irs_tin_matching_records](/tools/query-irs-tin-matching-irs-tin-matching-records.md)
- [lookup_vendor_master_data_manager_controls_playbook](/tools/lookup-vendor-master-data-manager-controls-playbook.md)

Next: [Master Update & Audit](/workflow/master-update-audit.md)
