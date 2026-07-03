---
type: Agent Tool
title: query_<system>_<entity>
description: <one line: what it fetches/does and why the agent needs it>
tags:
  - <department>
  - okf
  - brd
---

# query_<system>_<entity>

<Same one-line description — the body opens with it.>

- **Kind:** query
- **Source system:** [<System Name>](/systems/<system-slug>.md)

## Required inputs

- <input_field>

## Produces

- <output_field>

## Evidence emitted

- source_system_record

# Examples

```
query_<system>_<entity>(<input_field>=<value>)
```

## Used by

- [<workflow_step_id>](/workflow/<workflow-step-slug>.md)

<!--
Copyable starting point for a hand-authored OKF concept (here: an Agent Tool,
the concept type BRD authors add most often). Rules that make it conformant
and round-trippable:
- frontmatter `type` is required and non-empty on every non-index concept;
  only the bundle root index.md declares `okf_version: "0.1"`.
- links are bundle-absolute markdown links (/systems/... , /workflow/...) —
  they ARE the relationship graph the reverse converter reads.
- keep the conventional headings (# Examples, and for entities # Schema,
  # Citations) — consumers tolerate unknown ones, but the converter keys on
  these.
- the H1/title is the stable identity (tool name); slugs in file paths are
  filesystem-safe and lossy by design.
-->
