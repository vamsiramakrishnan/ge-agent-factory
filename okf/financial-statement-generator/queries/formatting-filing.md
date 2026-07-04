---
type: Query Capability
title: Format into Workiva templates for regulatory filing. Apply XBRL tags. Generat...
description: Format into Workiva templates for regulatory filing. Apply XBRL tags. Generate internal management package separately.
source_id: "formatting-filing"
generation_status: inferred
tags:
  - finance
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Format into Workiva templates for regulatory filing. Apply XBRL tags. Generate internal management package separately.

## Tools used

- [query_workiva_workiva_records](/tools/query-workiva-workiva-records.md)
- [action_sap_s_4hana_fi_generate](/tools/action-sap-s-4hana-fi-generate.md)

## Runs in

- [formatting_filing](/workflow/formatting-filing.md)

## Evidence expected

- source_system_record
- api_response
- generated_audit_trail

## Evals

- [Run the Financial Statement Generator workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/financial-statement-generator-end-to-end.md)

# Citations

- [Financial Statement Generator Controls Playbook](/documents/financial-statement-generator-controls-playbook.md)
