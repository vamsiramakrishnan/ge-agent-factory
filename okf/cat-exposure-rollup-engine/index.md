---
okf_version: "0.1"
type: Knowledge Bundle
title: Catastrophe Exposure Rollup Engine
description: "Aggregate the full in-force book daily against Verisk ISO ERC territory_factors and loss_cost_benchmarks in BigQuery so the Portfolio Manager can shrink the exposure rollup refresh cycle from quarterly to daily, hold PML estimate variance vs. modeled within ±5%, and catch any county or coastal band approaching its zone appetite limit before new business binds."
tags:
  - insurance
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
provenance_origin: interview
provenance_source_ref: "apps/factory/catalog/interview-specs/cat-exposure-rollup-engine.json"
provenance_version: "1"
provenance_status: registered
provenance_owner: "vamsiramakrishnan@gmail.com"
provenance_created_at: "2026-07-04T06:18:10.012Z"
---

# Catastrophe Exposure Rollup Engine

> I-3501 • Actuarial & Portfolio Risk

## Overview

- **Persona:** Portfolio Manager
- **Department:** insurance
- **Objective:** Aggregate the full in-force book daily against Verisk ISO ERC territory_factors and loss_cost_benchmarks in BigQuery so the Portfolio Manager can shrink the exposure rollup refresh cycle from quarterly to daily, hold PML estimate variance vs. modeled within ±5%, and catch any county or coastal band approaching its zone appetite limit before new business binds.

## KPI summary

- **Exposure rollup refresh cycle**: quarterly → daily
- **PML estimate variance vs. modeled**: ±18% → ±5%
- **Time to answer a reinsurer exposure query**: 2 weeks → same day

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
