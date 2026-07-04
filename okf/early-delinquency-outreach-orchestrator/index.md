---
okf_version: "0.1"
type: Knowledge Bundle
title: Early Delinquency Outreach Orchestrator
description: "Cut the roll rate from 30 to 60 days past due from 28% toward the 16% target by nightly segmenting loan_applications by cure probability in BigQuery, suppressing tickets-flagged promise-to-pay accounts, and routing right-party-contact-optimized outreach to collectors, lifting right-party contact rate from 22% to 41%."
tags:
  - banking
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
provenance_origin: interview
provenance_source_ref: "apps/factory/catalog/interview-specs/early-delinquency-outreach-orchestrator.json"
provenance_version: "1"
provenance_status: registered
provenance_owner: "vamsiramakrishnan@gmail.com"
provenance_created_at: "2026-07-04T06:17:51.578Z"
---

# Early Delinquency Outreach Orchestrator

> B-2204 • Lending & Credit

## Overview

- **Persona:** Collections Supervisor
- **Department:** banking
- **Objective:** Cut the roll rate from 30 to 60 days past due from 28% toward the 16% target by nightly segmenting loan_applications by cure probability in BigQuery, suppressing tickets-flagged promise-to-pay accounts, and routing right-party-contact-optimized outreach to collectors, lifting right-party contact rate from 22% to 41%.

## KPI summary

- **Roll rate from 30 to 60 days past due**: 28% → 16%
- **Right-party contact rate**: 22% → 41%
- **Accounts worked per collector per day**: 45 → 120

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
