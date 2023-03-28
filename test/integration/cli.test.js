const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const { execFileSync } = require('node:child_process');
const path = require('node:path');

const cli = path.join(__dirname, '..', '..', 'bin', 'bomprobe.js');
const fixtures = path.join(__dirname, '..', 'fixtures');

function run(args) {
  return execFileSync('node', [cli, ...args], { encoding: 'utf8', timeout: 10000 });
}

describe('CLI integration', () => {
  it('shows help with --help', () => {
    const output = run(['--help']);
    assert.ok(output.includes('Usage:'));
  });

  it('shows version with --version', () => {
    const output = run(['--version']);
    assert.match(output.trim(), /^\d+\.\d+\.\d+$/);
  });

  it('audits a CycloneDX file', () => {
    const output = run([path.join(fixtures, 'minimal-cdx.json')]);
    assert.ok(output.includes('Score:'));
  });

  it('audits an SPDX file', () => {
    const output = run([path.join(fixtures, 'minimal-spdx.json')]);
    assert.ok(output.includes('Score:'));
  });

  it('outputs JSON with --json', () => {
    const output = run([path.join(fixtures, 'minimal-cdx.json'), '--json']);
    const parsed = JSON.parse(output);
    assert.ok(parsed.score);
  });

  it('lists checks with --list-checks', () => {
    const output = run(['--list-checks']);
    assert.ok(output.includes('component-name'));
  });

  it('lists formats with --list-formats', () => {
    const output = run(['--list-formats']);
    assert.ok(output.includes('json'));
    assert.ok(output.includes('sarif'));
  });

  it('lists profiles with --list-profiles', () => {
    const output = run(['--list-profiles']);
    assert.ok(output.includes('ntia'));
    assert.ok(output.includes('bsi'));
  });

  it('shows fingerprint with --fingerprint', () => {
    const output = run([path.join(fixtures, 'minimal-cdx.json'), '--fingerprint']);
    assert.equal(output.trim().length, 64);
  });

  it('shows summary with --summary', () => {
    const output = run([path.join(fixtures, 'minimal-cdx.json'), '--summary']);
    assert.ok(output.includes('score='));
  });
});
