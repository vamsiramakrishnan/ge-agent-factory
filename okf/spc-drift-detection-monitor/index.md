---
okf_version: "0.1"
type: Knowledge Bundle
title: SPC Drift Detection Monitor
description: "Continuously score quality_checks measurements against control limits and BigQuery historical_metrics baselines per characteristic across inspection_lots and production_orders, distinguishing true drift from measurement noise so the Quality Engineer catches an out-of-control condition before defects ship, moving that capture rate from 55% to 94% while lifting first-pass yield from 91.2% to 96.5%."
tags:
  - manufacturing
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
provenance_origin: interview
provenance_source_ref: "apps/factory/catalog/interview-specs/spc-drift-detection-monitor.json"
provenance_version: "1"
provenance_status: registered
provenance_owner: "vamsiramakrishnan@gmail.com"
provenance_created_at: "2026-07-04T06:18:16.379Z"
---

# SPC Drift Detection Monitor

> M-5201 • Quality Management

## Overview

- **Persona:** Quality Engineer
- **Department:** manufacturing
- **Objective:** Continuously score quality_checks measurements against control limits and BigQuery historical_metrics baselines per characteristic across inspection_lots and production_orders, distinguishing true drift from measurement noise so the Quality Engineer catches an out-of-control condition before defects ship, moving that capture rate from 55% to 94% while lifting first-pass yield from 91.2% to 96.5%.

## KPI summary

- **First-pass yield**: 91.2% → 96.5%
- **Out-of-control conditions caught before defects ship**: 55% → 94%
- **Manual control chart reviews per week**: 120 → 8

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
