---
type: Proof Obligation
title: "Golden eval obligation — Invoice from 'Acme Corp' but SAP master has 'Acme Industries LLC' and 'Acme Manufacturing' as separate vendors. Determine if same entity or different suppliers."
description: golden eval proof obligation
source_id: "eval-vendor-alias-resolution"
tags:
  - procurement
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
source_kind: generationSpec
source_path: behaviorContract.goldenEvals.2
generation_status: generated
ge_status: generated
---

# Golden eval obligation — Invoice from 'Acme Corp' but SAP master has 'Acme Industries LLC' and 'Acme Manufacturing' as separate vendors. Determine if same entity or different suppliers.

- **Kind:** golden eval
- **Spec source:** behaviorContract.goldenEvals.2
- **Eval:** [vendor-alias-resolution](/tests/vendor-alias-resolution.md)


## Mechanisms

- [query_sap_s4hana_vendor_master](/tools/query-sap-s4hana-vendor-master.md)
- [evidence_vendor_validation_rules](/tools/evidence-vendor-validation-rules.md)

## Entities that must be referenced

- vendors

## Forbidden behaviors

- do not guess vendor identity
- do not create new vendor records

# Citations

- [vendor-master-validation-rules](/documents/vendor-master-validation-rules.md)
