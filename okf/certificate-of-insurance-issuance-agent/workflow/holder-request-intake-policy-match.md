---
type: Workflow Stage
title: "Holder Request Intake & Policy Match"
description: "Capture the incoming certificate holder request (holder name, additional-insured wording, project reference) and match it to the correct in-force policy_forms and endorsement_records for that named insured in Duck Creek Policy."
source_id: holder_request_intake_policy_match
tags:
  - insurance
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Holder Request Intake & Policy Match

Capture the incoming certificate holder request (holder name, additional-insured wording, project reference) and match it to the correct in-force policy_forms and endorsement_records for that named insured in Duck Creek Policy.

- **Mode:** sequential
- **Stage:** 1 of 5

## Tools

- [query_duck_creek_policy_policy_forms](/tools/query-duck-creek-policy-policy-forms.md)
- [lookup_certificate_of_insurance_issuance_agent_authority_guide](/tools/lookup-certificate-of-insurance-issuance-agent-authority-guide.md)
- [action_duck_creek_policy_escalate](/tools/action-duck-creek-policy-escalate.md)

Next: [Coverage & Limits Verification](/workflow/coverage-limits-verification.md)
