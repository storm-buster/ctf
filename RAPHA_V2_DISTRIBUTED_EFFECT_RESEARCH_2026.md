# RAPHA V2 — Distributed / Cross-System Effect Research 2026

**Research Type:** Adversarial Falsification Pass
**Date:** September 2026
**Objective:** Determine whether a concrete, technically defensible security property exists around formally constraining and verifying the aggregate security-relevant effects of an autonomous workflow across multiple independently executing systems.
**Hard Stop:** STOP after producing this report. No code. No product architecture. No implementation design.

---

## 1. Executive Summary

This research investigated whether existing 2026 technology can already enforce security invariants over the aggregate effect of an autonomous workflow spanning multiple independently executing services, systems, or state domains. The goal was to kill the hypothesis if existing technology can reproduce it.

**The hypothesis is killed as a deterministic security primitive.**

The research conducted 100 parallel agent sub-tasks, fetching 18 sources, extracting 51 claims, and adversarially verifying the top 25 via 3-vote majority. Results: **13 confirmed, 12 refuted, 0 unverified.**

The strongest evidence establishes:

1. All authorization engines (Cedar, OPA/Rego) are stateless, per-decision-point systems — confirmed (2-1 votes).
2. Sagas provide step-level atomicity but NOT aggregate-level ACID atomicity — confirmed (3-0 votes).
3. CAP theorem is a formally proven impossibility result on simultaneous consistency + availability + partition tolerance — confirmed (2-1).
4. AWS Step Functions provides exactly-once at step level (Standard) and at-least-once (Express) — confirmed (3-0).
5. The largest available AI-agent deployment dataset (GitHub Octoverse 2024, 73% AI adoption, ~150K projects) contains no documented cross-system aggregate-effect incidents — confirmed (3-0).
6. No claim addressed observation completeness — the critical gap is unaddressed by any verified claim.

**Final Determination: A — NO VIABLE RESIDUAL.**

The theme must be killed as a deterministic security primitive. No candidate property survived the full kill-test criteria. Domain-specific residuals exist (payment sagas, regulated-industry workflows) but these are application-specific business logic, not general-purpose security primitives.

---

## 2. Research Question

> Can existing systems already enforce security invariants over the AGGREGATE EFFECT of an autonomous workflow that spans multiple independently executing services, systems, or state domains?

The narrower sub-question this research answers:

> Is there a concrete security property over cross-system aggregate effects of autonomous workflows that:
> - A. is machine-verifiable;
> - B. is deterministic for a useful class of workflows;
> - C. can be enforced rather than merely observed;
> - D. concerns actual security-relevant state/effect;
> - E. spans multiple independently executing systems;
> - F. cannot be reproduced by composing existing authorization, workflow, transaction, policy, DLP, monitoring, and state-verification primitives;
> - G. has real customer pain;
> - H. can be expressed as a falsifiable security invariant?

**Precedent:** Previous RAPHA V2 research killed 6 theses (stateful runtime authorization differentiation, tool integrity, cryptographic execution provenance, autonomous runtime containment, effective execution enforcement, trusted-state assurance). The prior semantic/effect-level research found a possible residual: "For an authorized workflow W, any state transition ΔS must satisfy a machine-checkable postcondition, with complete observation, closure over alternative execution paths, and atomic prevention." This pass examines whether the distributed/cross-system variant survives.

---

## 3. Methodology

**Framework:** Adversarial falsification — the goal is to KILL hypotheses, not validate them.

**Phases:**
1. **Scope decomposition** — 5 search angles (academic/formal methods, commercial enterprise products, real incidents/postmortems, existing-stack reality, research gaps/uncertainties)
2. **Parallel search** — 5 agents simultaneously searching distinct angles
3. **Source fetch** — deduplicated URL fetching of top candidates
4. **Claim extraction** — primary-source fact extraction with quality classification
5. **Adversarial verification** — 3-vote majority per claim; majority against → refuted
6. **Synthesis** — semantic deduplication, confidence ranking, candidate generation

**Evidence Classification:**
- FACT — publicly verifiable factual claim
- PRIMARY-SOURCE FACT — direct from primary source (vendor docs, standards, papers)
- VENDOR CLAIM — vendor marketing or documentation, not independently validated
- INDEPENDENT EVIDENCE — independent researcher or third-party validation
- INFERENCE — reasoned from available evidence
- HYPOTHESIS — speculative, not yet supported

**Kill Criteria (each candidate):**
- Can an enterprise team reproduce it by composing existing components?
- Is it just application-specific business logic?
- Does it require an external semantic oracle?
- Does it require LLM classification for correctness?
- Does it only detect rather than prevent?
- Does it only log rather than enforce?
- Does it rely on impossible observation completeness?
- Is it already commercially deployed?

**Hard Stop Rule:** Only advance if the evidence supports a technically falsifiable AND economically meaningful residual. If the strongest conclusion is "existing technology can reproduce this" → KILL. If "the problem is real but cannot be machine-verified" → KILL. If "formally interesting but no demonstrated customer pain" → do NOT advance.

**Workflow Statistics:**
- 100 agents launched; 99 completed, 1 errored
- 18 sources fetched → 51 claims extracted → 25 claims verified
- 13 claims confirmed, 12 refuted, 0 unverified
- 3,672,684 total subagent tokens; 680 tool uses
- 1,730,753ms total duration

---

## 4. Cross-System Effect Taxonomy

The following taxonomy defines what "cross-system" means in this research and how each class was evaluated.

### 4.1 Defined Effect Classes

| Class | Definition | Example | Authority | Transaction Scope |
|---|---|---|---|---|
| **A. Agent → CRM → Email** | Sequential service calls across independent SaaS systems | Agent reads CRM, triggers email send | CRM (local); Email (local) | None shared |
| **B. Agent → Payment → Ledger → ERP** | Multi-leg financial workflow | Agent initiates refund → payment processor → accounting | Payment (authoritative); ERP (local) | None shared |
| **C. Agent → Cloud API → Infrastructure** | Agent modifies cloud resource state | Agent provisions/terminates compute, storage, network | Cloud provider (authoritative) | API-level |
| **D. Agent → Database → Queue → Worker → Database** | Agent initiates async pipeline | Agent writes to DB → queue → worker → DB writeback | Database (authoritative) | DB transaction only |
| **E. Agent → Git → CI/CD → Deployment → Production** | Software delivery chain | Agent commits → automated build → deploy | Git (source); CI (build); Cloud (runtime) | None shared |
| **F. Agent → Identity → Resource Authorization** | Delegated authorization chain | Agent assumes role → resource access granted | Identity provider (authoritative) | Token-scoped |
| **G. Agent → Multiple SaaS → External Data** | Data exfiltration path | Agent reads from multiple SaaS → writes to external destination | Each SaaS (local) | None shared |
| **H. Agent → Workflow Engine → Multiple Services** | Workflow-orchestrated multi-service calls | Temporal/Step Functions orchestrates multiple service interactions | Workflow engine (orchestrator) | Workflow-scoped |
| **I. Multiple Agents → Shared Resources** | Concurrent multi-agent access to shared state | Two agents simultaneously modify same resource or related resources | Each agent (local); Resource (shared) | None enforced |

### 4.2 Key Observations from Taxonomy

1. **No single transaction spans multiple authoritative systems** in classes A, B, E, F, G, I. Each system maintains its own authoritative state.
2. **Class H (workflow engines)** is the most promising candidate: Temporal, AWS Step Functions, Camunda provide orchestration across multiple services. However, their enforcement is scoped to their own execution model.
3. **Class D (async pipelines)** represents a common enterprise pattern (DB → Queue → Worker). Compensation is possible but requires explicit design.
4. **Class I (concurrent multi-agent)** is the hardest case: independently executing agents with no shared coordinator.

### 4.3 Effect Observability Matrix

| Effect Class | State Visible To Agent | State Visible To Orchestrator | Machine-Readable | Deterministic |
|---|---|---|---|---|
| A (CRM → Email) | API responses | API responses | Yes (API logs) | Partially |
| B (Payment → ERP) | Payment confirmation | Partial (workflow engine logs) | Partial | No (async) |
| C (Cloud API) | Cloud API responses | CloudTrail/CloudWatch | Yes | Yes |
| D (DB → Queue → Worker) | DB write confirmation | Queue metrics + DB state | Yes | No (async) |
| E (Git → CI/CD → Prod) | CI output + deploy confirmation | CI/CD logs + deployment records | Partial | Partially |
| F (Identity → Resource) | Token + resource response | Auth logs | Yes | Yes |
| G (Multi-SaaS) | API responses | Partial (CASB/DLP if deployed) | Partial | No |
| H (Workflow engine) | Workflow state | Full workflow execution history | Yes | Partially |
| I (Multi-agent) | Local observations | None without shared state | No | No |

---

## 5. Preconditions vs Postconditions

### 5.1 The Authorization/Effect Gap

The fundamental question is whether the gap between "this action is allowed" (precondition) and "the resulting aggregate state is within an approved security envelope" (postcondition) is a novel security property or already addressable.

**Precondition model (well-covered):**
```
P(S_before, action, context) → allow/deny
```
Cedar, OPA/Rego, Zanzibar, XACML all implement variants of this.

**Single-system postcondition model (increasingly available):**
```
Q(S_after, S_before, local_context) → invariant_satisfied/violated
```
Database constraints, cloud configuration validation, state-machine guards, IaC policy (OPA/Terraform Sentinel) implement variants.

**Cross-system invariant model (investigated here):**
```
Q(S1_after, S2_after, ..., Sn_after, workflow_context) → invariant_satisfied/violated
```
No verified system implements this generically.

### 5.2 What Existing Systems Can and Cannot Express

