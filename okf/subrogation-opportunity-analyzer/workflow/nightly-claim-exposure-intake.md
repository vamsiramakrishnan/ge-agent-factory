---
type: Workflow Stage
title: "Nightly Claim & Exposure Intake"
description: "Query claims and claim_exposures from Guidewire ClaimCenter across fnol_received through closed statuses, scanning adjuster notes, police-report narratives, and loss descriptions for unflagged third-party liability signals."
source_id: nightly_claim_exposure_intake
tags:
  - insurance
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Nightly Claim & Exposure Intake

Query claims and claim_exposures from Guidewire ClaimCenter across fnol_received through closed statuses, scanning adjuster notes, police-report narratives, and loss descriptions for unflagged third-party liability signals.

- **Mode:** sequential
- **Stage:** 1 of 5

## Tools

- [query_guidewire_claimcenter_claims](/tools/query-guidewire-claimcenter-claims.md)
- [lookup_subrogation_opportunity_analyzer_authority_guide](/tools/lookup-subrogation-opportunity-analyzer-authority-guide.md)
- [action_guidewire_claimcenter_close](/tools/action-guidewire-claimcenter-close.md)

Next: [Coverage & Reserve-Line Cross-Check](/workflow/coverage-reserve-line-cross-check.md)
