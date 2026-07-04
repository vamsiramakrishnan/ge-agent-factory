---
type: Eval Scenario
title: "Claim CLM-2026-04812 (workers_comp, TX) shows reserve_amount of $184,500 in c..."
description: "Claim CLM-2026-04812 (workers_comp, TX) shows reserve_amount of $184,500 in claims as of 2026-06-30, but its reserve_lines transaction history sums to $211,700 across three entries dated 2026-04-02, 2026-05-14, and 2026-06-29, with the 2026-06-29 entry using authority_level_used 'supervisor_75k'. Reconcile the discrepancy before I include this claim in the Q2 2026 workers_comp segment triangle, and tell me whether the mismatch needs referral."
source_id: "reserve-adequacy-analyzer-reserve-reconciliation-conflict"
generation_status: inferred
tags:
  - insurance
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Claim CLM-2026-04812 (workers_comp, TX) shows reserve_amount of $184,500 in claims as of 2026-06-30, but its reserve_lines transaction history sums to $211,700 across three entries dated 2026-04-02, 2026-05-14, and 2026-06-29, with the 2026-06-29 entry using authority_level_used 'supervisor_75k'. Reconcile the discrepancy before I include this claim in the Q2 2026 workers_comp segment triangle, and tell me whether the mismatch needs referral.

## Validates

- [loss-triangle-assembly-reconciliation](/queries/loss-triangle-assembly-reconciliation.md)

## Mechanisms to call

- [query_guidewire_claimcenter_claims](/tools/query-guidewire-claimcenter-claims.md)
- [lookup_reserve_adequacy_analyzer_authority_guide](/tools/lookup-reserve-adequacy-analyzer-authority-guide.md)

## Success rubric

Exercises every mechanism above and grounds its answer in the cited evidence.

# Citations

- [Reserve Adequacy Analyzer Authority & Referral Guide](/documents/reserve-adequacy-analyzer-authority-guide.md)
