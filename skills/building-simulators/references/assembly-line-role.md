# Assembly-Line Role

Anchor: `apps/presentation/public/architecture/agent-factory-assembly-line.html`.

## Position

This skill sits before and alongside source-system/data-plane stations. It makes third-party systems concrete enough for generated agents to use.

The key idea is that enterprise agents need believable systems of record. A simulator pack gives the factory a working model of entities, tools, permissions, workflows, and state changes before a real SaaS integration exists.

## First Step

Choose the closest source-system archetype and write the decision record.

## Role In The Line

- Before `generate_data`: define schemas, objects, workflows, and seed expectations.
- During `package_data`: provide materialization and projection contracts.
- During `load_data`: supply realistic simulator-backed data behavior.
- During `register_tools`: ensure MCP tools map to simulator runtime handlers.
- During workspace gates: provide behavior evidence for tool and workflow tests.

## Handoff

- To Factory generation: simulator schema, workflows, tools, materialization.
- To Workspace Gate: available tools and expected behavior.
- To Evidence Ledger: simulator coverage and conformance findings.

## Next Step

Validate simulator pack conformance, run coverage, then generate or repair agent workspaces that consume the simulator.

## What Good Looks Like

A good simulator pack gives the generated agent:

- realistic collections and primary keys
- read tools and at least one meaningful state-changing workflow when appropriate
- approval blockers, role gates, and audit behavior
- materialization rules for generated data
- runtime handlers that match declared tools

If the simulator only returns static rows and cannot model workflow behavior, it is not yet strong enough for high-quality agent generation.
