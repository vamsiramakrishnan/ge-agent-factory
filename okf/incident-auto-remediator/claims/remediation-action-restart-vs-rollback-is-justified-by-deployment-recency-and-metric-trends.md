---
type: Claim
title: Remediation action (restart vs rollback) is justified by deployment recency and metric trends
description: "Evidence-backed claim: Remediation action (restart vs rollback) is justified by deployment recency and metric trends"
source_id: "remediation-action-restart-vs-rollback-is-justified-by-deployment-recency-and-metric-trends"
tags:
  - it
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
source_kind: generationSpec
source_path: behaviorContract.evidenceRequirements.2
generation_status: generated
ge_status: generated
---

# Remediation action (restart vs rollback) is justified by deployment recency and metric trends

## Authority

- [terraform](/systems/terraform.md)
- [datadog](/systems/datadog.md)

## Required Evidence

- services.deployment_version
- incidents.alert_id

## Citation Requirements

Must cite: services.deployment_version, incidents.alert_id

## Proof obligations

- [Evidence obligation — Remediation action (restart vs rollback) is justified by deployment recency and metric trends](/proof-obligations/evidence-remediation-action-restart-vs-rollback-is-justified-by-deployment-recency-and-metric-trends.md)

# Citations

- [SRE Runbook Library](/documents/sre-runbook-library.md)
- [Production Change Approval Policy](/documents/production-change-approval-policy.md)
