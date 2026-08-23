# LensAI

Single-file React PWA at `index.html` (no build step, no bundler — React/ReactDOM source and the app itself are inlined directly).

## Auto-merge

The user has authorized auto-merging: once a code fix on a feature branch is
pushed and verified (tests pass, no regressions), merge it into `main`
immediately without waiting for the user to say "Merge" first. This applies
to all upcoming fixes/changes, not just a one-off. Still follow the merge
checklist below on every merge, and still ask before any other kind of
risky/destructive action (force-push, history rewrite, etc.) — this
authorization only covers the normal feature-branch → `main` merge flow.

## Merge checklist

Before every merge of a feature branch into `main`, update the build label so it reflects when `main` was last updated:

- File: `index.html`, constant `APP_BUILD` (near the top of the `App()` section, ~line 20316).
- Format: `"YYYY-MM-DD HH:MM"`, 24-hour time, the user's phone's current network/carrier timezone — NOT the sandbox/system clock (this dev environment runs in UTC and has no access to the phone's actual location or timezone). If the current session hasn't confirmed the phone's current timezone yet, ask the user before merging; last confirmed: Asia/Kuala_Lumpur (UTC+8).
- Re-check the actual current date/time in that timezone as the LAST step immediately before running the merge command — not earlier in the session, since any gap (other commits, pushes, branch switches) between checking the time and the merge actually landing makes the label stale. Set `APP_BUILD` to that freshly-checked value, commit, then merge right away.

This label is shown in the app header next to the logo so the running build is visible at a glance.
