---
okf_version: "0.1"
type: Knowledge Bundle
title: PM Schedule Optimization Engine
description: "Cross-references every PM task in IBM Maximo against failure history and runtime data from the PI System in BigQuery quarterly. Recommends interval extensions for zero-finding PMs and tightened or condition-based triggers for failure-prone assets, with the evidence attached. so the Maintenance Planner can move the PM labor hours with no findings KPI."
tags:
  - manufacturing
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
provenance_origin: interview
provenance_source_ref: "apps/factory/catalog/interview-specs/pm-schedule-optimization-engine.json"
provenance_version: "1"
provenance_status: registered
provenance_owner: "vamsiramakrishnan@gmail.com"
provenance_created_at: "2026-07-04T04:05:09.883Z"
---

# PM Schedule Optimization Engine

> M-5302 • Maintenance & Reliability

## Overview

- **Persona:** Maintenance Planner
- **Department:** manufacturing
- **Objective:** Cross-references every PM task in IBM Maximo against failure history and runtime data from the PI System in BigQuery quarterly. Recommends interval extensions for zero-finding PMs and tightened or condition-based triggers for failure-prone assets, with the evidence attached. so the Maintenance Planner can move the PM labor hours with no findings KPI.

## KPI summary

- **PM labor hours with no findings**: 44% → 18%
- **Failures occurring between PMs**: 9 per month → 3 per month
- **Wrench time**: 32% → 48%

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
