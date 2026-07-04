---
type: Query Capability
title: Gemini drafts responses that maintain brand voice while addressing specific s...
description: "Gemini drafts responses that maintain brand voice while addressing specific situations. Distinguishes between a customer with a real product issue (empathetic, helpful), a prospect asking about features (informative, inviting), and a troll (ignore or light engagement)."
source_id: "contextual-response-generation"
generation_status: inferred
tags:
  - marketing
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Gemini drafts responses that maintain brand voice while addressing specific situations. Distinguishes between a customer with a real product issue (empathetic, helpful), a prospect asking about features (informative, inviting), and a troll (ignore or light engagement).

## Tools used

- [lookup_community_engagement_responder_playbook](/tools/lookup-community-engagement-responder-playbook.md)

## Runs in

- [contextual_response_generation](/workflow/contextual-response-generation.md)

## Evidence expected

- document_reference

## Evals

- [Run the Community Engagement Responder workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/community-engagement-responder-end-to-end.md)

# Citations

- [Community Engagement Responder Playbook](/documents/community-engagement-responder-playbook.md)
