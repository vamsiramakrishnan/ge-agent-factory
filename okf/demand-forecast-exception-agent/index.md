---
okf_version: "0.1"
type: Knowledge Bundle
title: Demand Forecast Exception Agent
description: "Nightly, triage every item-location exception in demand_forecasts and forecast_overrides where wmape or bias_pct breaches tolerance, attach causal evidence from analytics_events and seasonal_profiles, and drive Forecast accuracy (WMAPE) from 68% to 86% while cutting planner override time from 60% to 15% of the week."
tags:
  - retail
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
provenance_origin: interview
provenance_source_ref: "apps/factory/catalog/interview-specs/demand-forecast-exception-agent.json"
provenance_version: "1"
provenance_status: registered
provenance_owner: "vamsiramakrishnan@gmail.com"
provenance_created_at: "2026-07-04T06:18:29.055Z"
---

# Demand Forecast Exception Agent

> R-1201 • Supply Chain & Fulfillment

## Overview

- **Persona:** Demand Planner
- **Department:** retail
- **Objective:** Nightly, triage every item-location exception in demand_forecasts and forecast_overrides where wmape or bias_pct breaches tolerance, attach causal evidence from analytics_events and seasonal_profiles, and drive Forecast accuracy (WMAPE) from 68% to 86% while cutting planner override time from 60% to 15% of the week.

## KPI summary

- **Forecast accuracy (WMAPE)**: 68% → 86%
- **Planner time on manual overrides**: 60% of week → 15% of week
- **Forecast exceptions resolved per day**: 40 → 300

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
