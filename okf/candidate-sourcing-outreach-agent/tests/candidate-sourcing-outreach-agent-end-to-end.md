---
type: Eval Scenario
title: "Run the Candidate Sourcing & Outreach Agent workflow for the current period. ..."
description: "Run the Candidate Sourcing & Outreach Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
source_id: "candidate-sourcing-outreach-agent-end-to-end"
generation_status: inferred
tags:
  - hr
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Run the Candidate Sourcing & Outreach Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

## Validates

- [multi-channel-search](/queries/multi-channel-search.md)

## Mechanisms to call

- [query_linkedin_linkedin_records](/tools/query-linkedin-linkedin-records.md)
- [query_indeed_indeed_records](/tools/query-indeed-indeed-records.md)
- [query_ats_ats_records](/tools/query-ats-ats-records.md)
- [query_gmail_messages](/tools/query-gmail-messages.md)
- [lookup_candidate_sourcing_outreach_agent_policy_handbook](/tools/lookup-candidate-sourcing-outreach-agent-policy-handbook.md)
- [action_linkedin_file](/tools/action-linkedin-file.md)

## Success rubric

Action file executed against LinkedIn, with audit-trail entry and Recruiter notified of outcomes.

# Citations

- [Candidate Sourcing & Outreach Agent Policy Handbook](/documents/candidate-sourcing-outreach-agent-policy-handbook.md)
