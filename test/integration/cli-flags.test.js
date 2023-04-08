const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const { execFileSync } = require('node:child_process');
const { join } = require('node:path');
const { writeFileSync, unlinkSync, mkdirSync } = require('node:fs');

const CLI = join(__dirname, '../../bin/bomprobe.js');
const TMP = join(__dirname, '../../test/fixtures/tmp-cli-test.json');

const minimalSbom = JSON.stringify({
  bomFormat: 'CycloneDX',
  specVersion: '1.4',
  metadata: { timestamp: new Date().toISOString() },
  components: [{ name: 'test', version: '1.0.0', type: 'library' }]
});

describe('CLI flag integration', () => {
  it('--format json produces valid JSON', () => {
    writeFileSync(TMP, minimalSbom);
    const out = execFileSync('node', [CLI, TMP, '--format', 'json'], { encoding: 'utf8' });
    const parsed = JSON.parse(out);
    assert.ok(parsed.score);
    unlinkSync(TMP);
  });

  it('--list-checks outputs check list', () => {
    const out = execFileSync('node', [CLI, '--list-checks'], { encoding: 'utf8' });
    assert.ok(out.includes('component-name'));
    assert.ok(out.includes('component-version'));
  });

  it('--no-color removes ANSI codes', () => {
    writeFileSync(TMP, minimalSbom);
    const out = execFileSync('node', [CLI, TMP, '--no-color'], { encoding: 'utf8' });
    assert.ok(!out.includes('\x1b['));
    unlinkSync(TMP);
  });

  it('exits 0 on clean SBOM with --fail-on none', () => {
    writeFileSync(TMP, minimalSbom);
    execFileSync('node', [CLI, TMP, '--fail-on', 'none'], { encoding: 'utf8' });
    unlinkSync(TMP);
  });
});