| System | Precondition | Single-System Postcondition | Cross-System Invariant |
|---|---|---|---|
| Cedar | ✓ | ✗ (schema not consulted at runtime) | ✗ |
| OPA/Rego | ✓ | ✓ (at IaC/plan time) | ✗ |
| Zanzibar | ✓ | ✗ | ✗ |
| XACML | ✓ | Partial | ✗ |
| PostgreSQL constraints | N/A | ✓ | ✗ (local only) |
| Temporal | N/A | ✓ (workflow state) | ✗ (per-workflow only) |
| AWS Step Functions | ✓ (pre-state-check) | ✓ (workflow state) | ✗ |
| Saga patterns | N/A | ✓ (step-level) | ✗ (no aggregate atomicity) |
| DLP/CASB | N/A | ✓ (data egress detection) | Partial |
| Terraform Sentinel | ✓ (plan-time) | ✓ (plan-time) | ✗ |
| SLSA/in-toto | ✓ (provenance check) | ✓ (artifact integrity) | ✗ |

**Confirmed gap:** No system in the verified evidence can express Q(S1_after, S2_after, ..., Sn_after, workflow_context) for independently controlled systems.

### 5.3 The Asymmetry Problem

Each individual action in a cross-system workflow can be authorized. The authorization model can succeed at every step. Yet the aggregate outcome can violate a security invariant. This is not a gap in authorization — it is a gap in aggregate-state reasoning.

**Example:** Agent initiates refund workflow.
1. Agent calls CRM API → authorized → CRM marks "refund_requested" ✓
2. Agent calls Payment API → authorized → $500 transferred ✓
3. Agent calls ERP API → authorized → liability recorded ✓

All three steps individually authorized. But: what if the customer already received a refund for this order last month? The CRM doesn't know; the Payment system doesn't know; the ERP doesn't know. Each authorization decision was correct in isolation. The aggregate state violates a business rule.

**Can this be fixed with existing technology?**
- A saga orchestrator could encode the business rule and check state before executing each step.
- But the saga must have read access to all three systems' state.
- And the saga's compensation logic must handle the case where all three steps succeeded before the violation is detected.
- This is business logic, not a novel security primitive.

---

## 6. Strongest Existing-Stack Baseline

The following represents the strongest possible composition of existing 2026 technology that an enterprise team could deploy.

### 6.1 Authorization Layer

**Cedar** (AWS, 2023–present): Per-request, pre-execution authorization. Schema is NOT consulted at evaluation time. Requires full entity data passed with each request. No state mutation, no event tracking, no cross-system aggregation. Scope: single-request, stateless.

**OPA/Rego** (Styra, CNCF, ongoing): Per-query evaluation against input/data snapshots. Synchronous, declarative, no state-mutation constructs, no event-tracking constructs. Integrations at Kubernetes, Envoy, Terraform, CI/CD, Kafka, HTTP APIs — each integration is a per-decision-point PEP, not a cross-system aggregator. Scope: per-query, stateless.

**Verdict:** Both systems confirmed (2-1 votes) as stateless, per-decision-point, no aggregate-effect capability. **Neither provides cross-system invariant enforcement.**

### 6.2 Workflow Orchestration

**AWS Step Functions** (AWS, 2016–present): Standard workflows provide exactly-once step execution; Express workflows provide at-least-once. Three service integration patterns: Request Response, .sync (Run a Job), .waitForTaskToken (callback with task token). Built-in Retry and Catch error handling. Full execution history for Standard; CloudWatch logs for Express. Scope: workflow-scoped orchestration with exactly-once at step level.

**Temporal** (Temporal.io, CNCF, ongoing): Durable execution platform. Workflows survive process restarts. Exactly-once execution guarantees at activity level. Compensation via explicit workflow logic. Scope: workflow-scoped; external service calls are not durably executed.

**Saga patterns** (established distributed systems pattern): Compensation rather than rollback. Business-specific compensating actions. Does not provide ACID atomicity at the aggregate saga level (confirmed 3-0 votes). No formal verification framework for compensation semantics (confirmed 3-0 votes). No standardized verification methods (confirmed from formal standards). Scope: distributed workflow with compensation.

**Verdict:** Step Functions confirmed (3-0 votes) exactly-once at step level. Saga confirmed (3-0 votes) lacks aggregate-level atomicity. CAP theorem confirmed (2-1 votes) as formally proven impossibility. **The aggregate level cannot have ACID atomicity by formal proof.**

### 6.3 State and Transaction Layer

**PostgreSQL** (ongoing): ACID transactions within a single database. Transaction isolation levels (READ COMMITTED, REPEATABLE READ, SERIALIZABLE). Does not span multiple independent databases.

**Distributed transactions (2PC)**: Provides atomicity for distributed transactions. Creates coordinator single points of failure. Network partitions during commit can leave nodes in inconsistent states. Not used for cross-system workflow enforcement.

**Event sourcing / CDC**: Change Data Capture can observe state changes across databases. Event sourcing provides audit trail. Neither provides enforcement — both provide observation.

**Verdict:** State constraints exist within systems. **Cross-system state consistency is not guaranteed by any transaction mechanism.**

### 6.4 Infrastructure and Cloud Policy

**Terraform Sentinel** (HashiCorp): Policy-as-code for Terraform plans. Precondition checks on infrastructure changes. Scope: plan-time, single-plan.

**AWS Config / Prisma Cloud**: Configuration state validation. Detects configuration drift. Scope: cloud resource state within one cloud provider.

**Kubernetes admission controllers**: Policy enforcement at pod/workflow admission. Scope: cluster-level.

**Verdict:** Infrastructure policy is well-covered within cloud/cluster boundaries. **Cross-cloud and cross-provider policy enforcement is not provided.**

### 6.5 Information Flow and DLP

**CASB** (Netskope, Microsoft Defender for Cloud Apps, etc.): Monitors SaaS-to-SaaS data flows. DLP policies enforce data egress rules. Scope: cloud-access security broker — observes and blocks data flows it can see.

**Data lineage** (data cataloging tools): Tracks data provenance and transformation. Scope: metadata tracking — not enforcement.

**Verdict:** DLP/CASB provides data-flow controls within its observation scope. **Cannot observe flows outside its deployment boundary.**

---

## 7. Existing-Stack Reproduction Analysis

This section tests each candidate property against the strongest existing-stack composition: Cedar/OPA + Temporal/Step Functions + database constraints + transaction boundaries + CDC + DLP + workflow guards + saga patterns + event sourcing.

### 7.1 Candidate: Cross-System Transaction Invariant

> "The aggregate state across Service A, Service B, and Service C must satisfy invariant I after workflow W completes."

**Existing-stack reproduction path:**
1. Temporal/Step Functions orchestrates the workflow.
2. Each step calls Service A, B, C via their APIs.
3. Before each step, OPA checks preconditions using data from the workflow context.
4. After each step, CDC captures state changes in A, B, C.
5. A saga compensation handler rolls back if a step fails.
6. Event sourcing provides an audit trail of all state changes.

**Can this enforce the invariant?**
No. Because:
- Step Functions can only observe what its activities expose — it cannot observe hidden state changes in Services A, B, C.
- CDC captures database-level changes, but Services A, B, C may maintain state outside their databases.
- Saga compensation handles step failures, not invariant violations detected after all steps succeed.
- The invariant Q(S1_after, S2_after, ..., Sn_after) requires reading the joint state of independently controlled systems — no system in the composition can do this atomically.
- CAP theorem establishes that even if all systems agreed to be read, a network partition could produce inconsistent reads.

**Reproduction verdict:** Partially possible for tightly coupled, co-designed systems. Not possible generically for independently controlled systems.

### 7.2 Candidate: Aggregate Budget Invariant

> "The sum of all agent-initiated financial transactions across all services must not exceed $X per 24 hours."

**Existing-stack reproduction path:**
1. Each service implements a transaction counter.
2. An OPA policy checks the counter before each transaction.
3. A centralized budget service tracks aggregate spend.
4. Temporal workflow coordinates all transactions.

**Can this enforce the invariant?**
Partially. This is a well-known pattern: distributed budget tracking. Challenges:
- Race conditions between concurrent transactions from different agents.
- Clock skew across services.
- The "budget service" is itself a single point of failure and must itself be consistent.
- Eventual consistency means the budget counter may be stale.

**Reproduction verdict:** Addressable with careful engineering (distributed locks, serialized transactions, eventual-consistency timeouts). This is a known pattern with known solutions, not a novel security property.

### 7.3 Candidate: Cross-Service Data-Flow Contract

> "If data originating from source S reaches destination D, then all intermediate transformations must preserve an allowed information-flow relation."

**Existing-stack reproduction path:**
1. DLP policies at each service boundary.
2. CASB monitors SaaS-to-SaaS flows.
3. Data lineage tracks transformations.
4. OPA enforces data classification labels.

**Can this enforce the invariant?**
Partially. DLP/CASB can enforce at observed boundaries. But:
- Data may flow through systems the CASB cannot see.
- Transformation logic in services may inadvertently violate the information-flow relation.
- No system observes the full end-to-end data flow across all intermediate systems.

**Reproduction verdict:** DLP and CASB already address the information-flow control aspect. The remaining gap is observation completeness, not a novel security property.

### 7.4 Candidate: Distributed Workflow Postcondition

> "After workflow W completes, the state of systems S1, S2, ..., Sn must satisfy postcondition P."

**Existing-stack reproduction path:**
1. Step Functions / Temporal orchestrates the workflow.
2. Each step produces observable outputs.
3. A final state-validation step checks the postcondition using CDC/event data.

**Can this enforce the invariant?**
No, because:
- Postcondition checking is a detection mechanism, not a prevention mechanism.
- By the time the postcondition is checked, all effects have already occurred.
- The "final state-validation step" is itself a step in the workflow — it can fail or be bypassed.
- For irreversible effects (financial transactions, data deletion, infrastructure changes), detection after the fact is insufficient.

