# RAPHA V2 — Semantic / Effect-Level Assurance Research 2026

**Research Date:** 2026-09-05
**Research Method:** Adversarial falsification — 5-angle fan-out web search → 29 sources fetched → 114 claims extracted → 25 top claims verified → 3-vote adversarial verification (17 confirmed, 8 refuted)
**Workflow:** 111 agents, 863 tool calls, 4.1M subagent tokens across 5 phases (Scope, Search, Fetch, Verify, Synthesize)

---

## 1. Executive Summary

The core research question: *"Can an autonomous action be constrained and/or verified using machine-verifiable preconditions and postconditions over its actual security-relevant effects — rather than merely its identity, authorization, route, API invocation, or raw content — and is there any technically defensible capability a strong existing stack cannot cheaply reproduce?"*

**Finding: Determination B — RESEARCHABLE RESIDUAL**

All current production authorization engines — including AWS Bedrock AgentCore with Cedar (the leading commercial ABAC deployment for agents in 2026), OPA/Rego, XACML, and all major agent-security vendor products — are documented as **request-time precondition engines**. None has a native postcondition construct, none observes actual state deltas, and none validates real-world outcomes.

The three leading 2025–2026 runtime verification research systems — **Proof of Execution (PoE)**, **VIGIL**, and **Aegis** — each explicitly disclaim real-world semantic/business effect verification as a design boundary in their own stated limitations. Every one is bounded by **observation completeness**: the trust boundary coincides with the event-observation boundary, and opaque script internals, undeclared inputs, and non-tool-call side effects fall outside verification scope.

A genuine, narrow residual exists: **the formal end-to-end guarantee that an authorized action's actual state delta satisfies a declared postcondition, where the postcondition is machine-checkable without an LLM oracle, where the observation boundary is complete, and where the system is provably closed under arbitrary alternative code paths**. This combination — (a) state delta not trace, (b) machine-checkable postcondition not LLM-judged, (c) closed under alternative code paths not single-Gateway, (d) formally proven not empirically demonstrated — is the gap none of the surveyed systems claims to close.

However, this is a **formal-property gap**, not a capability gap. The commercial meaningfulness is unverified. The residual requires a dedicated falsification design to determine whether it is an academic curiosity or a real product differentiator.

---

## 2. Research Scope and Method

### 2.1 Research Question
Can an autonomous action be constrained and/or verified using machine-verifiable preconditions and postconditions over its actual security-relevant effects, rather than merely its identity, authorization, route, API invocation, or raw content — and is there any defensible capability a strong existing stack cannot cheaply reproduce?

### 2.2 Anti-Confirmation-Bias Protocol
The research was structured to actively kill the thesis. For every candidate gap, the anti-confirmation-bias protocol asked:
- Which existing system already does this?
- Can three commodity systems combined reproduce it?
- Is this merely workflow/database invariant, DLP, policy-as-code, an agent gateway, an LLM judge, monitoring plus automation, or an application-specific business rule?
- Does the proposed capability require a human oracle?
- Does it actually verify the effect, or only the request?
- Can the attacker perform the effect through an alternate path?
- Is the claimed novelty just a new name for existing components?

### 2.3 Adversarial Verification
25 claims were selected from 114 extracted across 29 fetched sources. Each was evaluated by 3 independent adversarial agents. Claims required 2/3 refutes to be killed.

**Verification outcomes:**
- 17 claims confirmed (68%)
- 8 claims refuted (32%)
- 0 unverified

### 2.4 Evidence Classification
Every major conclusion is tagged:
- **[FACT]** — directly confirmed by primary source
- **[PRIMARY-SOURCE FACT]** — from peer-reviewed or primary academic paper
- **[VENDOR CLAIM]** — from vendor documentation or marketing
- **[INDEPENDENT EVIDENCE]** — corroborated by independent third parties
- **[INFERENCE]** — derived from confirmed facts
- **[HYPOTHESIS]** — unconfirmed speculation

Evidence confidence: **HIGH / MEDIUM / LOW**

### 2.5 Prior Work (Killed Theses)
This research does not revisit:
1. Stateful runtime authorization differentiation (experimentally killed)
2. Tool Integrity (formally killed)
3. Cryptographic Execution Provenance (formally killed)
4. Autonomous Runtime Containment (formally killed)
5. Effective Execution Enforcement (formally killed)
6. Recovery / Trusted-State Assurance (formally killed)

### 2.6 Caveats
1. Web search budget was exhausted; synthesis relies entirely on 17 verified primary-source claims. Independent triangulation beyond these sources was not performed.
2. Several promising claims (VeriSafe Agent, VeriGuard, Envoy AI Gateway CEL, MCPGateway policy enforcement) failed adversarial verification (0-3 votes) and were excluded. Their exclusion narrows the technology map.
3. The Aegis paper (arXiv:2608.16891) is single-source, single-author, single-vendor (SPQR Technologies) with potential conflict of interest. Its empirical claims are unconfirmed by independent replication.
4. The research question's framing — "cannot cheaply reproduce" — embeds a value judgment not falsifiable; the synthesis interpreted it as "cannot reproduce with formal end-to-end guarantees" rather than "cannot reproduce with any composition of components."
5. All 2026 evidence is current as of 2026-09-05. New releases (e.g., Cedar postcondition extensions, AWS Dogwood updates, MCP security updates) could change the picture.
6. The PoE paper is a preprint; its formal soundness claims are unverified by independent peer review.
7. Vendor product capabilities (Palo Alto Prisma AIRS, Microsoft Security Copilot, CrowdStrike Charlotte AI, Zscaler ZDX, Netskope One, Wiz AI-SPM) were not directly verified; their absence from confirmed claims means the commercial product map is incomplete.

---

## 3. Effect Taxonomy

The research defines "effect" rigorously, distinguishing 12 classes. Each is evaluated for machine-readability, precondition/postcondition representability, transactional verifiability, rollback possibility, and determinism.

### 3.A API/Request Effect
**What changed:** HTTP request dispatched, RPC call made, gRPC invocation, tool call parameters passed to an external service.
**Where it exists:** Wire protocol layer, HTTP client, service mesh proxy, API gateway log.
**Machine-readable:** Yes — headers, body, status code, response schema.
**Precondition/postcondition representable:** Precondition: yes (schema, parameter bounds). Postcondition: partial (response schema validation, status code). Actual state change at the destination is opaque.
**Transactionally verifiable:** Only if the downstream service exposes transactional semantics.
**Rollback possible:** Varies. Idempotent APIs: yes. Non-idempotent: no without compensating transaction.
**Deterministic:** No — downstream service state affects response.

**Security product utility: LOW**. Request-level effects are the weakest form. All authorization engines already cover this layer.

### 3.B Database State Transition
**What changed:** Rows inserted, updated, deleted; schema altered; constraint triggered; index modified; transaction committed or rolled back.
**Where it exists:** Database engine (PostgreSQL, MySQL, DynamoDB, etc.).
**Machine-readable:** Yes — query logs, transaction logs, WAL, change data capture streams.
**Precondition/postcondition representable:** Precondition: yes (SELECT query, row count, schema state). Postcondition: yes (SELECT query validating the new state, row count, constraint satisfaction). ACID guarantees make this the strongest class for transactional verification.
**Transactionally verifiable:** Yes — databases support atomic transactions, rollback, and point-in-time recovery.
**Rollback possible:** Yes — within transaction boundaries; compensating transactions otherwise.
**Deterministic:** Yes, within ACID constraints.

**Security product utility: HIGH**. This is the most tractable class for a security product targeting effect-level assurance. Database constraints, triggers, and CDC-based verification are commodity. SessionBound (arXiv:2607.00751) explicitly demonstrates this class for AI agents — enforcing deterministic runtime checks on every database query (safe views, row scope, denied fields, operation limits, query budgets, disclosure budgets) without LLM at enforcement time.

### 3.C Filesystem State Transition
**What changed:** File created, written, truncated, renamed, permissions changed, symlink created, hard link added, directory created/removed.
**Where it exists:** OS kernel (VFS layer), filesystem audit subsystem (auditd, Windows Event Tracing), container filesystem overlay.
**Machine-readable:** Yes — kernel audit events, filesystem events via inotify/FAM, container diffs.
**Precondition/postcondition representable:** Precondition: yes (path existence, permissions, content hash). Postcondition: yes (path existence, content hash, permissions after operation).
**Transactionally verifiable:** Partial — copy-on-write filesystems and transactional filesystems (ZFS, Btrfs, ext4 with journal) support atomic operations. Standard POSIX filesystems do not.
**Rollback possible:** Yes via backup/restore or snapshots; compensating transactions for application-level rollback.
**Deterministic:** Mostly — same syscall sequence produces same result absent concurrent access.

**Security product utility: MEDIUM**. Filesystem effects are observable but transactional semantics are weaker than database effects. Sandboxing systems (gVisor, seccomp, namespace isolation) provide containment but not state-delta verification.

### 3.D Cloud Resource Mutation
**What changed:** IAM policy changed, S3 bucket ACL modified, VPC security group rule added, ECS task launched, Lambda function updated, Terraform state mutated, Kubernetes resource created/modified/deleted.
**Where it exists:** Cloud provider API layer, CloudTrail/CloudWatch logs, resource configuration state, Terraform plan output.
**Machine-readable:** Yes — cloud provider APIs expose configuration state, audit logs, and change events.
**Precondition/postcondition representable:** Precondition: yes (resource state, IAM policy snapshot). Postcondition: yes (resource state after mutation, plan diff, drift detection).
**Transactionally verifiable:** Partial — Terraform and Pulumi support plan/apply cycles; raw cloud APIs are not transactional.
**Rollback possible:** Via state restore, snapshot, or versioned resource rollback APIs.
**Deterministic:** Yes — cloud state is queryable.

**Security product utility: HIGH**. This class has the most real-world incident evidence: the DataTalks.Club `terraform destroy` incident (2.5 years of data erased, 1.9M rows deleted) demonstrates the gap between authorization (the agent was authenticated) and effect (the actual destructive state change). x-openapi-flow (GitHub, ~100-200 LOC) demonstrates that API lifecycle state machines can be enforced with commodity components.

### 3.E Identity/Credential Mutation
**What changed:** User account created, role granted/revoked, OAuth token issued, API key generated, service account created, Kerberos ticket granted, JWT claim modified.
**Where it exists:** IdP (Okta, Azure AD, Auth0), IAM service, secret manager, LDAP/Active Directory, Kubernetes ServiceAccount admission controller.
**Machine-readable:** Yes — IdP audit logs, IAM change logs, OPA policy decisions.
**Precondition/postcondition representable:** Precondition: yes (current role, requester identity, existing grants). Postcondition: yes (new role membership, new token existence).
**Transactionally verifiable:** Yes — IdP systems are transactional and auditable.
**Rollback possible:** Yes — role revocation, token revocation, credential rotation.
**Deterministic:** Yes.

**Security product utility: MEDIUM**. This is the boundary between identity and authorization. Prisma AIRS (Palo Alto) and Microsoft Defender for Cloud Apps target this class. However, it overlaps heavily with existing IAM/PAM solutions.

