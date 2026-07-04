---
okf_version: "0.1"
type: Knowledge Bundle
title: Medical Bill Review Engine
description: "Cut medical bill review turnaround from 12 days to 1 day and lift duplicate/unbundled-charge catch rate from 62% to 96% by validating every CMS-1500/UB-04 line item in claims and claim_exposures against fee-schedule and coding rules before recommending pay, reduce, or deny."
tags:
  - insurance
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
provenance_origin: interview
provenance_source_ref: "apps/factory/catalog/interview-specs/medical-bill-review-engine.json"
provenance_version: "1"
provenance_status: registered
provenance_owner: "vamsiramakrishnan@gmail.com"
provenance_created_at: "2026-07-04T06:18:04.774Z"
---

# Medical Bill Review Engine

> I-3204 • Claims

## Overview

- **Persona:** Claims Adjuster
- **Department:** insurance
- **Objective:** Cut medical bill review turnaround from 12 days to 1 day and lift duplicate/unbundled-charge catch rate from 62% to 96% by validating every CMS-1500/UB-04 line item in claims and claim_exposures against fee-schedule and coding rules before recommending pay, reduce, or deny.

## KPI summary

- **Bill review turnaround**: 12 days → 1 day
- **Duplicate and unbundled charges caught**: 62% → 96%
- **Medical leakage rate**: 4.1% of medical spend → 1.3% of medical spend

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
