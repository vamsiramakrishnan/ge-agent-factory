---
type: Policy
title: Escalation policy 8
description: "When A circular_updates record with doi_filing_required true has a proposed_effective_date within 30 days and carrier_adoption_status is still under_actuarial_review; action: escalate_to_human; handoff: Chief Actuary and state filings manager"
source_id: "escalation-8"
tags:
  - insurance
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
source_kind: generationSpec
source_path: behaviorContract.escalationRules.7
generation_status: generated
ge_status: generated
---

# Escalation policy 8

- **Policy kind:** escalation
- **Spec source:** behaviorContract.escalationRules.7

## Rule

| Trigger | Action | Handoff | Rationale |
| --- | --- | --- | --- |
| A circular_updates record with doi_filing_required true has a proposed_effective_date within 30 days and carrier_adoption_status is still under_actuarial_review | escalate_to_human | Chief Actuary and state filings manager | An unresolved required DOI filing this close to the proposed effective date risks a compliance gap if adoption status is not finalized before the deadline. |

## Used by

- [Playbook](/playbook.md)

# Citations

- [Playbook](/playbook.md)
