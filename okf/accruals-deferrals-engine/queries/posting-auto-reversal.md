---
type: Query Capability
title: "Post accrual/deferral entries to SAP with auto-reversal scheduled for Day 1 o..."
description: "Post accrual/deferral entries to SAP with auto-reversal scheduled for Day 1 of the subsequent period. Generate audit trail with calculation basis."
source_id: "posting-auto-reversal"
generation_status: inferred
tags:
  - finance
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Post accrual/deferral entries to SAP with auto-reversal scheduled for Day 1 of the subsequent period. Generate audit trail with calculation basis.

## Tools used

- [query_sap_s_4hana_fi_gl_entries](/tools/query-sap-s-4hana-fi-gl-entries.md)

## Runs in

- [posting_auto_reversal](/workflow/posting-auto-reversal.md)

## Evidence expected

- source_system_record

## Evals

- [Run the Accruals & Deferrals Engine workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/accruals-deferrals-engine-end-to-end.md)

# Citations

- [Accruals & Deferrals Engine Controls Playbook](/documents/accruals-deferrals-engine-controls-playbook.md)
