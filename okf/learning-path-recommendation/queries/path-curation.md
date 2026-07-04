---
type: Query Capability
title: Gemini matches learner gaps against internal LMS and external content catalog...
description: "Gemini matches learner gaps against internal LMS and external content catalogs. Ranks content by relevance, quality ratings, and format preferences."
source_id: "path-curation"
generation_status: inferred
tags:
  - hr
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Gemini matches learner gaps against internal LMS and external content catalogs. Ranks content by relevance, quality ratings, and format preferences.

## Tools used

- [query_lms_lms_records](/tools/query-lms-lms-records.md)
- [lookup_learning_path_recommendation_policy_handbook](/tools/lookup-learning-path-recommendation-policy-handbook.md)
- [action_lms_recommend](/tools/action-lms-recommend.md)

## Runs in

- [path_curation](/workflow/path-curation.md)

## Evidence expected

- source_system_record
- document_reference
- api_response
- generated_audit_trail

## Evals

- [Run the Learning Path Recommendation workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/learning-path-recommendation-end-to-end.md)

# Citations

- [Learning Path Recommendation Policy Handbook](/documents/learning-path-recommendation-policy-handbook.md)
