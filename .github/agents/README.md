# Team Custom Agents

Custom Copilot agents shared with the team. They live in this folder and are
committed to git, so anyone who opens this workspace in VS Code gets them
automatically — no per-machine setup.

## Available agents

| Agent | File | Use it to... |
|-------|------|--------------|
| **Create Light Ch5 Component** | [`create-light-component.agent.md`](./create-light-component.agent.md) | Scaffold a new lightweight Ch5 web component that extends `Ch5LightBaseClass` (the same pattern as `ch5-button`), from a list of attributes. |

## How to use an agent

1. Open the Copilot Chat view in VS Code.
2. Open the **agent picker** (the mode dropdown at the top of the chat input) and
   select the agent by name — e.g. **Create Light Ch5 Component**.
3. Describe what you want. For the light-component agent, give a component name and
   the attributes to implement, for example:

   ```
   Create ch5-light-toggle with: label, iconclass, selected (CSS only),
   receivestateselected, receivestatelabel, sendeventonclick
   ```

4. The agent will first **classify each attribute** (pure-CSS vs JS-rendered vs
   receive-signal vs send-signal vs base-provided) and show you a table. Confirm it,
   and it will generate the component `.ts`, `index.ts`, the design `.md` doc, and
   register the component in `src/index.ts`.

## Why a dedicated agent (and not just asking Copilot)

The light-component family targets **1000+ simultaneous instances**, so it follows
strict GC/allocation rules (cached callbacks, static settings arrays, lazy signal
allocation, `data-signal-*` shadow channels for CSS-driven signals, etc.). Those
rules are documented in
[`src/ch5-button/ch5-button.md`](../../src/ch5-button/ch5-button.md). The agent bakes
that reference in so every generated component starts correct instead of re-deriving
the pattern each time.

## Editing / adding agents

- Edit an agent by opening its `.agent.md` file. The YAML frontmatter (between the
  `---` markers) controls its name, description, allowed tools, and model.
- Add a new agent by creating another `*.agent.md` file in this folder.
- Commit the file and push — teammates pick it up on their next `git pull`.

See the [VS Code custom agents docs](https://code.visualstudio.com/docs/copilot/customization/custom-agents)
for the full frontmatter reference.
