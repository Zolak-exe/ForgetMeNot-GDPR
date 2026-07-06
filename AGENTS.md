# Identity Scanner - Agent Guide

## Essential Commands

- `npm run dev` — Start development server with hot reload
- `npm run start` — Run production server
- `npm run build` — Compile TypeScript to `dist/`
- `npm run typecheck` — Validate types without building

## Architecture Summary

This is a backend system for automated GDPR data deletion via SMTP and exposure checking via XposedOrNot. No IMAP or HIBP is used.

Core components:

- **XposedOrNot API** — Fetches data leak exposures by email
- **SMTP Engine** — Sends GDPR deletion requests via ProtonMail Bridge or compatible SMTP
- **Curated Service DB** — Maps service IDs to privacy contacts and domains

Endpoints:
- `/api/health` — Status check
- `/api/expose` — Fetch exposures for an email
- `/api/send-gdpr` — Send GDPR deletion email to service
- `/api/gdpr-mailto` — Generate mailto: template for manual send (retained for UX)

## Key Patterns

### Exposure Processing
- `fetchExposures()` calls `xposedornot.com` — no API key needed
- Results contain raw `domain` + `service` — matched against `CURATED_SERVICES` by domain suffix
- No deduplication or scoring: exposures are listed as-is

### SMTP Workflow
- All SMTP config comes from `.env` or request override (`smtpHost`, `smtpUser`, etc.)
- Uses `nodemailer` — must be configured with a real mailbox (ProtonMail Bridge recommended)
- No retries, no queue: one attempt, fail-fast

### Service Matching
- `findServiceByDomain()` still used to resolve exposure domains → service IDs (unchanged)
- Uses exact or suffix matching (`example.com` matches `mail.example.com`)
- If no match → exposure appears as `unknown` in UI, no GDPR email sent

### Input Validation
- All routes use Zod schemas. Errors return 400 with `.issues`
- `smtpUser`/`smtpPass` are required if not set in `.env`

## Gotchas

1. **XposedOrNot is public but rate-limited** — No key, but do not spam. Assume ~1 request/sec limit.

2. **SMTP must be configured** — System will refuse `/api/send-gdpr` if `SMTP_HOST`, `SMTP_USER`, `SMTP_PASS` are empty in `.env` or request.

3. **ProtonMail Bridge required** — ProtonMail does not allow direct SMTP. Must run `proton-bridge` locally on `127.0.0.1:1143`.

4. **No fallbacks for privacyContact** — If `privacyContact` is missing in `CURATED_SERVICES`, no GDPR email is sent. Add it manually.

5. **No web scraping for DPOs** — Service contact data is static in `services.ts`. To add new services: edit manually.

6. **No caching or persistence** — All data fetched fresh on each request. No DB, no cache.

7. **Node.js 22+ required** — Enforced in `package.json`

8. **`/api/gdpr-mailto` is static** — Only generates `mailto:` links. Does not send email. Use `/api/send-gdpr` for automation.

## Testing & Deployment

- Tests: None — manual testing required
- Build output: `dist/` (from `tsc`)
- Production: Use `npm run start` — never use `tsx watch`
- Environment: `.env` must exist, populated from `.env.example`

## Configuration

- `.env` must contain at minimum:
  ```env
  PORT=4343
  SMTP_HOST=127.0.0.1
  SMTP_PORT=1143
  SMTP_USER=you@proton.me
  SMTP_PASS=your-app-password
  SMTP_TLS=true
  ```

- No `HIBP_API_KEY` or `IMAP_*` variables are used — delete them if present

## File Structure

```
src/
├── config.ts        # Loads SMTP from env only
├── gdpr.ts          # Generates mailto: templates (unchanged)
├── matcher.ts       # unused (imported but logic moved to services.ts)
├── server.ts        # Main server — now exposes /api/expose, /api/send-gdpr
├── services.ts      # Curated list — add new services here manually
├── types.ts         # Updated: ExposureInfo, GdprRequestResult, SMTPConfig
└── sources/
    ├── xposedornot.ts  # Fetches data leaks from public API
    └── smtp.ts         # Sends GDPR emails via nodemailer
```

> **Note**: `sources/imap.ts` and `sources/hibp.js` are obsolete — you may delete them.

## Important Notes

- This tool is designed for **user-owned actions** — never run with a shared mailbox.
- All external HTTP calls are to **public APIs** — no scraping, no reverse-engineering.
- No authentication, sessions, or user accounts exist — all actions are per-request.
- Frontend (`public/`) is unaltered — it must be updated to use `/api/expose` and `/api/send-gdpr`.
- `CURATED_SERVICES` is your source of truth — ensure privacyContact is accurate.

To add a new service:
1. Edit `src/services.ts` — add entry with correct `privacyContact`
2. Test exposure matching via `/api/expose`
3. Test SMTP send via `/api/send-gdpr`

Don’t refactor SMTP to TypeScript — it works as-is. Avoid browser automation entirely — it’s unreliable.
