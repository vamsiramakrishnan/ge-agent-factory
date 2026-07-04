---
type: Query Capability
title: "Scan consent records across OneTrust, HubSpot, and Salesforce. Validate cross..."
description: "Scan consent records across OneTrust, HubSpot, and Salesforce. Validate cross-system synchronization — an opt-out in one system must be reflected everywhere. Detect consent gaps and orphaned records."
source_id: "consent-inventory"
generation_status: inferred
tags:
  - marketing
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Scan consent records across OneTrust, HubSpot, and Salesforce. Validate cross-system synchronization — an opt-out in one system must be reflected everywhere. Detect consent gaps and orphaned records.

## Tools used

- [query_onetrust_onetrust_records](/tools/query-onetrust-onetrust-records.md)
- [query_hubspot_contacts](/tools/query-hubspot-contacts.md)
- [query_salesforce_crm_accounts](/tools/query-salesforce-crm-accounts.md)
- [lookup_marketing_compliance_consent_manager_playbook](/tools/lookup-marketing-compliance-consent-manager-playbook.md)
- [action_onetrust_sync](/tools/action-onetrust-sync.md)

## Runs in

- [consent_inventory](/workflow/consent-inventory.md)

## Evidence expected

- source_system_record
- document_reference
- api_response
- generated_audit_trail

## Evals

- [Run the Marketing Compliance & Consent Manager workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/marketing-compliance-consent-manager-end-to-end.md)

# Citations

- [Marketing Compliance & Consent Manager Playbook](/documents/marketing-compliance-consent-manager-playbook.md)
