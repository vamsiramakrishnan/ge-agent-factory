---
okf_version: "0.1"
type: Knowledge Bundle
title: Loan Covenant Monitoring Agent
description: "Extracts covenant terms from executed loan agreements in nCino and builds a per-facility testing calendar automatically. Computes leverage, coverage, and liquidity ratios from incoming borrower financials and records pass/fail results in BigQuery. so the Credit Risk Officer can move the Covenant tests completed on time KPI."
tags:
  - banking
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
provenance_origin: interview
provenance_source_ref: "apps/factory/catalog/interview-specs/loan-covenant-monitoring-agent.json"
provenance_version: "1"
provenance_status: registered
provenance_owner: "vamsiramakrishnan@gmail.com"
provenance_created_at: "2026-07-04T04:04:41.964Z"
---

# Loan Covenant Monitoring Agent

> B-2201 • Lending & Credit

## Overview

- **Persona:** Credit Risk Officer
- **Department:** banking
- **Objective:** Extracts covenant terms from executed loan agreements in nCino and builds a per-facility testing calendar automatically. Computes leverage, coverage, and liquidity ratios from incoming borrower financials and records pass/fail results in BigQuery. so the Credit Risk Officer can move the Covenant tests completed on time KPI.

## KPI summary

- **Covenant tests completed on time**: 71% → 99%
- **Days from financials received to covenant result**: 18 days → 1 day
- **Undetected covenant breaches per year**: 9 → 0

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
