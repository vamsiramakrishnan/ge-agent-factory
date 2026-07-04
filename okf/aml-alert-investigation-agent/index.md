---
okf_version: "0.1"
type: Knowledge Bundle
title: AML Alert Investigation Agent
description: "Assembles a complete investigation file for each Actimize alert, including transaction flows, counterparty graphs, and screening history from BigQuery. Drafts a structured case narrative summarizing activity patterns against the customer's expected profile. so the AML Investigator can move the Average investigation time per alert KPI."
tags:
  - banking
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
provenance_origin: interview
provenance_source_ref: "apps/factory/catalog/interview-specs/aml-alert-investigation-agent.json"
provenance_version: "1"
provenance_status: registered
provenance_owner: "vamsiramakrishnan@gmail.com"
provenance_created_at: "2026-07-04T04:04:46.692Z"
---

# AML Alert Investigation Agent

> B-2402 • KYC, AML & Compliance

## Overview

- **Persona:** AML Investigator
- **Department:** banking
- **Objective:** Assembles a complete investigation file for each Actimize alert, including transaction flows, counterparty graphs, and screening history from BigQuery. Drafts a structured case narrative summarizing activity patterns against the customer's expected profile. so the AML Investigator can move the Average investigation time per alert KPI.

## KPI summary

- **Average investigation time per alert**: 95 min → 25 min
- **Alert backlog age**: 45 days → 6 days
- **QA rework rate on case narratives**: 19% → 5%

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
