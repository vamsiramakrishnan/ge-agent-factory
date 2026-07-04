---
type: Query Capability
title: Gemini synthesizes all data into a compelling presentation narrative. Drafts ...
description: "Gemini synthesizes all data into a compelling presentation narrative. Drafts talking points: 'Open with the positive — OTIF improved 4 points. Then address pricing: raw material costs dropped 8% since last negotiation — we should see pass-through savings per the contract formula.' Anticipates supplier counterarguments and prepares responses."
source_id: "narrative-synthesis-counterargument-prep"
generation_status: inferred
tags:
  - procurement
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Gemini synthesizes all data into a compelling presentation narrative. Drafts talking points: 'Open with the positive — OTIF improved 4 points. Then address pricing: raw material costs dropped 8% since last negotiation — we should see pass-through savings per the contract formula.' Anticipates supplier counterarguments and prepares responses.

## Tools used

- [query_scorecard_data_scorecard_data_records](/tools/query-scorecard-data-scorecard-data-records.md)
- [query_contract_data_contract_data_records](/tools/query-contract-data-contract-data-records.md)
- [lookup_business_review_prep_agent_policy_guide](/tools/lookup-business-review-prep-agent-policy-guide.md)
- [action_scorecard_data_generate](/tools/action-scorecard-data-generate.md)

## Runs in

- [narrative_synthesis_counterargument_prep](/workflow/narrative-synthesis-counterargument-prep.md)

## Evidence expected

- source_system_record
- document_reference
- api_response
- generated_audit_trail

## Evals

- [Run the Business Review Prep Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/business-review-prep-agent-end-to-end.md)

# Citations

- [Business Review Prep Agent Procurement Policy Guide](/documents/business-review-prep-agent-policy-guide.md)