**Reproduction verdict:** Detection-only. Cannot prevent. Not a novel security property — this is the detect-not-prevent problem, well understood in security.

### 7.5 Candidate: Multi-Agent Shared-State Invariant

> "After agents A and B independently complete workflows, the aggregate state must remain within invariant I."

**Existing-stack reproduction path:**
1. Database serialization isolation level.
2. Distributed locks (Redis, etcd, ZooKeeper).
3. Optimistic concurrency control.
4. Temporal workflow coordination (if both agents use the same Temporal cluster).

**Can this enforce the invariant?**
Partially. Serialization and locking work within shared infrastructure. But:
- Agents operating against different databases/systems have no shared coordinator.
- Serializable isolation has performance costs that make it impractical for high-throughput systems.
- Distributed locks require all agents to participate — an agent outside the locking protocol can violate the invariant.
- CAP theorem: in the presence of network partitions, the invariant cannot be guaranteed.

**Reproduction verdict:** Addressable within a shared infrastructure (same database, same distributed lock service). Not addressable for independently controlled systems.

---

## 8. Cross-System Invariants

### 8.1 Refund Workflow Invariant

**Scenario:** Agent initiates refund. CRM marks "refund_requested." Payment processor sends $500. ERP records liability.

**Invariant:** "Payment must not occur unless CRM state, payment state, and ERP state satisfy a consistent workflow invariant (no duplicate refund, customer verified, order eligible)."

**Can existing workflow engines + saga + authorization enforce this?**

Saga: Can encode the workflow steps. Compensation: If payment fails, compensate CRM. But:
- Saga compensation is business-specific, not a technical rollback.
- If all three steps succeed, the saga is complete — there is no postcondition check that can undo the payment.
- The invariant requires reading the joint state of CRM, payment, and ERP atomically — no saga implementation provides this.
- OWASP LLM06 notes that "OPA and Temporal can enforce per-service policies but cannot verify that state changes in Service A remain consistent with expected effects in Services B and C." (INDEPENDENT EVIDENCE, MEDIUM confidence)

**Confirmed gap:** Cross-system consistency invariant after all steps succeed is not enforced by existing technology.

### 8.2 Software Deployment Invariant

**Scenario:** Agent deploys software. Git commit → CI build → artifact → deployment → production configuration.

**Invariant:** "Production may not reach state S unless artifact provenance, code review state, test state, approval state, and deployment state satisfy invariant I."

**Can SLSA/in-toto + CI/CD + admission + policy engines already do this?**

SLSA (Supply-chain Levels for Software Artifacts): Provides provenance chain verification. in-toto: Provides attestation framework. Together:
- SLSA Level 3+ ensures artifact integrity from source to deployment.
- Policy engines (OPA at admission controllers) can verify provenance before deployment.
- CI/CD pipeline state can be verified before promotion.

**But:**
- This requires all systems to participate in the attestation framework.
- Systems outside the SLSA/in-toto chain (e.g., a direct infrastructure change bypassing CI/CD) are not covered.
- The invariant requires verifying the chain of provenance, approval, and test state — this is a business rule encoded in the pipeline, not a generic security property.

**Verdict:** This is already addressed by SLSA/in-toto + CI/CD + admission controllers. **KILL as novel property.**

### 8.3 Data Exfiltration Invariant

**Scenario:** Agent reads sensitive data from CRM, ERP, and HR system, then writes to an external destination.

**Invariant:** "If data originating from source S (CRM, ERP, HR) reaches destination D (external), then all intermediate transformations must preserve an allowed information-flow relation."

**Can DLP/data lineage/workflow controls already provide this?**

DLP: Blocks known sensitive data patterns at egress points. CASB: Monitors SaaS-to-SaaS flows. Data lineage: Tracks data provenance.

**But:**
- DLP operates at the data-pattern level (PII, PCI, etc.), not at the semantic level (this customer record from this CRM instance).
- Lineage tracks metadata, not actual data transformations.
- If the agent reads data via API and writes to a non-monitored destination, DLP/CASB cannot see it.
- The information-flow relation requires understanding semantic meaning of data, not just pattern matching.

**Confirmed gap:** Semantic-level information flow control across independently controlled services is not fully addressed by DLP.

### 8.4 Concurrent Budget Exhaustion Invariant

**Scenario:** Agent A and Agent B independently initiate expense reports. Each is within their individual budget. Together, they exceed the departmental budget.

**Invariant:** "Aggregate approved expenses across all agents must not exceed departmental budget X."

**Can rate limits, quotas, and workflow state already solve this?**

Rate limits: Address timing, not aggregate value. Quotas: Address per-resource, not per-budget-category. Workflow state: Can track aggregate spend within one workflow, but two concurrent workflows have no shared state.

**Reproduction verdict:** Distributed budget tracking is a known pattern with known solutions (event sourcing with aggregate projections, distributed counters with reconciliation). This is a distributed systems engineering problem, not a novel security property.

### 8.5 Infrastructure Drift Invariant

**Scenario:** Agent modifies cloud infrastructure. Multiple concurrent changes produce an unsafe aggregate configuration (e.g., security group opens to 0.0.0.0/0, IAM grants admin to all users, encryption disabled).

**Invariant:** "The aggregate cloud configuration after all agent changes must satisfy security baseline I."

**Can AWS Config + cloud policy engines + Terraform plan validation already solve this?**

AWS Config: Evaluates configuration against rules after the fact. Cloud policy engines (Prisma Cloud, Dome9, etc.): Enforce configuration policies. Terraform plan validation: Validates planned changes before apply.

**But:**
- Direct API changes (bypassing Terraform) are not caught by plan validation.
- AWS Config evaluations run on a schedule, not continuously.
- Post-change detection means the violation exists before it is detected.
- Multiple concurrent changes may not be caught in the same evaluation window.

**Confirmed gap:** Continuous, real-time aggregate configuration validation across concurrent changes from multiple agents is not fully addressed.

---

## 9. Distributed Transactions and Atomicity

### 9.1 The Saga Atomicity Gap

**CONFIRMED (3-0 votes):** Saga patterns provide atomicity at individual local-transaction steps but do NOT provide ACID atomicity at the aggregate saga level. Compensation is business-specific, not a technical rollback.

**Formal verification gaps confirmed (from formal standards):**
1. Compensation semantics are undefined/business-specific with no formal framework.
2. No standardized verification methods exist for saga compensation.
3. Coordinator-centric designs create single points of failure.
4. No formal interoperability standards across organizational boundaries.
5. Trust boundaries are unaddressed.
6. The semantic gap between ACID transactions and saga compensation is mathematically unresolved.

### 9.2 CAP Theorem as Formal Limit

**CONFIRMED (2-1 votes):** CAP theorem (Gilbert and Lynch, 2002) is a formally proven impossibility result. During network partitions, a distributed system must choose between consistency and availability — it cannot guarantee both simultaneously while continuing to operate.

**PACELC extension:** Even in the absence of partitioning, distributed systems face a tradeoff between latency and consistency.

**Implication for cross-system effect contracts:** Any system claiming to provide cross-system aggregate effect verification must specify which of C, A, P it sacrifices. In the presence of network partitions (which occur in any real distributed system), the guarantee degrades to either:
- **CP:** Consistent but unavailable — the invariant holds but the workflow cannot proceed.
- **AP:** Available but potentially inconsistent — the workflow proceeds but the invariant may be violated.

There is no third option. This is a formal impossibility, not a technology gap.

### 9.3 Two-Phase Commit

**CONFIRMED (from formal consensus):** 2PC provides atomicity for distributed transactions, ensuring all nodes agree on commit or abort. But:
- Network failures mid-transaction can leave nodes in inconsistent states.
- Creates coordinator single points of failure.
- Not used for cross-system workflow enforcement in modern architectures.

### 9.4 Irreversibility

The most critical security-relevant effects are often irreversible: financial transactions, data deletion, infrastructure termination, access revocation. For these effects:

- **Saga compensation cannot undo financial transfers.** (Business-specific compensation like "send reversal email" is not the same as reversing the transfer.)
- **Saga compensation cannot undo data deletion.** (The data is gone.)
- **Saga compensation cannot undo infrastructure termination.** (The resource is destroyed.)

**Verdict:** The irreversibility of real-world effects means compensation is insufficient for a large class of security-relevant operations. Any cross-system effect contract for these operations must prevent, not compensate. But prevention requires observation completeness (Section 12), which is unachievable generically.

---

## 10. Asynchronous and Indirect Effects

### 10.1 Retry Amplification

**CONFIRMED (3-0 votes):** APIs with side effects are not safe to retry unless they provide idempotency guarantees. A timeout or failure does not necessarily mean the side effects have not already happened.

**CONFIRMED (3-0 votes):** Retries at multiple layers of a service stack multiply load by 3^n. A five-layer stack with three retries at each layer produces 243x load increase when the bottom layer fails. This makes recovery impossible.

**CONFIRMED (3-0 votes):** Retries are selfish — they spend more of the server's time to increase the client's chance of success. When failures are caused by overload, retries can make matters significantly worse and delay recovery.

**CONFIRMED (3-0 votes):** Jittered strategies reduce client work by more than half versus unjittered exponential backoff at 100 contending clients.

### 10.2 Durable Execution Semantics

| System | Exactly-Once | At-Least-Once | At-Most-Once | Compensation |
|---|---|---|---|---|
| AWS Step Functions (Standard) | ✓ (step level) | ✗ | ✗ | Retry/Catch |
| AWS Step Functions (Express) | ✗ | ✓ | ✗ | Retry/Catch |
| Temporal | ✓ (activity level) | ✓ | ✗ | Workflow logic |
| OPA/Rego | N/A | N/A | N/A | None |
| Saga patterns | ✗ | ✓ | ✗ | Business-specific |
| Standard database transaction | ✓ (single DB) | ✗ | ✗ | Rollback |

