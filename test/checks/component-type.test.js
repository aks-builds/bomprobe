const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const check = require('../../src/checks/component-type');

describe('component-type check', () => {
  it('passes when components have types', () => {
    const sbom = { components: [{ name: 'a', type: 'library' }] };
    assert.equal(check.run(sbom).length, 0);
  });

  it('reports components missing types', () => {
    const sbom = { components: [{ name: 'a', type: null }] };
    const findings = check.run(sbom);
    assert.equal(findings.length, 1);
    assert.equal(findings[0].severity, 'info');
  });
});
