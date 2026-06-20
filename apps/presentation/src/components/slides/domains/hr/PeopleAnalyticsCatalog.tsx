import React from "react";
import { DomainCatalogSlide } from "../../../agent/DomainCatalogSlide";
import { Search, ShieldAlert, Calculator, Layout, ShoppingCart } from "lucide-react";

export const PeopleAnalyticsCatalog = () => (
  <DomainCatalogSlide
    title="People Analytics & HR Technology"
    subtitle="Domain 10 • Insights & Infrastructure"
    description="Unlocking the power of HR data through natural language querying and predictive modeling."
    color="#111827"
    useCases={[
      {
        id: "uc-1001",
        title: "Data Lake Query",
        icon: Search,
        description: "Natural language interface for complex cross-domain HR data analysis."
      },
      {
        id: "uc-1002",
        title: "Attrition Prediction",
        icon: ShieldAlert,
        description: "ML-driven flight-risk scores with proactive intervention alerts."
      },
      {
        id: "uc-1003",
        title: "Cost Modeling",
        icon: Calculator,
        description: "Real-time fully-loaded cost modeling with financial API integration."
      },
      {
        id: "uc-1004",
        title: "Tech Intelligence",
        icon: Layout,
        description: "Real-time license utilization monitoring and renewal optimization."
      },
      {
        id: "uc-1005",
        title: "Vendor Evaluation",
        icon: ShoppingCart,
        description: "Structured vendor evaluation with weighted scoring and TCO modeling."
      }
    ]}
  />
);
