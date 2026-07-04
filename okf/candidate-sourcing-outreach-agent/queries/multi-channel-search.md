---
type: Query Capability
title: "Intelligent candidate identification across LinkedIn, Indeed, and internal da..."
description: "Intelligent candidate identification across LinkedIn, Indeed, and internal databases. Gemini scores candidate-role fit beyond keyword matching."
source_id: "multi-channel-search"
generation_status: inferred
tags:
  - hr
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Intelligent candidate identification across LinkedIn, Indeed, and internal databases. Gemini scores candidate-role fit beyond keyword matching.

## Tools used

- [query_linkedin_linkedin_records](/tools/query-linkedin-linkedin-records.md)
- [query_indeed_indeed_records](/tools/query-indeed-indeed-records.md)
- [lookup_candidate_sourcing_outreach_agent_policy_handbook](/tools/lookup-candidate-sourcing-outreach-agent-policy-handbook.md)
- [action_linkedin_file](/tools/action-linkedin-file.md)

## Runs in

- [multi_channel_search](/workflow/multi-channel-search.md)

## Evidence expected

- source_system_record
- document_reference
- api_response
- generated_audit_trail

## Evals

- [Run the Candidate Sourcing & Outreach Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/candidate-sourcing-outreach-agent-end-to-end.md)

# Citations

- [Candidate Sourcing & Outreach Agent Policy Handbook](/documents/candidate-sourcing-outreach-agent-policy-handbook.md)
