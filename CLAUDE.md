# LensAI

Single-file React PWA at `index.html` (no build step, no bundler — React/ReactDOM source and the app itself are inlined directly).

## Merge checklist

Before every merge of a feature branch into `main`, update the build label so it reflects when `main` was last updated:

- File: `index.html`, constant `APP_BUILD` (near the top of the `App()` section, ~line 20316).
- Format: `"YYYY-MM-DD HH:MM"`, 24-hour time, UTC.
- Set it to the actual current date/time of the merge, then commit that change as part of (or immediately before) the merge.

This label is shown in the app header next to the logo so the running build is visible at a glance.
