# Fixture: installed Agents CLI skills

A hermetic stand-in for the machine-global `~/.agents/skills` directory
(the `google-agents-cli-*` skills that `agents-cli` installs). Tests point
`AGENTS_CLI_SKILLS_DIR` here so `loadSkillRegistry()` sees the same seven
official skills on every machine, instead of whatever happens to be
installed under the runner's home directory. Contents are minimal SKILL.md
frontmatter — just enough for registry loading and skill selection; the
real skills' bodies are irrelevant to the tests.
