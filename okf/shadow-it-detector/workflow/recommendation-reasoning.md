---
type: Workflow Stage
title: Recommendation Reasoning
description: "Gemini recommends action for each shadow app: adopt officially (high usage, low risk), monitor (moderate usage, acceptable risk), or block (data exposure risk exceeds acceptable threshold). Suggests approved alternatives for blocked apps."
source_id: recommendation_reasoning
tags:
  - it
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Recommendation Reasoning

Gemini recommends action for each shadow app: adopt officially (high usage, low risk), monitor (moderate usage, acceptable risk), or block (data exposure risk exceeds acceptable threshold). Suggests approved alternatives for blocked apps.

- **Mode:** sequential
- **Stage:** 3 of 4

## Tools

- [lookup_shadow_it_detector_runbook](/tools/lookup-shadow-it-detector-runbook.md)
- [action_okta_approve](/tools/action-okta-approve.md)

Next: [Policy Enforcement](/workflow/policy-enforcement.md)
