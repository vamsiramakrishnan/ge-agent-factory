import React from "react";
import { DomainCatalogSlide } from "../../../agent/DomainCatalogSlide";
import { Workflow, Award, Cpu, Database, PiggyBank, Map, Eye } from "lucide-react";

export const DataAIPlatformCatalog = () => (
  <DomainCatalogSlide
    title="Data & AI Platform"
    subtitle="Domain 43 • PLATFORM"
    description="Transforming data platform operations from reactive firefighting to proactive management with AI-driven pipeline monitoring, quality scoring, model governance, and cost optimization."
    color="#0891b2"
    useCases={[
      {
        id: "uc-4301",
        title: "Data Pipeline Health Monitor",
        icon: Workflow,
        description: "Automated pipeline failure diagnosis with root cause tracing and auto-generated fix proposals."
      },
      {
        id: "uc-4302",
        title: "Data Quality Scorecard",
        icon: Award,
        description: "Daily quality checks across completeness, accuracy, consistency, and timeliness with root cause hypotheses."
      },
      {
        id: "uc-4303",
        title: "ML Model Registry & Monitor",
        icon: Cpu,
        description: "Continuous model performance tracking with drift detection and business-context degradation explanations."
      },
      {
        id: "uc-4304",
        title: "Feature Store Manager",
        icon: Database,
        description: "Feature reuse recommendations, redundancy detection, and lifecycle management across all ML models."
      },
      {
        id: "uc-4305",
        title: "Cost-per-Query Optimizer",
        icon: PiggyBank,
        description: "Daily BigQuery cost analysis with specific optimization instructions and verified savings tracking."
      },
      {
        id: "uc-4306",
        title: "Data Catalog & Lineage Agent",
        icon: Map,
        description: "Natural language data discovery with column-level lineage tracing and auto-PII classification."
      },
      {
        id: "uc-4307",
        title: "AI Ethics & Bias Monitor",
        icon: Eye,
        description: "Continuous fairness monitoring across protected attributes with bias contextualization and remediation guidance."
      }
    ]}
  />
);
