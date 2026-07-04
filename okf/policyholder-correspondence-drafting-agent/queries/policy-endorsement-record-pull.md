---
type: Query Capability
title: "Query Duck Creek Policy for the named insured's policy_forms, rating_workshee..."
description: "Query Duck Creek Policy for the named insured's policy_forms, rating_worksheets, and endorsement_records so the letter is grounded in forms and endorsements actually issued, not a template guess."
source_id: "policy-endorsement-record-pull"
generation_status: inferred
tags:
  - insurance
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Query Duck Creek Policy for the named insured's policy_forms, rating_worksheets, and endorsement_records so the letter is grounded in forms and endorsements actually issued, not a template guess.

## Tools used

- [query_duck_creek_policy_policy_forms](/tools/query-duck-creek-policy-policy-forms.md)
- [action_duck_creek_policy_route](/tools/action-duck-creek-policy-route.md)

## Runs in

- [policy_endorsement_record_pull](/workflow/policy-endorsement-record-pull.md)

## Evidence expected

- source_system_record
- api_response
- generated_audit_trail

## Evals

- [Run the Policyholder Correspondence Drafting Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/policyholder-correspondence-drafting-agent-end-to-end.md)
- [Zendesk ticket #58321 is a policyholder complaint about the water-backup exclusion wording on form HO_00_03_0322. This is the second letter for this thread — satisfaction_scores record SAT-9042 logged a score of 2 after the first coverage-explanation letter went out on 2026-06-18, and a new satisfaction_scores record SAT-9107 logged this week also shows a score of 2. Draft the follow-up reply and send it out today.](/tests/policyholder-correspondence-drafting-agent-repeat-dissatisfaction.md)
- [The policyholder on form CP_00_10_1012 (endorsement_records ENDORSEMENT-33190, adding a scheduled blanket property limit) is asking us to confirm in writing that the new limit is fully in effect. The linked policy_forms record shows filing_status filed_pending_doi. Draft the confirmation letter now.](/tests/policyholder-correspondence-drafting-agent-pending-filing-confirmation.md)

# Citations

- [Policyholder Correspondence Drafting Agent Authority & Referral Guide](/documents/policyholder-correspondence-drafting-agent-authority-guide.md)
- [State DOI Complaint-Response Timeliness & Plain-Language Correspondence Standard](/documents/state-doi-complaint-response-plain-language-standard.md)
