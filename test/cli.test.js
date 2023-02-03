const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const { execFileSync } = require('node:child_process');
const path = require('node:path');

const cli = path.join(__dirname, '..', 'bin', 'bomprobe.js');
const fixtures = path.join(__dirname, 'fixtures');

function run(args) {
  return execFileSync('node', [cli, ...args], { encoding: 'utf8' });
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
});
