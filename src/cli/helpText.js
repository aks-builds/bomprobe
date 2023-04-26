const VERSION = require('../../package.json').version;

function getHelpText() {
  return `bomprobe v${VERSION} - SBOM quality auditor

Usage: bomprobe [options] <sbom-file>

Options:
  -f, --format <type>    Output format (text|json|markdown|csv|sarif|html|github|gitlab|junit)
  -p, --preset <name>    Use config preset (strict|moderate|minimal|ci|audit)
  -t, --threshold <n>    Minimum passing score (0-100)
  --fail-on <level>      Exit non-zero on severity (error|warning|any|none)
  --compliance <name>    Check compliance profile (ntia|eu-cra|bsi-tr)
  --exclude <ids>        Comma-separated check IDs to skip
  --only <ids>           Comma-separated check IDs to run
  --watch                Watch file for changes
  --diff <file>          Compare against another SBOM
  --stats                Show SBOM statistics
  --list-checks          List all available checks
  --list-presets         List all config presets
  --no-color             Disable colored output
  -o, --output <file>    Write output to file
  -q, --quiet            Only show errors
  -v, --verbose          Show all check details
  --version              Show version
  -h, --help             Show this help

Examples:
  bomprobe sbom.json
  bomprobe -f sarif -o report.sarif sbom.json
  bomprobe --preset strict --compliance ntia bom.json
  bomprobe --diff old-bom.json new-bom.json`;
}

function getVersionText() {
  return `bomprobe v${VERSION}`;
}

module.exports = { getHelpText, getVersionText };
