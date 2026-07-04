---
okf_version: "0.1"
type: Knowledge Bundle
title: Reserve Adequacy Analyzer
description: "Builds clean, reconciled loss triangles from ClaimCenter transactional data in BigQuery continuously rather than quarterly. Runs multiple development methods per segment, detects diagnostics drifting outside expected ranges, and flags case-reserving pattern shifts. so the Actuary can move the Quarterly reserve review preparation time KPI."
tags:
  - insurance
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
provenance_origin: interview
provenance_source_ref: "apps/factory/catalog/interview-specs/reserve-adequacy-analyzer.json"
provenance_version: "1"
provenance_status: registered
provenance_owner: "vamsiramakrishnan@gmail.com"
provenance_created_at: "2026-07-04T04:05:01.516Z"
---

# Reserve Adequacy Analyzer

> I-3502 • Actuarial & Portfolio Risk

## Overview

- **Persona:** Actuary
- **Department:** insurance
- **Objective:** Builds clean, reconciled loss triangles from ClaimCenter transactional data in BigQuery continuously rather than quarterly. Runs multiple development methods per segment, detects diagnostics drifting outside expected ranges, and flags case-reserving pattern shifts. so the Actuary can move the Quarterly reserve review preparation time KPI.

## KPI summary

- **Quarterly reserve review preparation time**: 3 weeks → 4 days
- **Segments with material adverse development**: detected 2 quarters late → detected within 1 month
- **IBNR estimate range width**: ±12% → ±6%

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
