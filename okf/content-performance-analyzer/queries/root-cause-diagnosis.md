---
type: Query Capability
title: Gemini explains why blog posts lost traffic \u2014 correlating with algorithm...
description: "Gemini explains why blog posts lost traffic \\u2014 correlating with algorithm updates, new competitor content, or freshness decay. Generates specific optimization recommendations with estimated traffic gain."
source_id: "root-cause-diagnosis"
generation_status: inferred
tags:
  - marketing
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Gemini explains why blog posts lost traffic \u2014 correlating with algorithm updates, new competitor content, or freshness decay. Generates specific optimization recommendations with estimated traffic gain.

## Tools used

- [lookup_content_performance_analyzer_playbook](/tools/lookup-content-performance-analyzer-playbook.md)
- [action_hubspot_recommend](/tools/action-hubspot-recommend.md)

## Runs in

- [root_cause_diagnosis](/workflow/root-cause-diagnosis.md)

## Evidence expected

- document_reference
- api_response
- generated_audit_trail

## Evals

- [Run the Content Performance Analyzer workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/content-performance-analyzer-end-to-end.md)

# Citations

- [Content Performance Analyzer Playbook](/documents/content-performance-analyzer-playbook.md)
