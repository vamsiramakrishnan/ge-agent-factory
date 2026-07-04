---
type: Workflow Stage
title: Mismatch Investigation
description: "Gemini investigates mismatches that aren't simple timing differences. Traces discrepancies to contract amendments, unprocessed entries, or FX differences. Generates correcting entries."
source_id: mismatch_investigation
tags:
  - finance
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Mismatch Investigation

Gemini investigates mismatches that aren't simple timing differences. Traces discrepancies to contract amendments, unprocessed entries, or FX differences. Generates correcting entries.

- **Mode:** sequential
- **Stage:** 2 of 3

## Tools

- [query_sap_s_4hana_fi_gl_entries](/tools/query-sap-s-4hana-fi-gl-entries.md)
- [action_sap_s_4hana_fi_generate](/tools/action-sap-s-4hana-fi-generate.md)

Next: [Resolution & Notification](/workflow/resolution-notification.md)
