---
type: Workflow Stage
title: "Authority & Referral Gate Check"
description: "Cross-check every STP-eligible quote against the Small Commercial Quote-Bind STP Engine Authority & Referral Guide via lookup_small_commercial_quote_bind_stp_engine_authority_guide, citing the authority-level and threshold sections before clearing the record for bind."
source_id: authority_referral_gate_check
tags:
  - insurance
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Authority & Referral Gate Check

Cross-check every STP-eligible quote against the Small Commercial Quote-Bind STP Engine Authority & Referral Guide via lookup_small_commercial_quote_bind_stp_engine_authority_guide, citing the authority-level and threshold sections before clearing the record for bind.

- **Mode:** sequential
- **Stage:** 4 of 6

## Tools

- [lookup_small_commercial_quote_bind_stp_engine_authority_guide](/tools/lookup-small-commercial-quote-bind-stp-engine-authority-guide.md)

Next: [Bind & Policy Issuance](/workflow/bind-policy-issuance.md)
