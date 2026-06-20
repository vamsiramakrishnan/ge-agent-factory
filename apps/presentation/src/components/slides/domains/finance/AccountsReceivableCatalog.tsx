import React from "react";
import { DomainCatalogSlide } from "../../../agent/DomainCatalogSlide";
import { Banknote, ListOrdered, Mail, ShieldAlert, BarChart3, Scale, BrainCircuit } from "lucide-react";

export const AccountsReceivableCatalog = () => (
  <DomainCatalogSlide
    title="Accounts Receivable & Collections"
    subtitle="Domain 23 - AR & Collections"
    description="Transforming receivables from reactive chasing to predictive intelligence -- automated cash application, ML-prioritized collections, and LLM-drafted communications that adapt tone to customer context and payment history."
    color="#0e7490"
    useCases={[
      {
        id: "uc-2301",
        title: "Cash Application Agent",
        icon: Banknote,
        description: "ML matching of payments to invoices with LLM interpretation of ambiguous remittance advice and deduction validation."
      },
      {
        id: "uc-2302",
        title: "Collections Priority Engine",
        icon: ListOrdered,
        description: "Payment behavior scoring with LLM contextual interpretation of customer signals beyond aging data."
      },
      {
        id: "uc-2303",
        title: "Dunning Communication Drafter",
        icon: Mail,
        description: "Context-appropriate dunning communications that adapt tone from courtesy reminder to final notice based on relationship history."
      },
      {
        id: "uc-2304",
        title: "Credit Risk Scorer",
        icon: ShieldAlert,
        description: "Predictive credit scoring combining bureau data with LLM analysis of financial filings and news signals."
      },
      {
        id: "uc-2305",
        title: "AR Aging & DSO Analyzer",
        icon: BarChart3,
        description: "DSO trending with segment-level collection analysis and LLM-generated narrative explaining aging migration drivers."
      },
      {
        id: "uc-2306",
        title: "Dispute Resolution Agent",
        icon: Scale,
        description: "Automated dispute categorization with LLM cross-referencing of delivery records, contracts, and customer communications."
      },
      {
        id: "uc-2307",
        title: "Customer Payment Predictor",
        icon: BrainCircuit,
        description: "ML payment date prediction with LLM interpretation of qualitative signals like ERP migrations and CFO transitions."
      }
    ]}
  />
);
