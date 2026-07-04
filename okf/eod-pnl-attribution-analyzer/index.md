---
okf_version: "0.1"
type: Knowledge Bundle
title: "End-of-Day P&L Attribution Analyzer"
description: "Decompose each desk's nightly P&L move in Murex MX.3 trades, positions, and risk_measures into market-factor, new-trade, and amendment components, match residual breaks against the historical break-pattern library in BigQuery, and drive unexplained P&L above threshold from 15 desks/day down to 2 desks/day while the attribution pack is signed off and published to Looker before the 10am T+1 deadline."
tags:
  - banking
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
provenance_origin: interview
provenance_source_ref: "apps/factory/catalog/interview-specs/eod-pnl-attribution-analyzer.json"
provenance_version: "1"
provenance_status: registered
provenance_owner: "vamsiramakrishnan@gmail.com"
provenance_created_at: "2026-07-04T06:17:59.707Z"
---

# End-of-Day P&L Attribution Analyzer

> B-2603 • Treasury & Market Risk

## Overview

- **Persona:** Product Control Analyst
- **Department:** banking
- **Objective:** Decompose each desk's nightly P&L move in Murex MX.3 trades, positions, and risk_measures into market-factor, new-trade, and amendment components, match residual breaks against the historical break-pattern library in BigQuery, and drive unexplained P&L above threshold from 15 desks/day down to 2 desks/day while the attribution pack is signed off and published to Looker before the 10am T+1 deadline.

## KPI summary

- **Unexplained P&L above threshold**: 15 desks/day → 2 desks/day
- **T+1 P&L sign-off completion by 10am**: 60% → 98%
- **Time to investigate a P&L break**: 3 hours → 25 minutes

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
