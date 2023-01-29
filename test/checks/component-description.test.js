const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const check = require('../../src/checks/component-description');

describe('component-description check', () => {
  it('passes when all components have descriptions', () => {
    const sbom = { components: [{ name: 'a', description: 'a library' }] };
    assert.equal(check.run(sbom).length, 0);
  });

  it('reports components missing descriptions', () => {
    const sbom = { components: [{ name: 'a', description: null }] };
    const findings = check.run(sbom);
    assert.equal(findings.length, 1);
    assert.equal(findings[0].severity, 'info');
  });
});
