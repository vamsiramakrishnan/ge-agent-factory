import React from "react";
import { DomainCatalogSlide } from "../../../agent/DomainCatalogSlide";
import { Scale, HeartPulse, Zap, Globe, Megaphone, Calculator, Mail, PieChart, Award } from "lucide-react";

export const TotalRewardsCatalog = () => (
  <DomainCatalogSlide
    title="Compensation, Benefits & Total Rewards"
    subtitle="Domain 04 • Value & Wellbeing"
    description="Optimizing the total rewards package through continuous equity auditing and personalized benefits guidance."
    color="#ef4444"
    useCases={[
      {
        id: "uc-401",
        title: "Market Benchmarking",
        icon: Globe,
        description: "Continuous market data aggregation with real-time competitive positioning."
      },
      {
        id: "uc-402",
        title: "Comp Philosophy",
        icon: Megaphone,
        description: "Interactive compensation philosophy guides with contextual pay decision support."
      },
      {
        id: "uc-403",
        title: "Merit Modeler",
        icon: Calculator,
        description: "Multi-scenario merit and promotion budget modeling with cost projections."
      },
      {
        id: "uc-404",
        title: "Pay Equity Audit",
        icon: Scale,
        description: "Continuous regression analysis and real-time gap identification."
      },
      {
        id: "uc-405",
        title: "Comp Letters",
        icon: Mail,
        description: "Auto-generated personalized total compensation statements."
      },
      {
        id: "uc-406",
        title: "Benefits Assistant",
        icon: HeartPulse,
        description: "24/7 conversational support and personalized enrollment guidance."
      },
      {
        id: "uc-407",
        title: "Benefits Analytics",
        icon: PieChart,
        description: "Unified utilization dashboard with predictive cost modeling for renewals."
      },
      {
        id: "uc-408",
        title: "Rewards Optimizer",
        icon: Zap,
        description: "Real-time scenario modeling for base, bonus, and equity."
      },
      {
        id: "uc-409",
        title: "Equity Communicator",
        icon: Award,
        description: "Personalized equity dashboards with vesting timelines and tax guidance."
      }
    ]}
  />
);
