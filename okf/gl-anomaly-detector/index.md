---
okf_version: "0.1"
type: Knowledge Bundle
title: GL Anomaly Detector
description: "Continuous scanning of 100% of GL postings with Benford's Law and statistical anomaly detection. Gemini investigates flagged anomalies by reading transaction context before escalating. so the Controller / Internal Audit can move the Detection latency KPI."
tags:
  - finance
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
provenance_origin: deck
provenance_source_ref: "../presentation/src/components/slides/use-cases/finance/GLAnomalyDetector.tsx"
provenance_version: "1"
provenance_status: registered
provenance_created_at: "2026-07-01T00:00:00.000Z"
---

# GL Anomaly Detector

> A-2108 • GL & Close

## Overview

- **Persona:** Controller / Internal Audit
- **Department:** finance
- **Objective:** Continuous scanning of 100% of GL postings with Benford's Law and statistical anomaly detection. Gemini investigates flagged anomalies by reading transaction context before escalating. so the Controller / Internal Audit can move the Detection latency KPI.

## KPI summary

- **Detection latency**: Quarterly audit → Same-day
- **False positive rate**: N/A (no scanning) → < 10%
- **Anomalies investigated**: Sample-based → 100% of postings

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