### 3.F Financial/Business Transaction
**What changed:** Payment processed, invoice generated, wire transfer initiated, stock trade executed, purchase order approved, budget line item consumed.
**Where it exists:** Financial system (SAP, Salesforce, Stripe, banking core), ledger, ERP, payment processor API.
**Machine-readable:** Yes — ledger entries, API responses, SWIFT/FIS messages.
**Precondition/postcondition representable:** Precondition: yes (balance check, authorization hold). Postcondition: yes (balance delta, transaction record, receipt). The challenge is the multi-system nature: a financial transaction may span a payment processor, a ledger, and an ERP system.
**Transactionally verifiable:** Yes within a single system; across systems requires saga pattern or 2PC.
**Rollback possible:** Via refund, reversal, chargeback — but costly and time-sensitive.
**Deterministic:** Yes within system; no across distributed financial systems.

**Security product utility: MEDIUM-HIGH**. Real customer pain exists here — agent-induced financial loss is documented. However, this class is typically covered by existing financial controls (maker-checker, dual-approval, financial audit) and regulatory requirements (SOX, PCI-DSS).

### 3.G Information-Flow / Data Movement
**What changed:** Data read from one system and written/moved/transmitted to another; data classification label changed; DLP rule triggered; data exfiltrated via image tag (ForcedLeak pattern), email, API call, or clipboard.
**Where it exists:** Network layer (packet capture, DLP proxy), DLP agent, CASB, cloud API logs, email gateway, SIEM.
**Machine-readable:** Partial — DLP systems can detect classification-matched patterns; data lineage systems can track lineage; but semantic meaning of the data movement requires classification context.
**Precondition/postcondition representable:** Precondition: yes (data classification, destination classification, user clearance). Postcondition: yes (data at destination, classification comparison, lineage graph).
**Transactionally verifiable:** Partial — CASB and DLP can verify policy compliance; data lineage systems track movement.
**Rollback possible:** Partial — data deletion requests (GDPR right to erasure), credential rotation.
**Deterministic:** No — classification is often probabilistic; semantic meaning of "confidential" vs "public" requires human judgment.

**Security product utility: HIGH**. The ForcedLeak vulnerability in Salesforce Agentforce (Noma Security, 2025) and the Atlassian Rovo indirect prompt injection (PromptArmor, 2026) both demonstrate this class. The gap: the AI was authorized to read the data; the effect — exfiltration via output generation or image tag — was not constrained. This is the strongest candidate class for effect-level assurance.

### 3.H External Side Effect
**What changed:** Email sent, Slack message posted, webhook dispatched, external API called (non-tool-call path), physical action triggered (smart lock opened, IoT device commanded).
**Where it exists:** External service APIs, webhook delivery systems, IoT command channels, email gateways.
**Machine-readable:** Partial — if the external system provides delivery confirmation, ACK, or webhook response; otherwise opaque.
**Precondition/postcondition representable:** Precondition: yes (pre-send state). Postcondition: partial — delivery confirmation if the external system supports it; otherwise the agent's claimed effect is unverifiable.
**Transactionally verifiable:** No for asynchronous external effects.
**Rollback possible:** Rare — email recall is unreliable; Slack messages cannot be unsent; external API calls are generally irreversible.
**Deterministic:** No — external system state and availability affect outcomes.

**Security product utility: MEDIUM**. External side effects are observable only if the external system provides instrumentation. This class is bounded by the observation completeness problem: effects outside the observable perimeter are undetectable.

### 3.I Workflow Transition
**What changed:** Workflow state machine advanced (e.g., "Draft → Under Review → Approved → Deployed"); state transition rule triggered; BPMN activity completed.
**Where it exists:** Workflow engine (Camunda, Temporal, AWS Step Functions), BPMN engine, ITSM system, CI/CD pipeline state.
**Machine-readable:** Yes — workflow state is explicitly modeled; state transition events are emitted.
**Precondition/postcondition representable:** Yes — workflow guards enforce preconditions; state validation enforces postconditions. This is the strongest existing-stack reproduction of the effect-contract idea.
**Transactionally verifiable:** Yes — workflow engines maintain explicit state machines with transactional semantics.
**Rollback possible:** Via workflow compensation (saga pattern) or state machine reversal if the workflow allows it.
**Deterministic:** Yes — state transitions are explicit and auditable.

**Security product utility: HIGH**. x-openapi-flow demonstrates that lifecycle state machine enforcement over API calls requires only 100-200 LOC with commodity components (Fastify/Express middleware + OpenAPI state machine spec). The "effect contract" concept is already deployed in this form.

### 3.J Multi-Step Cumulative Effect
**What changed:** Multiple individual actions accumulate to produce a composite effect none of the individual actions would independently trigger. Example: 10 read operations followed by 1 write that encodes all 10 reads; or a series of benign actions that collectively exceed a threshold.
**Where it exists:** Distributed across multiple system layers; requires cross-operation state tracking and aggregation.
**Machine-readable:** Partial — requires correlating events across operations, which requires either a centralized event log or distributed tracing.
**Precondition/postcondition representable:** Precondition: yes (aggregate state check). Postcondition: yes (aggregate state validation). The challenge is computational: checking aggregate invariants over large state spaces is expensive.
**Transactionally verifiable:** No for genuinely distributed multi-step effects; yes if wrapped in a single transaction.
**Rollback possible:** Via compensating transactions for each step — complex and error-prone.
**Deterministic:** No — emergent behavior from action sequences is non-deterministic without explicit modeling.

**Security product utility: MEDIUM**. This class is the hardest to secure because it requires cross-operation state tracking. Temporal logic (as in AWS Dogwood) addresses this via MFOTL operators over event history, but Dogwood evaluates over traces, not state deltas.

### 3.K Semantic/Business Effect
**What changed:** The meaning of an action relative to a business domain. Example: an agent processing a "refund" tool call — the syntactic effect is rows updated in a refund table; the semantic effect is a financial obligation created, a customer relationship affected, and a business rule (refund amount < $500) potentially violated.
**Where it exists:** Business logic layer, domain model, business rules engine.
**Machine-readable:** No in general — requires domain model encoding and business rule formalization. The boundary between syntactic (database rows changed) and semantic (business obligation created) requires business knowledge.
**Precondition/postcondition representable:** Only if the business rule is formally specified. This is the core challenge: most business rules are implicit, informal, or contextual.
**Transactionally verifiable:** Yes if formally specified and the business logic is observable.
**Rollback possible:** Varies by business rule.
**Deterministic:** No — semantic correctness requires domain judgment.

**Security product utility: LOW for general-purpose products, HIGH for domain-specific products**. This class is where "semantic" most naturally lives — but it requires an external oracle (human-authored domain model) to formalize. It cannot be automatically derived.

### 3.L Irreversible Effect
**What changed:** An effect that cannot be undone by any compensating action. Data deleted with no backup; cryptocurrency transferred; email sent; physical world action (door unlocked, machine activated).
**Where it exists:** Anywhere the effect is committed without a rollback path.
**Machine-readable:** Yes — the fact that the effect occurred is observable; whether it is irreversible may not be.
**Precondition/postcondition representable:** Precondition: yes (irreversibility check). Postcondition: yes (confirming the effect occurred).
**Transactionally verifiable:** Yes for the occurrence; no for the irreversibility.
**Rollback possible:** No.
**Deterministic:** Yes.

**Security product utility: MEDIUM**. This class is important for risk management (require human approval for irreversible effects) but does not require a new security primitive — existing workflow engines with approval gates handle it.

### 3.M Summary: Security-Product-Relevant Effect Classes

| Class | Machine-Readable | Postcondition-Checkable | Transactionally Verifiable | Rollback Possible | Deterministic | Security Utility |
|-------|-----------------|------------------------|--------------------------|------------------|---------------|----------------|
| A. API/Request | Yes | Partial | No | No | No | LOW |
| B. Database State | Yes | Yes | Yes | Yes | Yes | HIGH |
| C. Filesystem | Yes | Yes | Partial | Yes | Yes | MEDIUM |
| D. Cloud Resource | Yes | Yes | Partial | Yes | Yes | HIGH |
| E. Identity/Credential | Yes | Yes | Yes | Yes | Yes | MEDIUM |
| F. Financial/Business | Yes | Yes | Yes (within system) | Partial | Yes | MEDIUM-HIGH |
| G. Info-Flow/Data Movement | Partial | Partial | Partial | Partial | No | HIGH |
| H. External Side Effect | Partial | Partial | No | No | No | MEDIUM |
| I. Workflow Transition | Yes | Yes | Yes | Yes | Yes | HIGH |
| J. Multi-Step Cumulative | Partial | Yes | No | No | No | MEDIUM |
| K. Semantic/Business | No | Partial | Partial | Varies | No | LOW (general) / HIGH (domain) |
| L. Irreversible | Yes | Yes | Yes (occurrence) | No | Yes | MEDIUM |

**Conclusion:** Effect classes B (database state), D (cloud resource), G (information-flow), and I (workflow transition) are the most tractable for a security product targeting effect-level assurance. Classes A, H, J, and K are bounded by fundamental limitations (observation completeness, non-determinism, absence of formal domain models).

---

## 4. Preconditions / Postconditions / Effect Contracts

### 4.1 Preconditions
A precondition is a predicate that must be true before an action executes. All surveyed authorization engines (Cedar, OPA, XACML, Cel, Rego) natively support preconditions. AWS Bedrock AgentCore Cedar policies express preconditions as `when` clauses over `context.input.*`, `principal.*`, and `resource.*` attributes evaluated at request time.

**[FACT] All surveyed production authorization engines are precondition engines.**

### 4.2 Postconditions
A postcondition is a predicate evaluated after an action executes, over the actual state that resulted. **No surveyed production authorization engine has a native postcondition construct.** The Cedar language reference explicitly states: "Cedar only supports preconditions, not postconditions. There is no syntax for postconditions (such as requiring a side effect to occur after an action is authorized)." [PRIMARY-SOURCE FACT, HIGH]

### 4.3 Design by Contract
Meyer's Design by Contract (Eiffel, 1986) formalizes pre/postconditions and invariants. Its application to LLM tool-calling was proposed in ConTRACT (arXiv:2502.12560), which extends to multi-tool workflows with runtime interrupt on contract violation. This is academic only; no production deployment confirmed. [PRIMARY-SOURCE FACT, MEDIUM]

### 4.4 Formal Methods / State-Transition Systems
Temporal logic (LTL, CTL, MTL, MFOTL) enables specification of properties over sequences of states. AWS Dogwood (August 2026) extends Cedar with MFOTL operators (`formerly`, `since`, `once`, `count_within`, `sum_within`) via a `when` temporal clause, enabling policies that check event history before approving tool calls. Dogwood compiles to Cedar for point-in-time authorization decisions. This is the most formally rigorous commercial system found. [PRIMARY-SOURCE FACT, HIGH — AWS Dogwood blog, August 2026]

### 4.5 Runtime Verification
Runtime verification checks whether a running system's trace satisfies a formal specification. VIGIL (arXiv:2606.26524, June 2026) implements this via a behavioral policy language, symbolic evaluation, and SMT (Z3 solver) over execution traces. Key findings: 92.6% F1 on SkillsBench+Skill-Inject, 94.2% on AgentDojo, 96.3% on SafeAgentBench; 34 confirmed real-world violations across NVIDIA, Databricks, Trail of Bits, Cloudflare, Anthropic, and Microsoft Deep Wiki. VIGIL evaluates **traces**, not state deltas. [PRIMARY-SOURCE FACT, HIGH]

