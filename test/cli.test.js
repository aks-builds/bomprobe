const { describe, it, after } = require('node:test');
const assert = require('node:assert/strict');
const { execFileSync } = require('node:child_process');
const path = require('node:path');
const fs = require('node:fs');
const os = require('node:os');

const cli = path.join(__dirname, '..', 'bin', 'bomprobe.js');
const fixtures = path.join(__dirname, 'fixtures');
const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'bomprobe-cli-test-'));

after(() => {
  try {
    fs.rmSync(tmpDir, { recursive: true, force: true });
  } catch {}
});

function run(args) {
  return execFileSync('node', [cli, ...args], { encoding: 'utf8' });
}

function runCli(args) {
  try {
    return {
      status: 0,
      stdout: execFileSync('node', [cli, ...args], { encoding: 'utf8', stdio: ['pipe', 'pipe', 'pipe'] }),
      stderr: ''
    };
  } catch (err) {
    return {
      status: err.status,
      stdout: err.stdout ? err.stdout.toString() : '',
      stderr: err.stderr ? err.stderr.toString() : ''
    };
  }
}

describe('CLI', () => {
  it('shows help with --help', () => {
    const output = run(['--help']);
    assert.ok(output.includes('Usage:'));
    assert.ok(output.includes('--profile'));
  });

  it('shows version with --version', () => {
    const output = run(['--version']);
    assert.match(output.trim(), /^\d+\.\d+\.\d+$/);
  });

  it('lists checks with --list-checks', () => {
    const output = run(['--list-checks']);
    assert.ok(output.includes('component-name'));
    assert.ok(output.includes('component-version'));
  });

  it('audits a CycloneDX file', () => {
    const output = run([path.join(fixtures, 'minimal-cdx.json')]);
    assert.ok(output.includes('bomprobe:'));
    assert.ok(output.includes('Score:'));
  });

  it('outputs JSON with --json', () => {
    const output = run([path.join(fixtures, 'minimal-cdx.json'), '--json']);
    const parsed = JSON.parse(output);
    assert.ok(parsed.score);
    assert.ok(parsed.checks);
  });

  it('outputs markdown with --markdown', () => {
    const output = run([path.join(fixtures, 'minimal-cdx.json'), '--markdown']);
    assert.ok(output.startsWith('# bomprobe report'));
  });

  it('outputs CSV with --csv', () => {
    const output = run([path.join(fixtures, 'minimal-cdx.json'), '--csv']);
    assert.ok(output.startsWith('severity,check,component,message'));
  });

  it('shows NTIA compliance with --profile ntia', () => {
    const output = run([path.join(fixtures, 'minimal-cdx.json'), '--profile', 'ntia']);
    assert.ok(output.includes('NTIA Compliance:'));
  });

  it('exits with error for missing file', () => {
    assert.throws(() => run(['/no/such/file.json']), { status: 1 });
  });

  it('exits with error for empty file', () => {
    const emptyFile = path.join(tmpDir, 'empty.json');
    fs.writeFileSync(emptyFile, '');
    const res = runCli([emptyFile]);
    assert.equal(res.status, 1);
    assert.ok(res.stderr.includes('Input file is empty: contains no data'));
  });

  it('exits with error for valid JSON non-SBOM file', () => {
    const res = runCli([path.join(fixtures, '..', '..', 'package.json')]);
    assert.equal(res.status, 1);
    assert.ok(res.stderr.includes('Valid JSON file does not contain a recognized SBOM format'));
  });

  it('exits with error for unsupported SPDX XML file', () => {
    const spdxXml = path.join(tmpDir, 'spdx.xml');
    fs.writeFileSync(
      spdxXml,
      '<?xml version="1.0" encoding="UTF-8"?><spdx:SpdxDocument xmlns:spdx="http://spdx.org/rdf/terms#"></spdx:SpdxDocument>'
    );
    const res = runCli([spdxXml]);
    assert.equal(res.status, 1);
    assert.ok(res.stderr.includes('SPDX XML format is not currently supported'));
  });

  it('exits with error for incomplete or truncated JSON', () => {
    const trunc = path.join(tmpDir, 'truncated.json');
    fs.writeFileSync(trunc, '{"bomFormat": "CycloneDX", "specVersion": "1.5"');
    const res = runCli([trunc]);
    assert.equal(res.status, 1);
    assert.ok(res.stderr.includes('JSON file is incomplete or incorrectly formatted'));
  });
});
