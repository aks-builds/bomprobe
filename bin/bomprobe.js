#!/usr/bin/env node

const { audit } = require('../src');
const { getFormatter } = require('../src/formatters');
const textFormatter = require('../src/formatters/text');
const jsonFormatter = require('../src/formatters/json');
const markdownFormatter = require('../src/formatters/markdown');
const csvFormatter = require('../src/formatters/csv');
const summaryFormatter = require('../src/formatters/summary');
const sarifFormatter = require('../src/formatters/sarif');
const htmlFormatter = require('../src/formatters/html');

const args = process.argv.slice(2);

if (args.length === 0 || args.includes('--help') || args.includes('-h')) {
  console.log('Usage: bomprobe <file> [options]');
  console.log('');
  console.log('Options:');
  console.log('  --profile ntia   Check NTIA minimum elements compliance');
  console.log('  --json           Output as JSON');
  console.log('  --markdown       Output as Markdown');
  console.log('  --csv            Output as CSV');
  console.log('  --summary        Output compact one-line summary');
  console.log('  --sarif          Output as SARIF 2.1.0');
  console.log('  --html           Output as HTML report');
  console.log('  --format <name>  Output using named formatter');
  console.log('  --list-checks    List available checks');
  console.log('  --list-formats   List available output formats');
  console.log('  --list-profiles  List available compliance profiles');
  console.log('  --exclude <ids>  Skip checks by id (comma-separated)');
  console.log('  --only <ids>     Run only these checks (comma-separated)');
  console.log('  --min-score <n>  Exit with code 3 if score is below n');
  console.log('  --fail-on <sev>  Exit 2 on this severity or above (error|warning|info)');
  console.log('  --diff <file>    Compare against another SBOM');
  console.log('  --stats          Show component field coverage statistics');
  console.log('  --validate       Run structural validation before audit');
  console.log('  --output <file>  Write output to file instead of stdout');
  console.log('  --quiet, -q      Suppress output, exit code only');
  console.log('  --help, -h       Show this help');
  console.log('  --version, -v    Show version');
  process.exit(0);
}

if (args.includes('--version') || args.includes('-v')) {
  const pkg = require('../package.json');
  console.log(pkg.version);
  process.exit(0);
}

if (args.includes('--list-checks')) {
  const { getChecks } = require('../src/checks');
  const checks = getChecks();
  for (const c of checks) {
    console.log(`${c.id} (weight: ${c.weight}) - ${c.description}`);
  }
  process.exit(0);
}

if (args.includes('--list-formats')) {
  const { listFormatters } = require('../src/formatters');
  for (const name of listFormatters()) {
    console.log(name);
  }
  process.exit(0);
}

if (args.includes('--list-profiles')) {
  const { listProfiles } = require('../src/profiles');
  for (const name of listProfiles()) {
    console.log(name);
  }
  process.exit(0);
}

const file = args.find(a => !a.startsWith('-'));
if (!file) {
  console.error('Error: no file specified');
  process.exit(1);
}

const options = {};
const profileIdx = args.indexOf('--profile');
if (profileIdx !== -1 && args[profileIdx + 1]) {
  options.profile = args[profileIdx + 1];
}

const useJson = args.includes('--json');
const useMarkdown = args.includes('--markdown');
const useCsv = args.includes('--csv');
const useSummary = args.includes('--summary');
const useSarif = args.includes('--sarif');
const useHtml = args.includes('--html');
const formatIdx = args.indexOf('--format');
const formatName = formatIdx !== -1 ? args[formatIdx + 1] : null;

const excludeIdx = args.indexOf('--exclude');
if (excludeIdx !== -1 && args[excludeIdx + 1]) {
  options.exclude = args[excludeIdx + 1].split(',');
}

const onlyIdx = args.indexOf('--only');
if (onlyIdx !== -1 && args[onlyIdx + 1]) {
  options.only = args[onlyIdx + 1].split(',');
}

