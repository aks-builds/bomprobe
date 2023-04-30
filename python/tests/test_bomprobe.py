"""Tests for the bomprobe Python wrapper."""

import json
import tempfile
from pathlib import Path
from unittest.mock import patch, MagicMock
import bomprobe


def test_version():
    assert bomprobe.__version__ == "1.0.0"


def test_find_bomprobe_with_npx():
    with patch("shutil.which") as mock_which:
        mock_which.side_effect = lambda x: "/usr/bin/npx" if x == "npx" else None
        result = bomprobe._find_bomprobe()
        assert result == ["/usr/bin/npx", "bomprobe"]


def test_find_bomprobe_with_global():
    with patch("shutil.which") as mock_which:
        mock_which.side_effect = lambda x: "/usr/bin/bomprobe" if x == "bomprobe" else None
        result = bomprobe._find_bomprobe()
        assert result == ["/usr/bin/bomprobe"]


def test_find_bomprobe_not_found():
    with patch("shutil.which", return_value=None):
        try:
            bomprobe._find_bomprobe()
            assert False, "Should have raised"
        except FileNotFoundError as e:
            assert "npm install" in str(e)


def test_audit_builds_command():
    with patch("subprocess.run") as mock_run, \
         patch.object(bomprobe, "_find_bomprobe", return_value=["bomprobe"]):
        mock_run.return_value = MagicMock(stdout='{"score": 85}', returncode=0)
        result = bomprobe.audit("test.json", format="json", profile="ntia", threshold=70)
        cmd = mock_run.call_args[0][0]
        assert "test.json" in cmd
        assert "--format" in cmd
        assert "json" in cmd
        assert "--profile" in cmd
        assert "ntia" in cmd
        assert "--threshold" in cmd
        assert "70" in cmd
        assert result == {"score": 85}


def test_audit_text_format():
    with patch("subprocess.run") as mock_run, \
         patch.object(bomprobe, "_find_bomprobe", return_value=["bomprobe"]):
        mock_run.return_value = MagicMock(stdout="Score: 85/100", returncode=0)
        result = bomprobe.audit("test.json", format="text")
        assert result == "Score: 85/100"


def test_audit_dict():
    with patch("subprocess.run") as mock_run, \
         patch.object(bomprobe, "_find_bomprobe", return_value=["bomprobe"]):
        mock_run.return_value = MagicMock(stdout='{"score": 90}', returncode=0)
        sbom = {"bomFormat": "CycloneDX", "components": []}
        result = bomprobe.audit_dict(sbom, format="json")
        assert result == {"score": 90}
