# simplepowers

`simplepowers` is a lightweight Codex Skill that turns short coding requests into confirmed Execution Prompts, then routes the work into one selected workflow.

```text
short request -> Execution Prompt -> confirmation -> 1/2/3 -> selected workflow reference -> validation/review
```

## Highlights

- `SKILL.md` is a lightweight router.
- Mode-specific details live in `references/simple.md`, `references/full.md`, and `references/goal-loop.md`.
- Codex reads only the selected mode reference after the user chooses `1`, `2`, or `3`.
- Commit permission is explicit: choosing a mode does not authorize a commit.
- Task notes are optional for mode `1`, mandatory for modes `2` and `3`.
- Read-only review, analysis-only, and suggestion-only requests are excluded from automatic use.
- Subagent and Computer Use QA instructions include fallback behavior.
- `agents/openai.yaml` disables implicit invocation by default.
- This repository is also an npm-style installer package for public GitHub installs.

## Included files

```text
.agents/skills/simplepowers/
  SKILL.md
  agents/openai.yaml
  references/simple.md
  references/full.md
  references/goal-loop.md
bin/install.mjs
package.json
README.md
```

The README and npm installer files are outside the skill folder so the skill itself stays lean.

## Install from public GitHub

Install globally with HTTPS:

```bash
npx -y git+https://github.com/youngchangjo/simplepowers-codex-skill.git
```

That installs the skill to:

```text
${CODEX_HOME:-~/.codex}/skills/simplepowers
```

To replace an existing install:

```bash
npx -y git+https://github.com/youngchangjo/simplepowers-codex-skill.git --force
```

GitHub package shorthand should also work:

```bash
npx -y github:youngchangjo/simplepowers-codex-skill
```

This package is installed from GitHub. It is not published to the npm registry yet, so this command is not expected to work:

```bash
npx simplepowers-codex-skill
```

To install into a project-local `.agents/skills` folder:

```bash
npx -y git+https://github.com/youngchangjo/simplepowers-codex-skill.git --project /path/to/your-project --force
```

To install to an exact custom target:

```bash
npx -y git+https://github.com/youngchangjo/simplepowers-codex-skill.git --target /path/to/skills/simplepowers --force
```

You can also install the CLI globally first:

```bash
npm install -g git+https://github.com/youngchangjo/simplepowers-codex-skill.git
simplepowers-install --force
```

## Install after cloning

```bash
git clone https://github.com/youngchangjo/simplepowers-codex-skill.git
cd simplepowers-codex-skill
npm install -g .
simplepowers-install --force
```

For project-local installation after cloning:

```bash
simplepowers-install --project /path/to/your-project --force
```

## Manual install

For global install, copy:

```text
.agents/skills/simplepowers/
```

to:

```text
~/.codex/skills/simplepowers/
```

For project-local install, copy it to:

```text
your-project/.agents/skills/simplepowers/
```

## Basic usage

```text
$simplepowers 로그인 실패 메시지를 원인별로 분리해줘. 테스트도 추가하고 안전하면 커밋해줘.
```

Codex should first generate an Execution Prompt and ask:

```text
1. Simple workflow
2. Full workflow
3. Goal Loop workflow
```

After selection, it should read only the matching reference:

- `1` -> `references/simple.md`
- `2` -> `references/full.md`
- `3` -> `references/goal-loop.md`

## Prompt-only usage

```text
$simplepowers 프롬프트만: 결제 실패 케이스를 정리하고 테스트 추가하는 작업 프롬프트 만들어줘.
```

This produces the Execution Prompt only and does not edit files.

## Direct execution

```text
$simplepowers use mode 1 and execute: 작은 오타 수정하고 테스트 확인해줘.
```

```text
$simplepowers use mode 2 and execute: 인증 리팩터링을 슬라이스별로 검증하면서 진행해줘.
```

```text
$simplepowers use mode 3 and execute: 새 견적 플로우가 처음 사양대로 동작할 때까지 구현, QA, 개선을 반복해줘.
```

## Mode guide

- `1 Simple`: everyday focused tasks; task note optional
- `2 Full`: broad, risky, security-sensitive, migration, or multi-file work; task note mandatory
- `3 Goal Loop`: UI/user-flow/acceptance work that needs repeated QA against the original spec; task note mandatory

## Commit policy

`simplepowers` commits only when:

- the user requested or clearly allowed committing
- validation passed or skipped checks are documented
- unrelated user changes are not staged
- the final diff is scoped to the request

Selecting `1`, `2`, or `3` is not commit permission.

## Development

Validate the skill:

```bash
npm run validate
```

Preview npm package contents:

```bash
npm run pack:dry
```
