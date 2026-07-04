---
okf_version: "0.1"
type: Knowledge Bundle
title: Branch Cash Position Forecast Engine
description: "Forecasts daily cash demand per branch and ATM from Temenos Transact transaction history, seasonality, and local payroll calendars. Generates optimized shipment and return orders for the armored-carrier schedule and publishes them to each branch every morning. so the Branch Operations Manager can move the Emergency cash shipments per month KPI."
tags:
  - banking
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
provenance_origin: interview
provenance_source_ref: "apps/factory/catalog/interview-specs/branch-cash-position-forecast-engine.json"
provenance_version: "1"
provenance_status: registered
provenance_owner: "vamsiramakrishnan@gmail.com"
provenance_created_at: "2026-07-04T04:04:41.548Z"
---

# Branch Cash Position Forecast Engine

> B-2105 • Retail Banking & Deposits

## Overview

- **Persona:** Branch Operations Manager
- **Department:** banking
- **Objective:** Forecasts daily cash demand per branch and ATM from Temenos Transact transaction history, seasonality, and local payroll calendars. Generates optimized shipment and return orders for the armored-carrier schedule and publishes them to each branch every morning. so the Branch Operations Manager can move the Emergency cash shipments per month KPI.

## KPI summary

- **Emergency cash shipments per month**: 45 → 8
- **Idle vault cash across network**: $18M → $7M
- **Forecast preparation time per branch**: 3 hrs/week → 10 min/week

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
