---
okf_version: "0.1"
type: Knowledge Bundle
title: "MRO & Facilities Optimization"
description: "Time-series demand forecasting on MRO consumables (filters, bearings, lubricants, safety gloves) with automated min/max optimization based on lead time variability. LLM interprets consumption anomalies against maintenance work orders: 'Bearing consumption at Plant C up 300% this month — plant is doing a scheduled turnaround, expected and temporary, not a trend change.' so the Indirect Procurement Lead can move the MRO stockout rate KPI."
tags:
  - procurement
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
provenance_origin: deck
provenance_source_ref: "../presentation/src/components/slides/use-cases/procurement/MROFacilitiesOptimization.tsx"
provenance_version: "1"
provenance_status: registered
provenance_created_at: "2026-07-01T00:00:00.000Z"
---

# MRO & Facilities Optimization

> A-1804 • Indirect & Tail Spend

## Overview

- **Persona:** Indirect Procurement Lead
- **Department:** procurement
- **Objective:** Time-series demand forecasting on MRO consumables (filters, bearings, lubricants, safety gloves) with automated min/max optimization based on lead time variability. LLM interprets consumption anomalies against maintenance work orders: 'Bearing consumption at Plant C up 300% this month — plant is doing a scheduled turnaround, expected and temporary, not a trend change.' so the Indirect Procurement Lead can move the MRO stockout rate KPI.

## KPI summary

- **MRO stockout rate**: 8-12% → <2%
- **Excess inventory**: $2.4M carrying cost → $900K (62% reduction)
- **Emergency orders**: 15% of MRO spend → <3%

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
