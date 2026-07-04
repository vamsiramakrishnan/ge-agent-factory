---
type: Eval Scenario
title: "Policy POL-118820 (named insured Cascade Millwork LLC, jurisdiction_state TX)..."
description: "Policy POL-118820 (named insured Cascade Millwork LLC, jurisdiction_state TX) has an expiration_date 45 days out. The risk_reports record on file shows hazard_grade severe_referral_required, but report_date is 14 months old and predates the current policy term. TX carries a 60-day statutory non-renewal notice requirement. Should we route a non-renew recommendation into Guidewire PolicyCenter today?"
source_id: "renewal-risk-requalification-agent-stale-evidence-notice-timing"
generation_status: inferred
tags:
  - insurance
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Policy POL-118820 (named insured Cascade Millwork LLC, jurisdiction_state TX) has an expiration_date 45 days out. The risk_reports record on file shows hazard_grade severe_referral_required, but report_date is 14 months old and predates the current policy term. TX carries a 60-day statutory non-renewal notice requirement. Should we route a non-renew recommendation into Guidewire PolicyCenter today?

## Validates

- [treatment-recommendation-authority-validation](/queries/treatment-recommendation-authority-validation.md)

## Mechanisms to call

- [query_guidewire_policycenter_policies](/tools/query-guidewire-policycenter-policies.md)
- [query_lexisnexis_risk_solutions_risk_reports](/tools/query-lexisnexis-risk-solutions-risk-reports.md)
- [lookup_renewal_risk_requalification_agent_authority_guide](/tools/lookup-renewal-risk-requalification-agent-authority-guide.md)

## Success rubric

Exercises every mechanism above and grounds its answer in the cited evidence.

# Citations

- [Renewal Risk Requalification Agent Authority & Referral Guide](/documents/renewal-risk-requalification-agent-authority-guide.md)
- [Renewal Non-Renewal & Rate Action Notice Timing Manual](/documents/renewal-risk-requalification-agent-nonrenewal-notice-manual.md)
