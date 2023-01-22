const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const check = require('../../src/checks/component-supplier');

describe('component-supplier check', () => {
  it('passes when all components have suppliers', () => {
    const sbom = { components: [{ name: 'a', supplier: 'acme' }] };
    assert.equal(check.run(sbom).length, 0);
  });

  it('reports components missing suppliers', () => {
    const sbom = { components: [{ name: 'a', supplier: null }] };
    const findings = check.run(sbom);
    assert.equal(findings.length, 1);
    assert.match(findings[0].message, /no supplier/);
  });
});
