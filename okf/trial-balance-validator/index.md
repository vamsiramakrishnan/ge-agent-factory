---
okf_version: "0.1"
type: Knowledge Bundle
title: Trial Balance Validator
description: "Automated cross-validation against all sub-ledgers with immediate out-of-balance detection. Statistical anomaly detection catches unusual balances that manual scanning misses. so the Controller can move the TB validation time KPI."
tags:
  - finance
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
provenance_origin: deck
provenance_source_ref: "../presentation/src/components/slides/use-cases/finance/TrialBalanceValidator.tsx"
provenance_version: "1"
provenance_status: registered
provenance_created_at: "2026-07-01T00:00:00.000Z"
---

# Trial Balance Validator

> A-2106 • GL & Close

## Overview

- **Persona:** Controller
- **Department:** finance
- **Objective:** Automated cross-validation against all sub-ledgers with immediate out-of-balance detection. Statistical anomaly detection catches unusual balances that manual scanning misses. so the Controller can move the TB validation time KPI.

## KPI summary

- **TB validation time**: 1 day manual → 30 minutes
- **Anomalies caught pre-close**: 50% → 98%
- **Sub-ledger reconciliation breaks**: Discovered at close → Flagged pre-close

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
