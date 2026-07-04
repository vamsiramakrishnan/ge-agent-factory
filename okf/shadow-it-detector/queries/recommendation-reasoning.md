---
type: Query Capability
title: "Gemini recommends action for each shadow app: adopt officially (high usage, l..."
description: "Gemini recommends action for each shadow app: adopt officially (high usage, low risk), monitor (moderate usage, acceptable risk), or block (data exposure risk exceeds acceptable threshold). Suggests approved alternatives for blocked apps."
source_id: "recommendation-reasoning"
generation_status: inferred
tags:
  - it
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Gemini recommends action for each shadow app: adopt officially (high usage, low risk), monitor (moderate usage, acceptable risk), or block (data exposure risk exceeds acceptable threshold). Suggests approved alternatives for blocked apps.

## Tools used

- [lookup_shadow_it_detector_runbook](/tools/lookup-shadow-it-detector-runbook.md)
- [action_okta_approve](/tools/action-okta-approve.md)

## Runs in

- [recommendation_reasoning](/workflow/recommendation-reasoning.md)

## Evidence expected

- document_reference
- api_response
- generated_audit_trail

## Evals

- [Run the Shadow IT Detector workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/shadow-it-detector-end-to-end.md)

# Citations

- [Shadow IT Detector Operations Runbook](/documents/shadow-it-detector-runbook.md)
