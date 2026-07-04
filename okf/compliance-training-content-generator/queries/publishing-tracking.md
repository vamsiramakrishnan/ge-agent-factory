---
type: Query Capability
title: "Deploy generated content to Cornerstone LMS with completion tracking, deadlin..."
description: "Deploy generated content to Cornerstone LMS with completion tracking, deadline assignment, and automated reminder workflows."
source_id: "publishing-tracking"
generation_status: inferred
tags:
  - hr
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Deploy generated content to Cornerstone LMS with completion tracking, deadline assignment, and automated reminder workflows.

## Tools used

- [query_lms_lms_records](/tools/query-lms-lms-records.md)
- [lookup_compliance_training_content_generator_policy_handbook](/tools/lookup-compliance-training-content-generator-policy-handbook.md)
- [action_lms_generate](/tools/action-lms-generate.md)

## Runs in

- [publishing_tracking](/workflow/publishing-tracking.md)

## Evidence expected

- source_system_record
- document_reference
- api_response
- generated_audit_trail

## Evals

- [Run the Compliance Training Content Generator workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/compliance-training-content-generator-end-to-end.md)

# Citations

- [Compliance Training Content Generator Policy Handbook](/documents/compliance-training-content-generator-policy-handbook.md)
