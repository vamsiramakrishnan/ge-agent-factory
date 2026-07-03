# Access grant record — copy into the run record, one per grant

- **Surface**: <service name + URL>              Project: `_______` (must be THIS project — no cross-project)
- **Member**: `user:…` / `group:…` / `serviceAccount:…`
- **Mechanism**: [ ] roles/run.invoker  [ ] IAP `iap_members` (terraform)  [ ] Firebase sign-in (server+client env)
- **Why this one**: <narrowest model that fits the audience — see "Choosing the model" in SKILL.md>
- **Approved by**: <operator + where they said it>   Date: `_______`
- **Applied with**: <exact command / terraform var change>
- **Verified**: intended caller gets 200 [ ] · anonymous still gets 401/403 [ ]
- **Rollback**: <exact remove command / terraform revert>
- **Expiry / review date** (if temporary): `_______`
