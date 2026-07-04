---
okf_version: "0.1"
type: Knowledge Bundle
title: Changeover Time Optimization Agent
description: "Analyzes every changeover recorded in Opcenter MES weekly and benchmarks duration by crew, product family, and sequence. Recommends changeover-family-aware sequencing adjustments to the SAP S/4HANA PP planned order sequence. so the Production Supervisor can move the Average changeover time KPI."
tags:
  - manufacturing
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
provenance_origin: interview
provenance_source_ref: "apps/factory/catalog/interview-specs/changeover-time-optimization-agent.json"
provenance_version: "1"
provenance_status: registered
provenance_owner: "vamsiramakrishnan@gmail.com"
provenance_created_at: "2026-07-04T04:05:06.548Z"
---

# Changeover Time Optimization Agent

> M-5104 • Production & Shop Floor

## Overview

- **Persona:** Production Supervisor
- **Department:** manufacturing
- **Objective:** Analyzes every changeover recorded in Opcenter MES weekly and benchmarks duration by crew, product family, and sequence. Recommends changeover-family-aware sequencing adjustments to the SAP S/4HANA PP planned order sequence. so the Production Supervisor can move the Average changeover time KPI.

## KPI summary

- **Average changeover time**: 47 min → 28 min
- **Changeovers exceeding standard**: 35% → 9%
- **Weekly capacity recovered**: 0 hrs → 11 hrs

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
