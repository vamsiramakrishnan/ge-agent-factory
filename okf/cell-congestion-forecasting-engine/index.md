---
okf_version: "0.1"
type: Knowledge Bundle
title: Cell Congestion Forecasting Engine
description: "Forecast per-sector PRB utilization and throughput demand from Ericsson Network Manager performance_counters trended against BigQuery historical_metrics and analytics_events, rank the augment backlog by subscriber-experience impact and revenue at risk, and drive cells above the 85% PRB utilization threshold from 11% down to 3% while pulling congested-cell detection lead time to 8 weeks ahead of customer complaints."
tags:
  - telco
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
provenance_origin: interview
provenance_source_ref: "apps/factory/catalog/interview-specs/cell-congestion-forecasting-engine.json"
provenance_version: "1"
provenance_status: registered
provenance_owner: "vamsiramakrishnan@gmail.com"
provenance_created_at: "2026-07-04T06:18:44.221Z"
---

# Cell Congestion Forecasting Engine

> T-4302 • Network Operations & Assurance

## Overview

- **Persona:** Capacity Planner
- **Department:** telco
- **Objective:** Forecast per-sector PRB utilization and throughput demand from Ericsson Network Manager performance_counters trended against BigQuery historical_metrics and analytics_events, rank the augment backlog by subscriber-experience impact and revenue at risk, and drive cells above the 85% PRB utilization threshold from 11% down to 3% while pulling congested-cell detection lead time to 8 weeks ahead of customer complaints.

## KPI summary

- **Congested-cell detection lead time**: after customer complaints → 8 weeks ahead
- **Capacity augment cycle time**: 9 months → 4 months
- **PRB utilization above 85% threshold**: 11% of cells → 3% of cells

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
