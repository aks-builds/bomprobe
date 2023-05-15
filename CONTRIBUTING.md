# Contributing to bomprobe

Thanks for your interest in contributing. bomprobe is an SBOM quality
auditor and we're happy to accept help of any kind - bug reports, new
checks, docs, tests, or format support.

## Quick start

```bash
git clone https://github.com/aks-builds/bomprobe.git
cd bomprobe
node --test          # run the full suite (Node.js 18+)
node src/cli.js fixtures/cdx-minimal.json   # try it
```

No `npm install` needed. Zero external dependencies.

## Project structure

```
src/
  checks/        - Individual SBOM quality checks (140 and counting)
  checks/index.js - Check registry and runner
  analysis/      - Supply chain depth, component age, config validation
  baseline/      - Baseline snapshots and regression detection
  convert/       - SPDX-to-CycloneDX converter
  diff/          - SBOM comparison engine
  merge/         - Multi-SBOM merge (union/intersect)
  policy/        - Policy engine with configurable rules and presets
  report/        - SARIF, JUnit, and other report builders
  scoring/       - Score calculation, completeness, grading
  stats/         - Statistics and license risk analysis
  tracking/      - Trend tracking over time
  vuln/          - Vulnerability correlation
  compliance/    - NTIA, BSI, and EU CRA compliance profiles
  formatters/    - Output formatters (text, json, sarif, html, csv, etc.)
  cli/           - Config, presets, batch scanning, env config
  utils/         - Shared utilities
test/            - Mirrored test structure
  fixtures/      - Sample SBOM files for testing
bin/
  bomprobe.js    - CLI entry point
python/          - Python wrapper (PyPI: bomprobe)
examples/        - CI integration examples
```

## What we're looking for

Look for issues labelled **good first issue** or **help wanted**. Areas
that always need attention:

- New quality checks (see below for the pattern)
- SPDX 3.0 format support improvements
- Better error messages and edge case handling
- Test coverage for malformed and minimal SBOMs
- Documentation, examples, and tutorials
- Output format additions or improvements
- Performance improvements for large SBOMs (10k+ components)

## Writing a new check

Each check lives in its own file under `src/checks/` and exports:

```js
module.exports = {
  id: 'your-check-id',
  name: 'Human Readable Name',
  description: 'What this check verifies',
  severity: 'warning',  // error | warning | info
  run(sbom) {
    const findings = [];
    // inspect sbom.components, sbom.metadata, etc.
    // push { message, component?, severity? } for each issue
    return findings;
  }
};
```

Then register it in `src/checks/index.js` and add a test file at
`test/checks/yourCheck.test.js`. The `run` function receives a
normalized SBOM object. Both CycloneDX and SPDX are normalized before
checks run, so you can use `sbom.components`, `sbom.metadata`, and
`sbom.dependencies` regardless of source format.

## Running tests

```bash
node --test                              # full suite
node --test test/checks/                 # just check tests
node --test test/checks/my-check.test.js # single file
node --test --test-name-pattern "pattern" # filter by name
```

We use Node.js built-in `node:test` and `node:assert/strict`. No test
framework to install.

## Code style

- No external dependencies. Use `node:` built-in modules only.
- Each function should do one thing.
- Tests go in a mirrored directory structure under `test/`.
- No comments unless the reason isn't obvious from the code.
- Short, lowercase imperative commit messages.

## Pull requests

1. Fork the repo and create a branch from `master`.
2. Add tests for any new functionality.
3. Make sure `node --test` passes with zero failures.
4. Keep PRs focused - one feature or fix per PR.
5. Maintain zero external dependencies.
6. Write a clear commit message describing what changed and why.

## Reporting bugs

Open an issue with:

- The SBOM file (or a minimal reproduction) that triggers the bug
- The command you ran
- Expected vs actual output
- Your Node.js version (`node --version`)

## Using the GitHub Action

If you want to integrate bomprobe into your own CI, see
`examples/github-action-usage.yml` or use it directly:

```yaml
- uses: aks-builds/bomprobe@v1
  with:
    sbom: sbom.json
    profile: ntia
    threshold: 70
```

## Code of conduct

Be respectful. We're all here to make SBOM tooling better.