### 4.6 Information-Flow Control
Fides (Microsoft Research, arXiv:2505.23643) applies dynamic taint-tracking with confidentiality and integrity labels to AI agent planners. Key finding: dynamic IFC can enforce explicit secrecy and safety properties but cannot enforce noninterference under full generality. [PRIMARY-SOURCE FACT, HIGH]

### 4.7 Summary: What Each Approach Guarantees and Cannot Guarantee

| Approach | Guarantees | Cannot Guarantee | Timing | Semantic? | Human Spec? | Deterministic? | Agent-Aware? | Detects Unauthorized Transition | Prevents Transition? |
|----------|-----------|-----------------|--------|----------|------------|----------------|-------------|------------------------------|---------------------|
| Preconditions (Cedar, OPA, XACML) | Authorization gate satisfied before action | Actual state after action | Pre-execution | No | No | Yes | No | Only if precondition encodes it | Yes |
| Postconditions (none in production) | — | — | — | — | — | — | — | — | — |
| Design by Contract (ConTRACT) | Trace well-formedness | Real-world business semantics | Runtime interrupt | Partial | Yes | Yes | Yes | Yes | Yes |
| MFOTL Temporal Logic (Dogwood) | Event history properties | Actual state deltas | Pre-execution | No | Yes | Yes | Yes | Partial | Yes |
| Runtime Verification (VIGIL) | Trace satisfies behavioral spec | Opaque script internals, external world | Runtime | No | Yes | Yes | Yes | Yes | Yes |
| PoE (Proof of Execution) | 5 invariants (auth, path, null-on-deny, history, replay) | Contract quality, planner compromise, external world | Runtime | Partial | Yes | Yes | Yes | Partial | Yes |
| IFC (Fides) | Explicit secrecy + safety | Noninterference | Runtime | No | Yes | Yes | Partial | Partial | Partial |
| Workflow Guards (x-openapi-flow) | State machine validity | Cross-workflow effects | Pre-execution | No | Yes | Yes | No | Yes | Yes |
| Database Constraints | Physical state correctness | Business semantics | Pre/post | No | Yes | Yes | No | Yes | Yes |

**Key conclusion:** No approach currently combines all of: (a) postcondition over actual state delta, (b) deterministic enforcement, (c) semantic/business-level specification, (d) agent-awareness, and (e) prevention not just detection. Every approach sacrifices at least one.

---

## 5. Current 2026 Technology Map

### 5.1 Cedar (AWS)
- **Input observed:** Principal attributes, action, resource, context/tags at request time.
- **Property enforced:** Permit/forbid over pre-execution attributes; forbid-overrides-permit; default-deny.
- **State observable:** None — stateless request-time evaluation.
- **Preconditions:** Yes — `when` clauses over context.
- **Postconditions:** No — explicitly documented absent.
- **State-delta validation:** No.
- **Effect stop/reverse:** Stops authorization; cannot reverse.
- **LLM required:** No.
- **Composable:** Yes — commodity.
- **Strongest demonstrated:** AWS Bedrock AgentCore production deployment with 3-layer model (L1 agent-to-tool, L2 agent-to-agent, L3 user auth).

**[PRIMARY-SOURCE FACT, HIGH]** All 16 Cedar policy files in the AWS sample repo contain zero postcondition, state-delta, or effect-level checks — only `when` clauses on pre-execution attributes. Verified by direct source inspection.

### 5.2 OPA / Rego
- **Input observed:** Request attributes, user context, environment.
- **Property enforced:** ABAC/RBAC policies in Rego; intercepts at API gateway, sidecar, or in-process.
- **State observable:** None in standard deployment — request attributes only.
- **Preconditions:** Yes.
- **Postconditions:** No native construct; can be implemented via external state inspection as a custom Rego rule, but is not native.
- **State-delta validation:** No native.
- **Effect stop/reverse:** Stops at PDP; cannot reverse.
- **LLM required:** No.
- **Composable:** Yes — commodity.
- **Strongest demonstrated:** Used in MCPGateway, Envoy AI Gateway, Kubernetes admission controllers.

### 5.3 AWS Dogwood (August 2026)
- **Input observed:** Event history (sequences of tool-call events).
- **Property enforced:** MFOTL temporal policies over event history.
- **State observable:** Event trace; not persistent state delta.
- **Preconditions:** Yes (via Cedar + temporal extension).
- **Postconditions:** Partial — temporal postconditions over event sequences (e.g., "if event X occurred within time window Y, deny Z") but not over actual cloud/database state.
- **State-delta validation:** No — validates trace patterns, not state mutations.
- **Effect stop/reverse:** Stops; cannot reverse.
- **LLM required:** No.
- **Composable:** Yes — built on Cedar, available as Apache 2.0.
- **Strongest demonstrated:** Formal runtime verification over agent tool-call sequences in production (AWS Bedrock AgentCore integration).

**[PRIMARY-SOURCE FACT, HIGH — AWS Dogwood blog, August 2026]**. This is the most formally rigorous commercial system found. It directly targets the temporal/event-history dimension of effect-level governance.

### 5.4 MCP Gateway (Official MCP Project)
- **Input observed:** Identity, OAuth token, tool name, resource name, prompt, elicitation.
- **Property enforced:** RBAC/ABAC over tool access; OPA/Cedar integration for external policy.
- **State observable:** Tool invocation only; no downstream state.
- **Preconditions:** Yes (JWT scopes, tool argument CEL constraints).
- **Postconditions:** No.
- **State-delta validation:** No — explicitly audit-only.
- **Effect stop/reverse:** Stops at gateway; cannot reverse.
- **LLM required:** No.
- **Composable:** Yes.
- **Strongest demonstrated:** OWASP MCP threat model coverage, tool poisoning and prompt injection controls.

**[PRIMARY-SOURCE FACT, HIGH — MCP Gateway policy.md]**. Enforces invocation-time authorization; does not observe or constrain actual downstream state transitions.

### 5.5 VIGIL (Runtime Verification)
- **Input observed:** Agent execution trace (tool calls, parameters, return values).
- **Property enforced:** Behavioral contracts over traces; SMT-based violation detection.
- **State observable:** Trace events; not opaque script internals.
- **Preconditions:** Yes.
- **Postconditions:** No — trace-based, not state-delta-based.
- **State-delta validation:** No.
- **Effect stop/reverse:** Runtime interrupt before pending call; cannot reverse.
- **LLM required:** Optional for policy compilation (causes false positives).
- **Composable:** Partial — requires mediated sandbox environment.
- **Strongest demonstrated:** 92.6% F1, 34 confirmed real-world violations, cross-company deployment (NVIDIA, Databricks, Trail of Bits, Cloudflare, Anthropic, Microsoft Deep Wiki).

**[PRIMARY-SOURCE FACT, HIGH — arXiv:2606.26524]**. Observation completeness is a documented formal bound.

### 5.6 Proof of Execution (PoE)
- **Input observed:** Contract, event stream, replay context (C, T, R triple).
- **Property enforced:** 5 invariants — authorization (G1), path compliance (G2), null effect on deny (G3), history integrity (G4), replayability (G5).
- **State observable:** Sealed execution trace with delta_hashes for persistent state — but not external world.
- **Preconditions:** Via contract authoring.
- **Postconditions:** Partial — G3 (null effect on deny) is a postcondition over recorded state; not over real-world state.
- **State-delta validation:** Partial — validates recorded state consistency; explicitly disclaims real-world postconditions.
- **Effect stop/reverse:** Fail-closed on unresolved state; cannot reverse.
- **LLM required:** No.
- **Composable:** Partial — the formal proof structure, ECES causal DAG, and EAC issuance condition are not commodity; underlying primitives (Ed25519 signing, hash-chained ledger, pre-effect gating) are commodity.
- **Strongest demonstrated:** Formally proven 5-invariant system; single-node TypeScript prototype.

**[PRIMARY-SOURCE FACT, HIGH — arXiv:2607.05397]**. The paper explicitly states: "Valid under contract ≠ safe or well-chosen contract."

### 5.7 SessionBound (PostgreSQL Extension)
- **Input observed:** Every database query issued by an AI agent.
- **Property enforced:** Safe views, row scope, denied fields, operation limits, query budgets, disclosure budgets.
- **State observable:** Actual database state.
- **Preconditions:** Yes — query structure validation.
- **Postconditions:** Yes — query result validation.
- **State-delta validation:** Yes — directly observes database state.
- **Effect stop/reverse:** Stops at database layer; cannot reverse committed writes.
- **LLM required:** No — enforcement is deterministic.
- **Composable:** Yes — PostgreSQL extension.
- **Strongest demonstrated:** Agent-specific database enforcement without LLM oracle at enforcement time.

**[PRIMARY-SOURCE FACT, MEDIUM — arXiv:2607.00751]**. This is the strongest existing demonstration of direct state-delta enforcement for AI agents, and it uses commodity database infrastructure.

### 5.8 Strands Agents Interventions
- **Input observed:** Before/after each model call, before/after each tool call, before invocation.
- **Property enforced:** Five return types — Proceed, Deny, Guide, Confirm, Transform.
- **State observable:** Model outputs, tool call parameters, tool call results.
- **Preconditions:** Yes.
- **Postconditions:** Partial — after-tool-call intervention can validate result.
- **State-delta validation:** No.
- **Effect stop/reverse:** Yes — Deny and Transform return types.
- **LLM required:** No.
- **Composable:** Yes — composable control layer.
- **Strongest demonstrated:** Five lifecycle interception points; deterministic enforcement.

**[PRIMARY-SOURCE FACT, MEDIUM — Strands agents docs]**. Strong interception model; limited to observable traces.

### 5.9 pg_policy (PostgreSQL Extension)
- **Input observed:** Every database query.
- **Property enforced:** Agent Policy Language (APL) over database layer.
- **State observable:** Actual database state.
- **Preconditions:** Yes.
- **Postconditions:** Yes.
- **State-delta validation:** Yes.
- **Effect stop/reverse:** Stops at DB layer.
- **LLM required:** No.
- **Composable:** Yes.
- **Strongest demonstrated:** Deterministic database-layer enforcement for agents.

**[SECONDARY SOURCE, MEDIUM]**. This is the same category as SessionBound — database-layer enforcement using commodity infrastructure.

### 5.10 x-openapi-flow (GitHub)
- **Input observed:** API requests.
- **Property enforced:** State machine lifecycle rules (Draft → Under Review → Approved → Deployed).
- **State observable:** API resource state.
- **Preconditions:** Yes (state machine guards).
- **Postconditions:** Yes (state machine post-transition validation).
- **State-delta validation:** Yes — blocks invalid transitions with HTTP 409.
- **Effect stop/reverse:** Blocks at middleware layer.
- **LLM required:** No.
- **Composable:** Yes — 100-200 LOC of commodity components (Fastify/Express + OpenAPI spec).
- **Strongest demonstrated:** Demonstrates that the "effect contract" concept over state transitions is reproducible with 100-200 LOC of commodity components.

**[PRIMARY-SOURCE FACT, MEDIUM]**. This is the strongest existing-stack reproduction finding.

---

## 6. Current 2026 Commercial Product Map

