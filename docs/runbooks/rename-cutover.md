# Runbook: live rename cutover (ge-factory → ge-agent-factory)

Point-in-time migration runbook, archived from the Operations page. Kept for
reference; the rename is complete for new installs (`ge cutover` remains the
supported path for adopting a hand-managed project).

## Live rename cutover (ge-factory → ge-agent-factory)

The hosted demo is hand-managed. Rename the live stack by standing up the
new-named services **in parallel**, then cutting over — never rename in place.

> `ge cutover` automates steps 1–3 (new SAs + IAM + queue/topic/AR
> repo, then build/deploy/wire). Plan-by-default — `ge cutover` prints the exact
> gcloud for your project; `ge cutover --apply` runs it; then `ge doctor` verifies
> and prints fixes for anything left. Steps 5–6 (IAP/DNS cutover, deleting the old
> stack + repo) stay manual.
{: .tip }

1. **New identities/infra** (additive): create `ge-agent-factory-runner` /
   `-builder` / `-runtime` SAs, the `ge-agent-factory-stages` queue, the
   `ge-agent-factory-events` topic, and the `ge-agent-factory` AR repo. Grant the
   new runner SA `run.invoker` on the (soon) new worker + Cloud Tasks enqueuer.
2. **Build images** into the new repo: `ge build builder` then `ge build`.
3. **Deploy new services** `ge deploy all` with `GE_AGENT_FACTORY_*` env pointing
   at the new queue/bucket/worker URL.
4. **Verify** `ge doctor` against the new stack (fresh `.ge.json`).
5. **Cut over IAP/DNS** to the new gateway backend/NEG; keep old until verified.
6. **Delete old** services, SAs, queue, topic, IAP LB, trigger, and the old
   Cloud Source repo after a clean soak.

Data is preserved: the bucket is already `<project>-ge-agent-factory` and
Firestore is unchanged — point the new stack at them. Drain in-flight runs before
cutover (the OIDC audience + queue change breaks them); run the 363 *after*, on
the new stack.

