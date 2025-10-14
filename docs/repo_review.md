# Repository Review

## Summary
This document lists notable issues and potential risks identified during a quick review of the AgentPrep codebase.

## Findings

### 1. Division-by-zero risk in SimLab metrics aggregation
`simlabQueries.getProjectMetrics` divides the sum of latency and cost values by `totalRuns` without handling the `0` case. When no completed runs exist, `totalRuns` is `0`, so `avgLatency` and `avgCost` become `NaN`, and `Math.round(avgLatency)` will also yield `NaN`. Downstream UI or API consumers would then receive unusable metric values. Add an early return for the zero-run case or guard the division with a fallback denominator of `1`.【F:src/lib/db/queries.ts†L83-L109】

### 2. Connectors section never populates
The UI renders a connectors section, but `loadUseCase` never calls an API to fetch connector records and `agentPrepApi` lacks any connector endpoints. As a result, the connectors list will always be empty, and users cannot document connectors through the current interface. Implement connector CRUD functions in the API client and call them during use-case loading to make the section functional.【F:src/components/AgentPrep.tsx†L51-L147】【F:src/components/agentPrepApi.ts†L1-L206】【F:src/components/AgentPrepSections.tsx†L635-L757】

### 3. Authentication defaults leak all use cases into a shared account
`App.tsx` automatically signs every visitor in anonymously, while `AgentPrep` hard-codes `ownerId = 'default-user'`. This combination means every session writes to the same owner in the backend, making it impossible to segregate tenant data and potentially exposing other users' use cases. Replace the anonymous auto-login with a real authentication flow and pass the authenticated UID into the application instead of the `default-user` placeholder.【F:src/App.tsx†L7-L43】【F:src/components/AgentPrep.tsx†L30-L96】