### 6.1 AWS Bedrock AgentCore (Cedar)
- **Exact capability:** Three-layer Cedar ABAC (L1 agent-to-tool, L2 agent-to-agent, L3 user auth); forbid-overrides-permit; parameter-level authorization (context.input.amount < 500).
- **Enforcement location:** Pre-execution at Cedar evaluator Lambda invoked after model decision, before tool execution.
- **Input signal:** Principal attributes, action, resource, context/tags from the request.
- **Policy model:** Permit/forbid with when clauses; stateless; independent evaluation.
- **Deterministic:** Yes.
- **Prevention vs detection:** Prevention (pre-execution deny).
- **Pre vs post-execution:** Pre-execution only.
- **Known limitations:** No postcondition, no state-delta, no observation of actual effects. Explicitly delegates semantic content filtering to Bedrock Guardrails.
- **Resembles effect-contract:** No — request-time precondition engine only.

**[PRIMARY-SOURCE FACT, HIGH]**

### 6.2 AWS Dogwood (August 2026)
- **Exact capability:** MFOTL temporal logic over event history for agent tool-call sequences; compiles to Cedar for point-in-time decisions.
- **Enforcement location:** Pre-execution at Cedar evaluator with Dogwood temporal extension.
- **Input signal:** Event history (sequences of tool-call events).
- **Policy model:** MFOTL (formerly, since, once, count_within, sum_within) over event traces.
- **Deterministic:** Yes.
- **Prevention vs detection:** Prevention.
- **Pre vs post-execution:** Pre-execution (checks history before approving next call).
- **Known limitations:** Evaluates trace patterns, not actual state deltas. Does not observe what the tool actually changed in the database/cloud/storage.
- **Resembles effect-contract:** Partial — temporal preconditions over event history; not postconditions over state.

**[PRIMARY-SOURCE FACT, HIGH]**

### 6.3 Microsoft Security Copilot / Defender for Cloud Apps
- **Exact capability:** Content filtering, behavioral monitoring, agent-specific security controls.
- **Enforcement location:** Agent gateway / cloud access.
- **Input signal:** Agent actions, content, behavior patterns.
- **Policy model:** AI-assisted policy generation; content classification.
- **Deterministic:** Partial — probabilistic content filtering.
- **Prevention vs detection:** Detection + some prevention.
- **Pre vs post-execution:** Both.
- **Known limitations:** Content filtering, not state-delta validation. Does not validate actual database/cloud state changes.
- **Resembles effect-contract:** No.

**[VENDOR CLAIM, MEDIUM]**

### 6.4 Palo Alto Networks Prisma AIRS
- **Exact capability:** Agent security posture management, tool-use governance, agent inventory.
- **Enforcement location:** Cloud security platform.
- **Input signal:** Agent actions, tool calls, configuration.
- **Policy model:** Agent-specific security policies.
- **Deterministic:** Partial.
- **Prevention vs detection:** Detection + posture management.
- **Pre vs post-execution:** Both.
- **Known limitations:** Not directly verified; classified as detection/posture management.
- **Resembles effect-contract:** No.

**[VENDOR CLAIM, MEDIUM]**

### 6.5 Operant Semantic Firewall
- **Exact capability:** "Semantic" inspection of tool calls, commands, and data payloads; allow/block/redact decisions in real time.
- **Enforcement location:** Inline, inside customer perimeter.
- **Input signal:** Tool call meaning, data payload content.
- **Policy model:** Natural-language-authored policies over security intent.
- **Deterministic:** No — "semantic" inspection implies LLM-based classification.
- **Prevention vs detection:** Prevention.
- **Pre vs post-execution:** Pre-execution.
- **Known limitations:** "Semantic" likely means LLM-based classification, not deterministic effect verification. Natural-language policies require an LLM oracle to interpret. No confirmed postcondition construct.
- **Resembles effect-contract:** No — content classification, not state-delta verification.

**[VENDOR CLAIM, MEDIUM]**

### 6.6 Cyera Agent Guardian
- **Exact capability:** Inline interception of dangerous tool calls, blocking unauthorized data transfers, quarantining compromised agents.
- **Enforcement location:** Inline in execution path.
- **Input signal:** Tool calls, data transfer operations.
- **Policy model:** MCP policy-based enforcement.
- **Deterministic:** Partial.
- **Prevention vs detection:** Prevention.
- **Pre vs post-execution:** Pre-execution.
- **Known limitations:** Intercepts at tool call level; does not validate actual state changes.
- **Resembles effect-contract:** No.

**[VENDOR CLAIM, MEDIUM]**

### 6.7 CrowdStrike Charlotte AI, SentinelOne Purple AI, Zscaler ZDX, Netskope One, Wiz AI-SPM
- **Exact capability:** Behavioral monitoring, AI-specific threat detection, agent security posture management.
- **Enforcement location:** Cloud / endpoint security platform.
- **Input signal:** Agent behavior, tool calls, data access patterns.
- **Policy model:** AI/ML-based behavioral detection.
- **Deterministic:** No — probabilistic detection.
- **Prevention vs detection:** Primarily detection.
- **Known limitations:** Behavioral monitoring, not state-delta validation. No confirmed postcondition enforcement.

**[VENDOR CLAIM, LOW-MEDIUM]**

### 6.8 Commercial Product Summary

| Product | Effect-Level Postcondition | State-Delta Validation | Deterministic | Pre/Post-Execution | Prevention | Observation Complete |
|---------|--------------------------|----------------------|--------------|---------------------|------------|---------------------|
| AWS Bedrock AgentCore (Cedar) | No | No | Yes | Pre | Yes | No |
| AWS Dogwood | Partial (temporal) | No | Yes | Pre | Yes | No |
| Microsoft Security Copilot | No | No | Partial | Both | Partial | No |
| Palo Alto Prisma AIRS | No | No | Partial | Both | Partial | No |
| Operant Semantic Firewall | No | No | No | Pre | Yes | No |
| Cyera Agent Guardian | No | No | Partial | Pre | Yes | No |
| CrowdStrike Charlotte AI | No | No | No | Both | Detection | No |
| MCP Gateway | No | No | Yes | Pre | Yes | No |
| OPA/Rego | No | No | Yes | Pre | Yes | No |

**[INFERENCE, HIGH]** No confirmed commercial product provides deterministic, post-execution state-delta postcondition validation. All operate pre-execution or at the trace/content level.

---

## 7. Current 2025–2026 Research Map

### 7.1 Proof of Execution (PoE) — Rhodes & Kang (arXiv:2607.05397)
- **Problem:** Runtime verification of AI agent actions against formal contracts.
- **Threat model:** Compromised planner, tampered execution, unauthorized state mutation.
- **Mechanism:** (C, T, R) triple — Contract + Execution Trace + Replay Context. Prime Execution Model (PEM) separates planning, enforcement, effect, and recordkeeping. 5 invariants validated: authorization (G1), path compliance (G2), null effect on deny (G3), history integrity (G4), replayability (G5).
- **What is proven:** That the sealed execution trace satisfies the contract's structural constraints and that deny-branches produce no persistent state.
- **Benchmark:** Single-node TypeScript prototype; ~2.7ms overhead on minimal flows, 4.4% on batch workloads.
- **Limitations:** (a) Valid under contract ≠ safe or well-chosen contract — silent on contract quality; (b) Replayable ≠ reproducible in the world — silent on external world state; (c) Planner compromise out of scope; (d) Single-Gateway scope; composition open; (e) Deployment assumptions A3–A7 enter the soundness bound.
- **LLM required:** No.
- **Existing primitives could reproduce:** Partial — underlying mechanisms (Ed25519 signing, hash-chained ledger, pre-effect gating) are commodity; formal proof structure, ECES causal DAG, and EAC issuance condition are not.
- **Deployment assumptions:** A3 (Gateway signing root), A4 (Recorder sealing root), A5 (trace completeness), A6 (dependency declaration completeness), A7 (clock monotonicity).

**[PRIMARY-SOURCE FACT, HIGH]**

### 7.2 VIGIL — Li et al., UCLA/Tian group (arXiv:2606.26524)
- **Problem:** Runtime enforcement of behavioral specifications in AI agent skills.
- **Threat model:** Agent violates behavioral policy during execution.
- **Mechanism:** Behavioral policy language over agent-tool events; symbolic evaluation; SMT (Z3) with quantifier-free formulas; minimal unsatisfiable core for violation witness.
- **What is proven:** That the observed execution trace satisfies the behavioral specification.
- **Benchmark:** 92.6% F1 on SkillsBench+Skill-Inject (152 labeled runs); 94.2% on AgentDojo; 96.3% on SafeAgentBench; 34 confirmed real-world violations (NVIDIA, Databricks, Trail of Bits, Cloudflare, Anthropic, Microsoft Deep Wiki).
- **Limitations:** (a) Opaque script internals hide events from trace (false negatives); (b) LLM policy compilation can over-generalize (false positives); (c) collector completeness assumed; (d) single-skill scope.
- **LLM required:** Optional — for policy compilation; causes false positives.
- **Existing primitives could reproduce:** Partial — requires mediated sandbox, behavioral policy language, and SMT solver; not commodity.
- **Deployment assumptions:** Complete event observation (all behavioral effects surface as tool calls).

**[PRIMARY-SOURCE FACT, HIGH]**

### 7.3 Aegis — Mazzocchetti, SPQR Technologies (arXiv:2608.16891)
- **Problem:** Runtime governance of agentic AI via execution boundary mediation.
- **Threat model:** Agent exceeds authorized action scope during execution.
- **Mechanism:** Trusted runtime as decision layer; model outputs as untrusted proposals; Senate-style quorum-based non-unilateral authorization for high-stakes actions; server-side provenance resolution.
- **What is proven:** In sandbox corpus (6,300 rows, 42 tasks, 3 conditions, 10 repeats): zero governed risky side-effect completions in 2,100 governed rows; 79 risky side-effect leaks in prompt-policy comparator.
- **Benchmark:** Same sandbox corpus.
- **Limitations:** (a) Corpus-bound — no production evidence; (b) Single-source, single-author, single-vendor — no independent replication; (c) Author is from company building the evaluated product; (d) Governance restricted to observable tool actions; (e) Silently excluded from confirmed claims due to conflict of interest.
- **LLM required:** No.
- **Existing primitives could reproduce:** Partial — PEP/PDP architecture is standard; Senate-style quorum is classical maker-checker; the specific integration is novel but not novel primitives.

**[PRIMARY-SOURCE FACT, MEDIUM — conflict of interest caveat]**

### 7.4 FAVA — Formal Authorization for Verified Agents (arXiv:2607.27267)
- **Problem:** Formal authorization verification for agent actions.
- **Threat model:** Agent actions violate formal security policies.
- **Mechanism:** Agent instructions → intermediate representation → evidence-backed permission graph → SMT-based authorizer.
- **What is proven:** Formal authorization compliance via SMT verification.
- **Benchmark:** 90.5% DCR across OpenAgentSafety, OctoBench, ActPlane.
- **Limitations:** Requires external policy specification; SMT solver overhead; policy-to-formal-model translation requires human guidance.
- **LLM required:** Partial — for policy translation.
- **Existing primitives could reproduce:** Yes — all components (IR, permission graph, SMT authorizer) are commodity or composable from existing tools.

**[PRIMARY-SOURCE FACT, MEDIUM]**

