import React from "react";
import { DomainCatalogSlide } from "../../../agent/DomainCatalogSlide";
import { Route, BookOpen, Timer, ShieldCheck, AlertTriangle, Search, ShoppingCart, LayoutDashboard } from "lucide-react";

export const ITServiceManagementCatalog = () => (
  <DomainCatalogSlide
    title="IT Service Management"
    subtitle="Domain 42 • SUPPORT"
    description="Elevating IT service delivery from reactive ticket processing to proactive, intelligent service management with AI-powered routing, self-service resolution, and predictive SLA management."
    color="#7c3aed"
    useCases={[
      {
        id: "uc-4201",
        title: "Intelligent Ticket Router",
        icon: Route,
        description: "NLP-powered ticket classification with urgency detection, VIP identification, and skill-based routing."
      },
      {
        id: "uc-4202",
        title: "Knowledge Base Auto-Resolver",
        icon: BookOpen,
        description: "Semantic KB search with contextual answers incorporating recent changes and version-specific guidance."
      },
      {
        id: "uc-4203",
        title: "SLA Breach Predictor",
        icon: Timer,
        description: "ML-based breach prediction with 4-hour early warning and systemic issue correlation."
      },
      {
        id: "uc-4204",
        title: "Change Risk Assessor",
        icon: ShieldCheck,
        description: "Holistic change impact analysis with dependency detection, conflict scoring, and optimal window recommendation."
      },
      {
        id: "uc-4205",
        title: "Major Incident Coordinator",
        icon: AlertTriangle,
        description: "Automated war room assembly, status page updates, and deployment-incident correlation in under 3 minutes."
      },
      {
        id: "uc-4206",
        title: "Problem Management Analyzer",
        icon: Search,
        description: "Incident clustering with systemic root cause identification and automated problem ticket creation."
      },
      {
        id: "uc-4207",
        title: "Service Catalog Recommender",
        icon: ShoppingCart,
        description: "Conversational service discovery with role-based recommendations and guided request submission."
      },
      {
        id: "uc-4208",
        title: "ITSM Analytics Dashboard",
        icon: LayoutDashboard,
        description: "Auto-generated weekly ITSM reports with trend commentary and anomaly contextualization."
      }
    ]}
  />
);
