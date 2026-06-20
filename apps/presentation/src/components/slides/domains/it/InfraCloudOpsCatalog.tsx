import React from "react";
import { DomainCatalogSlide } from "../../../agent/DomainCatalogSlide";
import { DollarSign, BarChart3, Zap, Activity, Container, Database, Network, ShieldCheck } from "lucide-react";

export const InfraCloudOpsCatalog = () => (
  <DomainCatalogSlide
    title="Infrastructure & Cloud Operations"
    subtitle="Domain 40 • Infra & Cloud Ops"
    description="Shifting from reactive firefighting to proactive reliability engineering through AI-driven cost optimization, capacity planning, and self-healing infrastructure."
    color="#6d28d9"
    useCases={[
      {
        id: "uc-4001",
        title: "Cloud Cost Optimizer",
        icon: DollarSign,
        description: "Multi-cloud spend analysis with right-sizing recommendations, reserved instance optimization, and waste detection."
      },
      {
        id: "uc-4002",
        title: "Capacity Planning Agent",
        icon: BarChart3,
        description: "Time-series capacity forecasting with seasonal decomposition and business event correlation for pre-scaling."
      },
      {
        id: "uc-4003",
        title: "Incident Auto-Remediator",
        icon: Zap,
        description: "Alert-driven diagnosis with runbook matching, remediation execution, and code regression-aware rollback decisions."
      },
      {
        id: "uc-4004",
        title: "SLO/SLI Monitor & Reporter",
        icon: Activity,
        description: "Continuous SLI tracking against SLO targets with error budget burn rate analysis and reliability sprint triggers."
      },
      {
        id: "uc-4005",
        title: "Kubernetes Cluster Optimizer",
        icon: Container,
        description: "Pod right-sizing, bin-packing analysis, and HPA tuning based on actual usage vs. resource requests/limits."
      },
      {
        id: "uc-4006",
        title: "Database Performance Advisor",
        icon: Database,
        description: "Slow query analysis with index recommendations, connection pool tuning, and table growth forecasting."
      },
      {
        id: "uc-4007",
        title: "Network & DNS Health Monitor",
        icon: Network,
        description: "Latency anomaly detection, certificate expiry prediction, firewall rule conflict analysis, and traffic correlation."
      },
      {
        id: "uc-4008",
        title: "Backup & DR Compliance Agent",
        icon: ShieldCheck,
        description: "Backup verification, restore procedure testing, RPO/RTO compliance scoring, and DR readiness reporting."
      }
    ]}
  />
);