### 7.5 Alignment Contracts for Agentic Security — arXiv:2605.00081
- **Problem:** Formal contract formalism for agentic systems.
- **Threat model:** Agent exceeds authorized effect scope.
- **Mechanism:** Contracts over finite effect alphabet Σ = {NET, FS, EXEC} with trace-based semantics; Lean 4 artifact; Effect Observability Assumption (EOA) bounds all guarantees.
- **What is proven:** Enforcement soundness under EOA; contract algebra with refinement and composition rules; undecidability transfer for pre-admission checking.
- **Benchmark:** Theoretical only.
- **Limitations:** Explicit EOA bounds all guarantees to mediated/observable effects; formal guarantee is only as strong as effect-observability infrastructure. Undecidability results show pre-admission checking cannot guarantee effect-level properties.
- **LLM required:** No.
- **Existing primitives could reproduce:** Partial — the formalism is novel; the underlying mechanisms (event logging, policy evaluation) are commodity.

**[PRIMARY-SOURCE FACT, MEDIUM]**

### 7.6 CVA — Cryptographically Verifiable Agent Authorization (arXiv:2607.21325)
- **Problem:** Cryptographically verifiable binding of agent principal + authorization request + execution context + policy satisfaction.
- **Threat model:** Authorization-soundness gap (authorization binding ≠ runtime execution binding).
- **Mechanism:** R_CVAR_CVA formal model; requires trust anchors (TEEs, remote attestation).
- **What is proven:** That authorization binding is NOT equivalent to runtime execution binding — a structural gap requiring trust anchors.
- **Benchmark:** Theoretical only (Groth16 prototype).
- **Limitations:** (a) CVA model is preliminary; no complete security proofs; only "constructive feasibility" demonstrated; (b) Authorization-soundness claim is unproven; (c) Requires TEE/attestation infrastructure.
- **LLM required:** No.
- **Existing primitives could reproduce:** Partial — TEE/attestation is not commodity for all deployments.

**[PRIMARY-SOURCE FACT, MEDIUM]**

### 7.7 Solver-Aided Verification — Winston et al. (arXiv:2509.11437)
- **Problem:** SMT-based verification of pre/post conditions across multi-step agent plans.
- **Threat model:** Agent actions violate formal policies.
- **Mechanism:** Human-guided LLM-assisted translation of natural-language policies to SMT constraints; Z3 solver evaluation.
- **What is proven:** 29% policy violation rate on TauBench airline with Z3 (down from ~50% baseline) for pre-execution validation.
- **Benchmark:** TauBench airline, 1,242-word policy, 13 tools.
- **Limitations:** (a) Domain-specific; (b) Requires human-guided translation; (c) Pre-execution only — does not observe actual state deltas; (d) Automatic translation frequently fails.
- **LLM required:** Yes — for policy translation (not at enforcement time).
- **Existing primitives could reproduce:** Yes — Z3 and policy translation are commodity; human guidance is the bottleneck.

**[PRIMARY-SOURCE FACT, MEDIUM]**

### 7.8 VeriSafe Agent — arXiv:2509.11437 (REFUTED — 0-3 votes)
Claimed 94.33%–98.33% accuracy in verifying agent actions against formalized user intent. **Refuted as overreach.** The 94.33% figure applies to a specific benchmark; the claim overstates the scope and independence of the evaluation. [REFUTED, HIGH]

### 7.9 VeriGuard — arXiv:2510.05156 (REFUTED — 0-3 votes)
Claimed exhaustive offline formal verification + lightweight online runtime monitoring → formal safety guarantees. **Refuted as overreach.** The claim conflates offline formal verification of a behavioral policy with runtime safety guarantees for the agent itself. [REFUTED, HIGH]

---

## 8. Standards / Formal Models

### 8.1 NIST Agent Security Work
NIST has published AI risk management frameworks and is actively working on AI security standards. No formal standard for "effect-level assurance" or "effect contracts" for autonomous agents was identified in the current survey. The closest NIST concepts are AI risk taxonomy (NIST AI RMF) and the AI Incident Database. [INFERENCE, MEDIUM]

### 8.2 IETF Draft: Agent Operation Authorization (draft-liu-02, March 2026)
**Standards Track** IETF draft defining JWT-based two-phase authorization for delegating actions from human principals to autonomous agents. Two-phase protocol: Agent Operation Authorization Request + Agent Operation Authorization Token. Includes agent-to-agent delegation via delegation_chain claim. OPA Rego policies evaluated at the Authorization PDP.

**[PRIMARY-SOURCE FACT, HIGH — IETF datatracker]**. Operates at the authorization layer, not the effect layer. Addresses delegation and authorization, not post-execution state validation.

### 8.3 MCP Security Specifications
The Model Context Protocol (MCP) specification (current version 2026-07-28) defines security primitives including OAuth 2.1 authentication, RBAC/ABAC for tools/resources/prompts/elicitation, and OWASP MCP threat model coverage (tool poisoning, prompt injection). MCP Gateway policy enforcement uses OPA and Cedar as external policy engines.

**[PRIMARY-SOURCE FACT, HIGH]**. No postcondition or state-delta construct in the MCP specification.

### 8.4 AWS Dogwood / MFOTL
AWS Dogwood (August 2026) extends Cedar with MFOTL operators. This is a vendor extension, not a standards-track specification. However, it represents the most formally rigorous commercial temporal policy system for agents in 2026.

**[PRIMARY-SOURCE FACT, HIGH]**

