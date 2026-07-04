---
okf_version: "0.1"
type: Knowledge Bundle
title: Price Variance Analyzer
description: "Statistical process control on price trends detects drift and off-contract pricing weekly. LLM investigates variances by correlating with ECNs, spec changes, and contractual index formulas — 'Part X +15% is legitimate: ECN-2024-0342 added coating requirement.' so the Category Manager can move the Variance detection speed KPI."
tags:
  - procurement
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
provenance_origin: deck
provenance_source_ref: "../presentation/src/components/slides/use-cases/procurement/PriceVarianceAnalyzer.tsx"
provenance_version: "1"
provenance_status: registered
provenance_created_at: "2026-07-01T00:00:00.000Z"
---

# Price Variance Analyzer

> A-1907 • Spend Analytics

## Overview

- **Persona:** Category Manager
- **Department:** procurement
- **Objective:** Statistical process control on price trends detects drift and off-contract pricing weekly. LLM investigates variances by correlating with ECNs, spec changes, and contractual index formulas — 'Part X +15% is legitimate: ECN-2024-0342 added coating requirement.' so the Category Manager can move the Variance detection speed KPI.

## KPI summary

- **Variance detection speed**: Quarterly review → Weekly automated
- **False positive rate**: 60%+ flagged manually → <15% with context
- **Actionable variance recovery**: Rarely pursued → $2M+ annually

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
