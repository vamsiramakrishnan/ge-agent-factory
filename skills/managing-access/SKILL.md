---
name: managing-access
description: Manages who can reach the factory's surfaces — Cloud Run IAM run.invoker, IAP, and the opt-in Firebase (Google) sign-in on the console and deck — and keeps deploys single-tenant. Use when a service returns 403/is locked, when granting access, when choosing IAP vs Firebase vs run.invoker, or when enforcing no-cross-project / readonly posture.
---

# Managing Access

Use this skill to decide and apply how a factory surface is authenticated, and to fix "deployed but unreachable" (403) services.

In plain language: the central deployment is fronted by IAP; the console is authenticated-only (`run.invoker`); self-service deploys can opt into Firebase Google sign-in. Pick the model that fits the deployment, and never widen access without `guarding-the-factory` sign-off.

## Assembly-Line Slot

- **First step:** identify the surface (gateway/console) and its current gate (IAP LB? `--no-allow-unauthenticated`? Firebase?).
- **Plays a role in:** post-deploy reachability and the auth posture of every UI surface.
- **Input:** a service + the intended audience (internal org via IAP, or self-service end-users via Firebase).
- **Output:** a working, correctly-scoped access path (or a documented grant for a human to approve).
- **Next step:** the surface is reachable by the intended audience and no one else.

## Choosing the model

| Situation | Use |
|---|---|
| Central/internal deployment, org-wide | IAP load balancer (terraform `ui_services.tf`) |
| Just need a specific user/SA to reach a Cloud Run service | grant `roles/run.invoker` |
| Self-service deploy, end-user Google sign-in | opt-in **Firebase** (`*_AUTH_MODE=firebase` + `VITE_FIREBASE_*`); default-off so it can't break the IAP install |

## Workflow

1. Diagnose: a 403 on the raw `*.run.app` URL is **normal** when the service is fronted by IAP or `--no-allow-unauthenticated` — confirm via the IAP LB / an identity token before assuming breakage.
2. Before widening access (grant, allow-unauthenticated, new audience), consult `guarding-the-factory`.
3. Apply the chosen model; for Firebase, set the server (`GE_AUTH_MODE=firebase`, project id) AND client (`VITE_AUTH_MODE=firebase`, `VITE_FIREBASE_*`) — both, or it's inert.
4. Keep it single-tenant: access changes target THIS project's services only; never grant cross-project (defer to `guarding-the-factory`).

## Commands

```bash
# grant a user/group access to a locked Cloud Run service
gcloud run services add-iam-policy-binding <service> --region <region> \
  --member="user:<email>" --role="roles/run.invoker"
# inspect a service's auth posture
gcloud run services describe <service> --region <region> \
  --format='value(spec.template.metadata.annotations,status.url)'
```

## Common mistakes

- Treating a 403 on the direct run.app URL as broken when it's behind IAP (use the LB / a token).
- Setting only half of Firebase auth (server OR client) — both are required; otherwise it's off.
- `--allow-unauthenticated` on the ops console to "make it work" — that exposes it publicly; grant `run.invoker` or use IAP.

## Done when

The intended audience can reach the surface, unintended callers get 401/403, and no cross-project grant was made.
