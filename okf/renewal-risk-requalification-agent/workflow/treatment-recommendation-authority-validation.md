---
type: Workflow Stage
title: "Treatment Recommendation & Authority Validation"
description: "Recommend renew-as-is, re-rate, or non-renew treatment per policies account, then cite the Renewal Risk Requalification Agent Authority & Referral Guide (lookup_renewal_risk_requalification_agent_authority_guide) to confirm referral thresholds and non-renewal notice-timing constraints are satisfied before any recommendation is finalized."
source_id: treatment_recommendation_authority_validation
tags:
  - insurance
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Treatment Recommendation & Authority Validation

Recommend renew-as-is, re-rate, or non-renew treatment per policies account, then cite the Renewal Risk Requalification Agent Authority & Referral Guide (lookup_renewal_risk_requalification_agent_authority_guide) to confirm referral thresholds and non-renewal notice-timing constraints are satisfied before any recommendation is finalized.

- **Mode:** sequential
- **Stage:** 4 of 5

## Tools

- [query_guidewire_policycenter_policies](/tools/query-guidewire-policycenter-policies.md)
- [query_lexisnexis_risk_solutions_risk_reports](/tools/query-lexisnexis-risk-solutions-risk-reports.md)
- [lookup_renewal_risk_requalification_agent_authority_guide](/tools/lookup-renewal-risk-requalification-agent-authority-guide.md)

Next: [Route & Audit to Underwriter Queue](/workflow/route-audit-to-underwriter-queue.md)
