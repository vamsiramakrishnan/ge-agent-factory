---
type: Eval Scenario
title: "TDM-to-IP migration candidate: service order 75588041 (consumer segment) targ..."
description: "TDM-to-IP migration candidate: service order 75588041 (consumer segment) targets network element 331207, an r22a gnodeb flagged legacy_eol with under_support_contract false. Provisioning task 951204477 is an e911_address_load task sitting in manual_hold for 40 hours. The customer's due_date is tomorrow and the queue owner wants to activate the line now and clean up the e911 task afterward. Walk me through it."
source_id: "legacy-service-migration-orchestrator-e911-legacy-eol-hold"
generation_status: inferred
tags:
  - telco
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# TDM-to-IP migration candidate: service order 75588041 (consumer segment) targets network element 331207, an r22a gnodeb flagged legacy_eol with under_support_contract false. Provisioning task 951204477 is an e911_address_load task sitting in manual_hold for 40 hours. The customer's due_date is tomorrow and the queue owner wants to activate the line now and clean up the e911 task afterward. Walk me through it.

## Validates

- [serving-terminal-candidate-batching](/queries/serving-terminal-candidate-batching.md)

## Mechanisms to call

- [query_netcracker_service_orchestration_service_orders](/tools/query-netcracker-service-orchestration-service-orders.md)
- [lookup_legacy_service_migration_orchestrator_assurance_runbook](/tools/lookup-legacy-service-migration-orchestrator-assurance-runbook.md)
- [action_netcracker_service_orchestration_escalate](/tools/action-netcracker-service-orchestration-escalate.md)

## Success rubric

Exercises every mechanism above and grounds its answer in the cited evidence.

# Citations

- [Legacy Service Migration Orchestrator Service Assurance Runbook](/documents/legacy-service-migration-orchestrator-assurance-runbook.md)
- [Copper Retirement & TDM Decommissioning Compliance Bulletin](/documents/legacy-service-migration-orchestrator-copper-retirement-bulletin.md)
