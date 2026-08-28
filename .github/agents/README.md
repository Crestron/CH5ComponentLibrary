# Team Custom Agents

Custom Copilot agents shared with the team. They live in this folder and are
committed to git, so anyone who opens this workspace in VS Code gets them
automatically — no per-machine setup.

## Available agents

| Agent | File | Use it to... |
|-------|------|--------------|
| **Create Light Ch5 Component** | [`create-light-component.agent.md`](./create-light-component.agent.md) | Scaffold a new lightweight Ch5 web component that extends `Ch5LightBaseClass` (the same pattern as `ch5-button`), from a list of attributes. Includes complete theme SCSS scaffolding. |
| **Button Container Component Builder** | [`button-container-component.agent.md`](./button-container-component.agent.md) | Build NEW components or REFACTOR EXISTING components that contain/manage ch5-button or ch5-advance-button elements. For new: implements conditional button-type selection based on features. For existing: analyzes current ch5-advance-button usage and refactors to use ch5-button when possible, ch5-advance-button only when needed (modes, SG icons, live templates). Follows ch5-button-list pattern. |

## How to use an agent

1. Open the Copilot Chat view in VS Code.
2. Open the **agent picker** (the mode dropdown at the top of the chat input) and
   select the agent by name — e.g. **Create Light Ch5 Component**.
3. Describe what you want. Examples:

   **For the light-component agent:**
   ```
   Create ch5-light-toggle with: label, iconclass, selected (CSS only),
   receivestateselected, receivestatelabel, sendeventonclick
   ```

   **For the button-container agent:**
   ```
   Create ch5-custom-selector that manages 5 buttons, needs modes and label templates
   ```
   
   **Or for refactoring existing components:**
   ```
   Update ch5-dpad to use ch5-button when modes are not present
   ```
   ```
   Refactor ch5-keypad button creation to use conditional button selection
   ```

4. The agent will first **classify features** and show you a decision table. Confirm it,
   and it will generate the complete implementation following the established patterns.

## Why dedicated agents (and not just asking Copilot)

**Light Component Agent:**
The light-component family targets **1000+ simultaneous instances**, so it follows
strict GC/allocation rules (cached callbacks, static settings arrays, lazy signal
allocation, `data-signal-*` shadow channels for CSS-driven signals, etc.). Those
rules are documented in
[`src/ch5-button/ch5-button.md`](../../src/ch5-button/ch5-button.md). The agent bakes
that reference in so every generated component starts correct instead of re-deriving
the pattern each time.

**Button Container Agent:**
Components that manage ch5-button and ch5-advance-button elements must implement the
**conditional button-type selection pattern** from
[`ch5-button-list`](../../src/ch5-button-list/base-classes/ch5-button-list-base.ts).
This pattern intelligently chooses the lightweight ch5-button (for simple cases) vs
the full-featured ch5-advance-button (for modes, SG icons, live templates) based on
feature detection. The agent ensures this decision logic is correctly implemented,
avoiding unnecessary performance overhead while supporting all required features.

## Editing / adding agents

- Edit an agent by opening its `.agent.md` file. The YAML frontmatter (between the
  `---` markers) controls its name, description, allowed tools, and model.
- Add a new agent by creating another `*.agent.md` file in this folder.
- Commit the file and push — teammates pick it up on their next `git pull`.

See the [VS Code custom agents docs](https://code.visualstudio.com/docs/copilot/customization/custom-agents)
for the full frontmatter reference.
