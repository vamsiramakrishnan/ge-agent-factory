---
okf_version: "0.1"
type: Knowledge Bundle
title: Savings Realization Tracker
description: "ML classifies savings types with realization probability scoring based on historical conversion rates. LLM interprets why savings leaked — reads PO exception context: 'supplier couldn't deliver, switched to alternate at higher price' vs. 'requester bypassed contract.' so the CPO can move the Savings realization rate KPI."
tags:
  - procurement
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
provenance_origin: deck
provenance_source_ref: "../presentation/src/components/slides/use-cases/procurement/SavingsRealizationTracker.tsx"
provenance_version: "1"
provenance_status: registered
provenance_created_at: "2026-07-01T00:00:00.000Z"
---

# Savings Realization Tracker

> A-1902 • Spend Analytics

## Overview

- **Persona:** CPO
- **Department:** procurement
- **Objective:** ML classifies savings types with realization probability scoring based on historical conversion rates. LLM interprets why savings leaked — reads PO exception context: 'supplier couldn't deliver, switched to alternate at higher price' vs. 'requester bypassed contract.' so the CPO can move the Savings realization rate KPI.

## KPI summary

- **Savings realization rate**: 40-50% → 85%+
- **Leakage root cause coverage**: Ad-hoc investigation → 100% auto-analyzed
- **Report generation**: 3-5 days manual → Same-day automated

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
