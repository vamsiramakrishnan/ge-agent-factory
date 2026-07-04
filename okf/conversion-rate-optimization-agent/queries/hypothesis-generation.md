---
type: Query Capability
title: "Gemini analyzes behavior patterns and generates optimization hypotheses. 'Mob..."
description: "Gemini analyzes behavior patterns and generates optimization hypotheses. 'Mobile users from paid social drop off at the form at 3x desktop rate — form requires 8 fields. Hypothesis: reducing to 4 fields will increase mobile conversion by 35-50%.'"
source_id: "hypothesis-generation"
generation_status: inferred
tags:
  - marketing
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Gemini analyzes behavior patterns and generates optimization hypotheses. 'Mobile users from paid social drop off at the form at 3x desktop rate — form requires 8 fields. Hypothesis: reducing to 4 fields will increase mobile conversion by 35-50%.'

## Tools used

- [lookup_conversion_rate_optimization_agent_playbook](/tools/lookup-conversion-rate-optimization-agent-playbook.md)
- [action_hotjar_generate](/tools/action-hotjar-generate.md)

## Runs in

- [hypothesis_generation](/workflow/hypothesis-generation.md)

## Evidence expected

- document_reference
- api_response
- generated_audit_trail

## Evals

- [Run the Conversion Rate Optimization Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/conversion-rate-optimization-agent-end-to-end.md)

# Citations

- [Conversion Rate Optimization Agent Playbook](/documents/conversion-rate-optimization-agent-playbook.md)
