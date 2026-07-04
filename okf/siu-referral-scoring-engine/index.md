---
okf_version: "0.1"
type: Knowledge Bundle
title: SIU Referral Scoring Engine
description: "Rescored every open claim on each new document or transaction, combining FRISS indicators with text signals mined from ClaimCenter notes. Routes high-score claims to SIU with an evidence dossier summarizing the specific red flags and their sources. so the SIU Investigator can move the SIU referral precision (referrals confirmed) KPI."
tags:
  - insurance
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
provenance_origin: interview
provenance_source_ref: "apps/factory/catalog/interview-specs/siu-referral-scoring-engine.json"
provenance_version: "1"
provenance_status: registered
provenance_owner: "vamsiramakrishnan@gmail.com"
provenance_created_at: "2026-07-04T04:05:03.179Z"
---

# SIU Referral Scoring Engine

> I-3601 • Fraud, SIU & Compliance

## Overview

- **Persona:** SIU Investigator
- **Department:** insurance
- **Objective:** Rescored every open claim on each new document or transaction, combining FRISS indicators with text signals mined from ClaimCenter notes. Routes high-score claims to SIU with an evidence dossier summarizing the specific red flags and their sources. so the SIU Investigator can move the SIU referral precision (referrals confirmed) KPI.

## KPI summary

- **SIU referral precision (referrals confirmed)**: 24% → 61%
- **Fraud detected before payment**: 31% → 74%
- **Investigator hours per cleared referral**: 14 → 6

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
