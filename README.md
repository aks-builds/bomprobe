# bomprobe

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
```

## Supported formats

- CycloneDX (1.4, 1.5)
- SPDX (2.3)

## License

MIT
