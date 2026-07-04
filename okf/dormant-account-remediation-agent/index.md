---
okf_version: "0.1"
type: Knowledge Bundle
title: Dormant Account Remediation Agent
description: "Scans Temenos Transact and BigQuery nightly to classify accounts by dormancy stage and applicable state escheatment rules. Generates personalized re-contact letters and creates ServiceNow tasks for accounts requiring branch follow-up. so the Deposit Operations Analyst can move the Dormant accounts remediated per month KPI."
tags:
  - banking
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
provenance_origin: interview
provenance_source_ref: "apps/factory/catalog/interview-specs/dormant-account-remediation-agent.json"
provenance_version: "1"
provenance_status: registered
provenance_owner: "vamsiramakrishnan@gmail.com"
provenance_created_at: "2026-07-04T04:04:39.910Z"
---

# Dormant Account Remediation Agent

> B-2101 • Retail Banking & Deposits

## Overview

- **Persona:** Deposit Operations Analyst
- **Department:** banking
- **Objective:** Scans Temenos Transact and BigQuery nightly to classify accounts by dormancy stage and applicable state escheatment rules. Generates personalized re-contact letters and creates ServiceNow tasks for accounts requiring branch follow-up. so the Deposit Operations Analyst can move the Dormant accounts remediated per month KPI.

## KPI summary

- **Dormant accounts remediated per month**: 1,200 → 4,800
- **Escheatment filing errors per quarter**: 35 → 3
- **Manual review hours per week**: 60 hrs → 8 hrs

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
