# Contributing to bomprobe

Thanks for your interest in contributing.

## Getting started

```
git clone https://github.com/aks-builds/bomprobe.git
cd bomprobe
node --test
```

No build step, no dependencies to install. Just Node.js 18+.

## Project structure

```
src/
  checks/       - Individual SBOM quality checks (129 and counting)
  checks/index.js - Check registry and runner
  parsers/      - CycloneDX and SPDX parsers with normalization
  formatters/   - Output formatters (text, json, sarif, html, csv, junit, markdown, gitlab, github)
  cli/          - Config, presets, batch scanning, env config
  output/       - Extended output: trend, diff, badges, CI reports
  policy/       - Custom rule engine for policy-as-code
  scoring/      - Score calculation, grading, and weighted breakdown
  compliance/   - NTIA, BSI, and EU CRA compliance profile evaluation
  utils/        - Shared utilities (search, diff, fingerprint, policy, etc.)
test/
  checks/       - Unit tests for each check
  utils/        - Utility tests
  integration/  - Full audit and CLI integration tests
  fixtures/     - Sample SBOM files for testing
bin/
  bomprobe.js   - CLI entry point
```

## Writing a check

Checks live in `src/checks/`. Each check is a single file that exports:

```js
module.exports = {
  id: 'my-check',
  name: 'My Check',
  description: 'What this check looks for',
  weight: 0.2,
  run(sbom) {
    const findings = [];
    // inspect normalized sbom, push findings
    return findings;
  }
};
```

The `run` function receives a normalized SBOM object. Both CycloneDX and SPDX
documents are normalized before checks run, so your check can use `sbom.components`,
`sbom.metadata`, and `sbom.dependencies` regardless of the source format.

Each finding should have `{ severity, component?, message }` where severity
is `error`, `warning`, or `info`. Weight between 0.1 (low) and 0.3 (high impact).

After writing the check, register it in `src/checks/index.js` and add a
matching test file in `test/checks/`.

## Running tests

```bash
node --test                              # full suite
node --test test/checks/my-check.test.js # single file
node --test test/utils/*.test.js         # pattern match
```

Tests use `node:test` and `node:assert/strict`. No test framework needed.

## Writing a formatter

Formatters live in `src/formatters/`. Each exports a `formatResult(result)` function
that returns a string.

1. Create `src/formatters/your-format.js`
2. Register it in `src/formatters/index.js`
3. Wire the CLI flag in `bin/bomprobe.js`
4. Add a test in `test/formatters/your-format.test.js`

## Compliance profiles

Profiles live in `src/compliance/profiles.js`. Each profile lists the check IDs
that must pass for a document to be considered compliant. Add new profiles by
appending to the `PROFILES` object.

## Code style

- No external dependencies. Use `node:test`, `node:assert/strict`, `node:crypto`, etc.
- Keep checks focused - one concern per check.
- No comments unless the why is non-obvious.
- Short, lowercase imperative commit messages.

## Pull requests

- One feature or fix per PR
- Include tests for new checks
- Keep zero external dependencies
