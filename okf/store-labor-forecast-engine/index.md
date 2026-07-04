---
okf_version: "0.1"
type: Knowledge Bundle
title: Store Labor Forecast Engine
description: "Lift schedule-to-demand fit from 71% to 91% and cut last-minute schedule edits from 23 to 6 per store per week by forecasting 15-minute interval workload from Oracle Xstore POS pos_transactions and BigQuery historical baselines, then publishing UKG Dimensions shift_schedules that satisfy labor_forecasts minimum_coverage_hours without breaching timecards-derived overtime or fair-workweek constraints."
tags:
  - retail
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
provenance_origin: interview
provenance_source_ref: "apps/factory/catalog/interview-specs/store-labor-forecast-engine.json"
provenance_version: "1"
provenance_status: registered
provenance_owner: "vamsiramakrishnan@gmail.com"
provenance_created_at: "2026-07-04T06:18:31.558Z"
---

# Store Labor Forecast Engine

> R-1302 • Store Operations

## Overview

- **Persona:** Store Workforce Planner
- **Department:** retail
- **Objective:** Lift schedule-to-demand fit from 71% to 91% and cut last-minute schedule edits from 23 to 6 per store per week by forecasting 15-minute interval workload from Oracle Xstore POS pos_transactions and BigQuery historical baselines, then publishing UKG Dimensions shift_schedules that satisfy labor_forecasts minimum_coverage_hours without breaching timecards-derived overtime or fair-workweek constraints.

## KPI summary

- **Schedule-to-demand fit**: 71% → 91%
- **Last-minute schedule edits per store/week**: 23 → 6
- **Sales per labor hour**: $168 → $194

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
