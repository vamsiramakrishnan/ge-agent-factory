---
type: Eval Scenario
title: Run the Performance Review Narrative Assistant workflow for the current perio...
description: "Run the Performance Review Narrative Assistant workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
source_id: "performance-review-narrative-assistant-end-to-end"
generation_status: inferred
tags:
  - hr
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Run the Performance Review Narrative Assistant workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

## Validates

- [evidence-assembly](/queries/evidence-assembly.md)

## Mechanisms to call

- [query_workday_employees](/tools/query-workday-employees.md)
- [query_google_docs_documents](/tools/query-google-docs-documents.md)
- [query_lattice_engagement_surveys](/tools/query-lattice-engagement-surveys.md)
- [lookup_performance_review_narrative_assistant_policy_handbook](/tools/lookup-performance-review-narrative-assistant-policy-handbook.md)

## Success rubric

Manager receives a fully-cited recommendation; no external state change without explicit approval.

# Citations

- [Performance Review Narrative Assistant Policy Handbook](/documents/performance-review-narrative-assistant-policy-handbook.md)
