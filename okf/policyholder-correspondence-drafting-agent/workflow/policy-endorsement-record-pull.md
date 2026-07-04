---
type: Workflow Stage
title: "Policy & Endorsement Record Pull"
description: "Query Duck Creek Policy for the named insured's policy_forms, rating_worksheets, and endorsement_records so the letter is grounded in forms and endorsements actually issued, not a template guess."
source_id: policy_endorsement_record_pull
tags:
  - insurance
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Policy & Endorsement Record Pull

Query Duck Creek Policy for the named insured's policy_forms, rating_worksheets, and endorsement_records so the letter is grounded in forms and endorsements actually issued, not a template guess.

- **Mode:** sequential
- **Stage:** 2 of 5

## Tools

- [query_duck_creek_policy_policy_forms](/tools/query-duck-creek-policy-policy-forms.md)
- [action_duck_creek_policy_route](/tools/action-duck-creek-policy-route.md)

Next: [Coverage-Language & Filed-Status Validation](/workflow/coverage-language-filed-status-validation.md)
