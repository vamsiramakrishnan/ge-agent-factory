# Example session - observe a detached build

This session shows how to read a durable run after the starting terminal has
gone away: list runs, follow events, fetch the failed stage, and hand off to
triage only with first-failure detail.

## The ask

> Operator: "I kicked off a local detached build for `hr-onboarding-agent`.
> Tell me whether it finished and what failed if it did not."

Constraint extracted: observation only. Do not re-run the build until the
current run state is known.

## Step 1 - list runs

```console
$ bun tools/ge.mjs runs list
```

Pick the newest run matching the agent id and target stage. If the daemon is
stopped, start it before following events; durable run records remain on disk.

## Step 2 - follow the event stream

```console
$ bun tools/ge.mjs runs events run_20260709_101500 --follow
```

Stop when the run is terminal. A started stage is not a result; wait for
`done`, `blocked`, or `failed`.

## Step 3 - fetch the stage detail

```console
$ bun tools/ge.mjs agents logs run_20260709_101500 --stage validate
```

The stage result carries the errors and exit code that matter for triage. Use
that detail instead of interpreting the status tally as the root cause.

## Failure variant - run still in progress

```console
$ bun tools/ge.mjs agents status --watch
```

If stages are still moving, report that the run is in progress and keep
watching if asked. Do not submit another build just because the terminal that
started the first one is gone.

## Done

The run is classified as terminal healthy, terminal failed with first-failure
detail ready for `triaging-runs`, or still in progress with the last observed
stage and timestamp.
