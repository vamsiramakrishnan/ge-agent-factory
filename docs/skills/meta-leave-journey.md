# Master Journey: Enterprise Leave Planning Meta-Skill

## Name
leave-planning-journey

## Purpose & Scope
This is a **Meta-Skill** that orchestrates complex, multi-system workflows. It references and combines two distinct Agent Skills:
1.  `leave-application-sop` (via `leave-mcp-system`)
2.  `coverage-delegation-sop` (via `coverage-mcp-system`)

In a true Enterprise, applying for leave is not a single API call; it is a cross-system journey. You must weave these two skills together sequentially to provide a seamless conversational experience to the employee.

---

## The Master Journey Workflow

When an employee initiates a leave request, you MUST execute the following cross-system workflow. Do not skip steps. Use Progressive Disclosure—only ask the user for information when you hit a blocker in the workflow.

### Phase 1: Context & Balance (Leave System)
1.  **Reference `leave-application-sop` Step 2**: Silently query the `leave-cli balance` to check if they have enough days. 
2.  Extract their `country` and `tenureYears`.
    *   *(If they lack balance, halt the journey and inform them).*

### Phase 2: Compliance & Documentation (Leave System)
3.  **Reference `leave-application-sop` Step 3**: Query `leave-cli policy -c <country>`.
4.  Determine if their specific request requires a documented reason (e.g., a medical certificate). 
    *   *(If so, pause and ask the user to provide the reason/confirmation of the certificate).*

### Phase 3: Team Impact & Coverage (Coverage System)
*At this point, the leave is mathematically and legally valid, but we must check business continuity.*
5.  **Reference `coverage-delegation-sop` Step 1**: You need their `teamId`. Ask the user for their team ID if you don't have it in context.
6.  Query `coverage-cli check -t <teamId> -s <startDate> -e <endDate>`.
7.  Inform the user of the coverage impact. If it drops below compliance, warn them that HR override is required.

### Phase 4: Delegation of Authority (Coverage System)
8.  Ask the user: *"Who will be covering your tasks and approvals while you are away?"* (Obtain a `delegateeId`).
9.  **Reference `coverage-delegation-sop` Step 3**: Execute `coverage-cli delegate` using an `Idempotency-Key`.
    *   *Crucial*: The Coverage API enforces DOA rules. If their chosen delegate is too junior (lower Job Grade) or is also on leave, the API will reject it. You must explain the error and ask for a different delegate. **Do not proceed to Phase 5 until a delegate is successfully assigned.**

### Phase 5: Final Execution (Leave System)
10. With coverage secured and a delegate assigned, return to the Leave System.
11. **Reference `leave-application-sop` Step 5**: Execute `leave-cli apply` using a *new* `Idempotency-Key`.
12. Give the user a final summary, including their `applicationId`, their `delegationId`, and the projected team coverage percentage during their absence.
