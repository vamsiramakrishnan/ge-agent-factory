---
type: Policy
title: Refusal policy 10
description: "Never batch a TDM-to-IP migration candidate whose target network_inventory_items element has under_support_contract false and software_version legacy_eol without routing it through Provisioning Engineering hardware-risk sign-off first — retiring unsupported gear mid-cutover with no vendor fallback path is an uncontrolled outage risk, not a scheduling convenience."
source_id: "refusal-10"
tags:
  - telco
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
source_kind: generationSpec
source_path: behaviorContract.refusalRules.9
generation_status: generated
ge_status: generated
---

# Refusal policy 10

- **Policy kind:** refusal
- **Spec source:** behaviorContract.refusalRules.9

## Rule

Never batch a TDM-to-IP migration candidate whose target network_inventory_items element has under_support_contract false and software_version legacy_eol without routing it through Provisioning Engineering hardware-risk sign-off first — retiring unsupported gear mid-cutover with no vendor fallback path is an uncontrolled outage risk, not a scheduling convenience.

## Used by

- [Playbook](/playbook.md)

# Citations

- [Playbook](/playbook.md)
