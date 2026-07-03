# Control-plane deploy record — copy into the run record and fill in

- **Change**: <what merged, one line>            SHA/TAG: `_______`
- **Scope**: [ ] gateway  [ ] worker  [ ] console  [ ] MCP services
  (rebuild ONLY what changed)
- **Sign-off**: <who approved this outward-facing prod change> — required
  before building (guarding-the-factory)
- **Previous tag** (rollback target): `_______`
- **Build**: `gcloud builds submit . --config apps/<app>/cloudbuild.yaml
  --substitutions=_REGION=…,_AR_REPO=…,_SERVICE_NAME=…,_TAG=$TAG`
  — repo-root context, app-sibling config. STATUS: SUCCESS? [ ]
- **Bind via terraform** (never raw `gcloud run deploy` — drift):
  - gateway/worker: `bun tools/ge.mjs infra apply --gatewayImage … --workerImage …`
  - console: `terraform -chdir=installer/terraform apply -var-file=values.tfvars -var console_image=…`
  - Plan touched ONLY the approved service(s)? [ ]  (`0 to destroy`? [ ])
- **Verify Ready**: `gcloud run services describe <svc> --region <region>
  --format='value(status.latestReadyRevisionName,status.conditions[0].status)'` → `True`? [ ]
- **Reachability**: unchanged / handed to managing-access (service stays
  `--no-allow-unauthenticated`) [ ]
- **Rollback command written down**: re-apply with previous tag [ ]
