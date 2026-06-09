---
name: simplepowers
description: Prompt compiler and workflow router for non-trivial coding tasks when the user explicitly invokes $simplepowers or asks to turn a short request into a confirmed execution prompt before implementation. Do not use for tiny edits, pure Q&A, read-only review, analysis-only, suggestion-only, or formatting-only requests unless the user explicitly asks for simplepowers.
---

# simplepowers

simplepowers turns a short coding request into a confirmed Execution Prompt, asks the user to choose a workflow level, then loads only the selected workflow reference.

Core flow:

```text
short request -> Execution Prompt -> user confirmation -> 1/2/3 mode -> selected reference only -> implementation/validation/review
```

Keep this skill lightweight. Do not preload all workflow details.

## When To Use

Use this skill only when:

- the user explicitly invokes `$simplepowers`
- the user asks for a stronger execution prompt before coding
- the user asks to confirm a generated prompt before implementation
- the user explicitly asks for a Simple / Full / Goal Loop workflow selection

Do not use this skill for:

- tiny one-line edits
- pure Q&A
- read-only code review
- analysis-only or suggestion-only requests
- ordinary implementation, QA, or commit requests that do not ask for this prompt-confirmation workflow
- formatting-only changes unless requested

If the user asks for read-only review, review the code directly and do not run this workflow.

## Modes

Ask the user to choose one mode unless prompt-only or direct execution mode applies:

1. `Simple workflow`: focused implementation, focused validation, self-review.
2. `Full workflow`: broader traceability, task note when useful, slice validation, optional subagent review.
3. `Goal Loop workflow`: Full workflow plus acceptance loop until the original success criteria pass or a real blocker is proven.

Mode selection does not grant commit permission. Commit only when the user requested or clearly allowed committing.

## Prompt-Only Mode

If the user says `프롬프트만`, `prompt only`, `실행하지 말고 프롬프트만`, `just generate the prompt`, or equivalent:

1. Generate the Execution Prompt.
2. Include the mode choice block if useful.
3. Stop.
4. Do not edit files.

## Direct Execution Mode

If the user explicitly says to skip confirmation, for example `바로 실행`, `확인 없이 진행`, `no confirmation`, `use mode 1 and execute`, `use mode 2 and execute`, or `use mode 3 and execute`:

1. Generate the Execution Prompt.
2. Select the requested mode, or infer the safest reasonable mode.
3. Load only the selected reference.
4. Execute without another confirmation.

## Before Confirmation

Before changing project files, perform only read-only investigation:

- inspect relevant files, docs, configs, tests, and scripts
- check git status and branch when the project is a Git repository
- identify likely validation commands
- generate or revise the Execution Prompt

Do not create task notes before confirmation unless direct execution mode applies.

If the project is not a Git repository, continue after confirmation and report that commit was skipped.

## Execution Prompt

Create an Execution Prompt for every non-trivial task before editing.

Use this format:

```md
# Execution Prompt

## Original request
<the user's request>

## Proposed mode
<1 Simple workflow / 2 Full workflow / 3 Goal Loop workflow / not selected yet>

## Goal
<what should be achieved>

## Success criteria
- <observable completion condition>
- <expected behavior>
- <tests or checks that should pass>
- <QA condition that proves the request is satisfied>

## Constraints
- Keep scope tight.
- Do not change unrelated behavior.
- Do not edit unrelated files.
- Do not add production dependencies unless clearly necessary and approved.
- Preserve existing public APIs unless the request requires changing them.
- Do not overwrite unrelated user changes.
- Do not stage or commit unrelated files.

## Assumptions
- <safe assumptions made by Codex>

## Investigation plan
- <files, docs, tests, scripts, or commands to inspect first>

## Implementation slices
1. <slice 1>
   - objective:
   - expected files:
   - validation:
2. <slice 2>
   - objective:
   - expected files:
   - validation:

## Review plan
- <self-review / subagent review plan depending on mode and risk>

## QA plan
- <CLI/API/UI/Computer Use QA steps appropriate for the task>

## Final verification
- Run focused tests/checks.
- Run `git diff --check` when available.
- Run lint/typecheck/build only when relevant and reasonably available.
- Record skipped checks with reasons.

## Commit plan
- Commit only when safe and explicitly requested or clearly allowed.
- Stage only relevant files.
- Use a concise Conventional Commit-style message when committing.
```

