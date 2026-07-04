---
okf_version: "0.1"
type: Knowledge Bundle
title: "On-Shelf Availability Monitor"
description: "Detects zero-sales anomalies against expected sell rates to infer empty shelves despite positive on-hand. Creates prioritized shelf-recovery and cycle-count tasks on store devices, sequenced by lost-sales value. so the Store Operations Director can move the On-shelf availability KPI."
tags:
  - retail
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
provenance_origin: interview
provenance_source_ref: "apps/factory/catalog/interview-specs/on-shelf-availability-monitor.json"
provenance_version: "1"
provenance_status: registered
provenance_owner: "vamsiramakrishnan@gmail.com"
provenance_created_at: "2026-07-04T04:05:22.942Z"
---

# On-Shelf Availability Monitor

> R-1303 • Store Operations

## Overview

- **Persona:** Store Operations Director
- **Department:** retail
- **Objective:** Detects zero-sales anomalies against expected sell rates to infer empty shelves despite positive on-hand. Creates prioritized shelf-recovery and cycle-count tasks on store devices, sequenced by lost-sales value. so the Store Operations Director can move the On-shelf availability KPI.

## KPI summary

- **On-shelf availability**: 91% → 97.5%
- **Phantom-inventory positions detected/week**: 0 (untracked) → 4,800
- **Recovered sales from OSA fixes**: $0 baseline → $2.6M/qtr

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
