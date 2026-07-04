---
type: Eval Scenario
title: "Run the Analyst & Influencer Relations Tracker workflow for the current perio..."
description: "Run the Analyst & Influencer Relations Tracker workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
source_id: "analyst-influencer-relations-tracker-end-to-end"
generation_status: inferred
tags:
  - marketing
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Run the Analyst & Influencer Relations Tracker workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

## Validates

- [coverage-aggregation](/queries/coverage-aggregation.md)

## Mechanisms to call

- [query_salesforce_crm_accounts](/tools/query-salesforce-crm-accounts.md)
- [query_cision_cision_records](/tools/query-cision-cision-records.md)
- [query_linkedin_linkedin_records](/tools/query-linkedin-linkedin-records.md)
- [query_google_workspace_accounts](/tools/query-google-workspace-accounts.md)
- [lookup_analyst_influencer_relations_tracker_playbook](/tools/lookup-analyst-influencer-relations-tracker-playbook.md)

## Success rubric

Brand Manager receives a fully-cited recommendation; no external state change without explicit approval.

# Citations

- [Analyst & Influencer Relations Tracker Playbook](/documents/analyst-influencer-relations-tracker-playbook.md)
