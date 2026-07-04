---
type: Workflow Stage
title: "Carrier Manifest & Compliance Validation"
description: "Cross-check every sized shipment or return order against the Branch Cash Position Forecast Engine Banking Compliance Policy and the Cash-in-Transit Carrier Manifest & Insurance Limits Schedule (lookup_branch_cash_position_forecast_engine_compliance_policy) for declared-value caps and dual-control requirements before publishing."
source_id: carrier_manifest_compliance_validation
tags:
  - banking
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Carrier Manifest & Compliance Validation

Cross-check every sized shipment or return order against the Branch Cash Position Forecast Engine Banking Compliance Policy and the Cash-in-Transit Carrier Manifest & Insurance Limits Schedule (lookup_branch_cash_position_forecast_engine_compliance_policy) for declared-value caps and dual-control requirements before publishing.

- **Mode:** sequential
- **Stage:** 4 of 5

## Tools

- [lookup_branch_cash_position_forecast_engine_compliance_policy](/tools/lookup-branch-cash-position-forecast-engine-compliance-policy.md)
- [action_temenos_transact_publish](/tools/action-temenos-transact-publish.md)

Next: [Publish & Regional Escalation](/workflow/publish-regional-escalation.md)
