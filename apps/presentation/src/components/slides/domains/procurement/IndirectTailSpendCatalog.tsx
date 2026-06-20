import React from "react";
import { DomainCatalogSlide } from "../../../agent/DomainCatalogSlide";
import { ShoppingCart, PackageSearch, Handshake, Wrench, Plane, FileText } from "lucide-react";

export const IndirectTailSpendCatalog = () => (
  <DomainCatalogSlide
    title="Indirect & Tail Spend Management"
    subtitle="Domain 18 • Indirect & Tail Spend"
    description="Bringing strategic discipline to the long tail of procurement — classifying fragmented spend, curating catalogs, automating spot buys, optimizing MRO inventory, enforcing T&E compliance, and governing services procurement."
    color="#4f46e5"
    useCases={[
      {
        id: "uc-1801",
        title: "Tail Spend Classifier",
        icon: ShoppingCart,
        description: "Pareto analysis + ML clustering on tail transactions with LLM-driven intervention recommendations per cluster."
      },
      {
        id: "uc-1802",
        title: "Catalog Curation & Recommendation",
        icon: PackageSearch,
        description: "Collaborative filtering and natural-language search interpretation to surface compliant catalog alternatives."
      },
      {
        id: "uc-1803",
        title: "Spot Buy Negotiation Agent",
        icon: Handshake,
        description: "Multi-marketplace price benchmarking with LLM-drafted contextual quote requests and email negotiation."
      },
      {
        id: "uc-1804",
        title: "MRO & Facilities Optimization",
        icon: Wrench,
        description: "Demand forecasting for MRO consumables with anomaly interpretation against maintenance work orders."
      },
      {
        id: "uc-1805",
        title: "Travel & Expense Compliance",
        icon: Plane,
        description: "Policy rule engine + anomaly detection with LLM interpretation of receipts and policy-gaming pattern detection."
      },
      {
        id: "uc-1806",
        title: "Services Procurement & SOW Manager",
        icon: FileText,
        description: "Rate card compliance + scope creep detection by comparing timesheet activities against SOW deliverables."
      }
    ]}
  />
);
