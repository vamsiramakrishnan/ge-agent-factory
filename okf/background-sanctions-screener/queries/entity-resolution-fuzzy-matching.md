---
type: Query Capability
title: Fuzzy name/alias matching against sanctions lists with configurable threshold...
description: "Fuzzy name/alias matching against sanctions lists with configurable thresholds. Entity resolution across different name formats and transliterations. D&B corporate hierarchy analysis for beneficial ownership tracing."
source_id: "entity-resolution-fuzzy-matching"
generation_status: inferred
tags:
  - procurement
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Fuzzy name/alias matching against sanctions lists with configurable thresholds. Entity resolution across different name formats and transliterations. D&B corporate hierarchy analysis for beneficial ownership tracing.

## Tools used

- [lookup_background_sanctions_screener_policy_guide](/tools/lookup-background-sanctions-screener-policy-guide.md)
- [action_lexisnexis_match](/tools/action-lexisnexis-match.md)

## Runs in

- [entity_resolution_fuzzy_matching](/workflow/entity-resolution-fuzzy-matching.md)

## Evidence expected

- document_reference
- api_response
- generated_audit_trail

## Evals

- [Run the Background & Sanctions Screener workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/background-sanctions-screener-end-to-end.md)

# Citations

- [Background & Sanctions Screener Procurement Policy Guide](/documents/background-sanctions-screener-policy-guide.md)
