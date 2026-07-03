# Example session — ship a console fix to the central deployment

A worked interaction: scope the change → guard → build the one affected
image → bind it through terraform → verify Ready → hand off reachability.
All cloud outputs here are authored (this deploy surface is never exercised
from a doc run) but match `installer/build-and-deploy.sh`,
`apps/console/cloudbuild.yaml`, and the Cloud Run/terraform renderers. Read
this when you're about to rebuild or rebind a control-plane service and want
the exact command shapes and the verify step.

## The ask

> Operator: "The console job-list fix merged as `a1b2c3d`. Get the new
> console live on `acme-factory-prod` — approved. Don't touch the gateway or
> worker."

Constraints extracted: explicit sign-off for an outward-facing prod change
(satisfies `guarding-the-factory`); scope is ONE service (console); target
project named, matches the control-plane project (no cross-project).

## Step 1 — scope and guard

- Only `apps/console/**` changed → rebuild only the console image. Never
  rebuild all three apps for a one-app change.
- Rollback story before acting: a Cloud Run deploy is a new revision;
  rollback = re-apply terraform with the previous tag. Verdict:
  `proceed-with-rollback-noted` (previous tag recorded: `f9e8d7c`).

## Step 2 — build the console image via Cloud Build (repo-root context)

```console
$ TAG=a1b2c3d
$ gcloud builds submit . --project acme-factory-prod \
    --config apps/console/cloudbuild.yaml \
    --substitutions=_REGION=us-central1,_AR_REPO=ge-agent-factory,_SERVICE_NAME=ge-agent-factory-console,_TAG=$TAG
Creating temporary archive of 4132 file(s) totalling 48.3 MiB before compression.
Uploading tarball of [.] to [gs://acme-factory-prod_cloudbuild/source/…tgz]
…
Step #0: Successfully tagged us-central1-docker.pkg.dev/acme-factory-prod/ge-agent-factory/ge-agent-factory-console:a1b2c3d
PUSH
DONE
STATUS: SUCCESS
```

Decisions made here:

- Positional source is `.` (repo root), config is the app's sibling
  `cloudbuild.yaml`. `--tag` / `gcloud run deploy --source` cannot do this —
  they pin the context to one directory, and the console Dockerfile COPYs
  `packages/`, `tools/`, and the other apps' `package.json`s.
- `_AR_REPO` must be the terraform-created Artifact Registry repo (from
  `terraform output artifact_repository`), not a guess.

## Step 3 — bind through terraform, never raw `gcloud run deploy`

Terraform owns Cloud Run config (`installer/terraform/ui_services.tf`); a
raw `gcloud run` update would drift and be silently reverted on the next
apply. The console image is bound with the `console_image` var (gateway and
worker have `ge infra apply --gatewayImage/--workerImage`; the console
doesn't — mirror `build-and-deploy.sh`):

```console
$ terraform -chdir=installer/terraform apply -var-file=values.tfvars \
    -var console_image=us-central1-docker.pkg.dev/acme-factory-prod/ge-agent-factory/ge-agent-factory-console:a1b2c3d
…
Plan: 0 to add, 1 to change, 0 to destroy.
google_cloud_run_v2_service.console: Modifying…
google_cloud_run_v2_service.console: Modifications complete after 42s

Apply complete! Resources: 0 added, 1 changed, 0 destroyed.
```

One resource changed — exactly the scope approved. If the plan wants to
change anything else (gateway, IAM, LB), STOP and diff `values.tfvars`
before applying.

## Step 4 — verify the revision is Ready (a Ready revision proves runtime deps resolved)

```console
$ gcloud run services describe ge-agent-factory-console --project acme-factory-prod \
    --region us-central1 --format='value(status.latestReadyRevisionName,status.conditions[0].status)'
ge-agent-factory-console-00017-abc	True
```

## Step 5 — report back

> Agent: "Console `a1b2c3d` is live: image built via Cloud Build from the
> repo-root context, bound with `terraform apply -var console_image=…`
> (1 changed, nothing else), revision `…-00017-abc` Ready. Gateway/worker
> untouched. Rollback: re-apply with `console_image=…:f9e8d7c`. The service
> stays `--no-allow-unauthenticated`; if anyone new needs it, that's a
> `managing-access` grant, not a deploy setting."

## Failure variant — revision never goes Ready

```console
google_cloud_run_v2_service.console: Modifying…
Error: … Revision 'ge-agent-factory-console-00018-xyz' is not ready and cannot serve traffic.
The user-provided container failed to start and listen on the port defined provided by the PORT=8080 environment variable within the allocated timeout.
Logs URL: https://console.cloud.google.com/logs/viewer?project=acme-factory-prod…
```

React:

1. Traffic is still on the last Ready revision — nothing is down. Do not
   retry the apply blind.
2. Read the container startup logs. The two classic causes here (see Common
   mistakes in the skill): a server module that throws at import time
   (vite bundles server modules at build; runtime-env checks must defer to
   point of use), or a Dockerfile that predates a new workspace dep (missing
   `packages/`/`tools/` COPY → module-not-found at boot).
3. Fix in source, rebuild with a new TAG, re-apply. Never hot-patch the
   image or edit the service in the Cloud console.

Copy `assets/deploy-record.md` into the run record before starting — it's
the checklist this session followed (scope, sign-off, tags, verify,
rollback).
