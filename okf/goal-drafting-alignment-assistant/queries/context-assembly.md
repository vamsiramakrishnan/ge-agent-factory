---
type: Query Capability
title: "Pull role context, team OKRs, and company strategy from Workday and Lattice. ..."
description: "Pull role context, team OKRs, and company strategy from Workday and Lattice. Structure inputs for goal generation."
source_id: "context-assembly"
generation_status: inferred
tags:
  - hr
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Pull role context, team OKRs, and company strategy from Workday and Lattice. Structure inputs for goal generation.

## Tools used

- [query_workday_employees](/tools/query-workday-employees.md)
- [query_lattice_engagement_surveys](/tools/query-lattice-engagement-surveys.md)
- [lookup_goal_drafting_alignment_assistant_policy_handbook](/tools/lookup-goal-drafting-alignment-assistant-policy-handbook.md)
- [action_workday_generate](/tools/action-workday-generate.md)

## Runs in

- [context_assembly](/workflow/context-assembly.md)

## Evidence expected

- source_system_record
- document_reference
- api_response
- generated_audit_trail

## Evals

- [Run the Goal Drafting & Alignment Assistant workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/goal-drafting-alignment-assistant-end-to-end.md)

# Citations

- [Goal Drafting & Alignment Assistant Policy Handbook](/documents/goal-drafting-alignment-assistant-policy-handbook.md)
