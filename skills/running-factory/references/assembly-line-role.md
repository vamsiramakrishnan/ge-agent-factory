# Assembly-Line Role

This skill operates the conveyor for the early build cells.

## First Step

Find or create the factory plan.

## Role In The Line

- `plan`: create work items.
- `generate_workspace`: produce ADK workspace.
- `generate_data`: produce fixture and generated data.
- `package_data`: prepare data/tool packages.
- `harness_refine`: run review/refine through the harness when enabled.

## What Good Looks Like

The next station receives a workspace with code, tools, data, package artifacts, and any harness review/refine output needed for validation.

