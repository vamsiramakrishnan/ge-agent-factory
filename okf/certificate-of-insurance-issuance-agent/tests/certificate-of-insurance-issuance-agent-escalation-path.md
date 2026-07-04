---
type: Eval Scenario
title: While running the Certificate of Insurance Issuance Agent workflow you encoun...
description: "While running the Certificate of Insurance Issuance Agent workflow you encounter this condition: Requested endorsement produces a mid-term premium change greater than 25% of annual premium or adds a new exposure class. Handle it end to end."
source_id: "certificate-of-insurance-issuance-agent-escalation-path"
generation_status: inferred
tags:
  - insurance
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# While running the Certificate of Insurance Issuance Agent workflow you encounter this condition: Requested endorsement produces a mid-term premium change greater than 25% of annual premium or adds a new exposure class. Handle it end to end.

## Validates

- [holder-request-intake-policy-match](/queries/holder-request-intake-policy-match.md)

## Mechanisms to call

- [lookup_certificate_of_insurance_issuance_agent_authority_guide](/tools/lookup-certificate-of-insurance-issuance-agent-authority-guide.md)

## Success rubric

Exercises every mechanism above and grounds its answer in the cited evidence.

# Citations

- [Certificate of Insurance Issuance Agent Authority & Referral Guide](/documents/certificate-of-insurance-issuance-agent-authority-guide.md)
