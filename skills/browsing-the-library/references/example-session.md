# Example session — browsing the library to instantiate an agent

A worked interaction: the operator wants an AML (anti-money-laundering) agent and
would rather start from a blueprint than author one. Read this to see the
browse → inspect → instantiate → continue-on-the-line arc end to end.

---

> **Operator:** Do we already have an anti-money-laundering agent I can start from?

**Assistant:** Checking the library inventory, then searching for it.

```bash
bun tools/ge.mjs library stats
# → 312 blueprints · 11 verticals · 240 buildable · 3 proven

bun tools/ge.mjs library search aml --vertical banking
# → banking/aml-alert-investigation-agent   contract_valid   buildable
#   banking/sar-filing-assistant            contract_valid   buildable
```

Two candidates. Let me inspect the first and check its readiness.

```bash
bun tools/ge.mjs library inspect banking/aml-alert-investigation-agent
# → taxonomy: banking / financial-crime · authority: write_with_approval
#   inventory: 4 source systems · 9 tool intents · 12 evals · 3 anomalies

bun tools/ge.mjs library status banking/aml-alert-investigation-agent
# → state: evals_ready
#   next:  ge create --from-library banking/aml-alert-investigation-agent
```

> **Operator:** That's the one. Set it up.

**Assistant:** Materializing it into a workspace. I'll dry-run first so you can see
exactly what lands, then create it.

```bash
bun tools/ge.mjs create --from-library banking/aml-alert-investigation-agent --dry-run
# → would create: okf/agent.okf.md, app/agent.py, twins/, fixtures/, evals/, proof/, ge.lock.json

bun tools/ge.mjs create --from-library banking/aml-alert-investigation-agent
# → ✓ receipt-backed workspace created · next: cd <workspace> && ge prove
```

The blueprint is now a real workspace. From here it flows through the normal
line — the library was just the front door.

> **Operator:** Can we make the evals stronger before building?

**Assistant:** Yes — the blueprint is `evals_ready` but not proven. Raise its
quality first, then build:

```bash
bun tools/ge.mjs improve --id aml-alert-investigation-agent            # preview the enrichment
bun tools/ge.mjs improve --id aml-alert-investigation-agent --write    # close the loop toward L4
bun tools/ge.mjs agents build --ids aml-alert-investigation-agent --local
bun tools/ge.mjs prove --local
```

---

**What this shows**

- Browsing is read-only and cheap — `stats` → `search` → `inspect`/`status`
  narrows to one blueprint before anything is written.
- `status` gives the *computed* readiness and the exact next command; it is not
  a live proof.
- `create --from-library` is the single write, and `--dry-run` previews it.
- The instantiated blueprint is an ordinary workspace: `ge improve` (raise
  quality), then `ge agents build` / `ge prove` (build and validate) — the same
  line an authored spec follows.
