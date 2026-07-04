---
type: Query Capability
title: Automated scan of draft against current regulations across all applicable jur...
description: "Automated scan of draft against current regulations across all applicable jurisdictions. Flag gaps, conflicts, and areas requiring legal review."
source_id: "compliance-gap-analysis"
generation_status: inferred
tags:
  - hr
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Automated scan of draft against current regulations across all applicable jurisdictions. Flag gaps, conflicts, and areas requiring legal review.

## Tools used

- [query_legal_db_legal_db_records](/tools/query-legal-db-legal-db-records.md)
- [lookup_policy_drafting_review_assistant_policy_handbook](/tools/lookup-policy-drafting-review-assistant-policy-handbook.md)

## Runs in

- [compliance_gap_analysis](/workflow/compliance-gap-analysis.md)

## Evidence expected

- source_system_record
- document_reference

## Evals

- [Run the Policy Drafting & Review Assistant workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/policy-drafting-review-assistant-end-to-end.md)

# Citations

- [Policy Drafting & Review Assistant Policy Handbook](/documents/policy-drafting-review-assistant-policy-handbook.md)
