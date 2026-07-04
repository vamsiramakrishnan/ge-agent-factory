---
okf_version: "0.1"
type: Knowledge Bundle
title: Production Schedule Adherence Monitor
description: "Runs every shift to compare SAP S/4HANA PP planned orders against actual MES confirmations landed in BigQuery. Flags orders trending late, quantifies the downstream capacity and customer impact, and recommends a re-sequencing option. so the Production Scheduler can move the Schedule adherence KPI."
tags:
  - manufacturing
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
provenance_origin: interview
provenance_source_ref: "apps/factory/catalog/interview-specs/production-schedule-adherence-monitor.json"
provenance_version: "1"
provenance_status: registered
provenance_owner: "vamsiramakrishnan@gmail.com"
provenance_created_at: "2026-07-04T04:05:05.686Z"
---

# Production Schedule Adherence Monitor

> M-5102 • Production & Shop Floor

## Overview

- **Persona:** Production Scheduler
- **Department:** manufacturing
- **Objective:** Runs every shift to compare SAP S/4HANA PP planned orders against actual MES confirmations landed in BigQuery. Flags orders trending late, quantifies the downstream capacity and customer impact, and recommends a re-sequencing option. so the Production Scheduler can move the Schedule adherence KPI.

## KPI summary

- **Schedule adherence**: 78% → 93%
- **Late order detection lead time**: 0 days (found at due date) → 3 days early
- **Expedite freight spend per quarter**: $410K → $180K

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
