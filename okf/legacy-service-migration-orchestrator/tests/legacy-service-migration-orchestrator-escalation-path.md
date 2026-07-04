---
type: Eval Scenario
title: While running the Legacy Service Migration Orchestrator workflow you encounte...
description: "While running the Legacy Service Migration Orchestrator workflow you encounter this condition: Enterprise-segment circuit order with fallout_status set and fallout age exceeding 72 hours. Handle it end to end."
source_id: "legacy-service-migration-orchestrator-escalation-path"
generation_status: inferred
tags:
  - telco
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# While running the Legacy Service Migration Orchestrator workflow you encounter this condition: Enterprise-segment circuit order with fallout_status set and fallout age exceeding 72 hours. Handle it end to end.

## Validates

- [retrieve-records](/queries/retrieve-records.md)

## Mechanisms to call

- [lookup_legacy_service_migration_orchestrator_assurance_runbook](/tools/lookup-legacy-service-migration-orchestrator-assurance-runbook.md)

## Success rubric

Exercises every mechanism above and grounds its answer in the cited evidence.

# Citations

- [Legacy Service Migration Orchestrator Service Assurance Runbook](/documents/legacy-service-migration-orchestrator-assurance-runbook.md)
