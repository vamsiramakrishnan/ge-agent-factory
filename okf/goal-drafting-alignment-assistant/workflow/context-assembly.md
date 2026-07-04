---
type: Workflow Stage
title: Context Assembly
description: "Pull role context, team OKRs, and company strategy from Workday and Lattice. Structure inputs for goal generation."
source_id: context_assembly
tags:
  - hr
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Context Assembly

Pull role context, team OKRs, and company strategy from Workday and Lattice. Structure inputs for goal generation.

- **Mode:** sequential
- **Stage:** 1 of 3

## Tools

- [query_workday_employees](/tools/query-workday-employees.md)
- [query_lattice_engagement_surveys](/tools/query-lattice-engagement-surveys.md)
- [lookup_goal_drafting_alignment_assistant_policy_handbook](/tools/lookup-goal-drafting-alignment-assistant-policy-handbook.md)
- [action_workday_generate](/tools/action-workday-generate.md)

Next: [Goal Generation & Alignment](/workflow/goal-generation-alignment.md)
