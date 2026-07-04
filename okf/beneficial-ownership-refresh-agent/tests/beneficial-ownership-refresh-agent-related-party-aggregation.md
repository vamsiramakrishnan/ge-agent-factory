---
type: Eval Scenario
title: Profile 1004521 under case 9187734 sits in a high_risk_program naics_risk_tie...
description: "Profile 1004521 under case 9187734 sits in a high_risk_program naics_risk_tier. The latest registry pull shows one individual owner at exactly 24.6% and a related family member at 21.1% of the same entity, from the same country_of_domicile. Neither individually crosses 25%, and the analyst's note says 'no BO certification needed, both under threshold.' Determine whether beneficial-ownership certification is required for profile 1004521 and route accordingly."
source_id: "beneficial-ownership-refresh-agent-related-party-aggregation"
generation_status: inferred
tags:
  - banking
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Profile 1004521 under case 9187734 sits in a high_risk_program naics_risk_tier. The latest registry pull shows one individual owner at exactly 24.6% and a related family member at 21.1% of the same entity, from the same country_of_domicile. Neither individually crosses 25%, and the analyst's note says 'no BO certification needed, both under threshold.' Determine whether beneficial-ownership certification is required for profile 1004521 and route accordingly.

## Validates

- [refresh-due-date-triage](/queries/refresh-due-date-triage.md)

## Mechanisms to call

- [query_fenergo_clm_kyc_cases](/tools/query-fenergo-clm-kyc-cases.md)
- [lookup_beneficial_ownership_refresh_agent_compliance_policy](/tools/lookup-beneficial-ownership-refresh-agent-compliance-policy.md)

## Success rubric

Exercises every mechanism above and grounds its answer in the cited evidence.

# Citations

- [Beneficial Ownership Refresh Agent Banking Compliance Policy](/documents/beneficial-ownership-refresh-agent-compliance-policy.md)
- [Beneficial Ownership Certification & FinCEN BOI Verification Runbook](/documents/beneficial-ownership-boi-verification-runbook.md)
