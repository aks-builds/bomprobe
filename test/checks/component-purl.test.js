const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const check = require('../../src/checks/component-purl');

describe('component-purl check', () => {
  it('passes when all components have purls', () => {
    const sbom = { components: [{ name: 'a', purl: 'pkg:npm/a@1.0' }] };
    assert.equal(check.run(sbom).length, 0);
  });

  it('reports components missing purls', () => {
    const sbom = { components: [{ name: 'a', purl: null }] };
    const findings = check.run(sbom);
    assert.equal(findings.length, 1);
    assert.match(findings[0].message, /no purl/);
  });
});
