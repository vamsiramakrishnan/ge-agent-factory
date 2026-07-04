---
type: Query Capability
title: Gemini interprets what brand health metrics mean strategically. Correlates se...
description: "Gemini interprets what brand health metrics mean strategically. Correlates sentiment drops with specific events, pricing changes, or competitor actions. Generates actionable recommendations."
source_id: "strategic-interpretation"
generation_status: inferred
tags:
  - marketing
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Gemini interprets what brand health metrics mean strategically. Correlates sentiment drops with specific events, pricing changes, or competitor actions. Generates actionable recommendations.

## Tools used

- [query_brandwatch_brand_mentions](/tools/query-brandwatch-brand-mentions.md)
- [lookup_brand_health_monitor_playbook](/tools/lookup-brand-health-monitor-playbook.md)
- [action_brandwatch_recommend](/tools/action-brandwatch-recommend.md)

## Runs in

- [strategic_interpretation](/workflow/strategic-interpretation.md)

## Evidence expected

- source_system_record
- document_reference
- api_response
- generated_audit_trail

## Evals

- [Run the Brand Health Monitor workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/brand-health-monitor-end-to-end.md)

# Citations

- [Brand Health Monitor Playbook](/documents/brand-health-monitor-playbook.md)
