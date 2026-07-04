---
type: Query Capability
title: "Track contract expiry dates in CLM. Trigger tiered alerts at 90/60/30-day thr..."
description: "Track contract expiry dates in CLM. Trigger tiered alerts at 90/60/30-day thresholds. Detect auto-renewal flags and calculate cancellation notice windows."
source_id: "expiry-scanning"
generation_status: inferred
tags:
  - procurement
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Track contract expiry dates in CLM. Trigger tiered alerts at 90/60/30-day thresholds. Detect auto-renewal flags and calculate cancellation notice windows.

## Tools used

- [lookup_renewal_expiry_monitor_policy_guide](/tools/lookup-renewal-expiry-monitor-policy-guide.md)

## Runs in

- [expiry_scanning](/workflow/expiry-scanning.md)

## Evidence expected

- document_reference

## Evals

- [Run the Renewal & Expiry Monitor workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/renewal-expiry-monitor-end-to-end.md)

# Citations

- [Renewal & Expiry Monitor Procurement Policy Guide](/documents/renewal-expiry-monitor-policy-guide.md)
