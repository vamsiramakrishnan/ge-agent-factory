---
type: Workflow Stage
title: "Ownership Recalculation & Threshold Scoring"
description: "Recompute beneficial_owner_count and 25%-threshold ownership percentages against entity_profiles and screening_results, flagging new PEP exposure or naics_risk_tier changes for the KYC Analyst queue."
source_id: ownership_recalculation_threshold_scoring
tags:
  - banking
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Ownership Recalculation & Threshold Scoring

Recompute beneficial_owner_count and 25%-threshold ownership percentages against entity_profiles and screening_results, flagging new PEP exposure or naics_risk_tier changes for the KYC Analyst queue.

- **Mode:** sequential
- **Stage:** 4 of 5

## Tools

- [lookup_beneficial_ownership_refresh_agent_compliance_policy](/tools/lookup-beneficial-ownership-refresh-agent-compliance-policy.md)
- [action_fenergo_clm_file](/tools/action-fenergo-clm-file.md)

Next: [Policy-Gated Filing](/workflow/policy-gated-filing.md)
