---
type: Index
title: Eval Scenarios
description: "How each Query Capability is tested: the mechanisms (tools) a test must exercise."
timestamp: "2026-07-01T00:00:00.000Z"
---

# Eval Scenarios

- [Retrieve pre-payroll benefits exceptions for employee EMP101. Verify their enrollment status in SAP S/4HANA FI, retrieve BlackLine wellness expense reports and deductions, check the benefits runbook, and if eligible, resolve the discrepancy under safety thresholds.](/tests/happy-path-reconciliation.md)
- [Evaluate benefits exception EXC102 for Bob Jones (employee ID EMP102). Verify their SAP S/4HANA FI enrollment details and BlackLine premium deductions, and process correction if safe under runbook procedures.](/tests/escalation-high-variance.md)
- [Evaluate benefits exception EXC103 for Charlie Brown (employee ID EMP103). Verify their SAP S/4HANA FI employee record and sync their payroll enrollment if possible.](/tests/refusal-inactive-employee.md)
