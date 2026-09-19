---
name: Mockup carousel motion
description: Cover Flow side cards should use numeric Framer Motion x positions rather than CSS calc multiplication.
---

For interactive Cover Flow mockups, prefer numeric `x` offsets in Framer Motion over CSS `calc()` expressions that multiply a number by a length.

**Why:** The CSS math version rendered the active card but did not reliably show the neighboring cards in the browser preview, while numeric motion coordinates rendered the full stack correctly.

**How to apply:** When building or debugging card carousels in the mockup sandbox, calculate the horizontal offset in JavaScript and let Framer Motion handle the transform.