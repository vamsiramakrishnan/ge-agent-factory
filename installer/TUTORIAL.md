# Deploy the GE Agent Factory

<walkthrough-author tutorialName="GE Agent Factory Installer" />

This walkthrough provisions the full **GE Agent Factory** — gateway, worker,
Cloud Tasks queue, Firestore, Artifact Registry, and the agent build pipeline
— into a GCP project you control. Expect about 15-20 minutes end-to-end.

What you'll do:

1.  Run local setup so the CLI, harness, and repository skills are discoverable
2.  Pick a project and enable billing
3.  Create a Gemini Enterprise app
4.  Fill in `values.tfvars`
5.  Run `terraform apply` (placeholder containers)
6.  Run `./build-and-deploy.sh` (real containers)
7.  *(Optional)* Wire IAP via `./scripts/enable-iap.sh`
8.  Run `./verify.sh` to confirm everything works

## Prerequisites

Before you start, make sure you have:

+   A **GCP project** with **billing enabled**
+   The **Project Owner** role (or equivalent — you'll be creating SAs and IAM
    bindings)
+   `terraform` and `jq` installed — both are pre-installed in Cloud Shell

Check the tools are available:

```bash
terraform version
jq --version
gcloud --version
```

<walkthrough-footnote>If any of those fail, click the **boost** icon in the
Cloud Shell toolbar to refresh your environment.</walkthrough-footnote>

## Local setup and skills

From the repository root, run:

```bash
make setup
```

This installs local dependencies, puts `ge` on PATH, warms the shared local
cache, starts the daemon, validates the repository skills, and writes
`.ge/skills/manifest.json`. That manifest is the contract used by harnesses,
the CLI, and the console to find the same skills for interview, spec generation,
factory runs, workspace checks, release, and evidence learning.

To verify the skill substrate later:

```bash
make skills-doctor
bun apps/ge-demo-generator/src/cli.js skills
ge state paths
```

## Pick a project

Set the project Cloud Shell will operate against. Replace `YOUR_PROJECT_ID`
with the project you want to install into.

```bash
gcloud config set project <walkthrough-project-id/>
```

<walkthrough-project-setup billing="true"></walkthrough-project-setup>

Grab the project number — you'll need it in `values.tfvars`:

```bash
gcloud projects describe $(gcloud config get-value project) --format='value(projectNumber)'
```

Note the number it prints; you'll paste it in step 4.

## Create a Gemini Enterprise app

The factory **publishes agents into an existing Gemini Enterprise app** — it
doesn't create the app itself. Create one in the Cloud Console first:

<walkthrough-spotlight-pointer
  href="https://console.cloud.google.com/gen-app-builder/engines">
  Open Gemini Enterprise → Apps
</walkthrough-spotlight-pointer>

1.  Click **Create app**
2.  Pick **Agentspace** as the app type
3.  Set location to **global**, name it anything
4.  Once created, copy its full resource name. It looks like:

    ```
    projects/123456789012/locations/global/collections/default_collection/engines/my-app
    ```

Keep that resource name handy for the next step.

## Fill in values.tfvars

Copy the example and open it in the Cloud Shell editor:

```bash
cd ~/cloudshell_open/ge-agent-factory/installer
cp values.example.tfvars values.tfvars
```

<walkthrough-editor-open-file
  filePath="ge-agent-factory/installer/values.tfvars">
  Open values.tfvars in the editor
</walkthrough-editor-open-file>

Fill in these three values at minimum:

+   `project_id` — your project id (the one from step 2)
+   `project_number` — the number you copied above
+   `gemini_enterprise_app_id` — the GE app resource name from step 3

Defaults for `region` (`us-central1`) and `firestore_location` (`nam5`) work
for most installs. Leave `enable_iap = false` for now — you can turn it on
later in step 6.

Save the file (Cmd/Ctrl-S).

## First apply: APIs, identities, infrastructure

This step provisions everything except the real container images. The gateway
and worker come up running a public placeholder image — `build-and-deploy.sh`
swaps in the real ones in the next step.

```bash
cd ~/cloudshell_open/ge-agent-factory/installer/terraform
terraform init
terraform apply -var-file=../values.tfvars
```

Terraform will show a plan of about 50 resources. Type `yes` when prompted.
Provisioning takes 3-5 minutes — most of that is API enablement and Firestore
initialization.

<walkthrough-footnote>If you see <code>Error 409: Already Exists</code> for
Firestore, the project already has a default database. Either use a fresh
project or delete the project to start over (Firestore can't be deleted
in-place).</walkthrough-footnote>

## Build containers and deploy real images

Now build the gateway + worker images via Cloud Build (pushed into the
Artifact Registry repo Terraform created), then re-apply Terraform with the
real image URIs:

```bash
cd ~/cloudshell_open/ge-agent-factory/installer
./build-and-deploy.sh
```

This runs two Cloud Build jobs (one per container) and a Terraform re-apply.
Expect 6-10 minutes the first time. The script also generates
`apps/presentation/.env.local` so a local `bun run dev` session points at
your provisioned project.

When it finishes, it prints the gateway URL — that's where the factory UI
lives.

## *(Optional)* Wire IAP

By default the gateway is reachable on its `*.run.app` URL with no auth — fine
for evaluation, not for anything sensitive. To put IAP in front of it:

1.  Set `enable_iap = true` and `iap_member = "user:you@example.com"` in
    `values.tfvars`
2.  Re-apply Terraform:

    ```bash
    cd ~/cloudshell_open/ge-agent-factory/installer/terraform
    terraform apply -var-file=../values.tfvars
    ```

3.  Run the IAP setup script — it walks you through the OAuth consent screen,
    creates the OAuth client, provisions the global LB + backend service with
    IAP enabled, and re-applies Terraform with the backend service id so
    `IAP_EXPECTED_AUDIENCE` resolves on the gateway:

    ```bash
    cd ~/cloudshell_open/ge-agent-factory/installer
    ./scripts/enable-iap.sh
    ```

You'll need a DNS name pointing at the IP the script reserves — managed SSL
cert provisioning takes 10-60 minutes after DNS resolves.

## Verify

Run preflight against the deployed gateway. This calls
`POST /api/factory/preflight` with your identity token and runs the same
structured checks the UI uses — APIs enabled, SAs present, GE app reachable,
factory bucket reachable.

```bash
cd ~/cloudshell_open/ge-agent-factory/installer
./verify.sh
```

If anything fails, the JSON output tells you exactly which check failed and
why.

## You're done

The factory is live. From here:

+   **Open the gateway URL** the build step printed — that's the React UI.
+   **Provision your first agent** via the *Configure & Deploy* panel.
+   **Bulk-provision the 360-agent demo catalog**:

    ```bash
    cd ~/cloudshell_open/ge-agent-factory
    ge agents build --all
    ```

+   **Local dev** against your provisioned project:

    ```bash
    cd ~/cloudshell_open/ge-agent-factory/apps/presentation
    bun run dev
    ```

    The `.env.local` written by `build-and-deploy.sh` points it at your bucket,
    queue, and GE app.

<walkthrough-conclusion-trophy></walkthrough-conclusion-trophy>

Questions or issues? Check `installer/terraform/README.md` for the resource
inventory, or the repo's top-level `README.md` for architecture docs.
