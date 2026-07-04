---
type: Query Capability
title: "Draft transaction-level dispute-response evidence and publish the monthly var..."
description: "Draft transaction-level dispute-response evidence and publish the monthly variance dashboard in Looker's dashboards and metric_definitions via query_looker_dashboards, citing the governing runbook sections for every flagged line."
source_id: "dispute-evidence-variance-reporting"
generation_status: inferred
tags:
  - insurance
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Draft transaction-level dispute-response evidence and publish the monthly variance dashboard in Looker's dashboards and metric_definitions via query_looker_dashboards, citing the governing runbook sections for every flagged line.

## Tools used

- [query_looker_dashboards](/tools/query-looker-dashboards.md)
- [action_guidewire_billingcenter_publish](/tools/action-guidewire-billingcenter-publish.md)

## Runs in

- [dispute_evidence_variance_reporting](/workflow/dispute-evidence-variance-reporting.md)

## Evidence expected

- sql_result
- api_response
- generated_audit_trail

## Evals

- [Run the Agent Commission Reconciliation Engine workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/agent-commission-reconciliation-engine-end-to-end.md)

# Citations

- [Agent Commission Reconciliation Engine Authority & Referral Guide](/documents/agent-commission-reconciliation-engine-authority-guide.md)
- [Commission Chargeback & Rate Adjustment Runbook](/documents/agent-commission-reconciliation-engine-chargeback-rate-runbook.md)
