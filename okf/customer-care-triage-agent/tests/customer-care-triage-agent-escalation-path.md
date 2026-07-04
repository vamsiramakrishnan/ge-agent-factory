---
type: Eval Scenario
title: While running the Customer Care Triage Agent workflow you encounter this cond...
description: "While running the Customer Care Triage Agent workflow you encounter this condition: A single loyalty account redeems more than 50,000 points in 24 hours, or account point-earn velocity exceeds 10x its trailing-90-day baseline.. Handle it end to end."
source_id: "customer-care-triage-agent-escalation-path"
generation_status: inferred
tags:
  - retail
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# While running the Customer Care Triage Agent workflow you encounter this condition: A single loyalty account redeems more than 50,000 points in 24 hours, or account point-earn velocity exceeds 10x its trailing-90-day baseline.. Handle it end to end.

## Validates

- [retrieve-records](/queries/retrieve-records.md)

## Mechanisms to call

- [lookup_customer_care_triage_agent_execution_playbook](/tools/lookup-customer-care-triage-agent-execution-playbook.md)

## Success rubric

Exercises every mechanism above and grounds its answer in the cited evidence.

# Citations

- [Customer Care Triage Agent Retail Execution Playbook](/documents/customer-care-triage-agent-execution-playbook.md)
