---
okf_version: "0.1"
type: Knowledge Bundle
title: Material Shortage Early Warning Monitor
description: "Projects material coverage daily by netting Kinaxis RapidResponse supply plans against SAP S/4HANA MM inventory, open POs, and confirmed supplier dates in BigQuery. Ranks emerging shortages by production impact and identifies which specific orders and lines each one will stop. so the Supply Planner can move the Line stoppages from material shortages KPI."
tags:
  - manufacturing
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
provenance_origin: interview
provenance_source_ref: "apps/factory/catalog/interview-specs/material-shortage-early-warning-monitor.json"
provenance_version: "1"
provenance_status: registered
provenance_owner: "vamsiramakrishnan@gmail.com"
provenance_created_at: "2026-07-04T04:05:11.567Z"
---

# Material Shortage Early Warning Monitor

> M-5401 • Supply Chain & Materials

## Overview

- **Persona:** Supply Planner
- **Department:** manufacturing
- **Objective:** Projects material coverage daily by netting Kinaxis RapidResponse supply plans against SAP S/4HANA MM inventory, open POs, and confirmed supplier dates in BigQuery. Ranks emerging shortages by production impact and identifies which specific orders and lines each one will stop. so the Supply Planner can move the Line stoppages from material shortages KPI.

## KPI summary

- **Line stoppages from material shortages**: 7 per month → 1 per month
- **Shortage detection horizon**: 2 days → 15 days
- **Premium freight spend**: $95K/month → $30K/month

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
