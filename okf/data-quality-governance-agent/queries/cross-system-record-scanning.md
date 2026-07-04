---
type: Query Capability
title: "Scan Salesforce CRM and HubSpot records for data quality issues — duplicates,..."
description: "Scan Salesforce CRM and HubSpot records for data quality issues — duplicates, missing required fields, invalid email formats, stale records. Track field completeness and data decay rates."
source_id: "cross-system-record-scanning"
generation_status: inferred
tags:
  - marketing
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Scan Salesforce CRM and HubSpot records for data quality issues — duplicates, missing required fields, invalid email formats, stale records. Track field completeness and data decay rates.

## Tools used

- [query_salesforce_crm_accounts](/tools/query-salesforce-crm-accounts.md)
- [query_hubspot_contacts](/tools/query-hubspot-contacts.md)
- [lookup_data_quality_governance_agent_playbook](/tools/lookup-data-quality-governance-agent-playbook.md)

## Runs in

- [cross_system_record_scanning](/workflow/cross-system-record-scanning.md)

## Evidence expected

- source_system_record
- document_reference

## Evals

- [Run the Data Quality & Governance Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/data-quality-governance-agent-end-to-end.md)

# Citations

- [Data Quality & Governance Agent Playbook](/documents/data-quality-governance-agent-playbook.md)
