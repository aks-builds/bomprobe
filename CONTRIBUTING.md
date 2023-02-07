# Contributing to bomprobe

Thanks for your interest in contributing.

## Getting started

```
git clone https://github.com/aks-builds/bomprobe.git
cd bomprobe
npm test
```

No build step, no dependencies to install. Just Node.js 18+.

## Writing a check

Checks live in `src/checks/`. Each check is a single file that exports:

```js
module.exports = {
  id: 'my-check',
  name: 'My Check',
  description: 'What this check looks for',
  weight: 0.5,
  run(sbom) {
    const findings = [];
    // inspect sbom, push findings
    return findings;
  }
};
```

Add your check to `src/checks/index.js` and write a test in `test/checks/`.

## Running tests

```
npm test
```

Tests use `node:test` and `node:assert/strict`. No test framework needed.

## Writing a formatter

Formatters live in `src/formatters/`. Each exports a `formatResult(result)` function that returns a string.

1. Create `src/formatters/your-format.js`
2. Register it in `src/formatters/index.js`
3. Wire the CLI flag in `bin/bomprobe.js`
4. Add a test in `test/formatters/your-format.test.js`

## Pull requests

- One feature or fix per PR
- Include tests for new checks
- Keep zero external dependencies
