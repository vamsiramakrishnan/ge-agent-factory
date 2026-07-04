---
type: Query Capability
title: Gemini generates training content from regulatory source material. Creates ro...
description: "Gemini generates training content from regulatory source material. Creates role-specific compliance scenarios with localized legal nuances for each jurisdiction."
source_id: "content-generation"
generation_status: inferred
tags:
  - hr
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Gemini generates training content from regulatory source material. Creates role-specific compliance scenarios with localized legal nuances for each jurisdiction.

## Tools used

- [query_legal_db_legal_db_records](/tools/query-legal-db-legal-db-records.md)
- [lookup_compliance_training_content_generator_policy_handbook](/tools/lookup-compliance-training-content-generator-policy-handbook.md)
- [action_lms_generate](/tools/action-lms-generate.md)

## Runs in

- [content_generation](/workflow/content-generation.md)

## Evidence expected

- source_system_record
- document_reference
- api_response
- generated_audit_trail

## Evals

- [Run the Compliance Training Content Generator workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/compliance-training-content-generator-end-to-end.md)

# Citations

- [Compliance Training Content Generator Policy Handbook](/documents/compliance-training-content-generator-policy-handbook.md)
