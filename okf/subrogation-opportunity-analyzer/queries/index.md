---
type: Index
title: Query Capabilities
description: "The questions and requests this agent can answer, each with the tools it uses."
timestamp: "2026-07-04T00:00:00.000Z"
---

# Query Capabilities

- [Query claims and claim_exposures from Guidewire ClaimCenter across fnol_received through closed statuses, scanning adjuster notes, police-report narratives, and loss descriptions for unflagged third-party liability signals.](/queries/nightly-claim-exposure-intake.md)
- [Cross-reference claim_exposures.coverage_code (COLL_collision, COV_A_dwelling, BI_bodily_injury) against reserve_lines.reserve_type to confirm a liable third party exists and no subrogation_recovery_offset entry has already been set.](/queries/coverage-reserve-line-cross-check.md)
- [Score each flagged claim against historical_metrics and analytics_events in BigQuery to compute a recovery-likelihood percentile and expected-dollar-value by line_of_business and jurisdiction_state.](/queries/recovery-likelihood-expected-value-scoring.md)
- [Invoke lookup_subrogation_opportunity_analyzer_authority_guide to cite authority-level, coverage-interpretation, and SIU-referral sections before any recommendation leaves the queue.](/queries/authority-referral-guide-validation.md)
- [Call action_guidewire_claimcenter_close to log the referral decision and evidence excerpts against Guidewire ClaimCenter with a full audit trail, escalating exceptions to the Subrogation Specialist.](/queries/referral-packaging-audit-close-out.md)
