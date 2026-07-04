---
okf_version: "0.1"
type: Knowledge Bundle
title: Energy Intensity Monitoring Engine
description: "Cut energy intensity from 14.2 to 11.6 kWh per unit produced by reconciling OSIsoft PI System sensor_readings against BigQuery production baselines daily, collapsing anomaly detection lag from 30 days at the utility bill to 1 day so idle-hour and equipment waste is caught and remediated before it compounds across a billing cycle."
tags:
  - manufacturing
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
provenance_origin: interview
provenance_source_ref: "apps/factory/catalog/interview-specs/energy-intensity-monitoring-engine.json"
provenance_version: "1"
provenance_status: registered
provenance_owner: "vamsiramakrishnan@gmail.com"
provenance_created_at: "2026-07-04T06:18:25.630Z"
---

# Energy Intensity Monitoring Engine

> M-5603 • EHS & Sustainability

## Overview

- **Persona:** Sustainability Lead
- **Department:** manufacturing
- **Objective:** Cut energy intensity from 14.2 to 11.6 kWh per unit produced by reconciling OSIsoft PI System sensor_readings against BigQuery production baselines daily, collapsing anomaly detection lag from 30 days at the utility bill to 1 day so idle-hour and equipment waste is caught and remediated before it compounds across a billing cycle.

## KPI summary

- **Energy intensity (kWh per unit produced)**: 14.2 → 11.6
- **Energy anomaly detection lag**: 30 days (at the bill) → 1 day
- **Annual energy spend**: $5.8M → $4.9M

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
