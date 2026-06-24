import React from "react";
import { DomainCatalogSlide } from "../../../agent/DomainCatalogSlide";
import { TrendingUp, Landmark, DollarSign, PieChart, FileCheck, GitMerge, Gauge } from "lucide-react";

export const TreasuryCashCatalog = () => (
  <DomainCatalogSlide
    title="Treasury & Cash Management"
    subtitle="Domain 24 - Treasury & Cash"
    description="Elevating treasury from daily cash positioning to strategic liquidity intelligence -- multi-horizon forecasting, automated bank reconciliation, and LLM-driven market interpretation for FX and investment decisions."
    color="#4338ca"
    useCases={[
      {
        id: "uc-2401",
        title: "Cash Flow Forecaster",
        icon: TrendingUp,
        description: "Multi-horizon cash flow forecasting with LLM incorporation of qualitative signals from sales and supply chain teams."
      },
      {
        id: "uc-2402",
        title: "Bank Reconciliation Agent",
        icon: Landmark,
        description: "Automated MT940/BAI2 matching with LLM investigation of unmatched items by reading bank descriptions and internal records."
      },
      {
        id: "uc-2403",
        title: "FX Exposure Monitor",
        icon: DollarSign,
        description: "Real-time FX exposure netting with LLM interpretation of market-moving events and hedge ratio recommendations."
      },
      {
        id: "uc-2404",
        title: "Investment Portfolio Optimizer",
        icon: PieChart,
        description: "Portfolio optimization across yield, liquidity, and risk with LLM interpretation of investment policy constraints."
      },
      {
        id: "uc-2405",
        title: "Debt Covenant Tracker",
        icon: FileCheck,
        description: "Automated covenant ratio calculation with LLM reading of loan agreements for complex EBITDA definition interpretations."
      },
      {
        id: "uc-2406",
        title: "Intercompany Netting Agent",
        icon: GitMerge,
        description: "Multi-currency netting optimization with LLM handling of withholding tax and regulatory exceptions across entities."
      },
      {
        id: "uc-2407",
        title: "Liquidity Dashboard",
        icon: Gauge,
        description: "Global cash position aggregation with LLM-generated daily treasury briefings and sweep recommendations."
      }
    ]}
  />
);
