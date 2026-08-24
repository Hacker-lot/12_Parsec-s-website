# Security

## Architecture

This repository builds a static browser application. It has no server routes, database credentials,
XML parser, or server-side URL fetcher, so it does not expose an SSRF or XXE surface by itself.

Only variables prefixed with `VITE_` are embedded into the browser bundle. Treat every such value as
public. The build fails when a `VITE_` variable has a credential-like name or value. Never put API
secrets, private keys, service-role keys, or passwords in this project or in Vercel client variables.

## Deployment

Vercel applies a restrictive Content Security Policy, HTTPS enforcement, clickjacking protection,
MIME-sniffing protection, a permissions policy, and referrer isolation. Keep the domain on HTTPS and
do not weaken these headers to add third-party scripts without reviewing the new origin.

Run before deployment:

```sh
npm test
npm run build
```

Dependency advisories should also be checked with `npm audit` in an environment with registry access.

## Reporting

Report a vulnerability privately to the repository owner. Do not include secrets or personal data in
a public GitHub issue.
