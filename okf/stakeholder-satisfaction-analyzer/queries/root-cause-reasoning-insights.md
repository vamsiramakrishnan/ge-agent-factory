---
type: Query Capability
title: "Gemini reads feedback like 'procurement always slows us down' and identifies ..."
description: "Gemini reads feedback like 'procurement always slows us down' and identifies the root cause — is this a policy communication problem, a process bottleneck, or a genuine value-add the stakeholder doesn't see? Generates actionable insights, not just sentiment scores."
source_id: "root-cause-reasoning-insights"
generation_status: inferred
tags:
  - procurement
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Gemini reads feedback like 'procurement always slows us down' and identifies the root cause — is this a policy communication problem, a process bottleneck, or a genuine value-add the stakeholder doesn't see? Generates actionable insights, not just sentiment scores.

## Tools used

- [lookup_stakeholder_satisfaction_analyzer_policy_guide](/tools/lookup-stakeholder-satisfaction-analyzer-policy-guide.md)
- [action_qualtrics_generate](/tools/action-qualtrics-generate.md)

## Runs in

- [root_cause_reasoning_insights](/workflow/root-cause-reasoning-insights.md)

## Evidence expected

- document_reference
- api_response
- generated_audit_trail

## Evals

- [Run the Stakeholder Satisfaction Analyzer workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/stakeholder-satisfaction-analyzer-end-to-end.md)

# Citations

- [Stakeholder Satisfaction Analyzer Procurement Policy Guide](/documents/stakeholder-satisfaction-analyzer-policy-guide.md)
