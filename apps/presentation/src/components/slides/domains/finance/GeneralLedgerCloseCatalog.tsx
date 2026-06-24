import React from "react";
import { DomainCatalogSlide } from "../../../agent/DomainCatalogSlide";
import { BookOpen, ArrowLeftRight, CheckSquare, ListChecks, Clock, FileCheck, BarChart3, AlertTriangle } from "lucide-react";

export const GeneralLedgerCloseCatalog = () => (
  <DomainCatalogSlide
    title="General Ledger & Close"
    subtitle="Domain 21 • GL & Close"
    description="Compressing the close cycle from 8-10 days to 3-4 days through automated journal posting, intelligent reconciliation, close orchestration, and continuous GL anomaly detection."
    color="#1d4ed8"
    useCases={[
      {
        id: "uc-2101",
        title: "Journal Entry Auto-Posting",
        icon: BookOpen,
        description: "Automated journal entry creation from sub-ledger transactions with ML classification and non-standard transaction handling."
      },
      {
        id: "uc-2102",
        title: "Intercompany Reconciliation",
        icon: ArrowLeftRight,
        description: "Cross-entity IC balance matching with fuzzy matching, currency normalization, and mismatch investigation."
      },
      {
        id: "uc-2103",
        title: "Account Reconciliation Agent",
        icon: CheckSquare,
        description: "Automated balance sheet substantiation with auto-matching, risk-based prioritization, and contract-aware validation."
      },
      {
        id: "uc-2104",
        title: "Close Checklist Orchestrator",
        icon: ListChecks,
        description: "60+ close task management across 15+ team members with dependency enforcement, delay prediction, and status interpretation."
      },
      {
        id: "uc-2105",
        title: "Accruals & Deferrals Engine",
        icon: Clock,
        description: "Contract-aware accrual calculation for uninvoiced receipts with automatic reversal posting in subsequent periods."
      },
      {
        id: "uc-2106",
        title: "Trial Balance Validator",
        icon: FileCheck,
        description: "Pre-close trial balance validation with anomaly detection on account balances and cross-validation against sub-ledgers."
      },
      {
        id: "uc-2107",
        title: "Month-End Close Analytics",
        icon: BarChart3,
        description: "Post-close performance analytics with cycle time tracking, bottleneck identification, and retrospective narrative generation."
      },
      {
        id: "uc-2108",
        title: "GL Anomaly Detector",
        icon: AlertTriangle,
        description: "Continuous GL posting surveillance with Benford's Law analysis, duplicate detection, and contextual anomaly investigation."
      }
    ]}
  />
);
