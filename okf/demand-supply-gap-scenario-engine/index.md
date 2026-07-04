---
okf_version: "0.1"
type: Knowledge Bundle
title: "Demand-Supply Gap Scenario Engine"
description: "Runs demand-shift, capacity-loss, and supplier-disruption scenarios through Kinaxis RapidResponse on request and lands results in BigQuery for comparison. Translates each gap into affected customers, SKUs, revenue, and margin rather than aggregate units. so the S&OP Manager can move the S&OP scenario turnaround KPI."
tags:
  - manufacturing
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
provenance_origin: interview
provenance_source_ref: "apps/factory/catalog/interview-specs/demand-supply-gap-scenario-engine.json"
provenance_version: "1"
provenance_status: registered
provenance_owner: "vamsiramakrishnan@gmail.com"
provenance_created_at: "2026-07-04T04:05:13.282Z"
---

# Demand-Supply Gap Scenario Engine

> M-5405 • Supply Chain & Materials

## Overview

- **Persona:** S&OP Manager
- **Department:** manufacturing
- **Objective:** Runs demand-shift, capacity-loss, and supplier-disruption scenarios through Kinaxis RapidResponse on request and lands results in BigQuery for comparison. Translates each gap into affected customers, SKUs, revenue, and margin rather than aggregate units. so the S&OP Manager can move the S&OP scenario turnaround KPI.

## KPI summary

- **S&OP scenario turnaround**: 4 days → 20 minutes
- **Forecast bias**: +9% → +2%
- **Revenue at risk identified pre-quarter**: $2M of $8M → $7M of $8M

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
