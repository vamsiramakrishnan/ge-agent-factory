---
okf_version: "0.1"
type: Knowledge Bundle
title: Bad Actor Asset Analyzer
description: "Ranks assets on a combined index of repair cost, downtime contribution, and failure frequency from IBM Maximo and PI System data in BigQuery on request. Clusters each bad actor's work order text into dominant failure modes and summarizes the recurring mechanism. so the Reliability Engineer can move the Maintenance cost on top-10 bad actors KPI."
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
provenance_created_at: "2026-07-04T04:05:11.141Z"
---

# Bad Actor Asset Analyzer

> M-5305 • Maintenance & Reliability

## Overview

- **Persona:** Reliability Engineer
- **Department:** manufacturing
- **Objective:** Ranks assets on a combined index of repair cost, downtime contribution, and failure frequency from IBM Maximo and PI System data in BigQuery on request. Clusters each bad actor's work order text into dominant failure modes and summarizes the recurring mechanism. so the Reliability Engineer can move the Maintenance cost on top-10 bad actors KPI.

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
