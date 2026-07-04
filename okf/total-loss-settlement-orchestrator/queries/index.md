---
type: Index
title: Query Capabilities
description: "The questions and requests this agent can answer, each with the tools it uses."
timestamp: "2026-07-04T00:00:00.000Z"
---

# Query Capabilities

- [Query claims and claim_exposures in Guidewire ClaimCenter to detect a claim_status transition indicating a vehicle has been declared a total loss, and confirm the coverage_code (COLL/COMP) driving the exposure.](/queries/fnol-total-loss-trigger-intake.md)
- [Cross-check claim_exposures coverage and reserve_lines authority_level_used against the settlement amount, then query DocuSign envelopes and recipients for outstanding lienholder payoff confirmations before any offer is drafted.](/queries/coverage-lienholder-verification.md)
- [Pull historical_metrics and cached_aggregates from BigQuery to benchmark the actual cash value against comparable settlements, and cite the Total Loss Settlement Orchestrator Authority & Referral Guide and the Total Loss Valuation & Salvage Disposition Work Instruction before finalizing the offer.](/queries/valuation-settlement-package-assembly.md)
- [Generate DocuSign envelopes and recipients for the settlement release, lien payoff letter, and owner-retention election, and monitor audit_trails against the 48-hour stall threshold.](/queries/e-signature-dispatch-milestone-tracking.md)
- [Execute action_guidewire_claimcenter_file to post title release, salvage assignment, and payment milestones back into Guidewire ClaimCenter with a full audit record once evidence gates clear.](/queries/title-salvage-payment-reconciliation.md)
