# LensAI

Single-file React PWA at `index.html` (no build step, no bundler — React/ReactDOM source and the app itself are inlined directly).

## Merge checklist

Before every merge of a feature branch into `main`, update the build label so it reflects when `main` was last updated:

- File: `index.html`, constant `APP_BUILD` (near the top of the `App()` section, ~line 20316).
- Format: `"YYYY-MM-DD HH:MM"`, 24-hour time, the system's local timezone setting (not a fixed timezone — follow whatever the local clock reads, since the user's own phone timezone can change e.g. when traveling).
- Re-check the actual current local date/time (e.g. `date +"%Y-%m-%d %H:%M"`) as the LAST step immediately before running the merge command — not earlier in the session, since any gap (other commits, pushes, branch switches) between checking the time and the merge actually landing makes the label stale. Set `APP_BUILD` to that freshly-checked value, commit, then merge right away.

This label is shown in the app header next to the logo so the running build is visible at a glance.
