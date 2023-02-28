const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const check = require('../../src/checks/valid-purl');

describe('valid-purl check', () => {
  it('passes when purls are valid', () => {
    const sbom = { components: [{ name: 'a', purl: 'pkg:npm/a@1.0' }] };
    assert.equal(check.run(sbom).length, 0);
  });

  it('reports malformed purls', () => {
    const sbom = { components: [{ name: 'a', purl: 'https://not-a-purl' }] };
    const findings = check.run(sbom);
    assert.equal(findings.length, 1);
    assert.equal(findings[0].severity, 'warning');
    assert.ok(findings[0].message.includes('malformed'));
  });

  it('skips components without purls', () => {
    const sbom = { components: [{ name: 'a', purl: null }] };
    assert.equal(check.run(sbom).length, 0);
  });
});