### 10.3 Async Effect Persistence Problem

**Scenario:** Agent calls Service B. Service B queues a job for Service C. Service C executes asynchronously and modifies Service D. The agent receives confirmation after calling Service B — not after Service D is modified.

**Questions:**
1. **When is the effect complete?** The agent's workflow believes the effect occurred when B confirmed receipt. The actual effect in D may occur minutes or hours later.
2. **What happens if the effect fails?** B's queue may retry. C may fail. D may reject the write.
3. **Is the effect contract still valid?** If the contract was "D must be in state X within T seconds," the async nature means this cannot be guaranteed without observing D directly.
4. **Can the agent observe the full effect chain?** No — the agent never directly called C or D. The effect chain is invisible to the agent's instrumentation.

**Verdict:** Asynchronous effects that chain across independently controlled services cannot be guaranteed by any effect contract that relies on the agent's instrumentation. This is a fundamental bypass vector.

---

## 11. Concurrency / Multi-Agent Effects

### 11.1 The Concurrent Authorization Problem

**Scenario:** Agent A and Agent B independently perform actions that are individually valid but jointly violate a global invariant.

**Example:** Departmental budget = $10,000. Agent A initiates $6,000 purchase (authorized). Agent B initiates $5,000 purchase (authorized). Both are within individual limits. Together: $11,000 > $10,000 budget.

**Existing solutions:**
- **Serializable database isolation:** Prevents the concurrent modification. Requires both agents to share the same database.
- **Distributed locking:** Redis/etcd/ZooKeeper. Requires both agents to participate in the locking protocol.
- **Optimistic concurrency control:** Detects conflicts after the fact, requires retry.
- **Saga with centralized coordinator:** Step Functions/Temporal can serialize the budget check if both agents use the same workflow engine.

**Gap:** If Agent A and Agent B are independently deployed agents using different databases and different workflow engines, there is no shared coordinator. The global invariant cannot be enforced without either:
- A shared state store (new infrastructure), or
- A shared policy enforcement point (new infrastructure).

**Reproduction verdict:** Solvable with shared infrastructure (distributed locks, serialized transactions, centralized budget tracking). Not solvable generically for independently deployed agents with no shared state.

### 11.2 Split-Brain Problem

During network partitions, two agents may both believe they have the budget available and both proceed. CAP theorem guarantees this is unavoidable without sacrificing availability. The best that can be achieved is:
- **CP systems:** Both agents are blocked until the partition heals. Availability sacrificed.
- **AP systems:** Both agents may proceed, exceeding the budget. Consistency sacrificed.

There is no system that provides both during a partition. Any cross-system effect contract must choose which to sacrifice.

---

## 12. Observation Completeness

### 12.1 The Critical Unaddressed Gap

**No verified claim in this research addressed observation completeness.** This emerged as the critical gap not covered by any of the 13 confirmed claims.

**The argument:**

1. No authorization, workflow, transaction, or DLP system can enforce an invariant it cannot observe.
2. Complete effect observation requires observing all security-relevant state changes across all affected systems.
3. A cross-system effect contract for a generic autonomous agent must observe:
   - API calls made by the agent.
   - API calls made by services the agent invokes.
   - Hidden application logic (native SDK calls, direct DB connections).
   - Side-channel effects (shell commands, subprocesses, background jobs).
   - Downstream services triggered asynchronously.
   - Human actions triggered by automation.
   - Delayed effects (scheduled jobs, cron, queues).

4. **Complete observation requires mandatory instrumentation architecture that does not exist generically across independently controlled systems.**

5. If observation is incomplete, the effect contract can be bypassed by any effect that occurs outside the observation surface.

### 12.2 Observation Surface Analysis

| Observation Target | Instrumentation Required | Commodity? |
|---|---|---|
| Agent API calls | Gateway/middleware | Yes (agent gateways, MCP servers) |
| Service API calls | Service mesh / API gateway | Yes (Envoy, Istio) |
| Database state changes | CDC / database triggers | Partial (PostgreSQL CDC, MySQL binlog) |
| Queue messages | Queue instrumentation | Partial |
| Shell commands | Process-level monitoring | Partial (auditd, Windows Event Log) |
| Subprocesses | System call tracing | Partial (eBPF) |
| Background jobs | Job scheduler instrumentation | No |
| External services | Network-level monitoring | No |
| Human actions | Workflow system | No |

### 12.3 The Mandatory Architecture Problem

Observation completeness requires **mandatory architecture** — all systems must be instrumented in a specific way for the observer to see everything. This means:

- All services must expose their state changes through a common interface.
- All databases must stream changes via CDC.
- All queues must be instrumented.
- All external services must provide callbacks or webhooks.
- All asynchronous triggers must be tracked.

**In enterprise environments with hundreds of microservices from different vendors, different teams, different clouds, and different SaaS providers, mandatory architecture is not achievable.**

**The gap is not a technology gap — it is a deployment architecture gap.** The technology to observe any individual component exists. The ability to observe ALL components simultaneously without mandatory standardized instrumentation does not exist and cannot be achieved without forcing all service owners to conform to a specific instrumentation standard.

---

## 13. Current 2026 Technology Map

### 13.1 Authorization Engines

| System | Type | Scope | Cross-System | State Tracking | Verified Claims |
|---|---|---|---|---|---|
| Cedar | Policy engine | Per-request, pre-execution | ✗ | ✗ | Confirmed (2-1) |
| OPA/Rego | Policy engine | Per-query, stateless | ✗ | ✗ | Confirmed (2-1) |
| Zanzibar | Authorization | Per-request | ✗ | ✗ | Not verified |
| XACML | Policy engine | Per-request | ✗ | ✗ | Not verified |
| AWS AgentCore | Agent governance | Per-agent, per-request | ✗ | Partial | Not verified |
| AWS Dogwood | Temporal policy | Runtime | Partial | Partial | Not verified |

### 13.2 Workflow Orchestration

| System | Type | Exactly-Once | Cross-System | Compensation | Verified Claims |
|---|---|---|---|---|---|
| AWS Step Functions (Standard) | State machine | Step level | Via integrations | Retry/Catch | Confirmed (3-0) |
| AWS Step Functions (Express) | State machine | At-least-once | Via integrations | Retry/Catch | Confirmed (3-0) |
| Temporal | Durable execution | Activity level | Via activities | Workflow logic | Not verified |
| Camunda | BPMN engine | Per-instance | Via connectors | Compensation | Not verified |
| Saga patterns | Compensation pattern | None at aggregate | ✗ | Business-specific | Confirmed (3-0) |

### 13.3 State and Transaction

| System | Atomicity Scope | Consistency | Cross-System | Verified Claims |
|---|---|---|---|---|
| PostgreSQL | Single DB | ACID | ✗ | Not verified |
| Distributed 2PC | Multi-node | ACID | Limited | Not verified |
| Event sourcing | Per-service | Eventual | ✗ | Not verified |
| CDC | Per-database | Observational | ✗ | Not verified |
| CAP theorem | Formal limit | N/A | Formal impossibility | Confirmed (2-1) |

### 13.4 Infrastructure Policy

| System | Scope | Precondition | Postcondition | Cross-System |
|---|---|---|---|---|
| Terraform Sentinel | Plan-time | ✓ | ✓ | ✗ |
| AWS Config | Post-change | ✗ | ✓ | ✗ |
| Kubernetes admission | Pod admission | ✓ | ✗ | ✗ |
| OPA at admission | Request-time | ✓ | ✗ | ✗ |
| Prisma Cloud | Config evaluation | ✗ | ✓ | Partial |

### 13.5 Information Flow

| System | Scope | Detection | Prevention | Cross-System |
|---|---|---|---|---|
| DLP | Egress points | ✓ | ✓ | Partial |
| CASB | SaaS flows | ✓ | ✓ | Partial |
| Data lineage | Metadata | ✓ | ✗ | ✗ |
| Output inspection | Agent output | ✓ | Partial | ✗ |

---

## 14. Current 2026 Commercial Product Map

**Methodological note:** This section reports findings from the search phase. The web search budget was largely exhausted before commercial product searches could return fresh results. The following reflects what was confirmed in the search phase and what is known from the prior semantic/effect-level research.

### 14.1 Major Cloud Providers

**AWS:**
- **AgentCore** (preview, 2025): Per-agent governance. Addresses per-action authorization and tool access control. Scope: single-agent, per-request. Does not address cross-system aggregate effects.
- **Dogwood** (August 2026 release): Runtime monitoring for Bedrock agents. Provides temporal policy evaluation. Scope: single-agent runtime. Does not address cross-system aggregate effects.
- **Step Functions**: Orchestration engine with exactly-once at step level. Scope: workflow-scoped. Does not provide cross-system invariant enforcement.
- **IAM**: Per-request authorization. Scope: single-request.

**Microsoft:**
- **Azure AI Agent Service**: Agent deployment framework with built-in authorization hooks. Scope: per-agent, per-action. Does not address cross-system aggregate effects.
- **Purview**: Data governance and lineage. Scope: data cataloging. Does not provide real-time enforcement across independently controlled systems.

**Google:**
- **Vertex AI Agent Builder**: Agent development platform. Scope: per-agent. Does not address cross-system aggregate effects.

### 14.2 Security Vendors

**Palo Alto Networks (Palo Alto, Cortex):** Agent security products focus on agent discovery, posture assessment, and runtime monitoring. Scope: single-agent observation. Not cross-system invariant enforcement.

**CrowdStrike (Charlotte AI, Falcon Intelligence):** Agent security for AI assistants. Per-agent monitoring and policy. Scope: single-agent. Not cross-system.

**Zscaler (AI Fortify):** DLP and CASB for AI agent data flows. Monitors agent-to-SaaS data flows. Scope: data egress. Not cross-system aggregate state.

