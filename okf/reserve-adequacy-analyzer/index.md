---
okf_version: "0.1"
type: Knowledge Bundle
title: Reserve Adequacy Analyzer
description: "Continuously reconcile claims, claim_exposures, and reserve_lines from Guidewire ClaimCenter into BigQuery loss triangles, score chain-ladder and Bornhuggter-Ferguson diagnostics against historical_metrics, and flag case-reserving pattern shifts so the Actuary compresses quarterly reserve review preparation time from 3 weeks to 4 days while narrowing the IBNR estimate range from plus-or-minus 12% to plus-or-minus 6%."
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
provenance_created_at: "2026-07-04T06:18:10.434Z"
---

# Reserve Adequacy Analyzer

> I-3502 • Actuarial & Portfolio Risk

## Overview

- **Persona:** Actuary
- **Department:** insurance
- **Objective:** Continuously reconcile claims, claim_exposures, and reserve_lines from Guidewire ClaimCenter into BigQuery loss triangles, score chain-ladder and Bornhuggter-Ferguson diagnostics against historical_metrics, and flag case-reserving pattern shifts so the Actuary compresses quarterly reserve review preparation time from 3 weeks to 4 days while narrowing the IBNR estimate range from plus-or-minus 12% to plus-or-minus 6%.

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
