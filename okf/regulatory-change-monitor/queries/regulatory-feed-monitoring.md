---
type: Query Capability
title: "Continuously monitor Bloomberg Tax, CCH, IRS.gov, OECD, and state department ..."
description: "Continuously monitor Bloomberg Tax, CCH, IRS.gov, OECD, and state department of revenue feeds for new legislation, regulations, guidance, and rulings relevant to the company's tax footprint."
source_id: "regulatory-feed-monitoring"
generation_status: inferred
tags:
  - finance
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Continuously monitor Bloomberg Tax, CCH, IRS.gov, OECD, and state department of revenue feeds for new legislation, regulations, guidance, and rulings relevant to the company's tax footprint.

## Tools used

- [query_bloomberg_tax_bloomberg_tax_records](/tools/query-bloomberg-tax-bloomberg-tax-records.md)
- [query_cch_answerconnect_cch_answerconnect_records](/tools/query-cch-answerconnect-cch-answerconnect-records.md)
- [lookup_regulatory_change_monitor_controls_playbook](/tools/lookup-regulatory-change-monitor-controls-playbook.md)

## Runs in

- [regulatory_feed_monitoring](/workflow/regulatory-feed-monitoring.md)

## Evidence expected

- source_system_record
- document_reference

## Evals

- [Run the Regulatory Change Monitor workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/regulatory-change-monitor-end-to-end.md)

# Citations

- [Regulatory Change Monitor Controls Playbook](/documents/regulatory-change-monitor-controls-playbook.md)
