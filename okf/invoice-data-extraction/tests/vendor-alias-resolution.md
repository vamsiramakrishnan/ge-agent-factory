---
type: Eval Scenario
title: "Invoice from 'Acme Corp' but SAP master has 'Acme Industries LLC' and 'Acme M..."
description: "Invoice from 'Acme Corp' but SAP master has 'Acme Industries LLC' and 'Acme Manufacturing' as separate vendors. Determine if same entity or different suppliers."
source_id: "vendor-alias-resolution"
generation_status: inferred
tags:
  - procurement
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Invoice from 'Acme Corp' but SAP master has 'Acme Industries LLC' and 'Acme Manufacturing' as separate vendors. Determine if same entity or different suppliers.

## Validates

- [llm-interpretation-entity-resolution](/queries/llm-interpretation-entity-resolution.md)

## Mechanisms to call

- [query_sap_s4hana_vendor_master](/tools/query-sap-s4hana-vendor-master.md)
- [evidence_vendor_validation_rules](/tools/evidence-vendor-validation-rules.md)

## Success rubric

Cite alias_names and vendor validation rules; escalate to Vendor Management if ambiguous; do not invent mapping.

# Citations

- [Vendor Master Validation Rules & Alias Matching](/documents/vendor-master-validation-rules.md)
