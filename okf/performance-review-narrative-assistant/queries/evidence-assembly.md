---
type: Query Capability
title: "Gather goals, achievements, feedback, and performance metrics from Workday an..."
description: "Gather goals, achievements, feedback, and performance metrics from Workday and Lattice. Structure evidence for narrative generation."
source_id: "evidence-assembly"
generation_status: inferred
tags:
  - hr
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Gather goals, achievements, feedback, and performance metrics from Workday and Lattice. Structure evidence for narrative generation.

## Tools used

- [query_workday_employees](/tools/query-workday-employees.md)
- [query_lattice_engagement_surveys](/tools/query-lattice-engagement-surveys.md)
- [lookup_performance_review_narrative_assistant_policy_handbook](/tools/lookup-performance-review-narrative-assistant-policy-handbook.md)

## Runs in

- [evidence_assembly](/workflow/evidence-assembly.md)

## Evidence expected

- source_system_record
- document_reference

## Evals

- [Run the Performance Review Narrative Assistant workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/performance-review-narrative-assistant-end-to-end.md)

# Citations

- [Performance Review Narrative Assistant Policy Handbook](/documents/performance-review-narrative-assistant-policy-handbook.md)
