import React from "react";
import { DomainCatalogSlide } from "../../../agent/DomainCatalogSlide";
import { BarChart3, Globe, Layout, PenTool, FileText, MessageSquare, AlertTriangle, RefreshCw } from "lucide-react";

export const WorkforcePlanningCatalog = () => (
  <DomainCatalogSlide
    title="Workforce Planning & Org Design"
    subtitle="Domain 01 • Strategic Foundations"
    description="Transforming how organizations model their future, analyze their structure, and define their roles through data-driven intelligence."
    color="#3b82f6"
    useCases={[
      {
        id: "uc-101",
        title: "Scenario Modeling",
        icon: BarChart3,
        description: "Multi-scenario demand forecasting with real-time business signals."
      },
      {
        id: "uc-102",
        title: "Market Intelligence",
        icon: Globe,
        description: "Continuous talent supply risk monitoring and predictive benchmarking."
      },
      {
        id: "uc-103",
        title: "Plan Drafter",
        icon: FileText,
        description: "Auto-generates executive-ready workforce plan documents from model outputs."
      },
      {
        id: "uc-104",
        title: "Org Analyzer",
        icon: Layout,
        description: "Automated spans and layers analysis with anomaly detection."
      },
      {
        id: "uc-105",
        title: "Change Comms",
        icon: MessageSquare,
        description: "Tailored change communications for each stakeholder tier."
      },
      {
        id: "uc-106",
        title: "Restructuring Impact",
        icon: AlertTriangle,
        description: "Multi-scenario impact modeling for RIF, redeployment, and reskilling."
      },
      {
        id: "uc-107",
        title: "JD Optimizer",
        icon: PenTool,
        description: "Standardized, inclusive JD generation from competency profiles."
      },
      {
        id: "uc-108",
        title: "Architecture Sync",
        icon: RefreshCw,
        description: "Continuous sync between job architecture, comp bands, and HRIS."
      }
    ]}
  />
);
