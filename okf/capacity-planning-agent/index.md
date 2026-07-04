---
okf_version: "0.1"
type: Knowledge Bundle
title: Capacity Planning Agent
description: "Gemini correlates capacity needs with business events, providing 2+ weeks of lead time for pre-scaling. Time-series forecasting with seasonal decomposition replaces annual guess-based capacity planning. so the Cloud Architect / SRE Manager can move the Capacity forecasting KPI."
tags:
  - it
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
provenance_origin: deck
provenance_source_ref: "../presentation/src/components/slides/use-cases/it/CapacityPlanningAgent.tsx"
provenance_version: "1"
provenance_status: registered
provenance_created_at: "2026-07-01T00:00:00.000Z"
---

# Capacity Planning Agent

> A-4002 • Infra & Cloud Ops

## Overview

- **Persona:** Cloud Architect / SRE Manager
- **Department:** it
- **Objective:** Gemini correlates capacity needs with business events, providing 2+ weeks of lead time for pre-scaling. Time-series forecasting with seasonal decomposition replaces annual guess-based capacity planning. so the Cloud Architect / SRE Manager can move the Capacity forecasting KPI.

## KPI summary

- **Capacity forecasting**: Manual estimates → ML time-series
- **Pre-scaling lead time**: Reactive (during event) → 2+ weeks advance
- **Capacity-related outages**: 3-5/year → 0

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
