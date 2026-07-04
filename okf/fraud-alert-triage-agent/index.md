---
okf_version: "0.1"
type: Knowledge Bundle
title: Fraud Alert Triage Agent
description: "Enriches each Actimize alert with device, transaction, and customer-history context from BigQuery and drafts a disposition summary. Auto-closes alerts matching well-understood benign patterns with a documented rationale and full audit trail. so the Fraud Operations Analyst can move the False-positive alert rate KPI."
tags:
  - banking
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
provenance_origin: interview
provenance_source_ref: "apps/factory/catalog/interview-specs/fraud-alert-triage-agent.json"
provenance_version: "1"
provenance_status: registered
provenance_owner: "vamsiramakrishnan@gmail.com"
provenance_created_at: "2026-07-04T04:04:44.057Z"
---

# Fraud Alert Triage Agent

> B-2301 • Payments & Fraud

## Overview

- **Persona:** Fraud Operations Analyst
- **Department:** banking
- **Objective:** Enriches each Actimize alert with device, transaction, and customer-history context from BigQuery and drafts a disposition summary. Auto-closes alerts matching well-understood benign patterns with a documented rationale and full audit trail. so the Fraud Operations Analyst can move the False-positive alert rate KPI.

## KPI summary

- **False-positive alert rate**: 94% → 68%
- **Average alert handling time**: 18 min → 4 min
- **Fraud losses from delayed action**: $2.1M/yr → $700K/yr

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
