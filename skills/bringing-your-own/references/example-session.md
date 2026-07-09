# Example session - review and apply a BYO manifest

This session shows the safe BYO loop: inspect the manifest, run the read-only
doctor, dry-run the apply plan, then apply only the actions classified as
safe.

## The ask

> Operator: "Bind Workday HR data for local previews and import our
> onboarding evalset. Do not deploy or call the live system yet."

Constraints extracted: local state changes are allowed; live reachability and
cloud deployment are out of scope.

## Step 1 - review the manifest shape

```console
$ sed -n '1,220p' ge.byo.yaml
```

Confirm the manifest names the intended systems, evalsets, and model providers.
If it references production URLs, classify the work with `guarding-the-factory`
before applying.

## Step 2 - run the read-only doctor

```console
$ bun tools/ge.mjs byo doctor --manifest ge.byo.yaml
```

The result classifies actions as appliable, planned-only, or invalid. Fix
invalid entries before moving on; planned-only entries should remain explicit
in the report rather than being silently skipped.

## Step 3 - dry-run, then apply

```console
$ bun tools/ge.mjs byo apply --manifest ge.byo.yaml --dry-run
$ bun tools/ge.mjs byo apply --manifest ge.byo.yaml
```

After apply, verify the observable state:

```console
$ bun tools/ge.mjs systems bindings
$ bun tools/ge.mjs evals coverage --id onboarding
$ bun tools/ge.mjs models doctor
```

## Failure variant - binding target mismatch

```console
$ bun tools/ge.mjs systems bind workday --to https://mcp.example --kind rest
✗ target kind rest does not match MCP-style endpoint
```

Reaction: correct the `--kind` or the target. Do not force the binding by
editing `.ge/systems/bindings.json` directly; the validator exists to keep the
line from talking to the wrong surface.

## Done

The intended bindings are listed, imported evalsets appear in coverage, model
readiness is known, and any planned-only items are reported back as remaining
work.
