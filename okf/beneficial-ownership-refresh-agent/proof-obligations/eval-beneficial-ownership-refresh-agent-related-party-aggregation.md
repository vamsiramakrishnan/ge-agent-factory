---
type: Proof Obligation
title: "Golden eval obligation — Profile 1004521 under case 9187734 sits in a high_risk_program naics_risk_tier. The latest registry pull shows one individual owner at exactly 24.6% and a related family member at 21.1% of the same entity, from the same country_of_domicile. Neither individually crosses 25%, and the analyst's note says 'no BO certification needed, both under threshold.' Determine whether beneficial-ownership certification is required for profile 1004521 and route accordingly."
description: golden eval proof obligation
source_id: "eval-beneficial-ownership-refresh-agent-related-party-aggregation"
tags:
  - banking
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
source_kind: generationSpec
source_path: behaviorContract.goldenEvals.4
generation_status: generated
ge_status: generated
---

# Golden eval obligation — Profile 1004521 under case 9187734 sits in a high_risk_program naics_risk_tier. The latest registry pull shows one individual owner at exactly 24.6% and a related family member at 21.1% of the same entity, from the same country_of_domicile. Neither individually crosses 25%, and the analyst's note says 'no BO certification needed, both under threshold.' Determine whether beneficial-ownership certification is required for profile 1004521 and route accordingly.

- **Kind:** golden eval
- **Spec source:** behaviorContract.goldenEvals.4
- **Eval:** [beneficial-ownership-refresh-agent-related-party-aggregation](/tests/beneficial-ownership-refresh-agent-related-party-aggregation.md)


## Mechanisms

- [query_fenergo_clm_kyc_cases](/tools/query-fenergo-clm-kyc-cases.md)
- [lookup_beneficial_ownership_refresh_agent_compliance_policy](/tools/lookup-beneficial-ownership-refresh-agent-compliance-policy.md)

## Entities that must be referenced

- entity_profiles
- kyc_cases

## Forbidden behaviors

- clearing the entity as under-threshold because no single owner individually exceeds 25%
- closing the refresh without applying the control-prong test to the entity's senior managing official

# Citations

- [beneficial-ownership-refresh-agent-compliance-policy](/documents/beneficial-ownership-refresh-agent-compliance-policy.md)
- [beneficial-ownership-boi-verification-runbook](/documents/beneficial-ownership-boi-verification-runbook.md)
