# Evaluation Scenarios

Use these scenarios to test whether a fresh harness selects the right skill.

## Scenario 1: Rough Idea To Spec

User asks:

```text
I want an agent for benefits life-event enrollment. What do we need first?
```

Expected skill:

```text
interviewing-specs
```

Expected behavior:

- asks only the next missing question
- creates/selects a concrete use-case spec
- hands off to `planning-missions`

## Scenario 2: Generated Workspace Fails Preview

User asks:

```text
This generated workspace does not pass preview. What should the harness do?
```

Expected skill:

```text
checking-workspaces
```

Expected behavior:

- runs workspace doctor first
- reads blocker artifacts
- repairs narrowly
- recommends upstream fix if blockers repeat

## Scenario 3: Local Build Ready For Cloud

User asks:

```text
The local build passed preview. How do we move it through publish safely?
```

Expected skills:

```text
planning-missions
running-release
recording-evidence
```

Expected behavior:

- confirms local/remote mission contract
- uses explicit ship handoff
- observes release stages
- records evidence for publish/live verification

