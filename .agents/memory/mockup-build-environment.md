---
name: Mockup build environment
description: Required environment values when manually building the Vite mockup sandbox.
---

Manual production builds of the mockup sandbox must provide both `PORT` and `BASE_PATH`; the dev workflow supplies these automatically.

**Why:** The Vite config intentionally fails fast when either value is missing, so an otherwise healthy build can look broken when run directly from the shell.

**How to apply:** Use the workflow for runtime verification. For a direct build, provide the configured sandbox port and `/__mockup` base path.