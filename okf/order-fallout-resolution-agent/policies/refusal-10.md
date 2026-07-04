---
type: Policy
title: Refusal policy 10
description: "Never re-run auto-remediation against the same target_ne_id past the runbook's retry ceiling (retry_count >= 3) — repeated automated retries against a network element already flagged with a data_mismatch or port_unavailable error_code risk congesting the NE control plane and constitute an uncoordinated network change outside the approved change window."
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

Never re-run auto-remediation against the same target_ne_id past the runbook's retry ceiling (retry_count >= 3) — repeated automated retries against a network element already flagged with a data_mismatch or port_unavailable error_code risk congesting the NE control plane and constitute an uncoordinated network change outside the approved change window.

## Used by

- [Playbook](/playbook.md)

# Citations

- [Playbook](/playbook.md)
