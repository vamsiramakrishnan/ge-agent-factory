# Shared data plane (Tier-1): one set of instances per project; per-agent objects
# (datasets/databases/tables/named-DBs/prefixes) are created at the load_data
# stage. All stores default on (enable_* for teardown/cost control). See
# docs/superpowers/specs/2026-06-01-per-agent-data-plane-design.md.

locals {
  data_bucket = var.data_bucket_name != "" ? var.data_bucket_name : "${var.project_id}-ge-agent-data"
  data_sas    = [google_service_account.runner.email, google_service_account.gateway.email]
}

# ── GCS: shared agent-data bucket (per-agent prefix agents/<id>/) ─────────────
resource "google_storage_bucket" "data" {
  count                       = var.enable_gcs_data ? 1 : 0
  project                     = var.project_id
  name                        = local.data_bucket
  location                    = var.region
  uniform_bucket_level_access = true
  public_access_prevention    = "enforced"
}

resource "google_storage_bucket_iam_member" "data_admin" {
  for_each = var.enable_gcs_data ? toset(local.data_sas) : []
  bucket   = google_storage_bucket.data[0].name
  role     = "roles/storage.objectAdmin"
  member   = "serviceAccount:${each.value}"
}

# ── BigQuery: no instance; datasets are per-agent (agent_<id>) at load_data ───
resource "google_project_iam_member" "bq_data_editor" {
  for_each = var.enable_bigquery ? toset(local.data_sas) : []
  project  = var.project_id
  role     = "roles/bigquery.dataEditor"
  member   = "serviceAccount:${each.value}"
}

resource "google_project_iam_member" "bq_job_user" {
  for_each = var.enable_bigquery ? toset(local.data_sas) : []
  project  = var.project_id
  role     = "roles/bigquery.jobUser"
  member   = "serviceAccount:${each.value}"
}

# ── AlloyDB: shared cluster+instance; per-agent databases at load_data ────────
# AlloyDB needs private services access on the VPC: a reserved peering range +
# a servicenetworking connection. Without these the cluster apply fails.
resource "google_compute_global_address" "alloydb_psa" {
  count         = var.enable_alloydb ? 1 : 0
  project       = var.project_id
  name          = "ge-agent-alloydb-psa"
  purpose       = "VPC_PEERING"
  address_type  = "INTERNAL"
  prefix_length = 16
  network       = "projects/${var.project_id}/global/networks/${var.vpc_network}"
  depends_on    = [google_project_service.enabled]
}

resource "google_service_networking_connection" "alloydb_psa" {
  count                   = var.enable_alloydb ? 1 : 0
  network                 = "projects/${var.project_id}/global/networks/${var.vpc_network}"
  service                 = "servicenetworking.googleapis.com"
  reserved_peering_ranges = [google_compute_global_address.alloydb_psa[0].name]
  depends_on              = [google_project_service.enabled]
}

resource "random_password" "alloydb" {
  count   = var.enable_alloydb && var.alloydb_password == "" ? 1 : 0
  length  = 24
  special = false
}

locals {
  alloydb_pw = var.alloydb_password != "" ? var.alloydb_password : (var.enable_alloydb ? random_password.alloydb[0].result : "")
}

resource "google_alloydb_cluster" "data" {
  count      = var.enable_alloydb ? 1 : 0
  project    = var.project_id
  cluster_id = "ge-agent-data"
  location   = var.region

  network_config {
    network = "projects/${var.project_id}/global/networks/${var.vpc_network}"
  }

  initial_user {
    user     = "postgres"
    password = local.alloydb_pw
  }

  lifecycle {
    prevent_destroy = true
  }

  depends_on = [google_project_service.enabled, google_service_networking_connection.alloydb_psa]
}

resource "google_alloydb_instance" "primary" {
  count         = var.enable_alloydb ? 1 : 0
  cluster       = google_alloydb_cluster.data[0].name
  instance_id   = "primary"
  instance_type = "PRIMARY"

  machine_config {
    cpu_count = 2
  }
}

resource "google_secret_manager_secret" "alloydb_dsn" {
  count     = var.enable_alloydb ? 1 : 0
  project   = var.project_id
  secret_id = "ge-agent-alloydb-dsn"
  replication {
    auto {}
  }
}

resource "google_secret_manager_secret_version" "alloydb_dsn" {
  count       = var.enable_alloydb ? 1 : 0
  secret      = google_secret_manager_secret.alloydb_dsn[0].id
  secret_data = "postgresql://postgres:${local.alloydb_pw}@${google_alloydb_instance.primary[0].ip_address}:5432/postgres"
}

resource "google_project_iam_member" "alloydb_client" {
  for_each = var.enable_alloydb ? toset(local.data_sas) : []
  project  = var.project_id
  role     = "roles/alloydb.client"
  member   = "serviceAccount:${each.value}"
}

# ── Bigtable: shared instance; per-agent tables at load_data ──────────────────
resource "google_bigtable_instance" "data" {
  count               = var.enable_bigtable ? 1 : 0
  project             = var.project_id
  name                = "ge-agent-data"
  deletion_protection = true

  cluster {
    cluster_id   = "ge-agent-data-c1"
    zone         = "${var.region}-a"
    num_nodes    = 1
    storage_type = "SSD"
  }
}

resource "google_project_iam_member" "bigtable_user" {
  for_each = var.enable_bigtable ? toset(local.data_sas) : []
  project  = var.project_id
  role     = "roles/bigtable.user"
  member   = "serviceAccount:${each.value}"
}

# ── Firestore: default DB exists; per-agent named DBs at load_data ────────────
resource "google_project_iam_member" "datastore_user" {
  for_each = var.enable_firestore ? toset(local.data_sas) : []
  project  = var.project_id
  role     = "roles/datastore.user"
  member   = "serviceAccount:${each.value}"
}

# AlloyDB DSN read access for the runtime/runner SAs.
resource "google_project_iam_member" "data_secret_accessor" {
  for_each = var.enable_alloydb ? toset(local.data_sas) : []
  project  = var.project_id
  role     = "roles/secretmanager.secretAccessor"
  member   = "serviceAccount:${each.value}"
}

# ── Outputs (feed .ge.json via `ge data up`) ─────────────────────────────────
output "data_bucket" {
  value = var.enable_gcs_data ? google_storage_bucket.data[0].name : ""
}

output "bq_location" {
  value = var.bq_data_location
}

output "alloydb_dsn_secret" {
  value = var.enable_alloydb ? google_secret_manager_secret.alloydb_dsn[0].secret_id : ""
}

output "alloydb_instance" {
  value = var.enable_alloydb ? google_alloydb_instance.primary[0].name : ""
}

output "bigtable_instance" {
  value = var.enable_bigtable ? google_bigtable_instance.data[0].name : ""
}

output "firestore_location" {
  value = var.firestore_location
}
