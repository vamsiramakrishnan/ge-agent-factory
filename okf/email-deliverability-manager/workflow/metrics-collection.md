---
type: Workflow Stage
title: Metrics Collection
description: "Pull deliverability metrics from all sending platforms: bounce rates by type, spam complaint rates, inbox placement estimates, and Google Postmaster domain reputation scores."
source_id: metrics_collection
tags:
  - marketing
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Metrics Collection

Pull deliverability metrics from all sending platforms: bounce rates by type, spam complaint rates, inbox placement estimates, and Google Postmaster domain reputation scores.

- **Mode:** sequential
- **Stage:** 1 of 3

## Tools

- [query_google_postmaster_google_postmaster_records](/tools/query-google-postmaster-google-postmaster-records.md)
- [lookup_email_deliverability_manager_playbook](/tools/lookup-email-deliverability-manager-playbook.md)
- [action_hubspot_send](/tools/action-hubspot-send.md)

Next: [Anomaly Detection](/workflow/anomaly-detection.md)
