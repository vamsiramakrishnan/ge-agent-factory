# Blocker Taxonomy

Use stable blocker ids so repeated defects can be rolled up by the Evidence Ledger.

## Prefixes

- `contract:*`: workspace contract or required file issue.
- `validation:*`: validation or test failure.
- `spec-code:*`: missing coverage from spec to code/tool/eval.
- `preview:*`: preview runtime or report issue.
- `promotion:*`: promotion packet readiness issue.
- `deploy:*`: deploy plan/topology issue.
- `publish:*`: publish plan/registration issue.
- `doctor:*`: doctor command/runtime issue.
- `repair:*`: repair command/runtime issue.
- `console:*`: console/local/remote operation mismatch.

## Repair Task Shape

```json
{
  "id": "spec-code:missing-tool",
  "command": "patch generated workspace tool implementation",
  "reason": "Required spec operation has no code path",
  "owner": "workspace|generator|data|factory|console"
}
```

## Upstream Rule

Three or more workspaces with the same blocker id and similar message means the owner is probably not the individual workspace. Recommend an upstream fix.

