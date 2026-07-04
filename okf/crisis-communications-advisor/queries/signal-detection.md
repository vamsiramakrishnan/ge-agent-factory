---
type: Query Capability
title: "Monitor for crisis signals: sudden sentiment drops (>15% in 2 hours), media i..."
description: "Monitor for crisis signals: sudden sentiment drops (>15% in 2 hours), media inquiry spikes, viral negative content, or executive mention anomalies across Brandwatch and Sprout Social."
source_id: "signal-detection"
generation_status: inferred
tags:
  - marketing
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Monitor for crisis signals: sudden sentiment drops (>15% in 2 hours), media inquiry spikes, viral negative content, or executive mention anomalies across Brandwatch and Sprout Social.

## Tools used

- [query_brandwatch_brand_mentions](/tools/query-brandwatch-brand-mentions.md)
- [query_sprout_social_social_posts](/tools/query-sprout-social-social-posts.md)
- [lookup_crisis_communications_advisor_playbook](/tools/lookup-crisis-communications-advisor-playbook.md)
- [action_brandwatch_generate](/tools/action-brandwatch-generate.md)

## Runs in

- [signal_detection](/workflow/signal-detection.md)

## Evidence expected

- source_system_record
- document_reference
- api_response
- generated_audit_trail

## Evals

- [Run the Crisis Communications Advisor workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/crisis-communications-advisor-end-to-end.md)

# Citations

- [Crisis Communications Advisor Playbook](/documents/crisis-communications-advisor-playbook.md)
