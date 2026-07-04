---
okf_version: "0.1"
type: Knowledge Bundle
title: "Unplanned Downtime Root-Cause Agent"
description: "Listens for downtime events from Opcenter MES and automatically pulls the surrounding sensor window from the PI historian into BigQuery. Correlates the event against historical failure signatures and drafts a ranked root-cause hypothesis with supporting trend charts. so the Plant Manager can move the Unplanned downtime hours per month KPI."
tags:
  - manufacturing
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
provenance_origin: interview
provenance_source_ref: "apps/factory/catalog/interview-specs/unplanned-downtime-root-cause-agent.json"
provenance_version: "1"
provenance_status: registered
provenance_owner: "vamsiramakrishnan@gmail.com"
provenance_created_at: "2026-07-04T04:05:05.262Z"
---

# Unplanned Downtime Root-Cause Agent

> M-5101 • Production & Shop Floor

## Overview

- **Persona:** Plant Manager
- **Department:** manufacturing
- **Objective:** Listens for downtime events from Opcenter MES and automatically pulls the surrounding sensor window from the PI historian into BigQuery. Correlates the event against historical failure signatures and drafts a ranked root-cause hypothesis with supporting trend charts. so the Plant Manager can move the Unplanned downtime hours per month KPI.

## KPI summary

- **Unplanned downtime hours per month**: 62 hrs → 38 hrs
- **Mean time to root cause**: 3.5 days → 4 hours
- **OEE**: 68% → 76%

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
