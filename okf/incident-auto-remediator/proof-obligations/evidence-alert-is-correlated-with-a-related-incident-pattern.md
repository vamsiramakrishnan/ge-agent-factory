---
type: Proof Obligation
title: Evidence obligation — Alert is correlated with a related incident pattern
description: evidence requirement proof obligation
source_id: "evidence-alert-is-correlated-with-a-related-incident-pattern"
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

# Evidence obligation — Alert is correlated with a related incident pattern

- **Kind:** evidence requirement
- **Spec source:** behaviorContract.evidenceRequirements.0
- **Claim:** [Alert is correlated with a related incident pattern](/claims/alert-is-correlated-with-a-related-incident-pattern.md)

## Required citations

- alerts.fired_at
- alerts.service_id
- services.deployment_version

## Source systems

- [pagerduty](/systems/pagerduty.md)
- [datadog](/systems/datadog.md)
- [terraform](/systems/terraform.md)
