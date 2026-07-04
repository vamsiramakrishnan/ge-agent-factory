---
type: Query Capability
title: "Duplicate detection via fuzzy matching on name, company, email domain. Field ..."
description: "Duplicate detection via fuzzy matching on name, company, email domain. Field completeness scoring per record. Data decay rate tracking. Record linkage scoring across CRM and MAP systems."
source_id: "fuzzy-matching-scoring"
generation_status: inferred
tags:
  - marketing
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Duplicate detection via fuzzy matching on name, company, email domain. Field completeness scoring per record. Data decay rate tracking. Record linkage scoring across CRM and MAP systems.

## Tools used

- [query_salesforce_crm_accounts](/tools/query-salesforce-crm-accounts.md)
- [lookup_data_quality_governance_agent_playbook](/tools/lookup-data-quality-governance-agent-playbook.md)

## Runs in

- [fuzzy_matching_scoring](/workflow/fuzzy-matching-scoring.md)

## Evidence expected

- source_system_record
- document_reference

## Evals

- [Run the Data Quality & Governance Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/data-quality-governance-agent-end-to-end.md)

# Citations

- [Data Quality & Governance Agent Playbook](/documents/data-quality-governance-agent-playbook.md)
