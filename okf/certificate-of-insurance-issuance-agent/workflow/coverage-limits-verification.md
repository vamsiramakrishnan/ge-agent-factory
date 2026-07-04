---
type: Workflow Stage
title: "Coverage & Limits Verification"
description: "Pull the current rating_worksheets and any active endorsement_records from Duck Creek Policy to confirm live coverage limits, form_code applicability, and whether a requested additional-insured or waiver-of-subrogation status is actually endorsed onto the policy before any wording is populated."
source_id: coverage_limits_verification
tags:
  - insurance
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Coverage & Limits Verification

Pull the current rating_worksheets and any active endorsement_records from Duck Creek Policy to confirm live coverage limits, form_code applicability, and whether a requested additional-insured or waiver-of-subrogation status is actually endorsed onto the policy before any wording is populated.

- **Mode:** sequential
- **Stage:** 2 of 5

## Tools

- [query_duck_creek_policy_policy_forms](/tools/query-duck-creek-policy-policy-forms.md)
- [action_duck_creek_policy_escalate](/tools/action-duck-creek-policy-escalate.md)

Next: [Wording Authority Gating](/workflow/wording-authority-gating.md)
