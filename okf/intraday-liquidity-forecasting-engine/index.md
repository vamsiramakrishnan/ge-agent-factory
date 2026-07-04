---
okf_version: "0.1"
type: Knowledge Bundle
title: Intraday Liquidity Forecasting Engine
description: "Forecasts intraday cash positions per currency by combining Murex MX.3 settlement ladders, historical payment flows, and scheduled client activity. Publishes an hourly-updated funding plan to Looker with recommended money-market actions per currency. so the Treasury Manager can move the Intraday forecast error KPI."
tags:
  - banking
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
provenance_origin: interview
provenance_source_ref: "apps/factory/catalog/interview-specs/intraday-liquidity-forecasting-engine.json"
provenance_version: "1"
provenance_status: registered
provenance_owner: "vamsiramakrishnan@gmail.com"
provenance_created_at: "2026-07-04T04:04:50.562Z"
---

# Intraday Liquidity Forecasting Engine

> B-2601 • Treasury & Market Risk

## Overview

- **Persona:** Treasury Manager
- **Department:** banking
- **Objective:** Forecasts intraday cash positions per currency by combining Murex MX.3 settlement ladders, historical payment flows, and scheduled client activity. Publishes an hourly-updated funding plan to Looker with recommended money-market actions per currency. so the Treasury Manager can move the Intraday forecast error KPI.

## KPI summary

- **Intraday forecast error**: ±18% → ±5%
- **Excess liquidity buffer held**: $900M → $550M
- **Forecast production time each morning**: 2.5 hrs → 10 min

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
