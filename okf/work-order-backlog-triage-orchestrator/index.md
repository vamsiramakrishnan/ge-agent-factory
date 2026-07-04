---
okf_version: "0.1"
type: Knowledge Bundle
title: Work Order Backlog Triage Orchestrator
description: "Score every open maintenance_work_order in IBM Maximo against asset_registry_entries.criticality_ranking, failure_codes recurrence, age, and parts/crew feasibility each week so the Maintenance Supervisor cuts the Maintenance backlog from 11 crew-weeks to 4 crew-weeks and lifts Schedule compliance from 61% to 85% without the standing 3-hour Monday planning meeting."
tags:
  - manufacturing
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
provenance_origin: interview
provenance_source_ref: "apps/factory/catalog/interview-specs/work-order-backlog-triage-orchestrator.json"
provenance_version: "1"
provenance_status: registered
provenance_owner: "vamsiramakrishnan@gmail.com"
provenance_created_at: "2026-07-04T06:18:19.765Z"
---

# Work Order Backlog Triage Orchestrator

> M-5304 • Maintenance & Reliability

## Overview

- **Persona:** Maintenance Supervisor
- **Department:** manufacturing
- **Objective:** Score every open maintenance_work_order in IBM Maximo against asset_registry_entries.criticality_ranking, failure_codes recurrence, age, and parts/crew feasibility each week so the Maintenance Supervisor cuts the Maintenance backlog from 11 crew-weeks to 4 crew-weeks and lifts Schedule compliance from 61% to 85% without the standing 3-hour Monday planning meeting.

## KPI summary

- **Maintenance backlog**: 11 crew-weeks → 4 crew-weeks
- **Schedule compliance**: 61% → 85%
- **Weekly planning meeting duration**: 3 hours → 45 minutes

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
