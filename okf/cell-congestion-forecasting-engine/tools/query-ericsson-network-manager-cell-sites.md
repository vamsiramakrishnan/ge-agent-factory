---
type: Agent Tool
title: query_ericsson_network_manager_cell_sites
description: Retrieve cell sites from Ericsson Network Manager for the Cell Congestion Forecasting Engine workflow.
tags:
  - telco
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
source_kind: generationSpec
source_path: behaviorContract.toolIntents
generation_status: generated
ge_status: generated
---

# query_ericsson_network_manager_cell_sites

Retrieve cell sites from Ericsson Network Manager for the Cell Congestion Forecasting Engine workflow.

- **Kind:** query
- **Source system:** [Ericsson Network Manager](/systems/ericsson-network-manager.md)

## Inputs

- site_id
- date_range

## Outputs

- cell_sites_records

## Side Effects

- No mutation is declared by the spec for this tool.

## Idempotency

No idempotency key declared; no mutation is declared by the spec for this tool.

## Confirmation

No write confirmation policy is derivable from the spec.

## Permissions

No explicit permission scopes declared; source-system access is tied to [Ericsson Network Manager](/systems/ericsson-network-manager.md).

## Failure Modes

No explicit failure modes are declared in the spec; rely on refusal/escalation policies for unsafe or incomplete evidence.

## Used By

_Not bound to a workflow stage._

## Evals

_No eval scenario explicitly exercises this tool._

## Evidence emitted

- sql_result

## Required inputs

- site_id
- date_range

## Produces

- cell_sites_records

# Examples

```
query_ericsson_network_manager_cell_sites(site_id=<site_id>, date_range=<date_range>)
```

# Citations

- [Ericsson Network Manager](/systems/ericsson-network-manager.md)
