---
type: Agent Tool
title: action_sap_s_4hana_fi_close
description: Execute the close step in SAP S/4HANA FI after the agent has gathered evidence and validated escalation gates.
tags:
  - finance
  - okf
  - brd
timestamp: "2026-06-20T00:25:58.081Z"
---

# action_sap_s_4hana_fi_close

Execute the close step in SAP S/4HANA FI after the agent has gathered evidence and validated escalation gates.

- **Kind:** action
- **Source system:** [SAP S/4HANA FI](/systems/sap-s-4hana-fi.md)

## Required inputs

- target_id
- rationale

## Produces

- action_id
- audit_record_id

## Evidence emitted

- api_response
- generated_audit_trail

# Examples

```
action_sap_s_4hana_fi_close(target_id=<target_id>, rationale=<rationale>)
```

## Used by

- [balance__document__pull](/workflow/balance-document-pull.md)