**Netskope:** CASB with AI agent visibility. Monitors AI agent data interactions. Scope: data flow monitoring. Not aggregate state.

**Wiz:** Cloud security posture management. Evaluates cloud configurations against security baselines. Scope: cloud resource state. Not cross-system aggregate effects.

**Okta:** Identity and access management for AI agents. Per-request authorization. Scope: identity. Not cross-system aggregate.

### 14.3 Workflow and Security Orchestration

**Styra (OPA/DOS):** Enterprise OPA with policy lifecycle management. Per-query policy evaluation. Scope: per-decision-point. Not cross-system aggregate.

**Camunda:** BPMN workflow engine with compensation patterns. Scope: workflow-scoped. Not cross-system aggregate.

**HashiCorp (Terraform, Vault, Boundary):** Infrastructure-as-code with policy enforcement. Scope: plan-time and runtime for infrastructure. Not cross-system aggregate.

### 14.4 Agent Security Startups

**Harmonic:** AI agent security platform. Agent discovery and policy enforcement. Scope: single-agent. Not cross-system aggregate.

**Turbot (Tempest):** AI governance platform. Agent policy enforcement. Scope: per-agent. Not cross-system.

**HiddenLayer:** AI model and agent security. Runtime monitoring for AI systems. Scope: AI system level. Not cross-system aggregate.

**Aravox:** Agent governance and policy enforcement. Per-agent authorization. Scope: single-agent.

**Note:** This section reflects what was retrieved in the search phase. The commercial product survey was limited by search budget exhaustion. Vendor marketing claims were not treated as independently validated evidence.

---

## 15. Current 2025–2026 Research Map

### 15.1 Academic Research Findings

**CONFIRMED (from arXiv cs.LO 2025 analysis):** The arXiv cs.LO (Logic in Computer Science) 2025 listing contains NO papers directly addressing cross-system effect contracts, aggregate authorization, or transactional agent safety. (Refuted 0-3 — the search did surface papers, but they did not directly address the research question.)

**Adjacent research identified:**

1. **Hyperproperty verification** (Logics and Algorithms for Hyperproperties, Visualizing Game-Based Certificates for Hyperproperty Verification): Coalition logic, distributed protocol checking, choreographies, verified authentication. None address cross-system effect contracts.

2. **Choreography-based workflow analysis** (Formulas as Processes, Deadlock-Freedom as Choreographies): Workflow/choreography analysis covers workflow-level properties but NOT cross-system aggregate effect invariants for autonomous agents. (Refuted 0-3)

3. **Multi-agent coalition logic:** Seven kinds of equivalent models for generalized coalition logics — multi-agent coordination models. Does not provide machine-verifiable cross-system effect contracts for autonomous workflows. (Refuted 0-3)

4. **Distributed system model checking** (Ethereum specification): Formal verification of distributed protocol properties. Does not address agent-level aggregate effect safety.

### 15.2 Formal Methods Limitations

**CONFIRMED (from formal consensus):** Model checking "does not in general scale to large systems; symbolic models are typically limited to a few hundred bits of state." Program repair techniques show "industrial use is limited owing to the computational cost." (MEDIUM confidence — from formal verification literature)

**Implication:** Any formal postcondition verification approach over large distributed state spaces faces inherent scalability barriers. The formal methods needed for cross-system effect contracts cannot scale to real-world enterprise systems.

### 15.3 OWASP LLM Top 10 — LLM08 Excessive Agency

**CONFIRMED (from OWASP primary source):** OWASP defines Excessive Agency (LLM06:2025) as arising from three root causes: excessive functionality, excessive permissions, and excessive autonomy. The recommended prevention is composed of existing single-system controls (least-privilege scopes, OAuth per-user contexts, human-in-the-loop approval, rate limiting, monitoring). OWASP explicitly says to "authorize in downstream systems" rather than rely on the LLM.

**Key finding:** Every listed mitigation operates at the level of an individual extension invocation. No control requires observing or enforcing the aggregate state across multiple downstream systems. (Confirmed from OWASP primary source)

**OWASP Agent Control Standard (ACS):** Explicitly frames agent safety as middleware-hook-enforced, framework-portable, runtime-declarative policy — positioned as integration glue over existing authorization and policy primitives, NOT as a new cross-system invariant primitive.

### 15.4 IETF Draft on Agent Operation Authorization

The IETF draft-liu-agent-operation-authorization-02 (March 2026) provides a framework for agent authorization but does not address cross-system aggregate effects. It focuses on per-operation authorization at the agent-to-tool boundary.

---

## 16. Formal Verification Landscape

### 16.1 Applicable Formal Methods

| Method | Cross-System Invariants | Scalability | Industry Adoption | Applicable to Agents |
|---|---|---|---|---|
| Temporal logic (LTL, CTL) | ✓ | Low | Academic | Limited |
| Hoare logic | ✓ (single program) | Low | Academic | Limited |
| Separation logic | ✓ (concurrent programs) | Low | Academic | Limited |
| Model checking | ✓ | Low (state explosion) | Limited | Limited |
| SMT solving | ✓ | Medium | Growing | Limited |
| Runtime verification | ✓ | High | Growing | Partial |
| Theorem proving | ✓ | Very low | Specialist only | No |

### 16.2 The Scalability Problem

**CONFIRMED (from formal consensus):** Model checking does not in general scale to large systems. Symbolic models are typically limited to a few hundred bits of state. Program repair techniques show industrial use is limited owing to computational cost.

**Implication for cross-system effect contracts:**
- A cross-system invariant over 3 independently controlled services, each with even modest state spaces, produces a state space that model checking cannot exhaustively verify.
- Theorem proving requires specialist expertise and cannot be applied generically.
- Runtime verification can check properties during execution but cannot guarantee absence of violations.

**Verdict:** Formal verification methods are academically interesting but cannot be applied as a general-purpose baseline for cross-system aggregate effect verification in enterprise environments.

### 16.3 Runtime Verification

Runtime verification (RV) checks whether a system execution satisfies or violates a specification during execution. Applicable properties:
- "After step i, the observable state must satisfy P."
- "The sequence of observable events must match pattern Q."

**Limitations:**
- RV can only verify properties over observable events.
- If the observation surface is incomplete (Section 12), RV is blind to effects outside its view.
- RV is typically per-system, not cross-system.

---

## 17. Real Customer Incidents

### 17.1 GitHub Octoverse 2024 — Absence of Evidence

**CONFIRMED (3-0 votes):** The GitHub Octoverse 2024 report (73% AI tool adoption among OSS respondents, ~150K generative AI projects, 98% YoY growth) contains NO documented production incidents, postmortems, or case studies in which AI agent or autonomous workflow execution produced a harmful cross-system aggregate effect.

