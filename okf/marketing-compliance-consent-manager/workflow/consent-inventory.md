---
type: Workflow Stage
title: Consent Inventory
description: "Scan consent records across OneTrust, HubSpot, and Salesforce. Validate cross-system synchronization — an opt-out in one system must be reflected everywhere. Detect consent gaps and orphaned records."
source_id: consent_inventory
tags:
  - marketing
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Consent Inventory

Scan consent records across OneTrust, HubSpot, and Salesforce. Validate cross-system synchronization — an opt-out in one system must be reflected everywhere. Detect consent gaps and orphaned records.

- **Mode:** sequential
- **Stage:** 1 of 4

## Tools

- [query_onetrust_onetrust_records](/tools/query-onetrust-onetrust-records.md)
- [query_hubspot_contacts](/tools/query-hubspot-contacts.md)
- [query_salesforce_crm_accounts](/tools/query-salesforce-crm-accounts.md)
- [lookup_marketing_compliance_consent_manager_playbook](/tools/lookup-marketing-compliance-consent-manager-playbook.md)
- [action_onetrust_sync](/tools/action-onetrust-sync.md)

Next: [Compliance Scoring](/workflow/compliance-scoring.md)
