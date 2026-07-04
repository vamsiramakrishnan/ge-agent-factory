---
okf_version: "0.1"
type: Knowledge Bundle
title: Intraday Liquidity Forecasting Engine
description: "Forecast each currency's intraday cash position from Murex MX.3 trades, positions, and risk_measures settlement ladders reconciled against BigQuery historical_metrics seasonality, publish an hourly funding plan via action_murex_mx_3_publish, and hold the Intraday forecast error inside ±5% while cutting the excess liquidity buffer held from $900M to $550M."
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
provenance_created_at: "2026-07-04T06:17:58.853Z"
---

# Intraday Liquidity Forecasting Engine

> B-2601 • Treasury & Market Risk

## Overview

- **Persona:** Treasury Manager
- **Department:** banking
- **Objective:** Forecast each currency's intraday cash position from Murex MX.3 trades, positions, and risk_measures settlement ladders reconciled against BigQuery historical_metrics seasonality, publish an hourly funding plan via action_murex_mx_3_publish, and hold the Intraday forecast error inside ±5% while cutting the excess liquidity buffer held from $900M to $550M.

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
