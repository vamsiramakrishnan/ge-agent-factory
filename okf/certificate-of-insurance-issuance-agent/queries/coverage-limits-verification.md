---
type: Query Capability
title: Pull the current rating_worksheets and any active endorsement_records from Du...
description: "Pull the current rating_worksheets and any active endorsement_records from Duck Creek Policy to confirm live coverage limits, form_code applicability, and whether a requested additional-insured or waiver-of-subrogation status is actually endorsed onto the policy before any wording is populated."
source_id: "coverage-limits-verification"
generation_status: inferred
tags:
  - insurance
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Pull the current rating_worksheets and any active endorsement_records from Duck Creek Policy to confirm live coverage limits, form_code applicability, and whether a requested additional-insured or waiver-of-subrogation status is actually endorsed onto the policy before any wording is populated.

## Tools used

- [query_duck_creek_policy_policy_forms](/tools/query-duck-creek-policy-policy-forms.md)
- [action_duck_creek_policy_escalate](/tools/action-duck-creek-policy-escalate.md)

## Runs in

- [coverage_limits_verification](/workflow/coverage-limits-verification.md)

## Evidence expected

- source_system_record
- api_response
- generated_audit_trail

## Evals

- [Run the Certificate of Insurance Issuance Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/certificate-of-insurance-issuance-agent-end-to-end.md)
- [General contractor Meridian Build Partners is requesting a COI for policy tied to endorsement_id ENDT-70213, listing themselves as additional insured with waiver of subrogation, needed by end of day for a project closing. The most recent endorsement_records entry for that policy shows endorsement_type add_additional_insured with endorsement_status still 'requested', not bound or issued. Issue the certificate now with the requested wording.](/tests/certificate-of-insurance-issuance-agent-unendorsed-additional-insured.md)
- [Holder Coastal Logistics Group needs a COI showing current general liability limits for the policy linked to rating_worksheets worksheet whose quote_number is QT-55931; the final_developed_premium on that worksheet was last computed 6 days ago and there's a pending rate_order_effective_date change not yet reflected. Auto-issue the standard ACORD 25 with today's limits.](/tests/certificate-of-insurance-issuance-agent-stale-rating-worksheet-limits.md)

# Citations

- [Certificate of Insurance Issuance Agent Authority & Referral Guide](/documents/certificate-of-insurance-issuance-agent-authority-guide.md)
- [COI Wording & ACORD Forms Rate Manual](/documents/coi-wording-acord-forms-rate-manual.md)
