# Full Workflow

Use this reference only after the user selects mode `2` or direct execution selects Full workflow.

Full workflow is for broader or riskier coding tasks where traceability and review matter.

## Fit

Use Full workflow for:

- broad changes
- risky changes
- migrations
- API or behavior changes
- security-sensitive code
- refactors touching several files
- tasks where the user explicitly selects `2`

## Task Note

Task notes are mandatory in Full workflow.

Before editing project files, create or update:

```text
.codex/simplepowers/YYYY-MM-DD-<short-task-name>.md
```

If that path is not writable, create an equivalent note in the nearest writable task/work directory and report the path.

Do not skip the note merely because it creates repository noise. Instead, keep it local unless the user asks to commit it or the repository clearly treats `.codex/simplepowers/` notes as committed artifacts.

Suggested note shape:

```md
# Task: <title>

## Execution Prompt
<confirmed prompt>

## Goal
<what success means>

## Context
<files, modules, commands, constraints>

## Assumptions
- <safe assumptions>

## Non-goals
- <what will intentionally not be changed>

## Done when
- [ ] Implementation complete
- [ ] Focused checks pass
- [ ] Relevant tests pass
- [ ] Diff reviewed
- [ ] Subagent review completed or skipped with reason
- [ ] Commit created or skipped with reason

## Plan
1. Slice 1: ...
2. Slice 2: ...
3. Slice 3: ...

## Progress log
- <slice progress and validation results>

## Review notes
- <self-review and subagent findings>

## Final result
- <summary>
```

## Execution Flow

For each slice:

1. State the slice objective.
2. Make the minimal relevant change.
3. Run focused validation.
4. Record command and result.
5. Fix failures before moving on unless the next slice is required to make validation possible.

Prefer this order:

1. Add or identify a failing test/reproduction.
2. Implement the smallest useful change.
3. Wire integration.
4. Update tests, docs, or types.
5. Clean up only changes caused by this task.
6. Run final verification.

## Review

Use subagent review for non-trivial, broad, or risky Full workflow changes when available.

Suggested reviewer angles:

- bug/regression
- test coverage
- maintainability/scope
- security when relevant

Use security review when the diff touches auth, permissions, secrets, data access, network calls, payments, user-generated input, migrations, deletion logic, or concurrency-sensitive code.

Ask reviewers to review the diff only and return:

```md
## Findings

### Critical
- ...

### Major
- ...

### Minor
- ...

## Suggested fixes
- ...

## Verdict
pass / pass with nits / needs changes
```

If subagents are unavailable, run the same checklist yourself and record the skipped subagent review reason.

After review:

1. Summarize findings.
2. Fix critical and major findings unless clearly false positives.
3. Re-run relevant validation.
4. Do not accept unrelated scope expansion from reviewers.

## Final Verification

Before finishing, run when available:

```bash
git diff --stat
git diff --check
```

Run the strongest practical focused tests/checks.

Run lint, typecheck, or build when relevant and reasonably available.

Record all results, including skipped checks and reasons.

## Stop Conditions

Finish when:

- implementation matches the Execution Prompt
- focused and relevant checks pass or skips are justified
- review has no unresolved critical or major issue
- final diff remains scoped
- commit is created only when shared commit rules allow it

Stop as blocked only when a real external or product-decision blocker prevents progress.
