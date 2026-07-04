---
type: Query Capability
title: "Assemble learner profile from Workday (role, skills, career goals) and learni..."
description: "Assemble learner profile from Workday (role, skills, career goals) and learning history from Cornerstone and Degreed. Identify skill gaps relative to target role."
source_id: "learner-profile-analysis"
generation_status: inferred
tags:
  - hr
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Assemble learner profile from Workday (role, skills, career goals) and learning history from Cornerstone and Degreed. Identify skill gaps relative to target role.

## Tools used

- [query_workday_employees](/tools/query-workday-employees.md)
- [lookup_learning_path_recommendation_policy_handbook](/tools/lookup-learning-path-recommendation-policy-handbook.md)

## Runs in

- [learner_profile_analysis](/workflow/learner-profile-analysis.md)

## Evidence expected

- source_system_record
- document_reference

## Evals

- [Run the Learning Path Recommendation workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/learning-path-recommendation-end-to-end.md)

# Citations

- [Learning Path Recommendation Policy Handbook](/documents/learning-path-recommendation-policy-handbook.md)
