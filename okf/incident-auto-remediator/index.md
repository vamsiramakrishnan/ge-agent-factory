---
okf_version: "0.1"
type: Knowledge Bundle
title: "Incident Auto-Remediator"
description: "Receive production alerts, correlate with deployment history and APM traces, rank root causes from historical patterns, recommend and execute remediation via Kubernetes API with SRE Manager approval, verify recovery, and update incident records."
tags:
  - it
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
provenance_origin: deck
provenance_source_ref: "../presentation/src/components/slides/use-cases/it/IncidentAutoRemediator.tsx"
provenance_version: "1"
provenance_status: registered
provenance_created_at: "2026-07-01T00:00:00.000Z"
---

# Incident Auto-Remediator

> A-4003 • Infra & Cloud Ops

## Overview

- **Persona:** SRE Manager
- **Department:** it
- **Objective:** Receive production alerts, correlate with deployment history and APM traces, rank root causes from historical patterns, recommend and execute remediation via Kubernetes API with SRE Manager approval, verify recovery, and update incident records.

## KPI summary

- **MTTR**: 45 minutes → <10 minutes
- **Auto-diagnosed incidents**: 0% → 70%
- **Incorrect remediation rate**: 15% → <3%

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
