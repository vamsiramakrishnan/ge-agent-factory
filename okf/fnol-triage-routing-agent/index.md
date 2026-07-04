---
okf_version: "0.1"
type: Knowledge Bundle
title: "FNOL Triage & Routing Agent"
description: "Reads every inbound FNOL, extracts loss facts, and scores severity and complexity at the moment of receipt. Routes each claim to the best-fit adjuster based on line, severity, licensing, jurisdiction, and current workload in ClaimCenter. so the Claims Intake Specialist can move the FNOL-to-assignment time KPI."
tags:
  - insurance
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
provenance_origin: interview
provenance_source_ref: "apps/factory/catalog/interview-specs/fnol-triage-routing-agent.json"
provenance_version: "1"
provenance_status: registered
provenance_owner: "vamsiramakrishnan@gmail.com"
provenance_created_at: "2026-07-04T04:04:54.769Z"
---

# FNOL Triage & Routing Agent

> I-3201 • Claims

## Overview

- **Persona:** Claims Intake Specialist
- **Department:** insurance
- **Objective:** Reads every inbound FNOL, extracts loss facts, and scores severity and complexity at the moment of receipt. Routes each claim to the best-fit adjuster based on line, severity, licensing, jurisdiction, and current workload in ClaimCenter. so the Claims Intake Specialist can move the FNOL-to-assignment time KPI.

## KPI summary

- **FNOL-to-assignment time**: 26 hours → 35 min
- **Misrouted claims requiring reassignment**: 18% → 4%
- **Same-day contact rate with claimant**: 42% → 89%

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
