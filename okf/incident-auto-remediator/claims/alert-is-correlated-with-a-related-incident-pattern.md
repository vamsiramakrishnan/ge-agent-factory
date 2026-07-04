---
type: Claim
title: Alert is correlated with a related incident pattern
description: "Evidence-backed claim: Alert is correlated with a related incident pattern"
source_id: "alert-is-correlated-with-a-related-incident-pattern"
tags:
  - it
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
source_kind: generationSpec
source_path: behaviorContract.evidenceRequirements.0
generation_status: generated
ge_status: generated
---

# Alert is correlated with a related incident pattern

## Authority

- [pagerduty](/systems/pagerduty.md)
- [datadog](/systems/datadog.md)
- [terraform](/systems/terraform.md)

## Required Evidence

- alerts.fired_at
- alerts.service_id
- services.deployment_version

## Citation Requirements

Must cite: alerts.fired_at, alerts.service_id, services.deployment_version

## Proof obligations

- [Evidence obligation — Alert is correlated with a related incident pattern](/proof-obligations/evidence-alert-is-correlated-with-a-related-incident-pattern.md)

# Citations

- [SRE Runbook Library](/documents/sre-runbook-library.md)
- [Production Change Approval Policy](/documents/production-change-approval-policy.md)
