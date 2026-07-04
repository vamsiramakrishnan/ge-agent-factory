---
type: Query Capability
title: "Gemini interprets why campaign performance degraded \\u2014 reads ad copy, lan..."
description: "Gemini interprets why campaign performance degraded \\u2014 reads ad copy, landing page, and competitive landscape to diagnose creative fatigue, audience saturation, or competitive pressure. Generates actionable optimization recommendations."
source_id: "root-cause-diagnosis"
generation_status: inferred
tags:
  - marketing
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Gemini interprets why campaign performance degraded \u2014 reads ad copy, landing page, and competitive landscape to diagnose creative fatigue, audience saturation, or competitive pressure. Generates actionable optimization recommendations.

## Tools used

- [query_google_ads_campaigns](/tools/query-google-ads-campaigns.md)
- [query_meta_ads_campaigns](/tools/query-meta-ads-campaigns.md)
- [query_linkedin_ads_campaigns](/tools/query-linkedin-ads-campaigns.md)
- [lookup_paid_media_optimizer_playbook](/tools/lookup-paid-media-optimizer-playbook.md)

## Runs in

- [root_cause_diagnosis](/workflow/root-cause-diagnosis.md)

## Evidence expected

- sql_result
- document_reference

## Evals

- [Run the Paid Media Optimizer workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/paid-media-optimizer-end-to-end.md)

# Citations

- [Paid Media Optimizer Playbook](/documents/paid-media-optimizer-playbook.md)
