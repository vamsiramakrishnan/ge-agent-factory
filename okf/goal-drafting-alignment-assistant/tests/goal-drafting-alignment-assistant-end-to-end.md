---
type: Eval Scenario
title: "Run the Goal Drafting & Alignment Assistant workflow for the current period. ..."
description: "Run the Goal Drafting & Alignment Assistant workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
source_id: "goal-drafting-alignment-assistant-end-to-end"
generation_status: inferred
tags:
  - hr
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Run the Goal Drafting & Alignment Assistant workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

## Validates

- [context-assembly](/queries/context-assembly.md)

## Mechanisms to call

- [query_workday_employees](/tools/query-workday-employees.md)
- [query_google_docs_documents](/tools/query-google-docs-documents.md)
- [query_lattice_engagement_surveys](/tools/query-lattice-engagement-surveys.md)
- [lookup_goal_drafting_alignment_assistant_policy_handbook](/tools/lookup-goal-drafting-alignment-assistant-policy-handbook.md)
- [action_workday_generate](/tools/action-workday-generate.md)

## Success rubric

Action generate executed against Workday, with audit-trail entry and Manager notified of outcomes.

# Citations

- [Goal Drafting & Alignment Assistant Policy Handbook](/documents/goal-drafting-alignment-assistant-policy-handbook.md)
