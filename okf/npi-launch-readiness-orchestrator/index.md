---
okf_version: "0.1"
type: Knowledge Bundle
title: NPI Launch Readiness Orchestrator
description: "Continuously reconciles gate deliverables against actual state — released drawings and documents in PTC Windchill PLM, task completion in Jira, and tooling and qualification records in BigQuery. Predicts gate readiness from current burn-down trends and flags deliverables that will miss the date while there is still time to recover. so the NPI Program Manager can move the On-time production launches KPI."
tags:
  - manufacturing
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
provenance_origin: interview
provenance_source_ref: "apps/factory/catalog/interview-specs/npi-launch-readiness-orchestrator.json"
provenance_version: "1"
provenance_status: registered
provenance_owner: "vamsiramakrishnan@gmail.com"
provenance_created_at: "2026-07-04T04:05:14.537Z"
---

# NPI Launch Readiness Orchestrator

> M-5503 • Engineering & PLM

## Overview

- **Persona:** NPI Program Manager
- **Department:** manufacturing
- **Objective:** Continuously reconciles gate deliverables against actual state — released drawings and documents in PTC Windchill PLM, task completion in Jira, and tooling and qualification records in BigQuery. Predicts gate readiness from current burn-down trends and flags deliverables that will miss the date while there is still time to recover. so the NPI Program Manager can move the On-time production launches KPI.

## KPI summary

- **On-time production launches**: 58% → 88%
- **Readiness status compilation effort**: 2 days per gate → 0 (continuous)
- **Deliverables discovered missing at gate review**: 14 per launch → 2 per launch

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
