---
type: Query Capability
title: "Parse communication request to understand announcement type (reorg, product l..."
description: "Parse communication request to understand announcement type (reorg, product launch, policy change), affected teams, and urgency. Pull organizational context from Salesforce and communication history."
source_id: "context-assembly"
generation_status: inferred
tags:
  - marketing
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Parse communication request to understand announcement type (reorg, product launch, policy change), affected teams, and urgency. Pull organizational context from Salesforce and communication history.

## Tools used

- [query_salesforce_accounts](/tools/query-salesforce-accounts.md)

## Runs in

- [context_assembly](/workflow/context-assembly.md)

## Evidence expected

- source_system_record

## Evals

- [Run the Internal Communications Drafter workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/internal-communications-drafter-end-to-end.md)

# Citations

- [Internal Communications Drafter Playbook](/documents/internal-communications-drafter-playbook.md)
