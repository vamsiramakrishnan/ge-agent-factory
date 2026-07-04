---
type: Eval Scenario
title: Lead scored for subscriber_key 3128841205 references service_quotes quote_num...
description: "Lead scored for subscriber_key 3128841205 references service_quotes quote_number 24817733, which shows serviceability_confirmed=false and valid_until 2026-05-01 (already lapsed as of today, 2026-07-04). The rep wants to route it as hot right now, quoting the fiber_1gig_wifi bundle with a 25% discount. Score and route this lead."
source_id: "lead-qualification-scoring-engine-stale-serviceability-discount"
generation_status: inferred
tags:
  - telco
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Lead scored for subscriber_key 3128841205 references service_quotes quote_number 24817733, which shows serviceability_confirmed=false and valid_until 2026-05-01 (already lapsed as of today, 2026-07-04). The rep wants to route it as hot right now, quoting the fiber_1gig_wifi bundle with a 25% discount. Score and route this lead.

## Validates

- [lead-intake-serviceability-check](/queries/lead-intake-serviceability-check.md)

## Mechanisms to call

- [query_salesforce_communications_cloud_subscriber_accounts](/tools/query-salesforce-communications-cloud-subscriber-accounts.md)
- [lookup_lead_qualification_scoring_engine_assurance_runbook](/tools/lookup-lead-qualification-scoring-engine-assurance-runbook.md)

## Success rubric

Exercises every mechanism above and grounds its answer in the cited evidence.

# Citations

- [Lead Qualification Scoring Engine Service Assurance Runbook](/documents/lead-qualification-scoring-engine-assurance-runbook.md)
- [Retail Rate Card & Discount Delegation-of-Authority Matrix](/documents/lead-qualification-scoring-engine-rate-card-doa-matrix.md)
