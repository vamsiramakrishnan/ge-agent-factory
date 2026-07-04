---
type: Query Capability
title: "Gemini generates executive-ready workforce plan narratives from structured da..."
description: "Gemini generates executive-ready workforce plan narratives from structured data. Includes recommendations, risk assessments, and data citations."
source_id: "narrative-generation"
generation_status: inferred
tags:
  - hr
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Gemini generates executive-ready workforce plan narratives from structured data. Includes recommendations, risk assessments, and data citations.

## Tools used

- [lookup_workforce_plan_document_drafter_policy_handbook](/tools/lookup-workforce-plan-document-drafter-policy-handbook.md)
- [action_google_docs_recommend](/tools/action-google-docs-recommend.md)

## Runs in

- [narrative_generation](/workflow/narrative-generation.md)

## Evidence expected

- document_reference
- api_response
- generated_audit_trail

## Evals

- [Run the Workforce Plan Document Drafter workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/workforce-plan-document-drafter-end-to-end.md)

# Citations

- [Workforce Plan Document Drafter Policy Handbook](/documents/workforce-plan-document-drafter-policy-handbook.md)
