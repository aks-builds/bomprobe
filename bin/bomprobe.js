#!/usr/bin/env node

const { audit } = require('../src');
const { getFormatter } = require('../src/formatters');
const textFormatter = require('../src/formatters/text');
const jsonFormatter = require('../src/formatters/json');
const markdownFormatter = require('../src/formatters/markdown');
const csvFormatter = require('../src/formatters/csv');

const args = process.argv.slice(2);

if (args.length === 0 || args.includes('--help') || args.includes('-h')) {
  console.log('Usage: bomprobe <file> [options]');
  console.log('');
  console.log('Options:');
  console.log('  --profile ntia   Check NTIA minimum elements compliance');
  console.log('  --json           Output as JSON');
  console.log('  --markdown       Output as Markdown');
  console.log('  --csv            Output as CSV');
  console.log('  --format <name>  Output using named formatter');
  console.log('  --list-checks    List available checks');
  console.log('  --list-formats   List available output formats');
  console.log('  --exclude <ids>  Skip checks by id (comma-separated)');
  console.log('  --min-score <n>  Exit with code 3 if score is below n');
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
const formatIdx = args.indexOf('--format');
const formatName = formatIdx !== -1 ? args[formatIdx + 1] : null;

const excludeIdx = args.indexOf('--exclude');
if (excludeIdx !== -1 && args[excludeIdx + 1]) {
  options.exclude = args[excludeIdx + 1].split(',');
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
if (formatName) {
  const named = getFormatter(formatName);
  if (!named) {
    console.error(`Error: unknown format "${formatName}"`);
    process.exit(1);
  }
  formatter = named;
}
console.log(formatter.formatResult(result));

const hasErrors = result.checks.some(c =>
  c.findings.some(f => f.severity === 'error')
);
if (hasErrors) process.exit(2);

const minScoreIdx = args.indexOf('--min-score');
if (minScoreIdx !== -1 && args[minScoreIdx + 1]) {
  const threshold = parseFloat(args[minScoreIdx + 1]);
  if (result.score.overall < threshold) process.exit(3);
}
