# RAPHA V2 — Master Research Map

**Company:** EmmaTech  
**Product:** RAPHA  
**Scope:** RAPHA V2 research only  
**Status:** Research thesis not yet frozen; no new V2 architecture authorized

## 1. Purpose

This document consolidates the RAPHA V2 research completed so far. Its purpose is to preserve the work, prevent repeated investigation of killed directions, and define the evidence gate that must be passed before another V2 architecture is designed.

Core rule:

> A RAPHA V2 capability advances only if a concrete security property remains after a strong existing-stack reproduction attempt, is enforceable, is materially security-relevant, and is economically meaningful.

The research reset explicitly prohibited architecture, requirements, tasks, or code until a residual survives a dedicated falsification against a genuinely strong baseline. [Source: RAPHA V2 Research Reset]

## 2. Starting Point: Pebble Concepts

The early RAPHA V2 work explored several related security ideas:

- Behavioral runtime authorization
- Validated autonomous response / closed-loop remediation
- Post-compromise trusted state
- State-delta security / Zero Trust boundary
- Secretless workload-to-workload IAM / NHI trust

The notebook progression then moved toward a broader continuous machine-trust concept combining identity, behavioral trust, state delta, and autonomous response.

These are historical hypotheses, not validated V2 architecture.

## 3. What the First Falsification Actually Proved

The authoritative experiment tested a specific differentiation claim: a minimal RAPHA runtime component (System C) would produce security decisions that a strong enterprise baseline (System B) could not reproduce when both received the same execution context and shared Cedar decision engine.

Measured result:

- B and C agreed on all 12 scenarios.
- Attack matrix: A = TP0/FN8/FP0/TN3; B = C = TP6/FN2/FP3/TN0.
- E10 produced authorization DENY in B/C but the resource was still reached through the tested bypass path.
- All fairness checks passed.
- The baseline reproduced the candidate with approximately 176 lines of B-specific shim.

Therefore the frozen differentiation thesis was experimentally KILLED. This result does **not** prove that every underlying agent-security problem is solved; it proves that this proposed RAPHA differentiator did not outperform the tested strong baseline.

## 4. Killed RAPHA V2 Directions

| Direction | How evaluated | Result | Core reason for KILL |
|---|---|---|---|
| Stateful runtime authorization differentiation | Full A/B/C adversarial falsification | KILLED | Strong baseline reproduced candidate decisions on 12/12 scenarios |
| Tool integrity / substitution | Formal predicate/specification review | KILLED | Candidate predicate reduced to the baseline's identity, registry, version, signature, match, and freshness checks |
| Cryptographic execution provenance | Formal redundancy analysis | KILLED | Verifiable provenance properties reduce to standard signing/attestation/interposition compositions; signing does not prove truthful physical execution |
| Autonomous runtime containment | Formal redundancy analysis | KILLED | Deterministic triggers are generic policy/automation; actuation is commodity; inline decision reduces to the killed authorization thesis |
| Effective execution enforcement | Formal analysis + E10 evidence | KILLED | Tested bypasses were deployment/configuration categories, not an architecture-level residual; standard mesh/network controls can close the path |
| Recovery / trusted-state assurance | Formal redundancy analysis | KILLED | Integrity/authenticity/replay are commodity; “known-good” or semantic safety requires an oracle or is not provable |
| Semantic / effect-level assurance (broad) | 2026 market + technical research | KILLED as a broad wedge | Existing systems cover significant classes; remaining claims risk oracle dependence, detection-only semantics, or application-specific business logic |
| Distributed / cross-system effect contracts | 2026 adversarial falsification research | KILLED | Ten candidates killed; remaining observation-completeness residual was detection-only and reducible to existing instrumentation/orchestration patterns |

The Research Reset records the first six directions and their statuses, including the explicit rule not to rescue them by renaming, adding more Cedar/OPA rules, accumulating history, adding cryptographic logging, adding another PEP, generic containment, recovery automation, or inline LLM judging.

## 5. The Structural Lesson

Across the completed gates, the same failure mode repeatedly appears:

> If the proposed RAPHA mechanism computes a deterministic decision from inputs that the strong baseline is allowed to receive under the fairness model, the baseline can often reproduce that decision using existing primitives plus a small integration shim.

This is why adding more policy, history, telemetry, PEPs, cryptography, or workflow logic is not by itself evidence of differentiation.

## 6. Current Security-Layer Map

The research reset currently separates the security problem into these layers:

