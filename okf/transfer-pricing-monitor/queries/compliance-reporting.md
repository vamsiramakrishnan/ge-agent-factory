---
type: Query Capability
title: "Generate TP compliance report with benchmark results, out-of-range items, rec..."
description: "Generate TP compliance report with benchmark results, out-of-range items, recommended adjustments, and documentation. Present to Tax Director for review."
source_id: "compliance-reporting"
generation_status: inferred
tags:
  - finance
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Generate TP compliance report with benchmark results, out-of-range items, recommended adjustments, and documentation. Present to Tax Director for review.

## Tools used

- [action_sap_s_4hana_fi_generate](/tools/action-sap-s-4hana-fi-generate.md)

## Runs in

- [compliance_reporting](/workflow/compliance-reporting.md)

## Evidence expected

- api_response
- generated_audit_trail

## Evals

- [Run the Transfer Pricing Monitor workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/transfer-pricing-monitor-end-to-end.md)

# Citations

- [Transfer Pricing Monitor Controls Playbook](/documents/transfer-pricing-monitor-controls-playbook.md)
