---
okf_version: "0.1"
type: Knowledge Bundle
title: RAN Parameter Optimization Agent
description: "The agent analyzes per-cell performance counters and geolocated call traces to identify the worst-offending parameter sets weekly. It recommends specific tilt, power, and mobility parameter changes with predicted KPI impact, and stages them for engineer approval. so the RF Optimization Engineer can move the Drop call rate in optimized clusters KPI."
tags:
  - telco
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
provenance_origin: interview
provenance_source_ref: "apps/factory/catalog/interview-specs/ran-parameter-optimization-agent.json"
provenance_version: "1"
provenance_status: registered
provenance_owner: "vamsiramakrishnan@gmail.com"
provenance_created_at: "2026-07-04T04:05:36.865Z"
---

# RAN Parameter Optimization Agent

> T-4305 • Network Operations & Assurance

## Overview

- **Persona:** RF Optimization Engineer
- **Department:** telco
- **Objective:** The agent analyzes per-cell performance counters and geolocated call traces to identify the worst-offending parameter sets weekly. It recommends specific tilt, power, and mobility parameter changes with predicted KPI impact, and stages them for engineer approval. so the RF Optimization Engineer can move the Drop call rate in optimized clusters KPI.

## KPI summary

- **Drop call rate in optimized clusters**: 0.9% → 0.35%
- **Parameter change cycle time**: 3 weeks per cluster → 2 days per cluster
- **Handover failure rate**: 2.8% → 1.1%

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