1. **Identity** — who/what is acting.
2. **Authorization** — whether the requested action is permitted.
3. **Invocation** — which tool/API/action is called.
4. **Execution** — whether the call actually reaches the resource.
5. **Effect** — what actually changes in the world.
6. **Semantic correctness** — whether that effect is actually safe, intended, or correct.

The first four layers have strong existing primitives. The reset identifies semantic/behavioral correctness, detection quality, and enforcement-completeness assurance as remaining boundaries, but explicitly marks them as unresolved questions rather than validated RAPHA capabilities.

## 7. Distributed / Cross-System Research Result

The latest report tested ten concrete classes of cross-system security properties:

1. Cross-system transaction invariant
2. Aggregate budget invariant
3. Cross-service data-flow contract
4. Distributed workflow postcondition
5. Multi-agent shared-state invariant
6. Asynchronous effect contract
7. Causal effect constraint
8. Irreversible-effect condition
9. Cross-domain effect containment
10. Deployment pipeline invariant

All ten were KILLED.

The report's final determination is **A — NO VIABLE RESIDUAL** for this theme. It concludes that candidates were either reproducible with existing components, limited by distributed-system constraints, detection-only, or application-specific business logic.

Important evidence-quality caveat: the report itself records that its commercial product survey was incomplete, enterprise incident data was limited, and some recent technology claims were not independently verified. Therefore, the KILL is strongest for the tested security-property formulations and their identified reproduction paths; individual market statements from the report should not automatically be treated as independently established facts.

## 8. What We Must Not Do Now

Do not:

- start another V2 implementation;
- modify RAPHA V1;
- rename an already-killed thesis and continue it;
- add features until a differentiation story appears;
- select a product architecture before a security property is frozen;
- treat “AI is becoming more capable” as proof of a new RAPHA wedge;
- start another broad multi-week research cycle without a sharply bounded question.

## 9. What We Have Actually Gained

The three-week effort is now a reusable negative-space map.

We have evidence showing that RAPHA should not be positioned merely as another:

- authorization engine;
- agent gateway / PEP;
- tool-integrity layer;
- provenance ledger;
- generic containment controller;
- execution-enforcement shim;
- trusted-state/recovery engine;
- cross-system postcondition monitor.

This is valuable because future candidate generation can be tested against known failure patterns instead of repeatedly rebuilding similar architectures.

## 10. Current V2 Status

**RAPHA V2 architecture: NOT FROZEN**

**Validated differentiated security primitive: NONE**

**Completed research: HIGH VALUE / PRESERVED**

**Implementation status for a new V2 wedge: PAUSED**

**RAPHA V1: UNCHANGED / OUT OF SCOPE**

## 11. Next Research Gate — Narrow Discovery, Not Another 3-Week Sprint

Before selecting another thesis, perform one focused discovery gate around the changing security environment for increasingly capable autonomous AI systems.

This is a **research signal**, not a product decision.

Research question:

> As AI systems become more capable, autonomous, adaptive, tool-using, and increasingly effective in cybersecurity tasks, does that capability create a concrete security property that existing authorization, identity, gateway, sandboxing, monitoring, provenance, containment, workflow, and policy systems cannot reproduce?

The gate must investigate:

- what cyber-capable frontier models can actually do today;
- which security failures arise specifically from increased autonomy/capability rather than ordinary excessive permissions;
- which existing commercial and open-source controls already address those failures;
- whether any remaining property is deterministic or otherwise precisely testable;
- whether the property is enforceable rather than merely observable;
- whether it has demonstrated customer/security pain;
- and whether a strong existing-stack baseline can reproduce it.

The output is **not an architecture**. The output is a small set of candidate security properties with explicit KILL conditions.

## 12. Promotion Rule

A candidate may become the RAPHA V2 thesis only if it survives all of the following:

1. Real security problem with evidence of meaningful impact.
2. Precise security invariant.
3. Machine-checkable for a useful class.
4. Enforceable at the relevant security boundary.
5. Not reducible to composition of existing primitives.
6. Resistant to alternate execution paths.
7. No dependence on an undefined human/LLM “safe” oracle for correctness.
8. Reproducible falsification experiment.
9. Economically meaningful differentiation.

Ties and baseline reproductions default to **KILL**.

## 13. Final Position

The three weeks were not a failed product build. They were a successful elimination phase.

The correct conclusion today is not:

> “RAPHA V2 has a new direction.”

It is:

> “RAPHA V2 now has a strong evidence-backed map of what not to build, a repeatable falsification method, and a much narrower search space for the actual differentiated security boundary.”

Only after the next focused discovery gate identifies a surviving property should RAPHA V2 move from research back into architecture and implementation.
