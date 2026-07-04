---
okf_version: "0.1"
type: Knowledge Bundle
title: SAR Filing Preparation Agent
description: "Drafts the SAR narrative in FinCEN's expected structure directly from the escalated Actimize case file and transaction data. Pre-populates form fields from system-of-record data and validates them against FinCEN error rules before filing. so the AML Compliance Officer can move the SAR filing timeliness (within 30 days) KPI."
tags:
  - banking
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
provenance_origin: interview
provenance_source_ref: "apps/factory/catalog/interview-specs/sar-filing-preparation-agent.json"
provenance_version: "1"
provenance_status: registered
provenance_owner: "vamsiramakrishnan@gmail.com"
provenance_created_at: "2026-07-04T04:04:47.116Z"
---

# SAR Filing Preparation Agent

> B-2403 • KYC, AML & Compliance

## Overview

- **Persona:** AML Compliance Officer
- **Department:** banking
- **Objective:** Drafts the SAR narrative in FinCEN's expected structure directly from the escalated Actimize case file and transaction data. Pre-populates form fields from system-of-record data and validates them against FinCEN error rules before filing. so the AML Compliance Officer can move the SAR filing timeliness (within 30 days) KPI.

## KPI summary

- **SAR filing timeliness (within 30 days)**: 82% → 99.5%
- **Time to draft SAR narrative**: 6 hours → 40 minutes
- **FinCEN rejection/correction rate**: 6% → 0.8%

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
