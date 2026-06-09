# Simple Workflow

Use this reference only after the user selects mode `1` or direct execution selects Simple workflow.

Simple workflow is the daily driver for small or medium, low-risk coding tasks.

## Fit

Use Simple workflow for:

- focused bug fixes
- narrow feature changes
- local refactors
- test additions
- low-risk changes

If the task becomes broad, risky, migration-related, security-sensitive, or touches many unrelated files, pause and recommend switching to Full workflow.

## Execution Flow

1. Confirm the Execution Prompt is available.
2. Inspect relevant source files and nearby tests.
3. Identify the smallest useful change.
4. Implement in 1-3 slices.
5. Run focused validation after meaningful changes or at the end.
6. Self-review the final diff.
7. Commit only if the shared commit rules allow it.

Do not re-confirm the prompt unless there is a blocking ambiguity.

## Minimal Task Note

Skip task notes by default in Simple workflow.

Create one only if the user asks, the repo already uses `.codex/simplepowers/`, or the work unexpectedly becomes risky enough to need a durable log.

Suggested note shape when needed:

```md
# Task: <title>

## Execution Prompt
<confirmed prompt>

## Slices
- [ ] <slice 1>
- [ ] <slice 2>

## Validation log
- `<command>`: pass/fail/skipped

## Review notes
- <self-review findings or skipped reason>

## Final result
- <summary>
```

## Validation

Prefer the strongest focused check that fits the change:

- nearest unit test
- focused integration test
- typecheck for the touched package
- lint for touched files
- build command
- manual inspection when no executable check exists

Record skipped checks with short reasons.

## Review

Self-review the diff for:

- behavior matches the Execution Prompt
- no unrelated files or refactors
- tests/checks cover the changed behavior where practical
- no obvious regression, security, or data-loss risk
- no unrelated user changes staged

Use subagents only if the change becomes risky or unexpectedly broad. If subagents are unavailable, keep the self-review and record the skip reason.

## Stop Conditions

Finish when:

- the requested change is implemented
- focused validation passes or skipped checks are justified
- self-review finds no unresolved material issue
- final response clearly reports validation, QA, review, and commit status

Stop as blocked only when a real environment, credential, dependency, or product-decision blocker prevents completion.