const diffIdx = args.indexOf('--diff');
if (diffIdx !== -1 && args[diffIdx + 1]) {
  const { compare } = require('../src/comparator');
  const diff = compare(file, args[diffIdx + 1]);
  if (diff.error) {
    console.error(`Error: ${diff.error}`);
    process.exit(1);
  }
  console.log(`Comparing: ${diff.fileA} vs ${diff.fileB}`);
  console.log(`Components: ${diff.componentCountA} -> ${diff.componentCountB}`);
  if (diff.added.length) console.log(`Added (${diff.added.length}): ${diff.added.join(', ')}`);
  if (diff.removed.length) console.log(`Removed (${diff.removed.length}): ${diff.removed.join(', ')}`);
  if (diff.versionChanges.length) {
    for (const vc of diff.versionChanges) {
      console.log(`Changed: ${vc.name} ${vc.from} -> ${vc.to}`);
    }
  }
  console.log(`Unchanged: ${diff.unchanged}`);
  process.exit(0);
}

if (args.includes('--validate')) {
  const { parse } = require('../src/parsers');
  const { validate } = require('../src/validator');
  const parsed = parse(file);
  if (parsed.error) {
    console.error(`Parse error: ${parsed.error}`);
    process.exit(1);
  }
  const validation = validate(parsed.sbom);
  if (!validation.valid) {
    console.error('Validation failed:');
    for (const e of validation.errors) console.error(`  - ${e}`);
    process.exit(4);
  }
}

const result = audit(file, options);

if (result.error) {
  console.error(`Error: ${result.error}`);
  process.exit(1);
}

let formatter = textFormatter;
if (useJson) formatter = jsonFormatter;
if (useMarkdown) formatter = markdownFormatter;
if (useCsv) formatter = csvFormatter;
if (useSummary) formatter = summaryFormatter;
if (useSarif) formatter = sarifFormatter;
if (useHtml) formatter = htmlFormatter;
if (formatName) {
  const named = getFormatter(formatName);
  if (!named) {
    console.error(`Error: unknown format "${formatName}"`);
    process.exit(1);
  }
  formatter = named;
}
if (args.includes('--stats')) {
  const { parse } = require('../src/parsers');
  const { componentStats } = require('../src/utils/stats');
  const parsed = parse(file);
  if (!parsed.error) {
    const stats = componentStats(parsed.sbom);
    console.log(`Components: ${stats.total}`);
    console.log(`License coverage: ${(stats.licenseCoverage * 100).toFixed(0)}%`);
    console.log(`PURL coverage: ${(stats.purlCoverage * 100).toFixed(0)}%`);
    console.log(`Hash coverage: ${(stats.hashCoverage * 100).toFixed(0)}%`);
    console.log(`Supplier coverage: ${(stats.supplierCoverage * 100).toFixed(0)}%`);
  }
}

const quiet = args.includes('--quiet') || args.includes('-q');
const outputIdx = args.indexOf('--output');
const outputFile = outputIdx !== -1 ? args[outputIdx + 1] : null;
const formatted = formatter.formatResult(result);

if (outputFile) {
  require('node:fs').writeFileSync(outputFile, formatted, 'utf8');
  if (!quiet) console.log(`Output written to ${outputFile}`);
} else if (!quiet) {
  console.log(formatted);
}

const failOnIdx = args.indexOf('--fail-on');
const failOn = failOnIdx !== -1 ? args[failOnIdx + 1] : 'error';
const severityRank = { info: 0, warning: 1, error: 2 };
const threshold = severityRank[failOn] !== undefined ? severityRank[failOn] : 2;

const hasFailure = result.checks.some(c =>
  c.findings.some(f => (severityRank[f.severity] || 0) >= threshold)
);
if (hasFailure) process.exit(2);

const minScoreIdx = args.indexOf('--min-score');
if (minScoreIdx !== -1 && args[minScoreIdx + 1]) {
  const threshold = parseFloat(args[minScoreIdx + 1]);
  if (result.score.overall < threshold) process.exit(3);
}
