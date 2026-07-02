---
title: Fleet & repair
parent: Console
nav_order: 3
layout: default
description: The Fleet roster, the Repair Queue, and the Agent detail view — operating many agents, and unblocking the ones that failed proof.
---

# Fleet & repair

Three surfaces for the many-agent day: **Fleet** (the roster), **Repair
Queue** (convergence), and **Agent detail** (one agent, deeply).

## Fleet — the roster

Every generated agent, filterable by department, status, and stage — filters
live in the URL hash, so a filtered view is shareable and reload-safe.
Select agents to run **bulk** build / ship / sync / repair / regenerate
actions. CLI equivalent: `ge fleet status`, plus `ge agents build --all` /
`ge agents ship` (all locally-built workspaces, or `--ids <a,b>`) for the
bulk actions.

<p align="center">
  <img src="../assets/screenshots/fleet.png" alt="Fleet view showing 364 total agents (362 missing, 1 ready, 1 blocked), an Agents by stage breakdown, a Top Bottlenecks card citing a real tools-generation failure, and the filterable agent roster table" width="820">
</p>

## Repair Queue — converge to a target

A targeted queue for driving agents to a goal stage (`preview`, `promote`,
`deploy:plan`, `publish:plan`) with optional auto-repair: pick a
department/status scope and a target, run it, and the queue tracks the
resulting repair runs as they observe blockers, fix what they can, and
retry. This is the console face of
[repairing a failed proof](../cookbooks/repair-failed-proof.html); the CLI
equivalent is `ge fleet repair --ids <a,b>`.

<p align="center">
  <img src="../assets/screenshots/repair-queue.png" alt="Repair Queue view with the full agent checklist on the left and, on the right, a blocked repair run detail table showing one agent's current blocker (a missing OpenAPI operation) and a Resume action" width="820">
</p>

## Agent detail — one agent end to end

The deep view for a single agent: its stage lifecycle, workspace doctor and
repair reports, artifacts (the
[proof pack](../concepts/agent-passport-and-proof-pack.html) contents), and
per-stage actions (build, ship, sync, regenerate, repair). A **triage band**
highlights what needs attention so you can act without scanning the whole
pipeline.

<p align="center">
  <img src="../assets/screenshots/agent-detail.png" alt="Agent detail view for a fully-built agent: stage badge, health/stage/workspace/owner stat cards, an eight-step pipeline-position checklist (Interview through Publish, all done or skipped), a Ship next-action card, and an artifacts list" width="820">
</p>

## See also

- [Repair a failed proof](../cookbooks/repair-failed-proof.html) — the guide.
- [Hand off to ADK / Gemini Enterprise](../cookbooks/handoff-adk-gemini-enterprise.html) — shipping from the Fleet view's bulk actions.
- [Readiness](./readiness.html) — the verdict to check before bulk operations.
