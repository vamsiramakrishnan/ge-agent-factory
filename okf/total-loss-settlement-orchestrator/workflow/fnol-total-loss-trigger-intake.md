---
type: Workflow Stage
title: "FNOL Total-Loss Trigger & Intake"
description: "Query claims and claim_exposures in Guidewire ClaimCenter to detect a claim_status transition indicating a vehicle has been declared a total loss, and confirm the coverage_code (COLL/COMP) driving the exposure."
source_id: fnol_total_loss_trigger_intake
tags:
  - insurance
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# FNOL Total-Loss Trigger & Intake

Query claims and claim_exposures in Guidewire ClaimCenter to detect a claim_status transition indicating a vehicle has been declared a total loss, and confirm the coverage_code (COLL/COMP) driving the exposure.

- **Mode:** sequential
- **Stage:** 1 of 5

## Tools

- [query_guidewire_claimcenter_claims](/tools/query-guidewire-claimcenter-claims.md)
- [lookup_total_loss_settlement_orchestrator_authority_guide](/tools/lookup-total-loss-settlement-orchestrator-authority-guide.md)
- [action_guidewire_claimcenter_file](/tools/action-guidewire-claimcenter-file.md)

Next: [Coverage & Lienholder Verification](/workflow/coverage-lienholder-verification.md)
