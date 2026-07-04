---
okf_version: "0.1"
type: Knowledge Bundle
title: "Small Commercial Quote-Bind STP Engine"
description: "Evaluates small commercial quotes against underwriting guidelines and historical loss data in BigQuery to clear routine risks for automatic bind. Escalates only genuinely non-standard exposures to a human underwriter with a pre-built referral summary. so the Underwriting Manager can move the Straight-through processing rate KPI."
tags:
  - insurance
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
provenance_origin: interview
provenance_source_ref: "apps/factory/catalog/interview-specs/small-commercial-quote-bind-stp-engine.json"
provenance_version: "1"
provenance_status: registered
provenance_owner: "vamsiramakrishnan@gmail.com"
provenance_created_at: "2026-07-04T04:04:53.517Z"
---

# Small Commercial Quote-Bind STP Engine

> I-3103 • Distribution & Underwriting

## Overview

- **Persona:** Underwriting Manager
- **Department:** insurance
- **Objective:** Evaluates small commercial quotes against underwriting guidelines and historical loss data in BigQuery to clear routine risks for automatic bind. Escalates only genuinely non-standard exposures to a human underwriter with a pre-built referral summary. so the Underwriting Manager can move the Straight-through processing rate KPI.

## KPI summary

- **Straight-through processing rate**: 22% → 68%
- **Quote-to-bind conversion**: 31% → 44%
- **Cost per bound small commercial policy**: $310 → $95

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
