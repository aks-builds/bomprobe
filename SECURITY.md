# Security Policy

## Supported versions

| Version | Supported |
|---------|-----------|
| 1.x     | Yes       |
| < 1.0   | No        |

## Reporting a vulnerability

If you find a security vulnerability in bomprobe, please report it privately.

**Do not** open a public GitHub issue for security vulnerabilities.

Instead, email **its.aks@outlook.com** with:

1. Description of the vulnerability
2. Steps to reproduce
3. Impact assessment
4. Suggested fix (if any)

You'll get an acknowledgment within 48 hours and a detailed response within 7 days.

## Scope

bomprobe processes SBOM files (CycloneDX and SPDX JSON). It runs entirely offline
with zero network calls and zero npm dependencies. The main attack surface is
malformed or adversarial SBOM input.

Relevant classes:

- Path traversal via file paths in SBOM fields
- ReDoS in regex-based checks
- Prototype pollution via JSON parsing
- Resource exhaustion from large or deeply nested SBOMs
- Command injection if SBOM field values are passed to shell commands (bomprobe doesn't do this)

## Security design

- Zero dependencies reduces supply chain risk
- No network calls, no telemetry
- Input is parsed with `JSON.parse()` (safe against prototype pollution)
- File operations use `node:fs` with no dynamic path construction from SBOM fields
- All regex patterns are static (no user-controlled regex)
