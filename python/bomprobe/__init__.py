"""bomprobe - SBOM quality auditor for CycloneDX and SPDX."""

__version__ = "1.0.0"

import json
import subprocess
import shutil
from pathlib import Path


def _find_bomprobe():
    npx = shutil.which("npx")
    if npx:
        return [npx, "bomprobe"]
    bomprobe = shutil.which("bomprobe")
    if bomprobe:
        return [bomprobe]
    raise FileNotFoundError(
        "bomprobe not found. Install with: npm install -g bomprobe"
    )


def audit(sbom_path, format="json", profile=None, threshold=None, config=None):
    """Run bomprobe audit on an SBOM file.

    Returns parsed JSON when format='json', raw string otherwise.
    """
    cmd = _find_bomprobe()
    cmd.append(str(sbom_path))
    cmd.extend(["--format", format])
    if profile:
        cmd.extend(["--profile", profile])
    if threshold is not None:
        cmd.extend(["--threshold", str(threshold)])
    if config:
        cmd.extend(["--config", str(config)])

    result = subprocess.run(cmd, capture_output=True, text=True, timeout=120)

    if format == "json":
        return json.loads(result.stdout)
    return result.stdout


def audit_dict(sbom_dict, **kwargs):
    """Audit an SBOM passed as a Python dict.

    Writes to a temp file, runs bomprobe, cleans up.
    """
    import tempfile

    with tempfile.NamedTemporaryFile(
        mode="w", suffix=".json", delete=False
    ) as f:
        json.dump(sbom_dict, f)
        tmp = Path(f.name)

    try:
        return audit(tmp, **kwargs)
    finally:
        tmp.unlink(missing_ok=True)


def checks():
    """List all available checks."""
    cmd = _find_bomprobe()
    cmd.append("--list-checks")
    result = subprocess.run(cmd, capture_output=True, text=True, timeout=30)
    return result.stdout
