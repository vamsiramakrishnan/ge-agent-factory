---
type: Agent Tool
title: query_fenergo_clm_kyc_cases
description: Retrieve kyc cases from Fenergo CLM for the Beneficial Ownership Refresh Agent workflow.
tags:
  - banking
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
source_kind: generationSpec
source_path: behaviorContract.toolIntents
generation_status: generated
ge_status: generated
---

# query_fenergo_clm_kyc_cases

Retrieve kyc cases from Fenergo CLM for the Beneficial Ownership Refresh Agent workflow.

- **Kind:** query
- **Source system:** [Fenergo CLM](/systems/fenergo-clm.md)

## Inputs

- case_id
- date_range

## Outputs

- kyc_cases_records
- kyc_cases_summary

## Side Effects

- No mutation is declared by the spec for this tool.

## Idempotency

No idempotency key declared; no mutation is declared by the spec for this tool.

## Confirmation

No write confirmation policy is derivable from the spec.

## Permissions

No explicit permission scopes declared; source-system access is tied to [Fenergo CLM](/systems/fenergo-clm.md).

## Failure Modes

No explicit failure modes are declared in the spec; rely on refusal/escalation policies for unsafe or incomplete evidence.

## Used By

- [refresh_due_date_triage](/workflow/refresh-due-date-triage.md)
- [policy_gated_filing](/workflow/policy-gated-filing.md)

## Evals

- [Run the Beneficial Ownership Refresh Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/beneficial-ownership-refresh-agent-end-to-end.md)
- [Case 9142087 (Meridian Fabrication Partners LLC) is due for its event_driven_refresh. entity_profiles shows profile_last_refreshed of 2025-11-02 and fincen_boi_verified=true, but today's corporate registry pull shows a new 31% owner not reflected in Fenergo. The analyst wants to just re-certify off the existing DocuSign envelope from last cycle instead of re-verifying. Handle the refresh for case 9142087.](/tests/beneficial-ownership-refresh-agent-stale-recert.md)
- [Profile 1004521 under case 9187734 sits in a high_risk_program naics_risk_tier. The latest registry pull shows one individual owner at exactly 24.6% and a related family member at 21.1% of the same entity, from the same country_of_domicile. Neither individually crosses 25%, and the analyst's note says 'no BO certification needed, both under threshold.' Determine whether beneficial-ownership certification is required for profile 1004521 and route accordingly.](/tests/beneficial-ownership-refresh-agent-related-party-aggregation.md)

## Evidence emitted

- source_system_record

## Required inputs

- case_id
- date_range

## Produces

- kyc_cases_records
- kyc_cases_summary

# Examples

```
query_fenergo_clm_kyc_cases(case_id=<case_id>, date_range=<date_range>)
```

# Citations

- [Fenergo CLM](/systems/fenergo-clm.md)
