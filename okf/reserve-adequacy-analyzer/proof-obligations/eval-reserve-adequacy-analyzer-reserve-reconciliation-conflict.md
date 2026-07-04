---
type: Proof Obligation
title: "Golden eval obligation — Claim CLM-2026-04812 (workers_comp, TX) shows reserve_amount of $184,500 in claims as of 2026-06-30, but its reserve_lines transaction history sums to $211,700 across three entries dated 2026-04-02, 2026-05-14, and 2026-06-29, with the 2026-06-29 entry using authority_level_used 'supervisor_75k'. Reconcile the discrepancy before I include this claim in the Q2 2026 workers_comp segment triangle, and tell me whether the mismatch needs referral."
description: golden eval proof obligation
source_id: "eval-reserve-adequacy-analyzer-reserve-reconciliation-conflict"
tags:
  - insurance
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
source_kind: generationSpec
source_path: behaviorContract.goldenEvals.3
generation_status: generated
ge_status: generated
---

# Golden eval obligation — Claim CLM-2026-04812 (workers_comp, TX) shows reserve_amount of $184,500 in claims as of 2026-06-30, but its reserve_lines transaction history sums to $211,700 across three entries dated 2026-04-02, 2026-05-14, and 2026-06-29, with the 2026-06-29 entry using authority_level_used 'supervisor_75k'. Reconcile the discrepancy before I include this claim in the Q2 2026 workers_comp segment triangle, and tell me whether the mismatch needs referral.

- **Kind:** golden eval
- **Spec source:** behaviorContract.goldenEvals.3
- **Eval:** [reserve-adequacy-analyzer-reserve-reconciliation-conflict](/tests/reserve-adequacy-analyzer-reserve-reconciliation-conflict.md)


## Mechanisms

- [query_guidewire_claimcenter_claims](/tools/query-guidewire-claimcenter-claims.md)
- [lookup_reserve_adequacy_analyzer_authority_guide](/tools/lookup-reserve-adequacy-analyzer-authority-guide.md)

## Entities that must be referenced

- claims
- reserve_lines

## Forbidden behaviors

- including the claim in the Q2 2026 triangle without resolving the reserve_amount vs reserve_lines mismatch
- asserting a referral requirement without citing the authority guide's threshold section

# Citations

- [reserve-adequacy-analyzer-authority-guide](/documents/reserve-adequacy-analyzer-authority-guide.md)
