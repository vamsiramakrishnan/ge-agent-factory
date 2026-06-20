import React from "react";
import { DomainCatalogSlide } from "../../../agent/DomainCatalogSlide";
import { FileText, Wallet, Copy, Clock, Database, Percent, Shield } from "lucide-react";

export const AccountsPayableCatalog = () => (
  <DomainCatalogSlide
    title="Accounts Payable"
    subtitle="Domain 22 • Accounts Payable"
    description="Driving AP from manual invoice processing to 95%+ touchless automation — intelligent matching, duplicate detection, payment optimization, and continuous policy compliance monitoring."
    color="#b45309"
    useCases={[
      {
        id: "uc-2201",
        title: "Invoice Processing & Matching",
        icon: FileText,
        description: "OCR-powered invoice extraction with three-way matching against PO and goods receipt, handling non-standard formats."
      },
      {
        id: "uc-2202",
        title: "Vendor Payment Optimizer",
        icon: Wallet,
        description: "Pre-payment run optimization balancing DPO, dynamic discounting, and cash position against working capital targets."
      },
      {
        id: "uc-2203",
        title: "Duplicate Invoice Detector",
        icon: Copy,
        description: "ML clustering on invoice features with fuzzy matching to distinguish true duplicates from legitimate similar invoices."
      },
      {
        id: "uc-2204",
        title: "AP Aging Analyzer",
        icon: Clock,
        description: "AP aging analysis with DPO trending, vendor concentration, cash requirement forecasting, and narrative generation."
      },
      {
        id: "uc-2205",
        title: "Vendor Master Data Manager",
        icon: Database,
        description: "Vendor data validation, duplicate detection, banking detail verification, and identity resolution across related entities."
      },
      {
        id: "uc-2206",
        title: "Early Payment Discount Agent",
        icon: Percent,
        description: "Daily identification of discount-eligible invoices with APR calculation and cost-of-capital comparison for optimal capture."
      },
      {
        id: "uc-2207",
        title: "AP Policy Compliance Monitor",
        icon: Shield,
        description: "Transaction scanning for policy violations including split-purchasing detection, threshold circumvention, and trend analysis."
      }
    ]}
  />
);
