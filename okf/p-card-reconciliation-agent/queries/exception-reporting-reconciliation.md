---
type: Query Capability
title: Generate reconciliation report with policy violations and suspicious patterns...
description: "Generate reconciliation report with policy violations and suspicious patterns flagged with context for manager review. Route compliant transactions for auto-posting."
source_id: "exception-reporting-reconciliation"
generation_status: inferred
tags:
  - procurement
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Generate reconciliation report with policy violations and suspicious patterns flagged with context for manager review. Route compliant transactions for auto-posting.

## Tools used

- [lookup_p_card_reconciliation_agent_policy_guide](/tools/lookup-p-card-reconciliation-agent-policy-guide.md)

## Runs in

- [exception_reporting_reconciliation](/workflow/exception-reporting-reconciliation.md)

## Evidence expected

- document_reference

## Evals

- [Run the P-Card Reconciliation Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/p-card-reconciliation-agent-end-to-end.md)

# Citations

- [P-Card Reconciliation Agent Procurement Policy Guide](/documents/p-card-reconciliation-agent-policy-guide.md)
