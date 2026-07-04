---
type: Query Capability
title: "Score compliance posture by regulation (GDPR, CCPA, CAN-SPAM), region, and da..."
description: "Score compliance posture by regulation (GDPR, CCPA, CAN-SPAM), region, and data category. Track consent coverage rates, opt-out sync latency, and deletion request fulfillment times."
source_id: "compliance-scoring"
generation_status: inferred
tags:
  - marketing
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Score compliance posture by regulation (GDPR, CCPA, CAN-SPAM), region, and data category. Track consent coverage rates, opt-out sync latency, and deletion request fulfillment times.

## Tools used

- [lookup_marketing_compliance_consent_manager_playbook](/tools/lookup-marketing-compliance-consent-manager-playbook.md)
- [action_onetrust_sync](/tools/action-onetrust-sync.md)

## Runs in

- [compliance_scoring](/workflow/compliance-scoring.md)

## Evidence expected

- document_reference
- api_response
- generated_audit_trail

## Evals

- [Run the Marketing Compliance & Consent Manager workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/marketing-compliance-consent-manager-end-to-end.md)

# Citations

- [Marketing Compliance & Consent Manager Playbook](/documents/marketing-compliance-consent-manager-playbook.md)
