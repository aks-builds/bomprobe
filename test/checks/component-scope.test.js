const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const check = require('../../src/checks/component-scope');

describe('component-scope check', () => {
  it('passes when components have scope', () => {
    const sbom = { components: [{ name: 'a', scope: 'required' }] };
    assert.equal(check.run(sbom).length, 0);
  });

  it('reports components missing scope', () => {
    const sbom = { components: [{ name: 'a', scope: null }] };
    const findings = check.run(sbom);
    assert.equal(findings.length, 1);
    assert.equal(findings[0].severity, 'info');
  });
});
