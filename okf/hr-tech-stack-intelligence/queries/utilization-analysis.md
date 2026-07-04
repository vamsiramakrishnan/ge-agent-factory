---
type: Query Capability
title: "Analyze license utilization, feature adoption rates, and capability overlap a..."
description: "Analyze license utilization, feature adoption rates, and capability overlap across the HR tech stack. Identify waste, underused features, and duplicate capabilities."
source_id: "utilization-analysis"
generation_status: inferred
tags:
  - hr
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Analyze license utilization, feature adoption rates, and capability overlap across the HR tech stack. Identify waste, underused features, and duplicate capabilities.

## Tools used

- [query_license_manager_license_manager_records](/tools/query-license-manager-license-manager-records.md)
- [lookup_hr_tech_stack_intelligence_policy_handbook](/tools/lookup-hr-tech-stack-intelligence-policy-handbook.md)

## Runs in

- [utilization_analysis](/workflow/utilization-analysis.md)

## Evidence expected

- source_system_record
- document_reference

## Evals

- [Run the HR Tech Stack Intelligence workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/hr-tech-stack-intelligence-end-to-end.md)

# Citations

- [HR Tech Stack Intelligence Policy Handbook](/documents/hr-tech-stack-intelligence-policy-handbook.md)
