---
okf_version: "0.1"
type: Knowledge Bundle
title: Demand Pattern Analyzer
description: "Time-series decomposition with Holt-Winters/Prophet isolates trend, seasonality, and cyclical demand patterns. LLM cross-references demand anomalies with business context: 'Category X spiked 200% in March — ERP migration project, one-time event, do not adjust baseline.' so the Category Manager can move the Forecast accuracy KPI."
tags:
  - procurement
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
provenance_origin: deck
provenance_source_ref: "../presentation/src/components/slides/use-cases/procurement/DemandPatternAnalyzer.tsx"
provenance_version: "1"
provenance_status: registered
provenance_created_at: "2026-07-01T00:00:00.000Z"
---

# Demand Pattern Analyzer

> A-1908 • Spend Analytics

## Overview

- **Persona:** Category Manager
- **Department:** procurement
- **Objective:** Time-series decomposition with Holt-Winters/Prophet isolates trend, seasonality, and cyclical demand patterns. LLM cross-references demand anomalies with business context: 'Category X spiked 200% in March — ERP migration project, one-time event, do not adjust baseline.' so the Category Manager can move the Forecast accuracy KPI.

## KPI summary

- **Forecast accuracy**: Trend extrapolation → Context-adjusted projection
- **Anomaly explanation rate**: Manual investigation → 90%+ auto-explained
- **Demand signal lead time**: Reactive → 1-2 quarters forward

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
