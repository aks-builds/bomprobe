# bomprobe

[![CI](https://github.com/aks-builds/bomprobe/actions/workflows/ci.yml/badge.svg)](https://github.com/aks-builds/bomprobe/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

SBOM quality auditor for CycloneDX and SPDX.

Parses your SBOM, runs quality checks against it, and scores it on a 0-10 scale. Checks for NTIA minimum elements, missing fields, dependency coverage, and more.

## Install

```
npm install -g bomprobe
```

Or run directly:

```
npx bomprobe sbom.json
```

## Usage

```
bomprobe <file>              Score an SBOM file
bomprobe <file> --profile ntia   Check NTIA compliance
bomprobe <file> --json           Output as JSON
bomprobe <file> --markdown       Output as Markdown
bomprobe <file> --csv            Output as CSV
bomprobe --list-checks           List all checks
```

## Supported formats

- CycloneDX (1.4, 1.5)
- SPDX (2.3)

## License

MIT
