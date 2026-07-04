---
okf_version: "0.1"
type: Knowledge Bundle
title: Agency Production Performance Monitor
description: "Runs weekly production scans across the Duck Creek book in BigQuery and detects agencies with falling quote volume, hit ratio, or retention. Generates a briefing pack for each flagged agency with trend charts and recommended talking points before the distribution manager's visit. so the Agency Distribution Manager can move the Time to detect declining agency production KPI."
tags:
  - insurance
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
provenance_origin: interview
provenance_source_ref: "apps/factory/catalog/interview-specs/agency-production-performance-monitor.json"
provenance_version: "1"
provenance_status: registered
provenance_owner: "vamsiramakrishnan@gmail.com"
provenance_created_at: "2026-07-04T04:04:53.927Z"
---

# Agency Production Performance Monitor

> I-3104 • Distribution & Underwriting

## Overview

- **Persona:** Agency Distribution Manager
- **Department:** insurance
- **Objective:** Runs weekly production scans across the Duck Creek book in BigQuery and detects agencies with falling quote volume, hit ratio, or retention. Generates a briefing pack for each flagged agency with trend charts and recommended talking points before the distribution manager's visit. so the Agency Distribution Manager can move the Time to detect declining agency production KPI.

## KPI summary

- **Time to detect declining agency production**: 1 quarter → 1 week
- **Agency book growth in managed territories**: 2.1% YoY → 6.4% YoY
- **Distribution manager prep time per agency review**: 3 hours → 20 min

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
