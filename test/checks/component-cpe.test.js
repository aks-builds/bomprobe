const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const check = require('../../src/checks/component-cpe');

describe('component-cpe check', () => {
  it('passes when components have CPEs', () => {
    const sbom = { components: [{ name: 'a', cpe: 'cpe:2.3:a:vendor:a:1.0' }] };
    assert.equal(check.run(sbom).length, 0);
  });

  it('reports components missing CPEs', () => {
    const sbom = { components: [{ name: 'a', cpe: null }] };
    const findings = check.run(sbom);
    assert.equal(findings.length, 1);
    assert.equal(findings[0].severity, 'info');
    assert.match(findings[0].message, /no CPE/);
  });
});
