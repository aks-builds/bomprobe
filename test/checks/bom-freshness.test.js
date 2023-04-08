const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const check = require('../../src/checks/bom-freshness');

describe('bom-freshness check', () => {
  it('passes fresh SBOM', () => {
    const sbom = { metadata: { timestamp: new Date().toISOString() }, components: [] };
    assert.equal(check.run(sbom).length, 0);
  });

  it('warns on very old SBOM', () => {
    const old = new Date(Date.now() - 200 * 24 * 60 * 60 * 1000).toISOString();
    const sbom = { metadata: { timestamp: old }, components: [] };
    const findings = check.run(sbom);
    assert.ok(findings.some(f => f.severity === 'warning'));
  });

  it('info on moderately old SBOM', () => {
    const old = new Date(Date.now() - 100 * 24 * 60 * 60 * 1000).toISOString();
    const sbom = { metadata: { timestamp: old }, components: [] };
    const findings = check.run(sbom);
    assert.ok(findings.some(f => f.severity === 'info'));
  });

  it('warns on missing timestamp', () => {
    const sbom = { metadata: {}, components: [] };
    assert.equal(check.run(sbom).length, 1);
  });
});
