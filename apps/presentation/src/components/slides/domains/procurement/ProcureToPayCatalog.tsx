import React from "react";
import { DomainCatalogSlide } from "../../../agent/DomainCatalogSlide";
import { Inbox, FileOutput, GitMerge, ScanLine, CopyMinus, ShieldAlert, Wallet, PackageCheck, Timer, SlidersHorizontal, CreditCard } from "lucide-react";

export const ProcureToPayCatalog = () => (
  <DomainCatalogSlide
    title="Procure-to-Pay Operations"
    subtitle="Domain 15 • Procure-to-Pay"
    description="Transforming the transactional backbone of procurement — requisitions, purchase orders, invoices, and payments — from manual exception-handling to AI-driven straight-through processing."
    color="#ca8a04"
    useCases={[
      {
        id: "uc-1501",
        title: "Requisition Intake & Smart Routing",
        icon: Inbox,
        description: "NLP classification of free-text requisitions with LLM interpretation and smart approval routing."
      },
      {
        id: "uc-1502",
        title: "Purchase Order Auto-Generation",
        icon: FileOutput,
        description: "Contract-to-PO mapping with LLM handling non-standard requests requiring SOW interpretation."
      },
      {
        id: "uc-1503",
        title: "Three-Way Match Exception Handler",
        icon: GitMerge,
        description: "Fuzzy matching with LLM reading invoice descriptions to resolve exceptions rule engines cannot."
      },
      {
        id: "uc-1504",
        title: "Invoice Data Extraction",
        icon: ScanLine,
        description: "OCR/NLP extraction with LLM handling handwritten invoices and ambiguous line items."
      },
      {
        id: "uc-1505",
        title: "Duplicate Payment Detector",
        icon: CopyMinus,
        description: "ML clustering with LLM distinguishing true duplicates from legitimate similar invoices."
      },
      {
        id: "uc-1506",
        title: "Maverick Spend Detector & Nudge",
        icon: ShieldAlert,
        description: "Classification with LLM-generated personalized nudges addressing the why behind off-contract behavior."
      },
      {
        id: "uc-1507",
        title: "Payment Optimization Agent",
        icon: Wallet,
        description: "Dynamic discounting optimization with LLM-generated treasury briefings on payment strategy."
      },
      {
        id: "uc-1508",
        title: "Goods Receipt & Service Entry Validator",
        icon: PackageCheck,
        description: "Data matching with LLM validating service entry sheets against SOW deliverables."
      },
      {
        id: "uc-1509",
        title: "P2P Cycle Time Analyzer",
        icon: Timer,
        description: "Process mining with LLM translating bottleneck analysis into organizational recommendations."
      },
      {
        id: "uc-1510",
        title: "Approval Workflow Optimizer",
        icon: SlidersHorizontal,
        description: "Pattern analysis with LLM reasoning about rubber-stamping causes and threshold optimization."
      },
      {
        id: "uc-1511",
        title: "P-Card Reconciliation Agent",
        icon: CreditCard,
        description: "Auto-categorization with LLM interpreting cryptic merchant descriptions and receipt validation."
      }
    ]}
  />
);