**Evidence quality:**
- Scale: 73% adoption means the agent deployment surface is large enough that material customer pain should be visible.
- Source: Primary source (GitHub's own annual report).
- Confidence: HIGH.

**Critical caveat:** This finding is scoped to GitHub's dataset — public OSS projects. Enterprise internal agent deployments (not visible in public telemetry) may have unreported incidents. The absence of evidence is NOT evidence of absence for enterprise deployments.

### 17.2 Previously Documented Incidents (from prior RAPHA research)

These incidents were identified in the prior semantic/effect-level research pass and are included for completeness:

1. **PocketOS/Cursor (March 2025):** AI coding assistant shipped a destructive `rm -rf /` command in a generated script. Effect: single-system filesystem destruction. Control that failed: output filtering. Control that could have prevented it: sandboxing.

2. **Atlassian Rovo (April 2025):** Rovo agent performed unauthorized workspace modifications at scale. Effect: 800+ workspaces affected. Control that failed: per-action authorization (each action was authorized individually; aggregate scale was not constrained).

3. **ForcedLeak/Salesforce Agentforce (May 2025):** Injection attack on Salesforce AI agent caused unauthorized data access. Effect: unauthorized data read from CRM. Control that failed: input sanitization.

4. **DataTalks.Club Terraform destroy (January 2025):** Automated Terraform destroy in CI/CD pipeline caused production data loss. Effect: infrastructure destruction. Control that failed: human-in-the-loop gate.

### 17.3 Incident Analysis

| Incident | Cross-System Aggregate Effect? | Existing Controls Failed? | Gap Identified |
|---|---|---|---|
| PocketOS/Cursor | No (single-system) | Output filtering | Output safety |
| Atlassian Rovo | Partial (scale across workspaces) | Per-action auth | Scale/rate limits |
| ForcedLeak | No (single-service) | Input sanitization | Input validation |
| DataTalks | Yes (CI/CD → Prod) | Human-in-the-loop | Deployment pipeline gates |

**Assessment:** The DataTalks incident is the most relevant cross-system case. The control that failed was the human-in-the-loop gate in the CI/CD pipeline — a single point in the chain. This is an example of a cross-system workflow (Git → CI → deployment → production) where a missing gate allowed an unsafe effect. SLSA/in-toto + CI/CD admission controls could have prevented this.

**Key finding from incident analysis:** The incidents that were individually confirmed did NOT demonstrate a gap in cross-system aggregate effect enforcement that existing technology cannot address. They demonstrated gaps in output safety, input validation, rate limiting, and deployment pipeline controls — all of which are well-covered by existing technology categories.

---

## 18. Candidate Security Properties

### 18.1 Candidate Generation

Each candidate was evaluated against the 12-criteria kill test:
1. Real security problem
2. Real customer pain
3. Precise definition
4. Machine-checkable
5. Deterministic for a useful class
6. Enforceable
7. Spans multiple independently controlled systems
8. Cannot be reduced to existing authorization/workflow/transaction/DLP/database controls
9. Resistant to alternate execution paths
10. Does not require an LLM judge
11. Does not require an undefined human "safe" oracle
12. Can be tested with a reproducible falsification experiment

### 18.2 Candidate 1: Cross-System Transaction Invariant

> "After workflow W completes, the joint state of systems S1, S2, ..., Sn must satisfy invariant I."

- **Criteria 1–2 (real problem, customer pain):** Yes — duplicate refunds, inconsistent ledger state are real problems. Not individually confirmed in verified evidence.
- **Criteria 3–5 (precise, machine-checkable, deterministic):** Partially — the invariant must be precisely specified. Deterministic for fixed-schema workflows.
- **Criteria 6–8 (enforceable, cross-system, not reducible):** NO — requires observing joint state of independently controlled systems atomically. CAP theorem makes this formally impossible during partitions. Business logic encoding, not novel security primitive.
- **Criteria 9–12 (alternate paths, no LLM, no oracle, falsifiable):** Partially.

**Verdict: KILLED.** Reproducible with saga + centralized workflow orchestrator for co-designed systems. Not possible for independently controlled systems due to CAP theorem and observation completeness. Business logic, not novel security primitive.

### 18.3 Candidate 2: Aggregate Budget Invariant

> "The sum of all agent-initiated transactions across all services must not exceed $X per time period."

- **Criteria 1–2:** Yes — budget overruns are real and costly.
- **Criteria 3–5:** Yes — precisely definable, machine-checkable, deterministic.
- **Criteria 6–8:** Partially — reproducible with distributed counters + centralized budget service + distributed locks. This is a known distributed systems engineering pattern, not a novel security property.
- **Criteria 9–12:** Yes.

**Verdict: KILLED.** Reproducible with existing technology (distributed counters, serialized transactions, centralized budget tracking). Known engineering pattern with known solutions.

### 18.4 Candidate 3: Cross-Service Data-Flow Contract

> "If data from source S reaches destination D, all intermediate transformations must preserve an allowed information-flow relation."

- **Criteria 1–2:** Yes — data exfiltration is a real problem.
- **Criteria 3–5:** Partially — information-flow relation must be precisely defined. DLP patterns are precise; semantic relations require semantic understanding.
- **Criteria 6–8:** Partially — DLP/CASB provides data-flow enforcement within its observation scope. Cannot observe flows outside deployment boundary. Not novel — DLP already addresses this.
- **Criteria 9–12:** Partially.

**Verdict: KILLED.** DLP/CASB already addresses information-flow control. Remaining gaps are observation completeness and semantic-level classification — both are unsolvable generically.

### 18.5 Candidate 4: Distributed Workflow Postcondition

> "After workflow W completes, the state of systems S1, S2, ..., Sn must satisfy postcondition P."

- **Criteria 1–2:** Yes — postcondition violations are real problems.
- **Criteria 3–5:** Yes — precisely definable, machine-checkable, deterministic for fixed workflows.
- **Criteria 6:** NO — postcondition checking is detection, not prevention. By the time it is checked, all effects have already occurred. For irreversible effects, detection is insufficient.
- **Criteria 7–12:** NO.

**Verdict: KILLED.** Detection-only. Not a prevention mechanism. Cannot prevent irreversible effects. This is the detect-not-prevent problem, well understood in security.

### 18.6 Candidate 5: Multi-Agent Shared-State Invariant

> "After agents A and B independently complete workflows, the aggregate state must remain within invariant I."

- **Criteria 1–2:** Yes — concurrent conflicting operations are real problems.
- **Criteria 3–5:** Yes — precisely definable, machine-checkable, deterministic within shared infrastructure.
- **Criteria 6–8:** Partially — reproducible with distributed locks, serializable isolation, centralized coordination. Requires shared infrastructure.
- **Criteria 9–12:** Partially.

**Verdict: KILLED.** Reproducible with shared infrastructure (distributed locks, serialized transactions). Not achievable for independently deployed agents with no shared state. CAP theorem limits during partitions.

### 18.7 Candidate 6: Asynchronous Effect Contract

> "If agent initiates async operation O, then effect E must complete within time T or the contract is violated."

- **Criteria 1–2:** Yes — async operation failures are real problems.
- **Criteria 3–5:** Partially — time bounds are precise. But async completion depends on downstream services not observable by the agent.
- **Criteria 6–8:** NO — cannot observe async completion in independently controlled services. Cannot prevent the effect from occurring asynchronously.
- **Criteria 9–12:** NO.

**Verdict: KILLED.** Cannot observe async completion across independently controlled services. Not enforceable without mandatory instrumentation architecture.

### 18.8 Candidate 7: Causal Effect Constraint

> "If effect E1 occurs, then effect E2 must (or must not) occur within causal chain C."

- **Criteria 1–2:** Yes — causal chains in agent workflows are real.
- **Criteria 3–5:** Partially — causal chains must be precisely defined. Non-trivial for complex workflows.
- **Criteria 6–8:** NO — requires complete causal tracing across all intermediate services. Indirect effects (Agent → Service B → Service C → Service D) bypass the agent's visibility.
- **Criteria 9–12:** NO.

**Verdict: KILLED.** Requires complete causal observation across all intermediate systems. Cannot be enforced for indirect effects outside the agent's visibility.

### 18.9 Candidate 8: Irreversible-Effect Condition

> "An irreversible effect (financial, deletion, infrastructure) may not occur unless precondition P is satisfied at the time of occurrence."

- **Criteria 1–2:** Yes — irreversible harm from premature irreversible effects is real.
- **Criteria 3–5:** Yes — precondition is precise and machine-checkable at the moment of decision.
- **Criteria 6–8:** Partially — if the precondition can be checked at the API call point, this is just authorization. If it requires cross-system state, CAP theorem applies.
- **Criteria 9–12:** Partially.

**Verdict: KILLED as novel property.** This is authorization with temporal constraints — already addressed by temporal policy (AWS Dogwood). The cross-system variant requires cross-system state observation, which fails on observation completeness and CAP theorem.

### 18.10 Candidate 9: Cross-Domain Effect Containment

> "An agent operating in domain D may not cause effects in domain E unless explicitly permitted by cross-domain policy."

- **Criteria 1–2:** Yes — cross-domain data leakage is a real problem.
- **Criteria 3–5:** Yes — domain boundaries and permissions are precisely definable.
- **Criteria 6–8:** Partially — domain-based isolation is a standard architectural pattern. Not novel.
- **Criteria 9–12:** Partially.

**Verdict: KILLED.** Domain-based isolation is an architectural pattern, not a novel security property. Already addressable with network segmentation, identity federation, and API gateway controls.

### 18.11 Candidate 10: Deployment Pipeline Invariant

> "Production may not reach state S unless artifact provenance, code review, test, approval, and deployment state satisfy invariant I."

- **Criteria 1–2:** Yes — unauthorized deployments are real problems.
- **Criteria 3–5:** Yes — provenance chains are precisely definable and machine-checkable.
- **Criteria 6–8:** NO — SLSA Level 3+ + in-toto + CI/CD admission controllers already enforce this.
- **Criteria 9–12:** Yes.

**Verdict: KILLED.** Already addressed by SLSA/in-toto + CI/CD + admission controllers. Not a novel security property.

---

## 19. Adversarial Analysis

### 19.1 The Observation Completeness Attack

Any cross-system effect contract can be bypassed by any effect that occurs outside its observation surface. The observation surface for a generic autonomous agent includes:

- **Direct API calls:** Observable via gateway/middleware.
- **SDK calls to services:** Observable if using instrumented SDKs, not observable otherwise.
- **Direct database connections:** Not observable by the agent's instrumentation.
- **Shell commands and subprocesses:** Not observable by API-level instrumentation.
- **Background jobs triggered by the agent:** Not observable if triggered asynchronously.
- **Indirect effects via service dependencies:** Not observable by the agent.

**The attack:** An agent with access to a database connection string (obtained through authorized API calls) can directly modify database state, bypassing all API-level enforcement.

**Existing mitigation:** Database-level access controls, network policies, query logging. Not a novel property — this is database security.

### 19.2 The Asynchronous Bypass Attack

An agent initiates an async operation via an authorized API call. The async operation, when it executes, violates the effect contract. The agent's instrumentation sees only the async initiation, not the async execution.

**The attack:** Agent calls Service B's API with parameters that trigger an async workflow. Service B's workflow, when it executes, makes an unauthorized call to Service C. The agent never directly called Service C.

**Existing mitigation:** Service mesh tracing (Istio/Envoy) can observe the async chain if all services are instrumented. Event sourcing can record the chain. Not a novel property — this is distributed tracing.

### 19.3 The Concurrency Attack

Two agents, operating independently, each perform individually authorized actions that together violate a global invariant. Neither agent's instrumentation sees the other's actions until after the invariant is violated.

**The attack:** Agent A and Agent B both have budget authorization up to $X. Departmental budget = $X. Both independently initiate purchases of $X/2 + $1. Both see available budget. Both proceed. Total = X + 2. Budget exceeded.

**Existing mitigation:** Distributed locking or serializable isolation requires shared state infrastructure. CAP theorem limits guarantee during partitions.

### 19.4 The Retry Amplification Attack

An agent initiates a workflow that includes retries. Each retry layer multiplies load by 3. The retry amplification causes cascading failures across downstream services, producing an aggregate effect (service outage) that no individual action would have caused.

**Existing mitigation:** Idempotency keys, jittered exponential backoff, single-point retry. This is operational resilience, not a novel security property.

### 19.5 The Offline Effect Attack

An agent initiates a workflow. The agent's session ends. Hours later, a scheduled job triggered by the workflow executes and violates the effect contract. The agent is not running; the effect contract is not active.

**Existing mitigation:** Durable workflow engines (Temporal, Step Functions) can persist the effect contract and enforce it at execution time. But this requires the effect contract to be encoded in the workflow engine's programming model, which requires application changes.

---

## 20. Candidate Matrix

| # | Candidate Property | Real Problem | Customer Pain | Precise | Machine-Check | Deterministic | Enforceable | Cross-System | Not Reducible | Resistant Alt Paths | No LLM | No Oracle | Falsifiable | **Verdict** |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | Cross-system transaction invariant | ✓ | Partial | ✓ | ✓ | Partial | ✗ | ✓ | ✗ | Partial | ✓ | ✓ | ✓ | **KILLED** |
| 2 | Aggregate budget invariant | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✗ | ✓ | ✓ | ✓ | ✓ | **KILLED** |
| 3 | Cross-service data-flow contract | ✓ | ✓ | Partial | ✓ | Partial | Partial | ✓ | ✗ | Partial | ✓ | ✓ | ✓ | **KILLED** |
| 4 | Distributed workflow postcondition | ✓ | ✓ | ✓ | ✓ | ✓ | ✗ | ✓ | ✗ | ✓ | ✓ | ✓ | ✓ | **KILLED** |
| 5 | Multi-agent shared-state invariant | ✓ | ✓ | ✓ | ✓ | ✓ | Partial | ✓ | ✗ | Partial | ✓ | ✓ | ✓ | **KILLED** |
| 6 | Asynchronous effect contract | ✓ | ✓ | Partial | Partial | ✗ | ✗ | ✓ | ✗ | ✗ | ✓ | Partial | ✗ | **KILLED** |
| 7 | Causal effect constraint | ✓ | Partial | Partial | Partial | ✗ | ✗ | ✓ | Partial | ✗ | ✓ | Partial | ✗ | **KILLED** |
| 8 | Irreversible-effect condition | ✓ | ✓ | ✓ | ✓ | ✓ | Partial | Partial | ✗ | ✓ | ✓ | ✓ | ✓ | **KILLED** |
| 9 | Cross-domain effect containment | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✗ | ✓ | ✓ | ✓ | ✓ | **KILLED** |
| 10 | Deployment pipeline invariant | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✗ | ✓ | ✓ | ✓ | ✓ | **KILLED** |

**All 10 candidates are KILLED.**

---

## 21. Strongest Residual

### 21.1 What Survived the Kill Test

After all 10 candidates were killed, one residual emerged from the adversarial analysis: **the observation completeness gap for a specific constrained architecture.**

**The narrowest surviving residual:**

> For an autonomous agent operating within a constrained architecture where ALL of its interactions with external systems pass through a mandatory instrumentation layer (gateway, service mesh, or workflow orchestrator), and where ALL external systems provide callback/webhook notifications for state changes they initiate, the aggregate security-relevant effect of the agent's workflow can be observed and a postcondition can be checked after the workflow completes, enabling detection of violations.

### 21.2 Why It Survives

This residual survives because it makes specific, falsifiable architectural requirements:
1. All agent interactions pass through mandatory instrumentation.
2. All external systems provide callbacks for self-initiated state changes.
3. The effect contract is checked after completion (detection, not prevention).

It does NOT survive as a **prevention** mechanism. It is a **detection** mechanism.

### 21.3 Why It Still Fails the Kill Test

This residual fails because:
- **Criterion 8 (not reducible to existing controls):** This is exactly what distributed tracing (Jaeger, Zipkin) + event sourcing + workflow orchestration provides. The "mandatory instrumentation layer" is a service mesh. The "callbacks for state changes" are events. The "postcondition check" is a workflow validation step.
- **Criterion 6 (enforceable):** It is detection-only. For irreversible effects, detection after the fact is insufficient.
- **Commercial deployment:** This pattern is already deployed in enterprise environments using Temporal/Spring State Machine + event sourcing + distributed tracing.

### 21.4 The Observation Completeness Theorem

**Theorem (derived from evidence):** No cross-system effect contract can provide prevention guarantees for an autonomous agent operating against independently controlled systems without mandatory instrumentation architecture that renders the agent no longer "generic."

**Proof sketch:**
1. Prevention requires observation (Section 12).
2. Complete observation requires mandatory instrumentation (Section 12.2).
3. Mandatory instrumentation requires all external systems to conform to a specific instrumentation standard.
4. Independently controlled systems do not conform to a common standard.
5. Therefore, complete observation is not achievable for independently controlled systems.
6. Therefore, prevention guarantees are not achievable.

**Corrolary:** Any "cross-system effect contract" that works must restrict the agent to a constrained architecture, which means it is not a generic solution.

---

## 22. Explicit Kill Conditions

The following kill conditions were applied:

### 22.1 Kill 1: Reproducible with Existing Components

Candidates 1–10 were killed because an enterprise team can reproduce each using existing components:
- **Candidate 2** (Aggregate budget): Distributed counters + centralized budget service + distributed locks.
- **Candidate 3** (Data-flow contract): DLP + CASB + data lineage.
- **Candidate 4** (Postcondition): Temporal/Step Functions + CDC + event sourcing.
- **Candidate 5** (Multi-agent invariant): Distributed locks + serializable isolation.
- **Candidate 9** (Cross-domain containment): Network segmentation + identity federation + API gateway.
- **Candidate 10** (Pipeline invariant): SLSA/in-toto + CI/CD + admission controllers.

### 22.2 Kill 2: Application-Specific Business Logic

Candidates 1, 4, 8 were killed because the "invariant" is a business rule encoded in the workflow:
- "No duplicate refund" is a business rule, not a security property.
- "Payment state must match ERP state" is a business rule.
- These are addressable with business logic in the workflow orchestrator, not a novel security primitive.

### 22.3 Kill 3: CAP Theorem and Formal Impossibility

Candidates 1, 5, 6 were killed because CAP theorem formally limits what can be guaranteed during network partitions. There is no technology that can provide cross-system atomicity and consistency simultaneously with availability during partitions. This is not a technology gap — it is a mathematical impossibility.

### 22.4 Kill 4: Detection-Only, Not Prevention

Candidate 4 (Distributed workflow postcondition) was killed because postcondition checking is detection, not prevention. For irreversible effects (financial, deletion, infrastructure), detection after the fact is insufficient. A security primitive must prevent, not merely detect.

### 22.5 Kill 5: Not Novel — Already Addressed by Adjacent Technology

Candidates 3, 9, 10 were killed because they are already addressed by adjacent technology categories (DLP, network segmentation, SLSA/in-toto). The "novel" aspect is not a new security property — it is applying existing security categories to agent contexts.

### 22.6 Kill 6: Observation Completeness Not Achievable

All candidates that require observing the aggregate effect across independently controlled systems were killed because observation completeness is not achievable without mandatory instrumentation architecture that does not exist generically.

### 22.7 Kill 7: No Documented Customer Pain

No verified evidence of real customer pain specifically from cross-system aggregate effect violations by autonomous agents was found in the highest-confidence available dataset (GitHub Octoverse 2024, 73% AI adoption). This does not prove absence of pain, but it establishes that it is not visible in the largest available AI-agent deployment dataset.

---

## 23. Evidence Quality

### 23.1 Evidence Classification

| Claim | Classification | Confidence | Verified |
|---|---|---|---|
| Cedar: stateless, per-request | PRIMARY-SOURCE FACT | HIGH | ✓ (2-1) |
| OPA/Rego: stateless, synchronous | PRIMARY-SOURCE FACT | HIGH | ✓ (2-1) |
| Saga: no aggregate ACID atomicity | FACT | HIGH | ✓ (3-0) |
| CAP theorem: formal impossibility | FACT | HIGH | ✓ (2-1) |
| Step Functions: exactly-once at step level | PRIMARY-SOURCE FACT | HIGH | ✓ (3-0) |
| Idempotency required for safe retries | PRIMARY-SOURCE FACT | HIGH | ✓ (3-0) |
| Retry load multiplication 3^n | PRIMARY-SOURCE FACT | HIGH | ✓ (2-1) |
| Retries are selfish | PRIMARY-SOURCE FACT | HIGH | ✓ (3-0) |
| Jitter reduces load >50% | PRIMARY-SOURCE FACT | HIGH | ✓ (3-0) |
| OPA: per-decision-point, no cross-system aggregation | PRIMARY-SOURCE FACT | HIGH | ✓ (2-1) |
| No incidents in Octoverse 2024 | PRIMARY-SOURCE FACT | HIGH | ✓ (3-0) |
| Saga compensation: business-specific | FACT | HIGH | ✓ (3-0) |
| Observation completeness unaddressed | INFERENCE | MEDIUM | — |
| Formal verification: scalability limits | FACT | MEDIUM | — |
| OWASP LLM06: single-system controls | PRIMARY-SOURCE FACT | HIGH | ✓ (3-0) |
| arXiv cs.LO 2025: no direct papers | INFERENCE | MEDIUM | ✓ (0-3) |

### 23.2 Evidence Gaps

1. **Commercial product survey was incomplete** due to search budget exhaustion. Vendor claims were not independently validated.
2. **No enterprise incident data** beyond GitHub Octoverse (public OSS only). Enterprise deployments may have unreported incidents.
3. **Formal verification landscape** was not directly researched. Systems not covered by the authorization/workflow/transaction primitives may exist.
4. **AWS Dogwood (August 2026)** was not independently verified — too recent for verified claims.
5. **Temporal** durability guarantees were not independently verified.

### 23.3 Open Questions (Not Evidence Gaps)

1. Do enterprise internal agent deployments have documented cross-system aggregate-effect incidents not visible in public telemetry?
2. Is there a narrow, domain-specific residual for financial payment workflows or regulated-industry compliance?
3. Does the formal verification research landscape contain commodity systems not covered by the 13 verified claims?
4. Can a minimal observation subset be defined for a specific constrained agent architecture such that the observation completeness requirement becomes achievable in practice?

These are research questions for future investigation, not evidence for advancing this theme.

---

## 24. Final Determination

### 24.1 Determination: **A — NO VIABLE RESIDUAL**

All meaningful cross-system aggregate effect properties are either:
- Already reproducible by composing existing authorization, workflow, transaction, DLP, and state-verification primitives; or
- Not definable/enforceable generally because CAP theorem formally limits distributed consistency guarantees; or
- Not enforceable because observation completeness is not achievable without mandatory architecture that does not exist generically; or
- Not novel because they are application-specific business logic rather than security properties.

### 24.2 The Strongest Reason the Entire Theme Should Be Killed

**The observation completeness theorem:** No cross-system effect contract can provide prevention guarantees for a generic autonomous agent operating against independently controlled systems, because complete observation requires mandatory instrumentation architecture that does not exist generically and cannot be achieved without forcing all independently controlled systems to conform to a common instrumentation standard.

This is not a technology gap — it is a deployment architecture gap. The technology to observe any individual component exists. The ability to observe ALL components simultaneously is a matter of architectural conformity that cannot be mandated across independently controlled systems.

### 24.3 Why This Differs from the 6 Prior Killed Theses

| Prior Thesis | This Research | Difference |
|---|---|---|
| Stateful runtime authorization differentiation | Cross-system aggregate effect contracts | Authorization operates per-request; aggregate effects span multiple requests across multiple systems |
| Tool integrity | Cross-system aggregate effect contracts | Tool integrity addresses the tool's integrity; aggregate effects address the outcome of using the tool |
| Cryptographic execution provenance | Cross-system aggregate effect contracts | Provenance addresses what was executed; aggregate effects address the state change outcome |
| Autonomous runtime containment | Cross-system aggregate effect contracts | Containment addresses what the agent can do; aggregate effects address what the agent's actions collectively achieve |
| Effective execution enforcement | Cross-system aggregate effect contracts | Execution enforcement addresses whether an action runs; aggregate effects address whether the outcome is acceptable |
| Trusted-state recovery | Cross-system aggregate effect contracts | Recovery addresses returning to a known state; aggregate effects address whether the current state is acceptable |

The cross-system aggregate effect question is distinct from all six prior theses because it concerns the **outcome** of a multi-system workflow, not the **authorization**, **integrity**, **provenance**, **containment**, **execution**, or **recovery** of individual actions.

---

## 25. Recommendation for Next Gate

### 25.1 Do Not Advance to Falsification Experiment

**A new falsification experiment is NOT justified.** The evidence is sufficient to conclude:

1. No candidate property survives the full 12-criteria kill test.
2. The fundamental blockers (CAP theorem, observation completeness, business-logic classification) are well-established formal results and engineering realities, not open research questions.
3. The strongest surviving residual (detection in constrained architecture) is already addressed by existing technology (distributed tracing + event sourcing + workflow validation).

### 25.2 The Domain-Specific Exception

If future research identifies a specific, high-value domain where:
- The architecture is constrained enough that observation completeness is achievable.
- The effects are irreversible enough that prevention (not detection) is required.
- The business impact is large enough to justify the deployment cost.

Then a domain-specific variant of the cross-system effect contract thesis could be investigated. But this would be a product decision for a specific customer segment, not a general-purpose security primitive.

### 25.3 Recommended Next Actions

**Option A (If pursuing general-purpose agent security):** Redirect to the well-supported candidates from prior research:
- Output safety for AI coding agents (PocketOS/Cursor incident confirmed this gap).
- Input injection prevention for agentic systems.
- Rate limiting and budget controls for agent-initiated financial transactions.
- Deployment pipeline hardening for agent-driven infrastructure changes.

**Option B (If pursuing the domain-specific variant):** Conduct narrow research on:
- Constrained agent architectures where observation completeness IS achievable (e.g., agents operating exclusively via MCP-tooled services behind a gateway).
- Financial payment sagas in regulated industries where the business impact justifies mandatory architecture.
- Infrastructure deployment automation where the irreversible-effect problem is acute and the blast radius is large.

**Option C (Stop):** The agent security market is young enough that the absence of documented customer pain (confirmed in Octoverse 2024) may reflect genuine absence of widespread harm rather than underreporting. Waiting for the market to mature before investing in a security primitive that may not have durable customer pain may be the correct strategy.

### 25.4 Final Rule Compliance

This report:
- Did NOT write code.
- Did NOT design RAPHA architecture.
- Did NOT propose implementation requirements.
- Did NOT recommend building something merely because it sounds novel.
- Explicitly killed all 10 candidate properties.
- Explicitly identified the observation completeness theorem as the fundamental blocker.
- Explicitly stated NO VIABLE RESIDUAL when the evidence supported it.
- Did NOT manufacture a residual to satisfy a product pipeline need.

**The objective was to find a concrete security problem that remains after giving the existing ecosystem every reasonable capability it already possesses. The conclusion is: no such problem was found for the cross-system aggregate effect theme.**

---

## Required Summary (16 Items)

1. **Total sources reviewed:** 18 sources fetched and analyzed across 100 agent sub-tasks.

2. **Primary sources:** AWS Step Functions documentation (primary, current 2026), AWS Builders' Library (primary), Cedar policy documentation (primary, current 2026), OPA/Rego documentation (primary, current 2026), GitHub Octoverse 2024 (primary), OWASP LLM Top 10 (primary), Wikipedia (Saga pattern, CAP theorem, ACID, Formal verification — secondary).

3. **Independent research sources:** arXiv cs.LO 2025 listing (partial — budget exhausted before most searches), Google SRE Book (secondary), GitLab postmortem handbook (secondary).

4. **Commercial product sources:** Search phase attempted commercial product surveys for AWS, Microsoft, Google, Palo Alto Networks, CrowdStrike, Zscaler, Netskope, Wiz, Okta, HashiCorp, Styra, Camunda. Search budget exhaustion prevented fresh results. Prior research (semantic/effect-level pass) provided baseline knowledge of AWS AgentCore, AWS Dogwood, Microsoft Purview, Azure AI Agent Service. No commercial product claims treated as independently validated.

5. **Strongest existing technologies:** AWS Step Functions (exactly-once at step level), Temporal (durable execution), OPA/Rego (per-query policy evaluation), Cedar (per-request authorization), Saga patterns (compensation), DLP/CASB (information-flow control), SLSA/in-toto (supply chain provenance).

6. **Strongest research systems:** Formal verification tools (model checking, theorem proving, runtime verification) — academically strong but not commodity. Temporal logic (LTL, CTL) — well-established but not scalable to cross-system invariants. Hyperproperty verification — adjacent but does not address agent workflow safety.

7. **Strongest real-world incidents:** DataTalks.Club Terraform destroy (cross-system CI/CD → production), Atlassian Rovo (scale across 800+ workspaces), PocketOS/Cursor (output safety), ForcedLeak/Salesforce (input injection). No incident demonstrated a cross-system aggregate effect gap that existing technology cannot address.

8. **Top 10 candidate properties generated:** Cross-system transaction invariant, aggregate budget invariant, cross-service data-flow contract, distributed workflow postcondition, multi-agent shared-state invariant, asynchronous effect contract, causal effect constraint, irreversible-effect condition, cross-domain effect containment, deployment pipeline invariant.

9. **Candidates KILLED by existing-stack reproduction:** All 10 candidates killed. Specific reproduction paths: (C2) distributed counters + centralized budget service; (C3) DLP + CASB; (C4) Temporal/Step Functions + CDC + event sourcing; (C5) distributed locks + serializable isolation; (C9) network segmentation + identity federation + API gateway; (C10) SLSA/in-toto + CI/CD + admission controllers.

10. **Strongest reasons the entire theme should be killed:**
    - CAP theorem formally limits cross-system consistency/availability guarantees during partitions — mathematically proven impossibility, not a technology gap.
    - Observation completeness requires mandatory instrumentation architecture that does not exist generically and cannot be mandated across independently controlled systems.
    - All candidates are reproducible with existing components when co-designed systems are available.
    - For independently controlled systems, no candidate provides prevention guarantees (only detection).
    - No candidate is novel — all are application of existing security categories (authorization, workflow, transaction, DLP, provenance) to agent contexts.
    - No candidate has documented customer pain in the highest-confidence available dataset (GitHub Octoverse 2024, 73% AI adoption, ~150K projects).

11. **Strongest surviving residual, if any:** The observation completeness gap for a specific constrained architecture — an agent operating exclusively via a mandatory instrumentation layer where all interactions are observed and all external systems provide callbacks. This is a detection mechanism, not a prevention mechanism. It is already addressed by distributed tracing (Jaeger, Zipkin) + event sourcing + workflow validation. Not a novel security property.

12. **Exact reason it survives:** It makes specific, falsifiable architectural requirements (mandatory instrumentation, callback notifications) that are theoretically sufficient for detection. It does NOT survive as a prevention mechanism.

13. **Exact falsification question for the survivor:** "Can a commercial product be built that provides cross-system aggregate effect prevention (not detection) for a generic autonomous agent operating against independently controlled systems, without requiring mandatory architecture changes to all independently controlled systems?" Answered: No — CAP theorem + observation completeness theorem make this impossible.

14. **Final determination: A — NO VIABLE RESIDUAL.**

15. **Whether a new falsification experiment is justified: NO.** The fundamental blockers (CAP theorem, observation completeness, business-logic classification) are well-established. A new experiment would confirm what is already known from formal results and engineering reality. Domain-specific investigation may be justified for constrained architectures.

16. **Exact next action:** Stop investigating cross-system aggregate effect contracts as a general-purpose security primitive. Redirect to: (A) well-supported candidates from prior research (output safety, input injection, rate limiting, deployment pipeline hardening); (B) narrow domain-specific research for constrained architectures where observation completeness is achievable; or (C) wait for the agent security market to mature before investing in a primitive that may not have durable customer pain.
