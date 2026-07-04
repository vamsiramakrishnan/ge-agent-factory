---
type: Query Capability
title: "Pull deliverability metrics from all sending platforms: bounce rates by type,..."
description: "Pull deliverability metrics from all sending platforms: bounce rates by type, spam complaint rates, inbox placement estimates, and Google Postmaster domain reputation scores."
source_id: "metrics-collection"
generation_status: inferred
tags:
  - marketing
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Pull deliverability metrics from all sending platforms: bounce rates by type, spam complaint rates, inbox placement estimates, and Google Postmaster domain reputation scores.

## Tools used

- [query_google_postmaster_google_postmaster_records](/tools/query-google-postmaster-google-postmaster-records.md)
- [lookup_email_deliverability_manager_playbook](/tools/lookup-email-deliverability-manager-playbook.md)
- [action_hubspot_send](/tools/action-hubspot-send.md)

## Runs in

- [metrics_collection](/workflow/metrics-collection.md)

## Evidence expected

- source_system_record
- document_reference
- api_response
- generated_audit_trail

## Evals

- [Run the Email Deliverability Manager workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/email-deliverability-manager-end-to-end.md)

# Citations

- [Email Deliverability Manager Playbook](/documents/email-deliverability-manager-playbook.md)
