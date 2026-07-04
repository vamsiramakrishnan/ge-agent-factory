---
type: Workflow Stage
title: Identity Match Verification
description: "Compare screened_party_name and fuzzy_match_score in screening_results against legal_name, entity_type, and country_of_domicile on the linked entity_profiles and kyc_cases records in Fenergo CLM to establish or rule out a true match."
source_id: identity_match_verification
tags:
  - banking
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Identity Match Verification

Compare screened_party_name and fuzzy_match_score in screening_results against legal_name, entity_type, and country_of_domicile on the linked entity_profiles and kyc_cases records in Fenergo CLM to establish or rule out a true match.

- **Mode:** sequential
- **Stage:** 2 of 6

## Tools

- [query_fenergo_clm_kyc_cases](/tools/query-fenergo-clm-kyc-cases.md)
- [lookup_sanctions_screening_hit_analyzer_compliance_policy](/tools/lookup-sanctions-screening-hit-analyzer-compliance-policy.md)
- [action_fenergo_clm_escalate](/tools/action-fenergo-clm-escalate.md)

Next: [Cross-System Risk Correlation](/workflow/cross-system-risk-correlation.md)
