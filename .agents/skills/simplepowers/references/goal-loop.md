# Goal Loop Workflow

Use this reference only after the user selects mode `3` or direct execution selects Goal Loop workflow.

Goal Loop workflow is Full workflow plus an acceptance loop. It is for work where "looks done" is not good enough.

## Fit

Use Goal Loop workflow for:

- end-to-end feature implementation
- UI or user-flow changes that need QA
- complex bug fixes where first implementation may be incomplete
- tasks where the user wants repeated improvement until the original spec is satisfied
- tasks where the user explicitly selects `3`

## Principle

Do not mark the task as `pass` merely because code was written or tests pass.

Mark `pass` only when the implementation satisfies the original Execution Prompt's success criteria and QA finds no material mismatch.

If the goal cannot be fully verified because of missing credentials, unavailable services, broken local setup, absent Computer Use support, or external blockers, report the blocker and the strongest verification completed.

## Active Goal

At the start of Mode 3, set or update the Codex goal when available.

Use the confirmed Execution Prompt to produce a compact goal statement:

```text
Implement the requested change so that: <core outcome>.
Pass only when: <acceptance criteria>.
Validate through: <tests/checks/Computer Use QA or equivalent>.
Preserve: <important constraints>.
```

If a goal tool is not available, add the statement to the mandatory task note.

The Active Goal is the loop's source of truth.

## Task Note

Task notes are mandatory in Goal Loop workflow.

Before editing project files, create or update:

```text
.codex/simplepowers/YYYY-MM-DD-<short-task-name>.md
```

If that path is not writable, create an equivalent note in the nearest writable task/work directory and report the path.

Use a Full workflow-style task note plus:

```md
## Active Goal
<goal statement>

## Acceptance checklist
- [ ] <criterion 1>
- [ ] <criterion 2>
- [ ] <criterion 3>

## QA loop
### Iteration 1
- Build/implementation result:
- Test result:
- Computer Use or equivalent QA result:
- Gap against original spec:
- Decision: pass / improve / blocked
```

Do not skip the note merely because it creates repository noise. Instead, keep it local unless the user asks to commit it or the repository clearly treats `.codex/simplepowers/` notes as committed artifacts.

## Execution Flow

1. Confirm the Execution Prompt is available.
2. Establish the Active Goal and acceptance checklist.
3. Implement the first slice.
4. Run focused validation.
5. Run QA against the original success criteria.
6. Identify gaps between actual behavior and the Execution Prompt.
7. If material gaps exist, create the next smallest improvement slice.
8. Repeat implementation -> validation -> QA -> gap analysis until pass, blocker, or iteration cap.
9. Run final verification, review, and commit steps only after acceptance is resolved.

## Iteration Cap

Default to 3 QA/improvement iterations.

After 3 iterations, if material gaps remain:

1. Summarize what passed.
2. Summarize remaining gaps.
3. Explain whether the blocker is implementation, environment, unclear requirements, or out-of-scope work.
4. Ask whether to continue, unless one more small slice is clearly enough and the user asked for autonomous completion.

Do not loop indefinitely.

## Computer Use QA

Use Computer Use actively when available and relevant, especially for UI, browser, desktop, workflow, form, navigation, visualization, or user-facing behavior changes.

Computer Use QA may include:

- launching the app or dev server
- opening the relevant page or screen
- navigating the changed flow
- entering representative data
- checking visible UI states
- checking error states
- checking console or network errors when available
- taking screenshots or noting observations
- comparing behavior against the Execution Prompt

For non-UI tasks, replace Computer Use QA with the closest practical equivalent:

- CLI command QA
- API request QA
- unit/integration tests
- fixture-based reproduction
- log/output inspection
- static diff inspection

If Computer Use is unavailable or impossible, record this as `skipped` with a reason and perform the strongest available QA alternative.

## Gap Analysis

After each QA pass, answer:

```md
## Gap analysis
- Does the implementation satisfy each original success criterion?
- What still fails, feels incomplete, or deviates from the request?
- Is the issue implementation, test coverage, environment, or unclear requirements?
- What is the smallest next slice to close the gap?
```

If the answer shows a meaningful gap, do not finalize. Improve or report a real blocker.

## Review

Use subagent review by default for Mode 3 unless the change remains small and obviously low-risk.

Recommended reviewer angles:

- bug/regression
- test coverage
- maintainability/scope
- security when relevant
- QA acceptance against the Execution Prompt

Ask the QA acceptance reviewer to compare final behavior against the Execution Prompt and return:

```md
## Acceptance review
### Pass
- ...

### Gaps
- ...

### QA evidence
- ...

## Verdict
pass / needs changes / blocked
```

If subagents are unavailable, run the same acceptance checklist yourself and record the skipped subagent review reason.

Fix material gaps before finalizing.

## Stop Conditions

Stop with `pass` only when:

- all acceptance checklist items pass
- relevant tests/checks pass or skipped checks have justified reasons
- Computer Use or equivalent QA finds no material mismatch
- self-review and subagent review do not identify unresolved critical or major issues
- final diff remains scoped to the original request

Stop with `blocked` only when:

- required credentials, services, devices, data, or tools are unavailable
- the local project cannot run for reasons unrelated to this task
- the task requires a product decision or destructive change that needs user approval
- repeated validation exposes an upstream issue outside the requested scope

When blocked, report what was completed, what could not be verified, the exact blocker, and the next command or user action needed.
