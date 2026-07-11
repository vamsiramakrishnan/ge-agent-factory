terraform {
  # Bumped to the 7.x provider line so the managed Agent Gateway resource
  # (google_network_services_agent_gateway, introduced in google 7.20) is
  # available in the main stack — no separate root / provider workaround.
  required_version = ">= 1.9"
  required_providers {
    google = {
      source  = "hashicorp/google"
      version = ">= 7.20.0"
    }
    google-beta = {
      source  = "hashicorp/google-beta"
      version = ">= 7.20.0"
    }
    random = {
      source  = "hashicorp/random"
      version = "~> 3.0"
    }
    local = {
      source  = "hashicorp/local"
      version = "~> 2.0"
    }
  }
}

provider "google" {
  project = var.project_id
  region  = var.region
}

provider "google-beta" {
  project = var.project_id
  region  = var.region
}

locals {
  factory_bucket   = var.factory_bucket_name != "" ? var.factory_bucket_name : "${var.project_id}-ge-agent-factory"
  artifact_repo_id = "ge-agent-factory"
  gateway_service  = "ge-agent-factory-gateway"
  worker_service   = "ge-agent-factory-worker"
  tasks_queue      = "ge-agent-factory-stages"
  runner_sa_id     = "ge-agent-factory-runner"
  gateway_sa_id    = "ge-agent-factory-runtime"
  builder_sa_id    = "ge-agent-factory-builder"
  runner_sa_email  = "${local.runner_sa_id}@${var.project_id}.iam.gserviceaccount.com"
  gateway_sa_email = "${local.gateway_sa_id}@${var.project_id}.iam.gserviceaccount.com"
  builder_sa_email = "${local.builder_sa_id}@${var.project_id}.iam.gserviceaccount.com"
  builder_image    = "${var.region}-docker.pkg.dev/${var.project_id}/${local.artifact_repo_id}/ge-agent-factory-builder:latest"
}