Keep the prompt detailed enough to guide the work, but not bureaucratic.

## Confirmation Message

When asking the user to confirm, use this format:

```md
## Execution Prompt 확인

<generated Execution Prompt>

## 선택
1. Simple workflow - 핵심 프롬프트, 짧은 슬라이스, 필요한 검증, 셀프 리뷰
2. Full workflow - 문서화, 슬라이스별 검증, 서브에이전트 리뷰 가능, 최종 검증
3. Goal Loop workflow - 2번 기반 + 사양 충족까지 반복 구현/QA/개선

커밋은 별도 요청 또는 명확한 허용이 있을 때만 진행합니다.
수정할 내용이 있으면 `수정: ...` 형태로 적어주세요.
```

After the user replies:

- If the user replies `1`, `simple`, `심플`, or similar, read `references/simple.md`.
- If the user replies `2`, `full`, `풀`, or similar, read `references/full.md`.
- If the user replies `3`, `goal`, `goal loop`, `목표`, `반복`, or similar, read `references/goal-loop.md`.
- If the user gives revision instructions, revise the Execution Prompt and ask for confirmation again.
- If the user says to proceed without choosing a number, choose the safest reasonable mode, state the selected mode, and read only that mode reference.

Do not read the other mode references unless the user changes modes or the selected reference explicitly says another reference is needed.

## Task Notes

Task note policy depends on the selected mode.

Mode 1 Simple:

- Task notes are optional.
- Create a note only when the user asks, the repository already uses `.codex/simplepowers/`, or the task unexpectedly becomes risky.

Mode 2 Full and Mode 3 Goal Loop:

- Task notes are mandatory.
- Before editing project files, create or update `.codex/simplepowers/YYYY-MM-DD-<short-task-name>.md`.
- If that path is not writable, create an equivalent note in the nearest writable task/work directory and report the path.
- Keep the confirmed Execution Prompt, selected mode, implementation slices, validation log, review notes, QA results, and final result in the note.

Do not commit task notes unless it is clearly appropriate for the repository or the user asks.

## Shared Safety Rules

These rules apply to every selected reference:

- Make the smallest relevant change.
- Avoid unrelated refactors.
- Ask before destructive changes, production dependency additions, migrations, or security-sensitive product decisions.
- If subagents are unavailable, perform the same review checklist as self-review and record that subagent review was skipped.
- If Computer Use or browser QA is unavailable, use the strongest practical CLI/API/test/log/manual alternative and record the limitation.
- If touched files contain unrelated user changes, stage only relevant hunks or skip commit.

## Commit Rules

Commit only if all are true:

- this is a Git repository
- the task changed files
- changes are relevant to the user request
- validation passed, or skipped validation is documented with reasons
- unrelated user changes are not staged
- the user requested or clearly allowed committing
- in Goal Loop mode, acceptance criteria are satisfied or the user explicitly requested a commit despite a documented blocker

Mode selection alone is not commit permission.

If commit is unsafe, do not commit. Explain why and provide a suggested command only if useful.

## Final Response

Keep the final response concise:

```md
## Summary
- <what changed>

## Mode
- <1 Simple / 2 Full / 3 Goal Loop>

## Validation
- `<command>`: pass/fail/skipped

## QA
- <QA summary or skipped reason>
- Acceptance result: pass / needs changes / blocked

## Review
- <self-review/subagent summary or skipped reason>

## Commit
- <commit hash or skipped reason>

## Notes
- <risks, assumptions, blockers, or follow-up>
```
