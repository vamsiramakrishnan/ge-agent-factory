---
type: Workflow Stage
title: "Network Link & Prior-Referral Review"
description: "Cross-reference network_link_indicators (shared providers, body shops, bank accounts, phone numbers) and open siu_referrals history for the claim_number to surface ring exposure, prior_siu_substantiated_hits, and any referral already in active_investigation before a new referral is opened."
source_id: network_link_prior_referral_review
tags:
  - insurance
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Network Link & Prior-Referral Review

Cross-reference network_link_indicators (shared providers, body shops, bank accounts, phone numbers) and open siu_referrals history for the claim_number to surface ring exposure, prior_siu_substantiated_hits, and any referral already in active_investigation before a new referral is opened.

- **Mode:** sequential
- **Stage:** 2 of 5

## Tools

- [lookup_siu_referral_scoring_engine_authority_guide](/tools/lookup-siu-referral-scoring-engine-authority-guide.md)

Next: [Coverage & Reserve Cross-Check](/workflow/coverage-reserve-cross-check.md)
