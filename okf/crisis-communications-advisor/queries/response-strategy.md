---
type: Query Capability
title: "Gemini assesses crisis context, distinguishes genuine threats from manufactur..."
description: "Gemini assesses crisis context, distinguishes genuine threats from manufactured controversy, and generates tiered response strategy. Drafts channel-specific holding statements — social vs. press vs. internal — with calibrated tone."
source_id: "response-strategy"
generation_status: inferred
tags:
  - marketing
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Gemini assesses crisis context, distinguishes genuine threats from manufactured controversy, and generates tiered response strategy. Drafts channel-specific holding statements — social vs. press vs. internal — with calibrated tone.

## Tools used

- [query_sprout_social_social_posts](/tools/query-sprout-social-social-posts.md)
- [lookup_crisis_communications_advisor_playbook](/tools/lookup-crisis-communications-advisor-playbook.md)
- [action_brandwatch_generate](/tools/action-brandwatch-generate.md)

## Runs in

- [response_strategy](/workflow/response-strategy.md)

## Evidence expected

- source_system_record
- document_reference
- api_response
- generated_audit_trail

## Evals

- [Run the Crisis Communications Advisor workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/crisis-communications-advisor-end-to-end.md)

# Citations

- [Crisis Communications Advisor Playbook](/documents/crisis-communications-advisor-playbook.md)
