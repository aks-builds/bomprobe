# bomprobe (Python wrapper)

Python wrapper for [bomprobe](https://www.npmjs.com/package/bomprobe), the SBOM quality auditor.

Requires Node.js 18+ and bomprobe installed globally (`npm install -g bomprobe`).

## Install

```bash
pip install bomprobe
```

## CLI usage

```bash
bomprobe-py sbom.json
bomprobe-py sbom.json --format markdown --profile ntia
```

Or as a module:

```bash
python -m bomprobe sbom.json --format json
```

## Python API

```python
import bomprobe

# Audit a file
result = bomprobe.audit("sbom.json")
print(result["score"])

# Audit a dict
sbom = {"bomFormat": "CycloneDX", "components": [...]}
result = bomprobe.audit_dict(sbom, profile="ntia")

# List checks
print(bomprobe.checks())
```
