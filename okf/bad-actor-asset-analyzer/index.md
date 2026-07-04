---
okf_version: "0.1"
type: Knowledge Bundle
title: Bad Actor Asset Analyzer
description: "Rank the top-10 bad-actor assets in IBM Maximo's asset_registry_entries by a combined repair-cost, downtime, and failure-frequency index built from maintenance_work_orders and OSIsoft PI System downtime_events, driving maintenance cost on those assets from $1.8M/yr toward $0.9M/yr and MTBF from 42 days toward 115 days."
tags:
  - manufacturing
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
provenance_origin: interview
provenance_source_ref: "apps/factory/catalog/interview-specs/bad-actor-asset-analyzer.json"
provenance_version: "1"
provenance_status: registered
provenance_owner: "vamsiramakrishnan@gmail.com"
provenance_created_at: "2026-07-04T06:18:20.223Z"
---

# Bad Actor Asset Analyzer

> M-5305 • Maintenance & Reliability

## Overview

- **Persona:** Reliability Engineer
- **Department:** manufacturing
- **Objective:** Rank the top-10 bad-actor assets in IBM Maximo's asset_registry_entries by a combined repair-cost, downtime, and failure-frequency index built from maintenance_work_orders and OSIsoft PI System downtime_events, driving maintenance cost on those assets from $1.8M/yr toward $0.9M/yr and MTBF from 42 days toward 115 days.

## KPI summary

- **Maintenance cost on top-10 bad actors**: $1.8M/yr → $0.9M/yr
- **MTBF on targeted assets**: 42 days → 115 days
- **Bad-actor study preparation time**: 2 weeks → 30 minutes

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
