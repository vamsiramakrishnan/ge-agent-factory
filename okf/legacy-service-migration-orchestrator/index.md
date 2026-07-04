---
okf_version: "0.1"
type: Knowledge Bundle
title: Legacy Service Migration Orchestrator
description: "Batch copper-to-fiber and TDM-to-IP migration candidates from service_orders and network_inventory_items, validate live network state, and sequence cutovers around registered change_requests freeze windows so weekly migrations completed rises from 350 to 2,100 while migration-caused outage minutes per customer falls from 38 to 4."
tags:
  - telco
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
provenance_origin: interview
provenance_source_ref: "apps/factory/catalog/interview-specs/legacy-service-migration-orchestrator.json"
provenance_version: "1"
provenance_status: registered
provenance_owner: "vamsiramakrishnan@gmail.com"
provenance_created_at: "2026-07-04T06:18:43.390Z"
---

# Legacy Service Migration Orchestrator

> T-4205 • Order Management & Provisioning

## Overview

- **Persona:** Provisioning Engineer
- **Department:** telco
- **Objective:** Batch copper-to-fiber and TDM-to-IP migration candidates from service_orders and network_inventory_items, validate live network state, and sequence cutovers around registered change_requests freeze windows so weekly migrations completed rises from 350 to 2,100 while migration-caused outage minutes per customer falls from 38 to 4.

## KPI summary

- **Migrations completed per week**: 350 → 2,100
- **Migration-caused outage minutes per customer**: 38 minutes → 4 minutes
- **Copper decommissioning program timeline**: 6 years projected → 2.5 years projected

## Contents

- [Playbook — role, scope, guardrails](/playbook.md)
- [Source Systems](/systems/index.md)
- [Data Entities](/tables/index.md)
- [Agent Tools](/tools/index.md)
- [Workflow Stages](/workflow/index.md)
- [Query Capabilities](/queries/index.md)
- [Eval Scenarios](/tests/index.md)
- [Source Documents](/documents/index.md)
- [Claims](/claims/index.md)
- [Policies](/policies/index.md)
- [Proof Obligations](/proof-obligations/index.md)
- [KPIs](/kpis.md)
- [Golden Evals](/evals.md)
