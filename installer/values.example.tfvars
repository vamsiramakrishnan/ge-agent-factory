# Copy to values.tfvars and fill in your values, then run:
#   terraform apply -var-file=../values.tfvars
#
# Required: project_id, project_number, gemini_enterprise_app_id.
# Everything else is optional with sensible defaults — uncomment to override.

# --- Required ---------------------------------------------------------------

project_id     = "my-gcp-project"
project_number = "123456789012"

# Create the Gemini Enterprise app in Cloud Console first, then paste the
# resource name here. Format:
#   projects/<num>/locations/global/collections/default_collection/engines/<engine>
gemini_enterprise_app_id = "projects/123456789012/locations/global/collections/default_collection/engines/my-app"

# --- Optional: regions ------------------------------------------------------

# region              = "us-central1"
# firestore_location  = "nam5"          # multi-region; or a single region like "us-central1"
# gemini_enterprise_location = "global"  # GE apps almost always live in "global"

# --- Access posture --------------------------------------------------------
#
# gateway + worker are always external ingress + authenticated-only (IAM/OIDC),
# no IAP, no allUsers. The human UIs (console/presentation) are external ingress +
# authenticated-only via IAM run.invoker by DEFAULT; set enable_iap = true to add
# DIRECT Cloud Run IAP, restricting them to var.iap_members (e.g. all Googlers).
# No load balancer.
#
# enable_iap          = true                          # IAP on the console/presentation UI services
# iap_members         = ["domain:google.com"]         # all Googlers; or ["group:my-team@google.com"]
# console_image       = "us-central1-docker.pkg.dev/PROJECT/ge-agent-factory/console:TAG"
# presentation_image  = "us-central1-docker.pkg.dev/PROJECT/ge-agent-factory/presentation:TAG"
#
# Escape hatch (NOT recommended): make the gateway public/unauthenticated.
# allow_public_gateway = true

# --- Optional: legacy LB + IAP for the gateway (iap_lb.tf) ------------------
#
# Only if you need a custom hostname in front of the gateway. With
# enable_iap_lb = true AND a domain, Terraform builds the whole LB (global IP,
# serverless NEG, backend service + IAP, URL map, managed SSL cert, forwarding
# rule). Provide an OAuth client, or set create_oauth_client = true.
#
# enable_iap_lb           = true
# domain                  = "factory.example.com"   # A-record → gateway_lb_ip output
# iap_member              = "user:you@example.com"  # LB-backend accessor (legacy single principal)
# iap_oauth_client_id     = ""                       # from a manually-created OAuth client
# iap_oauth_client_secret = ""
# create_oauth_client     = false                    # true = mint brand+client (Internal, one per project)
# iap_support_email       = "you@example.com"        # required when create_oauth_client = true
# iap_backend_service_id  = ""                        # set to the iap_audience output's numeric id, then re-apply

# --- Optional: Cloud Build trigger for the gateway (cloudbuild.tf) ----------
#
# create_build_trigger = true
# repo_name            = "ge-agent-factory-gateway"      # Cloud Source Repository name
# branch_name          = "master"

# --- Optional: OIDC fallback for service-account callers --------------------
#
# When IAP is on, end-user browsers hit the LB. Service accounts can still call
# the gateway directly via an OIDC
# bearer token if you list the gateway URL as an allowed audience here.
#
# oidc_allowed_audiences = "https://ge-agent-factory-gateway-xxxx.a.run.app"

# --- Optional: container images --------------------------------------------
#
# Leave at the defaults for the first apply (the public hello image is used
# so the Cloud Run services come up before build-and-deploy.sh has built
# anything). build-and-deploy.sh re-applies with the real image URIs.
#
# gateway_image = "us-central1-docker.pkg.dev/<project>/ge-agent-factory/gateway:<sha>"
# worker_image  = "us-central1-docker.pkg.dev/<project>/ge-agent-factory/worker:<sha>"

# --- Optional: bucket override ---------------------------------------------
#
# factory_bucket_name = "my-custom-bucket-name"   # default: <project>-ge-agent-factory
