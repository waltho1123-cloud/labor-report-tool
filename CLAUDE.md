@AGENTS.md

## Deployment (Vultr + Coolify, since 2026-10-19)
- Runs on the Vultr Tokyo host `app1`, managed by Coolify (console: https://ops.wiwiapps.com , administrators only). Coolify project `labor-report-tool`, application `labor-report`.
- Production URL: https://labor-report.wiwiapps.com . Before 2026-10-19 it ran on Zeabur (the old URL labor-report-tool.zeabur.app is disabled).
- Deploy: pushing to `main` makes Coolify build the root `Dockerfile` and deploy automatically. To re-run the same commit, use Redeploy on the application page; to roll back, pick an earlier deployment under Deployments and redeploy it. Container port 3000 (Coolify injects `PORT=3000`).
- Environment variables: the app code reads none (no `process.env` in `src/` or `next.config.ts`), and the repo has no database or API routes. If one is added later, set it under Environment Variables on the Coolify application (values never go into git); build-time variables such as `NEXT_PUBLIC_*` must be marked as build variables and need a redeploy to take effect.
- Logs: the application's Logs page in Coolify. External monitoring: Uptime Kuma (https://status.wiwiapps.com ).
