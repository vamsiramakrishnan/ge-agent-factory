---
okf_version: "0.1"
type: Knowledge Bundle
title: Component Obsolescence Risk Monitor
description: "Cross-references supplier end-of-life and lifecycle-risk signals against active PTC Windchill PLM BOM usage and remaining demand from SAP S/4HANA MM in BigQuery weekly. Quantifies exposure per affected product — remaining demand, current stock, and last-time-buy quantity required. so the Component Engineer can move the Line-down events from obsolete components KPI."
tags:
  - manufacturing
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
provenance_origin: interview
provenance_source_ref: "apps/factory/catalog/interview-specs/component-obsolescence-risk-monitor.json"
provenance_version: "1"
provenance_status: registered
provenance_owner: "vamsiramakrishnan@gmail.com"
provenance_created_at: "2026-07-04T04:05:15.371Z"
---

# Component Obsolescence Risk Monitor

> M-5505 • Engineering & PLM

## Overview

- **Persona:** Component Engineer
- **Department:** manufacturing
- **Objective:** Cross-references supplier end-of-life and lifecycle-risk signals against active PTC Windchill PLM BOM usage and remaining demand from SAP S/4HANA MM in BigQuery weekly. Quantifies exposure per affected product — remaining demand, current stock, and last-time-buy quantity required. so the Component Engineer can move the Line-down events from obsolete components KPI.

## KPI summary

- **Line-down events from obsolete components**: 4 per year → 0 per year
- **Last-time-buy decisions made proactively**: 30% → 92%
- **Redesign projects started reactively**: 9 per year → 2 per year

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
