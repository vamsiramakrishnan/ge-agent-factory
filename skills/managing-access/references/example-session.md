# Example session — a teammate gets 403 on the console URL

A worked interaction: diagnose the gate → pick the narrowest model → apply
one grant → verify as the intended caller → record it. The gcloud outputs
are authored (access changes are never exercised from a doc run) but match
the service shapes in `installer/terraform/ui_services.tf` and the checks in
`tools/lib/planes/`. Read this when a surface is "deployed but unreachable"
or someone asks for access.

## The ask

> Operator: "priya@acme.com joined ops today and gets 403 on the console —
> https://ge-agent-factory-console-8741xyz-uc.a.run.app. Fix her access.
> Approved for her, console only."

Constraints extracted: one named user, one named surface, explicit approval
→ an IAM grant is authorized (`guarding-the-factory`: outward-facing needs
sign-off — this ask is the sign-off, scoped to exactly this grant).

## Step 1 — diagnose the gate before changing anything

A 403 on a raw `*.run.app` URL is **normal** for an authenticated-only
service — confirm what fronts it before assuming breakage:

```console
$ gcloud run services describe ge-agent-factory-console --region us-central1 \
    --format='json(status.url, metadata.annotations)'
{
  "metadata": { "annotations": { "run.googleapis.com/ingress": "all" } },
  "status": { "url": "https://ge-agent-factory-console-8741xyz-uc.a.run.app" }
}
$ gcloud run services get-iam-policy ge-agent-factory-console --region us-central1 --format=json
{
  "bindings": [
    { "role": "roles/run.invoker",
      "members": ["group:factory-ops@acme.com",
                  "serviceAccount:iap-…@gcp-sa-iap.iam.gserviceaccount.com"] }
  ]
}
```

Reading: no `allUsers` binding (fails closed — correct), no
`iap-enabled: true` annotation on this deploy, invoker held by the ops
group. Priya isn't in `factory-ops@` yet → the service is behaving as
designed; the fix is one `run.invoker` grant (or group membership — prefer
the group if she'll hold it long-term; the direct grant here was what the
operator approved).

## Step 2 — apply the narrowest grant that satisfies the ask

```console
$ gcloud run services add-iam-policy-binding ge-agent-factory-console \
    --region us-central1 --member="user:priya@acme.com" --role="roles/run.invoker"
Updated IAM policy for service [ge-agent-factory-console].
bindings:
- members:
  - group:factory-ops@acme.com
  - user:priya@acme.com
  role: roles/run.invoker
```

Not chosen, deliberately: `--allow-unauthenticated` (exposes the operator
console publicly — never), IAP (this deploy isn't IAP-fronted; enabling it
is a posture change, not a user grant), Firebase (`GE_AUTH_MODE=firebase` is
for self-service end-user deploys, and it's server AND client env or it's
inert).

## Step 3 — verify as the intended caller, and as an unintended one

```console
$ TOKEN=$(gcloud auth print-identity-token --audiences=https://ge-agent-factory-console-8741xyz-uc.a.run.app)
$ curl -s -o /dev/null -w '%{http_code}\n' -H "Authorization: Bearer $TOKEN" \
    https://ge-agent-factory-console-8741xyz-uc.a.run.app/
200
$ curl -s -o /dev/null -w '%{http_code}\n' https://ge-agent-factory-console-8741xyz-uc.a.run.app/
403
```

Done means both lines: the intended audience gets in, anonymous callers
still get 403.

## Step 4 — report back

> Agent: "Priya can reach the console: granted `roles/run.invoker` on
> `ge-agent-factory-console` to `user:priya@acme.com` (this project only,
> per your approval). Verified 200 with an identity token, still 403
> anonymous. No posture change — no allUsers, no IAP/Firebase flips.
> Rollback: `remove-iam-policy-binding` with the same member/role. Consider
> adding her to `factory-ops@acme.com` instead if this should outlive her
> onboarding — say the word and I'll swap the grant."

Recorded with `assets/access-grant-record.md` (who/what/scope/approver/
rollback) so the grant is auditable later.

## Failure variant — grant made, still 403 (IAP-fronted deployment)

```console
$ curl -s -o /dev/null -w '%{http_code}\n' -H "Authorization: Bearer $TOKEN" \
    https://ge-agent-factory-console-8741xyz-uc.a.run.app/
403
$ gcloud run services describe ge-agent-factory-console --region us-central1 \
    --format='value(metadata.annotations[run.googleapis.com/iap-enabled])'
true
```

React: on an IAP-enabled service (`enable_iap = true` in
`ui_services.tf`), direct `run.invoker` on a user does nothing for browser
access — IAP's own service agent holds `run.invoker`, and **users** need
`roles/iap.httpsResourceAccessor`, granted via the terraform `iap_members`
variable. Fix in terraform (add the member to `iap_members`, apply), not
with ad-hoc gcloud IAM — terraform owns this config and would revert a
hand-edit on the next apply. And the raw `run.app` 403 stays normal: IAP
users enter through the IAP URL.
