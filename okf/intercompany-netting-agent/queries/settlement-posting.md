---
type: Query Capability
title: Execute approved settlements through treasury management system. Post netting...
description: "Execute approved settlements through treasury management system. Post netting entries and withholding tax accruals in each entity's books."
source_id: "settlement-posting"
generation_status: inferred
tags:
  - finance
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Execute approved settlements through treasury management system. Post netting entries and withholding tax accruals in each entity's books.

## Tools used

- [query_sap_s_4hana_fi_gl_entries](/tools/query-sap-s-4hana-fi-gl-entries.md)
- [lookup_intercompany_netting_agent_controls_playbook](/tools/lookup-intercompany-netting-agent-controls-playbook.md)

## Runs in

- [settlement_posting](/workflow/settlement-posting.md)

## Evidence expected

- source_system_record
- document_reference

## Evals

- [Run the Intercompany Netting Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/intercompany-netting-agent-end-to-end.md)

# Citations

- [Intercompany Netting Agent Controls Playbook](/documents/intercompany-netting-agent-controls-playbook.md)
