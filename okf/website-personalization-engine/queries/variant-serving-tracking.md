---
type: Query Capability
title: Serve personalized content variant via Google Optimize. Track engagement and ...
description: Serve personalized content variant via Google Optimize. Track engagement and conversion metrics. Feed results back to optimization models.
source_id: "variant-serving-tracking"
generation_status: inferred
tags:
  - marketing
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Serve personalized content variant via Google Optimize. Track engagement and conversion metrics. Feed results back to optimization models.

## Tools used

- [query_google_optimize_google_optimize_records](/tools/query-google-optimize-google-optimize-records.md)
- [action_google_optimize_match](/tools/action-google-optimize-match.md)

## Runs in

- [variant_serving_tracking](/workflow/variant-serving-tracking.md)

## Evidence expected

- source_system_record
- api_response
- generated_audit_trail

## Evals

- [Run the Website Personalization Engine workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/website-personalization-engine-end-to-end.md)

# Citations

- [Website Personalization Engine Playbook](/documents/website-personalization-engine-playbook.md)
