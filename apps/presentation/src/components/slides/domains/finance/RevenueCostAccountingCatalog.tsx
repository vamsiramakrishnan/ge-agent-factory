import React from "react";
import { DomainCatalogSlide } from "../../../agent/DomainCatalogSlide";
import { Receipt, GitBranch, PieChart, Scale, FileText, Package, ArrowLeftRight } from "lucide-react";

export const RevenueCostAccountingCatalog = () => (
  <DomainCatalogSlide
    title="Revenue & Cost Accounting"
    subtitle="Domain 27 • Revenue & Cost Accounting"
    description="Elevating revenue recognition and cost management from manual spreadsheet analysis to AI-driven accounting with automated ASC 606 compliance, real-time profitability insights, and intelligent variance investigation."
    color="#a16207"
    useCases={[
      {
        id: "uc-2701",
        title: "Revenue Recognition Engine",
        icon: Receipt,
        description: "Automated ASC 606 5-step revenue recognition with contract term interpretation and SSP allocation."
      },
      {
        id: "uc-2702",
        title: "Cost Allocation Agent",
        icon: GitBranch,
        description: "Activity-based cost allocation with driver optimization and dispute resolution reasoning."
      },
      {
        id: "uc-2703",
        title: "Product Profitability Analyzer",
        icon: PieChart,
        description: "Fully-loaded product P&L with margin decomposition into price, volume, mix, and cost components."
      },
      {
        id: "uc-2704",
        title: "Standard Cost Variance Agent",
        icon: Scale,
        description: "Automated variance decomposition with commodity market correlation and root cause investigation."
      },
      {
        id: "uc-2705",
        title: "ASC 606 Contract Analyzer",
        icon: FileText,
        description: "Contract language interpretation with 5-step model application, precedent matching, and accounting memo generation."
      },
      {
        id: "uc-2706",
        title: "Inventory Valuation Agent",
        icon: Package,
        description: "SLOB identification with NRV calculation and item-level impairment assessment against production plans."
      },
      {
        id: "uc-2707",
        title: "COGS Reconciliation Agent",
        icon: ArrowLeftRight,
        description: "Automated CO-FI COGS reconciliation with break investigation and correcting entry generation."
      }
    ]}
  />
);