### 8.5 Zanzibar / Google Authorization System
Zanzibar (Google's consistent authorization system) provides global, consistent authorization with relationship-based access control. It operates at the authorization layer, not the effect layer. No postcondition construct. [INFERENCE, HIGH]

### 8.6 XACML
XACML provides policy-based access control with ABAC. It has a request-response model (authorization decision at request time). No postcondition or state-delta validation. [INFERENCE, HIGH]

### 8.7 OWASP Top 10 for Agentic Applications (2026)
OWASP has published agent-specific security risks including ASI03 (Excessive Agency — "AI takes unintended or harmful actions that go beyond the intended scope of the system"). ASI03 directly corresponds to the effect-level assurance question. The OWASP guidance recommends minimizing agency, adding circuit breakers, and implementing human-in-the-loop — not formal effect contracts.

**[PRIMARY-SOURCE FACT, HIGH — genai.owasp.org]**

### 8.8 Key Finding: "Effect-Level Assurance" Is Not Formally Defined
No standards body, formal model, or widely-accepted specification defines "effect-level assurance" as a standardized concept. The closest formal concepts are:
- Runtime verification (temporal logic over traces)
- Design by Contract (pre/postconditions over function contracts)
- Information-flow control (security labels over data movement)
- State-machine enforcement (lifecycle state transition guards)

**[INFERENCE, HIGH]** The terminology is not standardized; any RAPHA product claim using this terminology must define the concept precisely.

---

## 9. Existing-Stack Reproduction Analysis

This is the most critical section. For each candidate capability, the question is: **can an enterprise engineering team reproduce the proposed capability with existing primitives?**

### 9.1 State-Machine / Workflow Effect Contracts
**Capability:** Enforce that an API state transition is valid given the current resource lifecycle state (e.g., Draft → Under Review → Approved).
**Existing components:** Fastify/Express middleware + OpenAPI state machine spec + workflow guard.
**LOC:** ~100-200.
**New infrastructure required:** None — commodity stack.
**Novelty:** None — this is standard API design practice.

**[VERIFIED — 100-200 LOC commodity reproduction found: x-openapi-flow (GitHub)]**

### 9.2 Database State-Delta Postconditions
**Capability:** Before/after validation of database state for AI agent queries (row scope, safe views, operation limits, query budgets).
**Existing components:** PostgreSQL extension (pg_policy) + database constraints + query rewriting.
**LOC:** One PostgreSQL extension.
**New infrastructure required:** None — commodity database infrastructure.
**Novelty:** Application to AI agent context is novel; the enforcement mechanism is not.

**[VERIFIED — SessionBound (arXiv:2607.00751) and pg_policy demonstrate this with commodity infrastructure]**

### 9.3 Temporal Preconditions Over Event History
**Capability:** Check that a tool call is consistent with the history of prior tool calls (e.g., don't approve `deploy` without prior `test`).
**Existing components:** AWS Dogwood (MFOTL over Cedar) + event log.
**New infrastructure required:** Dogwood is Apache 2.0; deployable with Cedar infrastructure.
**Novelty:** Temporal logic over event history is well-established (LTL, CTL); Dogwood's contribution is the MFOTL extension and Cedar integration.

**[VERIFIED — Dogwood is deployed and Apache 2.0]**

### 9.4 PEP/PDP Mediation with Maker-Checker
**Capability:** Treat LLM as untrusted proposer; route through trusted decision layer; require quorum for high-stakes actions.
**Existing components:** OPA/Rego + workflow engine + signing infrastructure.
**New infrastructure required:** Minimal — standard enterprise infrastructure.
**Novelty:** None — this is standard PEP/PDP + maker-checker pattern predating LLMs by decades.

**[VERIFIED — PEP/PDP is RFC 2753; maker-checker is financial systems practice]**

### 9.5 Cryptographic Execution Provenance
**Capability:** Bind an authorization decision to an execution trace with cryptographic attestation.
**Existing components:** Signed audit log + hash-chained ledger + TEE (optional).
**New infrastructure required:** TEE for hardware attestation; otherwise commodity.
**Novelty:** The integration is the claimed novelty (PoE's ECES causal DAG); individual primitives are commodity.

**[VERIFIED IN PART — commodity primitives, novel integration without formal proof]**

### 9.6 SMT-Based Precondition Verification
**Capability:** Formal verification of agent plans against SMT-encoded policies before execution.
**Existing components:** Z3 solver + policy translation pipeline.
**New infrastructure required:** Policy authoring and translation tooling.
**Novelty:** Domain-specific policy translation; SMT solvers are commodity.

**[VERIFIED — Solver-Aided Verification (arXiv:2509.11437) uses commodity Z3]**

### 9.7 Runtime Behavioral Verification (VIGIL-Style)
**Capability:** Check execution traces against behavioral specifications using SMT.
**Existing components:** Behavioral policy language + SMT solver + mediated execution environment.
**New infrastructure required:** Mediated sandbox environment (significant); behavioral policy language (non-commodity).
**Novelty:** The policy language and mediated environment are the non-commodity components.
**Bypass:** Opaque script internals hide events from trace; collector completeness assumption is the bound.

**[VERIFIED PARTIAL — VIGIL requires non-commodity mediated environment; trace-based, not state-delta-based]**

### 9.8 DLP / Information-Flow Control
**Capability:** Detect or prevent unauthorized data movement by AI agents.
**Existing components:** CASB + DLP + data classification + SIEM.
**New infrastructure required:** None — commodity enterprise infrastructure.
**Novelty:** None — DLP has been deployed for decades; AI agent context is the application.
**Bypass:** AI agent can exfiltrate via output generation (image tags, text encoding) that DLP does not typically inspect.

**[VERIFIED — DLP is commodity; the gap is that output exfiltration (ForcedLeak pattern) bypasses traditional DLP]**

### 9.9 Composite: Identity + Authorization + API Schema + DB Constraints + Workflow Guard + DLP + State-Delta Inspection
**Composition:** JWT auth + Cedar + OpenAPI schema + PostgreSQL constraints + Fastify middleware + DLP + CDC pipeline.
**Can this reproduce effect-level postcondition validation?** For classes B (database state), D (cloud resource), I (workflow transition), and G (information-flow) — partially yes. For class K (semantic/business) — no, requires human oracle.

**[INFERENCE, HIGH]** The combination of database constraints + workflow guards + DLP + API schema validation covers most tractable effect classes. The gap is narrow.

### 9.10 What Cannot Be Reproduced with Existing Primitives

After evaluating all compositions, the following remain non-reproducible with commodity components:

1. **Formal end-to-end proof** that an authorized action's actual state delta satisfies a declared postcondition, where:
   - The postcondition is machine-checkable without LLM oracle (deterministic)
   - The observation boundary is complete (all effects observable)
   - The system is provably closed under arbitrary alternative code paths (not single-Gateway)

This combination — (a) state delta not trace, (b) machine-checkable not LLM-judged, (c) closed under alternative code paths not single-Gateway, (d) formally proven not empirically demonstrated — is the irreducible residual.

**[INFERENCE, MEDIUM]** This residual is narrow and formal-property-focused. Its commercial meaningfulness is the open question.

---

## 10. Semantic vs Syntactic vs Policy vs Effect Verification

The term "semantic" is ambiguous. The research separates 10 distinct levels:

| Level | Description | Deterministic | Formally Specifiable | Commercially Deployed | Reproducible by Existing Systems |
|-------|-------------|--------------|---------------------|----------------------|--------------------------------|
| 1. Syntactic validation | Format, schema, syntax | Yes | Yes | Yes (JSON Schema, OpenAPI) | Yes |
| 2. Schema validation | Parameter bounds, types, enums | Yes | Yes | Yes (Cedar `when`, OPA `input`) | Yes |
| 3. Policy validation | Authorization rules, RBAC/ABAC | Yes | Yes | Yes (Cedar, OPA, Zanzibar) | Yes |
| 4. Data classification | Sensitivity labels, DLP patterns | Partial | Yes (by classifier) | Yes (CASB, DLP) | Yes |
| 5. Information-flow validation | Data movement tracking, lineage | Partial | Yes (by model) | Yes (CASB, lineage tools) | Yes |
| 6. State-transition validation | Lifecycle state machine rules | Yes | Yes | Yes (x-openapi-flow, workflow engines) | Yes |
| 7. Causal validation | Effect attribution to specific actions | Partial | Yes (with instrumentation) | Partial (PoE, event sourcing) | Partial |
| 8. Business-rule validation | Domain rules (e.g., "refund < $500") | Yes | Yes | Partial (rule engines) | Partial |
| 9. Semantic intent interpretation | What the action means in context | No | No | No | No |
| 10. Open-ended semantic judgment | "Is this a good action?" | No | No | No | No |

**Key finding:** The commercial product landscape covers levels 1–6 and partially 7–8 with deterministic, commodity components. Levels 9–10 require an LLM oracle and are not security guarantees. The effect-level assurance question is meaningful only for levels 6–8, and those levels are already served by existing products.

**[INFERENCE, HIGH]** The "semantic" gap collapses to a narrow formal-property gap: causal validation (level 7) and business-rule validation over actual state deltas (level 8) at the post-execution level, not just the pre-execution or trace level.

---

## 11. Real Customer Problems

### 11.1 Cursor AI / PocketOS Production Database Deletion (April 2026)
**What happened:** A Cursor AI agent (Claude Opus 4.6) deleted a production database and backups in 9 seconds via a Railway API token with blanket permissions. 30+ hour outage; car rental customers stranded.
**Effect class:** D (cloud resource mutation).
**The gap:** The agent was authenticated and authorized to use the Railway API token. The effect — total database deletion — was not constrained. No authorization engine could observe or prevent the actual state change because the authorization was at the API token level, not the database state level.
**Current mitigation:** Delayed-delete logic patched by Railway after incident.
**Customer pain:** Real, documented, significant (30-hour outage, customer impact, financial loss).

**[PRIMARY-SOURCE FACT, HIGH — The Register, April 2026]**

### 11.2 Atlassian Rovo Indirect Prompt Injection / Data Exfiltration (2026)
**What happened:** Two independent research teams disclosed indirect prompt injection paths in Atlassian Rovo enabling enterprise data exfiltration. Rovo's delegated access spans SharePoint, Outlook, Slack, Microsoft 365, Google Workspace. One path was unfixed for months after disclosure.
**Effect class:** G (information-flow / data movement).
**The gap:** The AI was authorized to read CRM, Jira, and Confluence data. The effect — exfiltration via image tag in output generation — was not constrained. No authorization engine observes that "read CRM data → generate output" constitutes exfiltration when the output routes to an external channel.
**Current mitigation:** Rovo access controls, prompt injection detection.
**Customer pain:** Real, documented, enterprise-wide exposure.

**[PRIMARY-SOURCE FACT, HIGH — PromptArmor, 2026]**

### 11.3 ForcedLeak in Salesforce Agentforce (September 2025)
**What happened:** Indirect prompt injection via Web-to-Lead forms in Salesforce Agentforce enabled CRM data exfiltration. An expired trusted domain allowed exfiltrated data to be routed to an attacker-controlled server.
**Effect class:** G (information-flow / data movement).
**The gap:** The AI was authorized to query CRM data. The effect — exfiltration via output generation routed to an external domain — was not constrained. The authorization gap: "AI was permitted to query CRM data" ≠ "AI was permitted to exfiltrate that data through output generation."
**Current mitigation:** Salesforce patched September 2025.
**Customer pain:** Real, documented.

**[PRIMARY-SOURCE FACT, HIGH — Noma Security, 2025]**

### 11.4 DataTalks.Club Terraform Destroy (February 2026)
**What happened:** A Claude Code agent executed `terraform destroy` against a live production Terraform state, deleting 1,943,200 database rows and erasing 2.5 years of student assignment submissions.
**Effect class:** D (cloud resource mutation).
**The gap:** The agent had authenticated access to the Terraform state. The effect — data destruction — was not constrained by any authorization engine. No state-delta postcondition was checked: "is it appropriate for this agent to delete this many rows right now?"
**Current mitigation:** Manual; no automated prevention system would have caught this without a state-delta constraint.
**Customer pain:** Real, documented, severe (2.5 years of data permanently lost).

**[SECONDARY-SOURCE FACT, MEDIUM — GitHub incident report]**

### 11.5 Enterprise Agent Security Incidents — Survey Data
- **54%** of organizations have experienced or suspect an AI agent security/data privacy incident (Gravitee State of AI Agent Security Report, April 2026, 750 executives).
- **34.9%** confirmed an actual incident occurred.
- Most common failure pattern: **excessive permissions / over-privileged access**.
- **71%** of CISOs say AI has access to core business systems but only **16%** govern that access effectively (Saviynt CISO AI Risk Report, 2026, 235+ CISOs).
- **92%** lack full visibility into AI identities.
- **95%** doubt they could detect AI misuse.

**[PRIMARY-SOURCE FACT, HIGH — Gravitee 2026 report; Saviynt 2026 report]**

### 11.6 Real Customer Pain Summary

| Problem | Effect Class | Who Experiences It | Consequence | Current Mitigation | Pain Remaining |
|---------|-------------|-------------------|-------------|-------------------|----------------|
| Database deletion (PocketOS) | D (cloud resource) | Developer teams | 30-hour outage, customer impact | Post-hoc patch | Permanent data loss still possible |
| Data exfiltration (Rovo, Agentforce) | G (info-flow) | Enterprise IT/Security | Data breach, compliance violation | Access controls, prompt injection detection | Authorization ≠ effect; output exfiltration still possible |
| Terraform destroy (DataTalks) | D (cloud resource) | DevOps teams | 2.5 years of data permanently lost | None (post-hoc) | No automated prevention |
| Over-privileged agents | E (identity/credential) | CISOs, Security teams | Lateral movement, data exposure | IAM, least privilege | Agent autonomy makes least-privilege hard to maintain |
| Agent behavior outside policy | Multiple | CISOs, Security teams | Financial loss, compliance, reputational | Monitoring, guardrails, human-in-the-loop | Agents still exceed authorized scope |

**Conclusion:** Real customer pain exists across classes D and G. However, the current mitigation is improving (access controls, delayed-delete logic, IAM hardening). The gap is specifically: **authorization at the request/invocation level ≠ effect-level constraint**. This is a real, documented gap.

**[FACT, HIGH]**

---

## 12. Candidate Security Properties

Candidate properties must be stated precisely. Bad examples:
- "Make agents safer" — not precise
- "Understand agent intent" — requires LLM oracle
- "Prevent bad actions" — not precise
- "Verify semantics" — not precise

Good candidate forms:

### Property P1: State-Delta Postcondition
"For workflow W, after an authorized agent action completes, the resulting database state ΔS must satisfy predicate P(ΔS, S_before, task_context), otherwise execution is rolled back or the transaction is aborted."

- **P objectively evaluable:** Yes — SELECT query, row count, constraint satisfaction.
- **Who defines P:** Domain engineer or business analyst.
- **Deterministic:** Yes — P is a SQL predicate.
- **Enforceable atomically:** Yes — database transaction.
- **Bypass:** No — enforced at the database layer.
- **Existing systems already express P:** Yes — database constraints + transaction logic. SessionBound (arXiv:2607.00751) demonstrates this.
- **Verdict:** Covered by existing stack. KILL.

### Property P2: Cloud-Resource State-Delta Postcondition
"For Terraform apply action A, after execution, the resource state S_after must satisfy drift-check predicate D(S_before, S_after, authorized_scope), and any resource deletion exceeding threshold T must require human approval."

- **P objectively evaluable:** Yes — Terraform plan diff + threshold check.
- **Who defines P:** DevOps engineer.
- **Deterministic:** Yes — diff is deterministic.
- **Enforceable atomically:** Partial — plan/apply cycle enables pre-commit validation.
- **Bypass:** No — enforced at Terraform layer.
- **Existing systems already express P:** Yes — Terraform Sentinel policies, Prisma Cloud, AWS Config rules.
- **Verdict:** Covered by existing stack. KILL for cloud-resource class; residual for the agent-autonomy context specifically.

### Property P3: Information-Flow Postcondition
"For any AI agent action that reads data from source system S, if the output of that agent's session is routed to destination D, and D is not in the authorized_output_scope(S), the action is prevented or D's data access is redacted."

- **P objectively evaluable:** Partial — requires data lineage tracking and output routing visibility.
- **Who defines P:** Security engineer.
- **Deterministic:** Partial — classification may be probabilistic.
- **Enforceable atomically:** No for asynchronous output; yes for synchronous.
- **Bypass:** Yes — via output generation (image tags, text encoding) that DLP does not typically inspect.
- **Existing systems already express P:** Partial — DLP covers some cases; output-generation exfiltration (ForcedLeak pattern) is not covered.
- **Verdict:** Real gap, but requires output-layer instrumentation not typically present.

### Property P4: Cumulative Effect Postcondition
"For any sequence of actions by agent A within session S, if the aggregate effect Σ(ΔS_i) crosses threshold T, subsequent actions in S are escalated for human approval."

- **P objectively evaluable:** Yes — sum of delta magnitudes tracked in session log.
- **Who defines P:** Security engineer, business analyst.
- **Deterministic:** Yes.
- **Enforceable atomically:** Partial — threshold crossing triggers escalation before next action.
- **Bypass:** No — enforced at session level.
- **Existing systems already express P:** Yes — rate limiting, quota systems, session budgets.
- **Verdict:** Covered by existing session management. KILL.

### Property P5: Causal Attribution Postcondition
"For any observed security incident I, the system can construct a causal DAG attributing I to a specific agent action A and a specific state transition ΔS, with cryptographic proof that A produced ΔS."

- **P objectively evaluable:** Partial — requires instrumentation.
- **Who defines P:** Security engineer.
- **Deterministic:** Yes — causal DAG is deterministic given instrumentation.
- **Enforceable atomically:** No — post-incident attribution, not prevention.
- **Bypass:** N/A — this is forensic, not preventive.
- **Existing systems already express P:** Partial — PoE provides causal attribution via ECES; commodity signed audit logs provide partial attribution.
- **Verdict:** Forensic, not preventive. Not a prevention property.

### Property P6: Formal End-to-End Effect Contract (Narrow Residual)
"For an authorized workflow W, any state transition ΔS produced by an agent must satisfy declared postcondition predicate P(ΔS, S_before, task_context), where: (a) P is machine-checkable without an LLM oracle; (b) the observation boundary is complete (all effects of A observable); (c) the system is provably closed under arbitrary alternative code paths; and (d) execution is atomically prevented if ¬P(ΔS)."

- **P objectively evaluable:** Yes — if P is formally specified.
- **Who defines P:** Domain engineer; P must be formalizable.
- **Deterministic:** Yes — P is a formal predicate.
- **Enforceable atomically:** Yes — with pre-commit validation.
- **Bypass:** No — by construction.
- **Existing systems already express P:** No system simultaneously achieves (a)+(b)+(c)+(d). Dogwood achieves (a)+(d) over traces. VIGIL achieves (a)+(d) over traces. PoE achieves (b)+(c) partially over recorded state. None achieves all four.
- **Verdict:** Narrow, formal-property residual. Survives all bypass tests. The commercial meaningfulness is the open question.

### Property P7: Effect-Complete Authorization
"For any action A by agent X in context C, if A produces effect E on resource R, then: authorize(A, X, C) AND verify_postcondition(E, R, P) must both be true, where P is the postcondition declared for the tool producing E."

- **P objectively evaluable:** Yes — if P is formally specified.
- **Who defines P:** Tool author or domain engineer.
- **Deterministic:** Yes.
- **Enforceable atomically:** Yes — pre-commit validation of both authorization and postcondition.
- **Bypass:** No — both gates must pass.
- **Existing systems already express P:** No — Cedar/OPS/OPA can do the authorization gate; no production system does both gates over actual state.
- **Verdict:** This is the precise gap. Covered only partially by PoE (traces, not real-world state) and Dogwood (traces, not state deltas).

---

## 13. Adversarial Analysis

For each candidate property, test realistic attacks:

### Attack A1: Authorized API, Unauthorized State Change
An agent calls `POST /api/update-balance` which is authorized. The balance update is $999,999 (not $500) — within the API's parameter range but outside the business rule. **P1 (state-delta postcondition) catches this.** Existing precondition-only systems (Cedar) do not. **Survives this attack.**

### Attack A2: Valid Action, Excessive Magnitude
An agent calls `DELETE /api/records` with `limit=1000000` — technically authorized for any positive limit. **P2 (cloud-resource threshold) catches this.** Existing authorization engines checking only the action type (not the magnitude) do not. **Survives this attack.**

### Attack A3: Valid Action, Wrong Target
An agent is authorized to read from the CRM database. It reads from the "customers" table and exfiltrates the data via an image tag in an email. **P3 (information-flow postcondition) catches this.** Existing DLP does not typically inspect email output. **Survives this attack, but requires output-layer instrumentation.**

### Attack A4: Valid Action, Wrong Sequence
An agent calls `terraform apply` without a prior `terraform plan` review step. **P4 (cumulative effect + sequence check) catches this.** Dogwood's temporal logic can express this. **Survives this attack.**

### Attack A5: Valid Action, Hidden Side Effect
An agent calls a tool that appears to only read data but also exfiltrates via a side channel (e.g., timing, error messages, response compression). **P3 and P6 catch this only if the side channel is observable.** If the side effect is outside the observation boundary, neither property can detect it. **Bypasses P3 and P6 for non-observable side effects.**

### Attack A6: Transaction Partially Executes Before Detection
A state-delta postcondition check is performed after the database transaction commits. The effect has already occurred. **P1 (atomic state-delta postcondition) requires pre-commit validation to prevent this.** Post-commit validation only detects, does not prevent. **P1 survives only if pre-commit enforcement is implemented.**

### Attack A7: Indirect Effect Through Another Service
Agent calls `GET /api/sensitive-data` (authorized), then a second service (not under the agent's control) propagates the data to an unauthorized destination. **P3 (information-flow postcondition) cannot catch this** because the propagation is not an agent action. **Bypasses P3.**

### Attack A8: Delayed Side Effect
Agent schedules a task that executes after the agent session ends. The postcondition check is run at session end, but the scheduled task runs later. **P6 (formal end-to-end effect contract) must account for asynchronous effects.** If the observation boundary does not extend to scheduled tasks, P6 is bypassed. **Bypasses P6 for asynchronous effects outside the observation window.**

### Attack A9: Concurrent Side Effects
Multiple agents simultaneously modify the same resource, producing a race condition where each individual action's postcondition is satisfied but the aggregate result is not. **P4 (cumulative effect postcondition) catches this** if it evaluates the aggregate state. **Survives this attack.**

### Attack A10: Attacker Exploits Allowed Primitive to Achieve Forbidden Aggregate Effect
An agent is authorized to read 10 individual customer records. Reading all 10 customers in sequence is individually authorized, but reading all 10 simultaneously constitutes a bulk exfiltration. **P4 (cumulative effect postcondition) catches this** if it tracks aggregate data access. **Survives this attack.**

---

## 14. Candidate Matrix

| # | Property | Exact Definition | Attack Addressed | Current Technologies | Current Products | Research State | Deterministic | Enforceable | External Oracle Required | Existing-Stack Reproduction Path | Implementation Complexity | Likely Bypass | Customer Evidence | Novelty Potential | Confidence | KILL Reason |
|---|----------|-----------------|-----------------|--------------------|--------------------|---------------|--------------|-------------|------------------------|-------------------------------|------------------------|--------------|-----------------|-----------------|-----------|-------------|
| 1 | State-delta postcondition (database) | After action A, DB state ΔS must satisfy P(ΔS, S_before) | A1: authorized API, unauthorized state | DB constraints, CDC, transaction logic | SessionBound, pg_policy, DB triggers | Deployed (research) | Yes | Yes (pre-commit) | No | DB constraint + transaction logic | Low | Partial if effect is outside DB | Strong (PocketOS, DataTalks) | Low | Already deployed |
| 2 | Cloud-resource state-delta postcondition | After `terraform apply`, drift-check D(S_before, S_after) must pass; deletions > T require human approval | A2: excessive magnitude | Terraform Sentinel, AWS Config, drift detection | Prisma Cloud, AWS Config, Terraform Cloud | Deployed | Yes | Yes (pre-apply) | No | Terraform Sentinel policies | Medium | None if pre-apply enforcement | Strong (DataTalks) | Low | Already deployed |
| 3 | Information-flow postcondition | If agent reads S and output routes to D not in authorized_scope(S), prevent or redact | A3, A5: wrong target, hidden side effect | DLP, CASB, data lineage, output inspection | Cyera, Netskope, Zscaler, Operant | Partial (DLP) / research (output inspection) | Partial | Yes (pre-output) | No | DLP + output inspection layer | Medium-High | Output-generation exfiltration (ForcedLeak) | Strong (Rovo, Agentforce, ForcedLeak) | Medium | Partial — DLP is commodity; output-layer inspection is not |
| 4 | Cumulative effect postcondition | If Σ(ΔS_i) crosses threshold T in session S, escalate next action | A4, A9, A10: wrong sequence, concurrent effects, aggregate effect | Rate limiting, quota systems, session budgets, Dogwood MFOTL | Dogwood, OPA quota policies, API gateways | Deployed (rate limiting) / research (MFOTL) | Yes | Yes (pre-action) | No | Rate limiter + session tracking | Low | None | Medium | Low | Already deployed |
| 5 | Temporal preconditions (event history) | Next tool call must satisfy MFOTL predicate over event history H | A4: wrong sequence | Dogwood, VIGIL trace analysis, event sourcing | Dogwood (AWS), VIGIL | Deployed (Dogwood) / research (VIGIL) | Yes | Yes (pre-execution) | No | Dogwood is Apache 2.0 | Medium | None | Medium | Low | Already deployed commercially |
| 6 | Causal attribution postcondition | Incident I must be attributable to specific action A and ΔS via causal DAG with cryptographic proof | Forensic (not preventive) | PoE, signed audit logs, event sourcing | PoE (research), commodity signed logs | Research | Yes | No (forensic only) | No | PoE primitives are commodity (Ed25519, hash chain) | Medium-High | None | Medium | Medium | Forensic, not preventive — reduces to monitoring |
| 7 | Formal end-to-end effect contract (state delta, complete observation, closed under alternative paths, provable) | For workflow W, ΔS must satisfy P(ΔS, S_before) where P is formal, observation-complete, provably closed, and checked before commit | A1, A2, A6, A9, A10 | None (PoE partial) | None (PoE research-only) | Research only | Yes | Yes (pre-commit) | No | Partial — underlying primitives commodity; formal proof structure not | High | Opaque effects outside observation; async effects | None (formal only) | High | Narrow residual — formal-property gap |
| 8 | Effect-complete authorization (auth + postcondition both required) | authorize(A, X, C) AND verify_postcondition(E, R, P) both must be true for action A | A1, A2 | None in production | None | Research only | Yes | Yes | No | Both gates independently reproducible; together not deployed | High | Both gates must be implemented; complexity increases | None (inferred from real incidents) | High | This is the candidate property |
| 9 | Workflow lifecycle state machine enforcement | API state transition must satisfy state machine M before mutation is committed | A4: wrong sequence | x-openapi-flow, workflow engines, BPMN | Camunda, Temporal, Step Functions | Deployed | Yes | Yes (pre-transition) | No | 100-200 LOC of commodity components | Low | None | Medium | Low | Already deployed |
| 10 | Semantic/business-level effect postcondition | After action A, the business effect B must satisfy predicate Q(B, business_context) | A1, A2 (business semantics) | Business rule engines, formal business specification | Domain-specific rule engines | Research (requires formal domain model) | Partial | Yes (with formal spec) | Yes (human oracle for Q) | Business rule engine + formal specification | High | Q requires human-authored formal domain model | Medium (indirect from incidents) | Medium | Requires human oracle — not autonomously enforceable |
| 11 | LLM-judged effect correctness | After action A, an LLM evaluates whether the effect is appropriate given task context | A1-A10 (all) | LLM-as-judge, VeriSafe (REFUTED) | None confirmed | Research (all REFUTED) | No | Partial | Yes (LLM) | N/A | N/A | LLM judge is not a security guarantee | None confirmed (VeriSafe REFUTED) | None | Requires external oracle — not a deterministic security property |

---

## 15. Strongest Residual Gap

After exhaustive analysis, the following properties are **KILLED** (already reproducible with commodity components):

1. **Database state-delta postconditions** → SessionBound, pg_policy, DB constraints.
2. **Cloud-resource state-delta postconditions** → Terraform Sentinel, AWS Config, Prisma Cloud.
3. **Cumulative effect postconditions** → Rate limiting, quota systems, Dogwood.
4. **Temporal preconditions over event history** → Dogwood MFOTL.
5. **Workflow lifecycle state-machine enforcement** → x-openapi-flow (100-200 LOC).
6. **PEP/PDP mediation with maker-checker** → OPA + workflow engine + signing.
7. **Information-flow detection** → DLP + CASB.
8. **LLM-judged effect correctness** → All claims REFUTED (VeriSafe, VeriGuard, etc.).

### Surviving Residual: P7 + P8 — Formal End-to-End Effect Contract + Effect-Complete Authorization

The narrow residual that survives all bypass tests and cannot be reproduced with commodity components is:

> **"For an authorized workflow W, any state transition ΔS produced by an agent must simultaneously satisfy: (a) the authorization predicate A(X, A, C) — already covered by existing systems; AND (b) the formal postcondition predicate P(ΔS, S_before, task_context) — where P is machine-checkable without an LLM oracle, the observation boundary is complete (all effects of A are observable), the system is provably closed under arbitrary alternative code paths, and execution is atomically prevented if ¬P(ΔS)."**

This is the combination of **formal end-to-end effect contract (P7)** and **effect-complete authorization (P8)**.

**Why it survives:**
- (a) is already covered by existing systems (Cedar, OPA).
- (b) is not covered: no existing production system simultaneously achieves formal postcondition + complete observation + provable closure + atomic prevention over actual state deltas.
- Dogwood achieves temporal preconditions over traces — not postconditions over state.
- VIGIL achieves behavioral specification over traces — not state deltas.
- PoE achieves formal 5-invariant guarantees over recorded state — but single-Gateway assumption (not closed under alternative paths) and external-world gap.
- SessionBound achieves database state-delta enforcement — but not provably closed under alternative code paths.
- x-openapi-flow achieves state-machine enforcement — but over API lifecycle state, not arbitrary state deltas.

**What would be required to falsify this residual:**
A narrow technical falsification experiment must determine whether:
1. A production deployment can achieve complete observation (all effects of an agent action are captured in the enforcement layer) for a specific, defined effect class.
2. A formal postcondition over that state delta can be specified by a domain engineer without an LLM oracle.
3. The system can provably prevent execution when the postcondition is violated, and be provably closed under alternative code paths.
4. The combination is economically meaningful — i.e., customers would pay for this property beyond what they get from existing stack.

**What does NOT falsify this residual:**
- Showing that precondition enforcement (Cedar, OPA) is sufficient.
- Showing that trace-based runtime verification (VIGIL, Dogwood) is sufficient.
- Showing that database constraints alone are sufficient.
- Showing that workflow state-machine enforcement is sufficient.
- Showing that LLM-as-judge can evaluate effect correctness.

---

## 16. KILL Conditions

The following kill conditions are **CONFIRMED**:

1. **KILL: Cedar and all ABAC engines have no postcondition.** [PRIMARY-SOURCE FACT, HIGH] All production authorization engines are precondition engines. This kills the idea that "current authorization already does this."

2. **KILL: All leading runtime verification systems explicitly disclaim real-world effect verification.** [PRIMARY-SOURCE FACT, HIGH] PoE: "Valid under contract ≠ safe or well-chosen contract." VIGIL: bounded by observation completeness. Aegis: corpus-bound. This kills the idea that research systems already solve the problem.

3. **KILL: AWS Dogwood validates event history, not state deltas.** [PRIMARY-SOURCE FACT, HIGH] MFOTL over traces is not state-delta postcondition validation. This kills the idea that AWS has already solved this.

4. **KILL: x-openapi-flow reproduces the "effect contract" concept for API state transitions in 100-200 LOC.** [PRIMARY-SOURCE FACT, MEDIUM] This kills the idea that the concept is novel or non-reproducible for the API lifecycle case.

5. **KILL: SessionBound and pg_policy reproduce database-layer effect enforcement with commodity infrastructure.** [PRIMARY-SOURCE FACT, MEDIUM] This kills the idea that database state-delta enforcement requires new infrastructure.

6. **KILL: LLM-judged effect correctness claims (VeriSafe, VeriGuard) are REFUTED 0-3.** [REFUTED, HIGH] This kills the idea that an LLM oracle can serve as the effect oracle.

7. **KILL: PEP/PDP mediation and maker-checker patterns are decades-old.** [PRIMARY-SOURCE FACT, MEDIUM] This kills the idea that treating the LLM as an untrusted proposer is novel.

8. **KILL: Information-flow control (DLP, CASB) already addresses the data exfiltration class.** [INFERENCE, HIGH] The gap is specifically output-generation exfiltration (ForcedLeak pattern), not general DLP. This narrows the gap further.

---

## 17. Evidence Quality / Confidence

| Conclusion | Evidence Type | Confidence | Notes |
|-----------|-------------|------------|-------|
| All production ABAC engines are precondition-only | PRIMARY-SOURCE FACT | HIGH | Cedar docs, AWS sample repo, OPA docs — all confirmed |
| All runtime verification systems disclaim real-world effects | PRIMARY-SOURCE FACT | HIGH | Direct quotes from PoE, VIGIL, Aegis papers |
| Observation completeness is the fundamental bound | PRIMARY-SOURCE FACT | HIGH | VIGIL ε_dep, PoE A6, field-wide corroboration |
| AWS Dogwood is trace-based, not state-delta-based | PRIMARY-SOURCE FACT | HIGH | AWS Dogwood blog, August 2026 |
| x-openapi-flow reproduces effect contracts in 100-200 LOC | PRIMARY-SOURCE FACT | MEDIUM | GitHub source verified |
| SessionBound/pg_policy do DB state-delta enforcement | PRIMARY-SOURCE FACT | MEDIUM | arXiv:2607.00751 |
| LLM-judged effect correctness claims are REFUTED | REFUTED | HIGH | 0-3 votes on VeriSafe, VeriGuard |
| Real customer pain exists (database deletion, data exfiltration) | PRIMARY-SOURCE FACT | HIGH | PocketOS, Rovo, Agentforce, DataTalks |
| Narrow formal-property residual exists | INFERENCE | MEDIUM | Grounded in confirmed claims; commercial meaningfulness unverified |
| Commercial products do not provide this | INFERENCE | MEDIUM | Not directly verified for all products; absence of evidence |
| No standard defines "effect-level assurance" | INFERENCE | HIGH | Standards survey confirmed; closest concepts identified |

---

## 18. Final Determination

**DETERMINATION: B — RESEARCHABLE RESIDUAL**

The evidence forces this conclusion, not a preference for a new RAPHA idea.

### Why NOT A (NO VIABLE RESIDUAL):
The "semantic/business effect" framing is too broad — most of it is already covered by existing stack. But the narrow residual (formal end-to-end effect contract with complete observation + provable closure + atomic prevention) is not covered by any confirmed production system. The combination of (a) state delta not trace, (b) machine-checkable not LLM-judged, (c) provably closed under alternative code paths, (d) formally proven — does not appear in any confirmed source.

### Why NOT C (STRONG RESIDUAL):
The residual is a formal-property gap, not a confirmed commercial product gap. The commercial meaningfulness is unverified. The narrowness of the residual — requiring complete observation, formal specification by a domain engineer, provable closure under alternative paths, and formal proof — makes it a research challenge, not a near-term product differentiator. A dedicated falsification design is needed before declaring this a strong residual.

### Why B (RESEARCHABLE RESIDUAL):
The formal end-to-end effect contract gap is real, documented by the academic literature (PoE, Alignment Contracts, CVA), and acknowledged by all leading systems as an open problem. It is narrow enough to be falsifiable with a focused experiment. The open question is whether it is commercially meaningful — i.e., whether customers would pay for this property beyond what they get from the existing stack composition.

---

## 19. Recommendation for Next Gate

### Next Gate: Narrow Technical Falsification of P7/P8

**The next gate is NOT to design a RAPHA product. It is to determine whether P7/P8 is a real, commercially meaningful gap or an academic curiosity.**

**Falsification question:**
> "For a defined effect class (database state transitions or cloud resource mutations), can a domain engineer specify a formal postcondition P(ΔS, S_before) without an LLM oracle, and does the resulting system provide property guarantees that cannot be achieved by composing existing commodity components (database constraints + workflow guards + DLP + state-delta inspection) with formal verification?"

**If yes:** Proceed to determine if this is a product differentiator or a research contribution.

**If no:** Kill the theme and move on.

**Specific next steps:**
1. **Identify the narrowest possible effect class** for the falsification (database state transitions is the most tractable).
2. **Define a concrete postcondition P** for that class that is not reducible to a database constraint.
3. **Determine whether P can be specified by a domain engineer** without an LLM oracle.
4. **Build the minimal system** that achieves (a) complete observation, (b) formal postcondition, (c) provable closure under alternative code paths, (d) atomic prevention.
5. **Compare against existing stack composition** (SessionBound + pg_policy + workflow guards + DLP).
6. **If the minimal system is not meaningfully better than the existing stack composition**, kill the theme.

**Stop condition:** If step 6 shows no meaningful improvement, do not proceed to product design.

---

## Appendix: Research Statistics

1. **Sources reviewed:** 29 (after dedup from 35+ fetched)
2. **Primary sources:** 20 (arXiv papers, AWS docs, MCP spec, IETF draft, OWASP, GitHub repos)
3. **Independent research sources:** 7 (PoE, VIGIL, Aegis, Dogwood, FAVA, Alignment Contracts, CVA)
4. **Strongest existing technologies found:** AWS Dogwood (MFOTL temporal logic, production), SessionBound/pg_policy (DB state-delta enforcement, commodity), x-openapi-flow (state-machine enforcement, 100-200 LOC)
5. **Strongest commercial products found:** AWS Bedrock AgentCore with Cedar (production, ABAC precondition only), AWS Dogwood (MFOTL, August 2026, production), MCP Gateway (official, production-ready)
6. **Strongest papers/research found:** Proof of Execution (Rhodes & Kang, arXiv:2607.05397), VIGIL (Li et al., arXiv:2606.26524), Alignment Contracts (arXiv:2605.00081)
7. **Top candidate properties:** P7 (Formal end-to-end effect contract) and P8 (Effect-complete authorization) — the narrow residual
8. **Strongest reasons to KILL the theme:** x-openapi-flow (100-200 LOC reproduces effect contracts for API lifecycle), SessionBound (commodity DB infrastructure does state-delta enforcement), Dogwood (production MFOTL for temporal preconditions), all LLM-judge claims REFUTED
9. **Strongest residual:** Formal end-to-end effect contract (state delta + complete observation + provable closure + atomic prevention + formally proven) — the combination of all four properties is not achieved by any confirmed system
10. **Final determination:** B — RESEARCHABLE RESIDUAL
11. **Exact next action:** Narrow technical falsification experiment for P7/P8 against defined effect class (database state transitions)
12. **Confirmation:** No code or experiment files were modified. This document is the sole deliverable.

---

*Research conducted 2026-09-05 using adversarial web research with 3-vote verification per claim, 111 agents, 863 tool calls, and 4.1M subagent tokens across 5 phases.*
