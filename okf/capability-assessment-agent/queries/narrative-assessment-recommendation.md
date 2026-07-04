---
type: Query Capability
title: "LLM evaluates capability claims in context — supplier claims 'state-of-the-ar..."
description: "LLM evaluates capability claims in context — supplier claims 'state-of-the-art quality systems' but PPM data shows 450 vs. incumbent's 120. Assesses credibility of experience claims. Synthesizes into actionable recommendation: qualify, trial order, or reject."
source_id: "narrative-assessment-recommendation"
generation_status: inferred
tags:
  - procurement
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# LLM evaluates capability claims in context — supplier claims 'state-of-the-art quality systems' but PPM data shows 450 vs. incumbent's 120. Assesses credibility of experience claims. Synthesizes into actionable recommendation: qualify, trial order, or reject.

## Tools used

- [query_jaggaer_supplier_profiles](/tools/query-jaggaer-supplier-profiles.md)
- [lookup_capability_assessment_agent_policy_guide](/tools/lookup-capability-assessment-agent-policy-guide.md)
- [action_ariba_slp_recommend](/tools/action-ariba-slp-recommend.md)

## Runs in

- [narrative_assessment_recommendation](/workflow/narrative-assessment-recommendation.md)

## Evidence expected

- source_system_record
- document_reference
- api_response
- generated_audit_trail

## Evals

- [Run the Capability Assessment Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/capability-assessment-agent-end-to-end.md)

# Citations

- [Capability Assessment Agent Procurement Policy Guide](/documents/capability-assessment-agent-policy-guide.md)
