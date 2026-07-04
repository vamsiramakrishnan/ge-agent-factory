---
type: Index
title: Query Capabilities
description: "The questions and requests this agent can answer, each with the tools it uses."
timestamp: "2026-07-04T00:00:00.000Z"
---

# Query Capabilities

- [Pull the triggering ticket and prior macro history from Zendesk (tickets, macros) to classify the inquiry as coverage-question, complaint, or denial-adjacent before any drafting begins.](/queries/correspondence-trigger-intake.md)
- [Query Duck Creek Policy for the named insured's policy_forms, rating_worksheets, and endorsement_records so the letter is grounded in forms and endorsements actually issued, not a template guess.](/queries/policy-endorsement-record-pull.md)
- [Cross-check form_code, edition_date, and filing_status against the Policyholder Correspondence Drafting Agent Authority & Referral Guide and the State DOI Complaint-Response & Plain-Language Standard before wording any exclusion, denial, or coverage-affirmation sentence.](/queries/coverage-language-filed-status-validation.md)
- [Generate the letter with Vertex AI narrative generation, scoring the draft against plain-language readability thresholds and approved coverage-interpretation phrasing from the Authority & Referral Guide.](/queries/draft-assembly-readability-scoring.md)
- [Route any draft touching a denial, complaint, or filed_pending_doi form to the Customer Service Team Lead for one-pass approval, execute action_duck_creek_policy_route to log the send with an audit trail, and check the satisfaction_scores trend on the ticket before closing.](/queries/team-lead-routing-audit.md)
